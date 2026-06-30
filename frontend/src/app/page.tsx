"use client";

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import Navbar from "./components/Navbar";
import SiteFooter from "./components/SiteFooter";
import HomeBackdrop from "./components/HomeBackdrop";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Testimonials from "@/components/testimonials";


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

  // ── Load cached user BEFORE browser paints (no flicker) ──
  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { }
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {

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
      <Navbar />

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

      {/* --- Testimonials Section --- */}
      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.testimonialsGlow} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className={styles.sectionLabel}>Testimonials</span>
            <h2 className={styles.gradientSectionTitle}>Trusted by professionals</h2>
            <p className={styles.sectionSubtitle}>
              Hear from developers who used HireMate AI to optimize resumes, ace mock interviews, and land roles at leading tech companies.
            </p>
          </motion.div>

          <Testimonials />
        </div>
      </section>

      {/* --- Infinite Logo Ticker Marquee --- */}
      <h2 className={styles.logoTickerTitle}>
        Prepare for Interviews at <span className={styles.logoTickerTitleFaded}>the World&apos;s Leading Companies</span>
      </h2>
      <div className={styles.logoTickerSection}>
        <div className={styles.logoTickerTrack}>
          {/* First loop of items */}
          <div className={styles.logoTickerGroup}>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 272 92"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" /><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" /><path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" /><path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" /><path fill="#80CC28" d="M256 121.666H134.335V0H256z" /><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" /><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 603 182"><path d="M374.006 142.184c-35 25.797-85.729 39.561-129.406 39.561-61.242 0-116.376-22.651-158.087-60.325-3.278-2.962-.341-7 3.591-4.693 45.015 26.191 100.673 41.947 158.166 41.947 38.775 0 81.43-8.022 120.65-24.67 5.925-2.516 10.88 3.88 5.086 8.18" fill="#f90" /><path d="M388.557 125.536c-4.457-5.715-29.573-2.7-40.846-1.363-3.434.42-3.959-2.57-.865-4.719 20.003-14.078 52.827-10.015 56.654-5.296 3.828 4.745-.996 37.648-19.793 53.352-2.884 2.411-5.637 1.127-4.352-2.072 4.22-10.539 13.685-34.16 9.202-39.902" fill="#f90" /><path d="M348.497 20.066V6.381c0-2.071 1.573-3.46 3.461-3.46h61.269c1.966 0 3.54 1.415 3.54 3.46V18.1c-.027 1.966-1.679 4.535-4.615 8.599l-31.749 45.329c11.798-.289 24.25 1.468 34.947 7.498 2.412 1.363 3.068 3.356 3.251 5.322V99.45c0 1.992-2.202 4.325-4.509 3.12-18.85-9.884-43.887-10.96-64.73.104-2.123 1.154-4.351-1.153-4.351-3.146V85.661c0-2.229.026-6.03 2.254-9.412L384.047 23.5h-32.01c-1.967 0-3.54-1.39-3.54-3.434" fill="#fff" /><path d="M124.999 105.454h-18.64c-1.783-.13-3.199-1.468-3.33-3.172V6.617c0-1.914 1.6-3.435 3.592-3.435h17.382c1.809.079 3.25 1.468 3.382 3.199v12.505h.34c4.536-12.086 13.056-17.722 24.54-17.722 11.666 0 18.954 5.636 24.198 17.722 4.509-12.086 14.76-17.722 25.744-17.722 7.813 0 16.36 3.224 21.577 10.46 5.899 8.049 4.693 19.741 4.693 29.992l-.026 60.378c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.862-.13-3.356-1.625-3.356-3.46V51.29c0-4.037.367-14.104-.524-17.932-1.39-6.423-5.558-8.232-10.959-8.232-4.51 0-9.228 3.015-11.142 7.839s-1.73 12.898-1.73 18.325v50.704c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.888-.13-3.356-1.625-3.356-3.46l-.026-50.704c0-10.67 1.757-26.374-11.483-26.374-13.397 0-12.872 15.31-12.872 26.374v50.704c0 1.913-1.6 3.46-3.592 3.46" fill="#fff" /><path d="M469.514 1.164c27.66 0 42.629 23.752 42.629 53.954 0 29.18-16.543 52.329-42.629 52.329-27.16 0-41.947-23.753-41.947-53.352 0-29.782 14.97-52.931 41.947-52.931m.158 19.531c-13.738 0-14.603 18.719-14.603 30.386 0 11.692-.184 36.65 14.445 36.65 14.446 0 15.128-20.134 15.128-32.403 0-8.075-.341-17.723-2.78-25.378-2.097-6.66-6.265-9.255-12.19-9.255" fill="#fff" /><path d="M548.008 105.454h-18.562c-1.861-.13-3.356-1.625-3.356-3.46l-.026-95.692c.157-1.756 1.704-3.12 3.592-3.12h17.277c1.625.079 2.962 1.18 3.33 2.674v14.63h.34c5.217-13.083 12.532-19.322 25.404-19.322 8.363 0 16.517 3.015 21.76 11.273 4.877 7.655 4.877 20.528 4.877 29.782v60.22c-.21 1.678-1.757 3.015-3.592 3.015h-18.693c-1.704-.13-3.12-1.39-3.303-3.015V50.478c0-10.461 1.206-25.772-11.667-25.772-4.535 0-8.704 3.042-10.775 7.656-2.621 5.846-2.962 11.666-2.962 18.116v51.516c-.026 1.913-1.652 3.46-3.644 3.46" fill="#fff" /><path d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /><path transform="translate(244.367)" d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 171"><defs><linearGradient id="meta-a" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%"><stop offset="0%" stopColor="#0064E1" /><stop offset="40%" stopColor="#0064E1" /><stop offset="83%" stopColor="#0073EE" /><stop offset="100%" stopColor="#0082FB" /></linearGradient><linearGradient id="meta-b" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%"><stop offset="0%" stopColor="#0082FB" /><stop offset="100%" stopColor="#0064E0" /></linearGradient></defs><path fill="#0081FB" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z" /><path fill="url(#meta-a)" d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z" /><path fill="url(#meta-b)" d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 814 1000"><path fill="#fff" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 276.742"><path fill="#e50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676L44.051 119.724v151.073C28.647 272.418 14.594 274.58 0 276.742V0h41.08l56.212 157.021V0h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461V0h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862V242.15c-14.594 0-29.188 0-43.239.539V43.242h-44.862V0H463.22l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433V0h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676V0h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242V0h-42.43v251.338zM1024 0l-54.863 131.615L1024 276.742c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75L871.576 0h46.482l28.377 72.699L976.705 0H1024z" /></svg>
            </div>
            <div className={`${styles.logoTickerItem} ${styles.logoTickerItemAnthropic}`}>
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Anthropic</title><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 91 80"><defs><clipPath id="adobe-clip"><rect width="90.4318" height="80" fill="white" /></clipPath></defs><g clipPath="url(#adobe-clip)"><path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" /><path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" /><path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" fill="#EB1000" /></g></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 926.905 321.777"><path fill="white" d="M53.328 229.809c3.917 10.395 9.34 19.283 16.27 26.664 6.93 7.382 15.14 13.031 24.63 16.948 9.491 3.917 19.81 5.875 30.958 5.875 10.847 0 21.015-2.034 30.506-6.102s17.776-9.792 24.856-17.173c7.08-7.382 12.579-16.194 16.496-26.438s5.875-21.692 5.875-34.347V0h47.453v316.354h-47.001v-29.376c-10.545 11.147-22.974 19.734-37.285 25.761-14.312 6.025-29.752 9.038-46.323 9.038-16.873 0-32.615-2.938-47.228-8.813-14.612-5.875-27.267-14.235-37.962-25.082S15.441 264.006 9.265 248.79C3.088 233.575 0 216.628 0 197.947V0h47.453v195.236c0 12.655 1.958 24.178 5.875 34.573zM332.168 0v115.243c10.545-10.545 22.748-18.905 36.607-25.082s28.924-9.265 45.193-9.265c16.873 0 32.689 3.163 47.453 9.49 14.763 6.327 27.567 14.914 38.414 25.761s19.434 23.651 25.761 38.414c6.327 14.764 9.49 30.431 9.49 47.002 0 16.57-3.163 32.162-9.49 46.774-6.327 14.613-14.914 27.343-25.761 38.188-10.847 10.847-23.651 19.434-38.414 25.761-14.764 6.327-30.581 9.49-47.453 9.49-16.27 0-31.409-3.088-45.419-9.265-14.01-6.176-26.288-14.537-36.833-25.082v28.924h-45.193V0zm5.197 232.746c4.067 9.642 9.717 18.078 16.948 25.309s15.667 12.956 25.308 17.174c9.642 4.218 20.036 6.327 31.184 6.327 10.847 0 21.09-2.109 30.731-6.327s18.001-9.942 25.083-17.174c7.08-7.23 12.729-15.667 16.947-25.309 4.218-9.641 6.327-20.035 6.327-31.183s-2.109-21.618-6.327-31.41-9.867-18.303-16.947-25.534c-7.081-7.23-15.441-12.88-25.083-16.947s-19.885-6.102-30.731-6.102-21.09 2.034-30.731 6.102-18.077 9.717-25.309 16.947c-7.23 7.231-12.955 15.742-17.173 25.534s-6.327 20.262-6.327 31.41c-.001 11.148 2.033 21.542 6.1 31.183zm223.477-77.732c6.025-14.462 14.312-27.191 24.856-38.188s23.049-19.659 37.511-25.986 30.129-9.49 47.001-9.49c16.571 0 31.937 3.013 46.098 9.038 14.16 6.026 26.362 14.387 36.606 25.083 10.244 10.695 18.229 23.35 23.952 37.962 5.725 14.613 8.587 30.506 8.587 47.68v14.914H597.901c1.507 9.34 4.52 18.002 9.039 25.985 4.52 7.984 10.168 14.914 16.947 20.789 6.779 5.876 14.462 10.471 23.049 13.784 8.587 3.314 17.7 4.972 27.342 4.972 27.418 0 49.563-11.299 66.435-33.896l32.991 24.404c-11.449 15.366-25.609 27.418-42.481 36.155-16.873 8.737-35.854 13.106-56.944 13.106-17.174 0-33.217-3.014-48.131-9.039s-27.869-14.462-38.866-25.309-19.659-23.576-25.986-38.188-9.491-30.506-9.491-47.679c-.002-16.269 3.012-31.635 9.037-46.097zm63.497-17.852c-12.805 10.696-21.316 24.932-25.534 42.708h140.552c-3.917-17.776-12.278-32.012-25.083-42.708-12.805-10.695-27.794-16.043-44.967-16.043-17.174 0-32.163 5.348-44.968 16.043zm246.527 5.197c-9.641 10.545-14.462 24.856-14.462 42.934v131.062h-45.646V85.868h45.193v28.472c5.725-9.34 13.182-16.722 22.371-22.145 9.189-5.424 20.111-8.136 32.766-8.136h15.817v42.482h-18.981c-15.064.001-27.417 5.273-37.058 15.818z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="35.188 31.512 351.46 258.785"><path fill="#fff" d="M384.195 282.109c0 3.771-2.769 6.302-6.047 6.302v-.023c-3.371.023-6.089-2.508-6.089-6.278 0-3.769 2.718-6.293 6.089-6.293 3.279-.001 6.047 2.523 6.047 6.292zm2.453 0c0-5.175-4.02-8.179-8.5-8.179-4.511 0-8.531 3.004-8.531 8.179 0 5.172 4.021 8.188 8.531 8.188 4.481 0 8.5-3.016 8.5-8.188m-9.91.692h.91l2.109 3.703h2.316l-2.336-3.859c1.207-.086 2.2-.661 2.2-2.286 0-2.019-1.392-2.668-3.75-2.668h-3.411v8.813h1.961v-3.703m.001-1.492v-2.122h1.364c.742 0 1.753.06 1.753.965 0 .985-.523 1.157-1.398 1.157h-1.719M329.406 237.027l10.598 28.993H318.48l10.926-28.993zm-11.35-11.289-24.423 61.88h17.246l3.863-10.934h28.903l3.656 10.934h18.722l-24.605-61.888-23.362.008zm-49.033 61.903h17.497v-61.922l-17.5-.004.003 61.926zm-121.467-61.926-14.598 49.078-13.984-49.074-18.879-.004 19.972 61.926h25.207l20.133-61.926h-17.851zm70.725 13.484h7.52c10.91 0 17.966 4.898 17.966 17.609 0 12.714-7.056 17.613-17.966 17.613h-7.52v-35.222zm-17.35-13.484v61.926h28.366c15.113 0 20.048-2.512 25.384-8.148 3.769-3.957 6.207-12.641 6.207-22.134 0-8.707-2.063-16.468-5.66-21.304-6.481-8.649-15.817-10.34-29.75-10.34h-24.547zm-165.743-.086v62.012h17.645v-47.086l13.672.004c4.527 0 7.754 1.128 9.934 3.457 2.765 2.945 3.894 7.699 3.894 16.395v27.23h17.098v-34.262c0-24.453-15.586-27.75-30.836-27.75H35.188zm137.583.086.007 61.926h17.489v-61.926h-17.496z" /><path fill="#77B900" d="M82.211 102.414s22.504-33.203 67.437-36.638V53.73c-49.769 3.997-92.867 46.149-92.867 46.149s24.41 70.565 92.867 77.026v-12.804c-50.237-6.32-67.437-61.687-67.437-61.687zm67.437 36.223v11.726c-37.968-6.769-48.507-46.237-48.507-46.237s18.23-20.195 48.507-23.47v12.867c-.023 0-.039-.007-.058-.007-15.891-1.907-28.305 12.938-28.305 12.938s6.958 24.991 28.363 32.183m0-107.125V53.73c1.461-.112 2.922-.207 4.391-.257 56.582-1.907 93.449 46.406 93.449 46.406s-42.343 51.488-86.457 51.488c-4.043 0-7.828-.375-11.383-1.005v13.739c3.04.386 6.192.613 9.481.613 41.051 0 70.738-20.965 99.484-45.778 4.766 3.817 24.278 13.103 28.289 17.168-27.332 22.883-91.031 41.329-127.144 41.329-3.481 0-6.824-.211-10.11-.528v19.306H305.68V31.512H149.648zm0 49.144V65.777c1.446-.101 2.903-.179 4.391-.226 40.688-1.278 67.382 34.965 67.382 34.965s-28.832 40.043-59.746 40.043c-4.449 0-8.438-.715-12.028-1.922V93.523c15.84 1.914 19.028 8.911 28.551 24.786l21.18-17.859s-15.461-20.277-41.524-20.277c-2.833-.001-5.544.198-8.206.483" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1180 320"><g fill="#fff" clipPath="url(#openai-a)"><path d="M367.44 153.84c0 52.32 33.6 88.8 80.16 88.8 46.56 0 80.16-36.48 80.16-88.8s-33.6-88.8-80.16-88.8c-46.56 0-80.16 36.48-80.16 88.8Zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68ZM614.27 242.64c35.28 0 55.44-29.76 55.44-65.52 0-35.76-20.16-65.52-55.44-65.52-16.32 0-28.32 6.48-36.24 15.84V114h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84Zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48v-7.44ZM747.65 242.64c25.2 0 45.12-13.2 54-35.28L776.93 198c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16-36.48 0-60 28.56-60 65.52 0 38.88 25.2 65.52 61.2 65.52Zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92ZM823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88V240h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84V114h-28.8v126ZM1014.17 67.68 948.89 240h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32h-34.8Zm16.8 34.08 27.36 72h-54.24l26.88-72ZM1163.69 68.18h-30.72V240.5h30.72V68.18ZM297.06 130.97a79.712 79.712 0 0 0-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 0 0 143.24 0C108.2-.08 77.11 22.48 66.33 55.82a79.754 79.754 0 0 0-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 0 0 6.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0 0 60.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0 0 53.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51l-.01.02ZM176.78 299.08a59.77 59.77 0 0 1-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 0 0 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97ZM47.94 244.05a59.71 59.71 0 0 1-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83L129.87 266c-28.69 16.52-65.33 6.7-81.92-21.95h-.01ZM31.17 104.96c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91L118.44 224c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89l.01-.01Zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 0 1-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06h-.01Zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 0 0-10.47 0l-77.79 44.92V92c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 0 1 7.15 40.1h.02Zm-168.51 55.43-26.94-15.55a.943.943 0 0 1-.52-.74V80.86c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07L116 72.67a10.344 10.344 0 0 0-5.24 9.06l-.04 89.79v.02ZM125.35 140 160 119.99l34.65 20V180L160 200l-34.65-20v-40Z" /></g><defs><clipPath id="openai-a"><path fill="#fff" d="M0 0h1180v320H0z" /></clipPath></defs></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 512 214"><path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><defs><linearGradient x1="99.7%" y1="15.8%" x2="39.8%" y2="97.4%" id="atl-a"><stop stopColor="#0052CC" offset="0%" /><stop stopColor="#2684FF" offset="92.3%" /></linearGradient></defs><path d="M76 118c-4-4-10-4-13 1L1 245a7 7 0 0 0 6 10h88c3 0 5-1 6-4 19-39 8-98-25-133Z" fill="url(#atl-a)" /><path d="M122 4c-35 56-33 117-10 163l42 84c1 3 4 4 7 4h87a7 7 0 0 0 7-10L134 4c-2-5-9-5-12 0Z" fill="#2681FF" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 1024" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#fff" /></svg>
            </div>

            {/* Duplicated half */}
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 272 92"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" /><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" /><path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" /><path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" /><path fill="#80CC28" d="M256 121.666H134.335V0H256z" /><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" /><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 603 182"><path d="M374.006 142.184c-35 25.797-85.729 39.561-129.406 39.561-61.242 0-116.376-22.651-158.087-60.325-3.278-2.962-.341-7 3.591-4.693 45.015 26.191 100.673 41.947 158.166 41.947 38.775 0 81.43-8.022 120.65-24.67 5.925-2.516 10.88 3.88 5.086 8.18" fill="#f90" /><path d="M388.557 125.536c-4.457-5.715-29.573-2.7-40.846-1.363-3.434.42-3.959-2.57-.865-4.719 20.003-14.078 52.827-10.015 56.654-5.296 3.828 4.745-.996 37.648-19.793 53.352-2.884 2.411-5.637 1.127-4.352-2.072 4.22-10.539 13.685-34.16 9.202-39.902" fill="#f90" /><path d="M348.497 20.066V6.381c0-2.071 1.573-3.46 3.461-3.46h61.269c1.966 0 3.54 1.415 3.54 3.46V18.1c-.027 1.966-1.679 4.535-4.615 8.599l-31.749 45.329c11.798-.289 24.25 1.468 34.947 7.498 2.412 1.363 3.068 3.356 3.251 5.322V99.45c0 1.992-2.202 4.325-4.509 3.12-18.85-9.884-43.887-10.96-64.73.104-2.123 1.154-4.351-1.153-4.351-3.146V85.661c0-2.229.026-6.03 2.254-9.412L384.047 23.5h-32.01c-1.967 0-3.54-1.39-3.54-3.434" fill="#fff" /><path d="M124.999 105.454h-18.64c-1.783-.13-3.199-1.468-3.33-3.172V6.617c0-1.914 1.6-3.435 3.592-3.435h17.382c1.809.079 3.25 1.468 3.382 3.199v12.505h.34c4.536-12.086 13.056-17.722 24.54-17.722 11.666 0 18.954 5.636 24.198 17.722 4.509-12.086 14.76-17.722 25.744-17.722 7.813 0 16.36 3.224 21.577 10.46 5.899 8.049 4.693 19.741 4.693 29.992l-.026 60.378c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.862-.13-3.356-1.625-3.356-3.46V51.29c0-4.037.367-14.104-.524-17.932-1.39-6.423-5.558-8.232-10.959-8.232-4.51 0-9.228 3.015-11.142 7.839s-1.73 12.898-1.73 18.325v50.704c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.888-.13-3.356-1.625-3.356-3.46l-.026-50.704c0-10.67 1.757-26.374-11.483-26.374-13.397 0-12.872 15.31-12.872 26.374v50.704c0 1.913-1.6 3.46-3.592 3.46" fill="#fff" /><path d="M469.514 1.164c27.66 0 42.629 23.752 42.629 53.954 0 29.18-16.543 52.329-42.629 52.329-27.16 0-41.947-23.753-41.947-53.352 0-29.782 14.97-52.931 41.947-52.931m.158 19.531c-13.738 0-14.603 18.719-14.603 30.386 0 11.692-.184 36.65 14.445 36.65 14.446 0 15.128-20.134 15.128-32.403 0-8.075-.341-17.723-2.78-25.378-2.097-6.66-6.265-9.255-12.19-9.255" fill="#fff" /><path d="M548.008 105.454h-18.562c-1.861-.13-3.356-1.625-3.356-3.46l-.026-95.692c.157-1.756 1.704-3.12 3.592-3.12h17.277c1.625.079 2.962 1.18 3.33 2.674v14.63h.34c5.217-13.083 12.532-19.322 25.404-19.322 8.363 0 16.517 3.015 21.76 11.273 4.877 7.655 4.877 20.528 4.877 29.782v60.22c-.21 1.678-1.757 3.015-3.592 3.015h-18.693c-1.704-.13-3.12-1.39-3.303-3.015V50.478c0-10.461 1.206-25.772-11.667-25.772-4.535 0-8.704 3.042-10.775 7.656-2.621 5.846-2.962 11.666-2.962 18.116v51.516c-.026 1.913-1.652 3.46-3.644 3.46" fill="#fff" /><path d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /><path transform="translate(244.367)" d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 171"><defs><linearGradient id="meta-a" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%"><stop offset="0%" stopColor="#0064E1" /><stop offset="40%" stopColor="#0064E1" /><stop offset="83%" stopColor="#0073EE" /><stop offset="100%" stopColor="#0082FB" /></linearGradient><linearGradient id="meta-b" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%"><stop offset="0%" stopColor="#0082FB" /><stop offset="100%" stopColor="#0064E0" /></linearGradient></defs><path fill="#0081FB" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z" /><path fill="url(#meta-a)" d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z" /><path fill="url(#meta-b)" d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 814 1000"><path fill="#fff" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 276.742"><path fill="#e50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676L44.051 119.724v151.073C28.647 272.418 14.594 274.58 0 276.742V0h41.08l56.212 157.021V0h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461V0h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862V242.15c-14.594 0-29.188 0-43.239.539V43.242h-44.862V0H463.22l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433V0h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676V0h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242V0h-42.43v251.338zM1024 0l-54.863 131.615L1024 276.742c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75L871.576 0h46.482l28.377 72.699L976.705 0H1024z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Anthropic</title><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 91 80"><defs><clipPath id="adobe-clip"><rect width="90.4318" height="80" fill="white" /></clipPath></defs><g clipPath="url(#adobe-clip)"><path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" /><path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" /><path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" fill="#EB1000" /></g></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 926.905 321.777"><path fill="white" d="M53.328 229.809c3.917 10.395 9.34 19.283 16.27 26.664 6.93 7.382 15.14 13.031 24.63 16.948 9.491 3.917 19.81 5.875 30.958 5.875 10.847 0 21.015-2.034 30.506-6.102s17.776-9.792 24.856-17.173c7.08-7.382 12.579-16.194 16.496-26.438s5.875-21.692 5.875-34.347V0h47.453v316.354h-47.001v-29.376c-10.545 11.147-22.974 19.734-37.285 25.761-14.312 6.025-29.752 9.038-46.323 9.038-16.873 0-32.615-2.938-47.228-8.813-14.612-5.875-27.267-14.235-37.962-25.082S15.441 264.006 9.265 248.79C3.088 233.575 0 216.628 0 197.947V0h47.453v195.236c0 12.655 1.958 24.178 5.875 34.573zM332.168 0v115.243c10.545-10.545 22.748-18.905 36.607-25.082s28.924-9.265 45.193-9.265c16.873 0 32.689 3.163 47.453 9.49 14.763 6.327 27.567 14.914 38.414 25.761s19.434 23.651 25.761 38.414c6.327 14.764 9.49 30.431 9.49 47.002 0 16.57-3.163 32.162-9.49 46.774-6.327 14.613-14.914 27.343-25.761 38.188-10.847 10.847-23.651 19.434-38.414 25.761-14.764 6.327-30.581 9.49-47.453 9.49-16.27 0-31.409-3.088-45.419-9.265-14.01-6.176-26.288-14.537-36.833-25.082v28.924h-45.193V0zm5.197 232.746c4.067 9.642 9.717 18.078 16.948 25.309s15.667 12.956 25.308 17.174c9.642 4.218 20.036 6.327 31.184 6.327 10.847 0 21.09-2.109 30.731-6.327s18.001-9.942 25.083-17.174c7.08-7.23 12.729-15.667 16.947-25.309 4.218-9.641 6.327-20.035 6.327-31.183s-2.109-21.618-6.327-31.41-9.867-18.303-16.947-25.534c-7.081-7.23-15.441-12.88-25.083-16.947s-19.885-6.102-30.731-6.102-21.09 2.034-30.731 6.102-18.077 9.717-25.309 16.947c-7.23 7.231-12.955 15.742-17.173 25.534s-6.327 20.262-6.327 31.41c-.001 11.148 2.033 21.542 6.1 31.183zm223.477-77.732c6.025-14.462 14.312-27.191 24.856-38.188s23.049-19.659 37.511-25.986 30.129-9.49 47.001-9.49c16.571 0 31.937 3.013 46.098 9.038 14.16 6.026 26.362 14.387 36.606 25.083 10.244 10.695 18.229 23.35 23.952 37.962 5.725 14.613 8.587 30.506 8.587 47.68v14.914H597.901c1.507 9.34 4.52 18.002 9.039 25.985 4.52 7.984 10.168 14.914 16.947 20.789 6.779 5.876 14.462 10.471 23.049 13.784 8.587 3.314 17.7 4.972 27.342 4.972 27.418 0 49.563-11.299 66.435-33.896l32.991 24.404c-11.449 15.366-25.609 27.418-42.481 36.155-16.873 8.737-35.854 13.106-56.944 13.106-17.174 0-33.217-3.014-48.131-9.039s-27.869-14.462-38.866-25.309-19.659-23.576-25.986-38.188-9.491-30.506-9.491-47.679c-.002-16.269 3.012-31.635 9.037-46.097zm63.497-17.852c-12.805 10.696-21.316 24.932-25.534 42.708h140.552c-3.917-17.776-12.278-32.012-25.083-42.708-12.805-10.695-27.794-16.043-44.967-16.043-17.174 0-32.163 5.348-44.968 16.043zm246.527 5.197c-9.641 10.545-14.462 24.856-14.462 42.934v131.062h-45.646V85.868h45.193v28.472c5.725-9.34 13.182-16.722 22.371-22.145 9.189-5.424 20.111-8.136 32.766-8.136h15.817v42.482h-18.981c-15.064.001-27.417 5.273-37.058 15.818z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="35.188 31.512 351.46 258.785"><path fill="#fff" d="M384.195 282.109c0 3.771-2.769 6.302-6.047 6.302v-.023c-3.371.023-6.089-2.508-6.089-6.278 0-3.769 2.718-6.293 6.089-6.293 3.279-.001 6.047 2.523 6.047 6.292zm2.453 0c0-5.175-4.02-8.179-8.5-8.179-4.511 0-8.531 3.004-8.531 8.179 0 5.172 4.021 8.188 8.531 8.188 4.481 0 8.5-3.016 8.5-8.188m-9.91.692h.91l2.109 3.703h2.316l-2.336-3.859c1.207-.086 2.2-.661 2.2-2.286 0-2.019-1.392-2.668-3.75-2.668h-3.411v8.813h1.961v-3.703m.001-1.492v-2.122h1.364c.742 0 1.753.06 1.753.965 0 .985-.523 1.157-1.398 1.157h-1.719M329.406 237.027l10.598 28.993H318.48l10.926-28.993zm-11.35-11.289-24.423 61.88h17.246l3.863-10.934h28.903l3.656 10.934h18.722l-24.605-61.888-23.362.008zm-49.033 61.903h17.497v-61.922l-17.5-.004.003 61.926zm-121.467-61.926-14.598 49.078-13.984-49.074-18.879-.004 19.972 61.926h25.207l20.133-61.926h-17.851zm70.725 13.484h7.52c10.91 0 17.966 4.898 17.966 17.609 0 12.714-7.056 17.613-17.966 17.613h-7.52v-35.222zm-17.35-13.484v61.926h28.366c15.113 0 20.048-2.512 25.384-8.148 3.769-3.957 6.207-12.641 6.207-22.134 0-8.707-2.063-16.468-5.66-21.304-6.481-8.649-15.817-10.34-29.75-10.34h-24.547zm-165.743-.086v62.012h17.645v-47.086l13.672.004c4.527 0 7.754 1.128 9.934 3.457 2.765 2.945 3.894 7.699 3.894 16.395v27.23h17.098v-34.262c0-24.453-15.586-27.75-30.836-27.75H35.188zm137.583.086.007 61.926h17.489v-61.926h-17.496z" /><path fill="#77B900" d="M82.211 102.414s22.504-33.203 67.437-36.638V53.73c-49.769 3.997-92.867 46.149-92.867 46.149s24.41 70.565 92.867 77.026v-12.804c-50.237-6.32-67.437-61.687-67.437-61.687zm67.437 36.223v11.726c-37.968-6.769-48.507-46.237-48.507-46.237s18.23-20.195 48.507-23.47v12.867c-.023 0-.039-.007-.058-.007-15.891-1.907-28.305 12.938-28.305 12.938s6.958 24.991 28.363 32.183m0-107.125V53.73c1.461-.112 2.922-.207 4.391-.257 56.582-1.907 93.449 46.406 93.449 46.406s-42.343 51.488-86.457 51.488c-4.043 0-7.828-.375-11.383-1.005v13.739c3.04.386 6.192.613 9.481.613 41.051 0 70.738-20.965 99.484-45.778 4.766 3.817 24.278 13.103 28.289 17.168-27.332 22.883-91.031 41.329-127.144 41.329-3.481 0-6.824-.211-10.11-.528v19.306H305.68V31.512H149.648zm0 49.144V65.777c1.446-.101 2.903-.179 4.391-.226 40.688-1.278 67.382 34.965 67.382 34.965s-28.832 40.043-59.746 40.043c-4.449 0-8.438-.715-12.028-1.922V93.523c15.84 1.914 19.028 8.911 28.551 24.786l21.18-17.859s-15.461-20.277-41.524-20.277c-2.833-.001-5.544.198-8.206.483" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1180 320"><g fill="#fff" clipPath="url(#openai-a)"><path d="M367.44 153.84c0 52.32 33.6 88.8 80.16 88.8 46.56 0 80.16-36.48 80.16-88.8s-33.6-88.8-80.16-88.8c-46.56 0-80.16 36.48-80.16 88.8Zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68ZM614.27 242.64c35.28 0 55.44-29.76 55.44-65.52 0-35.76-20.16-65.52-55.44-65.52-16.32 0-28.32 6.48-36.24 15.84V114h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84Zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48v-7.44ZM747.65 242.64c25.2 0 45.12-13.2 54-35.28L776.93 198c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16-36.48 0-60 28.56-60 65.52 0 38.88 25.2 65.52 61.2 65.52Zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92ZM823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88V240h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84V114h-28.8v126ZM1014.17 67.68 948.89 240h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32h-34.8Zm16.8 34.08 27.36 72h-54.24l26.88-72ZM1163.69 68.18h-30.72V240.5h30.72V68.18ZM297.06 130.97a79.712 79.712 0 0 0-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 0 0 143.24 0C108.2-.08 77.11 22.48 66.33 55.82a79.754 79.754 0 0 0-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 0 0 6.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0 0 60.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0 0 53.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51l-.01.02ZM176.78 299.08a59.77 59.77 0 0 1-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 0 0 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97ZM47.94 244.05a59.71 59.71 0 0 1-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83L129.87 266c-28.69 16.52-65.33 6.7-81.92-21.95h-.01ZM31.17 104.96c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91L118.44 224c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89l.01-.01Zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 0 1-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06h-.01Zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 0 0-10.47 0l-77.79 44.92V92c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 0 1 7.15 40.1h.02Zm-168.51 55.43-26.94-15.55a.943.943 0 0 1-.52-.74V80.86c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07L116 72.67a10.344 10.344 0 0 0-5.24 9.06l-.04 89.79v.02ZM125.35 140 160 119.99l34.65 20V180L160 200l-34.65-20v-40Z" /></g><defs><clipPath id="openai-a"><path fill="#fff" d="M0 0h1180v320H0z" /></clipPath></defs></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 512 214"><path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><defs><linearGradient x1="99.7%" y1="15.8%" x2="39.8%" y2="97.4%" id="atl-a"><stop stopColor="#0052CC" offset="0%" /><stop stopColor="#2684FF" offset="92.3%" /></linearGradient></defs><path d="M76 118c-4-4-10-4-13 1L1 245a7 7 0 0 0 6 10h88c3 0 5-1 6-4 19-39 8-98-25-133Z" fill="url(#atl-a)" /><path d="M122 4c-35 56-33 117-10 163l42 84c1 3 4 4 7 4h87a7 7 0 0 0 7-10L134 4c-2-5-9-5-12 0Z" fill="#2681FF" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 1024" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#fff" /></svg>
            </div>
          </div>

          {/* Second loop of items */}
          <div className={styles.logoTickerGroup} aria-hidden="true">
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 272 92"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" /><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" /><path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" /><path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" /><path fill="#80CC28" d="M256 121.666H134.335V0H256z" /><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" /><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 603 182"><path d="M374.006 142.184c-35 25.797-85.729 39.561-129.406 39.561-61.242 0-116.376-22.651-158.087-60.325-3.278-2.962-.341-7 3.591-4.693 45.015 26.191 100.673 41.947 158.166 41.947 38.775 0 81.43-8.022 120.65-24.67 5.925-2.516 10.88 3.88 5.086 8.18" fill="#f90" /><path d="M388.557 125.536c-4.457-5.715-29.573-2.7-40.846-1.363-3.434.42-3.959-2.57-.865-4.719 20.003-14.078 52.827-10.015 56.654-5.296 3.828 4.745-.996 37.648-19.793 53.352-2.884 2.411-5.637 1.127-4.352-2.072 4.22-10.539 13.685-34.16 9.202-39.902" fill="#f90" /><path d="M348.497 20.066V6.381c0-2.071 1.573-3.46 3.461-3.46h61.269c1.966 0 3.54 1.415 3.54 3.46V18.1c-.027 1.966-1.679 4.535-4.615 8.599l-31.749 45.329c11.798-.289 24.25 1.468 34.947 7.498 2.412 1.363 3.068 3.356 3.251 5.322V99.45c0 1.992-2.202 4.325-4.509 3.12-18.85-9.884-43.887-10.96-64.73.104-2.123 1.154-4.351-1.153-4.351-3.146V85.661c0-2.229.026-6.03 2.254-9.412L384.047 23.5h-32.01c-1.967 0-3.54-1.39-3.54-3.434" fill="#fff" /><path d="M124.999 105.454h-18.64c-1.783-.13-3.199-1.468-3.33-3.172V6.617c0-1.914 1.6-3.435 3.592-3.435h17.382c1.809.079 3.25 1.468 3.382 3.199v12.505h.34c4.536-12.086 13.056-17.722 24.54-17.722 11.666 0 18.954 5.636 24.198 17.722 4.509-12.086 14.76-17.722 25.744-17.722 7.813 0 16.36 3.224 21.577 10.46 5.899 8.049 4.693 19.741 4.693 29.992l-.026 60.378c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.862-.13-3.356-1.625-3.356-3.46V51.29c0-4.037.367-14.104-.524-17.932-1.39-6.423-5.558-8.232-10.959-8.232-4.51 0-9.228 3.015-11.142 7.839s-1.73 12.898-1.73 18.325v50.704c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.888-.13-3.356-1.625-3.356-3.46l-.026-50.704c0-10.67 1.757-26.374-11.483-26.374-13.397 0-12.872 15.31-12.872 26.374v50.704c0 1.913-1.6 3.46-3.592 3.46" fill="#fff" /><path d="M469.514 1.164c27.66 0 42.629 23.752 42.629 53.954 0 29.18-16.543 52.329-42.629 52.329-27.16 0-41.947-23.753-41.947-53.352 0-29.782 14.97-52.931 41.947-52.931m.158 19.531c-13.738 0-14.603 18.719-14.603 30.386 0 11.692-.184 36.65 14.445 36.65 14.446 0 15.128-20.134 15.128-32.403 0-8.075-.341-17.723-2.78-25.378-2.097-6.66-6.265-9.255-12.19-9.255" fill="#fff" /><path d="M548.008 105.454h-18.562c-1.861-.13-3.356-1.625-3.356-3.46l-.026-95.692c.157-1.756 1.704-3.12 3.592-3.12h17.277c1.625.079 2.962 1.18 3.33 2.674v14.63h.34c5.217-13.083 12.532-19.322 25.404-19.322 8.363 0 16.517 3.015 21.76 11.273 4.877 7.655 4.877 20.528 4.877 29.782v60.22c-.21 1.678-1.757 3.015-3.592 3.015h-18.693c-1.704-.13-3.12-1.39-3.303-3.015V50.478c0-10.461 1.206-25.772-11.667-25.772-4.535 0-8.704 3.042-10.775 7.656-2.621 5.846-2.962 11.666-2.962 18.116v51.516c-.026 1.913-1.652 3.46-3.644 3.46" fill="#fff" /><path d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /><path transform="translate(244.367)" d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 171"><defs><linearGradient id="meta-a" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%"><stop offset="0%" stopColor="#0064E1" /><stop offset="40%" stopColor="#0064E1" /><stop offset="83%" stopColor="#0073EE" /><stop offset="100%" stopColor="#0082FB" /></linearGradient><linearGradient id="meta-b" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%"><stop offset="0%" stopColor="#0082FB" /><stop offset="100%" stopColor="#0064E0" /></linearGradient></defs><path fill="#0081FB" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z" /><path fill="url(#meta-a)" d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z" /><path fill="url(#meta-b)" d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 814 1000"><path fill="#fff" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 276.742"><path fill="#e50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676L44.051 119.724v151.073C28.647 272.418 14.594 274.58 0 276.742V0h41.08l56.212 157.021V0h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461V0h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862V242.15c-14.594 0-29.188 0-43.239.539V43.242h-44.862V0H463.22l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433V0h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676V0h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242V0h-42.43v251.338zM1024 0l-54.863 131.615L1024 276.742c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75L871.576 0h46.482l28.377 72.699L976.705 0H1024z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Anthropic</title><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 91 80"><defs><clipPath id="adobe-clip"><rect width="90.4318" height="80" fill="white" /></clipPath></defs><g clipPath="url(#adobe-clip)"><path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" /><path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" /><path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" fill="#EB1000" /></g></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 926.905 321.777"><path fill="white" d="M53.328 229.809c3.917 10.395 9.34 19.283 16.27 26.664 6.93 7.382 15.14 13.031 24.63 16.948 9.491 3.917 19.81 5.875 30.958 5.875 10.847 0 21.015-2.034 30.506-6.102s17.776-9.792 24.856-17.173c7.08-7.382 12.579-16.194 16.496-26.438s5.875-21.692 5.875-34.347V0h47.453v316.354h-47.001v-29.376c-10.545 11.147-22.974 19.734-37.285 25.761-14.312 6.025-29.752 9.038-46.323 9.038-16.873 0-32.615-2.938-47.228-8.813-14.612-5.875-27.267-14.235-37.962-25.082S15.441 264.006 9.265 248.79C3.088 233.575 0 216.628 0 197.947V0h47.453v195.236c0 12.655 1.958 24.178 5.875 34.573zM332.168 0v115.243c10.545-10.545 22.748-18.905 36.607-25.082s28.924-9.265 45.193-9.265c16.873 0 32.689 3.163 47.453 9.49 14.763 6.327 27.567 14.914 38.414 25.761s19.434 23.651 25.761 38.414c6.327 14.764 9.49 30.431 9.49 47.002 0 16.57-3.163 32.162-9.49 46.774-6.327 14.613-14.914 27.343-25.761 38.188-10.847 10.847-23.651 19.434-38.414 25.761-14.764 6.327-30.581 9.49-47.453 9.49-16.27 0-31.409-3.088-45.419-9.265-14.01-6.176-26.288-14.537-36.833-25.082v28.924h-45.193V0zm5.197 232.746c4.067 9.642 9.717 18.078 16.948 25.309s15.667 12.956 25.308 17.174c9.642 4.218 20.036 6.327 31.184 6.327 10.847 0 21.09-2.109 30.731-6.327s18.001-9.942 25.083-17.174c7.08-7.23 12.729-15.667 16.947-25.309 4.218-9.641 6.327-20.035 6.327-31.183s-2.109-21.618-6.327-31.41-9.867-18.303-16.947-25.534c-7.081-7.23-15.441-12.88-25.083-16.947s-19.885-6.102-30.731-6.102-21.09 2.034-30.731 6.102-18.077 9.717-25.309 16.947c-7.23 7.231-12.955 15.742-17.173 25.534s-6.327 20.262-6.327 31.41c-.001 11.148 2.033 21.542 6.1 31.183zm223.477-77.732c6.025-14.462 14.312-27.191 24.856-38.188s23.049-19.659 37.511-25.986 30.129-9.49 47.001-9.49c16.571 0 31.937 3.013 46.098 9.038 14.16 6.026 26.362 14.387 36.606 25.083 10.244 10.695 18.229 23.35 23.952 37.962 5.725 14.613 8.587 30.506 8.587 47.68v14.914H597.901c1.507 9.34 4.52 18.002 9.039 25.985 4.52 7.984 10.168 14.914 16.947 20.789 6.779 5.876 14.462 10.471 23.049 13.784 8.587 3.314 17.7 4.972 27.342 4.972 27.418 0 49.563-11.299 66.435-33.896l32.991 24.404c-11.449 15.366-25.609 27.418-42.481 36.155-16.873 8.737-35.854 13.106-56.944 13.106-17.174 0-33.217-3.014-48.131-9.039s-27.869-14.462-38.866-25.309-19.659-23.576-25.986-38.188-9.491-30.506-9.491-47.679c-.002-16.269 3.012-31.635 9.037-46.097zm63.497-17.852c-12.805 10.696-21.316 24.932-25.534 42.708h140.552c-3.917-17.776-12.278-32.012-25.083-42.708-12.805-10.695-27.794-16.043-44.967-16.043-17.174 0-32.163 5.348-44.968 16.043zm246.527 5.197c-9.641 10.545-14.462 24.856-14.462 42.934v131.062h-45.646V85.868h45.193v28.472c5.725-9.34 13.182-16.722 22.371-22.145 9.189-5.424 20.111-8.136 32.766-8.136h15.817v42.482h-18.981c-15.064.001-27.417 5.273-37.058 15.818z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="35.188 31.512 351.46 258.785"><path fill="#fff" d="M384.195 282.109c0 3.771-2.769 6.302-6.047 6.302v-.023c-3.371.023-6.089-2.508-6.089-6.278 0-3.769 2.718-6.293 6.089-6.293 3.279-.001 6.047 2.523 6.047 6.292zm2.453 0c0-5.175-4.02-8.179-8.5-8.179-4.511 0-8.531 3.004-8.531 8.179 0 5.172 4.021 8.188 8.531 8.188 4.481 0 8.5-3.016 8.5-8.188m-9.91.692h.91l2.109 3.703h2.316l-2.336-3.859c1.207-.086 2.2-.661 2.2-2.286 0-2.019-1.392-2.668-3.75-2.668h-3.411v8.813h1.961v-3.703m.001-1.492v-2.122h1.364c.742 0 1.753.06 1.753.965 0 .985-.523 1.157-1.398 1.157h-1.719M329.406 237.027l10.598 28.993H318.48l10.926-28.993zm-11.35-11.289-24.423 61.88h17.246l3.863-10.934h28.903l3.656 10.934h18.722l-24.605-61.888-23.362.008zm-49.033 61.903h17.497v-61.922l-17.5-.004.003 61.926zm-121.467-61.926-14.598 49.078-13.984-49.074-18.879-.004 19.972 61.926h25.207l20.133-61.926h-17.851zm70.725 13.484h7.52c10.91 0 17.966 4.898 17.966 17.609 0 12.714-7.056 17.613-17.966 17.613h-7.52v-35.222zm-17.35-13.484v61.926h28.366c15.113 0 20.048-2.512 25.384-8.148 3.769-3.957 6.207-12.641 6.207-22.134 0-8.707-2.063-16.468-5.66-21.304-6.481-8.649-15.817-10.34-29.75-10.34h-24.547zm-165.743-.086v62.012h17.645v-47.086l13.672.004c4.527 0 7.754 1.128 9.934 3.457 2.765 2.945 3.894 7.699 3.894 16.395v27.23h17.098v-34.262c0-24.453-15.586-27.75-30.836-27.75H35.188zm137.583.086.007 61.926h17.489v-61.926h-17.496z" /><path fill="#77B900" d="M82.211 102.414s22.504-33.203 67.437-36.638V53.73c-49.769 3.997-92.867 46.149-92.867 46.149s24.41 70.565 92.867 77.026v-12.804c-50.237-6.32-67.437-61.687-67.437-61.687zm67.437 36.223v11.726c-37.968-6.769-48.507-46.237-48.507-46.237s18.23-20.195 48.507-23.47v12.867c-.023 0-.039-.007-.058-.007-15.891-1.907-28.305 12.938-28.305 12.938s6.958 24.991 28.363 32.183m0-107.125V53.73c1.461-.112 2.922-.207 4.391-.257 56.582-1.907 93.449 46.406 93.449 46.406s-42.343 51.488-86.457 51.488c-4.043 0-7.828-.375-11.383-1.005v13.739c3.04.386 6.192.613 9.481.613 41.051 0 70.738-20.965 99.484-45.778 4.766 3.817 24.278 13.103 28.289 17.168-27.332 22.883-91.031 41.329-127.144 41.329-3.481 0-6.824-.211-10.11-.528v19.306H305.68V31.512H149.648zm0 49.144V65.777c1.446-.101 2.903-.179 4.391-.226 40.688-1.278 67.382 34.965 67.382 34.965s-28.832 40.043-59.746 40.043c-4.449 0-8.438-.715-12.028-1.922V93.523c15.84 1.914 19.028 8.911 28.551 24.786l21.18-17.859s-15.461-20.277-41.524-20.277c-2.833-.001-5.544.198-8.206.483" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1180 320"><g fill="#fff" clipPath="url(#openai-a)"><path d="M367.44 153.84c0 52.32 33.6 88.8 80.16 88.8 46.56 0 80.16-36.48 80.16-88.8s-33.6-88.8-80.16-88.8c-46.56 0-80.16 36.48-80.16 88.8Zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68ZM614.27 242.64c35.28 0 55.44-29.76 55.44-65.52 0-35.76-20.16-65.52-55.44-65.52-16.32 0-28.32 6.48-36.24 15.84V114h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84Zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48v-7.44ZM747.65 242.64c25.2 0 45.12-13.2 54-35.28L776.93 198c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16-36.48 0-60 28.56-60 65.52 0 38.88 25.2 65.52 61.2 65.52Zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92ZM823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88V240h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84V114h-28.8v126ZM1014.17 67.68 948.89 240h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32h-34.8Zm16.8 34.08 27.36 72h-54.24l26.88-72ZM1163.69 68.18h-30.72V240.5h30.72V68.18ZM297.06 130.97a79.712 79.712 0 0 0-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 0 0 143.24 0C108.2-.08 77.11 22.48 66.33 55.82a79.754 79.754 0 0 0-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 0 0 6.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0 0 60.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0 0 53.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51l-.01.02ZM176.78 299.08a59.77 59.77 0 0 1-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 0 0 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97ZM47.94 244.05a59.71 59.71 0 0 1-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83L129.87 266c-28.69 16.52-65.33 6.7-81.92-21.95h-.01ZM31.17 104.96c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91L118.44 224c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89l.01-.01Zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 0 1-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06h-.01Zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 0 0-10.47 0l-77.79 44.92V92c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 0 1 7.15 40.1h.02Zm-168.51 55.43-26.94-15.55a.943.943 0 0 1-.52-.74V80.86c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07L116 72.67a10.344 10.344 0 0 0-5.24 9.06l-.04 89.79v.02ZM125.35 140 160 119.99l34.65 20V180L160 200l-34.65-20v-40Z" /></g><defs><clipPath id="openai-a"><path fill="#fff" d="M0 0h1180v320H0z" /></clipPath></defs></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 512 214"><path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><defs><linearGradient x1="99.7%" y1="15.8%" x2="39.8%" y2="97.4%" id="atl-a"><stop stopColor="#0052CC" offset="0%" /><stop stopColor="#2684FF" offset="92.3%" /></linearGradient></defs><path d="M76 118c-4-4-10-4-13 1L1 245a7 7 0 0 0 6 10h88c3 0 5-1 6-4 19-39 8-98-25-133Z" fill="url(#atl-a)" /><path d="M122 4c-35 56-33 117-10 163l42 84c1 3 4 4 7 4h87a7 7 0 0 0 7-10L134 4c-2-5-9-5-12 0Z" fill="#2681FF" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 1024" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#fff" /></svg>
            </div>

            {/* Duplicated half */}
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 272 92"><path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" /><path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" /><path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" /><path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" /><path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><path fill="#F1511B" d="M121.666 121.666H0V0h121.666z" /><path fill="#80CC28" d="M256 121.666H134.335V0H256z" /><path fill="#00ADEF" d="M121.663 256.002H0V134.336h121.663z" /><path fill="#FBBC09" d="M256 256.002H134.335V134.336H256z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 603 182"><path d="M374.006 142.184c-35 25.797-85.729 39.561-129.406 39.561-61.242 0-116.376-22.651-158.087-60.325-3.278-2.962-.341-7 3.591-4.693 45.015 26.191 100.673 41.947 158.166 41.947 38.775 0 81.43-8.022 120.65-24.67 5.925-2.516 10.88 3.88 5.086 8.18" fill="#f90" /><path d="M388.557 125.536c-4.457-5.715-29.573-2.7-40.846-1.363-3.434.42-3.959-2.57-.865-4.719 20.003-14.078 52.827-10.015 56.654-5.296 3.828 4.745-.996 37.648-19.793 53.352-2.884 2.411-5.637 1.127-4.352-2.072 4.22-10.539 13.685-34.16 9.202-39.902" fill="#f90" /><path d="M348.497 20.066V6.381c0-2.071 1.573-3.46 3.461-3.46h61.269c1.966 0 3.54 1.415 3.54 3.46V18.1c-.027 1.966-1.679 4.535-4.615 8.599l-31.749 45.329c11.798-.289 24.25 1.468 34.947 7.498 2.412 1.363 3.068 3.356 3.251 5.322V99.45c0 1.992-2.202 4.325-4.509 3.12-18.85-9.884-43.887-10.96-64.73.104-2.123 1.154-4.351-1.153-4.351-3.146V85.661c0-2.229.026-6.03 2.254-9.412L384.047 23.5h-32.01c-1.967 0-3.54-1.39-3.54-3.434" fill="#fff" /><path d="M124.999 105.454h-18.64c-1.783-.13-3.199-1.468-3.33-3.172V6.617c0-1.914 1.6-3.435 3.592-3.435h17.382c1.809.079 3.25 1.468 3.382 3.199v12.505h.34c4.536-12.086 13.056-17.722 24.54-17.722 11.666 0 18.954 5.636 24.198 17.722 4.509-12.086 14.76-17.722 25.744-17.722 7.813 0 16.36 3.224 21.577 10.46 5.899 8.049 4.693 19.741 4.693 29.992l-.026 60.378c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.862-.13-3.356-1.625-3.356-3.46V51.29c0-4.037.367-14.104-.524-17.932-1.39-6.423-5.558-8.232-10.959-8.232-4.51 0-9.228 3.015-11.142 7.839s-1.73 12.898-1.73 18.325v50.704c0 1.913-1.6 3.46-3.592 3.46h-18.614c-1.888-.13-3.356-1.625-3.356-3.46l-.026-50.704c0-10.67 1.757-26.374-11.483-26.374-13.397 0-12.872 15.31-12.872 26.374v50.704c0 1.913-1.6 3.46-3.592 3.46" fill="#fff" /><path d="M469.514 1.164c27.66 0 42.629 23.752 42.629 53.954 0 29.18-16.543 52.329-42.629 52.329-27.16 0-41.947-23.753-41.947-53.352 0-29.782 14.97-52.931 41.947-52.931m.158 19.531c-13.738 0-14.603 18.719-14.603 30.386 0 11.692-.184 36.65 14.445 36.65 14.446 0 15.128-20.134 15.128-32.403 0-8.075-.341-17.723-2.78-25.378-2.097-6.66-6.265-9.255-12.19-9.255" fill="#fff" /><path d="M548.008 105.454h-18.562c-1.861-.13-3.356-1.625-3.356-3.46l-.026-95.692c.157-1.756 1.704-3.12 3.592-3.12h17.277c1.625.079 2.962 1.18 3.33 2.674v14.63h.34c5.217-13.083 12.532-19.322 25.404-19.322 8.363 0 16.517 3.015 21.76 11.273 4.877 7.655 4.877 20.528 4.877 29.782v60.22c-.21 1.678-1.757 3.015-3.592 3.015h-18.693c-1.704-.13-3.12-1.39-3.303-3.015V50.478c0-10.461 1.206-25.772-11.667-25.772-4.535 0-8.704 3.042-10.775 7.656-2.621 5.846-2.962 11.666-2.962 18.116v51.516c-.026 1.913-1.652 3.46-3.644 3.46" fill="#fff" /><path d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /><path transform="translate(244.367)" d="M55.288 59.758v-4.037c-13.475 0-27.71 2.884-27.71 18.771 0 8.049 4.168 13.502 11.325 13.502 5.243 0 9.936-3.225 12.898-8.468 3.67-6.45 3.487-12.506 3.487-19.768m18.798 45.434c-1.232 1.101-3.015 1.18-4.405.446-6.187-5.139-7.288-7.524-10.696-12.427-10.225 10.434-17.46 13.554-30.726 13.554-15.678 0-27.895-9.674-27.895-29.048 0-15.127 8.206-25.43 19.872-30.464 10.12-4.457 24.25-5.244 35.052-6.476v-2.412c0-4.43.341-9.674-2.254-13.501-2.281-3.435-6.633-4.85-10.46-4.85-7.106 0-13.45 3.644-14.997 11.194-.315 1.678-1.547 3.33-3.225 3.408l-18.09-1.94c-1.52-.34-3.198-1.573-2.778-3.906C7.652 6.853 27.446.246 45.169.246c9.07 0 20.92 2.412 28.078 9.28 9.07 8.469 8.206 19.768 8.206 32.064v29.048c0 8.73 3.618 12.558 7.026 17.277 1.206 1.678 1.468 3.697-.053 4.955-3.801 3.172-10.565 9.071-14.288 12.375z" fill="#fff" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 171"><defs><linearGradient id="meta-a" x1="13.878%" x2="89.144%" y1="55.934%" y2="58.694%"><stop offset="0%" stopColor="#0064E1" /><stop offset="40%" stopColor="#0064E1" /><stop offset="83%" stopColor="#0073EE" /><stop offset="100%" stopColor="#0082FB" /></linearGradient><linearGradient id="meta-b" x1="54.315%" x2="54.315%" y1="82.782%" y2="39.307%"><stop offset="0%" stopColor="#0082FB" /><stop offset="100%" stopColor="#0064E0" /></linearGradient></defs><path fill="#0081FB" d="M27.651 112.136c0 9.775 2.146 17.28 4.95 21.82 3.677 5.947 9.16 8.466 14.751 8.466 7.211 0 13.808-1.79 26.52-19.372 10.185-14.092 22.186-33.874 30.26-46.275l13.675-21.01c9.499-14.591 20.493-30.811 33.1-41.806C161.196 4.985 172.298 0 183.47 0c18.758 0 36.625 10.87 50.3 31.257C248.735 53.584 256 81.707 256 110.729c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363v-27.616c15.695 0 19.612-14.422 19.612-30.927 0-23.52-5.484-49.623-17.564-68.273-8.574-13.23-19.684-21.313-31.907-21.313-13.22 0-23.859 9.97-35.815 27.75-6.356 9.445-12.882 20.956-20.208 33.944l-8.066 14.289c-16.203 28.728-20.307 35.271-28.408 46.07-14.2 18.91-26.324 26.076-42.287 26.076-18.935 0-30.91-8.2-38.325-20.556C2.973 139.413 0 126.202 0 111.148l27.651.988Z" /><path fill="url(#meta-a)" d="M21.802 33.206C34.48 13.666 52.774 0 73.757 0 85.91 0 97.99 3.597 110.605 13.897c13.798 11.261 28.505 29.805 46.853 60.368l6.58 10.967c15.881 26.459 24.917 40.07 30.205 46.49 6.802 8.243 11.565 10.7 17.752 10.7 15.695 0 19.612-14.422 19.612-30.927l24.393-.766c0 17.253-3.4 29.93-9.187 39.946-5.591 9.686-16.488 19.363-34.818 19.363-11.395 0-21.49-2.475-32.654-13.007-8.582-8.083-18.615-22.443-26.334-35.352l-22.96-38.352C118.528 64.08 107.96 49.73 101.845 43.23c-6.578-6.988-15.036-15.428-28.532-15.428-10.923 0-20.2 7.666-27.963 19.39L21.802 33.206Z" /><path fill="url(#meta-b)" d="M73.312 27.802c-10.923 0-20.2 7.666-27.963 19.39-10.976 16.568-17.698 41.245-17.698 64.944 0 9.775 2.146 17.28 4.95 21.82L9.027 149.482C2.973 139.413 0 126.202 0 111.148 0 83.772 7.514 55.24 21.802 33.206 34.48 13.666 52.774 0 73.757 0l-.445 27.802Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 814 1000"><path fill="#fff" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 276.742"><path fill="#e50914" d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676L44.051 119.724v151.073C28.647 272.418 14.594 274.58 0 276.742V0h41.08l56.212 157.021V0h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461V0h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862V242.15c-14.594 0-29.188 0-43.239.539V43.242h-44.862V0H463.22l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433V0h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676V0h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242V0h-42.43v251.338zM1024 0l-54.863 131.615L1024 276.742c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75L871.576 0h46.482l28.377 72.699L976.705 0H1024z" /></svg>
            </div>
            <div className={`${styles.logoTickerItem} ${styles.logoTickerItemAnthropic}`}>
              <svg role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Anthropic</title><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 91 80"><defs><clipPath id="adobe-clip"><rect width="90.4318" height="80" fill="white" /></clipPath></defs><g clipPath="url(#adobe-clip)"><path d="M56.9686 0H90.4318V80L56.9686 0Z" fill="#EB1000" /><path d="M33.4632 0H0V80L33.4632 0Z" fill="#EB1000" /><path d="M45.1821 29.4668L66.5199 80.0002H52.5657L46.1982 63.9461H30.6182L45.1821 29.4668Z" fill="#EB1000" /></g></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 926.905 321.777"><path fill="white" d="M53.328 229.809c3.917 10.395 9.34 19.283 16.27 26.664 6.93 7.382 15.14 13.031 24.63 16.948 9.491 3.917 19.81 5.875 30.958 5.875 10.847 0 21.015-2.034 30.506-6.102s17.776-9.792 24.856-17.173c7.08-7.382 12.579-16.194 16.496-26.438s5.875-21.692 5.875-34.347V0h47.453v316.354h-47.001v-29.376c-10.545 11.147-22.974 19.734-37.285 25.761-14.312 6.025-29.752 9.038-46.323 9.038-16.873 0-32.615-2.938-47.228-8.813-14.612-5.875-27.267-14.235-37.962-25.082S15.441 264.006 9.265 248.79C3.088 233.575 0 216.628 0 197.947V0h47.453v195.236c0 12.655 1.958 24.178 5.875 34.573zM332.168 0v115.243c10.545-10.545 22.748-18.905 36.607-25.082s28.924-9.265 45.193-9.265c16.873 0 32.689 3.163 47.453 9.49 14.763 6.327 27.567 14.914 38.414 25.761s19.434 23.651 25.761 38.414c6.327 14.764 9.49 30.431 9.49 47.002 0 16.57-3.163 32.162-9.49 46.774-6.327 14.613-14.914 27.343-25.761 38.188-10.847 10.847-23.651 19.434-38.414 25.761-14.764 6.327-30.581 9.49-47.453 9.49-16.27 0-31.409-3.088-45.419-9.265-14.01-6.176-26.288-14.537-36.833-25.082v28.924h-45.193V0zm5.197 232.746c4.067 9.642 9.717 18.078 16.948 25.309s15.667 12.956 25.308 17.174c9.642 4.218 20.036 6.327 31.184 6.327 10.847 0 21.09-2.109 30.731-6.327s18.001-9.942 25.083-17.174c7.08-7.23 12.729-15.667 16.947-25.309 4.218-9.641 6.327-20.035 6.327-31.183s-2.109-21.618-6.327-31.41-9.867-18.303-16.947-25.534c-7.081-7.23-15.441-12.88-25.083-16.947s-19.885-6.102-30.731-6.102-21.09 2.034-30.731 6.102-18.077 9.717-25.309 16.947c-7.23 7.231-12.955 15.742-17.173 25.534s-6.327 20.262-6.327 31.41c-.001 11.148 2.033 21.542 6.1 31.183zm223.477-77.732c6.025-14.462 14.312-27.191 24.856-38.188s23.049-19.659 37.511-25.986 30.129-9.49 47.001-9.49c16.571 0 31.937 3.013 46.098 9.038 14.16 6.026 26.362 14.387 36.606 25.083 10.244 10.695 18.229 23.35 23.952 37.962 5.725 14.613 8.587 30.506 8.587 47.68v14.914H597.901c1.507 9.34 4.52 18.002 9.039 25.985 4.52 7.984 10.168 14.914 16.947 20.789 6.779 5.876 14.462 10.471 23.049 13.784 8.587 3.314 17.7 4.972 27.342 4.972 27.418 0 49.563-11.299 66.435-33.896l32.991 24.404c-11.449 15.366-25.609 27.418-42.481 36.155-16.873 8.737-35.854 13.106-56.944 13.106-17.174 0-33.217-3.014-48.131-9.039s-27.869-14.462-38.866-25.309-19.659-23.576-25.986-38.188-9.491-30.506-9.491-47.679c-.002-16.269 3.012-31.635 9.037-46.097zm63.497-17.852c-12.805 10.696-21.316 24.932-25.534 42.708h140.552c-3.917-17.776-12.278-32.012-25.083-42.708-12.805-10.695-27.794-16.043-44.967-16.043-17.174 0-32.163 5.348-44.968 16.043zm246.527 5.197c-9.641 10.545-14.462 24.856-14.462 42.934v131.062h-45.646V85.868h45.193v28.472c5.725-9.34 13.182-16.722 22.371-22.145 9.189-5.424 20.111-8.136 32.766-8.136h15.817v42.482h-18.981c-15.064.001-27.417 5.273-37.058 15.818z" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="35.188 31.512 351.46 258.785"><path fill="#fff" d="M384.195 282.109c0 3.771-2.769 6.302-6.047 6.302v-.023c-3.371.023-6.089-2.508-6.089-6.278 0-3.769 2.718-6.293 6.089-6.293 3.279-.001 6.047 2.523 6.047 6.292zm2.453 0c0-5.175-4.02-8.179-8.5-8.179-4.511 0-8.531 3.004-8.531 8.179 0 5.172 4.021 8.188 8.531 8.188 4.481 0 8.5-3.016 8.5-8.188m-9.91.692h.91l2.109 3.703h2.316l-2.336-3.859c1.207-.086 2.2-.661 2.2-2.286 0-2.019-1.392-2.668-3.75-2.668h-3.411v8.813h1.961v-3.703m.001-1.492v-2.122h1.364c.742 0 1.753.06 1.753.965 0 .985-.523 1.157-1.398 1.157h-1.719M329.406 237.027l10.598 28.993H318.48l10.926-28.993zm-11.35-11.289-24.423 61.88h17.246l3.863-10.934h28.903l3.656 10.934h18.722l-24.605-61.888-23.362.008zm-49.033 61.903h17.497v-61.922l-17.5-.004.003 61.926zm-121.467-61.926-14.598 49.078-13.984-49.074-18.879-.004 19.972 61.926h25.207l20.133-61.926h-17.851zm70.725 13.484h7.52c10.91 0 17.966 4.898 17.966 17.609 0 12.714-7.056 17.613-17.966 17.613h-7.52v-35.222zm-17.35-13.484v61.926h28.366c15.113 0 20.048-2.512 25.384-8.148 3.769-3.957 6.207-12.641 6.207-22.134 0-8.707-2.063-16.468-5.66-21.304-6.481-8.649-15.817-10.34-29.75-10.34h-24.547zm-165.743-.086v62.012h17.645v-47.086l13.672.004c4.527 0 7.754 1.128 9.934 3.457 2.765 2.945 3.894 7.699 3.894 16.395v27.23h17.098v-34.262c0-24.453-15.586-27.75-30.836-27.75H35.188zm137.583.086.007 61.926h17.489v-61.926h-17.496z" /><path fill="#77B900" d="M82.211 102.414s22.504-33.203 67.437-36.638V53.73c-49.769 3.997-92.867 46.149-92.867 46.149s24.41 70.565 92.867 77.026v-12.804c-50.237-6.32-67.437-61.687-67.437-61.687zm67.437 36.223v11.726c-37.968-6.769-48.507-46.237-48.507-46.237s18.23-20.195 48.507-23.47v12.867c-.023 0-.039-.007-.058-.007-15.891-1.907-28.305 12.938-28.305 12.938s6.958 24.991 28.363 32.183m0-107.125V53.73c1.461-.112 2.922-.207 4.391-.257 56.582-1.907 93.449 46.406 93.449 46.406s-42.343 51.488-86.457 51.488c-4.043 0-7.828-.375-11.383-1.005v13.739c3.04.386 6.192.613 9.481.613 41.051 0 70.738-20.965 99.484-45.778 4.766 3.817 24.278 13.103 28.289 17.168-27.332 22.883-91.031 41.329-127.144 41.329-3.481 0-6.824-.211-10.11-.528v19.306H305.68V31.512H149.648zm0 49.144V65.777c1.446-.101 2.903-.179 4.391-.226 40.688-1.278 67.382 34.965 67.382 34.965s-28.832 40.043-59.746 40.043c-4.449 0-8.438-.715-12.028-1.922V93.523c15.84 1.914 19.028 8.911 28.551 24.786l21.18-17.859s-15.461-20.277-41.524-20.277c-2.833-.001-5.544.198-8.206.483" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1180 320"><g fill="#fff" clipPath="url(#openai-a)"><path d="M367.44 153.84c0 52.32 33.6 88.8 80.16 88.8 46.56 0 80.16-36.48 80.16-88.8s-33.6-88.8-80.16-88.8c-46.56 0-80.16 36.48-80.16 88.8Zm129.6 0c0 37.44-20.4 61.68-49.44 61.68s-49.44-24.24-49.44-61.68 20.4-61.68 49.44-61.68 49.44 24.24 49.44 61.68ZM614.27 242.64c35.28 0 55.44-29.76 55.44-65.52 0-35.76-20.16-65.52-55.44-65.52-16.32 0-28.32 6.48-36.24 15.84V114h-28.8v169.2h28.8v-56.4c7.92 9.36 19.92 15.84 36.24 15.84Zm-36.96-69.12c0-23.76 13.44-36.72 31.2-36.72 20.88 0 32.16 16.32 32.16 40.32s-11.28 40.32-32.16 40.32c-17.76 0-31.2-13.2-31.2-36.48v-7.44ZM747.65 242.64c25.2 0 45.12-13.2 54-35.28L776.93 198c-3.84 12.96-15.12 20.16-29.28 20.16-18.48 0-31.44-13.2-33.6-34.8h88.32v-9.6c0-34.56-19.44-62.16-55.92-62.16-36.48 0-60 28.56-60 65.52 0 38.88 25.2 65.52 61.2 65.52Zm-1.44-106.8c18.24 0 26.88 12 27.12 25.92h-57.84c4.32-17.04 15.84-25.92 30.72-25.92ZM823.98 240h28.8v-73.92c0-18 13.2-27.6 26.16-27.6 15.84 0 22.08 11.28 22.08 26.88V240h28.8v-83.04c0-27.12-15.84-45.36-42.24-45.36-16.32 0-27.6 7.44-34.8 15.84V114h-28.8v126ZM1014.17 67.68 948.89 240h30.48l14.64-39.36h74.4l14.88 39.36h30.96l-65.28-172.32h-34.8Zm16.8 34.08 27.36 72h-54.24l26.88-72ZM1163.69 68.18h-30.72V240.5h30.72V68.18ZM297.06 130.97a79.712 79.712 0 0 0-6.85-65.48c-17.46-30.4-52.56-46.04-86.84-38.68A79.747 79.747 0 0 0 143.24 0C108.2-.08 77.11 22.48 66.33 55.82a79.754 79.754 0 0 0-53.31 38.67c-17.59 30.32-13.58 68.54 9.92 94.54a79.712 79.712 0 0 0 6.85 65.48c17.46 30.4 52.56 46.04 86.84 38.68a79.687 79.687 0 0 0 60.13 26.8c35.06.09 66.16-22.49 76.94-55.86a79.754 79.754 0 0 0 53.31-38.67c17.57-30.32 13.55-68.51-9.94-94.51l-.01.02ZM176.78 299.08a59.77 59.77 0 0 1-38.39-13.88c.49-.26 1.34-.73 1.89-1.07l63.72-36.8a10.36 10.36 0 0 0 5.24-9.07v-89.83l26.93 15.55c.29.14.48.42.52.74v74.39c-.04 33.08-26.83 59.9-59.91 59.97ZM47.94 244.05a59.71 59.71 0 0 1-7.15-40.18c.47.28 1.3.79 1.89 1.13l63.72 36.8c3.23 1.89 7.23 1.89 10.47 0l77.79-44.92v31.1c.02.32-.13.63-.38.83L129.87 266c-28.69 16.52-65.33 6.7-81.92-21.95h-.01ZM31.17 104.96c7-12.16 18.05-21.46 31.21-26.29 0 .55-.03 1.52-.03 2.2v73.61c-.02 3.74 1.98 7.21 5.23 9.06l77.79 44.91L118.44 224c-.27.18-.61.21-.91.08l-64.42-37.22c-28.63-16.58-38.45-53.21-21.95-81.89l.01-.01Zm221.26 51.49-77.79-44.92 26.93-15.54c.27-.18.61-.21.91-.08l64.42 37.19c28.68 16.57 38.51 53.26 21.94 81.94a59.94 59.94 0 0 1-31.2 26.28v-75.81c.03-3.74-1.96-7.2-5.2-9.06h-.01Zm26.8-40.34c-.47-.29-1.3-.79-1.89-1.13l-63.72-36.8a10.375 10.375 0 0 0-10.47 0l-77.79 44.92V92c-.02-.32.13-.63.38-.83l64.41-37.16c28.69-16.55 65.37-6.7 81.91 22a59.95 59.95 0 0 1 7.15 40.1h.02Zm-168.51 55.43-26.94-15.55a.943.943 0 0 1-.52-.74V80.86c.02-33.12 26.89-59.96 60.01-59.94 14.01 0 27.57 4.92 38.34 13.88-.49.26-1.33.73-1.89 1.07L116 72.67a10.344 10.344 0 0 0-5.24 9.06l-.04 89.79v.02ZM125.35 140 160 119.99l34.65 20V180L160 200l-34.65-20v-40Z" /></g><defs><clipPath id="openai-a"><path fill="#fff" d="M0 0h1180v320H0z" /></clipPath></defs></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 512 214"><path fill="#635BFF" d="M512 110.08c0-36.409-17.636-65.138-51.342-65.138c-33.85 0-54.33 28.73-54.33 64.854c0 42.808 24.179 64.426 58.88 64.426c16.925 0 29.725-3.84 39.396-9.244v-28.445c-9.67 4.836-20.764 7.823-34.844 7.823c-13.796 0-26.027-4.836-27.591-21.618h69.547c0-1.85.284-9.245.284-12.658m-70.258-13.511c0-16.071 9.814-22.756 18.774-22.756c8.675 0 17.92 6.685 17.92 22.756zm-90.31-51.627c-13.939 0-22.899 6.542-27.876 11.094l-1.85-8.818h-31.288v165.83l35.555-7.537l.143-40.249c5.12 3.698 12.657 8.96 25.173 8.96c25.458 0 48.64-20.48 48.64-65.564c-.142-41.245-23.609-63.716-48.498-63.716m-8.534 97.991c-8.391 0-13.37-2.986-16.782-6.684l-.143-52.765c3.698-4.124 8.818-6.968 16.925-6.968c12.942 0 21.902 14.506 21.902 33.137c0 19.058-8.818 33.28-21.902 33.28M241.493 36.551l35.698-7.68V0l-35.698 7.538zm0 10.809h35.698v124.444h-35.698zm-38.257 10.524L200.96 47.36h-30.72v124.444h35.556V87.467c8.39-10.951 22.613-8.96 27.022-7.396V47.36c-4.551-1.707-21.191-4.836-29.582 10.524m-71.112-41.386l-34.702 7.395l-.142 113.92c0 21.05 15.787 36.551 36.836 36.551c11.662 0 20.195-2.133 24.888-4.693V140.8c-4.55 1.849-27.022 8.391-27.022-12.658V77.653h27.022V47.36h-27.022zM35.982 83.484c0-5.546 4.551-7.68 12.09-7.68c10.808 0 24.461 3.272 35.27 9.103V51.484c-11.804-4.693-23.466-6.542-35.27-6.542C19.2 44.942 0 60.018 0 85.192c0 39.252 54.044 32.995 54.044 49.92c0 6.541-5.688 8.675-13.653 8.675c-11.804 0-26.88-4.836-38.827-11.378v33.849c13.227 5.689 26.596 8.106 38.827 8.106c29.582 0 49.92-14.648 49.92-40.106c-.142-42.382-54.329-34.845-54.329-50.774" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 256 256"><defs><linearGradient x1="99.7%" y1="15.8%" x2="39.8%" y2="97.4%" id="atl-a"><stop stopColor="#0052CC" offset="0%" /><stop stopColor="#2684FF" offset="92.3%" /></linearGradient></defs><path d="M76 118c-4-4-10-4-13 1L1 245a7 7 0 0 0 6 10h88c3 0 5-1 6-4 19-39 8-98-25-133Z" fill="url(#atl-a)" /><path d="M122 4c-35 56-33 117-10 163l42 84c1 3 4 4 7 4h87a7 7 0 0 0 7-10L134 4c-2-5-9-5-12 0Z" fill="#2681FF" /></svg>
            </div>
            <div className={styles.logoTickerItem}>
              <svg viewBox="0 0 1024 1024" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#fff" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- Social Proof / CTA Section --- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaGridBg} />
        <div className={styles.sectionInner}>
          <motion.div
            className={styles.ctaBox}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.ctaInner}>
              {/* Left: Text Content */}
              <div className={styles.ctaContent}>
                <motion.span
                  className={styles.sectionLabel}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  Get Started
                </motion.span>
                <motion.h2
                  className={styles.ctaTitle}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  Ready to land your<br />
                  <span className={styles.ctaTitleFaded}>Dream engineering job?</span>
                </motion.h2>
                <motion.p
                  className={styles.ctaSubtitle}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  Join thousands of developers using HireMate AI to build resumes, prepare for mock interviews, and master technical assessments.
                </motion.p>
                <motion.div
                  className={styles.ctaButtonWrap}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  <Link href="/auth?mode=signup" className={styles.ctaButton}>
                    <span className={styles.ctaButtonShimmer} />
                    <span className={styles.ctaButtonText}>Get Started For Free</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  <span className={styles.ctaTrust}>Free — No credit card required</span>
                </motion.div>
              </div>
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
              {/* Close Button */}
              <button
                onClick={() => setShowWelcome(false)}
                className={styles.closeBtn}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Left Side: Dynamic Animated Neon Lottie Box */}
              <div className={styles.welcomeLeft}>
                {/* 5 dots row */}
                <div className={styles.dotRow}>
                  <div className={styles.dot} style={{ background: "#fbbf24" }} />
                  <div className={styles.dot} style={{ background: "#22d3ee" }} />
                  <div className={styles.dot} style={{ background: "#f87171" }} />
                  <div className={styles.dot} style={{ background: "#4ade80" }} />
                  <div className={styles.dot} style={{ background: "#e5e7eb" }} />
                </div>
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
                  <button className={styles.welcomeButton} onClick={() => setShowWelcome(false)} style={{ transform: 'none' }}>
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
