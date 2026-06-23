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
router.post("/start", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, role, level, questionTypes, totalQuestions } = req.body;

    if (!company || !role || !level) {
      res.status(400).json({ success: false, message: "Please provide company, role, and experience level." });
      return;
    }

    const qTypes = questionTypes && questionTypes.length > 0 ? questionTypes : ["Technical", "Behavioral"];
    const qCount = totalQuestions || 5;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ success: false, message: "AI configuration key is missing on the server." });
      return;
    }

    // Call Gemini to generate the first question
    const prompt = `You are an expert recruiter and technical interviewer. You are conducting a mock interview for the following position:
Company: ${company}
Role: ${role}
Experience Level: ${level}
Requested Question Types: ${qTypes.join(", ")}

Please generate the first question of this mock interview. It MUST match one of the requested question types.
Respond ONLY with a valid JSON object matching this exact schema:
{
  "questionText": "string",
  "type": "string" (must be one of: Technical, Behavioral, HR, System design)
}
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
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

    const prompt = `You are an expert recruiter and technical interviewer conducting a mock interview for the following position:
Company: ${interview.company}
Role: ${interview.role}
Experience Level: ${interview.level}

Here is the conversation history including all questions, candidate answers, and evaluations so far:
${formattedHistory}

We are currently evaluating the candidate's latest response to the current question (Question ${currentIdx + 1} of ${totalQuestions}):
Question: ${currentQuestion.questionText}
Candidate Answer: ${answer}

Your tasks:
1. Evaluate the candidate's answer to this specific question. Assign an integer score between 0 and 100 based on accuracy, depth, and clarity, and write short constructive feedback (under 3 sentences).
2. Determine if the interview has reached the last question (${currentIdx + 1} == ${totalQuestions}).
3. If NOT finished (isEnded = false), generate the next question. It MUST match one of the requested question types: ${interview.questionTypes.join(", ")}. Vary the question type from the current question if possible.
4. If FINISHED (isEnded = true), calculate the final overall score (0 to 100) and the final sub-metrics (each 0 to 100):
   - technicalAccuracy
   - communication
   - problemSolving

Respond ONLY with a valid JSON object matching this exact schema:

If isEnded is false:
{
  "evaluation": {
    "score": number,
    "feedback": "string"
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
    "feedback": "string"
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
}
`;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ success: false, message: "AI configuration key is missing on the server." });
      return;
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
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
