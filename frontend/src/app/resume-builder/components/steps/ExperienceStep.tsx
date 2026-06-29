"use client";

import React from "react";
import { useResumeStore, ExperienceEntry } from "../../store";
import { TextInput, TextareaField, MonthYearPicker } from "../inputs";
import { StepHeader } from "../navigation";
import { Trash2, Plus } from "lucide-react";
import styles from "../../builder.module.css";

export const ExperienceStep: React.FC = () => {
  const experiences = useResumeStore((state) => state.experiences);
  const actions = useResumeStore((state) => state.actions);

  const handleUpdate = (id: string, field: keyof ExperienceEntry, value: any) => {
    actions.updateExperience(id, field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Add your work experience"
        description="List your most recent roles first. Outline key achievements."
      />
      <div className={styles.formCard}>
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
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Employment Type</label>
                <select
                  className={styles.select}
                  value={exp.employmentType}
                  onChange={(e) => handleUpdate(exp.id, "employmentType", e.target.value)}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MonthYearPicker
                label="Start Date"
                value={exp.startDate}
                onChange={(val) => handleUpdate(exp.id, "startDate", val)}
              />
              <MonthYearPicker
                label="End Date"
                value={exp.endDate}
                onChange={(val) => handleUpdate(exp.id, "endDate", val)}
                disabled={exp.isCurrent}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.isCurrent}
                onChange={(e) => {
                  handleUpdate(exp.id, "isCurrent", e.target.checked);
                  if (e.target.checked) {
                    handleUpdate(exp.id, "endDate", { month: null, year: null });
                  }
                }}
                className="w-4 h-4 rounded border-gray-700 bg-black text-cyan-500 focus:ring-0"
              />
              <label htmlFor={`current-${exp.id}`} className="text-xs text-gray-400">
                I currently work here
              </label>
            </div>

            <TextareaField
              label="Role Description"
              value={exp.description}
              onChange={(e) => handleUpdate(exp.id, "description", e.target.value)}
              placeholder="Detail your responsibilities and impact (e.g. • Built dashboard interfaces using Next.js...)"
              rows={4}
            />
          </div>
        ))}

        <button
          type="button"
          className={styles.btnAdd}
          onClick={actions.addExperience}
        >
          <Plus size={16} />
          Add Work Experience
        </button>
      </div>
    </div>
  );
};
export default ExperienceStep;
