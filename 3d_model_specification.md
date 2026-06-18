# HireMate AI - 3D Product Demonstration Console Specification

This document provides a complete technical specification, visual architecture guide, and implementation overview of the interactive 3D Parallax Console rendered in the Hero section of HireMate AI. 

This guide is designed for developers or AI coding models to understand, modify, and enhance the console.

---

## 1. Visual Concept & Design Philosophy

The console acts as a **3D holographic dashboard** representing the core products of HireMate AI (Resume Analysis, Interview Coach, and Career Roadmap). Rather than rendering a flat mockup, it separates its functional units into a layered stack along the Z-axis (depth).

*   **Tilt Parallax Effect**: The console tracks the mouse coordinate position relative to its container. When the cursor hovers and moves, the entire container rotates along the X and Y axes using smooth spring-damped springs. The individual layered children shift speeds based on their distance (Z-depth) from the base plane, creating a physical sense of depth.
*   **Edge Highlight Neon Glow**: A thin border highlight mask tracks the entry and hover position of the cursor along the console edges, while a radial spotlight illuminates the background glass.
*   **Unified Theme Swapping**: Toggling the console tabs transitions the accent colors (borders, glowing dials, and fill highlights) dynamically between three themes:
    *   **Resume Analysis**: Cyan theme (`rgba(6, 182, 212, 1)`)
    *   **Interview Coach**: Purple theme (`rgba(168, 85, 247, 1)`)
    *   **Career Roadmap**: Orange theme (`rgba(249, 115, 22, 1)`)

---

## 2. Structural Layer Depth Mapping (Z-Axis Stack)

The console layers are separated visually along the Z-axis (further forward elements shift faster and appear closer):

```
[ LAYER 4: DETACHED BADGE ] ---> Match Score Circular HUD Dial (translateZ: 75px)
                                 Positioned at: top: -24px, right: -24px
       |
[ LAYER 3: FLOATING CARDS  ] ---> Outcomes / Statistics Cards (translateZ: 45px to 75px)
                                 Positioned outside the card margins to prevent overlap:
                                 - Card 1 (Resume Score): top: 40px, left: -140px (Z: 65px)
                                 - Card 2 (Mock Practiced): bottom: 120px, left: -140px (Z: 45px)
                                 - Card 3 (Career Goal): top: 140px, right: -140px (Z: 55px)
                                 - Card 4 (Interview Score): bottom: 120px, right: -140px (Z: 75px)
       |
[ LAYER 2: INTERACTIVE VIEW] ---> Main Content Visual Panels (translateZ: 35px)
                                 Swaps views dynamically based on the active tab:
                                 - Resume tags checklist
                                 - Live microphone waveform and typewriter answer block
                                 - Career roadmap progress tree milestones
       |
[ LAYER 1: HEADERS & STATS ] ---> Tabs Nav deck (translateZ: 15px) & Telemetry Card (translateZ: 20px)
       |
[ LAYER 0: BASE CANVAS     ] ---> Main glassmorphic background container (translateZ: 0px)
```

---

## 3. Interactive Mechanics & State Control

### A. Parallax Mouse Tilt & Shadows (Framer Motion)
The console calculates the mouse offset coordinates from the container center. Framer Motion transforms these offsets into rotation springs and dynamic CSS custom properties for shadow casting:
*   `rotateX`: Mapping Y-axis offset `[-200, 200]` to rotation `[15deg, -15deg]`.
*   `rotateY`: Mapping X-axis offset `[-200, 200]` to rotation `[-15deg, 15deg]`.
*   `--shadow-dx` and `--shadow-dy`: Spring-damped offsets mapped from X and Y offsets `[-200, 200]` to `[25px, -25px]`. This casts shadows away from the cursor, simulating a fixed overhead light source.

### B. Circular SVG Match HUD Dial
The HUD dial uses a SVG circle stroke layout to animate the progress ring indicator dynamically to match the score (`92%`, `87%`, or `65%`):
*   Radius `r = 38` -> Circumference = `238.76px` (`strokeDasharray`).
*   `strokeDashoffset` is calculated as: `238.76 - (238.76 * score) / 100`.
*   The ring updates with a smooth CSS transition when the tab changes.

