"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, EducationEntry } from "../../store";
import { TextInput, TextareaField, MonthYearPicker } from "../inputs";
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
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MonthYearPicker
                label="Start Date"
                value={edu.startDate}
                onChange={(val) => handleUpdate(edu.id, "startDate", val)}
              />
              <MonthYearPicker
                label="End Date (or Expected)"
                value={edu.endDate}
                onChange={(val) => handleUpdate(edu.id, "endDate", val)}
                disabled={edu.isCurrent}
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

            <TextareaField
              label="Description (Optional)"
              value={edu.description}
              onChange={(e) => handleUpdate(edu.id, "description", e.target.value)}
              placeholder="e.g. Special honors, thesis project details..."
              rows={3}
            />
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
