import express, { Request, Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/auth";
import { generatePDF } from "../utils/pdf";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size limit
});

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

router.post("/analyze", protect, upload.single("resume"), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "No resume file provided." });
      return;
    }

    const { mimetype, buffer, originalname } = req.file;
    let extractedText = "";

    if (mimetype === "application/pdf") {
      const pdfParser = new PDFParse({ data: buffer });
      const pdfData = await pdfParser.getText();
      extractedText = pdfData.text;
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword" ||
      originalname.endsWith(".docx")
    ) {
      const docxData = await mammoth.extractRawText({ buffer });
      extractedText = docxData.value;
    } else {
      res.status(400).json({ success: false, message: "Unsupported file type. Please upload PDF or DOCX." });
      return;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      res.status(400).json({ success: false, message: "Could not extract text from the document." });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
       res.status(500).json({ success: false, message: "Server AI configuration error." });
       return;
    }

    // Call Gemini to analyze the resume
    const prompt = `You are an elite ATS (Applicant Tracking System) parser and senior technical recruiter.
Your task is to parse, analyze, and grade the following resume. 

CRITICAL GUIDELINES:
1. Extract personalInfo, skills, education, experience, and projects precisely.
2. Conduct a highly rigorous ATS analysis:
   - atsScore: An objective score (0 to 100). Be realistic. A typical un-optimized resume should score between 40-70. Only truly optimized resumes with clear impact metrics, strong verbs, and no formatting issues should score 85+.
   - strengths: 3-5 specific, bulleted technical or structural strengths.
   - weaknesses: 3-5 critical, actionable weaknesses (e.g., lack of quantifiable metrics, passive voice, missing key stack tools, weak action verbs).
   - missingSkills: A list of industry-standard tools or skills that are highly relevant to the candidate's target roles but missing from their text.
   - improvementSuggestions: 3-5 concrete, step-by-step suggestions to boost their ATS score (e.g., "Change passive phrase X to active verb Y", "Add quantifiable results for project Z").

Respond ONLY with a valid JSON object matching this exact schema:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "links": ["string"]
  },
  "skills": ["string"],
  "education": [
    { "institution": "string", "degree": "string", "year": "string" }
  ],
  "experience": [
    { "company": "string", "role": "string", "duration": "string", "description": "string" }
  ],
  "projects": [
    { "name": "string", "description": "string", "technologies": ["string"] }
  ],
  "analysis": {
    "atsScore": number,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingSkills": ["string"],
    "improvementSuggestions": ["string"]
  }
}

Resume Text to analyze:
---
${extractedText.substring(0, 15000)}
---`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Call with automatic retry on 503 errors
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      })
    );

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Resume analyze error:", error);
    const errMsg = error.message || "";
    if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE") || errMsg.includes("high demand") || errMsg.includes("overloaded")) {
      res.status(503).json({ success: false, message: "The AI service is temporarily busy. We tried multiple times but it's still unavailable. Please try again in a minute." });
    } else if (errMsg.includes("JSON")) {
      res.status(500).json({ success: false, message: "Failed to parse AI response. Please try again." });
    } else {
      res.status(500).json({ success: false, message: "An error occurred during resume analysis. Please try again." });
    }
  }
});

router.post("/download", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { html } = req.body;
    if (typeof html !== "string") {
      res.status(400).json({ success: false, message: "HTML content must be a string." });
      return;
    }

    if (!html.trim()) {
      res.status(400).json({ success: false, message: "No HTML content provided." });
      return;
    }

    console.log("Generating A4 PDF from HTML payload...");
    const pdfBuffer = await generatePDF(html);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length.toString(),
    });

    res.status(200).send(pdfBuffer);
  } catch (error: any) {
    console.error("PDF generation error:", error);
    res.status(500).json({ success: false, message: "An error occurred during PDF generation." });
  }
});

export default router;
