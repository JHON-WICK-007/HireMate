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
    question: "Do I get free updates?",
    answer: "Yes, absolutely! We continuously refine our platform, incorporating new ATS algorithm adjustments, UI enhancements, and diagnostic parameters. You will receive all updates automatically and for free."
  },
  {
    question: "What does the number of \"Projects\" refer to?",
    answer: "Projects represent distinct workspaces where you can optimize, manage, and version-control different resumes. You can keep multiple versions tailored for different job profiles (e.g., Software Engineer, Product Manager) simultaneously."
  },
  {
    question: "Can I upgrade to a higher plan?",
    answer: "Yes, you can upgrade your plan at any time through your Profile Billing dashboard. Upgrades take effect immediately, unlocking additional project slots, faster processing, and advanced mock interview sessions."
  },
  {
    question: "What does \"Unlimited Projects\" mean?",
    answer: "Unlimited Projects means there is no cap on the number of resume optimization workspaces you can create. This is ideal for job seekers targeting multiple diverse roles who want separate, customized resume versions for every single application."
  },
  {
    question: "How can I add Gemini API Key?",
    answer: "You can securely add your Gemini API Key in your Profile Settings panel. By providing your own key, you bypass public rate limits and ensure maximum performance during peak hours."
  },
  {
    question: "How does the AI Resume Optimizer analyze my resume?",
    answer: "HireMate runs your resume through a comprehensive 27-parameter diagnostic scanner. It checks ATS parsing compatibility, sections order, recruiter red flags, content density, and job tailoring matching to output a ready-to-use analysis report."
  },
  {
    question: "Is my resume data secure?",
    answer: "Yes. All resumes uploaded to HireMate are encrypted in transit and at rest, processed within isolated secure servers, and never sold, shared, or used for AI training without your explicit authorization."
  }
];

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
  const [selectedTemplate, setSelectedTemplate] = useState<"minimal" | "sidebar" | "classic">("minimal");

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
        } catch (e) {}
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
    if (!resumeRef.current) return;
    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;
      const opt = {
        margin: 0,
        filename: 'HireMate_Resume.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };
      await html2pdf().set(opt).from(resumeRef.current).save();
      toast.success("PDF exported!");
    } catch (err) {
      toast.error("Failed to export PDF. Please try again.");
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
            <div className={styles.loadingSpinner} />
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
                feel free contact with us
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
                {/* Orbiting tip orb indicator */}
                {displayScore > 0 && (
                  <g transform={`translate(${indicatorX}, ${indicatorY})`}>
                    <circle
                      r="4.5"
                      fill={gradientEnd}
                      className={styles.scoreRingIndicatorGlow}
                      style={{
                        filter: `drop-shadow(0 0 5px ${scoreColor})`
                      }}
                    />
                    <circle
                      r="2"
                      fill="#ffffff"
                    />
                  </g>
                )}
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
                  <div className={styles.templateSelector}>
                    <span className={styles.templateSelectorLabel}>Template:</span>
                    <button
                      type="button"
                      className={`${styles.templateBtn} ${selectedTemplate === "minimal" ? styles.templateActive : ""}`}
                      onClick={() => setSelectedTemplate("minimal")}
                    >
                      Charcoal Sidebar
                    </button>
                    <button
                      type="button"
                      className={`${styles.templateBtn} ${selectedTemplate === "sidebar" ? styles.templateActive : ""}`}
                      onClick={() => setSelectedTemplate("sidebar")}
                    >
                      Corporate Blue
                    </button>
                    <button
                      type="button"
                      className={`${styles.templateBtn} ${selectedTemplate === "classic" ? styles.templateActive : ""}`}
                      onClick={() => setSelectedTemplate("classic")}
                    >
                      Modern Timeline
                    </button>
                  </div>
                  <div className={styles.exportActions}>
                    <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={exportPDF}><IconDownload /> Export PDF</button>
                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={exportDOCX}><IconDownload /> Export DOCX</button>
                  </div>
                </div>

                <div className={styles.resumePreviewWrap}>
                  <div className={styles.resumePreview} ref={resumeRef} style={{ padding: 0, display: "flex", flexDirection: "column" }}>
                    {/* Helper to render avatar or placeholder */}
                    {(() => {
                      const RenderAvatar = ({ variant = "circle" }: { variant?: "circle" | "square" }) => {
                        const avatarUrl = user?.avatar;
                        const fullName = resumeData.personalInfo.fullName || "User";
                        const initials = fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase();
                        
                        if (avatarUrl) {
                          return (
                            <div className={variant === "circle" ? styles.avatarCircleWrap : styles.avatarSquareWrap}>
                              <img src={avatarUrl} alt="Profile" className={styles.avatarImg} crossOrigin="anonymous" draggable={false} />
                            </div>
                          );
                        }
                        return (
                          <div className={variant === "circle" ? styles.avatarPlaceholderCircle : styles.avatarPlaceholderSquare}>
                            <span>{initials}</span>
                          </div>
                        );
                      };

                      const formatBulletPoints = (text: string, ulClass: string, liClass: string) => {
                        if (!text) return null;
                        const points = text
                          .split(/\n|•|\s+-\s+/)
                          .map(p => p.trim())
                          .filter(p => p.length > 0);
                        
                        if (points.length <= 1) {
                          return <p className={liClass}>{text}</p>;
                        }
                        return (
                          <ul className={ulClass}>
                            {points.map((pt, i) => (
                              <li key={i} className={liClass}>{pt}</li>
                            ))}
                          </ul>
                        );
                      };

                      // Bio/Summary helper
                      const getSummary = () => {
                        if (user?.bio && user.bio.trim().length > 0) {
                          return user.bio;
                        }
                        const name = resumeData.personalInfo.fullName || "software engineer";
                        const skillList = resumeData.skills.slice(0, 3).join(", ");
                        return `I am a software engineer with experience in a variety of programming languages (including ${skillList || "modern developer tools"}) and a track record of delivering quality code. I am skilled in problem-solving and have a strong background in computer science. I am a strong communicator and enjoy working collaboratively with others.`;
                      };

                      return (
                        <>
                          {/* Template 1: Charcoal Sidebar */}
                          {selectedTemplate === "minimal" && (
                            <div className={`${styles.templateContainer} ${styles.t1Container}`} style={{ margin: 0, padding: 0, flex: 1, display: "flex", width: "100%" }}>
                              {/* Left Dark Sidebar */}
                              <div className={styles.t1Sidebar} style={{ margin: 0 }}>
                                <div className={styles.t1AvatarSection}>
                                  <RenderAvatar variant="circle" />
                                </div>

                                <div className={styles.t1NameSection}>
                                  <h1 className={styles.t1Name}>{resumeData.personalInfo.fullName}</h1>
                                  <div className={styles.t1Title}>
                                    {resumeData.experience?.[0]?.role || "Software Engineer"}
                                  </div>
                                </div>

                                <div className={styles.t1SidebarSection}>
                                  <h3 className={styles.t1SidebarSectionTitle}>CONTACT</h3>
                                  <ul className={styles.t1ContactList}>
                                    {resumeData.personalInfo.phone && (
                                      <li>
                                        <span className={styles.t1ContactIcon}>📞</span>
                                        <span>{resumeData.personalInfo.phone}</span>
                                      </li>
                                    )}
                                    {resumeData.personalInfo.email && (
                                      <li>
                                        <span className={styles.t1ContactIcon}>✉️</span>
                                        <span>{resumeData.personalInfo.email}</span>
                                      </li>
                                    )}
                                    {(resumeData.personalInfo.links || []).map((link, idx) => (
                                      <li key={idx}>
                                        <span className={styles.t1ContactIcon}>🔗</span>
                                        <span className={styles.t1LinkValue}>{link}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {resumeData.skills.length > 0 && (
                                  <div className={styles.t1SidebarSection}>
                                    <h3 className={styles.t1SidebarSectionTitle}>SKILLS</h3>
                                    <ul className={styles.t1List}>
                                      {resumeData.skills.slice(0, 8).map((skill, idx) => (
                                        <li key={idx}>○ {skill}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className={styles.t1SidebarSection}>
                                  <h3 className={styles.t1SidebarSectionTitle}>LANGUAGES</h3>
                                  <ul className={styles.t1List}>
                                    <li>○ English: Proficient</li>
                                    <li>○ Native Language: Proficient</li>
                                  </ul>
                                </div>

                                <div className={styles.t1SidebarSection}>
                                  <h3 className={styles.t1SidebarSectionTitle}>HOBBIES</h3>
                                  <ul className={styles.t1List}>
                                    <li>○ Writing</li>
                                    <li>○ Cricket</li>
                                    <li>○ Music</li>
                                  </ul>
                                </div>
                              </div>

                              {/* Right Main Content */}
                              <div className={styles.t1Main} style={{ margin: 0 }}>
                                <div className={styles.t1Section}>
                                  <h2 className={styles.t1SectionTitle}>PROFILE</h2>
                                  <p className={styles.t1ProfileDesc}>{getSummary()}</p>
                                </div>

                                {resumeData.experience.length > 0 && (
                                  <div className={styles.t1Section}>
                                    <h2 className={styles.t1SectionTitle}>WORK EXPERIENCE</h2>
                                    {resumeData.experience.map((exp, i) => (
                                      <div className={styles.t1WorkItem} key={i}>
                                        <div className={styles.t1ItemHeader}>
                                          <span className={styles.t1ItemRole}>{exp.role}</span>
                                          <span className={styles.t1ItemDuration}>{exp.duration}</span>
                                        </div>
                                        <div className={styles.t1ItemSub}>{exp.company}</div>
                                        {formatBulletPoints(exp.description, styles.t1BulletList, styles.t1BulletItem)}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {resumeData.education.length > 0 && (
                                  <div className={styles.t1Section}>
                                    <h2 className={styles.t1SectionTitle}>EDUCATION</h2>
                                    {resumeData.education.map((ed, i) => (
                                      <div className={styles.t1EduItem} key={i}>
                                        <div className={styles.t1ItemHeader}>
                                          <span className={styles.t1ItemRole}>{ed.degree}</span>
                                          <span className={styles.t1ItemDuration}>{ed.year}</span>
                                        </div>
                                        <div className={styles.t1ItemSub}>{ed.institution}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Template 2: Corporate Blue */}
                          {selectedTemplate === "sidebar" && (
                            <div className={`${styles.templateContainer} ${styles.t2Container}`} style={{ margin: 0, flex: 1 }}>
                              {/* Top Corporate Header */}
                              <div className={styles.t2Header}>
                                <div className={styles.t2HeaderLeft}>
                                  <h1 className={styles.t2Name}>{resumeData.personalInfo.fullName}</h1>
                                  <div className={styles.t2Title}>
                                    {resumeData.experience?.[0]?.role || "Software Engineer"}
                                  </div>
                                  <div className={styles.t2ContactStrip}>
                                    {[
                                      resumeData.personalInfo.email,
                                      resumeData.personalInfo.phone,
                                      ...(resumeData.personalInfo.links || [])
                                    ].filter(Boolean).join("  |  ")}
                                  </div>
                                </div>
                                <div className={styles.t2HeaderRight}>
                                  <RenderAvatar variant="square" />
                                </div>
                              </div>

                              {/* Summary Section */}
                              <div className={styles.t2Section}>
                                <h2 className={styles.t2SectionTitle}>SUMMARY</h2>
                                <p className={styles.t2SummaryText}>{getSummary()}</p>
                              </div>

                              {/* Experience Section */}
                              {resumeData.experience.length > 0 && (
                                <div className={styles.t2Section}>
                                  <h2 className={styles.t2SectionTitle}>PROFESSIONAL EXPERIENCE</h2>
                                  {resumeData.experience.map((exp, i) => (
                                    <div className={styles.t2Item} key={i}>
                                      <div className={styles.t2ItemHeader}>
                                        <span className={styles.t2ItemRole}>{exp.role}, {exp.company}</span>
                                        <span className={styles.t2ItemDuration}>{exp.duration}</span>
                                      </div>
                                      {formatBulletPoints(exp.description, styles.t2BulletList, styles.t2BulletItem)}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Education Section */}
                              {resumeData.education.length > 0 && (
                                <div className={styles.t2Section}>
                                  <h2 className={styles.t2SectionTitle}>EDUCATION</h2>
                                  {resumeData.education.map((ed, i) => (
                                    <div className={styles.t2Item} key={i}>
                                      <div className={styles.t2ItemHeader}>
                                        <span className={styles.t2ItemRole}>{ed.degree}</span>
                                        <span className={styles.t2ItemDuration}>{ed.year}</span>
                                      </div>
                                      <div className={styles.t2ItemSub}>{ed.institution}</div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Skills Section (4-column Grid) */}
                              {resumeData.skills.length > 0 && (
                                <div className={styles.t2Section}>
                                  <h2 className={styles.t2SectionTitle}>TECHNICAL SKILLS</h2>
                                  <div className={styles.t2SkillsGrid}>
                                    {resumeData.skills.slice(0, 12).map((skill, idx) => (
                                      <div key={idx} className={styles.t2SkillItem}>{skill}</div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Additional Info Section */}
                              <div className={styles.t2Section}>
                                <h2 className={styles.t2SectionTitle}>ADDITIONAL INFORMATION</h2>
                                <ul className={styles.t2InfoList}>
                                  <li><strong>Languages:</strong> English, Native Language</li>
                                  <li><strong>Certifications:</strong> Verified Technical Professional License</li>
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* Template 3: Modern Timeline */}
                          {selectedTemplate === "classic" && (
                            <div className={`${styles.templateContainer} ${styles.t3Container}`} style={{ margin: 0, padding: 0, flex: 1, display: "flex", width: "100%" }}>
                              {/* Left Light Gray Sidebar */}
                              <div className={styles.t3Sidebar} style={{ margin: 0 }}>
                                <div className={styles.t3AvatarSection}>
                                  <RenderAvatar variant="circle" />
                                </div>

                                <div className={styles.t3SidebarSection}>
                                  <h3 className={styles.t3SidebarTitle}>ABOUT ME</h3>
                                  <p className={styles.t3AboutText}>{getSummary()}</p>
                                </div>

                                {resumeData.education.length > 0 && (
                                  <div className={styles.t3SidebarSection}>
                                    <h3 className={styles.t3SidebarTitle}>EDUCATION</h3>
                                    {resumeData.education.map((ed, i) => (
                                      <div key={i} className={styles.t3EduItem}>
                                        <div className={styles.t3EduDegree}>{ed.degree}</div>
                                        <div className={styles.t3EduInst}>{ed.institution}</div>
                                        <div className={styles.t3EduYear}>{ed.year}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {resumeData.skills.length > 0 && (
                                  <div className={styles.t3SidebarSection}>
                                    <h3 className={styles.t3SidebarTitle}>SKILLS</h3>
                                    <div className={styles.t3SkillsList}>
                                      {resumeData.skills.slice(0, 6).map((skill, idx) => {
                                        const levels = [95, 85, 80, 75, 70, 65];
                                        const level = levels[idx] || 70;
                                        return (
                                          <div key={idx} className={styles.t3SkillRow}>
                                            <span className={styles.t3SkillName}>{skill}</span>
                                            <div className={styles.t3SkillTrack}>
                                              <div className={styles.t3SkillBar} style={{ width: `${level}%` }} />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className={styles.t3SidebarSection}>
                                  <h3 className={styles.t3SidebarTitle}>LANGUAGE</h3>
                                  <ul className={styles.t3LanguageList}>
                                    <li>English</li>
                                    <li>Native Language</li>
                                  </ul>
                                </div>
                              </div>

                              {/* Right Main Column */}
                              <div className={styles.t3Main} style={{ margin: 0 }}>
                                {/* Dark Top Header Band */}
                                <div className={styles.t3Header}>
                                  <h1 className={styles.t3Name}>{resumeData.personalInfo.fullName}</h1>
                                  <div className={styles.t3Title}>
                                    {resumeData.experience?.[0]?.role || "Software Engineer"}
                                  </div>
                                </div>

                                {/* Contact Grid (2x2) */}
                                <div className={styles.t3ContactGrid}>
                                  {resumeData.personalInfo.phone && (
                                    <div className={styles.t3ContactItem}>
                                      <span className={styles.t3ContactIcon}>📞</span>
                                      <span>{resumeData.personalInfo.phone}</span>
                                    </div>
                                  )}
                                  {resumeData.personalInfo.email && (
                                    <div className={styles.t3ContactItem}>
                                      <span className={styles.t3ContactIcon}>✉️</span>
                                      <span>{resumeData.personalInfo.email}</span>
                                    </div>
                                  )}
                                  {(resumeData.personalInfo.links || []).slice(0, 2).map((link, idx) => (
                                    <div key={idx} className={styles.t3ContactItem}>
                                      <span className={styles.t3ContactIcon}>🔗</span>
                                      <span className={styles.t3LinkValue}>{link}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Experience Timeline */}
                                {resumeData.experience.length > 0 && (
                                  <div className={styles.t3Section}>
                                    <h2 className={styles.t3SectionTitle}>EXPERIENCE</h2>
                                    <div className={styles.t3Timeline}>
                                      {resumeData.experience.map((exp, i) => (
                                        <div className={styles.t3TimelineItem} key={i}>
                                          <div className={styles.t3TimelineNode} />
                                          <div className={styles.t3ItemHeader}>
                                            <span className={styles.t3ItemRole}>{exp.role}</span>
                                            <span className={styles.t3ItemDuration}>{exp.duration}</span>
                                          </div>
                                          <div className={styles.t3ItemSub}>{exp.company}</div>
                                          {formatBulletPoints(exp.description, styles.t3BulletList, styles.t3BulletItem)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* References (2-Column) */}
                                <div className={styles.t3Section}>
                                  <h2 className={styles.t3SectionTitle}>REFERENCES</h2>
                                  <div className={styles.t3ReferencesGrid}>
                                    <div className={styles.t3ReferenceItem}>
                                      <div className={styles.t3RefName}>Harumi Kobayashi</div>
                                      <div className={styles.t3RefTitle}>Wardiere Inc. / CEO</div>
                                      <div className={styles.t3RefContact}>Phone: 123-456-7890</div>
                                      <div className={styles.t3RefContact}>Email: hello@reallygreatsite.com</div>
                                    </div>
                                    <div className={styles.t3ReferenceItem}>
                                      <div className={styles.t3RefName}>Bailey Dupont</div>
                                      <div className={styles.t3RefTitle}>Wardiere Inc. / CEO</div>
                                      <div className={styles.t3RefContact}>Phone: 123-456-7890</div>
                                      <div className={styles.t3RefContact}>Email: hello@reallygreatsite.com</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
