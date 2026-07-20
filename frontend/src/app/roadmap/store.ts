"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SkillNode {
  id: string;
  name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  status: "locked" | "in-progress" | "completed";
  progressPercent: number;
  aiPriority: "high" | "medium" | "low";
  resources: { name: string; url: string; source: string }[];
  practiceQuestions: string[];
  miniProject: { name: string; description: string; tech: string[] };
}

export interface ProjectNode {
  name: string;
  difficulty: string;
  tech: string[];
  estimatedTime: string;
  githubUrl: string;
  description: string;
}

export interface RoadmapPhase {
  id: string;
  order: number;
  title: string;
  status: "locked" | "active" | "completed";
  progressPercent: number;
  estimatedWeeks: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  skills: SkillNode[];
  projects: ProjectNode[];
  aiRationale: string;
}

export interface UserContext {
  targetCompany: string;
  targetRole: string;
  experienceLevel: string;
  currentSkillLevel: string;
  weeklyStudyHours: number;
  learningStyle: string[];
  resumeMatchScore: number;
  weakCompetencies: string[];
}

export interface RoadmapState {
  hasRoadmap: boolean;
  userContext: UserContext | null;
  phases: RoadmapPhase[];
  xp: number;
  streak: number;
  level: number;
  completedSkillsCount: number;
  completedProjectsCount: number;
}

export interface RoadmapStore extends RoadmapState {
  actions: {
    generateRoadmap: (context: UserContext) => void;
    clearRoadmap: () => void;
    toggleSkillStatus: (phaseId: string, skillId: string) => void;
    updateSkillProgress: (phaseId: string, skillId: string, progress: number) => void;
    incrementStreak: () => void;
    addXp: (amount: number) => void;
    completeProject: () => void;
  };
}

const getRoleSkills = (role: string, level: string): string[] => {
  const common = ["Git & GitHub", "Data Structures", "Algorithms"];
  switch (role) {
    case "Frontend":
      return [...common, "HTML5 & CSS3 v4", "Advanced JavaScript (ES6+)", "TypeScript", "React 19 & Hooks", "Next.js 16 App Router", "Tailwind CSS", "CSS Grid & Flexbox", "Web Performance Tuning", "E2E Testing (Playwright)"];
    case "Backend":
      return [...common, "Node.js & Express", "Python & Django", "RESTful APIs & GraphQL", "SQL (PostgreSQL)", "NoSQL (MongoDB)", "Redis Caching", "Docker & Containers", "System Design Patterns", "CI/CD Pipelines"];
    case "Full Stack":
      return [...common, "TypeScript", "React 19 & Next.js", "Node.js & Express", "PostgreSQL", "MongoDB", "Docker", "REST & GraphQL", "System Design", "AWS Deployment"];
    case "AI Engineer":
      return [...common, "Python", "Linear Algebra & Calculus", "LLM APIs (OpenAI, Gemini)", "Prompt Engineering", "LangChain & LlamaIndex", "Vector Databases (Pinecone, Chroma)", "Fine-Tuning Techniques", "Retrieval-Augmented Generation (RAG)", "Model Evaluation"];
    case "ML Engineer":
      return [...common, "Python & R", "NumPy & Pandas", "Scikit-Learn", "TensorFlow & PyTorch", "Supervised & Unsupervised Learning", "Neural Networks & Deep Learning", "MLOps & MLflow", "Data Pipelines (Airflow)", "Feature Stores"];
    case "DevOps":
      return [...common, "Linux Administration", "Bash & Python Scripting", "Docker & Kubernetes", "Terraform (IaC)", "Jenkins & GitHub Actions", "Prometheus & Grafana Monitoring", "Nginx & Load Balancing", "Cloud Security Rules", "AWS / Azure Arch"];
    case "Cybersecurity":
      return [...common, "Networking Foundations", "Linux Security & Hardening", "Ethical Hacking & Penetration Testing", "OWASP Top 10 Audits", "SIEM Tools (Splunk)", "Cryptography Patterns", "Identity & Access Management (IAM)", "Firewalls & VPNs", "Threat Modeling"];
    case "SWE":
    default:
      return [...common, "Object-Oriented Programming (OOP)", "Advanced DSA", "System Design", "Databases (SQL/NoSQL)", "Software Testing (TDD)", "Concurrent Programming", "APIs & Web Services", "Cloud Computing Basics"];
  }
};

