import express, { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/auth";


const router = express.Router();

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

router.post("/summary", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { action, currentText, context } = req.body;

    if (typeof currentText !== "string") {
      res.status(400).json({ success: false, message: "Summary text must be a string." });
      return;
    }

    if (context !== undefined && (typeof context !== "object" || context === null)) {
      res.status(400).json({ success: false, message: "Context must be an object." });
      return;
    }

    const trimmedText = currentText.trim();
    if (trimmedText.length === 0) {
      res.status(400).json({ success: false, message: "No summary text provided." });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ success: false, message: "Server AI configuration error." });
      return;
    }

    const role = typeof context?.role === "string" ? context.role.trim() : "professional";
    const skills = context && Array.isArray(context.skills) && context.skills.length > 0
      ? context.skills.slice(0, 5).filter((s: any) => typeof s === "string" || typeof s === "number").map((s: any) => String(s).trim()).join(", ")
      : "";
    const experienceCount = typeof context?.experienceCount === "number" ? context.experienceCount : 0;

    const prompt = `You are an elite, modern resume writer and ATS optimization specialist.
The user has written the following input for their professional summary:
---
${trimmedText}
---
${role ? `Context - Most recent role: ${role}.` : ""}
${skills ? `Context - Key skills: ${skills}.` : ""}
${experienceCount ? `Context - Years of experience: ${experienceCount}.` : ""}

CRITICAL BEHAVIOR:
1. If the user's input lacks any professional substance (e.g., it is just a greeting like "hii gemini", "hello", "test", or a single irrelevant word), do NOT fabricate achievements. Instead, respond EXACTLY with this friendly instruction:
"Write a brief description of your experience, key achievements, or career goals, and I will enhance it into a professional, ATS-optimized summary."
2. If the input has professional substance, enhance it to be highly professional and ATS-optimized.
3. Keep the user's original meaning, skills, and context. Do NOT fabricate fake metrics, companies, or credentials.
4. Tone & Style:
   - Modern, confident, and direct. Start directly with the role/identity (e.g. "Software Engineer with..." or "Creative Designer specialized in..."). Do NOT start with "I am" or "A highly...".
   - ABSOLUTELY AVOID generic corporate clichés and buzzwords: "Results-driven", "Highly accomplished", "Dynamic professional", "Proven track record", "Passionate about", "Motivated", "Detail-oriented", "Team player".
   - Use active voice and strong action verbs (e.g., "Architects", "Engineers", "Spearheads", "Streamlines").
   - Max 3-4 sentences and strictly under 500 characters.

Respond ONLY with either the enhanced summary text or the instruction specified in rule 1. No commentary, no quotes, no markdown wrappers — just the raw text.`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      })
    );

    const result = (response.text || "").trim();

    if (!result) {
      res.status(200).json({ success: true, result: trimmedText });
      return;
    }

    res.status(200).json({ success: true, result });
  } catch (err: any) {
    console.error("Summary enhancement failed:", err.message);
    const fallbackText = typeof req.body.currentText === "string" ? req.body.currentText.trim() : "";
    res.status(200).json({ success: true, result: fallbackText });
  }
});

export default router;
