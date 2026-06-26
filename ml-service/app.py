"""
HireMate ML Service — FastAPI Application
Main API server that exposes all ML endpoints.
"""
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any

from resume_scorer import predict_score, train_model
from skill_analyzer import extract_skills, skill_gap_analysis
from job_matcher import match_resume_to_job, batch_match
from interview_analytics import analyze_interviews
from config import ML_SERVICE_PORT, MODEL_DIR


# ─── Startup / Shutdown ──────────────────────────────────────
@asynccontextmanager
async def lifespan(application: FastAPI):
    """Train model on startup if not already saved."""
    model_path = os.path.join(MODEL_DIR, "resume_scorer.joblib")
    if not os.path.exists(model_path):
        print("🔧 Training initial resume scoring model...")
        metrics = train_model()
        print(f"✅ Model trained: MAE={metrics['mae']}, R²={metrics['r2_score']}")
    else:
        print("✅ Resume scoring model already exists, skipping training.")
    yield


# ─── FastAPI App ──────────────────────────────────────────────
app = FastAPI(
    title="HireMate ML Service",
    description="Machine Learning microservice for resume scoring, skill analysis, job matching, and interview analytics.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ────────────────────────────────
class ResumeTextRequest(BaseModel):
    resume_text: str = Field(..., min_length=50, description="Plain text content of the resume")


class SkillGapRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    target_role: str = Field(..., min_length=2, description="Target job role e.g. 'Frontend Developer'")


class JobMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=50, description="Job posting description text")


class BatchJobMatchRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    jobs: List[Dict[str, str]] = Field(..., description="List of {title, description} dicts")


class InterviewAnalyticsRequest(BaseModel):
    interviews: List[Dict[str, Any]] = Field(..., description="List of completed interview objects from MongoDB")


# ─── Health Check ─────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "HireMate ML Service",
        "version": "1.0.0",
        "libraries": {
            "scikit-learn": True,
            "pandas": True,
            "numpy": True,
            "matplotlib": True,
            "seaborn": True,
            "mlflow": True,
        },
    }


# ─── Resume Scoring ──────────────────────────────────────────
@app.post("/api/ml/resume-score")
def resume_score(req: ResumeTextRequest):
    """Score a resume using the trained ML model (RandomForest + TF-IDF features)."""
    try:
        result = predict_score(req.resume_text)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ml/train-model")
def train_resume_model():
    """Retrain the resume scoring model and log to MLflow."""
    try:
        metrics = train_model()
        return {"success": True, "message": "Model trained successfully", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Skill Extraction & Gap Analysis ─────────────────────────
@app.post("/api/ml/extract-skills")
def api_extract_skills(req: ResumeTextRequest):
    """Extract technical skills from resume text using NLP."""
    try:
        skills = extract_skills(req.resume_text)
        return {"success": True, "data": {"skills": skills, "count": len(skills)}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ml/skill-gap")
def api_skill_gap(req: SkillGapRequest):
    """Analyze skill gaps between resume and target role."""
    try:
        result = skill_gap_analysis(req.resume_text, req.target_role)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Job-Resume Matching ─────────────────────────────────────
@app.post("/api/ml/job-match")
def api_job_match(req: JobMatchRequest):
    """Match a resume against a single job description using TF-IDF cosine similarity."""
    try:
        result = match_resume_to_job(req.resume_text, req.job_description)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/ml/batch-job-match")
def api_batch_job_match(req: BatchJobMatchRequest):
    """Match a resume against multiple job descriptions, ranked by match score."""
    try:
        results = batch_match(req.resume_text, req.jobs)
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Interview Analytics ─────────────────────────────────────
@app.post("/api/ml/interview-analytics")
def api_interview_analytics(req: InterviewAnalyticsRequest):
    """
    Analyze interview performance with pandas/numpy/seaborn.
    Returns summary stats + base64-encoded chart images.
    """
    try:
        result = analyze_interviews(req.interviews)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Run Server ──────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    print(f"\n🚀 HireMate ML Service starting on port {ML_SERVICE_PORT}")
    uvicorn.run(app, host="0.0.0.0", port=ML_SERVICE_PORT)
