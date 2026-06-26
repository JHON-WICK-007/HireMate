"""
HireMate ML Service — Skill Extraction & Gap Analysis
Uses: pandas, numpy, scikit-learn (TF-IDF), nltk
"""
import re
from typing import List, Dict, Any

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import TECH_SKILLS, ROLE_SKILL_MAP


def _normalize(text: str) -> str:
    """Lowercase and strip extra whitespace."""
    return re.sub(r"\s+", " ", text.lower().strip())


def extract_skills(resume_text: str) -> List[str]:
    """
    Extract known technical skills from resume text using keyword matching.
    Returns a deduplicated, sorted list of matched skills.
    """
    text = _normalize(resume_text)
    found: set = set()
    for skill in TECH_SKILLS:
        # Word-boundary matching to avoid partial matches (e.g. 'go' inside 'google')
        pattern = r"\b" + re.escape(skill) + r"\b"
        if re.search(pattern, text):
            found.add(skill)
    return sorted(found)


def skill_gap_analysis(resume_text: str, target_role: str) -> Dict[str, Any]:
    """
    Compare extracted skills against the expected skills for a target role.

    Returns:
        - matched_skills: skills the candidate has
        - missing_skills: skills the candidate is lacking
        - match_percentage: how well the candidate matches the role
        - recommendations: actionable advice
    """
    target_role_key = _normalize(target_role)

    # Find best matching role from our mapping
    best_match_role = None
    best_sim = 0.0

    if target_role_key in ROLE_SKILL_MAP:
        best_match_role = target_role_key
    else:
        # Use TF-IDF cosine similarity to find the closest role
        role_names = list(ROLE_SKILL_MAP.keys())
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(role_names + [target_role_key])
        similarities = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1])[0]
        best_idx = int(np.argmax(similarities))
        best_sim = float(similarities[best_idx])
        if best_sim > 0.1:
            best_match_role = role_names[best_idx]

    if not best_match_role:
        return {
            "matched_skills": [],
            "missing_skills": [],
            "match_percentage": 0,
            "matched_role": None,
            "recommendations": ["We couldn't map your target role. Try common titles like 'Frontend Developer', 'Data Scientist', etc."],
        }

    expected_skills = ROLE_SKILL_MAP[best_match_role]
    candidate_skills = set(extract_skills(resume_text))
    expected_set = set(expected_skills)

    matched = sorted(candidate_skills & expected_set)
    missing = sorted(expected_set - candidate_skills)
    extra = sorted(candidate_skills - expected_set)
    match_pct = round(len(matched) / max(len(expected_set), 1) * 100, 1)

    # Build recommendations
    recs = []
    if missing:
        top_missing = missing[:5]
        recs.append(f"Focus on learning: {', '.join(top_missing)}")
    if match_pct >= 80:
        recs.append("Great match! Consider deepening expertise in your stronger areas.")
    elif match_pct >= 50:
        recs.append("Decent foundation. Fill the skill gaps to become a strong candidate.")
    else:
        recs.append("Significant gaps found. Consider structured courses or projects to build these skills.")
    if extra:
        recs.append(f"Bonus skills outside core requirements: {', '.join(extra[:5])}")

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "extra_skills": extra,
        "match_percentage": match_pct,
        "matched_role": best_match_role,
        "total_expected": len(expected_set),
        "recommendations": recs,
    }


def build_skill_dataframe(resume_text: str, target_role: str) -> pd.DataFrame:
    """
    Build a pandas DataFrame summarising skill coverage for visualization.
    Each row = one expected skill with columns: skill, status (Has / Missing), category.
    """
    analysis = skill_gap_analysis(resume_text, target_role)
    if not analysis["matched_role"]:
        return pd.DataFrame(columns=["skill", "status"])

    rows = []
    for s in analysis["matched_skills"]:
        rows.append({"skill": s, "status": "Has"})
    for s in analysis["missing_skills"]:
        rows.append({"skill": s, "status": "Missing"})

    df = pd.DataFrame(rows)
    return df
