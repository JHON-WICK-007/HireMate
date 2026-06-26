"""
HireMate ML Service — Interview Performance Analytics
Uses: pandas, numpy, matplotlib, seaborn
"""
import io
import base64
from typing import Dict, Any, List, Optional

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns


def _fig_to_base64(fig) -> str:
    """Convert matplotlib figure to base64 PNG string."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120, bbox_inches="tight", facecolor="#0f172a")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("utf-8")
    plt.close(fig)
    return f"data:image/png;base64,{b64}"


def _setup_dark_style():
    """Apply dark theme consistent with HireMate UI."""
    plt.style.use("dark_background")
    sns.set_theme(style="darkgrid", rc={
        "axes.facecolor": "#1e293b",
        "figure.facecolor": "#0f172a",
        "grid.color": "#334155",
        "text.color": "#e2e8f0",
        "axes.labelcolor": "#e2e8f0",
        "xtick.color": "#94a3b8",
        "ytick.color": "#94a3b8",
    })


def analyze_interviews(interviews: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze a list of completed interview sessions.

    Each interview dict should contain:
        - sessionName, company, role, level, overallScore,
        - metrics: { technicalAccuracy, communication, problemSolving }
        - questions: [{ type, score, competencies }]
        - createdAt

    Returns analytics summary + base64-encoded chart images.
    """
    if not interviews:
        return {"error": "No interview data provided", "charts": {}}

    # ─── Build DataFrames ─────────────────────────────────────
    records = []
    question_records = []

    for iv in interviews:
        metrics = iv.get("metrics", {})
        record = {
            "session": iv.get("sessionName", "Unnamed"),
            "company": iv.get("company", ""),
            "role": iv.get("role", ""),
            "level": iv.get("level", ""),
            "overall_score": iv.get("overallScore", 0),
            "technical": metrics.get("technicalAccuracy", 0),
            "communication": metrics.get("communication", 0),
            "problem_solving": metrics.get("problemSolving", 0),
            "date": iv.get("createdAt", ""),
        }
        records.append(record)

        for q in iv.get("questions", []):
            if q.get("score") is not None:
                question_records.append({
                    "session": record["session"],
                    "type": q.get("type", "Unknown"),
                    "score": q.get("score", 0),
                    "competencies": q.get("competencies", []),
                })

    df = pd.DataFrame(records)
    q_df = pd.DataFrame(question_records)

    # ─── Summary Stats ────────────────────────────────────────
    summary = {
        "total_interviews": len(df),
        "avg_overall_score": round(float(df["overall_score"].mean()), 1),
        "best_score": round(float(df["overall_score"].max()), 1),
        "worst_score": round(float(df["overall_score"].min()), 1),
        "avg_technical": round(float(df["technical"].mean()), 1),
        "avg_communication": round(float(df["communication"].mean()), 1),
        "avg_problem_solving": round(float(df["problem_solving"].mean()), 1),
        "score_std_dev": round(float(df["overall_score"].std()), 1) if len(df) > 1 else 0,
    }

    # Improvement trend (is the user getting better?)
    if len(df) >= 2:
        scores = df["overall_score"].values
        trend = float(np.polyfit(range(len(scores)), scores, 1)[0])
        summary["trend"] = "improving" if trend > 1 else "declining" if trend < -1 else "stable"
        summary["trend_slope"] = round(trend, 2)
    else:
        summary["trend"] = "insufficient_data"
        summary["trend_slope"] = 0

    # ─── Generate Charts ──────────────────────────────────────
    _setup_dark_style()
    charts = {}

    # Chart 1: Score trend over time
    if len(df) >= 2:
        fig, ax = plt.subplots(figsize=(8, 4))
        x = range(len(df))
        ax.plot(x, df["overall_score"], marker="o", color="#6366f1", linewidth=2, markersize=8, label="Overall")
        ax.fill_between(x, df["overall_score"], alpha=0.15, color="#6366f1")
        ax.set_xlabel("Interview #")
        ax.set_ylabel("Score")
        ax.set_title("Interview Score Trend", fontsize=14, fontweight="bold")
        ax.set_ylim(0, 105)
        ax.legend()
        charts["score_trend"] = _fig_to_base64(fig)

    # Chart 2: Metrics radar / bar comparison
    fig, ax = plt.subplots(figsize=(7, 4))
    metric_names = ["Technical\nAccuracy", "Communication", "Problem\nSolving"]
    metric_vals = [summary["avg_technical"], summary["avg_communication"], summary["avg_problem_solving"]]
    colors = ["#6366f1", "#22d3ee", "#f59e0b"]
    bars = ax.bar(metric_names, metric_vals, color=colors, width=0.5, edgecolor="none")
    for bar, val in zip(bars, metric_vals):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 2,
                f"{val}", ha="center", va="bottom", fontsize=12, fontweight="bold", color="#e2e8f0")
    ax.set_ylim(0, 105)
    ax.set_ylabel("Average Score")
    ax.set_title("Average Performance by Metric", fontsize=14, fontweight="bold")
    charts["metrics_comparison"] = _fig_to_base64(fig)

    # Chart 3: Score distribution by question type
    if not q_df.empty and len(q_df) >= 3:
        fig, ax = plt.subplots(figsize=(8, 4))
        type_avg = q_df.groupby("type")["score"].mean().sort_values(ascending=False)
        type_avg.plot(kind="barh", ax=ax, color="#6366f1", edgecolor="none")
        ax.set_xlabel("Average Score")
        ax.set_title("Performance by Question Type", fontsize=14, fontweight="bold")
        ax.set_xlim(0, 105)
        charts["type_performance"] = _fig_to_base64(fig)

    # Chart 4: Score distribution histogram
    if len(q_df) >= 5:
        fig, ax = plt.subplots(figsize=(7, 4))
        sns.histplot(q_df["score"], bins=10, kde=True, color="#6366f1", ax=ax, edgecolor="#334155")
        ax.set_xlabel("Question Score")
        ax.set_ylabel("Count")
        ax.set_title("Score Distribution (All Questions)", fontsize=14, fontweight="bold")
        charts["score_distribution"] = _fig_to_base64(fig)

    # ─── Strengths & Weaknesses ───────────────────────────────
    strengths = []
    weaknesses = []
    if summary["avg_technical"] >= 70:
        strengths.append("Strong technical knowledge")
    elif summary["avg_technical"] < 50:
        weaknesses.append("Technical accuracy needs improvement")
    if summary["avg_communication"] >= 70:
        strengths.append("Good communication skills")
    elif summary["avg_communication"] < 50:
        weaknesses.append("Communication skills need work")
    if summary["avg_problem_solving"] >= 70:
        strengths.append("Solid problem-solving abilities")
    elif summary["avg_problem_solving"] < 50:
        weaknesses.append("Problem-solving approach needs development")

    summary["strengths"] = strengths
    summary["weaknesses"] = weaknesses

    return {
        "summary": summary,
        "charts": charts,
    }
