"use client";

import { useState, useEffect, useRef, MouseEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import styles from "./manan.module.css";

// ─── Types ───
interface StackCard {
  id: string;
  title: string;
  desc: string;
  tech: string;
  glow: string;
}

const initialStackCards: StackCard[] = [
  {
    id: "card-1",
    title: "Magic AI Canvas",
    desc: "A GPU-optimized particle network that warps and links nodes interactively under your cursor.",
    tech: "HTML5 Canvas + Vector Physics",
    glow: "rgba(59, 130, 246, 0.15)"
  },
  {
    id: "card-2",
    title: "Parallax Perspective",
    desc: "Hover to tilt the card frame while the text and visual assets float on elevated 3D depth planes.",
    tech: "CSS 3D preserve-3d + Springs",
    glow: "rgba(139, 92, 246, 0.15)"
  },
  {
    id: "card-3",
    title: "Laser Outline Mask",
    desc: "A 1px thick glowing vector tracing the rounded card border using rotating conic masks.",
    tech: "CSS Conic Gradients + RequestAnimationFrame",
    glow: "rgba(34, 197, 94, 0.15)"
  }
];

export default function MananShowcasePage() {
  // Draggable Card Stack State
  const [stack, setStack] = useState<StackCard[]>(initialStackCards);
  
  // Conic laser border angle
  const [laserAngle, setLaserAngle] = useState(0);
  
  // Active states for visualizer
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(new Array(24).fill(12));
  
  // Interactive Particle Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // 3D Parallax Mouse coordinates
  const tiltRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 3D Tilt rotations driven by springs
  const springConfig = { damping: 25, stiffness: 150, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  
  // Inner layer parallax depth translation
  const textTranslateX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const textTranslateY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);
  
  // Mouse position inside tilt card (for spotlight coordinates)
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHoveringTilt, setIsHoveringTilt] = useState(false);

  // 1. Particle Constellation Network Animation (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse coordinates
    const mouse = { x: -1000, y: -1000, radius: 180 };

    const handleMouseMoveGlobal = (e: globalThis.MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeaveGlobal = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMoveGlobal);
    window.addEventListener("mouseleave", handleMouseLeaveGlobal);
    window.addEventListener("resize", handleResize);

    // Particle Class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseRadius: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
        this.color = "rgba(139, 92, 246, 0.35)"; // neon purple dot
      }

      update() {
        // Drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction/repulsion physics
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Slowly push away from the mouse cursor
          this.x -= (dx / dist) * force * 1.2;
          this.y -= (dy / dist) * force * 1.2;
          this.radius = this.baseRadius + force * 2;
          this.color = `rgba(59, 130, 246, ${0.35 + force * 0.55})`; // transitions to electric blue near mouse
        } else {
          this.radius = this.baseRadius;
          this.color = "rgba(139, 92, 246, 0.35)";
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Initialize particles
    const particleCount = Math.min(100, Math.floor((width * height) / 15000));
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Connect particles near each other
    function drawLines() {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            // Check if particles are close to the mouse to glow lines brighter
            const mouseDistI = Math.sqrt((mouse.x - particles[i].x) ** 2 + (mouse.y - particles[i].y) ** 2);
            const mouseDistJ = Math.sqrt((mouse.x - particles[j].x) ** 2 + (mouse.y - particles[j].y) ** 2);
            
            let alpha = (110 - dist) / 110 * 0.15;
            if (mouseDistI < mouse.radius || mouseDistJ < mouse.radius) {
              alpha *= 2.5; // brighter lines near mouse
            }

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      drawLines();
      animationId = requestAnimationFrame(tick);
    };
    tick();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseleave", handleMouseLeaveGlobal);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 2. Conic Laser border angle animation loop
  useEffect(() => {
    let animFrame: number;
    const updateAngle = () => {
      setLaserAngle(prev => (prev + 1.2) % 360);
      animFrame = requestAnimationFrame(updateAngle);
    };
    animFrame = requestAnimationFrame(updateAngle);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // 3. Audio visualizer interactive ripple wave
  useEffect(() => {
    let animId: number;
    let t = 0;
    const animateVisualizer = () => {
      t += 0.05;
      setVisualizerHeights(prev => 
        prev.map((h, i) => {
          let target = Math.sin(t + i * 0.4) * 20 + 26;
          // If mouse is hovering over a specific bar, create a localized ripple wave
          if (activeBarIndex !== null) {
            const dist = Math.abs(i - activeBarIndex);
            if (dist < 4) {
              const hoverBoost = (4 - dist) * 12;
              target += hoverBoost;
            }
          }
          // Smooth interpolation
          return h + (target - h) * 0.15;
        })
      );
      animId = requestAnimationFrame(animateVisualizer);
    };
    animateVisualizer();
    return () => cancelAnimationFrame(animId);
  }, [activeBarIndex]);

  // 4. Handle 3D Parallax Mouse Tilt Move
  const handleTiltMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized coordinates (-0.5 to 0.5)
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;
    
    mouseX.set(normX);
    mouseY.set(normY);

    // Calculate spotlight position percentages
    const pctX = ((e.clientX - rect.left) / width) * 100;
    const pctY = ((e.clientY - rect.top) / height) * 100;
    setSpotlightPos({ x: pctX, y: pctY });
    setIsHoveringTilt(true);
  };

  const handleTiltMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHoveringTilt(false);
  };

  // 5. Handle Card Swipe Recycle Stack
  const handleCardDragEnd = (event: any, info: any, cardId: string) => {
    // If swiped left or right past threshold (130px)
    if (Math.abs(info.offset.x) > 130) {
      setStack(prev => {
        const swipedCard = prev.find(c => c.id === cardId);
        if (!swipedCard) return prev;
        
        // Remove from top, append to the bottom of the stack
        const remaining = prev.filter(c => c.id !== cardId);
        return [...remaining, swipedCard];
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* 2D Vector Physics Constellation Canvas */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          pointerEvents: "none"
        }}
      />
      <div className={styles.backgroundGrid} />

      {/* ─── Header ─── */}
      <header className={styles.header}>
        <motion.div 
          className={styles.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className={styles.badgeDot} />
          Antigravity UI/UX Pro Max Edition
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Dynamic 3D Showcase
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          A premium layout exhibiting advanced 3D perspective parallax, 
          physics-driven card swiping, and high-fidelity laser outline tracing.
        </motion.p>
      </header>

      {/* ─── Bento Grid Showcase ─── */}
      <div className={styles.grid}>
        
        {/* Component 1: Conic Laser Border Tracer (col-4) */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col4} ${styles.laserCard}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Conic laser border outline */}
          <div 
            className={styles.laserTracer} 
            style={{ "--angle": `${laserAngle}deg` } as any}
          />
          
          <div className={styles.laserInner}>
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className={styles.chip}>Laser Active</span>
                <span className="text-[11px] font-mono text-electric-blue">{Math.round(laserAngle)}°</span>
              </div>
              <h3 className={styles.cardTitle}>Laser Outline Tracer</h3>
              <p className={styles.cardSubtitle} style={{ fontSize: "0.88rem", marginBottom: 0 }}>
                Renders a ultra-thin 1px laser tracing the card contour using a masked conic gradient, giving the card a rotating glowing edge reminiscent of liquid neon.
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

        {/* Component 2: Advanced 3D Parallax Tilt (col-8) */}
        <motion.div 
          ref={tiltRef}
          className={`${styles.glassCard} ${styles.col8} ${styles.tiltCard}`}
          style={{ rotateX, rotateY }}
          onMouseMove={handleTiltMouseMove}
          onMouseLeave={handleTiltMouseLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Spotlight overlay following mouse */}
          <div 
            className={styles.cardSpotlight}
            style={{ 
              "--mouse-x": `${spotlightPos.x}%`, 
              "--mouse-y": `${spotlightPos.y}%` 
            } as any}
          />

          <div className={styles.parallaxContainer}>
            <div className="flex justify-between items-start">
              <motion.div 
                className={styles.layerBase}
                style={{ x: textTranslateX, y: textTranslateY }}
              >
                <span className={styles.chip} style={{ marginBottom: "12px" }}>Parallax Active</span>
                <h3 className={styles.cardTitle} style={{ fontSize: "1.8rem" }}>3D Parallax Depth</h3>
              </motion.div>
              
              <span 
                className="text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all"
                style={{ 
                  background: isHoveringTilt ? "rgba(59, 130, 246, 0.15)" : "rgba(255,255,255,0.02)",
                  color: isHoveringTilt ? "#3b82f6" : "#a3a3a3",
                  borderColor: isHoveringTilt ? "rgba(59, 130, 246, 0.3)" : "rgba(255,255,255,0.08)"
                }}
              >
                {isHoveringTilt ? "TILT ACTIVE" : "HOVER TO WARP"}
              </span>
            </div>

            {/* Elevated 3D description text layer */}
            <motion.p 
              className={`${styles.cardSubtitle} ${styles.layerFloat}`}
              style={{ x: textTranslateX, y: textTranslateY, marginTop: "16px" }}
            >
              Move your mouse across the card. The outer borders tilt while the inner content floats on an elevated 3D depth plane, producing a striking volumetric glass card effect.
            </motion.p>

            <motion.div 
              className={`${styles.layerDeepFloat} grid grid-cols-3 gap-4 mt-6`}
              style={{ x: textTranslateX, y: textTranslateY }}
            >
              <div className="p-4 rounded-lg bg-white/2 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] text-text-secondary block font-bold tracking-wider">TILT-X</span>
                <span className="font-mono text-base font-bold text-electric-blue">
                  {isHoveringTilt ? (rotateX.get() * 1.5).toFixed(1) : "0.0"}°
                </span>
              </div>
              <div className="p-4 rounded-lg bg-white/2 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] text-text-secondary block font-bold tracking-wider">TILT-Y</span>
                <span className="font-mono text-base font-bold text-vivid-purple">
                  {isHoveringTilt ? (rotateY.get() * 1.5).toFixed(1) : "0.0"}°
                </span>
              </div>
              <div className="p-4 rounded-lg bg-white/2 border border-white/5 backdrop-blur-md">
                <span className="text-[10px] text-text-secondary block font-bold tracking-wider">DEPTH-Z</span>
                <span className="font-mono text-base font-bold text-success">
                  {isHoveringTilt ? "85px" : "0px"}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Component 3: Infinite Draggable Card Stack (col-6) */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col6}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div>
            <h3 className={styles.cardTitle}>Physics Draggable Stack</h3>
            <p className={styles.cardSubtitle} style={{ fontSize: "0.88rem", marginBottom: 0 }}>
              Grab the top card and swipe it left or right. It uses inertia physics to fly away with spring animations, automatically recycling itself to the bottom of the pile.
            </p>
          </div>

          <div className={styles.stackArea}>
            <AnimatePresence>
              {stack.map((card, index) => {
                const isTop = index === 0;
                return (
                  <motion.div
                    key={card.id}
                    className={styles.draggableCard}
                    style={{
                      background: isTop ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.005)",
                      zIndex: stack.length - index,
                      boxShadow: isTop 
                        ? `0 12px 36px rgba(0, 0, 0, 0.8), 0 0 20px ${card.glow}`
                        : "0 8px 20px rgba(0, 0, 0, 0.6)",
                      borderColor: isTop ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)"
                    }}
                    animate={{
                      scale: 1 - index * 0.05,
                      y: index * -12,
                      rotate: isTop ? 0 : index % 2 === 0 ? 2 : -2
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    drag={isTop ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => handleCardDragEnd(e, info, card.id)}
                    whileDrag={{ scale: 1.05, cursor: "grabbing" }}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={styles.draggableCardTitle}>{card.title}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 font-mono">
                          {isTop ? "TOP" : `NEXT #${index}`}
                        </span>
                      </div>
                      <p className={styles.draggableCardDesc}>{card.desc}</p>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] text-text-muted font-mono">{card.tech}</span>
                      {isTop && (
                        <span className="text-[9px] text-[#3b82f6] animate-pulse">Swipe Left/Right →</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Component 4: Liquid Glass Audio Visualizer (col-6) */}
        <motion.div 
          className={`${styles.glassCard} ${styles.col6}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div>
            <h3 className={styles.cardTitle}>Liquid Glass Wave</h3>
            <p className={styles.cardSubtitle} style={{ fontSize: "0.88rem", marginBottom: "16px" }}>
              Hover your mouse over the audio visualizer below. The frequencies warp interactively based on your cursor's X position, creating custom fluid rippling patterns.
            </p>
          </div>

          <div 
            className={styles.visualizerArea}
            onMouseLeave={() => setActiveBarIndex(null)}
          >
            {visualizerHeights.map((h, i) => (
              <div 
                key={i}
                className={`${styles.visualizerBar} ${
                  activeBarIndex !== null && Math.abs(i - activeBarIndex) < 4 ? styles.visualizerActiveBar : ""
                }`}
                style={{ height: `${h}px` }}
                onMouseEnter={() => setActiveBarIndex(i)}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs text-text-secondary">
            <span>Visualizer Input: <span className="font-bold text-success">Active</span></span>
            <span>Hover Position: <span className="font-mono font-bold text-electric-blue">
              {activeBarIndex !== null ? `${Math.round((activeBarIndex / 24) * 100)}%` : "Idle"}
            </span></span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
