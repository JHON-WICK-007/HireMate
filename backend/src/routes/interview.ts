import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";
import Interview, { IInterview, IQuestionLog } from "../models/Interview";
import User from "../models/User";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// Retry helper — retries on 503/UNAVAILABLE with exponential backoff
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelayMs = 2000): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err.message || "";
      const isRetryable = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("overloaded") || msg.includes("RESOURCE_EXHAUSTED");
      if (isRetryable && attempt < maxRetries) {
        const delay = baseDelayMs * (attempt + 1); // 2s, 4s, 6s
        console.log(`Gemini API busy (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

// @route   POST /api/interviews/start
// @desc    Initialize a mock interview session and generate the first question
// @access  Protected
// @route   GET /api/interviews/check-session-name
// @desc    Check if a session name already exists for the current user
// @access  Protected
router.get("/check-session-name", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (req.query.name as string || "").trim();
    if (!name) {
      res.status(200).json({ success: true, exists: false });
      return;
    }
    const norm = name.toLowerCase();
    const existing = await Interview.findOne({
      user: req.user?._id,
      sessionNameNorm: norm,
    });
    res.status(200).json({ success: true, exists: !!existing });
  } catch (error: any) {
    console.error("Check session name error:", error);
    res.status(500).json({ success: false, message: "Failed to check session name." });
  }
});

router.post("/start", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, role, level, questionTypes, totalQuestions, sessionName } = req.body;

    if (!company || !role || !level) {
      res.status(400).json({ success: false, message: "Please provide company, role, and experience level." });
      return;
    }

    // Enforce unique session name per user
    const trimmedName = (sessionName || "").trim();
    if (trimmedName) {
      const norm = trimmedName.toLowerCase();
      const duplicate = await Interview.findOne({
        user: req.user?._id,
        sessionNameNorm: norm,
      });
      if (duplicate) {
        res.status(409).json({
          success: false,
          message: `A session named "${trimmedName}" already exists. Please choose a different name.`,
        });
        return;
      }
    }

    const qTypes = questionTypes && questionTypes.length > 0 ? questionTypes : ["Technical", "Behavioral"];
    const qCount = totalQuestions || 5;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ success: false, message: "AI configuration key is missing on the server." });
      return;
    }

    // Call Gemini to generate the first question
    const prompt = `You are a world-class senior recruiter and elite technical interviewer. You are conducting a mock interview session for this target role:
- Company: ${company}
- Role: ${role}
- Experience Level: ${level}
- Target Question Categories: ${qTypes.join(", ")}

Your task is to generate the first question of this mock interview. 

GUIDELINES FOR HIGH-QUALITY QUESTIONS:
1. Category Match: The question must strictly belong to one of the target categories: ${qTypes.join(", ")}.
2. Level Alignment: 
   - Junior: Focus on practical coding fundamentals, core tools/frameworks, basic error handling, and collaboration basics.
   - Mid-Level: Focus on feature design, API structuring, optimization, unit testing, and architectural patterns.
   - Senior / Staff+: Focus on scale, high-throughput system architecture, complex trade-offs, security, cloud deployment strategies, mentoring, and leading technical initiatives.
3. Realistic Context: Customize the question style to match the standard interviewing style of ${company}. If it is a tech giant or high-growth startup, ask questions with real technical depth (e.g., system design scenarios, concurrency, performance profiling) rather than trivial syntax questions.

Respond ONLY with a valid JSON object matching this schema:
{
  "questionText": "string",
  "type": "string" (must be one of: Technical, Behavioral, HR, System design)
}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      })
    );

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    if (!parsedData.questionText || !parsedData.type) {
      throw new Error("Invalid response schema from Gemini");
    }

    const firstQuestion: IQuestionLog = {
      questionText: parsedData.questionText,
      type: parsedData.type,
    };

    // Save Interview session
    const finalName = sessionName?.trim() || `${role} Session`;
    const interview = new Interview({
      user: req.user?._id,
      company,
      role,
      level,
      questionTypes: qTypes,
      questions: [firstQuestion],
      currentQuestionIndex: 0,
      totalQuestions: qCount,
      status: "in-progress",
      sessionName: finalName,
      sessionNameNorm: finalName.toLowerCase(),
    });

    await interview.save();

    res.status(200).json({
      success: true,
      interviewId: interview._id,
      firstQuestion,
      totalQuestions: qCount,
    });
  } catch (error: any) {
    console.error("Start interview error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to start interview session." });
  }
});

