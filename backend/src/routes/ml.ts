import express, { Request, Response } from "express";
import { protect } from "../middleware/auth";
import http from "http";

const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

/**
 * Proxy helper — forwards POST requests to the Python ML service.
 * Uses Node.js built-in http module (no external dependencies needed).
 */
function mlProxy(endpoint: string, body: Record<string, unknown>): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${ML_SERVICE_URL}${endpoint}`);
    const postData = JSON.stringify(body);

    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(parsed.detail || `ML service error: ${res.statusCode}`));
          } else {
            resolve(parsed);
          }
        } catch {
          reject(new Error(`ML service returned invalid JSON (status ${res.statusCode})`));
        }
      });
    });

    req.on("error", (err) => {
      reject(new Error(`ML service unavailable: ${err.message}`));
    });

    req.write(postData);
    req.end();
  });
}

/**
 * GET proxy helper — for health check.
 */
function mlGet(endpoint: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${ML_SERVICE_URL}${endpoint}`);

    const req = http.get(
      { hostname: url.hostname, port: url.port, path: url.pathname },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("ML service returned invalid JSON"));
          }
        });
      }
    );

    req.on("error", (err) => {
      reject(new Error(`ML service unavailable: ${err.message}`));
    });
  });
}

// ─── Resume ML Score ─────────────────────────────────────────
// @route   POST /api/ml/resume-score
// @desc    Score resume using ML model (scikit-learn RandomForest)
// @access  Protected
router.post("/resume-score", protect, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resume_text } = req.body;
    if (typeof resume_text !== "string") {
      res.status(400).json({ success: false, message: "Resume text must be a string." });
      return;
    }
    if (resume_text.trim().length < 50) {
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
    if (typeof resume_text !== "string") {
      res.status(400).json({ success: false, message: "Resume text must be a string." });
      return;
    }
    if (resume_text.trim().length < 50) {
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
    if (typeof resume_text !== "string" || typeof target_role !== "string") {
      res.status(400).json({ success: false, message: "Resume text and target role must be strings." });
      return;
    }
    if (resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    if (target_role.trim().length < 2) {
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
    if (typeof resume_text !== "string" || typeof job_description !== "string") {
      res.status(400).json({ success: false, message: "Resume text and job description must be strings." });
      return;
    }
    if (resume_text.trim().length < 50) {
      res.status(400).json({ success: false, message: "Resume text must be at least 50 characters." });
      return;
    }
    if (job_description.trim().length < 50) {
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
    const sanitizedInterviews = interviews.filter(i => i && typeof i === "object");
    if (sanitizedInterviews.length === 0) {
      res.status(400).json({ success: false, message: "Invalid interview data format." });
      return;
    }
    const result = await mlProxy("/api/ml/interview-analytics", { interviews: sanitizedInterviews });
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
    const data = await mlGet("/health");
    res.status(200).json({ success: true, ml_service: data });
  } catch (error: any) {
    res.status(503).json({ success: false, message: "ML service is not available.", error: error.message });
  }
});

export default router;
