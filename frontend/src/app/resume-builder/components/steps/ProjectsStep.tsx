"use client";

import React from "react";
import { motion } from "framer-motion";
import { useResumeStore, ProjectEntry } from "../../store";
import { TextInput, UrlInput, ChipInput, TextareaField } from "../inputs";
import { StepHeader, cardVariant, isValidProjectName, isValidProjectDesc, isValidGithubUrl } from "../navigation";
import { Trash2, Plus, Eraser } from "lucide-react";
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
        {projects.map((proj, index) => {
          const projectNameError = proj.name && !isValidProjectName(proj.name) ? "Project name must be 2-120 characters." : "";
          const projectDescError = proj.description && !isValidProjectDesc(proj.description) ? "Project description must be 20-500 characters." : "";
          const githubError = proj.githubUrl && !isValidGithubUrl(proj.githubUrl) ? "Please enter a valid GitHub URL (e.g. github.com/username)." : "";

          return (
            <div key={proj.id} className={styles.entryCard}>
              <div className={styles.entryCardHeader}>
                <span className={styles.entryCardTitle}>
                  Project #{index + 1}: {proj.name || "New Project"}
                </span>
                {index === 0 ? (
                  <button
                    type="button"
                    className={styles.btnClear}
                    onClick={() => {
                      handleUpdate(proj.id, "name", "");
                      handleUpdate(proj.id, "role", "");
                      handleUpdate(proj.id, "description", "");
                      handleUpdate(proj.id, "technologies", []);
                      handleUpdate(proj.id, "githubUrl", "");
                      handleUpdate(proj.id, "liveDemoUrl", "");
                    }}
                  >
                    <Eraser size={14} />
                    Clear Form
                  </button>
                ) : (
                  <button
                    type="button"
                    className={styles.btnDelete}
                    onClick={() => actions.removeProject(proj.id)}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>

              <div className={styles.entryGrid}>
                <TextInput
                  label="Project Name"
                  value={proj.name}
                  onChange={(e) => handleUpdate(proj.id, "name", e.target.value)}
                  placeholder="e.g. E-Commerce Platform"
                  required
                  error={projectNameError}
                />
                <TextInput
                  label="Role in Project"
                  value={proj.role}
                  onChange={(e) => handleUpdate(proj.id, "role", e.target.value)}
                  placeholder="e.g. Lead Designer & Developer"
                />
              </div>

              <div className={styles.entryGridSpan2}>
                <TextareaField
                  label="Project Description"
                  value={proj.description}
                  onChange={(e) => handleUpdate(proj.id, "description", e.target.value)}
                  maxLength={500}
                  placeholder="e.g. Designed and implemented a responsive web app utilizing Next.js..."
                  required
                  error={projectDescError}
                />
              </div>

              <ChipInput
                label="Technologies Used"
                placeholder="Type tech and press Enter or comma (e.g. Next.js, Redux...)"
                value={proj.technologies}
                onChange={(value) => handleUpdate(proj.id, "technologies", value)}
              />

              <div className={styles.entryGrid}>
                <UrlInput
                  label="GitHub Link"
                  typeOfUrl="github"
                  value={proj.githubUrl}
                  onChange={(e) => handleUpdate(proj.id, "githubUrl", e.target.value)}
                  placeholder="github.com/username/project"
                  error={githubError}
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
          );
        })}

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
