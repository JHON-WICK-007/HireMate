"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
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
  Info
} from "lucide-react";
import styles from "./roadmap.module.css";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { useToast } from "../components/Toast";
import { useRoadmapStore, UserContext } from "./store";

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

/* ─── Reusable Custom Dropdown (mirrors builder's CustomDropdown) ─── */
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
  const { generateRoadmap, clearRoadmap, toggleSkillStatus, incrementStreak } = useRoadmapStore((state) => state.actions);

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(null);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Load user profile details on mount for auto-detected context
  useEffect(() => {
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
      .catch(() => {});

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
      .catch(() => {});
  }, []);

  // Update active phase automatically if none selected
  useEffect(() => {
    if (hasRoadmap && phases.length > 0 && !expandedPhaseId) {
      const activePhase = phases.find(p => p.status === "active") || phases[0];
      setExpandedPhaseId(activePhase.id);
    }
  }, [hasRoadmap, phases, expandedPhaseId]);

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
    }, 7200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerDone);
    };
  };

  // derived metrics
  const totalWeeks = phases.reduce((acc, p) => acc + p.estimatedWeeks, 0);
  const totalSkills = phases.reduce((acc, p) => acc + p.skills.length, 0);
  const overallProgress = totalSkills > 0 ? Math.round((completedSkillsCount / totalSkills) * 100) : 0;

  // quote selector based on streak
  const quote = MOTIVATIONAL_QUOTES[streak % MOTIVATIONAL_QUOTES.length];

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="roadmap" />

      {/* Header section (switches state if roadmap is present) */}
      {!hasRoadmap ? (
        <header className={styles.hero}>
          <h1 className={styles.heroTitle}>Career Roadmap</h1>
          <p className={styles.heroSubtitle}>
            Unlocks an adaptive, personalized learning path synthesized directly from your resume analyzer score and mock interview diagnostics.
          </p>
        </header>
      ) : (
        <header className={styles.heroCompact}>
          <div className="flex items-center gap-4">
            <h1 className={styles.heroCompactTitle}>
              <Compass className="text-orange-500" size={28} /> Career Journey
            </h1>
            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-xs font-medium text-neutral-400">
              <Target size={12} className="text-orange-500" />
              {userContext?.targetRole} at {userContext?.targetCompany}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to rebuild your roadmap? Progress stats will reset.")) {
                  clearRoadmap();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-semibold border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white px-3 py-1.5 rounded-md transition-all active:scale-[0.98]"
            >
              <RotateCcw size={12} /> Regenerate
            </button>
          </div>
        </header>
      )}

        {/* Dynamic Content Views */}
        <main className="max-w-[1200px] mx-auto px-6 w-full">
          {isGenerating ? (
            /* LOADING STATE CARD */
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner}></div>
              <h3 className="font-semibold text-lg text-white mb-2">Analyzing Profiles</h3>
              <p className="text-sm text-neutral-400 mb-6">Our AI is computing your learning curriculum...</p>
              <div className={styles.loadingStatusList}>
                {generationStatusLines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`${styles.loadingStatusItem} ${
                      idx === generationStep
                        ? styles.loadingStatusItemActive
                        : idx < generationStep
                        ? styles.loadingStatusItemDone
                        : ""
                    }`}
                  >
                    {idx < generationStep ? (
                      <Check size={16} />
                    ) : idx === generationStep ? (
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-neutral-800"></div>
                    )}
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              <div className={styles.loadingBarContainer}>
                <div
                  className={styles.loadingBarFill}
                  style={{ width: `${((generationStep + 1) / generationStatusLines.length) * 100}%` }}
                ></div>
              </div>
            </div>
          ) : !hasRoadmap ? (
            /* EMPTY STATE / GENERATOR INTAKE FORM */
            <div className="flex flex-col items-center justify-center w-full" style={{ minHeight: 'calc(100vh - 300px)' }}>
              <div className={styles.generatorWrapper}>
                {/* Glass Form Card — mirrors builder's formCard */}
                <div className={styles.generatorCard}>
              <div className={styles.generatorHeader}>
                <h2 className={styles.generatorTitle}>Build Your Road Map</h2>
                <p className={styles.generatorSubtitle}>
                  Specify your dream goal and select your preferences. The AI will weave a path targeting your exact skill gaps.
                </p>
              </div>
              <div className={styles.formGrid}>
                <RoadmapDropdown
                  label="Target Company"
                  value={targetCompany}
                  onChange={setTargetCompany}
                  menuMaxHeight={220}
                  options={COMPANIES.map((c) => ({ value: c, label: c }))}
                />

                <RoadmapDropdown
                  label="Target Role"
                  value={targetRole}
                  onChange={setTargetRole}
                  menuMaxHeight={220}
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
                      className={`${styles.radioPill} ${
                        experienceLevel === el ? styles.radioPillActive : ""
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

                <div className={styles.field}>
                  <div className={styles.sliderHeader}>
                    <label className={styles.label}>Weekly Study Plan</label>
                    <span className={styles.sliderValue}>{weeklyStudyHours} hrs / week</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={weeklyStudyHours}
                    onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                    className={styles.slider}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Learning Style</label>
                <div className={styles.chipGroup}>
                  {LEARNING_STYLES.map((style) => (
                    <div
                      key={style}
                      onClick={() => toggleLearningStyle(style)}
                      className={`${styles.chip} ${
                        selectedLearningStyles.includes(style) ? styles.chipActive : ""
                      }`}
                    >
                      {style}
                    </div>
                  ))}
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
        /* WORKSPACE VIEW: CANVAS + SIDEBAR */
          <div className={styles.layout}>
            {/* Left Column: Spine & Timeline Canvas */}
            <div className={styles.canvas}>
              {/* Dynamic Progress Spine */}
              <div className={styles.spine}>
                <div
                  className={styles.spineFill}
                  style={{ height: `${overallProgress}%` }}
                ></div>
              </div>

              {/* Loop Phases */}
              {phases.map((phase) => {
                const isExpanded = expandedPhaseId === phase.id;
                const isLocked = phase.status === "locked";

                return (
                  <div key={phase.id} className={styles.phaseContainer}>
                    {/* Spine connector Node */}
                    <div
                      className={`${styles.phaseNode} ${
                        phase.status === "completed"
                          ? styles.phaseNodeCompleted
                          : phase.status === "active"
                          ? styles.phaseNodeActive
                          : ""
                      }`}
                    >
                      {phase.status === "completed" && <Check size={12} className="text-black" />}
                    </div>

                    <div
                      className={`${styles.phaseCard} ${
                        phase.status === "active" ? styles.phaseCardActive : ""
                      }`}
                    >
                      {/* Collapsible header click triggers toggle */}
                      <div
                        onClick={() => !isLocked && setExpandedPhaseId(isExpanded ? null : phase.id)}
                        className={styles.phaseHeader}
                        style={{ cursor: isLocked ? "not-allowed" : "pointer" }}
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
                        {isExpanded && !isLocked && (
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
                              <div>
                                <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">
                                  Skills Checklist
                                </h4>
                                <div className={styles.skillsGrid}>
                                  {phase.skills.map((skill) => {
                                    const isSkillCompleted = skill.status === "completed";
                                    const isSkillExpanded = expandedSkillId === skill.id;

                                    return (
                                      <React.Fragment key={skill.id}>
                                        <div
                                          onClick={() => setExpandedSkillId(isSkillExpanded ? null : skill.id)}
                                          className={`${styles.skillCard} ${
                                            isSkillCompleted ? styles.skillCardCompleted : ""
                                          }`}
                                        >
                                          <div className={styles.skillHeader}>
                                            <div className={styles.skillInfo}>
                                              <span className={styles.skillName}>{skill.name}</span>
                                              {skill.aiPriority === "high" && (
                                                <span className={styles.skillPriority}>AI Focus Target</span>
                                              )}
                                            </div>

                                            {/* Skill checkbox trigger */}
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSkillStatus(phase.id, skill.id);
                                              }}
                                              className={`${styles.skillCheckbox} ${
                                                isSkillCompleted ? styles.skillCheckboxChecked : ""
                                              }`}
                                            >
                                              {isSkillCompleted && <Check size={12} strokeWidth={3} />}
                                            </div>
                                          </div>

                                          <div className={styles.skillFooter}>
                                            <span>{skill.estimatedHours} hrs</span>
                                            <span className="capitalize">{skill.difficulty}</span>
                                          </div>

                                          {/* Tiny progress fill bar */}
                                          <div className={styles.skillProgress}>
                                            <div
                                              className={styles.skillProgressFill}
                                              style={{ width: `${skill.progressPercent}%` }}
                                            ></div>
                                          </div>
                                        </div>

                                        {/* Expandable Resources Drawer for selected skill card */}
                                        {isSkillExpanded && (
                                          <div className={styles.skillDrawer}>
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
                                                    <span className="text-orange-500 font-semibold">
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
                                        )}
                                      </React.Fragment>
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
                                            onClick={() => toast.success("Project sandbox initialized!")}
                                            className={styles.startProjBtn}
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

              {/* Progress Summary stat tiles */}
              <section className={styles.statsStrip}>
                <div className={styles.statTile}>
                  <span className={styles.statTileLabel}>Current Level</span>
                  <span className={styles.statTileValue}>{level}</span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statTileLabel}>XP Earned</span>
                  <span className={styles.statTileValue}>{xp}</span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statTileLabel}>Skills Done</span>
                  <span className={styles.statTileValue}>
                    {completedSkillsCount} / {totalSkills}
                  </span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statTileLabel}>Est. Weeks left</span>
                  <span className={styles.statTileValue}>{totalWeeks}</span>
                </div>
              </section>

              {/* Skill Gap Comparison module */}
              <section className={styles.analysisCard}>
                <div className={styles.radialContainer}>
                  <div className={styles.radialGauge}>
                    {/* Ring gauge */}
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                      <path
                        className="text-neutral-800"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-orange-500"
                        strokeWidth="2.5"
                        strokeDasharray={`${overallProgress}, 100`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className={styles.radialText}>{overallProgress}%</span>
                  </div>
                  <span className={styles.radialLabel}>Match Progress</span>
                </div>

                <div className={styles.gapBarsContainer}>
                  <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                    <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                      Role Competency Gaps
                    </h4>
                    <span className="text-xs text-neutral-400">Current vs Target Level</span>
                  </div>
                  <div className={styles.gapBarRow}>
                    <div className={styles.gapBarHeader}>
                      <span className={styles.gapBarName}>Data Structures & Algorithms</span>
                      <span className={styles.gapBarValue}>60% Match</span>
                    </div>
                    <div className={styles.gapBarTrack}>
                      <div className={styles.gapBarFill} style={{ width: "60%" }}></div>
                    </div>
                  </div>
                  <div className={styles.gapBarRow}>
                    <div className={styles.gapBarHeader}>
                      <span className={styles.gapBarName}>System Design & Scaling</span>
                      <span className={styles.gapBarValue}>45% Match</span>
                    </div>
                    <div className={styles.gapBarTrack}>
                      <div className={styles.gapBarFill} style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div className={styles.gapBarRow}>
                    <div className={styles.gapBarHeader}>
                      <span className={styles.gapBarName}>STAR Method Behavioral responses</span>
                      <span className={styles.gapBarValue}>75% Match</span>
                    </div>
                    <div className={styles.gapBarTrack}>
                      <div className={styles.gapBarFill} style={{ width: "75%" }}></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recommended Certifications section */}
              <section className={styles.certificationsSection}>
                <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider border-b border-neutral-900 pb-2">
                  Target Recommended Certifications
                </h4>
                <div className={styles.certsGrid}>
                  <div className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <Award className="text-orange-500" size={24} />
                    </div>
                    <div className={styles.certInfo}>
                      <span className={styles.certName}>AWS Certified Developer Associate</span>
                      <span className={styles.certRelevance}>Highly relevant (92% match)</span>
                      <span className={styles.certActions}>Cloud Foundations track</span>
                    </div>
                  </div>

                  <div className={styles.certCard}>
                    <div className={styles.certIcon}>
                      <Award className="text-orange-500" size={24} />
                    </div>
                    <div className={styles.certInfo}>
                      <span className={styles.certName}>HashiCorp Certified Terraform Associate</span>
                      <span className={styles.certRelevance}>Recommended for {userContext?.targetRole}</span>
                      <span className={styles.certActions}>Infrastructure management track</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Gamification layer achievements strip */}
              <section className={styles.gamificationStrip}>
                <div className={styles.badgeGroup}>
                  <Flame className={styles.badgeIcon} />
                  <div className={styles.badgeMeta}>
                    <span className={styles.badgeName}>{streak} Day Learning Streak</span>
                    <span className={styles.badgeDesc}>Keep learning daily to compound your skills!</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    incrementStreak();
                    toast.success("Streak validated! You earned 10 XP.");
                  }}
                  className="text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-md transition-all active:scale-[0.98]"
                >
                  Verify Today's Progress
                </button>
              </section>
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
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                      Identified Strengths
                    </span>
                    <div className={styles.sidebarChips}>
                      <span className={`${styles.sidebarChip} ${styles.sidebarChipGreen}`}>Fast Learner</span>
                      <span className={`${styles.sidebarChip} ${styles.sidebarChipGreen}`}>Coding Consistency</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
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
            </aside>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