// @route   POST /api/interviews/:id/submit
// @desc    Submit candidate answer, get evaluation, and get next question or overall metrics
// @access  Protected
router.post("/:id/submit", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer || answer.trim().length === 0) {
      res.status(400).json({ success: false, message: "Please provide an answer." });
      return;
    }

    const interview = await Interview.findById(id);
    if (!interview) {
      res.status(404).json({ success: false, message: "Interview session not found." });
      return;
    }

    if (interview.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    if (interview.status === "completed") {
      res.status(400).json({ success: false, message: "This interview has already been completed." });
      return;
    }

    const currentIdx = interview.currentQuestionIndex;
    const totalQuestions = interview.totalQuestions;
    const currentQuestion = interview.questions[currentIdx];

    if (!currentQuestion) {
      res.status(500).json({ success: false, message: "Current question index is out of bounds." });
      return;
    }

    // Save answer temporarily on document to pass to AI
    currentQuestion.userAnswer = answer;

    // Format previous QA history for context
    const formattedHistory = interview.questions
      .map((q, idx) => {
        return `Question ${idx + 1} [Type: ${q.type}]: ${q.questionText}
Candidate Answer: ${q.userAnswer || "No answer provided"}
Evaluation Score: ${q.score !== undefined ? q.score : "Pending"}
Evaluation Feedback: ${q.feedback || "Pending"}`;
      })
      .join("\n\n");

    const prompt = `You are a world-class technical interviewer and hiring manager conducting a mock interview for the following position:
- Company: ${interview.company}
- Role: ${interview.role}
- Experience Level: ${interview.level}

Here is the conversation history including all questions, candidate answers, and evaluations so far:
---
${formattedHistory}
---

We are currently evaluating the candidate's latest response to the current question (Question ${currentIdx + 1} of ${totalQuestions}):
- Question: ${currentQuestion.questionText}
- Candidate Answer: ${answer}

Your tasks:
1. Evaluate the candidate's answer to this specific question:
   - Assign an integer score (0 to 100). Be rigorous, fair, and realistic (do not hand out 90+ scores for basic or generic answers).
   - Write constructive, professional feedback (under 3 sentences) detailing strengths and specific areas of improvement based on their experience level.
   - Provide a clear example of what a top-tier ("strong") answer looks like (using the STAR method for behavioral, or specific design patterns/engineering choices for technical questions) in 1-2 sentences.
   - Define an array of 2-4 key professional competencies tested by this question.
2. Determine if the interview has reached the last question (${currentIdx + 1} == ${totalQuestions}).
3. If NOT finished (isEnded = false):
   - Generate the next question. It MUST match one of the requested categories: ${interview.questionTypes.join(", ")}.
   - Keep the flow natural and progressive. Adapt the next question's depth directly to the candidate's experience level (${interview.level}).
4. If FINISHED (isEnded = true):
   - Calculate the final overall score (0 to 100) and the final sub-metrics (each 0 to 100):
     - technicalAccuracy: how technically sound and accurate their technical statements were.
     - communication: structured articulation, clarity, and conciseness.
     - problemSolving: structured approach, handling of edge cases, and reasoning.

Respond ONLY with a valid JSON object matching this exact schema:

If isEnded is false:
{
  "evaluation": {
    "score": number,
    "feedback": "string",
    "strongAnswer": "string",
    "competencies": ["string"]
  },
  "isEnded": false,
  "nextQuestion": {
    "questionText": "string",
    "type": "string"
  }
}

If isEnded is true:
{
  "evaluation": {
    "score": number,
    "feedback": "string",
    "strongAnswer": "string",
    "competencies": ["string"]
  },
  "isEnded": true,
  "overallEvaluation": {
    "overallScore": number,
    "metrics": {
      "technicalAccuracy": number,
      "communication": number,
      "problemSolving": number
    }
  }
}`;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ success: false, message: "AI configuration key is missing on the server." });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      })
    );

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    // Save evaluation of current answer
    currentQuestion.score = parsedData.evaluation.score;
    currentQuestion.feedback = parsedData.evaluation.feedback;
    currentQuestion.strongAnswer = parsedData.evaluation.strongAnswer;
    currentQuestion.competencies = parsedData.evaluation.competencies;

    if (parsedData.isEnded) {
      // Complete interview
      interview.status = "completed";
      interview.overallScore = parsedData.overallEvaluation.overallScore;
      interview.metrics = parsedData.overallEvaluation.metrics;
      await interview.save();

      // Push to user's interview history
      await User.findByIdAndUpdate(req.user?._id, {
        $push: { interviewHistory: interview._id },
      });

      res.status(200).json({
        success: true,
        evaluation: parsedData.evaluation,
        isEnded: true,
        overallScore: interview.overallScore,
        metrics: interview.metrics,
        questions: interview.questions,
      });
    } else {
      // Append next question
      const nextQ: IQuestionLog = {
        questionText: parsedData.nextQuestion.questionText,
        type: parsedData.nextQuestion.type,
      };

      interview.questions.push(nextQ);
      interview.currentQuestionIndex = currentIdx + 1;
      await interview.save();

      res.status(200).json({
        success: true,
        evaluation: parsedData.evaluation,
        isEnded: false,
        nextQuestion: nextQ,
        currentQuestionIndex: interview.currentQuestionIndex,
      });
    }
  } catch (error: any) {
    console.error("Submit answer error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to process answer." });
  }
});

