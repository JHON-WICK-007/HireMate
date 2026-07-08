"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./resume.module.css";
import homeStyles from "../home.module.css";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { ResumeCardRender } from "../resume-builder/components/preview";
import builderStyles from "../resume-builder/builder.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Icons
const IconUpload = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconLightbulb = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" /><path d="M12 7a5 5 0 0 0-5 5c0 2 1.5 3 2 4.5V18h6v-1.5c.5-1.5 2-2.5 2-4.5a5 5 0 0 0-5-5Z" /></svg>;
const IconDownload = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IconFile = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
const IconRefresh = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>;
const IconShield = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconLayoutTemplate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M21 12H3" />
    <path d="M12 21V12" />
  </svg>
);
const IconZap = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const IconTarget = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const renderFormattedText = (text: string) => {
  if (!text) return "";
  const parts = text.split("**");
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index} style={{ fontWeight: 700, color: "inherit" }}>{part}</strong>;
    }
    return part;
  });
};

interface ResumeData {
  personalInfo: { fullName: string; email: string; phone: string; links: string[] };
  skills: string[];
  education: { institution: string; degree: string; year: string }[];
  experience: { company: string; role: string; duration: string; description: string }[];
  projects: { name: string; description: string; technologies: string[] }[];
  analysis: {
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    missingSkills: string[];
    improvementSuggestions: string[];
  };
}

