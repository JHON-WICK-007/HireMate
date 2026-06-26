"""
HireMate ML Service — Resume Scoring Model
Uses: scikit-learn (TF-IDF + RandomForest), pandas, numpy, joblib, mlflow
"""
import os
import re
from typing import Dict, Any

import numpy as np
import pandas as pd
import joblib
import mlflow
import mlflow.sklearn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

from config import MODEL_DIR, MLFLOW_TRACKING_URI, TECH_SKILLS
from skill_analyzer import extract_skills


# ─── Feature Engineering ─────────────────────────────────────
def _extract_features(resume_text: str) -> Dict[str, Any]:
    """Extract numerical features from resume text for ML scoring."""
    text = resume_text.lower()
    words = text.split()
    sentences = [s.strip() for s in re.split(r'[.!?]', text) if s.strip()]

    skills = extract_skills(resume_text)

    # Count sections
    section_keywords = ["experience", "education", "skills", "projects", "certifications", "summary", "objective"]
    section_count = sum(1 for kw in section_keywords if kw in text)

    # Contact info presence
    has_email = 1 if re.search(r'\b[\w.-]+@[\w.-]+\.\w+\b', text) else 0
    has_phone = 1 if re.search(r'[\+]?[\d\s\-\(\)]{10,}', text) else 0
    has_link = 1 if re.search(r'(linkedin|github|portfolio|http)', text) else 0

    # Action verbs (strong resume language)
    action_verbs = ["developed", "built", "designed", "implemented", "led", "managed",
                    "created", "optimized", "deployed", "collaborated", "achieved",
                    "improved", "reduced", "increased", "architected", "mentored"]
    action_verb_count = sum(1 for v in action_verbs if v in text)

    # Quantifiable achievements (numbers/percentages)
    quantifiable = len(re.findall(r'\b\d+[\%\+]?\b', text))

    return {
        "word_count": len(words),
        "sentence_count": len(sentences),
        "avg_sentence_length": round(len(words) / max(len(sentences), 1), 2),
        "skill_count": len(skills),
        "section_count": section_count,
        "has_email": has_email,
        "has_phone": has_phone,
        "has_link": has_link,
        "action_verb_count": action_verb_count,
        "quantifiable_achievements": quantifiable,
        "unique_word_ratio": round(len(set(words)) / max(len(words), 1), 4),
    }


# ─── Synthetic Training Data ─────────────────────────────────
def _generate_training_data(n_samples: int = 500) -> pd.DataFrame:
    """
    Generate synthetic training data to bootstrap the model.
    In production, this would be replaced with real labeled resume data.
    """
    rng = np.random.RandomState(42)
    records = []

    for _ in range(n_samples):
        word_count = rng.randint(100, 1200)
        sentence_count = rng.randint(10, 80)
        skill_count = rng.randint(0, 25)
        section_count = rng.randint(1, 7)
        has_email = rng.choice([0, 1], p=[0.1, 0.9])
        has_phone = rng.choice([0, 1], p=[0.15, 0.85])
        has_link = rng.choice([0, 1], p=[0.3, 0.7])
        action_verb_count = rng.randint(0, 15)
        quantifiable = rng.randint(0, 12)
        unique_word_ratio = round(rng.uniform(0.3, 0.85), 4)

        # Heuristic score (our "label") — weighted combination
        score = (
            min(skill_count * 3.5, 30)            # Skills: up to 30 pts
            + min(section_count * 5, 25)           # Sections: up to 25 pts
            + has_email * 5 + has_phone * 3 + has_link * 5  # Contact: up to 13 pts
            + min(action_verb_count * 2, 16)       # Action verbs: up to 16 pts
            + min(quantifiable * 1.5, 10)          # Quantifiable: up to 10 pts
            + (6 if 300 <= word_count <= 900 else 0)  # Ideal length: 6 pts
        )
        score = min(max(score + rng.normal(0, 4), 0), 100)

        records.append({
            "word_count": word_count,
            "sentence_count": sentence_count,
            "avg_sentence_length": round(word_count / max(sentence_count, 1), 2),
            "skill_count": skill_count,
            "section_count": section_count,
            "has_email": has_email,
            "has_phone": has_phone,
            "has_link": has_link,
            "action_verb_count": action_verb_count,
            "quantifiable_achievements": quantifiable,
            "unique_word_ratio": unique_word_ratio,
            "ats_score": round(score, 1),
        })

    return pd.DataFrame(records)


# ─── Model Training ──────────────────────────────────────────
FEATURE_COLS = [
    "word_count", "sentence_count", "avg_sentence_length",
    "skill_count", "section_count",
    "has_email", "has_phone", "has_link",
    "action_verb_count", "quantifiable_achievements", "unique_word_ratio",
]

MODEL_PATH = os.path.join(MODEL_DIR, "resume_scorer.joblib")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.joblib")


def train_model() -> Dict[str, float]:
    """
    Train a RandomForestRegressor to predict ATS resume scores.
    Logs experiment to MLflow.
    """
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment("resume_scoring")

    df = _generate_training_data(500)
    X = df[FEATURE_COLS]
    y = df["ats_score"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    with mlflow.start_run(run_name="rf_resume_scorer"):
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        # Log to MLflow
        mlflow.log_param("n_estimators", 100)
        mlflow.log_param("max_depth", 10)
        mlflow.log_param("training_samples", len(X_train))
        mlflow.log_metric("mae", mae)
        mlflow.log_metric("r2_score", r2)
        mlflow.sklearn.log_model(model, "resume_scorer_model")

        # Save locally
        joblib.dump(model, MODEL_PATH)

        # Feature importances
        importances = pd.Series(model.feature_importances_, index=FEATURE_COLS)
        mlflow.log_dict(importances.to_dict(), "feature_importances.json")

    return {"mae": round(mae, 2), "r2_score": round(r2, 4), "model_path": MODEL_PATH}


def load_model() -> RandomForestRegressor:
    """Load trained model from disk, or train a new one."""
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    train_model()
    return joblib.load(MODEL_PATH)


def predict_score(resume_text: str) -> Dict[str, Any]:
    """
    Predict ATS score for a resume using the trained ML model.
    Returns score + feature breakdown.
    """
    model = load_model()
    features = _extract_features(resume_text)
    feature_df = pd.DataFrame([features])[FEATURE_COLS]
    raw_score = float(model.predict(feature_df)[0])
    score = round(min(max(raw_score, 0), 100), 1)

    # Feature importance breakdown
    importances = model.feature_importances_
    breakdown = {
        col: round(float(importances[i]) * 100, 1)
        for i, col in enumerate(FEATURE_COLS)
    }

    return {
        "ml_ats_score": score,
        "features": features,
        "feature_importance": breakdown,
        "model": "RandomForestRegressor",
    }
