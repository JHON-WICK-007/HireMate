"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./manan.module.css";

// ─── Data Types ───
interface ProjectItem {
  id: string;
  category: "features" | "data" | "playground";
  title: string;
  desc: string;
  metric: string;
  percentage: number;
}

const mockProjects: ProjectItem[] = [
  {
    id: "proj-1",
    category: "features",
    title: "ATS Parser Node",
    desc: "Extracts key skills and work experience from PDF files to analyze job description matches.",
    metric: "Accuracy Rate",
    percentage: 92
  },
  {
    id: "proj-2",
    category: "features",
    title: "Speech Coach Room",
    desc: "Uses voice recognition to analyze candidate delivery pace, word choice, and tone parameters.",
    metric: "Transcription Speed",
    percentage: 84
  },
  {
    id: "proj-3",
    category: "data",
    title: "Progress Analyzer",
    desc: "Calculates scores over multiple mock interview attempts to plot confidence trends.",
    metric: "Completion Margin",
    percentage: 76
  },
  {
    id: "proj-4",
    category: "playground",
    title: "Vector Physics",
    desc: "Interactive canvas animations that warp nodes based on mouse distance attractors.",
    metric: "Frame Rate (FPS)",
    percentage: 95
  }
];

export default function MananFlatShowcase() {
  const [filter, setFilter] = useState<string>("all");
  const [activeProject, setActiveProject] = useState<ProjectItem>(mockProjects[0]);
  
  // Interactive Typography Input
  const [textInput, setTextInput] = useState<string>("Manan Vasani");

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: "task-1", label: "No emojis used as icons", completed: true },
    { id: "task-2", label: "Bold solid 2px borders", completed: true },
    { id: "task-3", label: "Space Grotesk headers active", completed: true },
    { id: "task-4", label: "No gradients or shadows applied", completed: false }
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist(prev => 
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    );
  };

  const filteredProjects = filter === "all" 
    ? mockProjects 
    : mockProjects.filter(p => p.category === filter);

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGrid} />

      {/* ─── Header Flat ─── */}
      <header className={styles.header}>
        <motion.div 
          className={styles.badge}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className={styles.badgeDot} />
          UI/UX Pro Max Flat Edition
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Flat Design Showcase
        </motion.h1>
        
        <motion.p 
          className={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          A typography-focused, 2D minimalist interface featuring bold outlines, 
          clean geometric alignments, and monochrome accents recommended by our UI/UX skill.
        </motion.p>
      </header>

      {/* ─── Filter Row ─── */}
      <div className={styles.filterRow}>
        {["all", "features", "data", "playground"].map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.filterBtnActive : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ─── Bento / Portfolio Grid ─── */}
      <div className={styles.grid}>
        
        {/* Component 1: Portfolio Grid List (col-8) */}
        <div className={`${styles.flatCard} ${styles.col8}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Portfolio Grid</h3>
            <span className={styles.tag}>{filteredProjects.length} Items</span>
          </div>
          <p className={styles.cardSubtitle}>
            Filterable masonry block showing functional cards. Clicking a card updates the performance chart inside the adjoining panel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 border-2 border-zinc-900 rounded bg-white cursor-pointer hover:border-blue-600 transition-colors flex flex-col justify-between"
                  style={{ 
                    borderColor: activeProject.id === proj.id ? "#2563eb" : "#18181b",
                    boxShadow: activeProject.id === proj.id ? "4px 4px 0px #18181b" : "none"
                  }}
                  onClick={() => setActiveProject(proj)}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm tracking-tight font-display text-zinc-900">
                        {proj.title}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{proj.desc}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center text-[10px] font-bold font-mono">
                    <span className="text-zinc-500">{proj.metric}</span>
                    <span className="text-blue-600">{proj.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Component 2: Performance Analyzer (col-4) */}
        <div className={`${styles.flatCard} ${styles.col4}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Performance Chart</h3>
            <span className={styles.tag} style={{ color: "#2563eb", borderColor: "#2563eb" }}>Live Sync</span>
          </div>
          <p className={styles.cardSubtitle} style={{ fontSize: "0.85rem", marginBottom: "16px" }}>
            Visualizing telemetry scores for the selected project: <strong className="text-zinc-900">{activeProject.title}</strong>.
          </p>

          <div className={styles.chartContainer}>
            <div className={styles.chartBarRow}>
              <span className={styles.chartBarLabel}>Success rate</span>
              <div className={styles.chartBarTrack}>
                <div className={styles.chartBarFill} style={{ width: `${activeProject.percentage}%` }} />
              </div>
            </div>

            <div className={styles.chartBarRow}>
              <span className={styles.chartBarLabel}>Efficiency</span>
              <div className={styles.chartBarTrack}>
                <div className={`${styles.chartBarFill} ${styles.chartBarSecondary}`} style={{ width: "88%" }} />
              </div>
            </div>

            <div className={styles.chartBarRow}>
              <span className={styles.chartBarLabel}>Load time</span>
              <div className={styles.chartBarTrack}>
                <div className={`${styles.chartBarFill} ${styles.chartBarSecondary}`} style={{ width: "95%" }} />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-zinc-200 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Active Metrics</span>
            <div className="flex justify-between text-xs font-bold text-zinc-800">
              <span>{activeProject.metric}</span>
              <span className="font-mono text-blue-600">{activeProject.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Component 3: Checklist (col-6) */}
        <div className={`${styles.flatCard} ${styles.col6}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Interactive Checklist</h3>
            <span className={styles.tag}>QA Verify</span>
          </div>
          <p className={styles.cardSubtitle}>
            Pre-delivery checklist verifying interface alignment. Tap items to check them off with bold color animations.
          </p>

          <div className={styles.checklist}>
            {checklist.map((item) => (
              <div 
                key={item.id} 
                className={styles.checkItem}
                onClick={() => toggleChecklist(item.id)}
              >
                <div className={`${styles.checkbox} ${item.completed ? styles.checkboxActive : ""}`}>
                  {item.completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`${styles.checkItemText} ${item.completed ? styles.checkItemTextMuted : ""}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Component 4: Typography Playground (col-6) */}
        <div className={`${styles.flatCard} ${styles.col6}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Typography Input</h3>
            <span className={styles.tag}>Space Grotesk</span>
          </div>
          <p className={styles.cardSubtitle}>
            Type text in the input field to watch it render live in bold Space Grotesk display weights.
          </p>

          <input
            type="text"
            className={styles.playgroundInput}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Type showcase text here..."
            maxLength={32}
            aria-label="Display text input"
          />

          <div className={styles.playgroundDisplay}>
            <span className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider mb-2">RENDER VIEW</span>
            <span 
              className="text-2xl font-bold text-zinc-900 tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {textInput || "Type something..."}
            </span>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <span className="text-xs text-zinc-400">Layout: <strong className="text-zinc-600">Flat Minimalist</strong></span>
            <Link href="/" className={styles.btnDemo}>
              Back to Home
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