// @route   POST /api/interviews/:id/end
// @desc    End interview session early — finalize scores from answered questions
// @access  Protected
router.post("/:id/end", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({ success: false, message: "Interview session not found." });
      return;
    }

    if (interview.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    if (interview.status === "completed") {
      res.status(400).json({ success: false, message: "This interview has already been completed." });
      return;
    }

    // Collect only answered questions (those with a userAnswer and score)
    const answeredQuestions = interview.questions.filter(q => q.userAnswer && q.score !== undefined);

    if (answeredQuestions.length === 0) {
      // No answers submitted — just mark completed with zero scores
      interview.status = "completed";
      interview.overallScore = 0;
      interview.metrics = { technicalAccuracy: 0, communication: 0, problemSolving: 0 };
      // Remove unanswered questions to keep data clean
      interview.questions = interview.questions.filter(q => q.userAnswer);
      interview.totalQuestions = interview.questions.length;
      await interview.save();

      await User.findByIdAndUpdate(req.user?._id, {
        $push: { interviewHistory: interview._id },
      });

      res.status(200).json({
        success: true,
        message: "Interview ended early with no answered questions.",
        interviewId: interview._id,
      });
      return;
    }

    // Try Gemini scoring, fall back to local average if it fails
    let overallScore = 0;
    let metrics = { technicalAccuracy: 0, communication: 0, problemSolving: 0 };

    try {
      const formattedHistory = answeredQuestions
        .map((q, idx) => {
          return `Question ${idx + 1} [Type: ${q.type}]: ${q.questionText}
Candidate Answer: ${q.userAnswer}
Score: ${q.score}/100
Feedback: ${q.feedback || "N/A"}`;
        })
        .join("\n\n");

      const prompt = `You are an expert recruiter evaluating a mock interview that was ended early.

Company: ${interview.company}
Role: ${interview.role}
Experience Level: ${interview.level}
Questions Answered: ${answeredQuestions.length} out of ${interview.totalQuestions} planned

Here is the conversation history:
${formattedHistory}

Based on the questions answered so far, calculate the final overall score (0 to 100) and the final sub-metrics (each 0 to 100):
- technicalAccuracy
- communication
- problemSolving

Respond ONLY with a valid JSON object:
{
  "overallScore": number,
  "metrics": {
    "technicalAccuracy": number,
    "communication": number,
    "problemSolving": number
  }
}`;

      if (process.env.GEMINI_API_KEY) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await callWithRetry(() =>
          ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          })
        );

        const resultText = response.text || "{}";
        const parsedData = JSON.parse(resultText);
        overallScore = parsedData.overallScore ?? 0;
        metrics = parsedData.metrics ?? metrics;
      }
    } catch (geminiErr: any) {
      console.error("Gemini scoring failed, using local fallback:", geminiErr.message);
      // Local fallback: average the answered question scores
      const avgScore = Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length);
      overallScore = avgScore;
      metrics = { technicalAccuracy: avgScore, communication: avgScore, problemSolving: avgScore };
    }

    // Finalize the interview
    interview.status = "completed";
    interview.overallScore = overallScore;
    interview.metrics = metrics;
    // Remove unanswered questions and update total count
    interview.questions = interview.questions.filter(q => q.userAnswer);
    interview.totalQuestions = interview.questions.length;
    await interview.save();

    // Push to user's interview history
    await User.findByIdAndUpdate(req.user?._id, {
      $push: { interviewHistory: interview._id },
    });

    res.status(200).json({
      success: true,
      message: "Interview ended successfully.",
      interviewId: interview._id,
      overallScore: interview.overallScore,
      metrics: interview.metrics,
    });
  } catch (error: any) {
    console.error("End interview error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to end interview session." });
  }
});

// @route   GET /api/interviews/:id
// @desc    Retrieve interview session details
// @access  Protected
router.get("/:id", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({ success: false, message: "Interview session not found." });
      return;
    }

    if (interview.user.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: "Access denied." });
      return;
    }

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error: any) {
    console.error("Get interview error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve interview details." });
  }
});

export default router;
