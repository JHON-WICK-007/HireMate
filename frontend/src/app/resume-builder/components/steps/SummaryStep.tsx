"use client";

import React, { useState } from "react";
import { useResumeStore } from "../../store";
import { TextareaField } from "../inputs";
import { StepHeader } from "../navigation";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";
import styles from "../../builder.module.css";

export const SummaryStep: React.FC = () => {
  const summary = useResumeStore((state) => state.summary);
  const actions = useResumeStore((state) => state.actions);
  const [aiState, setAiState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    actions.updateSummary(e.target.value);
  };

  const handleAiAction = async (promptType: string) => {
    setAiState("loading");
    try {
      // Simulate calling backend AI route or fallback response
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/ai/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: promptType,
          currentText: summary,
          context: { role: "UI/UX Designer" }
        })
      });
      if (response.ok) {
        const data = await response.json();
        actions.updateSummary(data.result);
        setAiState("success");
        setTimeout(() => setAiState("idle"), 1200);
      } else {
        // Fallback for demo when backend isn't answering
        setTimeout(() => {
          let text = summary;
          if (promptType === "improve") {
            text = "Results-driven UI/UX Designer dedicated to crafting intuitive, visually striking web and mobile interfaces. Experienced in establishing scalable design systems, conducting collaborative user testing, and translating research findings into high-fidelity mockups that streamline engineering pipelines.";
          } else if (promptType === "shorten") {
            text = "UI/UX Designer focused on creating user-centric interfaces, interactive prototypes, and scalable design systems.";
          }
          actions.updateSummary(text);
          setAiState("success");
          setTimeout(() => setAiState("idle"), 1200);
        }, 1000);
      }
    } catch {
      setTimeout(() => {
        let text = summary;
        if (promptType === "improve") {
          text = "Results-driven UI/UX Designer dedicated to crafting intuitive, visually striking web and mobile interfaces. Experienced in establishing scalable design systems, conducting collaborative user testing, and translating research findings into high-fidelity mockups that streamline engineering pipelines.";
        } else if (promptType === "shorten") {
          text = "UI/UX Designer focused on creating user-centric interfaces, interactive prototypes, and scalable design systems.";
        }
        actions.updateSummary(text);
        setAiState("success");
        setTimeout(() => setAiState("idle"), 1200);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Write your professional summary"
        description="A 3–4 sentence overview of who you are and what you bring."
      />
      <div className={styles.formCard}>
        <TextareaField
          label="Professional Summary"
          value={summary}
          onChange={handleChange}
          placeholder="Briefly describe your career achievements, strengths, and skills..."
          maxLength={600}
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{summary.length} / 600 characters</span>
          {summary.length >= 580 && <span className="text-red-500 font-medium">Almost full</span>}
        </div>

        {/* AI Action Bar */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-800">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent text-xs hover:border-[rgba(255,255,255,0.15)] hover:text-white transition-all text-gray-400 font-sans cursor-pointer"
            onClick={() => handleAiAction("improve")}
            disabled={aiState === "loading"}
          >
            {aiState === "loading" ? (
              <Loader2 size={12} className="animate-spin text-cyan-400" />
            ) : (
              <Sparkles size={12} className="text-cyan-400" />
            )}
            Improve Summary
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-transparent text-xs hover:border-[rgba(255,255,255,0.15)] hover:text-white transition-all text-gray-400 font-sans cursor-pointer"
            onClick={() => handleAiAction("shorten")}
            disabled={aiState === "loading"}
          >
            <Sparkles size={12} className="text-cyan-400" />
            Make Concise
          </button>
        </div>
      </div>
    </div>
  );
};
export default SummaryStep;