### C. Interview Typewriter & Waveform Animations
*   **Typewriter Simulation**: When the `Interview Coach` tab is active, a typewriter effect types out the candidate's answer string character-by-character at a `25ms` interval, accompanied by a blinking typing insertion cursor (`|`).
*   **Microphone Waveform**: Simulates voice telemetry with random heights mapping to a 12-bar flexbox array at a `120ms` interval when the recording is active.

---

## 4. Source Code Architecture

### A. React Component Structure (`page.tsx`)

```tsx
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import styles from "./home.module.css";

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

export default function Interactive3DConsole() {
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
            top: "40px",
            left: "-140px",
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
            bottom: "120px",
            left: "-140px",
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
            top: "140px",
            right: "-140px",
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
            bottom: "120px",
            right: "-140px",
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
                {activeTab === "resume" && "ATS SCORE"}
                {activeTab === "interview" && "CONFIDENCE"}
                {activeTab === "roadmap" && "CAREER READY"}
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
```

### B. Core Styles (`home.module.css`)

```css
.heroRight {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.consoleContainer {
  position: relative;
  width: 100%;
  max-width: 440px;
  height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.consoleCard {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--shadow-dx, 0px) var(--shadow-dy, 15px) 40px rgba(0, 0, 0, 0.35);
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  transform-style: preserve-3d;
  transition: border-color var(--transition-base), background-color var(--transition-base);
}

.consoleCard:hover {
  border-color: var(--glass-border-hover);
  background: var(--glass-bg-hover);
}

/* Border glow — cursor-following edge illumination */
.consoleCardBorderGlow {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.35s ease;
  border: 1px solid transparent;
  background-clip: border-box;
  -webkit-mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: 
    linear-gradient(#fff 0 0) padding-box, 
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

/* Spotlight inner surface glow */
.consoleCardSpotlight {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.35s ease;
}

/* Floating 3D Outcome Cards */
.floatingOutcomeCard {
  position: absolute;
  padding: 10px 14px;
  background: rgba(20, 20, 25, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 15;
  pointer-events: auto;
  user-select: none;
  min-width: 150px;
}

[data-theme="light"] .floatingOutcomeCard {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.floatingCardIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
}

.floatingCardDetails {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.floatingCardVal {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.2;
}

.floatingCardLbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Float Drift Animations for Cards */
.cardFloat1 {
  animation: float-card-1 6s ease-in-out infinite alternate;
}

.cardFloat2 {
  animation: float-card-2 7s ease-in-out infinite alternate;
}

.cardFloat3 {
  animation: float-card-3 5s ease-in-out infinite alternate;
}

.cardFloat4 {
  animation: float-card-4 8s ease-in-out infinite alternate;
}

@keyframes float-card-1 {
  0% { transform: translate3d(0, 0, 65px) rotate(0deg); }
  100% { transform: translate3d(-4px, -8px, 67px) rotate(1deg); }
}

@keyframes float-card-2 {
  0% { transform: translate3d(0, 0, 45px) rotate(0deg); }
  100% { transform: translate3d(5px, 6px, 47px) rotate(-1deg); }
}

@keyframes float-card-3 {
  0% { transform: translate3d(0, 0, 55px) rotate(0deg); }
  100% { transform: translate3d(-6px, 5px, 57px) rotate(-1.5deg); }
}

@keyframes float-card-4 {
  0% { transform: translate3d(0, 0, 75px) rotate(0deg); }
  100% { transform: translate3d(4px, -6px, 77px) rotate(1.5deg); }
}

/* Responsive safety hiding cards on smaller displays */
@media (max-width: 768px) {
  .floatingOutcomeCard {
    display: none;
  }
}

/* Layer 1: Header / Navigation (Z = 15px) */
.headerLayer {
  transform: translateZ(15px);
  transform-style: preserve-3d;
  z-index: 5;
  text-align: left;
}

.tabBtn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--border-default);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.tabBtn:hover {
  border-color: var(--badge-dot);
}

/* Layer 2: Main Content Panel (Z = 35px) */
.mainPanelLayer {
  background: rgba(13, 13, 17, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.25rem;
  transform: translateZ(35px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 220px;
  justify-content: center;
}

[data-theme="light"] .mainPanelLayer {
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Resume tab elements */
.skillsList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.skillTag {
  font-size: 0.72rem;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
}

.skillFound {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #10b981;
}

.skillMissing {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #f59e0b;
}

/* Interview Coach elements */
.interviewQABox {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.questionText {
  font-size: 0.78rem;
  font-weight: 700;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.08);
  border-left: 3px solid #a855f7;
  padding: 6px 12px;
  border-radius: 0 8px 8px 0;
}

.answerText {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 8px 12px;
  min-height: 52px;
  font-style: italic;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 4px;
}

.waveBar {
  flex-grow: 1;
  width: 3px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  transition: height 0.1s ease;
}

.waveBarActive {
  background: var(--badge-dot);
}

.metricsGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.metricItem {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metricValue {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-primary);
}

.metricLabel {
  font-size: 0.58rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Roadmap elements */
.roadmapProgressContainer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.roadmapRole {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--text-primary);
}

.roadmapNodes {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  padding-left: 14px;
}

.roadmapNodes::before {
  content: '';
  position: absolute;
  top: 6px;
  bottom: 6px;
  left: 3px;
  width: 2px;
  background: var(--border-default);
}

.roadmapNode {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.76rem;
  position: relative;
}

.roadmapNode::before {
  content: '';
  position: absolute;
  left: -14px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-default);
}

.roadmapNodeCompleted {
  color: #10b981;
  font-weight: 600;
}

.roadmapNodeCompleted::before {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

.roadmapNodeCurrent {
  color: #f97316;
  font-weight: 600;
}

.roadmapNodeCurrent::before {
  background: #f97316;
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
  animation: pulse-current-node 1.5s infinite alternate;
}

.roadmapNodeUpcoming {
  color: var(--text-muted);
}

@keyframes pulse-current-node {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.3); opacity: 1; }
}

/* Layer 3: Circular HUD Dial (Z = 75px) */
.dialLayer {
  position: absolute;
  top: -24px;
  right: -24px;
  width: 96px;
  height: 96px;
  background: rgba(15, 15, 20, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateZ(75px);
  z-index: 18;
}

[data-theme="light"] .dialLayer {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dialSvg {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.dialBgCircle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 5;
}

[data-theme="light"] .dialBgCircle {
  stroke: rgba(0, 0, 0, 0.04);
}

.dialValueCircle {
  fill: none;
  stroke: var(--badge-dot);
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.dialTextContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  user-select: none;
}

.dialValue {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.15rem;
  color: var(--text-primary);
  line-height: 1;
}

.dialLabel {
  font-size: 0.48rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-top: 3px;
}

/* Layer 4: Telemetry Stats Card (Z = 20px) */
.statusCard {
  background: rgba(20, 20, 25, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 0.88rem 1.25rem;
  transform: translateZ(20px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

[data-theme="light"] .statusCard {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.statusBarContainer {
  width: 90px;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
}

[data-theme="light"] .statusBarContainer {
  background: rgba(0, 0, 0, 0.06);
}

.statusBarFill {
  height: 100%;
  background: var(--badge-dot);
  border-radius: 4px;
  transition: width 0.5s ease;
}
```

---

## 5. Potential Future Upgrades

To take this component to the next level, a developer or AI system could implement:

1.  **Audio-Reactive Telemetry Input (Upgrade Interview Coach)**: Link the waveform visuals directly to microphone input via standard Web Audio API frequency counters when the user clicks record.
2.  **3D Mesh Integration (Upgrade Career Roadmap)**: Introduce a WebGL canvas inside the main progression panel (using Three.js) to render a rotating, interactive SDE skill-tree constellation node structure.
3.  **Holographic Scan Animation (Upgrade Resume tab)**: Overlay a moving neon horizontal laser divider that scrolls top-to-bottom across the resume details visual container to simulate scanning when loading ATS values.
4.  **Audio Synthesizer Overlay**: Include keypress sound effects and digital chime overlays during tab toggles.
