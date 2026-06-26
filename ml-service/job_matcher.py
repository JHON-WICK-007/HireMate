"""
HireMate ML Service — Job-Resume Matching
Uses: scikit-learn (TF-IDF + Cosine Similarity), pandas, numpy
"""
from typing import Dict, Any, List

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from skill_analyzer import extract_skills


def match_resume_to_job(resume_text: str, job_description: str) -> Dict[str, Any]:
    """
    Calculate similarity between a resume and a job description using
    TF-IDF vectorization + cosine similarity.

    Returns match score, overlapping skills, and recommendations.
    """
    # 1. TF-IDF Cosine Similarity (overall text match)
    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
    text_similarity = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])

    # 2. Skill-level matching
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_description))

    if job_skills:
        skill_overlap = sorted(resume_skills & job_skills)
        skill_missing = sorted(job_skills - resume_skills)
        skill_extra = sorted(resume_skills - job_skills)
        skill_match_pct = round(len(skill_overlap) / len(job_skills) * 100, 1)
    else:
        skill_overlap = []
        skill_missing = []
        skill_extra = sorted(resume_skills)
        skill_match_pct = 0.0

    # 3. Combined score (weighted: 40% text similarity + 60% skill match)
    combined_score = round(text_similarity * 40 + skill_match_pct * 0.6, 1)
    combined_score = min(combined_score, 100.0)

    # 4. Recommendations
    recs: List[str] = []
    if skill_missing:
        recs.append(f"Add these missing keywords to your resume: {', '.join(skill_missing[:5])}")
    if text_similarity < 0.3:
        recs.append("Your resume language differs significantly from the job posting. Mirror key phrases from the description.")
    if combined_score >= 75:
        recs.append("Strong match! Your resume aligns well with this position.")
    elif combined_score >= 50:
        recs.append("Moderate match. Tailor your resume to emphasize relevant experience.")
    else:
        recs.append("Low match. Consider highlighting transferable skills or gaining relevant experience.")

    return {
        "overall_match_score": combined_score,
        "text_similarity": round(text_similarity * 100, 1),
        "skill_match_percentage": skill_match_pct,
        "matching_skills": skill_overlap,
        "missing_skills": skill_missing,
        "extra_skills": skill_extra,
        "recommendations": recs,
    }


def batch_match(resume_text: str, job_descriptions: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """
    Match a single resume against multiple job descriptions.
    Each job_description dict should have: { "title": str, "description": str }

    Returns a list sorted by match score (highest first).
    """
    results = []
    for job in job_descriptions:
        match = match_resume_to_job(resume_text, job.get("description", ""))
        match["job_title"] = job.get("title", "Unknown")
        results.append(match)

    # Sort by overall match score descending
    results.sort(key=lambda x: x["overall_match_score"], reverse=True)

    # Build comparison DataFrame for analytics
    df = pd.DataFrame([{
        "job_title": r["job_title"],
        "overall_match": r["overall_match_score"],
        "text_similarity": r["text_similarity"],
        "skill_match": r["skill_match_percentage"],
    } for r in results])

    return results
