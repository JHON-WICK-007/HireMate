"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Lock,
  Unlock,
  BookOpen,
  Award,
  TrendingUp,
  Target,
  Flame,
  Shield,
  Zap,
  RotateCcw,
  Compass,
  Trash2,
  Briefcase,
  GraduationCap,
  Info,
  Eraser,
  Sparkles
} from "lucide-react";
import styles from "./roadmap.module.css";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { useToast } from "../components/Toast";
import { useRoadmapStore, UserContext, ProjectNode } from "./store";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const COMPANIES = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Netflix",
  "Apple",
  "Adobe",
  "Uber",
  "Stripe",
  "Vercel",
  "NVIDIA",
  "OpenAI",
  "Zoho",
  "Infosys",
  "TCS",
  "Accenture",
  "Other / General"
];

const ROLES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "AI Engineer",
  "ML Engineer",
  "DevOps",
  "SWE",
  "Data Analyst",
  "Cloud Engineer",
  "Mobile",
  "Cybersecurity"
];

const EXPERIENCE_LEVELS = ["Student", "Fresher", "0–1y", "1–3y", "3–5y", "5+y"];

const LEARNING_STYLES = ["Video", "Articles", "Projects", "Coding Practice", "Mixed"];

const MOTIVATIONAL_QUOTES = [
  "Consistency is the compound interest of self-improvement.",
  "Your dream career is built one commit, one skill, one hour at a time.",
  "Don't practice until you get it right. Practice until you can't get it wrong.",
  "The secret of getting ahead is getting started.",
  "Make it work, make it right, make it fast."
];

/* --- Reusable Custom Dropdown (mirrors builder's CustomDropdown) --- */
interface DropdownOption {
  value: string;
  label: string;
}

interface RoadmapDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  menuMaxHeight?: number;
}