const checkCategories = [
  {
    title: "ATS essentials",
    description: "Master the fundamentals of ATS optimization. Learn file format, design, and compliance checks.",
    image: "/ats_essentials.png",
    gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    checks: [
      "File format and size",
      "ATS-friendly design",
      "Professional email address",
      "Header links compliance",
      "Resume file name",
      "Dates and links consistency"
    ],
    duration: "3 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    )
  },
  {
    title: "Content",
    description: "Improve readability and impact. Analyze parse rate, word repetition, and AI rewrite suggestions.",
    image: "/resume_content.png",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    checks: [
      "ATS parse rate",
      "Quantifying impact with AI rewrite suggestions",
      "Repetition of words and phrases",
      "Spelling and grammar",
      "Bullet length and consistency"
    ],
    duration: "3 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    )
  },
  {
    title: "Recruiter red flags",
    description: "Avoid major pitfalls. Detect credibility issues, risk signals, and LinkedIn mismatches.",
    image: "/red_flags.png",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    checks: [
      "Resume credibility",
      "Interview risk signals",
      "Peer benchmarking",
      "LinkedIn profile match"
    ],
    duration: "2 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    )
  },
  {
    title: "Resume sections",
    description: "Organize your profile structure. Verify essential sections, order, and contact info completeness.",
    image: "/resume_sections.png",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    checks: [
      "Essential sections",
      "Contact information",
      "Section order"
    ],
    duration: "1 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    )
  },
  {
    title: "Job tailoring",
    description: "Match job descriptions precisely. Check hard and soft skills, action verbs, and titles.",
    image: "/job_tailoring.png",
    gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    checks: [
      "Hard skills match",
      "Soft skills match",
      "Action verbs",
      "Tailored job title"
    ],
    duration: "2 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  },
  {
    title: "Bias & discrimination",
    description: "Ensure fair evaluation. Detect age, location, and employment gap bias patterns.",
    image: "/bias_discrimination.png",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    checks: [
      "Age and date bias",
      "Employment gaps"
    ],
    duration: "1 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
  {
    title: "Seniority & impact",
    description: "Demonstrate career level and authority. Assess leadership signals and skill evidence.",
    image: "/seniority_impact.png",
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    checks: [
      "Career progression",
      "Skills evidence",
      "Leadership signals"
    ],
    duration: "2 min",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
        <path d="M5 20h14" />
      </svg>
    )
  }
];

const faqItems = [
  {
    question: "How does the AI Resume Optimizer analyze my resume?",
    answer: "HireMate runs your resume through a comprehensive 27-parameter diagnostic scanner. It checks ATS parsing compatibility, sections order, recruiter red flags, content density, and job-tailoring matching to output a detailed, ready-to-use analysis report."
  },
  {
    question: "Is my resume data secure and private?",
    answer: "Yes, absolutely. All resumes uploaded to HireMate are encrypted in transit and at rest, processed within isolated secure servers, and never sold, shared, or used for training AI models without your explicit authorization."
  },
  {
    question: "How can I configure my own Gemini API Key?",
    answer: "You can securely add your Gemini API Key in your Profile Settings panel. By providing your own key, you can bypass public rate limits and ensure maximum performance for resume optimization and mock interviews."
  },
  {
    question: "What does a \"Project\" refer to in the Resume Optimizer?",
    answer: "A Project represents a distinct workspace where you can optimize, manage, and version-control a specific resume. This allows you to keep multiple versions tailored for different job profiles (e.g., Software Engineer vs. Product Manager) simultaneously."
  },
  {
    question: "Do I get updates when ATS screening algorithms change?",
    answer: "Yes, absolutely! We continuously refine our platform, incorporating new ATS algorithm adjustments, recruitment trends, and diagnostic parameters to ensure your resumes always score high."
  }
];

const COLOR_SWATCHES = [
  { value: "#1B365D", label: "Midnight Navy" },
  { value: "#1A1A1A", label: "Classic Black" },
  { value: "#2D3748", label: "Charcoal" },
  { value: "#4A607A", label: "Slate Blue" },
  { value: "#143D2D", label: "Deep Emerald" },
  { value: "#7A2828", label: "Heritage Red" },
  { value: "#B87333", label: "Copper (Signature)" },
  { value: "#C9A84C", label: "Gold (Blueprint)" },
];

const TEMPLATES_LIST = [
  { id: 1, name: "Premium HireMate", desc: "Signature copper hairline, clean single-column ATS-ready layout." },
  { id: 2, name: "Blueprint Schematic", desc: "Architectural left-sidebar navy layout with timeline nodes." },
  { id: 3, name: "Creative Editorial", desc: "Bold left-column layout, modern serif headers, and vertical grids." },
  { id: 4, name: "Modern Technical Grid", desc: "Structured mono-spaced blocks, geometric dividers, and clean metadata." },
  { id: 5, name: "Executive Heritage", desc: "Center-aligned heritage headings, double-border accents, and classic look." },
  { id: 6, name: "Luxury Editorial", desc: "Champagne gold accents, Garamond serif, luxury editorial feel." }
];

const parseDateString = (dateStr: string) => {
  if (!dateStr) return { month: null, year: null };
  const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const cleanStr = dateStr.trim().toLowerCase();
  
  if (cleanStr === "present" || cleanStr === "current") {
    return { month: null, year: null };
  }
  
  const yearMatch = cleanStr.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : null;
  
  let month: number | null = null;
  for (let i = 0; i < monthNames.length; i++) {
    if (cleanStr.includes(monthNames[i])) {
      month = i + 1;
      break;
    }
  }
  return { month, year };
};

const parseDurationRange = (duration: string) => {
  if (!duration) {
    return {
      startDate: { month: null, year: null },
      endDate: { month: null, year: null },
      isCurrent: false
    };
  }
  
  const parts = duration.split(/-|to|–/);
  const startPart = parts[0]?.trim() || "";
  const endPart = parts[1]?.trim() || "";
  
  const startDate = parseDateString(startPart);
  const endDate = parseDateString(endPart);
  
  const isCurrent = endPart.toLowerCase().includes("present") || endPart.toLowerCase().includes("current") || duration.toLowerCase().includes("present");
  
  return {
    startDate,
    endDate: isCurrent ? { month: null, year: null } : endDate,
    isCurrent
  };
};

const transformToBuilderData = (optData: any) => {
  if (!optData) return undefined;

  // Split fullName
  const nameParts = (optData.personalInfo?.fullName || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const surname = nameParts.slice(1).join(" ") || "";

  // Location
  const locParts = (optData.personalInfo?.location || "").split(/,+/);
  const city = locParts[0]?.trim() || "";
  const country = locParts.slice(1).join(", ")?.trim() || "";

  // Links
  const links = optData.personalInfo?.links || [];
  const linkedinUrl = links.find((l: string) => l.includes("linkedin.com")) || "";
  const githubUrl = links.find((l: string) => l.includes("github.com")) || "";
  const portfolioUrl = links.find((l: string) => !l.includes("linkedin.com") && !l.includes("github.com")) || "";

  // Experiences
  const experiences = (optData.experience || []).map((exp: any, index: number) => {
    const dates = parseDurationRange(exp.duration);
    return {
      id: `exp-${index}`,
      role: exp.role || "",
      company: exp.company || "",
      location: "",
      startDate: dates.startDate,
      endDate: dates.endDate,
      isCurrent: dates.isCurrent,
      description: exp.description || ""
    };
  });

  // Educations
  const educations = (optData.education || []).map((edu: any, index: number) => {
    const dates = parseDurationRange(edu.year);
    return {
      id: `edu-${index}`,
      degree: edu.degree || "",
      fieldOfStudy: "",
      institution: edu.institution || "",
      startDate: dates.startDate,
      endDate: dates.endDate,
      isCurrent: dates.isCurrent,
      description: ""
    };
  });

  // Skills
  const skills = (optData.skills || []).map((sk: string, index: number) => {
    return {
      id: `sk-${index}`,
      name: sk,
      category: "Technical"
    };
  });

  // Projects
  const projects = (optData.projects || []).map((proj: any, index: number) => {
    return {
      id: `proj-${index}`,
      name: proj.name || "",
      role: "Developer",
      description: proj.description || "",
      technologies: proj.technologies || []
    };
  });

  return {
    personalInfo: {
      firstName,
      surname,
      email: optData.personalInfo?.email || "",
      phone: optData.personalInfo?.phone || "",
      city,
      country,
      linkedinUrl,
      githubUrl,
      portfolioUrl
    },
    summary: optData.summary || "",
    experiences,
    educations,
    skills,
    projects,
    certifications: []
  };
};

export default function ResumePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "data" | "preview">("analysis");
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>("#B87333");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTemplateId, setTempTemplateId] = useState(1);
  const [tempColor, setTempColor] = useState("#B87333");
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (resumeData) {
      const target = resumeData.analysis.atsScore;
      if (target === 0) {
        setDisplayScore(0);
        return;
      }
      const duration = 1200; // 1.2s
      const startTime = performance.now();

      let animationFrameId: number;
      const updateScore = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = progress * (2 - progress); // quadratic ease-out
        const currentScore = Math.round(easeProgress * target);
        setDisplayScore(currentScore);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateScore);
        }
      };

      animationFrameId = requestAnimationFrame(updateScore);
      return () => cancelAnimationFrame(animationFrameId);
    } else {
      setDisplayScore(0);
    }
  }, [resumeData]);

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (isUploading) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isUploading]);

  const scoreColor = displayScore > 80 ? "#10b981" : displayScore > 60 ? "#f59e0b" : "#ef4444";
  const scoreGlow = displayScore > 80 ? "rgba(16, 185, 129, 0.45)" : displayScore > 60 ? "rgba(245, 158, 11, 0.45)" : "rgba(239, 68, 68, 0.45)";
  const gradientStart = displayScore > 80 ? "#34d399" : displayScore > 60 ? "#fbbf24" : "#f43f5e";
  const gradientEnd = displayScore > 80 ? "#059669" : displayScore > 60 ? "#ea580c" : "#be123c";

  // Arc calculation for indicator tip
  const radius = 42;
  const center = 50;
  const progressPercent = displayScore / 100;
  const angle = (progressPercent * 2 * Math.PI) - (Math.PI / 2);
  const indicatorX = center + radius * Math.cos(angle);
  const indicatorY = center + radius * Math.sin(angle);

  const resumeRef = useRef<HTMLDivElement>(null);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'flex');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'none');
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) { }
      }
      fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
            document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
            router.push("/auth?mode=signin");
          }
        })
        .catch(() => { });
    } else {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
      router.push("/auth?mode=signin");
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) { toast.error("Please select a file first."); return; }

    const formData = new FormData();
    formData.append("resume", file);

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resume/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Resume analyzed successfully!");
        setResumeData(data.data);
      } else {
        // Check for AI service unavailable errors
        const msg = data.message || "";
        if (msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) {
          toast.error("The AI service is temporarily busy. Please wait a moment and try again.");
        } else {
          toast.error(msg || "Failed to analyze resume.");
        }
      }
    } catch (err) {
      toast.error("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewUpload = () => {
    setResumeData(null);
    setFile(null);
    setActiveTab("analysis");
  };

  const exportPDF = async () => {
    if (!resumeRef.current || !resumeData) return;
    setIsExporting(true);
    try {
      const element = resumeRef.current;
      const fullName = (resumeData.personalInfo.fullName || "Resume").trim();

      // Clone the element to manipulate without affecting the live preview DOM
      const clone = element.cloneNode(true) as HTMLElement;

      // Extract the CSS content from the <style> tag before removing it
      const styleEl = element.querySelector("style");
      const cssContent = styleEl?.innerHTML || "";

      // Strip <link> and <style> tags from the clone — they move to <head>
      clone.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach((el) => el.remove());
      clone.querySelectorAll("style").forEach((el) => el.remove());

      // Google Fonts <link> per template
      let googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">`;
      if (selectedTemplateId === 2) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`;
      } else if (selectedTemplateId === 4) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;
      } else if (selectedTemplateId === 6) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">`;
      }

      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${googleFontsLink}
  <style>
    @page { size: A4; margin: 0; }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
    }

    /* Force colour rendering on every element for print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Break-inside control for clean page breaks */
    .resume-container .resume-section,
    .resume-container .content-section,
    .resume-container .entry {
      break-inside: avoid;
    }

    /* Template CSS extracted from preview component */
    ${cssContent}
  </style>
</head>
<body>
  ${clone.innerHTML}
</body>
</html>`;

      toast.success("Generating PDF...", "Compiling vector PDF on backend...");

      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/resume/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`
        },
        body: JSON.stringify({ html: fullHTML })
      });

      if (!response.ok) {
        throw new Error("Failed to compile PDF on the server.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Success ✓", "PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Export Failed", "Could not render PDF document.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportDOCX = async () => {
    if (!resumeData) return;

    try {
      const { AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } = await import("docx");

      // Summary/Bio helper
      const getSummary = () => {
        if (user?.bio && user.bio.trim().length > 0) {
          return user.bio;
        }
        const name = resumeData.personalInfo.fullName || "software engineer";
        const skillList = resumeData.skills.slice(0, 3).join(", ");
        return `I am a software engineer with experience in a variety of programming languages (including ${skillList || "modern developer tools"}) and a track record of delivering quality code. I am skilled in problem-solving and have a strong background in computer science. I am a strong communicator and enjoy working collaboratively with others.`;
      };

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Full Name
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 100 },
              children: [
                new TextRun({
                  text: resumeData.personalInfo.fullName.toUpperCase(),
                  bold: true,
                  size: 48, // 24pt
                  color: "1e293b",
                  font: "Arial"
                })
              ]
            }),

            // Contact Info
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 0, after: 300 },
              children: [
                new TextRun({
                  text: [
                    resumeData.personalInfo.email,
                    resumeData.personalInfo.phone,
                    ...(resumeData.personalInfo.links || [])
                  ].filter(Boolean).join("  |  "),
                  size: 19, // 9.5pt
                  color: "475569",
                  font: "Arial"
                })
              ]
            }),

            // PROFILE SECTION
            new Paragraph({
              spacing: { before: 200, after: 120 },
              border: {
                bottom: { color: "1d4ed8", space: 4, style: BorderStyle.SINGLE, size: 12 }
              },
              children: [
                new TextRun({
                  text: "PROFILE",
                  bold: true,
                  size: 26, // 13pt
                  color: "1d4ed8",
                  font: "Arial"
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 200, line: 300 }, // 1.25 line height
              children: [
                new TextRun({
                  text: getSummary(),
                  size: 22, // 11pt
                  color: "334155",
                  font: "Arial"
                })
              ]
            }),

            // WORK EXPERIENCE SECTION
            new Paragraph({
              spacing: { before: 200, after: 120 },
              border: {
                bottom: { color: "1d4ed8", space: 4, style: BorderStyle.SINGLE, size: 12 }
              },
              children: [
                new TextRun({
                  text: "WORK EXPERIENCE",
                  bold: true,
                  size: 26, // 13pt
                  color: "1d4ed8",
                  font: "Arial"
                })
              ]
            }),

            ...resumeData.experience.flatMap(exp => {
              const bulletPoints = exp.description
                .split(/\n|•|\s+-\s+/)
                .map(p => p.trim())
                .filter(p => p.length > 0);

              return [
                // Role and Company (Left-Right layout using 2-cell Table with no borders)
                new Table({
                  width: { size: 100, type: WidthType.PERCENTAGE },
                  borders: {
                    top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                    insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
                  },
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 70, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              spacing: { before: 100, after: 40 },
                              children: [
                                new TextRun({
                                  text: exp.role,
                                  bold: true,
                                  size: 23, // 11.5pt
                                  color: "0f172a",
                                  font: "Arial"
                                }),
                                new TextRun({
                                  text: `, ${exp.company}`,
                                  bold: false,
                                  italics: true,
                                  size: 23,
                                  color: "475569",
                                  font: "Arial"
                                })
                              ]
                            })
                          ]
                        }),
                        new TableCell({
                          width: { size: 30, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.RIGHT,
                              spacing: { before: 100, after: 40 },
                              children: [
                                new TextRun({
                                  text: exp.duration,
                                  bold: true,
                                  size: 21, // 10.5pt
                                  color: "475569",
                                  font: "Arial"
                                })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Bullet points
                ...bulletPoints.map(bullet => {
                  return new Paragraph({
                    bullet: { level: 0 },
                    spacing: { before: 40, after: 40 },
                    children: [
                      new TextRun({
                        text: bullet,
                        size: 21, // 10.5pt
                        color: "334155",
                        font: "Arial"
                      })
                    ]
                  });
                })
              ];
            }),

            // EDUCATION SECTION
            new Paragraph({
              spacing: { before: 200, after: 120 },
              border: {
                bottom: { color: "1d4ed8", space: 4, style: BorderStyle.SINGLE, size: 12 }
              },
              children: [
                new TextRun({
                  text: "EDUCATION",
                  bold: true,
                  size: 26, // 13pt
                  color: "1d4ed8",
                  font: "Arial"
                })
              ]
            }),

            ...resumeData.education.map(ed => {
              return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" }
                },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 70, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            spacing: { before: 100, after: 60 },
                            children: [
                              new TextRun({
                                text: ed.degree,
                                bold: true,
                                size: 22,
                                color: "0f172a",
                                font: "Arial"
                              }),
                              new TextRun({
                                text: ` - ${ed.institution}`,
                                italics: true,
                                size: 22,
                                color: "475569",
                                font: "Arial"
                              })
                            ]
                          })
                        ]
                      }),
                      new TableCell({
                        width: { size: 30, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 100, after: 60 },
                            children: [
                              new TextRun({
                                text: ed.year,
                                bold: true,
                                size: 21,
                                color: "475569",
                                font: "Arial"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                ]
              });
            }),

            // TECHNICAL SKILLS SECTION
            new Paragraph({
              spacing: { before: 240, after: 120 },
              border: {
                bottom: { color: "1d4ed8", space: 4, style: BorderStyle.SINGLE, size: 12 }
              },
              children: [
                new TextRun({
                  text: "TECHNICAL SKILLS",
                  bold: true,
                  size: 26, // 13pt
                  color: "1d4ed8",
                  font: "Arial"
                })
              ]
            }),
            new Paragraph({
              spacing: { before: 100, after: 100 },
              children: [
                new TextRun({
                  text: resumeData.skills.join("   •   "),
                  size: 22, // 11pt
                  color: "334155",
                  font: "Arial"
                })
              ]
            })
          ]
        }]
      });

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, "HireMate_Resume.docx");
        toast.success("DOCX exported!");
      });
    } catch (err) {
      toast.error("Failed to export DOCX. Please try again.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <Navbar activePage="resume" />

      {/* ─── Loading Overlay ───────────────────────────────── */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className={styles.loadingOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite", marginBottom: "1.5rem" }}>
              <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
            <div className={styles.loadingText}>Analyzing your resume…</div>
            <div className={styles.loadingSubtext}>Our AI is evaluating your resume against ATS standards</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hero / Upload Section ─────────────────────────── */}
      {!resumeData && (
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <motion.div
            className={`${styles.heroOrb} ${styles.heroOrb1}`}
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={`${styles.heroOrb} ${styles.heroOrb2}`}
            animate={{
              y: [0, 10, 0],
              scale: [1, 0.96, 1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className={styles.heroContent}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className={styles.titleBadge} variants={fadeInUp}>
              <span className={styles.titleBadgeDot} />
              AI-Powered Resume Analysis
            </motion.div>
            <motion.h1 className={styles.title} variants={fadeInUp}>Resume Optimizer</motion.h1>
            <motion.p className={styles.subtitle} variants={fadeInUp}>
              Upload your resume and get an instant ATS compatibility score,
              AI-driven improvement suggestions, and a professionally formatted template.
            </motion.p>

            <motion.div className={styles.uploadWrapper} variants={fadeInUp}>
              <div className={`${styles.uploadArea} ${file ? styles.uploadAreaActive : ""}`}>
                <svg className={styles.uploadBorderSvg}>
                  <defs>
                    <linearGradient id="uploadActiveGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="16%" stopColor="#ef4444" />
                      <stop offset="33%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="66%" stopColor="#10b981" />
                      <stop offset="83%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 0.5 0.5"
                        to="360 0.5 0.5"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <rect className={styles.uploadBorderRect} width="100%" height="100%" rx="16" ry="16" />
                </svg>
                {!file && (
                  <div className={styles.uploadIconWrap}>
                    <IconUpload />
                  </div>
                )}
                {file ? (
                  <div className={styles.uploadFileInfo} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.uploadFileIcon}>
                      <IconFile />
                    </div>
                    <div className={styles.uploadFileDetails}>
                      <span className={styles.uploadFileName}>{file.name}</span>
                      <div className={styles.uploadFileMeta}>
                        <span className={styles.uploadFileSize}>{formatFileSize(file.size)}</span>
                        <span className={styles.uploadFileDivider}>•</span>
                        <span className={styles.uploadFileStatus}>
                          Ready to analyze
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.removeFileBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      title="Remove file"
                    >
                      <IconX />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.uploadText}>Drag & drop or click to upload</div>
                    <div className={styles.uploadSubtext}>Supports PDF and DOCX files (max 10MB)</div>
                  </>
                )}
                <input id="fileInput" type="file" accept=".pdf,.docx" className={styles.uploadInput} onChange={handleFileChange} />
              </div>

              <button
                onClick={handleUpload}
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!file || isUploading}
                style={{ minWidth: "220px", justifyContent: "center", padding: "0.85rem 2rem", gap: "0.5rem" }}
              >
                {isUploading ? <><IconSpinner /> Analyzing…</> : "Analyze Resume"}
              </button>
            </motion.div>

            <motion.div className={styles.featuresRow} variants={fadeInUp}>
              <span className={styles.featureChip}><IconShield /> ATS Compatible</span>
              <span className={styles.featureChip}><IconZap /> Instant Results</span>
              <span className={styles.featureChip}><IconTarget /> AI-Powered</span>
            </motion.div>
          </motion.div>
        </section>
      )}

      {!resumeData && (
        <>
          <section className={styles.checksSection}>
            <div className={styles.checksContent}>
              <h2 className={styles.checksTitle}>
                Advanced AI Diagnostics <br />
                Beyond Basic Formatting & Grammar
              </h2>
              <p className={styles.checksSubtitle}>
                HireMate AI runs deep algorithmic audits across 27 critical parameters to ensure your resume is fully optimized for ATS filters and recruiter benchmarks. We evaluate layout compliance, keyword tailoring, red flags, and seniority fit to maximize your interview conversion rate. Here is a full list of the checks performed:
              </p>

              <motion.div
                className={styles.checksGrid}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
              >
                {checkCategories.map((category, index) => {
                  const isLastCard = index === checkCategories.length - 1;
                  const isExpanded = expandedCardId === index;

                  return (
                    <motion.div
                      key={index}
                      className={`${styles.checkCard} ${isLastCard ? styles.cardLast : ""} ${isExpanded ? styles.isExpanded : ""}`}
                      variants={fadeInUp}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setExpandedCardId(isExpanded ? null : index)}
                    >
                      {/* Left Column: Visual Image Box */}
                      <div className={styles.cardVisual}>
                        <img
                          src={category.image}
                          alt={category.title}
                          className={styles.cardVisualBg}
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </div>

                      {/* Right Column: Card Contents */}
                      <div className={styles.cardContent}>
                        <div className={styles.cardHeader}>
                          <h3 className={styles.cardTitle}>{category.title}</h3>
                          <p className={styles.cardDescription}>{category.description}</p>

                          <div className={styles.checklistContainer}>
                            <ul className={styles.cardChecklist}>
                              {category.checks.map((check, cIdx) => (
                                <li key={cIdx}>
                                  <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span>{check}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Card Footer: Stats Row (Mobile Chevron Only) */}
                        <div className={styles.cardStats}>
                          {/* Mobile chevron to indicate expandable list */}
                          <div className={styles.mobileChevron}>
                            <svg
                              className={`${styles.chevronIcon} ${isExpanded ? styles.chevronRotate : ""}`}
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className={styles.faqSection}>
            <div className={styles.faqContent}>
              <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
              <p className={styles.faqSubtitle}>
                Answered all frequently asked questions. Still confused?{" "}
                <Link href="/contact" className={styles.faqLink}>
                  feel free to contact us
                </Link>
              </p>

              <div className={styles.faqList}>
                {faqItems.map((item, idx) => {
                  const isOpen = expandedFaqId === idx;
                  return (
                    <div
                      key={idx}
                      className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                    >
                      <button
                        type="button"
                        className={styles.faqHeader}
                        onClick={() => setExpandedFaqId(isOpen ? null : idx)}
                      >
                        <span className={styles.faqQuestion}>{item.question}</span>
                        <span className={styles.faqToggle}>
                          {isOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                          )}
                        </span>
                      </button>
                      <div
                        className={styles.faqBody}
                        style={{
                          maxHeight: isOpen ? "150px" : "0px",
                          opacity: isOpen ? 1 : 0
                        }}
                      >
                        <p className={styles.faqAnswer}>{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ─── Results Section ───────────────────────────────── */}
      {resumeData && (
        <div className={styles.resultsSection}>
          {/* Score Banner */}
          <motion.div
            className={styles.scoreBanner}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <motion.div
              className={styles.scoreBannerRing}
              style={{
                "--score-color": scoreColor,
                "--score-glow": scoreGlow
              } as React.CSSProperties}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <svg className={styles.scoreRingSvg} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="scoreRingGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradientStart} />
                    <stop offset="100%" stopColor={gradientEnd} />
                  </linearGradient>
                </defs>
                {/* Outer orbit accent ring */}
                <circle
                  className={styles.scoreRingOuterOrbit}
                  cx="50" cy="50" r="48"
                />
                <circle
                  className={styles.scoreRingBg}
                  cx="50" cy="50" r="42"
                />
                {/* Measurement notches/ticks track */}
                <circle
                  className={styles.scoreRingTrack}
                  cx="50" cy="50" r="42"
                />
                {/* Glowing underlay */}
                <circle
                  className={styles.scoreRingFillGlow}
                  cx="50" cy="50" r="42"
                  style={{
                    strokeDasharray: 263.89,
                    strokeDashoffset: 263.89 - (263.89 * displayScore) / 100,
                    stroke: "url(#scoreRingGradient)",
                  } as React.CSSProperties}
                />
                {/* Sharp foreground path */}
                <circle
                  className={styles.scoreRingFill}
                  cx="50" cy="50" r="42"
                  style={{
                    strokeDasharray: 263.89,
                    strokeDashoffset: 263.89 - (263.89 * displayScore) / 100,
                    stroke: "url(#scoreRingGradient)",
                  } as React.CSSProperties}
                />
              </svg>
              <div className={styles.scoreBannerInner}>
                <span className={styles.scoreBannerNumber}>{displayScore}</span>
                <span className={styles.scoreBannerLabel}>ATS</span>
              </div>
            </motion.div>
            <div className={styles.scoreBannerInfo}>
              <div className={styles.scoreBannerName}>{resumeData.personalInfo.fullName}</div>
              <div className={styles.scoreBannerSub}>
                ATS Score: {resumeData.analysis.atsScore}/100 - {resumeData.analysis.atsScore > 80 ? "Well optimized" : resumeData.analysis.atsScore > 60 ? "Needs improvement" : "Needs significant work"}
              </div>
            </div>
            <div className={styles.scoreBannerActions}>
              <button className={`${styles.btn} ${styles.btnGhost}`} onClick={handleNewUpload}>
                <IconRefresh /> New
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === "analysis" ? styles.active : ""}`} onClick={() => setActiveTab("analysis")}>Analysis</button>
            <button className={`${styles.tab} ${activeTab === "data" ? styles.active : ""}`} onClick={() => setActiveTab("data")}>Extracted Data</button>
            <button className={`${styles.tab} ${activeTab === "preview" ? styles.active : ""}`} onClick={() => setActiveTab("preview")}>Resume Preview</button>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Analysis Tab ── */}
            {activeTab === "analysis" && (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={styles.tabPanel}
              >
                <div className={styles.analysisGrid}>
                  {/* Strengths */}
                  <div className={styles.analysisCard}>
                    <div className={`${styles.analysisCardTitle} ${styles.strengthTitle}`}>
                      <IconCheck /> Strengths
                    </div>
                    <ul className={styles.analysisList}>
                      {resumeData.analysis.strengths.slice(0, 5).map((s, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.strength}`}><IconCheck /><span>{renderFormattedText(s)}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className={styles.analysisCard}>
                    <div className={`${styles.analysisCardTitle} ${styles.weaknessTitle}`}>
                      <IconX /> Weaknesses
                    </div>
                    <ul className={styles.analysisList}>
                      {resumeData.analysis.weaknesses.slice(0, 5).map((w, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.weakness}`}><IconX /><span>{renderFormattedText(w)}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className={styles.analysisCard}>
                    <div className={`${styles.analysisCardTitle} ${styles.suggestionTitle}`}>
                      <IconLightbulb /> Suggestions
                    </div>
                    <ul className={styles.analysisList}>
                      {resumeData.analysis.improvementSuggestions.slice(0, 5).map((s, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.suggestion}`}><IconLightbulb /><span>{renderFormattedText(s)}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Missing Skills */}
                {resumeData.analysis.missingSkills?.length > 0 && (
                  <div className={styles.missingSkillsSection}>
                    <div className={styles.missingSkillsLabel}>Missing Skills</div>
                    <div className={styles.missingSkillsWrap}>
                      {resumeData.analysis.missingSkills.map((skill, i) => (
                        <span key={i} className={styles.missingSkillBadge}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Extracted Data Tab ── */}
            {activeTab === "data" && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={styles.tabPanel}
              >
                <div className={styles.dataSection}>
                  <h2 className={styles.dataName}>{resumeData.personalInfo.fullName}</h2>
                  <p className={styles.dataContact}>
                    {[resumeData.personalInfo.email, resumeData.personalInfo.phone].filter(Boolean).join(" • ")}
                  </p>

                  <h3 className={styles.dataSectionTitle}>Skills</h3>
                  <div className={styles.skillTags}>
                    {resumeData.skills.map((s, i) => <span key={i} className={styles.skillTag}>{s}</span>)}
                  </div>

                  <h3 className={styles.dataSectionTitle}>Experience</h3>
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className={styles.expCard}>
                      <div className={styles.expRole}>{exp.role}</div>
                      <div className={styles.expMeta}>
                        <span>{exp.company}</span>
                        <span className={styles.expMetaDot} />
                        <span>{exp.duration}</span>
                      </div>
                      <p className={styles.expDesc}>{exp.description}</p>
                    </div>
                  ))}

                  {resumeData.education.length > 0 && (
                    <>
                      <h3 className={styles.dataSectionTitle} style={{ marginTop: "1.5rem" }}>Education</h3>
                      {resumeData.education.map((ed, i) => (
                        <div key={i} className={styles.expCard}>
                          <div className={styles.expRole}>{ed.degree}</div>
                          <div className={styles.expMeta}>
                            <span>{ed.institution}</span>
                            <span className={styles.expMetaDot} />
                            <span>{ed.year}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {resumeData.projects?.length > 0 && (
                    <>
                      <h3 className={styles.dataSectionTitle} style={{ marginTop: "1.5rem" }}>Projects</h3>
                      {resumeData.projects.map((proj, i) => (
                        <div key={i} className={styles.expCard}>
                          <div className={styles.expRole}>{proj.name}</div>
                          <p className={styles.expDesc}>{proj.description}</p>
                          <div className={styles.skillTags} style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                            {proj.technologies.map((t, j) => <span key={j} className={styles.skillTag} style={{ fontSize: "0.72rem" }}>{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Resume Preview Tab ── */}
            {activeTab === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className={styles.tabPanel}
              >
                <div className={styles.exportBar}>
                  <button
                    type="button"
                    className={styles.btnChangeTemplate}
                    onClick={() => {
                      setTempTemplateId(selectedTemplateId);
                      setTempColor(selectedColor);
                      setHoverColor(null);
                      setIsModalOpen(true);
                    }}
                  >
                    <IconLayoutTemplate />
                    Change Template
                  </button>
                  <div className={styles.exportActions}>
                    <button 
                      className={`${styles.btn} ${styles.btnPrimary}`} 
                      onClick={exportPDF}
                      disabled={isExporting}
                    >
                      <IconDownload /> 
                      {isExporting ? "Exporting..." : "Export PDF"}
                    </button>
                  </div>
                </div>

                <div className={styles.resumePreviewWrap}>
                  <div className={styles.resumePreview} ref={resumeRef} style={{ padding: 0, display: "flex", flexDirection: "column" }}>
                    <ResumeCardRender
                      templateId={selectedTemplateId}
                      color={selectedColor}
                      data={transformToBuilderData(resumeData)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <SiteFooter />

      {/* Select Modal */}
      {isModalOpen && (
        <div className={`${builderStyles.modalBackdrop} backdrop-blur-lg`}>
          <div className={builderStyles.modalCard}>

            {/* Main Body (Split Columns) */}
            <div className={builderStyles.modalBody}>

              {/* Left Column: Live Resume Preview */}
              <div className={builderStyles.modalLeftColumn}>
                <div
                  className={`h-full overflow-y-auto pr-2 custom-scrollbar ${builderStyles.zoomViewportScrollbar}`}
                  style={{ width: `${794 * 0.65 + 20}px` }}
                >
                  <div
                    className="bg-white shadow-lg rounded-sm overflow-hidden flex-shrink-0"
                    style={{
                      width: "794px",
                      minHeight: "1123px",
                      color: "#000000",
                      zoom: 0.65,
                      margin: "auto",
                      userSelect: "none"
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <ResumeCardRender templateId={tempTemplateId} color={hoverColor || tempColor} data={transformToBuilderData(resumeData)} />
                  </div>
                </div>
              </div>

              {/* Right Column: Settings Panel */}
              <div className={builderStyles.modalRightColumn}>

                {/* Header */}
                <div className={builderStyles.modalHeader}>
                  <h3 className={builderStyles.modalTitle}>Change Template</h3>
                  <button
                    type="button"
                    className={builderStyles.modalCloseBtn}
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close"
                  >
                    <IconX />
                  </button>
                </div>

                {/* Fixed Colors Section */}
                <div className={builderStyles.colorsSectionFixed}>
                  <div className={builderStyles.colorsRow}>
                    <span className={builderStyles.colorsLabel}>Colors</span>
                    <div className={builderStyles.colorSwatchesGrid}>
                      {COLOR_SWATCHES.map((swatch) => {
                        const isSelected = tempColor === swatch.value;
                        return (
                          <div
                            key={swatch.value}
                            role="button"
                            tabIndex={0}
                            onClick={() => setTempColor(swatch.value)}
                            onMouseEnter={() => setHoverColor(swatch.value)}
                            onMouseLeave={() => setHoverColor(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setTempColor(swatch.value);
                              }
                            }}
                            className={`${builderStyles.colorSwatchItem} ${isSelected ? builderStyles.colorSwatchItemActive : ""
                              }`}
                            style={{ backgroundColor: swatch.value }}
                            title={swatch.label}
                          >
                            {isSelected && (
                              <span className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className={builderStyles.modalContent}>

                  {/* Templates List */}
                  <div className={builderStyles.modalSection}>
                    <div className={builderStyles.templatesGrid}>
                      {TEMPLATES_LIST.map((temp) => {
                        const isSelected = tempTemplateId === temp.id;
                        return (
                          <div
                            key={temp.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setTempTemplateId(temp.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setTempTemplateId(temp.id);
                              }
                            }}
                            className={`${builderStyles.templateCard} ${isSelected ? builderStyles.templateCardActive : ""
                              }`}
                          >
                            {/* Visual Template Thumbnail */}
                            <div className={builderStyles.templateCardPreview}>
                              <div style={{ transform: "scale(0.24)", transformOrigin: "top center", width: "794px", height: "1123px" }}>
                                <ResumeCardRender templateId={temp.id} color={tempColor} data={transformToBuilderData(resumeData)} />
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-black border border-black flex items-center justify-center shadow-md z-10">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className={builderStyles.modalFooter}>
              <button
                type="button"
                className={builderStyles.modalCancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={builderStyles.modalSaveBtn}
                onClick={() => {
                  setSelectedTemplateId(tempTemplateId);
                  setSelectedColor(tempColor);
                  setIsModalOpen(false);
                  toast.success("Success ✓", "Template and theme color updated!");
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
