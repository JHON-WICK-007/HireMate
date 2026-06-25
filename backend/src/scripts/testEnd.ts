import dotenv from "dotenv";
import mongoose from "mongoose";
import Interview from "../models/Interview";
import User from "../models/User";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Retry helper
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelayMs = 2000): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const msg = err.message || "";
      const isRetryable = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("overloaded") || msg.includes("RESOURCE_EXHAUSTED");
      if (isRetryable && attempt < maxRetries) {
        const delay = baseDelayMs * (attempt + 1);
        console.log(`Gemini API busy (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

async function test() {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error("MONGO_URI not defined");

    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    // Find any interview session
    const interview = await Interview.findOne();
    if (!interview) {
      console.log("No interview found. Please start an interview session in the app first.");
      await mongoose.disconnect();
      return;
    }

    console.log(`Found interview: ${interview._id}, Status: ${interview.status}, Questions count: ${interview.questions.length}`);

    // Collect answered questions
    const answeredQuestions = interview.questions.filter(q => q.userAnswer && q.score !== undefined);
    console.log(`Answered questions count: ${answeredQuestions.length}`);

    let overallScore = 0;
    let metrics = { technicalAccuracy: 0, communication: 0, problemSolving: 0 };

    if (answeredQuestions.length === 0) {
      console.log("Simulating: answeredQuestions.length === 0");
      
      // Let's copy the code from route:
      const tempQuestions = interview.questions.filter(q => q.userAnswer);
      console.log("Filtered questions array:", tempQuestions);
      
      interview.status = "completed";
      interview.overallScore = 0;
      interview.metrics = { technicalAccuracy: 0, communication: 0, problemSolving: 0 };
      interview.questions = tempQuestions as any;
      interview.totalQuestions = tempQuestions.length;
      
      console.log("Saving interview...");
      await interview.save();
      console.log("✅ Interview saved successfully!");
    } else {
      console.log("Simulating: answeredQuestions.length > 0");
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
          console.log("Calling Gemini API...");
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
          console.log("Gemini API Response:", resultText);
          const parsedData = JSON.parse(resultText);
          overallScore = parsedData.overallScore ?? 0;
          metrics = parsedData.metrics ?? metrics;
        } else {
          console.log("No GEMINI_API_KEY found, using local fallback");
          throw new Error("No GEMINI_API_KEY");
        }
      } catch (geminiErr: any) {
        console.error("Gemini scoring failed, using local fallback:", geminiErr.message);
        const avgScore = Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length);
        overallScore = avgScore;
        metrics = { technicalAccuracy: avgScore, communication: avgScore, problemSolving: avgScore };
      }

      console.log("Finalizing interview with score:", overallScore, "metrics:", metrics);
      
      interview.status = "completed";
      interview.overallScore = overallScore;
      interview.metrics = metrics;
      interview.questions = interview.questions.filter(q => q.userAnswer) as any;
      interview.totalQuestions = interview.questions.length;
      
      console.log("Saving interview...");
      await interview.save();
      console.log("✅ Interview saved successfully!");
    }

    // Try pushing to user history
    console.log("Updating user...");
    const user = await User.findByIdAndUpdate(interview.user, {
      $push: { interviewHistory: interview._id },
    }, { new: true });
    
    if (user) {
      console.log("✅ User updated successfully, history length:", user.interviewHistory.length);
    } else {
      console.log("❌ User not found for interview:", interview.user);
    }

    await mongoose.disconnect();
    console.log("Done!");
  } catch (err: any) {
    console.error("❌ Error running test:", err);
    await mongoose.disconnect();
  }
}

test();
