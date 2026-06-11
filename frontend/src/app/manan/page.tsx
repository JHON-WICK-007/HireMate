"use client";

import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./manan.module.css";
import ShaderBackground from "../components/ShaderBackground";

export default function MananShowcasePage() {
  const [pulseSpeed, setPulseSpeed] = useState<number>(3); // seconds for pulse animation
  const [clickCount, setClickCount] = useState<number>(0);
  const [tiltActive, setTiltActive] = useState<boolean>(false);
  
  // 3D Mouse Tilt refs and motion values
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tiltCardRef.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setTiltActive(false);
  };

  const handlePulseClick = () => {
    setClickCount(prev => prev + 1);
    setPulseSpeed(prev => Math.max(0.6, prev - 0.4)); // speed up ripple
    setTimeout(() => {
      setPulseSpeed(3); // reset speed after 3s
    }, 4000);
  };

  return (
    <div className={styles.page}>
      {/* 3D WebGL Background */}
      <ShaderBackground dim={0.25} />

      {/* ─── Header Showcase ─── */}
      <header className={styles.header}>
        <motion.div 
          className={styles.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badgeDot} />
          21st.dev UI UX Showcase
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Manan's Magic Showroom
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          An interactive Bento Grid exhibiting conic-gradient border tracing, 
          3D perspective tilting, and Framer Motion micro-interactions.
        </motion.p>
      </header>

      {/* ─── Bento Grid Showcase ─── */}
      <div className={styles.grid}>
        
        {/* Component 1: Conic Gradient Neon Border Tracer */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col4} ${styles.neonTracerCard}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/*conic border tracer track */}
          <div className={styles.neonTracerGlow} />
          
          <div className={styles.neonTracerInner}>
            <div>
              <h3 className={styles.cardTitle}>Neon Border Tracer</h3>
              <p className={styles.cardSubtitle} style={{ fontSize: "0.85rem", marginBottom: 0 }}>
                A 21st.dev signature effect. A continuous conic-gradient border traces the outer edges using CSS rotations, creating a glowing line that shifts color tones.
              </p>
            </div>
            
            <div style={{ marginTop: "24px" }}>
              <Link href="/" className={styles.btnDemo}>
                Back to Home
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Component 2: 3D Mouse Tilt Card */}
        <motion.div 
          ref={tiltCardRef}
          className={`${styles.glassCard} ${styles.col8} ${styles.tiltCard}`}
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setTiltActive(true)}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.tiltContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 className={styles.cardTitle}>3D Tilt Card</h3>
                <p className={styles.cardSubtitle}>
                  Hover and move your mouse to tilt this panel. Uses Framer Motion springs and mouse coordinate translations to warp the card perspective.
                </p>
              </div>
              <span 
                className="text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10"
                style={{ 
                  background: tiltActive ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.02)",
                  color: tiltActive ? "#3b82f6" : "#a3a3a3",
                  borderColor: tiltActive ? "rgba(59, 130, 246, 0.3)" : "rgba(255,255,255,0.08)",
                  transition: "all 0.2s ease"
                }}
              >
                {tiltActive ? "TILT ACTIVE" : "HOVER ME"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-lg bg-white/2 border border-white/5">
                <span className="text-xs text-text-secondary block">X coordinate</span>
                <span className="font-mono text-lg font-bold text-electric-blue">
                  {tiltActive ? "15.0° max" : "0.00"}
                </span>
              </div>
              <div className="p-4 rounded-lg bg-white/2 border border-white/5">
                <span className="text-xs text-text-secondary block">Y coordinate</span>
                <span className="font-mono text-lg font-bold text-vivid-purple">
                  {tiltActive ? "15.0° max" : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Component 3: soundwave / Ripple node */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col6}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className={styles.cardTitle}>Interactive Ripple Node</h3>
          <p className={styles.cardSubtitle}>
            Clicking the node accelerates the concentric background pulse waves. Demonstrates interactive animations based on dynamic states.
          </p>

          <div className={styles.playgroundArea}>
            <div 
              className={styles.pulseCircle} 
              style={{ animationDuration: `${pulseSpeed}s` }} 
            />
            <div 
              className={`${styles.pulseCircle} ${styles.pulseCircle2}`} 
              style={{ animationDuration: `${pulseSpeed}s` }} 
            />
            <div 
              className={`${styles.pulseCircle} ${styles.pulseCircle3}`} 
              style={{ animationDuration: `${pulseSpeed}s` }} 
            />
            
            <button 
              className={styles.centerGlowDot} 
              onClick={handlePulseClick} 
              aria-label="Trigger ripple pulse"
            />
          </div>

          <div className="text-center text-xs text-text-secondary mt-4">
            Total triggers: <span className="font-bold text-vivid-purple">{clickCount}</span>
          </div>
        </motion.div>

        {/* Component 4: Stack Lists */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col6}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className={styles.cardTitle}>Feature Stack</h3>
          <p className={styles.cardSubtitle}>
            Hoverable modular rows that translate on the X axis, highlighting active states with glass textures.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { title: "Next.js 16 Routing", desc: "Clean static segment compilations", icon: "route" },
              { title: "WebGL Shader Canvas", desc: "Interactive client-side background", icon: "blur_on" },
              { title: "Framer Motion Spring", desc: "Smooth coordinate-based dampening", icon: "waves" }
            ].map((item, idx) => (
              <div key={idx} className={styles.stackRow}>
                <div className={styles.stackIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 8 12 12 16 14" />
                  </svg>
                </div>
                <div className={styles.stackDetails}>
                  <span className={styles.stackTitle}>{item.title}</span>
                  <span className={styles.stackDesc}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
