import express, { Request, Response } from "express";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/auth";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
    const prompt = `You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Please analyze the following resume text. Extract the required fields and provide a professional analysis.
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
    "atsScore": number (0 to 100),
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingSkills": ["string"],
    "improvementSuggestions": ["string"]
  }
}

Resume Text:
${extractedText.substring(0, 15000)} // Limit length to avoid massive prompts just in case
`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Resume analyze error:", error);
    res.status(500).json({ success: false, message: error.message || "An error occurred during resume analysis." });
  }
});

export default router;