const RoadmapDropdown: React.FC<RoadmapDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  menuMaxHeight,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.customDropdown} ref={containerRef}>
        <button
          type="button"
          className={`${styles.customDropdownTrigger} ${isOpen ? styles.customDropdownTriggerOpen : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption?.label || value}</span>
          <span className={`${styles.customDropdownChevron} ${isOpen ? styles.customDropdownChevronOpen : ""}`}>
            <ChevronDown size={16} />
          </span>
        </button>
        {isOpen && (
          <div className={styles.customDropdownMenu} style={menuMaxHeight ? { maxHeight: `${menuMaxHeight}px` } : undefined}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.customDropdownOption} ${option.value === value ? styles.customDropdownOptionActive : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span>{option.label}</span>
                <span className={styles.customDropdownCheckSlot}>
                  {option.value === value && <Check size={14} strokeWidth={2.5} />}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const getDynamicProjectGuide = (project: ProjectNode, role: string, company: string) => {
  const techList = project.tech.join(", ");

  // Custom steps based on role
  let steps = [
    {
      title: "Step 1: Workspace & Repo Setup",
      desc: `Setup a clean repository. Initialize a local directory, configure a suitable .gitignore for ${project.tech[0] || 'your tech stack'}, and layout folders (e.g. /src for modules and /tests for validations).`
    },
    {
      title: "Step 2: Architecture & Contract Design",
      desc: `Draft interface contracts, modular schemas, or classes. Define data structures or api endpoint signatures using ${techList} to support robust data flow.`
    },
    {
      title: "Step 3: Business Logic Implementation",
      desc: `Code the core logic. Implement features, functions, and state models using ${project.tech.slice(0, 3).join(", ")}. Commit frequently with descriptive messages.`
    },
    {
      title: "Step 4: Quality Validation & Test Cases",
      desc: `Verify implementation against requirements. Execute local unit tests, handle potential exceptions, and ensure proper boundary validation before completion.`
    }
  ];

  if (role === "Frontend") {
    steps[1].desc = `Draft mock visual wireframes and component boundaries. Define TypeScript interfaces for props, local state, and global store contexts using ${techList}.`;
    steps[2].desc = `Build reusable UI components with responsive layouts using ${project.tech.slice(0, 3).join(", ")}. Optimize render loops and bundle sizes.`;
  } else if (role === "Backend") {
    steps[1].desc = `Design SQL/NoSQL schemas and database migration scripts. Setup routing controller matrices and JWT auth rules using ${techList}.`;
    steps[2].desc = `Code endpoint logic, caching layers, and database query handlers using ${project.tech.slice(0, 3).join(", ")}. Maintain separation of concerns.`;
  } else if (role === "DevOps") {
    steps[1].desc = `Design Infrastructure-as-Code (IaC) templates or Dockerfiles. Map networking ports, environment secrets, and volume configs using ${techList}.`;
    steps[2].desc = `Implement CI/CD pipeline automation scripts, container orchestration rules, and runner workflows using ${project.tech.slice(0, 3).join(", ")}.`;
  } else if (role === "AI Engineer" || role === "ML Engineer") {
    steps[1].desc = `Prepare data loading utilities and preprocessing pipelines. Define features, model architecture schemas, or RAG store indexes using ${techList}.`;
    steps[2].desc = `Develop model training scripts, LLM prompt templates, or inference orchestration pipelines using ${project.tech.slice(0, 3).join(", ")}.`;
  }

  // Custom tips based on target company
  let companyTip = `Focus on writing modular, self-documenting code. Adhere to professional code design guidelines, robust error boundaries, and comprehensive unit tests.`;
  if (company === "Google") {
    companyTip = `Google engineering loops prioritize extreme scalability and optimal space/time complexity. Focus on Big-O notations, data structure efficiencies, and optimal algorithms.`;
  } else if (company === "Amazon") {
    companyTip = `Amazon values customer obsession and operational excellence. Focus on highly fault-tolerant microservices, transaction rollbacks, and clean API versioning.`;
  } else if (company === "Microsoft") {
    companyTip = `Microsoft values solid enterprise design patterns and complete type safety. Focus on object-oriented programming (OOP), interface decoupling, and thorough unit test coverage.`;
  } else if (company === "Meta") {
    companyTip = `Meta values rapid iteration and high performance. Focus on frontend layout rendering efficiency, real-time sync capabilities, and optimal memory management.`;
  } else if (company === "Netflix") {
    companyTip = `Netflix operates under high-concurrency conditions. Focus on efficient stream reading, horizontal scaling, caching strategies, and stateless API layouts.`;
  }

  return { steps, companyTip };
};

export default function CareerRoadmapPage() {
  const router = useRouter();
  const toast = useToast();

  // Zustand Store
  const hasRoadmap = useRoadmapStore((state) => state.hasRoadmap);
  const userContext = useRoadmapStore((state) => state.userContext);
  const phases = useRoadmapStore((state) => state.phases);
  const xp = useRoadmapStore((state) => state.xp);
  const streak = useRoadmapStore((state) => state.streak);
  const level = useRoadmapStore((state) => state.level);
  const completedSkillsCount = useRoadmapStore((state) => state.completedSkillsCount);
  const completedProjectsCount = useRoadmapStore((state) => state.completedProjectsCount);
  const { generateRoadmap, clearRoadmap, toggleSkillStatus, updateSkillProgress, incrementStreak, completeProject } = useRoadmapStore((state) => state.actions);

  // Local Intake Form State
  const [targetCompany, setTargetCompany] = useState("Other / General");
  const [targetRole, setTargetRole] = useState("Full Stack");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [currentSkillLevel, setCurrentSkillLevel] = useState("Intermediate");
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(15);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<string[]>(["Video", "Projects"]);

  // Auto-Detected profile state
  const [detectedSkills, setDetectedSkills] = useState<string[]>([]);
  const [detectedResumeScore, setDetectedResumeScore] = useState(65);
  const [detectedWeaknesses, setDetectedWeaknesses] = useState<string[]>(["System Design"]);

  // UI Flow States
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [activeProjectGuide, setActiveProjectGuide] = useState<ProjectNode | null>(null);
  const hasUserInteracted = useRef(false);

  // Load user profile details on mount for auto-detected context
  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch profile
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          const u = data.user;
          if (u.targetCompany) setTargetCompany(u.targetCompany);
          if (u.targetRole) setTargetRole(u.targetRole);
          if (u.skills && u.skills.length > 0) {
            setDetectedSkills(u.skills);
            setDetectedResumeScore(Math.min(85, 60 + u.skills.length * 3));
          }
        }
      })
      .catch(() => { });

    // Fetch interviews to find weak spots
    fetch(`${API_URL}/api/interviews`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.interviews)) {
          const weakList = new Set<string>();
          data.interviews.slice(0, 5).forEach((int: any) => {
            if (int.feedback?.weaknesses) {
              int.feedback.weaknesses.slice(0, 2).forEach((w: string) => {
                if (w && w.length < 30) weakList.add(w);
              });
            }
          });
          if (weakList.size > 0) {
            setDetectedWeaknesses(Array.from(weakList));
          }
        }
      })
      .catch(() => { });
  }, []);

  // Update active phase automatically if none selected
  useEffect(() => {
    if (hasRoadmap && phases.length > 0 && !expandedPhaseId && !hasUserInteracted.current) {
      const activePhase = phases.find(p => p.status === "active") || phases[0];
      setExpandedPhaseId(activePhase.id);
    }
  }, [hasRoadmap, phases, expandedPhaseId]);

  // Lock background scroll when modal guide is open
  useEffect(() => {
    if (activeProjectGuide) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeProjectGuide]);

  // Handle Learning Styles Toggle
  const toggleLearningStyle = (style: string) => {
    setSelectedLearningStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  // Generation status text steps
  const generationStatusLines = [
    "Analyzing your resume profile and mock interview history...",
    `Comparing skills against ${targetRole} requirements at ${targetCompany}...`,
    "Identifying technical gaps and certification milestones...",
    "Building your personalized, adaptive learning phases..."
  ];

  // Start Generation Flow
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate sequenced progress steps
    const timer1 = setTimeout(() => setGenerationStep(1), 1800);
    const timer2 = setTimeout(() => setGenerationStep(2), 3600);
    const timer3 = setTimeout(() => setGenerationStep(3), 5400);
    const timer4 = setTimeout(() => setGenerationStep(4), 7200);

    const timerDone = setTimeout(() => {
      const context: UserContext = {
        targetCompany,
        targetRole,
        experienceLevel,
        currentSkillLevel,
        weeklyStudyHours,
        learningStyle: selectedLearningStyles,
        resumeMatchScore: detectedResumeScore,
        weakCompetencies: detectedWeaknesses
      };
      generateRoadmap(context);
      setIsGenerating(false);
      toast.success("AI Roadmap successfully generated!");
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerDone);
    };
  };

  // derived metrics
  const totalWeeks = phases.reduce((acc, p) => acc + p.estimatedWeeks, 0);
  const totalSkills = phases.reduce((acc, p) => acc + p.skills.length, 0);
  const overallProgress = totalSkills > 0 ? Math.round((completedSkillsCount / totalSkills) * 100) : 0;

  // quote selector based on streak
  const quote = MOTIVATIONAL_QUOTES[streak % MOTIVATIONAL_QUOTES.length];

  if (!isMounted) {
    return (
      <div className={styles.loadingPageContainer}>
        <HomeBackdrop />
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.optimizerSpinner}
        >
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="roadmap" />

      {/* Header section (switches state if roadmap is present) */}
      {hasRoadmap && (
        <header className={styles.heroCompact}>
          <div className={styles.heroHeaderLeft}>
            <h1 className={styles.heroCompactTitle}>
              <Compass className="text-orange-500" size={28} /> Career Journey
            </h1>
            <div className={styles.roleBadge}>
              <Target size={14} className="text-orange-500" />
              {userContext?.targetCompany} - {userContext?.targetRole} - {userContext?.experienceLevel}
            </div>
          </div>
        </header>
      )}

      {/* Dynamic Content Views */}
      <main className={styles.mainContainer}>
        {isGenerating ? (
          /* LOADING STATE CARD */
          <div className={styles.loadingCard}>
            <div className={styles.loadingSpinnerContainer}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className={styles.glowingOrb}
              >
                <Compass size={32} className="text-orange-500" />
              </motion.div>
            </div>
            <h3 className={styles.loadingTitle}>Analyzing Profiles</h3>
            <p className={styles.loadingSubtitle}>Our AI is computing your learning curriculum...</p>
            <div className={styles.loadingStatusList}>
              {generationStatusLines.map((line, idx) => (
                <div
                  key={idx}
                  className={`${styles.loadingStatusItem} ${idx === generationStep
                    ? styles.loadingStatusItemActive
                    : idx < generationStep
                      ? styles.loadingStatusItemDone
                      : ""
                    }`}
                >
                  <div className={styles.statusIconSlot}>
                    {idx < generationStep ? (
                      <div className={styles.statusCircleDone}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    ) : idx === generationStep ? (
                      <div className={styles.statusCircleActive}>
                        <div className={`${styles.statusDotActive} animate-pulse`}></div>
                      </div>
                    ) : (
                      <div className={styles.statusCirclePending}></div>
                    )}
                  </div>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <div className={styles.loadingBarContainer}>
              <div
                className={styles.loadingBarFill}
                style={{ width: `${(generationStep / generationStatusLines.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : !hasRoadmap ? (
          /* EMPTY STATE / GENERATOR INTAKE FORM */
          <div className={styles.generatorWrapper}>
            {/* Left Column: Heading + Info & Features */}
            <div className={styles.infoColumn}>
              <h1 className={styles.heroTitle}>Career Roadmap</h1>
              <p className={styles.infoSubtitle}>
                Unlocks an adaptive, personalized learning path synthesized directly from your resume analyzer score and mock interview diagnostics.
              </p>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Zap size={24} />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Tailored Curriculum</span>
                    <span className={styles.infoValue}>Synthesized directly from your resume keywords and ATS matching score.</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Target size={24} />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Mock Interview Alignment</span>
                    <span className={styles.infoValue}>Targets weak competencies diagnosed during your live chat and voice practice.</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <BookOpen size={24} />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Resource Curation</span>
                    <span className={styles.infoValue}>Hand-picked articles, videos, and documentation from top sources.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Borderless Form Card */}
            <div className={styles.generatorCardBorderless}>
              <div className={styles.generatorHeader}>
                <h2 className={styles.generatorTitle}>Build Your Road Map</h2>
              </div>
              <div className={styles.formGrid}>
                <RoadmapDropdown
                  label="Target Company"
                  value={targetCompany}
                  onChange={setTargetCompany}
                  menuMaxHeight={168}
                  options={COMPANIES.map((c) => ({ value: c, label: c }))}
                />

                <RoadmapDropdown
                  label="Target Role"
                  value={targetRole}
                  onChange={setTargetRole}
                  menuMaxHeight={168}
                  options={ROLES.map((r) => ({ value: r, label: r }))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Experience Level</label>
                <div className={styles.radioGroup}>
                  {EXPERIENCE_LEVELS.map((el) => (
                    <div
                      key={el}
                      onClick={() => setExperienceLevel(el)}
                      className={`${styles.radioPill} ${experienceLevel === el ? styles.radioPillActive : ""
                        }`}
                    >
                      {el}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formGrid}>
                <RoadmapDropdown
                  label="Current Skill Tier"
                  value={currentSkillLevel}
                  onChange={setCurrentSkillLevel}
                  options={[
                    { value: "Beginner", label: "Beginner (just starting out)" },
                    { value: "Intermediate", label: "Intermediate (some experience)" },
                    { value: "Advanced", label: "Advanced (seeking polish)" },
                  ]}
                />

                <div className={styles.field} style={{ marginTop: "24px" }}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.label}>Weekly Study Plan</label>
                    <span className={styles.sliderValue}>{weeklyStudyHours} hrs / week</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="30"
                    step="2"
                    value={weeklyStudyHours}
                    onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                    className={styles.slider}
                    style={{
                      background: `linear-gradient(to right, var(--text-primary) 0%, var(--text-primary) ${((weeklyStudyHours - 2) / (30 - 2)) * 100
                        }%, rgba(255, 255, 255, 0.1) ${((weeklyStudyHours - 2) / (30 - 2)) * 100
                        }%, rgba(255, 255, 255, 0.1) 100%)`
                    }}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Learning Style</label>
                <div className={styles.chipGroup}>
                  {LEARNING_STYLES.map((style) => {
                    const isSelected = selectedLearningStyles.includes(style);
                    return (
                      <div
                        key={style}
                        onClick={() => toggleLearningStyle(style)}
                        className={isSelected ? styles.chipSelected : styles.chipUnselected}
                      >
                        <span>{style}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Auto-detected profiles indicator */}
              {(detectedSkills.length > 0 || detectedWeaknesses.length > 0) && (
                <div className={styles.autoContext}>
                  <span className={styles.autoTitle}>Auto-Detected Profile Context</span>
                  <div className={styles.contextChips}>
                    {detectedSkills.length > 0 && (
                      <span className={styles.contextChip}>
                        Resume Analyzer Scan: {detectedSkills.length} skills found (Match: {detectedResumeScore}%)
                      </span>
                    )}
                    {detectedWeaknesses.map((w, idx) => (
                      <span key={idx} className={styles.contextChip}>
                        Interview Gap: {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => {
                    setTargetCompany("Other / General");
                    setTargetRole("Full Stack");
                    setExperienceLevel("Fresher");
                    setCurrentSkillLevel("Intermediate");
                    setWeeklyStudyHours(16); // step: 2, min: 2, max: 30
                    setSelectedLearningStyles(["Video", "Projects"]);
                  }}
                  className={styles.clearBtn}
                >
                  <Eraser size={16} /> Clear
                </button>
                <button
                  onClick={handleGenerate}
                  className={styles.generateBtn}
                  disabled={selectedLearningStyles.length === 0}
                >
                  <Zap size={16} /> Generate AI Roadmap
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* WORKSPACE VIEW: FULL-WIDTH MASTER DASHBOARD + CANVAS/SIDEBAR */
          <div className="w-full space-y-6">
            {/* Full-Width Master Analytics & Diagnostics Header */}
            <div className={styles.dashHeroBanner}>
              {/* Top Progress Stats Row */}
              <section className={styles.dashStatsGrid}>
                <div className={styles.dashStatBox}>
                  <span className={styles.dashStatLabel}>Current Level</span>
                  <span className={styles.dashStatValue}>{level}</span>
                </div>
                <div className={styles.dashStatBox}>
                  <span className={styles.dashStatLabel}>XP Earned</span>
                  <span className={styles.dashStatValue}>{xp}</span>
                </div>
                <div className={styles.dashStatBox}>
                  <span className={styles.dashStatLabel}>Skills Done</span>
                  <span className={styles.dashStatValue}>
                    {completedSkillsCount} / {totalSkills}
                  </span>
                </div>
                <div className={styles.dashStatBox}>
                  <span className={styles.dashStatLabel}>Est. Weeks left</span>
                  <span className={styles.dashStatValue}>{totalWeeks}</span>
                </div>
              </section>

              {/* Middle Gauge & Competency Gaps */}
              <section className={styles.dashMiddleGrid}>
                <div className={styles.dashGaugeBox}>
                  <div className={styles.dashGaugeRing}>
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                      <defs>
                        <linearGradient id="roadmapScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                      </defs>
                      {/* Outer dashed orbit circle */}
                      <circle
                        cx="50" cy="50" r="47"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="0.75"
                        strokeDasharray="2 4"
                      />
                      {/* Track dashed circle */}
                      <circle
                        className={styles.dashGaugeRingTrack}
                        cx="50" cy="50" r="42"
                      />
                      {/* Glowing underlay */}
                      <circle
                        className={styles.dashGaugeRingFillGlow}
                        cx="50" cy="50" r="42"
                        style={{
                          strokeDasharray: 263.89,
                          strokeDashoffset: 263.89 - (263.89 * overallProgress) / 100,
                          stroke: "url(#roadmapScoreGradient)",
                        } as React.CSSProperties}
                      />
                      {/* Sharp foreground path */}
                      <circle
                        className={styles.dashGaugeRingFill}
                        cx="50" cy="50" r="42"
                        style={{
                          strokeDasharray: 263.89,
                          strokeDashoffset: 263.89 - (263.89 * overallProgress) / 100,
                          stroke: "url(#roadmapScoreGradient)",
                        } as React.CSSProperties}
                      />
                    </svg>
                    <span className={styles.dashGaugeValue}>{overallProgress}%</span>
                  </div>
                  <span className={styles.dashGaugeTitle}>Match Progress</span>
                </div>

                <div className={styles.dashGapsBox}>
                  <div className={styles.dashGapsHeader}>
                    <h4 className={styles.dashGapsTitle}>Role Competency Gaps</h4>
                    <span className={styles.dashGapsSubtitle}>Current vs Target Level</span>
                  </div>
                  <div className={styles.dashGapRow}>
                    <div className={styles.dashGapMeta}>
                      <span className={styles.dashGapName}>Data Structures & Algorithms</span>
                      <span className={styles.dashGapValue}>60% Match</span>
                    </div>
                    <div className={styles.dashGapTrack}>
                      <div className={styles.dashGapBar} style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className={styles.dashGapRow}>
                    <div className={styles.dashGapMeta}>
                      <span className={styles.dashGapName}>System Design & Scaling</span>
                      <span className={styles.dashGapValue}>45% Match</span>
                    </div>
                    <div className={styles.dashGapTrack}>
                      <div className={styles.dashGapBar} style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className={styles.dashGapRow}>
                    <div className={styles.dashGapMeta}>
                      <span className={styles.dashGapName}>STAR Method Behavioral responses</span>
                      <span className={styles.dashGapValue}>75% Match</span>
                    </div>
                    <div className={styles.dashGapTrack}>
                      <div className={styles.dashGapBar} style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Row: Certifications + Learning Streak */}
              <div className={styles.dashBottomGrid}>
                <section className={styles.dashCertsCard}>
                  <h4 className={styles.dashCertsTitle}>Target Recommended Certifications</h4>
                  <div className={styles.dashCertsGrid}>
                    <div className={styles.dashCertItem}>
                      <div className={styles.dashCertIcon}>
                        <Award className="text-orange-500" size={20} />
                      </div>
                      <div className={styles.dashCertMeta}>
                        <span className={styles.dashCertName}>AWS Certified Developer Associate</span>
                        <span className={styles.dashCertTag}>Highly relevant (92% match)</span>
                        <span className={styles.dashCertTrack}>Cloud Foundations track</span>
                      </div>
                    </div>

                    <div className={styles.dashCertItem}>
                      <div className={styles.dashCertIcon}>
                        <Award className="text-orange-500" size={20} />
                      </div>
                      <div className={styles.dashCertMeta}>
                        <span className={styles.dashCertName}>HashiCorp Certified Terraform Associate</span>
                        <span className={styles.dashCertTag}>Recommended for {userContext?.targetRole || "Cloud Engineer"}</span>
                        <span className={styles.dashCertTrack}>Infrastructure management track</span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className={styles.dashStreakCard}>
                  <h4 className={styles.dashCertsTitle}>Daily Learning Streak</h4>
                  <div className={styles.dashStreakInfo}>
                    <Flame className={styles.dashStreakIcon} size={24} />
                    <div className={styles.dashStreakText}>
                      <span className={styles.dashStreakTitle}>{streak} Day Learning Streak</span>
                      <span className={styles.dashStreakDesc}>Keep learning daily to compound your skills!</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      incrementStreak();
                      toast.success("Streak validated! You earned 10 XP.");
                    }}
                    className={styles.dashStreakActionBtn}
                  >
                    <Flame size={14} className="text-amber-200" />
                    Verify Today's Progress
                  </button>
                </section>
              </div>
            </div>

            {/* 2-Column Workspace Layout */}
            <div className={styles.layout}>
            {/* Left Column: Spine & Timeline Canvas */}
            <div className={styles.canvas}>
              <div className={styles.timelineContainer}>
                {/* Loop Phases */}
                {phases.map((phase, idx) => {
                  const isExpanded = expandedPhaseId === phase.id;
                  const isLocked = phase.status === "locked";
                  const isCompleted = phase.status === "completed";
                  const isActive = phase.status === "active";
                  const isLast = idx === phases.length - 1;

                  const isPrevCompleted = idx > 0 && phases[idx - 1].status === "completed";

                  return (
                    <div
                      key={phase.id}
                      className={`${styles.phaseContainer} ${isExpanded ? styles.phaseContainerExpanded : ""
                        }`}
                    >
                      {/* Top Connector Segment (runs from container top to node center) */}
                      {idx > 0 && (
                        <div className={styles.phaseConnectorTop}>
                          <div
                            className={`${styles.phaseConnectorFill} ${isPrevCompleted ? styles.phaseConnectorActive : ""
                              }`}
                          />
                        </div>
                      )}

                      {/* Bottom Connector Segment (runs from node center to bottom gap) */}
                      {!isLast && (
                        <div className={styles.phaseConnectorBottom}>
                          <div
                            className={`${styles.phaseConnectorFill} ${isCompleted ? styles.phaseConnectorActive : ""
                              }`}
                          />
                        </div>
                      )}

                      {/* Spine connector Node */}
                      <div
                        className={`${styles.phaseNode} ${isCompleted
                            ? styles.phaseNodeCompleted
                            : isActive
                              ? styles.phaseNodeActive
                              : ""
                          }`}
                      >
                        {isCompleted && <Check size={12} className="text-black" />}
                      </div>

                      <div
                        className={`${styles.phaseCard} ${phase.status === "active" ? styles.phaseCardActive : ""
                          }`}
                      >
                        {/* Collapsible header click triggers toggle */}
                        <div
                          onClick={() => {
                            hasUserInteracted.current = true;
                            setExpandedPhaseId(isExpanded ? null : phase.id);
                          }}
                          className={styles.phaseHeader}
                          style={{ cursor: "pointer" }}
                        >
                          <div className={styles.phaseMeta}>
                            <div className={styles.phaseTitleRow}>
                              <span className={styles.phaseNumber}>Phase {phase.order}</span>
                              <h3 className={styles.phaseTitle}>{phase.title}</h3>
                            </div>
                            <span className={styles.phaseSub}>
                              <span>{phase.skills.length} skills</span>
                              <span>•</span>
                              <span>{phase.estimatedWeeks} weeks</span>
                              {phase.progressPercent > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-500 font-medium">{phase.progressPercent}% done</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className={styles.phaseMetrics}>
                            <span className={styles.difficultyBadge}>{phase.difficulty}</span>
                            {isLocked ? (
                              <Lock size={16} className="text-neutral-600" />
                            ) : isExpanded ? (
                              <ChevronUp size={18} className={styles.chevron} />
                            ) : (
                              <ChevronDown size={18} className={styles.chevron} />
                            )}
                          </div>
                        </div>

                        {/* Expandable Phase Details Drawer */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className={styles.phaseDetails}>
                                {/* AI Rationale */}
                                <div className={styles.rationaleBox}>
                                  <div className={styles.rationaleTitle}>AI Curator Explanation</div>
                                  <p className={styles.rationaleText}>{phase.aiRationale}</p>
                                </div>

                                {/* Skills Grid */}
                                <div className={styles.skillsGroup}>
                                  <h4 className={styles.skillsGroupLabel}>
                                    Skills Checklist
                                  </h4>
                                  <div className={styles.skillsGrid}>
                                    {phase.skills.map((skill) => {
                                      const isSkillCompleted = skill.status === "completed";
                                      const isSkillExpanded = expandedSkillId === skill.id;
                                      const hoursStudied = Math.min(
                                        skill.estimatedHours,
                                        Math.max(0, Math.round((skill.progressPercent / 100) * skill.estimatedHours))
                                      );

                                      return (
                                        <div
                                          key={skill.id}
                                          onClick={() => setExpandedSkillId(isSkillExpanded ? null : skill.id)}
                                          className={`${styles.skillCard} ${isSkillCompleted ? styles.skillCardCompleted : ""
                                            }`}
                                        >
                                          <div className={styles.skillHeader}>
                                            <div className={styles.skillInfo}>
                                              <span className={styles.skillName}>{skill.name}</span>
                                              {skill.aiPriority === "high" && (
                                                <span className={styles.skillPriority}>AI Focus Target</span>
                                              )}
                                            </div>

                                            {/* Top-Right Hours Input Tracker */}
                                            <div
                                              className={styles.skillHoursInputContainer}
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Clock size={11} className="text-purple-500 mr-0.5" />
                                              <input
                                                type="number"
                                                min={0}
                                                max={skill.estimatedHours}
                                                step={1}
                                                placeholder="0"
                                                value={hoursStudied === 0 ? "" : hoursStudied}
                                                onFocus={(e) => e.target.select()}
                                                onChange={(e) => {
                                                  const val = parseFloat(e.target.value) || 0;
                                                  const constrained = Math.min(skill.estimatedHours, Math.max(0, val));
                                                  const newPercent = Math.round((constrained / skill.estimatedHours) * 100);
                                                  updateSkillProgress(phase.id, skill.id, newPercent);
                                                }}
                                                className={styles.skillHoursInputField}
                                              />
                                              <span className={styles.skillHoursInputDivider}>/</span>
                                              <span className={styles.skillHoursInputTotal}>{skill.estimatedHours} hrs</span>
                                            </div>
                                          </div>

                                          <div className={styles.skillFooter}>
                                            <span className="capitalize">{skill.difficulty}</span>
                                            <span className="text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1 text-xs">
                                              {isSkillExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </span>
                                          </div>

                                          {/* Full-width progress fill bar */}
                                          <div className={styles.skillProgress}>
                                            <div
                                              className={styles.skillProgressFill}
                                              style={{ clipPath: `inset(0 ${100 - skill.progressPercent}% 0 0)` }}
                                            ></div>
                                          </div>

                                          {/* Expandable Resources Drawer inside skill card */}
                                          <AnimatePresence initial={false}>
                                            {isSkillExpanded && (
                                              <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden w-full"
                                              >
                                                <div
                                                  className={styles.skillDrawer}
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <div>
                                                    <div className={styles.drawerSectionTitle}>
                                                      <BookOpen size={12} /> Recommended Resources
                                                    </div>
                                                    <div className={styles.resourceTags}>
                                                      {skill.resources.map((res, rIdx) => (
                                                        <a
                                                          key={rIdx}
                                                          href={res.url}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          className={styles.resourceLink}
                                                          onClick={(e) => e.stopPropagation()}
                                                        >
                                                          <span className="text-yellow-500 font-semibold">
                                                            [{res.source}]
                                                          </span>
                                                          <span>{res.name}</span>
                                                        </a>
                                                      ))}
                                                    </div>
                                                  </div>

                                                  <div>
                                                    <div className={styles.drawerSectionTitle}>
                                                      <Zap size={12} /> Practice Sandbox Assignment
                                                    </div>
                                                    <div className={styles.miniProjectBox}>
                                                      <div className={styles.miniProjectName}>
                                                        {skill.miniProject.name}
                                                      </div>
                                                      <p className={styles.miniProjectDesc}>
                                                        {skill.miniProject.description}
                                                      </p>
                                                      <div className={styles.projectTechs}>
                                                        {skill.miniProject.tech.map((t) => (
                                                          <span key={t} className={styles.projectTech}>
                                                            {t}
                                                          </span>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div>
                                                    <div className={styles.drawerSectionTitle}>
                                                      <Info size={12} /> Key Interview Diagnostics
                                                    </div>
                                                    <div className={styles.questionsList}>
                                                      {skill.practiceQuestions.map((q, qIdx) => (
                                                        <div key={qIdx} className={styles.questionItem}>
                                                          {q}
                                                        </div>
                                                      ))}
                                                    </div>
                                                  </div>
                                                </div>
                                              </motion.div>
                                            )}
                                          </AnimatePresence>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Phase Recommended Projects */}
                                {phase.projects.length > 0 && (
                                  <div>
                                    <div className={styles.phaseProjectsTitle}>
                                      <Briefcase size={12} /> Phase Recommended Projects
                                    </div>
                                    <div className={styles.projectsList}>
                                      {phase.projects.map((proj, pIdx) => (
                                        <div key={pIdx} className={styles.recProjectCard}>
                                          <div className={styles.recProjHeader}>
                                            <span className={styles.recProjTitle}>{proj.name}</span>
                                            <div className={styles.recProjMeta}>
                                              <span>{proj.difficulty}</span>
                                              <span>•</span>
                                              <span>{proj.estimatedTime}</span>
                                            </div>
                                          </div>
                                          <p className={styles.recProjDesc}>{proj.description}</p>
                                          <div className={styles.recProjFooter}>
                                            <div className={styles.projectTechs}>
                                              {proj.tech.map((t) => (
                                                <span key={t} className={styles.projectTech}>
                                                  {t}
                                                </span>
                                              ))}
                                            </div>
                                            <button
                                              disabled={isLocked}
                                              onClick={() => {
                                                if (isLocked) return;
                                                setActiveProjectGuide(proj);
                                              }}
                                              className={`${styles.startProjBtn} ${isLocked ? styles.startProjBtnLocked : ""
                                                }`}
                                            >
                                              Start Project
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: AI Insights Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.widget}>
                <div className={styles.widgetHeader}>
                  <Compass className={styles.widgetHeaderIcon} size={18} />
                  <span>AI Insights Panel</span>
                </div>

                {/* Cluster 1 — Where you stand */}
                <div>
                  <h5 className={styles.widgetSectionTitle}>Where you stand</h5>
                  <div className={styles.metricRow}>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Resume Match Rate</span>
                      <span className={styles.metricValue}>{userContext?.resumeMatchScore}%</span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Interview Readiness</span>
                      <span className={styles.metricValue}>
                        {Math.min(95, 45 + completedSkillsCount * 4)}%
                      </span>
                    </div>
                  </div>
                  <div className={styles.sidebarMetricGroup}>
                    <span className={styles.sidebarSubLabel}>
                      Identified Strengths
                    </span>
                    <div className={styles.sidebarChips}>
                      <span className={`${styles.sidebarChip} ${styles.sidebarChipGreen}`}>Fast Learner</span>
                      <span className={`${styles.sidebarChip} ${styles.sidebarChipGreen}`}>Coding Consistency</span>
                    </div>
                  </div>
                  <div className={styles.sidebarMetricGroup}>
                    <span className={styles.sidebarSubLabel}>
                      Identified Gaps
                    </span>
                    <div className={styles.sidebarChips}>
                      {userContext?.weakCompetencies.map((w, idx) => (
                        <span key={idx} className={`${styles.sidebarChip} ${styles.sidebarChipRed}`}>
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cluster 2 — Where you're headed */}
                <div>
                  <h5 className={styles.widgetSectionTitle}>Where you're headed</h5>
                  <div className={styles.metricRow}>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Est. Completion</span>
                      <span className={styles.metricValue}>
                        {new Date(Date.now() + totalWeeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
                          undefined,
                          { month: "short", year: "numeric" }
                        )}
                      </span>
                    </div>
                    <div className={styles.metricCell}>
                      <span className={styles.metricLabel}>Hiring Probability</span>
                      <span className={styles.metricValueOrange}>
                        {Math.min(98, 30 + completedSkillsCount * 6)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cluster 3 — What to do today */}
                <div>
                  <h5 className={styles.widgetSectionTitle}>Today's Target Action</h5>
                  <div className={styles.dailyRecBox}>
                    <span className={styles.dailyRecTitle}>Daily Recommendation</span>
                    <p className={styles.dailyRecText}>
                      Dedicate 45 minutes to complete the first task in Phase{" "}
                      {phases.find((p) => p.status === "active")?.order || 1}.
                    </p>
                  </div>
                </div>

                {/* Motivational quotes */}
                <div className={styles.quoteBox}>{quote}</div>
              </div>

              {/* Regenerate button (placed outside the glass card) */}
              <button
                onClick={() => {
                  toast.warning("Rebuild Roadmap?", {
                    description: "Are you sure you want to rebuild your roadmap? Progress stats will reset.",
                    confirmLabel: "Rebuild",
                    onConfirm: () => {
                      clearRoadmap();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    },
                    duration: 6000
                  });
                }}
                className={styles.regenBtnSidebar}
              >
                <RotateCcw size={12} /> Regenerate Roadmap
              </button>
            </aside>
          </div>
        </div>
      )}
    </main>

      {/* --- Project Guide Modal Overlay --- */}
      <AnimatePresence>
        {activeProjectGuide && (
          <div className={styles.modalOverlay}>
            <motion.div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalTitleArea}>
                  <Compass className="text-orange-500" size={22} />
                  <h3 className={styles.modalTitle}>{activeProjectGuide.name}</h3>
                </div>
                <button
                  className={styles.modalCloseBtn}
                  onClick={() => setActiveProjectGuide(null)}
                  aria-label="Close guide"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tags strip */}
              <div className={styles.modalTagsStrip}>
                <span className={styles.modalTagDifficulty}>
                  {activeProjectGuide.difficulty}
                </span>
                <span className={styles.modalTagTime}>
                  Est: {activeProjectGuide.estimatedTime}
                </span>
                {activeProjectGuide.tech.map((t, idx) => (
                  <span key={idx} className={styles.modalTagTech}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Modal Body */}
              {(() => {
                const { steps, companyTip } = getDynamicProjectGuide(
                  activeProjectGuide,
                  userContext?.targetRole || "Full Stack",
                  userContext?.targetCompany || "Other / General"
                );
                return (
                  <div className={styles.modalBody}>
                    <div className={styles.sectionBlock}>
                      <h4 className={styles.sectionHeader}>Project Overview</h4>
                      <p className={styles.sectionText}>{activeProjectGuide.description}</p>
                    </div>

                    <div className={styles.sectionBlock}>
                      <h4 className={styles.sectionHeader}>Step-by-Step Implementation Guide</h4>
                      <ol className={styles.guideStepsList}>
                        {steps.map((s, idx) => (
                          <li key={idx}>
                            <strong>{s.title}</strong>
                            <p>{s.desc}</p>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className={styles.sectionBlock}>
                      <h4 className={styles.sectionHeader}>Target Alignment Tips</h4>
                      <ul className={styles.tipsList}>
                        <li>
                          <strong>Optimal Design:</strong> Ensure code matches professional industry clean standards (proper documentation, separation of concerns).
                        </li>
                        <li>
                          <strong>Target Company ({userContext?.targetCompany || "General"}):</strong> {companyTip}
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })()}

              {/* Modal Footer */}
              <div className={styles.modalFooter}>
                <button
                  className={styles.modalCancelBtn}
                  onClick={() => setActiveProjectGuide(null)}
                >
                  Close
                </button>
                <button
                  className={styles.modalSubmitBtn}
                  onClick={() => {
                    completeProject();
                    setActiveProjectGuide(null);
                    toast.success(`Congratulations! You completed "${activeProjectGuide.name}" and earned 250 XP!`);
                  }}
                >
                  Mark Project as Completed (+250 XP)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
