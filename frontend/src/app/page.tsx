"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import ThemeToggle from "./components/ThemeToggle";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";

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

function Interactive3DConsole() {
  const [activeTab, setActiveTab] = useState<"resume" | "interview" | "roadmap" >("interview");
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

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
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
    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle 100px at ${mx}px ${my}px, var(--border-glow-color), transparent 100%)`;
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

  // Typewriter effect state for candidate answer
  const [typedAnswer, setTypedAnswer] = useState("");
  const candidateAnswerText = "I am a Full Stack Developer with experience in React, Node.js, and TypeScript. I specialize in building responsive, high-performance web applications...";

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

  // Waveform height animations for interview microphone wave
  const [waveHeights, setWaveHeights] = useState([15, 25, 35, 20, 10, 30, 25, 12, 18, 28, 15, 8]);
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 30) + 6));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Score count animation
  useEffect(() => {
    const target = activeTab === "resume" ? 92 : activeTab === "interview" ? 87 : 65;
    const current = score;
    if (current === target) return;
    const step = current < target ? 1 : -1;
    const timeout = setTimeout(() => {
      setScore(current + step);
    }, 15);
    return () => clearTimeout(timeout);
  }, [activeTab, score]);

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
        {/* Floating Outcome Cards */}
        {/* Card 1: Resume Score 92% */}
        <div
          className={`${styles.floatingOutcomeCard} ${styles.cardFloat1}`}
          style={{
            top: "-35px",
            left: "-85px",
          }}
        >
          <div className={styles.floatingCardIcon} style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.floatingCardDetails}>
            <span className={styles.floatingCardVal}>92%</span>
            <span className={styles.floatingCardLbl}>Resume Match</span>
          </div>
        </div>

        {/* Card 2: Mock Practiced 24 */}
        <div
          className={`${styles.floatingOutcomeCard} ${styles.cardFloat2}`}
          style={{
            bottom: "60px",
            left: "-75px",
          }}
        >
          <div className={styles.floatingCardIcon} style={{ background: "rgba(168, 85, 247, 0.12)", color: "#a855f7" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="12" x2="12" y1="19" y2="22" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.floatingCardDetails}>
            <span className={styles.floatingCardVal}>24</span>
            <span className={styles.floatingCardLbl}>Mock Practiced</span>
          </div>
        </div>

        {/* Card 3: Career Goal Amazon SDE-1 */}
        <div
          className={`${styles.floatingOutcomeCard} ${styles.cardFloat3}`}
          style={{
            top: "-25px",
            right: "-75px",
          }}
        >
          <div className={styles.floatingCardIcon} style={{ background: "rgba(249, 115, 22, 0.12)", color: "#f97316" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.floatingCardDetails}>
            <span className={styles.floatingCardVal} style={{ fontSize: "0.82rem" }}>Amazon SDE-1</span>
            <span className={styles.floatingCardLbl}>Career Goal</span>
          </div>
        </div>

        {/* Card 4: Interview Score 87% */}
        <div
          className={`${styles.floatingOutcomeCard} ${styles.cardFloat4}`}
          style={{
            bottom: "50px",
            right: "-80px",
          }}
        >
          <div className={styles.floatingCardIcon} style={{ background: "rgba(6, 182, 212, 0.12)", color: "#06b6d4" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.floatingCardDetails}>
            <span className={styles.floatingCardVal}>87%</span>
            <span className={styles.floatingCardLbl}>Interview Score</span>
          </div>
        </div>

        {/* Console Card */}
        <div className={styles.consoleCard}>
          {/* Spotlight & Neon Border Glow */}
          <div ref={glowRef} className={styles.consoleCardBorderGlow} />
          <div ref={spotlightRef} className={styles.consoleCardSpotlight} />

          {/* Interactive Dial Indicator (Z = 75px) */}
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
                {activeTab === "resume" && "ATS"}
                {activeTab === "interview" && "Score"}
                {activeTab === "roadmap" && "Ready"}
              </span>
            </div>
          </div>

          {/* Tabs and Title Header (Z = 15px) */}
          <div className={styles.headerLayer}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              {[
                { id: "resume", label: "Resume Analysis" },
                { id: "interview", label: "Interview Coach" },
                { id: "roadmap", label: "Career Roadmap" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={styles.tabBtn}
                  style={{
                    background: activeTab === tab.id ? "var(--btn-solid-bg)" : "rgba(255, 255, 255, 0.03)",
                    color: activeTab === tab.id ? "var(--btn-solid-fg)" : "var(--text-secondary)",
                    borderColor: activeTab === tab.id ? "var(--btn-solid-bg)" : "var(--border-default)"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
              {activeTab === "resume" && "ATS Real-Time Score"}
              {activeTab === "interview" && "Voice Assistant Coach"}
              {activeTab === "roadmap" && "Career Progression Path"}
            </h4>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px", marginBottom: 0 }}>
              {activeTab === "resume" && "Evaluating keyword relevance, formatting, and impact phrases."}
              {activeTab === "interview" && "Analyzing speaking pace, confidence, and filler word usage."}
              {activeTab === "roadmap" && "Tracking completed milestones and upcoming skills."}
            </p>
          </div>

          {/* Middle Content Panel (Z = 35px) */}
          <div className={styles.mainPanelLayer}>
            {activeTab === "resume" && (
              <div className={styles.skillsList} style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", fontWeight: "700", color: "#10b981" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Resume Uploaded Successfully</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" }}>Detected Skills</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {["React", "Node.js", "MongoDB", "TypeScript", "AWS"].map((sk) => (
                      <span key={sk} className={`${styles.skillTag} ${styles.skillFound}`}>{sk}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.04em" }}>Suggested Gaps</span>
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
                <div className={styles.questionText}>
                  Q: Tell me about yourself.
                </div>
                <div className={styles.answerText}>
                  {typedAnswer}
                  <span style={{ animation: "pulse 1s infinite", fontWeight: "bold", color: "#a855f7" }}>|</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--badge-dot)" }}>
                    🎤 Recording Active
                  </span>
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={styles.roadmapRole}>Amazon SDE-1</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#f97316" }}>65% Complete</span>
                </div>
                <div className={styles.roadmapNodes}>
                  <div className={`${styles.roadmapNode} ${styles.roadmapNodeCompleted}`}>
                    ✓ JavaScript, React, Git (Completed)
                  </div>
                  <div className={`${styles.roadmapNode} ${styles.roadmapNodeCurrent}`}>
                    → Node.js, MongoDB (Active Focus)
                  </div>
                  <div className={`${styles.roadmapNode} ${styles.roadmapNodeUpcoming}`}>
                    Upcoming: AWS, System Design, DSA
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Bar / Telemetry */}
          <div className={styles.statusCard}>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", display: "block", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Platform Telemetry
              </span>
              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-primary)" }}>
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

    // Direct DOM updates — no React re-renders
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
        {/* Border glow — follows cursor along edges */}
        <div ref={glowRef} className={styles.featureCardBorderGlow} />

        {/* Glass spotlight — illuminates surface under cursor */}
        <div ref={spotlightRef} className={styles.featureCardSpotlight} />

        {/* 3D parallax content */}
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
  const lastScrollY = useRef(0);
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          // Fallback: keep logged in state if fetch fails
        });
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
    },
    {
      number: "02",
      title: "Upload Your Resume",
      description: "Get instant AI analysis with ATS scoring and improvement tips.",
    },
    {
      number: "03",
      title: "Practice Interviews",
      description: "Take mock interviews tailored to your target role and company.",
    },
    {
      number: "04",
      title: "Land Your Dream Job",
      description: "Track progress, refine skills, and walk into interviews with confidence.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Mock Interviews" },
    { value: "95%", label: "User Satisfaction" },
    { value: "2.5K+", label: "Users Active" },
    { value: "50+", label: "Companies Covered" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.heroOrb1} />
      <div className={styles.heroOrb2} />
      <div className={styles.heroOrb3} />
      <div className={styles.heroNoise} />
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
            <Link href="/resume" className={styles.navLink}>Resume Builder</Link>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#stats" className={styles.navLink}>Results</a>
          </div>

          <div className={styles.navActions}>
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link href="/profile" className={styles.navBtnGhost} style={{ paddingLeft: "6px", paddingRight: "16px" }}>
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
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin" className={styles.navBtnGhost}>Sign In</Link>
                <Link href="/auth?mode=signup" className={styles.navBtnSolid}>Get Started</Link>
              </>
            )}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span className={styles.mobileLink} style={{ margin: 0 }}>Theme</span>
              <ThemeToggle />
            </div>
            <div className={styles.mobileDivider} />
            <Link href="/resume" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Resume Builder</Link>
            <a href="#features" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>How It Works</a>
            <a href="#stats" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Results</a>
            <div className={styles.mobileDivider} />
            {isLoggedIn ? (
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
                  <span>Profile</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Sign In</Link>
                <Link href="/auth?mode=signup" className={styles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={() => setMobileMenu(false)}>Get Started</Link>
              </>
            )}
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
            <motion.div className={styles.heroBadge} variants={fadeInUp}>
              <span className={styles.heroBadgeDot} />
              AI-Powered Interview Platform
            </motion.div>

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
            <h2 className={styles.sectionTitle}>Everything you need to land your dream job</h2>
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
            <h2 className={styles.sectionTitle}>Four steps to interview confidence</h2>
          </motion.div>

          <motion.div
            className={styles.stepsGrid}
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className={styles.stepCard}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.015 }}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                {i < steps.length - 1 && <div className={styles.stepConnector} />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.statsGlow} />
        <div className={styles.sectionInner}>
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
                className={styles.statCard}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CTA Section --- */}
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
            <h2 className={styles.ctaTitle}>Ready to land your dream job?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers who are preparing smarter with HireMate AI.
              Start for free — no credit card required.
            </p>
            <Link href="/auth?mode=signup" className={styles.ctaButton}>
              <span>Get Started for Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#ftLogoGrad)" />
                  <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="ftLogoGrad" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="var(--logo-grad-start)" />
                      <stop offset="1" stopColor="var(--logo-grad-end)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>HireMate AI</span>
              </Link>
              <p className={styles.footerTagline}>
                Intelligent interview preparation & career development platform.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Product</h4>
                <a href="#features">Mock Interviews</a>
                <a href="#features">Resume Analysis</a>
                <a href="#features">Coding Practice</a>
                <a href="#features">Career Roadmaps</a>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 HireMate AI. All rights reserved.</p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
