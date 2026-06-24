"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import SiteFooter from "./components/SiteFooter";
import HomeBackdrop from "./components/HomeBackdrop";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const TAB_THEMES = {
  resume: {
    borderGlow: "rgba(6, 182, 212, 0.85)",
    spotlight: "rgba(6, 182, 212, 0.08)",
    badgeColor: "rgba(6, 182, 212, 1)"
  },
  interview: {
    borderGlow: "rgba(168, 85, 247, 0.85)",
    spotlight: "rgba(168, 85, 247, 0.08)",
    badgeColor: "rgba(168, 85, 247, 1)"
  },
  roadmap: {
    borderGlow: "rgba(249, 115, 22, 0.85)",
    spotlight: "rgba(249, 115, 22, 0.08)",
    badgeColor: "rgba(249, 115, 22, 1)"
  }
};

const TABS_CONTENT = {
  resume: {
    title: "ATS Real-Time Score",
    subtitle: "Evaluating keyword relevance, formatting, and impact phrases.",
    cards: [
      {
        id: "r1",
        val: "92%",
        lbl: "ATS Score",
        position: { top: "40px", left: "-140px" },
        depth: 65,
        color: "#06b6d4",
        bg: "rgba(6, 182, 212, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "r2",
        val: "18 / 22",
        lbl: "Keywords Matched",
        position: { bottom: "120px", left: "-140px" },
        depth: 45,
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )
      },
      {
        id: "r3",
        val: "Format Pass",
        lbl: "Structure & Layout",
        position: { top: "140px", right: "-140px" },
        depth: 55,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "r4",
        val: "14 Action",
        lbl: "Verbs Detected",
        position: { bottom: "120px", right: "-140px" },
        depth: 75,
        color: "#06b6d4",
        bg: "rgba(6, 182, 212, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    ]
  },
  interview: {
    title: "Voice Assistant Coach",
    subtitle: "Analyzing speaking pace, confidence, and filler word usage.",
    cards: [
      {
        id: "i1",
        val: "87%",
        lbl: "Confidence Score",
        position: { top: "40px", left: "-140px" },
        depth: 65,
        color: "#a855f7",
        bg: "rgba(168, 85, 247, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "i2",
        val: "24 Sessions",
        lbl: "Mocks Practiced",
        position: { bottom: "120px", left: "-140px" },
        depth: 45,
        color: "#a855f7",
        bg: "rgba(168, 85, 247, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="8" y1="2" x2="8" y2="22" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="2" x2="16" y2="22" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "i3",
        val: "130 WPM",
        lbl: "Speaking Pace",
        position: { top: "140px", right: "-140px" },
        depth: 55,
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "i4",
        val: "Low",
        lbl: "Filler Words Rate",
        position: { bottom: "120px", right: "-140px" },
        depth: 75,
        color: "#a855f7",
        bg: "rgba(168, 85, 247, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    ]
  },
  roadmap: {
    title: "Career Progression Path",
    subtitle: "Tracking completed milestones and upcoming skills.",
    cards: [
      {
        id: "m1",
        val: "65%",
        lbl: "Career Ready",
        position: { top: "40px", left: "-140px" },
        depth: 65,
        color: "#f97316",
        bg: "rgba(249, 115, 22, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "m2",
        val: "SDE-1",
        lbl: "Target: Amazon",
        position: { bottom: "120px", left: "-140px" },
        depth: 45,
        color: "#f97316",
        bg: "rgba(249, 115, 22, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "m3",
        val: "Next: Docker",
        lbl: "Active Focus",
        position: { top: "140px", right: "-140px" },
        depth: 55,
        color: "#f97316",
        bg: "rgba(249, 115, 22, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      },
      {
        id: "m4",
        val: "3 Completed",
        lbl: "Path Milestones",
        position: { bottom: "120px", right: "-140px" },
        depth: 75,
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.12)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
    ]
  }
};

function Interactive3DConsole() {
  const [activeTab, setActiveTab] = useState<"resume" | "interview" | "roadmap">("interview");
  const [score, setScore] = useState(87);

  const spotlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Mouse coordinate motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-200, 200], [15, -15]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-200, 200], [-15, 15]), { damping: 25, stiffness: 200 });

  // Shadows
  const shadowX = useSpring(useTransform(x, [-200, 200], [25, -25]), { damping: 25, stiffness: 200 });
  const shadowY = useSpring(useTransform(y, [-200, 200], [25, -25]), { damping: 25, stiffness: 200 });

  // Track user interaction to pause auto-rotation
  const userInteractedRef = useRef(false);
  const autoRotateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!rectRef.current) {
      rectRef.current = event.currentTarget.getBoundingClientRect();
    }
    const rect = rectRef.current;
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);

    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    if (spotlightRef.current) {
      spotlightRef.current.style.background =
        `radial-gradient(circle 350px at ${mx}px ${my}px, var(--spotlight-color), transparent 60%)`;
    }
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    rectRef.current = event.currentTarget.getBoundingClientRect();
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
  }

  function handleTabClick(tabId: "resume" | "interview" | "roadmap") {
    userInteractedRef.current = true;
    setActiveTab(tabId);
    if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    autoRotateTimerRef.current = setTimeout(() => {
      userInteractedRef.current = false;
    }, 12000);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    rectRef.current = null;
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  }

  useEffect(() => {
    const tabs: Array<"resume" | "interview" | "roadmap"> = ["resume", "interview", "roadmap"];
    const interval = setInterval(() => {
      if (!userInteractedRef.current) {
        setActiveTab(prev => {
          const currentIdx = tabs.indexOf(prev);
          return tabs[(currentIdx + 1) % tabs.length];
        });
      }
    }, 5000);
    return () => {
      clearInterval(interval);
      if (autoRotateTimerRef.current) clearTimeout(autoRotateTimerRef.current);
    };
  }, []);

  const [typedAnswer, setTypedAnswer] = useState("");
  const candidateAnswerText = "I build responsive, high-performance web applications using React, Next.js, Node.js, and TypeScript.";

  useEffect(() => {
    if (activeTab !== "interview") return;
    setTypedAnswer("");
    let current = "";
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < candidateAnswerText.length) {
        current += candidateAnswerText[idx];
        setTypedAnswer(current);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [activeTab]);

  const [waveHeights, setWaveHeights] = useState([8, 14, 18, 12, 6, 16, 14, 8, 10, 15, 9, 5]);
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 14) + 4));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = activeTab === "resume" ? 92 : activeTab === "interview" ? 87 : 65;
    const current = score;
    if (current === target) return;
    const step = current < target ? 1 : -1;
    const timeout = setTimeout(() => {
      setScore(current + step);
    }, 15);
    return () => clearInterval(timeout);
  }, [activeTab, score]);

  const tabDefs = [
    {
      id: "resume" as const,
      label: "Resume",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "interview" as const,
      label: "Interview",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "roadmap" as const,
      label: "Roadmap",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  const floatingCards = [
    {
      id: "f1", val: "92%", lbl: "Resume Match",
      position: { top: "40px", left: "-140px" } as React.CSSProperties,
      color: "#10b981", bg: "rgba(16, 185, 129, 0.12)",
      floatClass: styles.cardFloat1,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "f2", val: "24", lbl: "Mock Practiced",
      position: { bottom: "120px", left: "-140px" } as React.CSSProperties,
      color: "#a855f7", bg: "rgba(168, 85, 247, 0.12)",
      floatClass: styles.cardFloat2,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "f3", val: "Amazon SDE-1", lbl: "Career Goal",
      position: { top: "140px", right: "-140px" } as React.CSSProperties,
      color: "#f97316", bg: "rgba(249, 115, 22, 0.12)",
      floatClass: styles.cardFloat3,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      id: "f4", val: "87%", lbl: "Interview Score",
      position: { bottom: "120px", right: "-140px" } as React.CSSProperties,
      color: "#06b6d4", bg: "rgba(6, 182, 212, 0.12)",
      floatClass: styles.cardFloat4,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.heroRight}>
      <motion.div
        className={styles.consoleContainer}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          "--shadow-dx": useTransform(shadowX, (v) => `${v}px`),
          "--shadow-dy": useTransform(shadowY, (v) => `${v}px`),
          "--border-glow-color": TAB_THEMES[activeTab].borderGlow,
          "--spotlight-color": TAB_THEMES[activeTab].spotlight,
          "--badge-dot": TAB_THEMES[activeTab].badgeColor,
        } as any}
      >
        {floatingCards.map((card) => (
          <div
            key={card.id}
            className={`${styles.floatingOutcomeCard} ${card.floatClass}`}
            style={card.position}
          >
            <div className={styles.floatingCardIcon} style={{ background: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div className={styles.floatingCardDetails}>
              <span className={styles.floatingCardVal}>{card.val}</span>
              <span className={styles.floatingCardLbl}>{card.lbl}</span>
            </div>
          </div>
        ))}

        <div className={styles.consoleCard}>
          <div ref={spotlightRef} className={styles.consoleCardSpotlight} />

          <div className={styles.dialLayer}>
            <svg className={styles.dialSvg} viewBox="0 0 90 90">
              <circle className={styles.dialBgCircle} cx="45" cy="45" r="38" />
              <circle
                className={styles.dialValueCircle}
                cx="45"
                cy="45"
                r="38"
                style={{
                  strokeDasharray: "238.76",
                  strokeDashoffset: 238.76 - (238.76 * score) / 100
                }}
              />
            </svg>
            <div className={styles.dialTextContainer}>
              <span className={styles.dialValue}>{score}%</span>
              <span className={styles.dialLabel}>
                {activeTab === "resume" && "ATS SCORE"}
                {activeTab === "interview" && "CONFIDENCE"}
                {activeTab === "roadmap" && "CAREER READY"}
              </span>
            </div>
          </div>

          <div className={styles.headerLayer}>
            <div className={styles.tabsWrapper}>
              {tabDefs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
                >
                  <span className={styles.tabIcon}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
            <h4 className={styles.consoleHeaderTitle}>
              {TABS_CONTENT[activeTab].title}
            </h4>
            <p className={styles.consoleHeaderDesc}>
              {TABS_CONTENT[activeTab].subtitle}
            </p>
          </div>

          <div className={styles.mainPanelLayer} style={{ position: "relative" }}>
            {activeTab === "resume" && <div className={styles.scanLine} />}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "resume" && (
                  <div className={styles.skillsList} style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                    <div className={styles.skillsSuccessText}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Resume Uploaded Successfully</span>
                    </div>
                    <div className={styles.skillsGroup}>
                      <span className={styles.skillsGroupLabel}>Detected Skills</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {["React", "Node.js", "MongoDB", "TypeScript", "AWS"].map((sk) => (
                          <span key={sk} className={`${styles.skillTag} ${styles.skillFound}`}>{sk}</span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.skillsGroup} style={{ marginTop: "4px" }}>
                      <span className={styles.skillsGroupLabel}>Suggested Gaps</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {["Docker", "Kubernetes", "System Design"].map((sk) => (
                          <span key={sk} className={`${styles.skillTag} ${styles.skillMissing}`}>{sk}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "interview" && (
                  <div className={styles.interviewQABox}>
                    <div className={styles.questionText}>Q: What is your development stack?</div>
                    <div className={styles.answerText}>
                      {typedAnswer}
                      <span style={{ animation: "pulse 1s infinite", fontWeight: "bold", color: "#a855f7" }}>|</span>
                    </div>
                    <div className={styles.recordingRow}>
                      <span className={styles.recordingIndicator}>🎤 Recording Active</span>
                      <div className={styles.waveform}>
                        {waveHeights.map((h, i) => (
                          <div
                            key={i}
                            className={`${styles.waveBar} ${styles.waveBarActive}`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className={styles.metricsGrid}>
                      {[
                        { val: "88%", label: "Technical" },
                        { val: "91%", label: "Communication" },
                        { val: "85%", label: "Confidence" }
                      ].map((m, idx) => (
                        <div key={idx} className={styles.metricItem}>
                          <span className={styles.metricValue}>{m.val}</span>
                          <span className={styles.metricLabel}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === "roadmap" && (
                  <div className={styles.roadmapProgressContainer}>
                    <div className={styles.roadmapHeader}>
                      <span className={styles.roadmapRole}>Amazon SDE-1</span>
                      <span className={styles.roadmapPercentage}>65% Complete</span>
                    </div>

                    <div className={styles.roadmapProgressBarContainer}>
                      <div className={styles.roadmapProgressBarFill} style={{ width: "65%" }} />
                    </div>

                    <div className={styles.roadmapNodes}>
                      <div className={`${styles.roadmapNode} ${styles.roadmapNodeCompleted}`}>
                        <div className={styles.roadmapNodeIcon}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className={styles.roadmapNodeContent}>
                          <span className={styles.roadmapNodeTitle}>JavaScript, React, Git</span>
                          <span className={styles.roadmapNodeStatusBadge}>Completed</span>
                        </div>
                      </div>

                      <div className={`${styles.roadmapNode} ${styles.roadmapNodeCurrent}`}>
                        <div className={styles.roadmapNodeIcon}>
                          <span className={styles.roadmapNodeActivePulse} />
                        </div>
                        <div className={styles.roadmapNodeContent}>
                          <span className={styles.roadmapNodeTitle}>Node.js, MongoDB</span>
                          <span className={styles.roadmapNodeStatusBadge}>Active Focus</span>
                        </div>
                      </div>

                      <div className={`${styles.roadmapNode} ${styles.roadmapNodeUpcoming}`}>
                        <div className={styles.roadmapNodeIcon}>
                          <span className={styles.roadmapNodeUpcomingDot} />
                        </div>
                        <div className={styles.roadmapNodeContent}>
                          <span className={styles.roadmapNodeTitle}>AWS, System Design, DSA</span>
                          <span className={styles.roadmapNodeStatusBadge}>Upcoming</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Telemetry Status Bar */}
          <div className={styles.statusCard}>
            <div className={styles.telemetryHeader}>
              <span className={styles.telemetryLabel}>Platform Telemetry</span>
              <span className={styles.telemetryTitle}>
                {activeTab === "resume" && "ATS Keyword Match"}
                {activeTab === "interview" && "Voice Speaking Confidence"}
                {activeTab === "roadmap" && "Path Milestone Progress"}
              </span>
            </div>
            <div className={styles.statusBarContainer}>
              <div
                className={styles.statusBarFill}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ feature, variants }: { feature: any; variants: any }) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-150, 150], [8, -8]), { damping: 25, stiffness: 200 });
  const rotateY = useSpring(useTransform(x, [-150, 150], [-8, 8]), { damping: 25, stiffness: 200 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    x.set(mx - rect.width / 2);
    y.set(my - rect.height / 2);

    if (spotlightRef.current) {
      spotlightRef.current.style.background =
        `radial-gradient(circle 400px at ${mx}px ${my}px, var(--spotlight-color), transparent 60%)`;
    }
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle 120px at ${mx}px ${my}px, var(--border-glow-color), transparent 100%)`;
    }
  }

  function handleMouseEnter() {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
    if (glowRef.current) glowRef.current.style.opacity = "1";
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }

  return (
    <motion.div variants={variants} className={styles.featureCardWrapper}>
      <motion.div
        className={styles.featureCard}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          "--border-glow-color": feature.accentColor,
          "--spotlight-color": feature.spotlightColor
        } as any}
        whileHover={{ y: -8, scale: 1.03 }}
      >
        <div ref={glowRef} className={styles.featureCardBorderGlow} />
        <div ref={spotlightRef} className={styles.featureCardSpotlight} />
        <div className={styles.featureCardContent}>
          <div className={styles.featureIcon}>{feature.icon}</div>
          <h3 className={styles.featureTitleLayer}>{feature.title}</h3>
          <p className={styles.featureDescLayer}>{feature.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    const step = Math.ceil(end / (totalMiliseconds / incrementTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function Home() {
  const companies = ["Google", "Amazon", "Meta", "Microsoft", "Apple", "Netflix", "Uber", "NVIDIA"];
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompanyIndex((prev) => (prev + 1) % companies.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const lastScrollY = useRef(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeUserName, setWelcomeUserName] = useState("");
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  useEffect(() => {
    setMounted(true);

    // Check if we should display the welcome modal
    const showWelcomeFlag = localStorage.getItem("showWelcomeModal");
    if (showWelcomeFlag === "true") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setWelcomeUserName(parsedUser.fullName || "");
          setShowWelcome(true);
        } catch (e) { }
      }
      localStorage.removeItem("showWelcomeModal");
    }

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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${API_URL}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
            document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          // Fallback: keep logged in state if fetch fails
        });
    } else {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
      setIsLoggedIn(false);
    }
  }, []);

  const handleSignOut = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
    document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

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
    if (showWelcome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showWelcome]);

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "AI Mock Interviews",
      description: "Practice with an AI interviewer tailored to your target company and role. Get real-time feedback.",
      accentColor: "rgba(168, 85, 247, 0.85)",
      spotlightColor: "rgba(168, 85, 247, 0.08)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
          <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Resume Analysis",
      description: "Upload your resume for instant ATS scoring, skill gap analysis, and actionable improvement tips.",
      accentColor: "rgba(6, 182, 212, 0.85)",
      spotlightColor: "rgba(6, 182, 212, 0.08)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="14" y1="4" x2="10" y2="20" strokeLinecap="round" />
        </svg>
      ),
      title: "Coding Playground",
      description: "Solve coding challenges in a real editor with syntax highlighting and instant AI code review.",
      accentColor: "rgba(219, 70, 239, 0.85)",
      spotlightColor: "rgba(219, 70, 239, 0.08)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Career Roadmaps",
      description: "Get personalized learning paths with skill milestones, project ideas, and resource recommendations.",
      accentColor: "rgba(244, 63, 94, 0.85)",
      spotlightColor: "rgba(244, 63, 94, 0.08)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 20V10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 20V4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 20v-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Performance Analytics",
      description: "Track your progress with detailed dashboards showing scores, trends, and improvement areas.",
      accentColor: "rgba(16, 185, 129, 0.85)",
      spotlightColor: "rgba(16, 185, 129, 0.08)",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Voice Interviews",
      description: "Speak your answers naturally with real-time transcription for a realistic interview simulation.",
      accentColor: "rgba(249, 115, 22, 0.85)",
      spotlightColor: "rgba(249, 115, 22, 0.08)",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your skills, experience, and career goals.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Upload Your Resume",
      description: "Get instant AI analysis with ATS scoring and improvement tips.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Practice Interviews",
      description: "Take mock interviews tailored to your target role and company.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="22" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Land Your Dream Job",
      description: "Track progress, refine skills, and walk into interviews with confidence.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      )
    },
  ];

  const stats = [
    {
      title: "Interviews",
      badge: "Monthly",
      subtitle: "Mock Sessions",
      value: "10K+",
      trend: "up",
      description: "Interview sessions completed this month with AI-powered feedback.",
      accentColor: "#00e5ff",
      details: {
        headline: "Interview Analytics",
        metrics: [
          { label: "Total Sessions", value: "10,247", change: "+18%" },
          { label: "Avg. Duration", value: "34 min", change: "+5%" },
          { label: "Completion Rate", value: "92%", change: "+3%" },
          { label: "Repeat Users", value: "67%", change: "+12%" },
        ],
        highlights: [
          "Behavioral interviews are the most popular category",
          "Peak usage hours: 6PM – 10PM EST",
          "System Design sessions grew 45% this month",
        ],
      },
      chart: (
        <svg viewBox="0 0 200 80" fill="none" className={styles.miniChart}>
          <defs>
            <linearGradient id="chartFill1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0 60 Q 25 55, 50 48 T 100 35 T 150 20 T 200 12" stroke="#00e5ff" strokeWidth="2.5" fill="none" />
          <path d="M 0 60 Q 25 55, 50 48 T 100 35 T 150 20 T 200 12 L 200 80 L 0 80 Z" fill="url(#chartFill1)" />
          <circle cx="200" cy="12" r="4" fill="#00e5ff" />
        </svg>
      ),
    },
    {
      title: "Satisfaction",
      badge: "Weekly",
      subtitle: "User Rating",
      value: "95%",
      trend: "up",
      description: "Users report improved confidence after practicing with HireMate.",
      accentColor: "#8c7cff",
      details: {
        headline: "Satisfaction Breakdown",
        metrics: [
          { label: "Overall Rating", value: "4.8/5", change: "+0.2" },
          { label: "Would Recommend", value: "97%", change: "+4%" },
          { label: "NPS Score", value: "82", change: "+9" },
          { label: "Support Rating", value: "4.9/5", change: "+0.1" },
        ],
        highlights: [
          "AI feedback quality rated highest among features",
          "93% feel more confident after 3+ sessions",
          "Response time satisfaction: 98%",
        ],
      },
      chart: (
        <svg viewBox="0 0 200 80" fill="none" className={styles.miniChart}>
          <defs>
            <linearGradient id="chartFill2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c7cff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8c7cff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0 55 C 30 50, 45 25, 65 30 C 85 35, 95 55, 115 48 C 135 41, 145 18, 165 20 C 185 22, 195 28, 200 30" stroke="#8c7cff" strokeWidth="2.5" fill="none" />
          <path d="M 0 55 C 30 50, 45 25, 65 30 C 85 35, 95 55, 115 48 C 135 41, 145 18, 165 20 C 185 22, 195 28, 200 30 L 200 80 L 0 80 Z" fill="url(#chartFill2)" />
          <circle cx="165" cy="20" r="4" fill="#8c7cff" />
        </svg>
      ),
    },
    {
      title: "Growth",
      badge: "Monthly",
      subtitle: "Active Users",
      value: "2.5K+",
      trend: "up",
      description: "Community growing rapidly with developers joining every week.",
      accentColor: "#ff70a6",
      details: {
        headline: "Growth Insights",
        metrics: [
          { label: "New Users", value: "820", change: "+24%" },
          { label: "DAU / MAU", value: "38%", change: "+7%" },
          { label: "Retention (7d)", value: "74%", change: "+6%" },
          { label: "Avg. Sessions/User", value: "4.2", change: "+1.1" },
        ],
        highlights: [
          "Organic signups account for 68% of new users",
          "Highest growth in India, US, and UK markets",
          "Referral program driving 22% of acquisitions",
        ],
      },
      chart: (
        <svg viewBox="0 0 200 80" fill="none" className={styles.miniChart}>
          <defs>
            <linearGradient id="chartFill3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff70a6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff70a6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="10" y="50" width="18" height="30" rx="4" fill="rgba(255,112,166,0.15)" />
          <rect x="38" y="38" width="18" height="42" rx="4" fill="rgba(255,112,166,0.2)" />
          <rect x="66" y="28" width="18" height="52" rx="4" fill="rgba(255,112,166,0.25)" />
          <rect x="94" y="42" width="18" height="38" rx="4" fill="rgba(255,112,166,0.2)" />
          <rect x="122" y="20" width="18" height="60" rx="4" fill="rgba(255,112,166,0.3)" />
          <rect x="150" y="32" width="18" height="48" rx="4" fill="rgba(255,112,166,0.35)" />
          <rect x="178" y="10" width="18" height="70" rx="4" fill="#ff70a6" opacity="0.5" />
        </svg>
      ),
    },
    {
      title: "Coverage",
      badge: "All Time",
      subtitle: "Companies",
      value: "50+",
      trend: "up",
      description: "Interview questions from top tech companies like FAANG and more.",
      accentColor: "#00ffcc",
      details: {
        headline: "Company Coverage",
        metrics: [
          { label: "Companies", value: "54", change: "+8" },
          { label: "Question Bank", value: "12K+", change: "+2.1K" },
          { label: "Categories", value: "18", change: "+3" },
          { label: "Updated Weekly", value: "Yes", change: "" },
        ],
        highlights: [
          "Full FAANG coverage: Google, Amazon, Meta, Apple, Netflix",
          "New additions: Stripe, Databricks, Coinbase",
          "System Design library expanded by 40%",
        ],
      },
      chart: (
        <svg viewBox="0 0 200 80" fill="none" className={styles.miniChart}>
          <defs>
            <linearGradient id="chartFill4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ffcc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#00ffcc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="40" r="32" stroke="rgba(0,255,204,0.12)" strokeWidth="12" fill="none" />
          <circle cx="100" cy="40" r="32" stroke="#00ffcc" strokeWidth="12" fill="none" strokeDasharray="160 201" strokeDashoffset="0" strokeLinecap="round" opacity="0.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      {/* --- Navbar --- */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""} ${navHidden ? styles.navHidden : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#navLogoGrad)" />
              <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8" />
              <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="var(--logo-grad-start)" />
                  <stop offset="1" stopColor="var(--logo-grad-end)" />
                </linearGradient>
              </defs>
            </svg>
            <span>HireMate AI</span>
          </Link>

          <div className={styles.navLinks}>
            <Link href="/resume" className={styles.navLink}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={styles.navLink}>Mock Interview</Link>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#stats" className={styles.navLink}>Results</a>
          </div>

          <div className={styles.navActions} suppressHydrationWarning>
            {/* Logged-in profile link (instantly toggled via head script) */}
            <div className="auth-logged-in-only">
              <Link
                href="/profile"
                className={styles.navBtnGhost}
                style={{
                  width: "136px",
                  paddingLeft: "6px",
                  paddingRight: "16px",
                  justifyContent: "flex-start"
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid var(--border-default)"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "var(--surface-300)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      color: "var(--text-primary)"
                    }}
                  >
                    {initials}
                  </div>
                )}
                <span
                  style={{
                    display: "inline-block",
                    width: "64px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "left"
                  }}
                >
                  {user?.fullName ? user.fullName.split(" ")[0] : "Profile"}
                </span>
              </Link>
            </div>

            {/* Logged-out buttons (instantly toggled via head script) */}
            <div className="auth-logged-out-only">
              <Link href="/auth?mode=signin" className={styles.navBtnGhost}>Sign In</Link>
              <Link href="/auth?mode=signup" className={styles.navBtnSolid}>Get Started</Link>
            </div>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen1 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen2 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className={styles.mobileMenu}>
            <Link href="/resume" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Mock Interview</Link>
            <a href="#features" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>How It Works</a>
            <a href="#stats" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Results</a>
            <div className={styles.mobileDivider} />
            {mounted && (
              isLoggedIn ? (
                <>
                  <Link href="/profile" className={styles.mobileLink} onClick={() => setMobileMenu(false)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid var(--border-default)"
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "50%",
                          background: "var(--surface-300)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.95rem",
                          fontWeight: "bold",
                          color: "var(--text-primary)"
                        }}
                      >
                        {initials}
                      </div>
                    )}
                    <span>{user?.fullName ? user.fullName.split(" ")[0] : "Profile"}</span>
                  </Link>
                  <button onClick={handleSignOut} className={styles.mobileLink} style={{ color: "var(--color-error)", border: "none", background: "none", cursor: "pointer", padding: "12px 16px", textAlign: "left", fontSize: "1.1rem", fontWeight: "600", width: "100%" }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth?mode=signin" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Sign In</Link>
                  <Link href="/auth?mode=signup" className={styles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={() => setMobileMenu(false)}>Get Started</Link>
                </>
              ))}
          </div>
        )}
      </nav>

      {/* --- Hero Section --- */}
      <section className={styles.hero}>
        <motion.div
          className={styles.heroGlow}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.85, 1, 0.85]
          }}
          transition={{
            duration: 8,
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
          <div className={styles.heroLeft}>


            <motion.h1 className={styles.heroTitle} variants={fadeInUp}>
              Prepare Smarter.
              <br />
              <span className={styles.heroTitleAccent}>Interview Better.</span>
              <br />
              Land Faster.
            </motion.h1>

            <motion.p className={styles.heroSubtitle} variants={fadeInUp}>
              HireMate AI gives you mock interviews, resume analysis, coding practice,
              and career roadmaps — all powered by AI that adapts to your goals.
            </motion.p>

            <motion.div className={styles.carouselContainer} variants={fadeInUp}>
              <span>Prepping for</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={companies[currentCompanyIndex]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className={styles.carouselWordActive}
                >
                  {companies[currentCompanyIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.div className={styles.heroCtas} variants={fadeInUp}>
              <Link href="/auth?mode=signup" className={styles.heroCtaPrimary}>
                <span>Start Practicing Free</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="#features" className={styles.heroCtaSecondary}>
                <span>See How It Works</span>
              </a>
            </motion.div>

            <motion.div className={styles.heroProof} variants={fadeInUp}>
              <div className={styles.heroAvatars}>
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                  "https://randomuser.me/api/portraits/women/90.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    className={styles.heroAvatar}
                    src={src}
                    alt={`User ${i + 1}`}
                    style={{ zIndex: 5 - i, marginLeft: i > 0 ? "-10px" : 0 }}
                  />
                ))}
              </div>
              <p className={styles.heroProofText}>
                <strong><StatCounter target={2500} />+</strong> developers already preparing
              </p>
            </motion.div>
          </div>

          <Interactive3DConsole />
        </motion.div>
      </section>

      {/* --- Features Section --- */}
      <section className={styles.features} id="features">
        <div className={styles.featuresGlow} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.sectionLabel}>Powerful Features</span>
            <h2 className={styles.gradientSectionTitle}>Everything you need to land your dream job</h2>
            <p className={styles.sectionSubtitle}>
              From resume review to live mock interviews — one platform, zero guesswork.
            </p>
          </motion.div>

          <motion.div
            className={styles.featureGrid}
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {features.map((feature, i) => (
              <FeatureCard
                key={i}
                feature={feature}
                variants={cardVariants}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.howItWorksGlow} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.sectionLabel}>How It Works</span>
            <h2 className={styles.gradientSectionTitle}>Four steps to interview confidence</h2>
          </motion.div>

          <div className={styles.timelineWrapper}>
            {/* The SVG curve path */}
            <svg className={styles.timelineSvg} viewBox="0 0 1000 440" fill="none" preserveAspectRatio="none">
              <path
                d="M 0 290 L 88 290 M 162 290 C 230 290, 270 120, 338 120 M 412 120 C 480 120, 520 290, 588 290 M 662 290 C 730 290, 770 120, 838 120 M 912 120 L 1000 120"
                stroke="url(#timelineWaveGrad)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 290 L 88 290 M 162 290 C 230 290, 270 120, 338 120 M 412 120 C 480 120, 520 290, 588 290 M 662 290 C 730 290, 770 120, 838 120 M 912 120 L 1000 120"
                stroke="rgba(59, 130, 246, 0.05)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="timelineWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="35%" stopColor="#3b82f6" />
                  <stop offset="70%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>

            <motion.div
              className={styles.timelineSteps}
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className={styles.timelineStep}
                  variants={cardVariants}
                >
                  <span className={styles.stepBgNumber}>{i + 1}</span>

                  <div className={styles.stepNodeOuter}>
                    <div className={styles.stepNodeWrapper}>
                      <div className={styles.stepNodeInner}>
                        {step.icon}
                      </div>
                    </div>
                  </div>

                  <div className={styles.stepTextContainer}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.statsGlow} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.sectionLabel}>By The Numbers</span>
            <h2 className={styles.gradientSectionTitle}>Platform impact at a glance</h2>
          </motion.div>
          <motion.div
            className={styles.statsGrid}
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className={styles.statCardOuter}
                variants={cardVariants}
                whileHover={flippedCard !== i ? { y: -6 } : {}}
              >
                <div className={`${styles.statCardInner} ${flippedCard === i ? styles.statCardFlipped : ""}`}>
                  {/* ─── Front Face ─── */}
                  <div className={styles.statCardFront}>
                    <div className={styles.statCardHeader}>
                      <h4 className={styles.statTitle}>{stat.title}</h4>
                      <span className={styles.statBadge}>{stat.badge}</span>
                    </div>

                    <span className={styles.statSubtitle}>{stat.subtitle}</span>

                    <div className={styles.statValueRow}>
                      <span className={styles.statValue}>{stat.value}</span>
                      <svg className={styles.statTrend} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </div>

                    <div className={styles.statChartWrap}>
                      {stat.chart}
                    </div>

                    <div className={styles.statFooter}>
                      <p className={styles.statDesc}>{stat.description}</p>
                      <button
                        className={styles.statArrow}
                        onClick={() => setFlippedCard(i)}
                        aria-label={`View ${stat.title} details`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* ─── Back Face ─── */}
                  <div className={styles.statCardBack} style={{ "--accent": stat.accentColor } as any}>
                    <div className={styles.statBackTop}>
                      <div className={styles.statBackTopLeft}>
                        <span className={styles.statBackBigValue}>{stat.value}</span>
                        <h4 className={styles.statBackTitle}>{stat.details.headline}</h4>
                      </div>
                      <button
                        className={styles.statBackClose}
                        onClick={() => setFlippedCard(null)}
                        aria-label="Close details"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className={styles.statBackBody}>
                      <div className={styles.statBackMetrics}>
                        {stat.details.metrics.map((m, mi) => (
                          <div key={mi} className={styles.statBackMetric}>
                            <span className={styles.statBackMetricLabel}>{m.label}</span>
                            <span className={styles.statBackMetricValue}>{m.value}</span>
                            {m.change && <span className={styles.statBackMetricChange}>{m.change}</span>}
                          </div>
                        ))}
                      </div>

                      <div className={styles.statBackDivider} />

                      <div className={styles.statBackHighlights}>
                        <span className={styles.statBackHighlightsLabel}>Key Insights</span>
                        {stat.details.highlights.map((h, hi) => (
                          <div key={hi} className={styles.statBackHighlight}>
                            <svg className={styles.statBackCheckIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Social Proof / CTA Section --- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGlow} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.ctaBox}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Scattered photo cards */}
            <div className={styles.ctaPhotos}>
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto1}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto2}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto3}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto4}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto5}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto6}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto7}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto8}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto9}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto10}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto11}`} />
              <div className={`${styles.ctaPhoto} ${styles.ctaPhoto12}`} />
            </div>

            <div className={styles.ctaContent}>
              <span className={styles.sectionLabel}>Testimonials</span>
              <h2 className={styles.ctaTitle}>
                Trusted by professionals<br />
                <span className={styles.ctaTitleFaded}>from various industries</span>
              </h2>
              <p className={styles.ctaSubtitle}>
                Learn why thousands of developers trust HireMate AI to prepare for interviews and land their dream jobs.
              </p>
              <Link href="/auth?mode=signup" className={styles.ctaButton}>
                <span>Read Success Stories</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter showCta={true} />

      {/* Welcome Modal Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className={styles.welcomeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.welcomeCard}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Left Side: Dynamic Animated Neon Lottie Box */}
              <div className={styles.welcomeLeft}>
                <div className={styles.lottieWrapper}>
                  <DotLottieReact
                    src="/508T6DecB3.json"
                    loop={true}
                    autoplay={true}
                  />
                </div>
              </div>

              {/* Right Side: Welcome Details */}
              <div className={styles.welcomeRight}>
                {/* 5 dots row */}
                <div className={styles.dotRow}>
                  <div className={styles.dot} style={{ background: "#fbbf24" }} />
                  <div className={styles.dot} style={{ background: "#22d3ee" }} />
                  <div className={styles.dot} style={{ background: "#f87171" }} />
                  <div className={styles.dot} style={{ background: "#4ade80" }} />
                  <div className={styles.dot} style={{ background: "#e5e7eb" }} />
                </div>

                <div className={styles.successBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Account created successfully</span>
                </div>

                <h2 className={styles.welcomeTitle}>
                  Welcome to HireMate AI,<br />
                  {welcomeUserName ? welcomeUserName.split(" ")[0] : "Friend"}!
                </h2>

                <p className={styles.welcomeDesc}>
                  Your account has been created successfully. Let's start your career journey and land the job you've been working toward.
                </p>

                {/* 3-Column Grid */}
                <div className={styles.welcomeGrid}>
                  <div className={styles.welcomeGridItem}>
                    <div className={styles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={styles.gridItemText}>Upload your resume</span>
                  </div>

                  <div className={styles.welcomeGridItem}>
                    <div className={styles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={styles.gridItemText}>Start mock interview</span>
                  </div>

                  <div className={styles.welcomeGridItem}>
                    <div className={styles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 22h16" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 2a5 5 0 0 1 5 5v5a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className={styles.gridItemText}>Track your progress</span>
                  </div>
                </div>

                <div className={styles.welcomeActions}>
                  {/* Primary Button */}
                  <button className={styles.welcomeButton} onClick={() => setShowWelcome(false)}>
                    <span>Get started</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Secondary Link */}
                  <button className={styles.exploreLink} onClick={() => setShowWelcome(false)}>
                    Explore on my own
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
