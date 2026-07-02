"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, ExperienceEntry } from "../../store";
import { TextInput, MonthYearPicker, CustomDropdown } from "../inputs";
import { StepHeader, cardVariant } from "../navigation";
import { Trash2, Plus, Check } from "lucide-react";
import styles from "../../builder.module.css";

export const ExperienceStep: React.FC = () => {
  const experiences = useResumeStore((state) => state.experiences);
  const actions = useResumeStore((state) => state.actions);

  const handleUpdate = (id: string, field: keyof ExperienceEntry, value: unknown) => {
    actions.updateExperience(id, field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your work experience"
        description="List your most recent roles first. Outline key achievements."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        {experiences.map((exp, index) => (
          <div key={exp.id} className={styles.entryCard}>
            <div className={styles.entryCardHeader}>
              <span className={styles.entryCardTitle}>
                Experience #{index + 1}: {exp.company || "New Company"}
              </span>
              <button
                type="button"
                className={styles.btnDelete}
                onClick={() => actions.removeExperience(exp.id)}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>

            <div className={styles.entryGrid}>
              <TextInput
                label="Company"
                value={exp.company}
                onChange={(e) => handleUpdate(exp.id, "company", e.target.value)}
                placeholder="e.g. Acme Corp"
                required
              />
              <TextInput
                label="Role"
                value={exp.role}
                onChange={(e) => handleUpdate(exp.id, "role", e.target.value)}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
              <TextInput
                label="Location"
                value={exp.location}
                onChange={(e) => handleUpdate(exp.id, "location", e.target.value)}
                placeholder="e.g. San Francisco, CA"
              />
              <CustomDropdown
                label="Employment Type"
                value={exp.employmentType}
                onChange={(val) => handleUpdate(exp.id, "employmentType", val)}
                options={[
                  { value: "Full-time", label: "Full-time" },
                  { value: "Part-time", label: "Part-time" },
                  { value: "Contract", label: "Contract" },
                  { value: "Internship", label: "Internship" },
                  { value: "Freelance", label: "Freelance" },
                ]}
              />
            </div>

            <div className={styles.entryGrid}>
              <MonthYearPicker
                label="Start Date"
                value={exp.startDate}
                onChange={(val) => {
                  handleUpdate(exp.id, "startDate", val);
                  if (!val.month || !val.year) {
                    handleUpdate(exp.id, "endDate", { month: null, year: null });
                  } else if (exp.endDate.month && exp.endDate.year) {
                    const startVal = val.year! * 12 + val.month!;
                    const endVal = exp.endDate.year! * 12 + exp.endDate.month!;
                    if (startVal > endVal) {
                      handleUpdate(exp.id, "endDate", { month: null, year: null });
                    }
                  }
                }}
              />
              <MonthYearPicker
                label="End Date"
                value={exp.endDate}
                onChange={(val) => handleUpdate(exp.id, "endDate", val)}
                disabled={exp.isCurrent || !exp.startDate.month || !exp.startDate.year}
                minDate={exp.startDate.month && exp.startDate.year ? exp.startDate : undefined}
              />
            </div>

            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={exp.isCurrent}
                onChange={(e) => {
                  handleUpdate(exp.id, "isCurrent", e.target.checked);
                  if (e.target.checked) {
                    handleUpdate(exp.id, "endDate", { month: null, year: null });
                  }
                }}
              />
              <span className={styles.checkmark}>
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={styles.checkboxLabel}>I currently work here</span>
            </label>

            <div className={styles.entryGridSpan2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Role Description <span className={styles.charHint} style={exp.description.length >= 480 ? { color: exp.description.length >= 500 ? "#ef4444" : "#f59e0b" } : undefined}>{exp.description.length}/500</span></label>
                <textarea
                  className={styles.textarea}
                  value={exp.description}
                  onChange={(e) => handleUpdate(exp.id, "description", e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Detail your responsibilities and impact (e.g. • Built dashboard interfaces using Next.js...)"
                />
                {exp.description.length >= 480 && (
                  <span style={{ color: exp.description.length >= 500 ? "#ef4444" : "#f59e0b", fontSize: "0.8rem", marginTop: "0.35rem", display: "block" }}>
                    {exp.description.length >= 500 ? "Character limit reached." : `Only ${500 - exp.description.length} characters left.`}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.btnAdd}
          onClick={actions.addExperience}
        >
          <Plus size={15} />
          Add Position
        </button>
      </motion.div>
    </div>
  );
};
export default ExperienceStep;
