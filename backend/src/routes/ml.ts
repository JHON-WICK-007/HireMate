import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Proxy helper — forwards requests to the Python ML service.
 */
async function mlProxy(endpoint: string, body: Record<string, unknown>): Promise<any> {
  const response = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `ML service error: ${response.status}`);
  }

  return response.json();
}

// ─── Resume ML Score ─────────────────────────────────────────
// @route   POST /api/ml/resume-score
// @desc    Score resume using ML model (scikit-learn RandomForest)
// @access  Protected
router.post("/resume-score", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume_text } = req.body;
    if (!resume_text || resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    const result = await mlProxy("/api/ml/resume-score", { resume_text });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML resume-score error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── Skill Extraction ────────────────────────────────────────
// @route   POST /api/ml/extract-skills
// @desc    Extract technical skills from resume using NLP
// @access  Protected
router.post("/extract-skills", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume_text } = req.body;
    if (!resume_text || resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    const result = await mlProxy("/api/ml/extract-skills", { resume_text });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML extract-skills error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── Skill Gap Analysis ─────────────────────────────────────
// @route   POST /api/ml/skill-gap
// @desc    Analyze skill gaps between resume and target role
// @access  Protected
router.post("/skill-gap", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume_text, target_role } = req.body;
    if (!resume_text || resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    if (!target_role || target_role.trim().length < 2) {
      res.status(400).json({ success: false, message: "Please provide a target role." });
      return;
    }
    const result = await mlProxy("/api/ml/skill-gap", { resume_text, target_role });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML skill-gap error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── Job-Resume Matching ─────────────────────────────────────
// @route   POST /api/ml/job-match
// @desc    Match resume against job description using TF-IDF cosine similarity
// @access  Protected
router.post("/job-match", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume_text, job_description } = req.body;
    if (!resume_text || resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    if (!job_description || job_description.trim().length < 50) {
      res.status(400).json({ success: false, message: "Job description must be at least 50 characters." });
      return;
    }
    const result = await mlProxy("/api/ml/job-match", { resume_text, job_description });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML job-match error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── Interview Analytics ─────────────────────────────────────
// @route   POST /api/ml/interview-analytics
// @desc    Analyze interview performance with pandas/seaborn charts
// @access  Protected
router.post("/interview-analytics", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviews } = req.body;
    if (!interviews || !Array.isArray(interviews) || interviews.length === 0) {
      res.status(400).json({ success: false, message: "Please provide interview data." });
      return;
    }
    const result = await mlProxy("/api/ml/interview-analytics", { interviews });
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML interview-analytics error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── Train Model ─────────────────────────────────────────────
// @route   POST /api/ml/train-model
// @desc    Retrain the resume scoring model (MLflow tracked)
// @access  Protected
router.post("/train-model", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await mlProxy("/api/ml/train-model", {});
    res.status(200).json(result);
  } catch (error: any) {
    console.error("ML train-model error:", error.message);
    res.status(500).json({ success: false, message: error.message || "ML service unavailable." });
  }
});

// ─── ML Service Health Check ─────────────────────────────────
// @route   GET /api/ml/health
// @desc    Check ML service status
// @access  Public
router.get("/health", async (_req: Request, res: Response): Promise<void> => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    res.status(200).json({ success: true, ml_service: data });
  } catch (error: any) {
    res.status(503).json({ success: false, message: "ML service is not available.", error: error.message });
  }
});

export default router;
