"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useResumeStore, SkillEntry } from "../../store";
import { StepHeader, cardVariant } from "../navigation";
import { Trash2, Plus, Sparkles } from "lucide-react";
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

export const SkillsStep: React.FC = () => {
  const skills = useResumeStore((state) => state.skills);
  const showProficiency = useResumeStore((state) => state.showProficiency);
  const actions = useResumeStore((state) => state.actions);

  const [activeTab, setActiveTab] = useState("All");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("Frontend");
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillEntry["proficiency"]>("advanced");

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newSkillName.trim();
    if (!name) return;

    // Prevent duplicates
    if (skills.some((sk) => sk.name.toLowerCase() === name.toLowerCase())) {
      setNewSkillName("");
      return;
    }

    actions.addSkill({
      name,
      category: newSkillCategory,
      proficiency: newSkillProficiency,
    });
    setNewSkillName("");
  };

  const handleAddSuggested = (suggested: { name: string; category: string }) => {
    if (skills.some((sk) => sk.name.toLowerCase() === suggested.name.toLowerCase())) return;

    actions.addSkill({
      name: suggested.name,
      category: suggested.category,
      proficiency: "advanced",
    });
  };

  const filteredSkills =
    activeTab === "All"
      ? skills
      : skills.filter((sk) => sk.category === activeTab);

  const availableSuggestions = PRE_SUGGESTED_SKILLS.filter(
    (sug) =>
      !skills.some((sk) => sk.name.toLowerCase() === sug.name.toLowerCase()) &&
      (activeTab === "All" || sug.category === activeTab)
  );

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your skills"
        description="List technical and soft skills relevant to your target role."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeTab === cat
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold"
                  : "bg-transparent border border-transparent text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="e.g. React, Python, wireframing..."
              className={styles.input}
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>
          <div>
            <select
              className={styles.select}
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
            >
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </form>

        {/* Proficiency Level Toggle */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="checkbox"
            id="toggle-proficiency"
            checked={showProficiency}
            onChange={(e) => actions.toggleShowProficiency(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-black text-cyan-500 focus:ring-0"
          />
          <label htmlFor="toggle-proficiency" className="text-xs text-gray-400">
            Show proficiency levels in builder
          </label>
        </div>

        {/* Skill Chips List */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((sk) => (
              <span
                key={sk.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-full text-xs text-white"
              >
                <span>{sk.name}</span>
                {showProficiency && (
                  <span className="text-[10px] text-cyan-400 capitalize px-1 py-0.5 rounded bg-cyan-950/40">
                    {sk.proficiency}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => actions.removeSkill(sk.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-500 font-sans italic py-2">
              No skills added under this category.
            </p>
          )}
        </div>

        {/* AI suggested Skills */}
        {availableSuggestions.length > 0 && (
          <div className="border-t border-gray-800 pt-4 text-left">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-3 font-sans">
              <Sparkles size={12} className="text-cyan-400" /> Suggested for this Category:
            </span>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.slice(0, 8).map((sug) => (
                <button
                  key={sug.name}
                  type="button"
                  onClick={() => handleAddSuggested(sug)}
                  className="px-2.5 py-1 rounded-full border border-dashed border-gray-800 hover:border-cyan-500 hover:text-cyan-400 text-gray-500 text-[11px] transition-all bg-transparent cursor-pointer font-sans"
                >
                  + {sug.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
export default SkillsStep;
