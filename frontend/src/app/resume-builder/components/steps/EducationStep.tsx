"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, EducationEntry } from "../../store";
import { TextInput, MonthYearPicker } from "../inputs";
import { StepHeader, cardVariant } from "../navigation";
import { Trash2, Plus, Check } from "lucide-react";
import styles from "../../builder.module.css";

export const EducationStep: React.FC = () => {
  const educations = useResumeStore((state) => state.educations);
  const actions = useResumeStore((state) => state.actions);

  const handleUpdate = (id: string, field: keyof EducationEntry, value: any) => {
    actions.updateEducation(id, field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your education"
        description="Include degrees, institutions, and graduation dates."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        {educations.map((edu, index) => (
          <div key={edu.id} className={styles.entryCard}>
            <div className={styles.entryCardHeader}>
              <span className={styles.entryCardTitle}>
                Education #{index + 1}: {edu.institution || "New Institution"}
              </span>
              <button
                type="button"
                className={styles.btnDelete}
                onClick={() => actions.removeEducation(edu.id)}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
            <div className={styles.entryGrid}>
              <TextInput
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleUpdate(edu.id, "institution", e.target.value)}
                placeholder="e.g. Stanford University"
                required
              />
              <TextInput
                label="Degree"
                value={edu.degree}
                onChange={(e) => handleUpdate(edu.id, "degree", e.target.value)}
                placeholder="e.g. Bachelor of Science"
                required
              />
              <TextInput
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) => handleUpdate(edu.id, "fieldOfStudy", e.target.value)}
                placeholder="e.g. Computer Science"
              />
              <TextInput
                label="Grade / GPA"
                value={edu.grade}
                onChange={(e) => handleUpdate(edu.id, "grade", e.target.value)}
                placeholder="e.g. 3.9 GPA or 85%"
              />
            </div>

            <div className={styles.entryGrid}>
              <MonthYearPicker
                label="Start Date"
                value={edu.startDate}
                onChange={(val) => {
                  handleUpdate(edu.id, "startDate", val);
                  if (!val.month || !val.year) {
                    handleUpdate(edu.id, "endDate", { month: null, year: null });
                  } else if (edu.endDate.month && edu.endDate.year) {
                    const startVal = val.year! * 12 + val.month!;
                    const endVal = edu.endDate.year! * 12 + edu.endDate.month!;
                    if (startVal > endVal) {
                      handleUpdate(edu.id, "endDate", { month: null, year: null });
                    }
                  }
                }}
              />
              <MonthYearPicker
                label="End Date (or Expected)"
                value={edu.endDate}
                onChange={(val) => handleUpdate(edu.id, "endDate", val)}
                disabled={edu.isCurrent || !edu.startDate.month || !edu.startDate.year}
                minDate={edu.startDate.month && edu.startDate.year ? edu.startDate : undefined}
              />
            </div>

            <label className={styles.customCheckbox}>
              <input
                type="checkbox"
                checked={edu.isCurrent}
                onChange={(e) => {
                  handleUpdate(edu.id, "isCurrent", e.target.checked);
                  if (e.target.checked) {
                    handleUpdate(edu.id, "endDate", { month: null, year: null });
                  }
                }}
              />
              <span className={styles.checkmark}>
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={styles.checkboxLabel}>I am currently studying here</span>
            </label>

            <div className={styles.entryGridSpan2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Education Description <span className={styles.charHint} style={edu.description.length >= 480 ? { color: edu.description.length >= 500 ? "#ef4444" : "#f59e0b" } : undefined}>{edu.description.length}/500</span></label>
                <textarea
                  className={styles.textarea}
                  value={edu.description}
                  onChange={(e) => handleUpdate(edu.id, "description", e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Detail your achievements and activities (e.g. • Dean's List, Thesis on AI...)"
                />
                {edu.description.length >= 480 && (
                  <span style={{ color: edu.description.length >= 500 ? "#ef4444" : "#f59e0b", fontSize: "0.8rem", marginTop: "0.35rem", display: "block" }}>
                    {edu.description.length >= 500 ? "Character limit reached." : `Only ${500 - edu.description.length} characters left.`}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.btnAdd}
          onClick={actions.addEducation}
        >
          <Plus size={16} />
          Add Education
        </button>
      </motion.div>
    </div>
  );
};
export default EducationStep;
