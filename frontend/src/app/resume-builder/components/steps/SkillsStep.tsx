"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useResumeStore, SkillEntry } from "../../store";
import { StepHeader, cardVariant } from "../navigation";
import { CustomDropdown } from "../inputs";
import { Plus, Sparkles, Code, X } from "lucide-react";
import styles from "../../builder.module.css";

const CATEGORIES = [
  "All",
  "Design Tools",
  "Frontend",
  "Backend",
  "Database",
  "Cloud/DevOps",
  "Soft Skills",
];

const PRE_SUGGESTED_SKILLS = [
  { name: "Figma", category: "Design Tools" },
  { name: "UI Design", category: "Design Tools" },
  { name: "UX Research", category: "Design Tools" },
  { name: "Next.js", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "AWS", category: "Cloud/DevOps" },
  { name: "Docker", category: "Cloud/DevOps" },
  { name: "Communication", category: "Soft Skills" },
  { name: "Problem Solving", category: "Soft Skills" },
];

const PROFICIENCY_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "All").map((c) => ({
  value: c,
  label: c,
}));

export const SkillsStep: React.FC = () => {
  const skills = useResumeStore((state) => state.skills);
  const showProficiency = useResumeStore((state) => state.showProficiency);
  const actions = useResumeStore((state) => state.actions);

  const [activeTab, setActiveTab] = useState("All");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<string | number>("");
  const [newSkillProficiency, setNewSkillProficiency] = useState<string | number>("");

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newSkillName.trim();
    if (!name || !newSkillCategory || !newSkillProficiency) return;

    if (skills.some((sk) => sk.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName("");
      return;
    }

    actions.addSkill({
      name,
      category: String(newSkillCategory),
      proficiency: String(newSkillProficiency) as SkillEntry["proficiency"],
    });
    setNewSkillName("");
  };

  const handleAddSuggested = (suggested: { name: string; category: string }) => {
    if (skills.some((sk) => sk.name.toLowerCase() === suggested.name.toLowerCase())) return;

    actions.addSkill({
      name: suggested.name,
      category: suggested.category,
      proficiency: (newSkillProficiency || "intermediate") as SkillEntry["proficiency"],
    });
  };

  const filteredSkills = useMemo(() => {
    return activeTab === "All"
      ? skills
      : skills.filter((sk) => sk.category === activeTab);
  }, [activeTab, skills]);

  const availableSuggestions = useMemo(() => {
    return PRE_SUGGESTED_SKILLS.filter(
      (sug) =>
        !skills.some((sk) => sk.name.toLowerCase() === sug.name.toLowerCase()) &&
        (activeTab === "All" || sug.category === activeTab)
    );
  }, [activeTab, skills]);

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your skills"
        description="List technical and soft skills relevant to your target role."
      />

      <form onSubmit={handleAddSkill}>
        <motion.div
          variants={cardVariant}
          className={styles.formCard}
          style={{
            paddingTop: "24px",
            paddingBottom: "24px",
            overflow: "hidden",
          }}
        >
          {/* Form Row */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className={`${styles.formGroup} flex-1 min-w-[200px]`}>
              <label className={styles.label}>Skill Name</label>
              <input
                type="text"
                placeholder="e.g. React, Python, wireframing..."
                className={styles.input}
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-44">
              <CustomDropdown
                label="Category"
                options={CATEGORY_OPTIONS}
                value={newSkillCategory}
                onChange={(val) => setNewSkillCategory(val)}
                placeholder="Category"
              />
            </div>
            <div className="w-full md:w-44">
              <CustomDropdown
                label="Proficiency"
                options={PROFICIENCY_OPTIONS}
                value={newSkillProficiency}
                onChange={(val) => setNewSkillProficiency(val)}
                placeholder="Proficiency"
              />
            </div>
            <div>
              <button type="submit" className={styles.btnAddSolid}>
                <Plus size={16} />
                Add Skill
              </button>
            </div>
          </div>

          {/* Proficiency Level Toggle */}
          <label className={styles.customCheckbox} style={{ marginTop: "1.1rem", marginBottom: "0.4rem" }}>
            <input
              type="checkbox"
              id="toggle-proficiency"
              checked={showProficiency}
              onChange={(e) => actions.toggleShowProficiency(e.target.checked)}
            />
            <span className={styles.checkmark}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={styles.checkboxLabel}>Show proficiency levels in builder</span>
          </label>

          {/* Line ABOVE tabs */}
          <div style={{ height: "1px", background: "var(--border-subtle)", marginTop: "8px" }} />

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-6 mb-2" style={{ paddingTop: "11px" }}>
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className="px-6 py-3 text-lg cursor-pointer transition-all"
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "none",
                    color: isActive ? "var(--text-primary)" : "#525252",
                    borderRadius: 0,
                    fontWeight: 500,
                    paddingBottom: "11px",
                  }}
                  onClick={() => setActiveTab(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ height: "1px", background: "var(--border-subtle)", marginBottom: "16px" }} />

          {/* Skill Chips List */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {filteredSkills.length > 0 && (
              <div className={styles.chipContainer}>
                {filteredSkills.map((sk) => (
                  <span key={sk.id} className={styles.formChip}>
                    {sk.name}
                    {showProficiency && sk.proficiency && (
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#06b6d4",
                          textTransform: "capitalize",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: "rgba(6, 182, 212, 0.1)",
                        }}
                      >
                        {sk.proficiency}
                      </span>
                    )}
                    <button
                      type="button"
                      className={styles.btnRemoveChip}
                      onClick={() => actions.removeSkill(sk.id)}
                      aria-label={`Remove ${sk.name}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredSkills.length === 0 && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                  minHeight: "220px",
                }}
              >
                <Code size={38} strokeWidth={1.5} style={{ marginBottom: "10px", opacity: 0.5 }} />
                <p style={{ fontSize: "14px", fontFamily: "var(--font-sans)", fontStyle: "italic" }}>
                  No skills added under this category.
                </p>
              </div>
            )}

            {/* AI Suggested Skills */}
            {availableSuggestions.length > 0 && (
              <div
                className="text-left mt-4"
                style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "16px", flexShrink: 0 }}
              >
                <div
                  className="flex flex-wrap items-center gap-2"
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  <span className="flex items-center gap-1.5 shrink-0">
                    <Sparkles size={16} style={{ color: "var(--text-primary)" }} /> Suggested for this Category:
                  </span>
                  {availableSuggestions.map((sug) => (
                    <button
                      key={`${sug.category}-${sug.name}`}
                      type="button"
                      onClick={() => handleAddSuggested(sug)}
                      className={styles.btnAdd}
                      style={{
                        width: "auto",
                        padding: "8px 16px",
                        fontSize: "13px",
                      }}
                    >
                      + {sug.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
};
export default SkillsStep;
