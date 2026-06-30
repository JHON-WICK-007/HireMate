"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, ProjectEntry } from "../../store";
import { TextInput, TextareaField, UrlInput, ChipInput } from "../inputs";
import { StepHeader, cardVariant } from "../navigation";
import { Trash2, Plus } from "lucide-react";
import styles from "../../builder.module.css";

export const ProjectsStep: React.FC = () => {
  const projects = useResumeStore((state) => state.projects);
  const actions = useResumeStore((state) => state.actions);

  const handleUpdate = (id: string, field: keyof ProjectEntry, value: any) => {
    actions.updateProject(id, field, value);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepHeader
        title="Showcase your projects"
        description="Add personal or professional projects that demonstrate your skills."
      />
      <motion.div variants={cardVariant} className={styles.formCard}>
        {projects.map((proj, index) => (
          <div key={proj.id} className={styles.entryCard}>
            <div className={styles.entryCardHeader}>
              <span className={styles.entryCardTitle}>
                Project #{index + 1}: {proj.name || "New Project"}
              </span>
              <button
                type="button"
                className={styles.btnDelete}
                onClick={() => actions.removeProject(proj.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                label="Project Name"
                value={proj.name}
                onChange={(e) => handleUpdate(proj.id, "name", e.target.value)}
                placeholder="e.g. E-Commerce Platform"
                required
              />
              <TextInput
                label="Role in Project"
                value={proj.role}
                onChange={(e) => handleUpdate(proj.id, "role", e.target.value)}
                placeholder="e.g. Lead Designer & Developer"
              />
            </div>

            <TextareaField
              label="Project Description"
              value={proj.description}
              onChange={(e) => handleUpdate(proj.id, "description", e.target.value)}
              placeholder="e.g. Designed and implemented a responsive web app utilizing Next.js..."
              rows={3}
            />

            <ChipInput
              label="Technologies Used"
              placeholder="Type tech and press Enter or comma (e.g. Next.js, Redux...)"
              value={proj.technologies}
              onChange={(value) => handleUpdate(proj.id, "technologies", value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UrlInput
                label="GitHub Link"
                typeOfUrl="github"
                value={proj.githubUrl}
                onChange={(e) => handleUpdate(proj.id, "githubUrl", e.target.value)}
                placeholder="github.com/username/project"
              />
              <UrlInput
                label="Live Demo Link"
                typeOfUrl="portfolio"
                value={proj.liveDemoUrl}
                onChange={(e) => handleUpdate(proj.id, "liveDemoUrl", e.target.value)}
                placeholder="project-demo.com"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className={styles.btnAdd}
          onClick={actions.addProject}
        >
          <Plus size={16} />
          Add Project
        </button>
      </motion.div>
    </div>
  );
};
export default ProjectsStep;
