"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PersonalInfo {
  profilePicture: string;
  firstName: string;
  surname: string;
  city: string;
  country: string;
  pinCode: string;
  phone: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  location: string;
  employmentType: string;
  startDate: { month: number | null; year: number | null };
  endDate: { month: number | null; year: number | null };
  isCurrent: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade: string;
  location: string;
  startDate: { month: number | null; year: number | null };
  endDate: { month: number | null; year: number | null };
  isCurrent: boolean;
  description: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  category: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveDemoUrl: string;
  role: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  organization: string;
  issueDate: { month: number | null; year: number | null };
  expiryDate: { month: number | null; year: number | null };
  noExpiry: boolean;
  credentialId: string;
  credentialUrl: string;
}

export interface ResumeState {
  currentStep: number;
  maxStepReached: number;
  selectedTemplate: string;
  selectedTemplateId: number;
  selectedColor: string;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceEntry[];
  educations: EducationEntry[];
  skills: SkillEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  showProficiency: boolean;
  selectedSummaryTemplateId: string | null;
  hasHydrated: boolean;
}

export interface ResumeStore extends ResumeState {
  actions: {
    goToStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void;
    updateSummary: (value: string) => void;
    addExperience: () => void;
    updateExperience: (id: string, field: keyof ExperienceEntry, value: any) => void;
    removeExperience: (id: string) => void;
    reorderExperiences: (startIndex: number, endIndex: number) => void;
    addEducation: () => void;
    updateEducation: (id: string, field: keyof EducationEntry, value: any) => void;
    removeEducation: (id: string) => void;
    reorderEducations: (startIndex: number, endIndex: number) => void;
    addSkill: (skill: Omit<SkillEntry, "id">) => void;
    removeSkill: (id: string) => void;
    toggleShowProficiency: (show: boolean) => void;
    addProject: () => void;
    updateProject: (id: string, field: keyof ProjectEntry, value: any) => void;
    removeProject: (id: string) => void;
    reorderProjects: (startIndex: number, endIndex: number) => void;
    addCertification: () => void;
    updateCertification: (id: string, field: keyof CertificationEntry, value: any) => void;
    removeCertification: (id: string) => void;
    reorderCertifications: (startIndex: number, endIndex: number) => void;
    setSelectedTemplate: (template: string) => void;
    setSelectedTemplateId: (id: number) => void;
    setSelectedColor: (color: string) => void;
    setSelectedSummaryTemplateId: (id: string | null) => void;
    loadFromProfile: (profile: any) => void;
    setHasHydrated: (hydrated: boolean) => void;
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultPersonalInfo: PersonalInfo = {
  profilePicture: "",
  firstName: "",
  surname: "",
  city: "",
  country: "",
  pinCode: "",
  phone: "",
  email: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
};

const defaultExperiences: ExperienceEntry[] = [];
const defaultEducations: EducationEntry[] = [];
const defaultSkills: SkillEntry[] = [];
const defaultProjects: ProjectEntry[] = [];
const defaultCertifications: CertificationEntry[] = [];

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
  currentStep: 1,
  maxStepReached: 1,
  selectedTemplate: "modern",
  selectedTemplateId: 1,
  selectedColor: "#B87333",
  personalInfo: defaultPersonalInfo,
  summary: "",
  experiences: defaultExperiences,
  educations: defaultEducations,
  skills: defaultSkills,
  projects: defaultProjects,
  certifications: defaultCertifications,
  showProficiency: false,
  selectedSummaryTemplateId: null,
  hasHydrated: false,

  actions: {
    goToStep: (step) => set((state) => {
      const clamped = Math.min(Math.max(step, 1), 7);
      return {
        currentStep: clamped,
        maxStepReached: Math.max(state.maxStepReached, clamped),
      };
    }),
    nextStep: () =>
      set((state) => {
        const next = Math.min(state.currentStep + 1, 7);
        return {
          currentStep: next,
          maxStepReached: Math.max(state.maxStepReached, next),
        };
      }),
    prevStep: () =>
      set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1),
      })),
    updatePersonalInfo: (field, value) =>
      set((state) => ({
        personalInfo: {
          ...state.personalInfo,
          [field]: value,
        },
      })),
    updateSummary: (value) => set({ summary: value }),
    addExperience: () =>
      set((state) => ({
        experiences: [
          ...state.experiences,
          {
            id: `exp-${generateId()}`,
            company: "",
            role: "",
            location: "",
            employmentType: "",
            startDate: { month: null, year: null },
            endDate: { month: null, year: null },
            isCurrent: false,
            description: "",
          },
        ],
      })),
    updateExperience: (id, field, value) =>
      set((state) => ({
        experiences: state.experiences.map((exp) =>
          exp.id === id ? { ...exp, [field]: value } : exp
        ),
      })),
    removeExperience: (id) =>
      set((state) => {
        if (state.experiences.length <= 1) {
          return {
            experiences: state.experiences.map((exp) =>
              exp.id === id ? { ...exp, company: "", role: "", location: "", employmentType: "Full-time", startDate: { month: null, year: null }, endDate: { month: null, year: null }, isCurrent: false, description: "" } : exp
            ),
          };
        }
        return { experiences: state.experiences.filter((exp) => exp.id !== id) };
      }),
    reorderExperiences: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.experiences);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { experiences: result };
      }),
    addEducation: () =>
      set((state) => ({
        educations: [
          ...state.educations,
          {
            id: `edu-${generateId()}`,
            institution: "",
            degree: "",
            fieldOfStudy: "",
            grade: "",
            location: "",
            startDate: { month: null, year: null },
            endDate: { month: null, year: null },
            isCurrent: false,
            description: "",
          },
        ],
      })),
    updateEducation: (id, field, value) =>
      set((state) => ({
        educations: state.educations.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu
        ),
      })),
    removeEducation: (id) =>
      set((state) => {
        if (state.educations.length <= 1) {
          return {
            educations: state.educations.map((edu) =>
              edu.id === id ? { ...edu, institution: "", degree: "", fieldOfStudy: "", grade: "", location: "", startDate: { month: null, year: null }, endDate: { month: null, year: null }, isCurrent: false, description: "" } : edu
            ),
          };
        }
        return { educations: state.educations.filter((edu) => edu.id !== id) };
      }),
    reorderEducations: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.educations);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { educations: result };
      }),
    addSkill: (skill) =>
      set((state) => ({
        skills: [...state.skills, { ...skill, id: `sk-${generateId()}` }],
      })),
    removeSkill: (id) =>
      set((state) => ({
        skills: state.skills.filter((sk) => sk.id !== id),
      })),
    toggleShowProficiency: (show) => set({ showProficiency: show }),
    addProject: () =>
      set((state) => ({
        projects: [
          ...state.projects,
          {
            id: `proj-${generateId()}`,
            name: "",
            description: "",
            technologies: [],
            githubUrl: "",
            liveDemoUrl: "",
            role: "",
          },
        ],
      })),
    updateProject: (id, field, value) =>
      set((state) => ({
        projects: state.projects.map((proj) =>
          proj.id === id ? { ...proj, [field]: value } : proj
        ),
      })),
    removeProject: (id) =>
      set((state) => {
        if (state.projects.length <= 1) {
          return {
            projects: state.projects.map((proj) =>
              proj.id === id ? { ...proj, name: "", description: "", technologies: [], githubUrl: "", liveDemoUrl: "", role: "" } : proj
            ),
          };
        }
        return { projects: state.projects.filter((proj) => proj.id !== id) };
      }),
    reorderProjects: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.projects);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { projects: result };
      }),
    addCertification: () =>
      set((state) => ({
        certifications: [
          ...state.certifications,
          {
            id: `cert-${generateId()}`,
            name: "",
            organization: "",
            issueDate: { month: null, year: null },
            expiryDate: { month: null, year: null },
            noExpiry: false,
            credentialId: "",
            credentialUrl: "",
          },
        ],
      })),
    updateCertification: (id, field, value) =>
      set((state) => ({
        certifications: state.certifications.map((cert) =>
          cert.id === id ? { ...cert, [field]: value } : cert
        ),
      })),
    removeCertification: (id) =>
      set((state) => {
        if (state.certifications.length <= 1) {
          return {
            certifications: state.certifications.map((cert) =>
              cert.id === id ? { ...cert, name: "", organization: "", issueDate: { month: null, year: null }, expiryDate: { month: null, year: null }, noExpiry: false, credentialId: "", credentialUrl: "" } : cert
            ),
          };
        }
        return { certifications: state.certifications.filter((cert) => cert.id !== id) };
      }),
    reorderCertifications: (startIndex, endIndex) =>
      set((state) => {
        const result = Array.from(state.certifications);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return { certifications: result };
      }),
    setSelectedTemplate: (template) => set({ selectedTemplate: template }),
    setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
    setSelectedColor: (color) => set({ selectedColor: color }),
    setSelectedSummaryTemplateId: (id) => set({ selectedSummaryTemplateId: id }),
    loadFromProfile: (profile: any) => set((state) => {
      if (!profile) return {};

      const nameParts = (profile.fullName || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const surname = nameParts.slice(1).join(" ") || "";

      const experiences = (profile.experience || []).map((exp: any, index: number) => {
        const durationStr = exp.duration || "";
        const parts = durationStr.split(/[—–-]/).map((p: any) => p.trim());
        
        const parsePart = (part: string) => {
          if (!part || part.toLowerCase() === "present") return { month: null, year: null, isCurrent: true };
          const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
          const match = part.match(/([a-zA-Z]+)?\s*(\d{4})/);
          if (match) {
            const mStr = match[1]?.toLowerCase().substring(0, 3);
            const mIdx = mStr ? months.indexOf(mStr) + 1 : null;
            return { month: mIdx || null, year: parseInt(match[2]), isCurrent: false };
          }
          return { month: null, year: null, isCurrent: false };
        };
        
        const start = parsePart(parts[0] || "");
        const end = parsePart(parts[1] || "");
        const isCurrent = end.isCurrent || start.isCurrent || durationStr.toLowerCase().includes("present");

        return {
          id: `exp-loaded-${index}-${Math.random().toString(36).substring(2, 6)}`,
          company: exp.company || "",
          role: exp.role || "",
          location: "",
          employmentType: "Full-time",
          startDate: { month: start.month, year: start.year },
          endDate: isCurrent ? { month: null, year: null } : { month: end.month, year: end.year },
          isCurrent,
          description: exp.description || ""
        };
      });

      const educations = (profile.education || []).map((edu: any, index: number) => {
        const yearStr = edu.year || "";
        const parts = yearStr.split(/[—–-]/).map((p: any) => p.trim());
        const startYear = parseInt(parts[0]) || null;
        const endYear = parseInt(parts[1] || parts[0]) || null;

        return {
          id: `edu-loaded-${index}-${Math.random().toString(36).substring(2, 6)}`,
          institution: edu.institution || "",
          degree: edu.degree || "",
          fieldOfStudy: edu.field || "",
          grade: "",
          location: "",
          startDate: { month: null, year: startYear },
          endDate: { month: null, year: endYear },
          isCurrent: false,
          description: ""
        };
      });

      const skills = (profile.skills || []).map((s: string, index: number) => ({
        id: `sk-loaded-${index}-${Math.random().toString(36).substring(2, 6)}`,
        name: s,
        category: "Skills",
        proficiency: "advanced"
      }));

      return {
        personalInfo: {
          profilePicture: profile.avatar || state.personalInfo.profilePicture || "",
          firstName: firstName || state.personalInfo.firstName || "",
          surname: surname || state.personalInfo.surname || "",
          city: state.personalInfo.city || "",
          country: state.personalInfo.country || "",
          pinCode: state.personalInfo.pinCode || "",
          phone: profile.phone || state.personalInfo.phone || "",
          email: profile.email || state.personalInfo.email || "",
          linkedinUrl: state.personalInfo.linkedinUrl || "",
          githubUrl: state.personalInfo.githubUrl || "",
          portfolioUrl: state.personalInfo.portfolioUrl || ""
        },
        summary: profile.bio || state.summary || "",
        experiences: experiences.length > 0 ? experiences : state.experiences,
        educations: educations.length > 0 ? educations : state.educations,
        skills: skills.length > 0 ? skills : state.skills,
        projects: state.projects,
        certifications: state.certifications
      };
    }),
    setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
  },
}),
{
  name: "hiremate-resume-step",
  partialize: (state) => {
    const { actions, hasHydrated, ...rest } = state;
    return rest;
  },
  onRehydrateStorage: () => (state) => {
    state?.actions.setHasHydrated(true);
  }
}
)
);