const getCompanyFocus = (company: string): string => {
  switch (company) {
    case "Google":
      return "Focus heavily on advanced Data Structures & Algorithms, strict Big-O complexity analysis, and scalable System Design. Google interviews require flawless problem-solving speed and modular coding.";
    case "Amazon":
      return "Focus strictly on Amazon's 16 Leadership Principles and the STAR method for behavioral answers. Core tech focus includes Object-Oriented Design (OOD) and highly scalable distributed systems.";
    case "Microsoft":
      return "Focus on solid fundamentals, data structures, coding clean-code, and modular design. Be ready to explain your logical decisions, cloud service architectures, and project trade-offs.";
    case "Meta":
      return "Focus on rapid-fire coding, optimal solutions, architectural scaling, and system design patterns. Meta interviews evaluate product architecture design and high efficiency under pressure.";
    case "Netflix":
      return "Focus on high-availability system designs, performance optimizations, microservice scaling, and alignment with Netflix's core Freedom and Responsibility culture.";
    case "Stripe":
      return "Focus on clean coding, API design principles, web integration architectures, payment flow security, and debugging production setups.";
    case "OpenAI":
      return "Focus on model architectures, high-performance computing, distributed training bottlenecks, vector storage models, and security of intelligence interfaces.";
    case "Vercel":
      return "Focus on frontend performance, serverless edge networks, Next.js optimization, framework design, and UI micro-interactions.";
    default:
      return "Focus on standard software engineering paradigms, clean code practices, testing, and modern cloud deployment architectures.";
  }
};

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      hasRoadmap: false,
      userContext: null,
      phases: [],
      xp: 0,
      streak: 1,
      level: 1,
      completedSkillsCount: 0,
      completedProjectsCount: 0,

      actions: {
        generateRoadmap: (context) => {
          const roleSkills = getRoleSkills(context.targetRole, context.experienceLevel);
          const companyFocusText = getCompanyFocus(context.targetCompany);

          // Build resource sources based on preferences
          const getResourcesForSkill = (skill: string) => {
            const hasVideo = context.learningStyle.includes("Video");
            const hasPractice = context.learningStyle.includes("Coding Practice");

            const resources = [
              { name: `${skill} Official Documentation`, url: "https://docs.microsoft.com", source: "Docs" },
              { name: `Complete ${skill} Guide - freeCodeCamp`, url: "https://freecodecamp.org", source: "freeCodeCamp" },
            ];

            if (hasVideo) {
              resources.unshift({ name: `Mastering ${skill} Course`, url: "https://youtube.com", source: "YouTube" });
            }
            if (hasPractice) {
              resources.push({ name: `${skill} Interactive Playground`, url: "https://leetcode.com", source: "Practice" });
            }

            return resources;
          };

          const phaseTitles = [
            "Foundations",
            "Core Development",
            "Advanced Topics",
            "Interview Preparation",
            "Portfolio Building",
            "Job Ready",
          ];

          const difficultyScale = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

          const createdPhases = phaseTitles.map((title, index) => {
            const order = index + 1;
            const phaseDifficulty = difficultyScale[Math.min(index, 3)];

            // Split the skills into phases logically
            let phaseSkills: string[] = [];
            if (order === 1) {
              phaseSkills = roleSkills.slice(0, 3);
            } else if (order === 2) {
              phaseSkills = roleSkills.slice(3, 6);
            } else if (order === 3) {
              phaseSkills = roleSkills.slice(6, 9);
            } else if (order === 4) {
              phaseSkills = ["Mock Interview Drills", "Coding Interview Strategy", "Behavioral Interview & STAR"];
            } else if (order === 5) {
              phaseSkills = [`${context.targetRole} Capstone Project`, "Open Source Contribution", "Production Deployment"];
            } else {
              phaseSkills = ["Resume Polish & Optimization", "LinkedIn Branding & Referrals", "Salary Negotiation Prep"];
            }

            const skills: SkillNode[] = phaseSkills.map((name, i) => {
              const skillId = `skill-${order}-${i}`;
              const isFirstSkillActive = order === 1 && i === 0;

              return {
                id: skillId,
                name,
                difficulty: order <= 2 ? "Beginner" : order <= 4 ? "Intermediate" : "Advanced",
                estimatedHours: 5 + (i * 3) + (order * 2),
                status: isFirstSkillActive ? "in-progress" : "locked",
                progressPercent: 0,
                aiPriority: context.weakCompetencies.some(c => name.toLowerCase().includes(c.toLowerCase())) ? "high" : (i % 3 === 0 ? "medium" : "low"),
                resources: getResourcesForSkill(name),
                practiceQuestions: [
                  `Explain the core concepts of ${name}.`,
                  `What are the performance tradeoffs when using ${name}?`,
                  `Describe a scenario where you would avoid using ${name}.`,
                ],
                miniProject: {
                  name: `Mini ${name} Sandbox`,
                  description: `Build a small isolated container to practice ${name} constructs.`,
                  tech: [name, "Git"],
                },
              };
            });

            // Project recommendations per phase
            const projects: ProjectNode[] = [
              {
                name: `${context.targetRole} Phase ${order} Project`,
                difficulty: phaseDifficulty,
                tech: phaseSkills.slice(0, 3),
                estimatedTime: `${5 + order * 5} hours`,
                githubUrl: "https://github.com",
                description: `Design and implement a ${title} module showcasing your newly acquired ${phaseSkills.join(", ")} skills.`,
              }
            ];

            // Formulate custom rationales
            let aiRationale = `This phase introduces the foundational concepts required for a ${context.targetRole} role.`;
            if (order === 4) {
              aiRationale = `Tailored specifically for ${context.targetCompany}. ${companyFocusText}`;
            } else if (order === 3) {
              aiRationale = `Focuses on advanced concepts where your profile indicated gaps. We'll target ${phaseSkills.join(" and ")} to boost your resume score.`;
            } else if (order === 5) {
              aiRationale = `Apply your knowledge. Sourced from your resume details, this project bridges missing credentials for ${context.targetCompany}.`;
            } else if (order === 6) {
              aiRationale = "Final positioning step. Focuses on matching profiles to active recruiter pipelines.";
            }

            return {
              id: `phase-${order}`,
              order,
              title,
              status: (order === 1 ? "active" : "locked") as "locked" | "active" | "completed",
              progressPercent: 0,
              estimatedWeeks: Math.max(1, Math.round(15 / context.weeklyStudyHours * (6 - order + 1))),
              difficulty: phaseDifficulty,
              skills,
              projects,
              aiRationale,
            };
          });

          set({
            hasRoadmap: true,
            userContext: context,
            phases: createdPhases,
            completedSkillsCount: 0,
            completedProjectsCount: 0,
            xp: get().xp + 100, // XP for generating!
          });
        },

        clearRoadmap: () => {
          set({
            hasRoadmap: false,
            userContext: null,
            phases: [],
            completedSkillsCount: 0,
            completedProjectsCount: 0,
          });
        },

        toggleSkillStatus: (phaseId, skillId) => {
          const { phases } = get();
          let skillsCompletedChange = 0;

          const updatedPhases = phases.map((phase) => {
            if (phase.id !== phaseId) return phase;

            const updatedSkills = phase.skills.map((skill) => {
              if (skill.id !== skillId) return skill;

              let newStatus: "locked" | "in-progress" | "completed" = "completed";
              let newProgress = 0;

              if (skill.status === "completed") {
                newStatus = "in-progress";
                newProgress = 50;
                skillsCompletedChange = -1;
              } else {
                newStatus = "completed";
                newProgress = 100;
                skillsCompletedChange = 1;
              }

              return { ...skill, status: newStatus, progressPercent: newProgress };
            });

            // Recalculate phase progress
            const completedCount = updatedSkills.filter(s => s.status === "completed").length;
            const progressPercent = Math.round((completedCount / updatedSkills.length) * 100);
            const status = progressPercent === 100 ? "completed" as const : "active" as const;

            return { ...phase, skills: updatedSkills, progressPercent, status };
          });

          // Cascade active status to next phase if current one completed
          const allCompletedIdxs = updatedPhases
            .map((p, idx) => (p.progressPercent === 100 ? idx : -1))
            .filter(idx => idx !== -1);

          allCompletedIdxs.forEach((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx < updatedPhases.length && updatedPhases[nextIdx].status === "locked") {
              updatedPhases[nextIdx].status = "active";
              if (updatedPhases[nextIdx].skills.length > 0) {
                updatedPhases[nextIdx].skills[0].status = "in-progress";
              }
            }
          });

          const currentXp = get().xp;
          const newXp = currentXp + (skillsCompletedChange > 0 ? 50 : -25);
          const nextLevel = Math.floor(newXp / 1000) + 1;

          set({
            phases: updatedPhases,
            completedSkillsCount: Math.max(0, get().completedSkillsCount + skillsCompletedChange),
            xp: Math.max(0, newXp),
            level: nextLevel,
          });
        },

        updateSkillProgress: (phaseId, skillId, progress) => {
          const { phases } = get();
          let skillsCompletedChange = 0;

          const updatedPhases = phases.map((phase) => {
            if (phase.id !== phaseId) return phase;

            const updatedSkills = phase.skills.map((skill) => {
              if (skill.id !== skillId) return skill;

              const oldCompleted = skill.status === "completed";
              const newStatus = progress === 100 ? "completed" as const : (progress > 0 ? "in-progress" as const : "locked" as const);
              const newCompleted = newStatus === "completed";

              if (!oldCompleted && newCompleted) {
                skillsCompletedChange = 1;
              } else if (oldCompleted && !newCompleted) {
                skillsCompletedChange = -1;
              }

              return { ...skill, progressPercent: progress, status: newStatus };
            });

            const completedCount = updatedSkills.filter(s => s.status === "completed").length;
            const progressPercent = Math.round((completedCount / updatedSkills.length) * 100);
            const status = (progressPercent === 100 ? "completed" : "active") as "locked" | "active" | "completed";

            return { ...phase, skills: updatedSkills, progressPercent, status };
          });

          // Cascade active status to next phase if current one completed
          const allCompletedIdxs = updatedPhases
            .map((p, idx) => (p.progressPercent === 100 ? idx : -1))
            .filter(idx => idx !== -1);

          allCompletedIdxs.forEach((idx) => {
            const nextIdx = idx + 1;
            if (nextIdx < updatedPhases.length && updatedPhases[nextIdx].status === "locked") {
              updatedPhases[nextIdx].status = "active";
              if (updatedPhases[nextIdx].skills.length > 0) {
                updatedPhases[nextIdx].skills[0].status = "in-progress";
              }
            }
          });

          const currentXp = get().xp;
          const newXp = currentXp + (skillsCompletedChange > 0 ? 50 : (skillsCompletedChange < 0 ? -25 : 0));
          const nextLevel = Math.floor(newXp / 1000) + 1;

          set({
            phases: updatedPhases,
            completedSkillsCount: Math.max(0, get().completedSkillsCount + skillsCompletedChange),
            xp: Math.max(0, newXp),
            level: nextLevel,
          });
        },

        incrementStreak: () => {
          set({ streak: get().streak + 1 });
        },

        addXp: (amount) => {
          const newXp = get().xp + amount;
          const nextLevel = Math.floor(newXp / 1000) + 1;
          set({ xp: newXp, level: nextLevel });
        },

        completeProject: () => {
          const newXp = get().xp + 250;
          const nextLevel = Math.floor(newXp / 1000) + 1;
          set({
            completedProjectsCount: get().completedProjectsCount + 1,
            xp: newXp,
            level: nextLevel,
          });
        },
      },
    }),
    {
      name: "hiremate-career-roadmap-store",
      partialize: (state) => ({
        hasRoadmap: state.hasRoadmap,
        userContext: state.userContext,
        phases: state.phases,
        xp: state.xp,
        streak: state.streak,
        level: state.level,
        completedSkillsCount: state.completedSkillsCount,
        completedProjectsCount: state.completedProjectsCount,
      }),
    }
  )
);
