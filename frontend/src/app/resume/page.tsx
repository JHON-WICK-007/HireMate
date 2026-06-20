"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./resume.module.css";
import homeStyles from "../home.module.css";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import { motion, AnimatePresence } from "framer-motion";

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

export default function ResumePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [activeTab, setActiveTab] = useState<"analysis" | "data" | "preview">("analysis");

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
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
        .then(r => r.json())
        .then(data => { if (data.success) setUser(data.user); else router.push("/auth?mode=signin"); })
        .catch(() => { });
    } else {
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
        margin: 10,
        filename: 'HireMate_Resume.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
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

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({ text: resumeData.personalInfo.fullName, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone}` }),
          new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_2 }),
          ...resumeData.experience.map(e => new Paragraph({ text: `${e.role} at ${e.company} (${e.duration})\n${e.description}` })),
          new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_2 }),
          ...resumeData.education.map(e => new Paragraph({ text: `${e.degree} - ${e.institution} (${e.year})` })),
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: resumeData.skills.join(", ") })
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "HireMate_Resume.docx");
      toast.success("DOCX exported!");
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  if (!isLoggedIn) return null;

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className={`${homeStyles.nav} ${scrolled ? homeStyles.navScrolled : ""} ${navHidden ? homeStyles.navHidden : ""}`}>
        <div className={homeStyles.navInner}>
          <Link href="/" className={homeStyles.navLogo}>
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

          <div className={homeStyles.navLinks}>
            <Link href="/resume" className={homeStyles.navLink}>Resume Builder</Link>
            <Link href="/#features" className={homeStyles.navLink}>Features</Link>
            <Link href="/#how-it-works" className={homeStyles.navLink}>How It Works</Link>
            <Link href="/#stats" className={homeStyles.navLink}>Results</Link>
          </div>

          <div className={homeStyles.navActions}>
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link href="/profile" className={homeStyles.navBtnGhost} style={{ paddingLeft: "6px", paddingRight: "16px" }}>
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
                <Link href="/auth?mode=signin" className={homeStyles.navBtnGhost}>Sign In</Link>
                <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid}>Get Started</Link>
              </>
            )}
          </div>

          <button
            className={homeStyles.hamburger}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen1 : ""}`} />
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen2 : ""}`} />
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className={homeStyles.mobileMenu}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span className={homeStyles.mobileLink} style={{ margin: 0 }}>Theme</span>
              <ThemeToggle />
            </div>
            <div className={homeStyles.mobileDivider} />
            <Link href="/resume" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Resume Builder</Link>
            <Link href="/#features" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Features</Link>
            <Link href="/#how-it-works" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>How It Works</Link>
            <Link href="/#stats" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Results</Link>
            <div className={homeStyles.mobileDivider} />
            {isLoggedIn ? (
              <>
                <Link href="/profile" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                <Link href="/auth?mode=signin" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Sign In</Link>
                <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={() => setMobileMenu(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

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
                <div className={styles.uploadIconWrap}>
                  <IconUpload />
                </div>
                {file ? (
                  <div className={styles.uploadFileInfo}>
                    <div className={styles.uploadFileIcon}><IconFile /></div>
                    <span className={styles.uploadFileName}>{file.name}</span>
                    <span className={styles.uploadFileSize}>{formatFileSize(file.size)}</span>
                  </div>
                ) : (
                  <>
                    <div className={styles.uploadText}>Drag & drop or click to upload</div>
                    <div className={styles.uploadSubtext}>Supports PDF and DOCX files (max 10MB)</div>
                  </>
                )}
                <input id="fileInput" type="file" accept=".pdf,.docx" className={styles.uploadInput} onChange={handleFileChange} />
              </div>

              <motion.button
                onClick={handleUpload}
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!file || isUploading}
                style={{ minWidth: "220px", justifyContent: "center", padding: "0.85rem 2rem" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isUploading ? "Analyzing…" : "Analyze Resume"}
              </motion.button>
            </motion.div>

            <motion.div className={styles.featuresRow} variants={fadeInUp}>
              <span className={styles.featureChip}><IconShield /> ATS Compatible</span>
              <span className={styles.featureChip}><IconZap /> Instant Results</span>
              <span className={styles.featureChip}><IconTarget /> AI-Powered</span>
            </motion.div>
          </motion.div>
        </section>
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
              style={{ "--score-pct": `${resumeData.analysis.atsScore}%` } as React.CSSProperties}
              initial={{ scale: 0.7, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <div className={styles.scoreBannerInner}>
                <span className={styles.scoreBannerNumber}>{resumeData.analysis.atsScore}</span>
              </div>
            </motion.div>
            <div className={styles.scoreBannerInfo}>
              <div className={styles.scoreBannerName}>{resumeData.personalInfo.fullName}</div>
              <div className={styles.scoreBannerSub}>
                ATS Score: {resumeData.analysis.atsScore}/100 · {resumeData.analysis.atsScore > 80 ? "Well optimized" : resumeData.analysis.atsScore > 60 ? "Needs improvement" : "Needs significant work"}
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
                      {resumeData.analysis.strengths.map((s, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.strength}`}><IconCheck /><span>{s}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className={styles.analysisCard}>
                    <div className={`${styles.analysisCardTitle} ${styles.weaknessTitle}`}>
                      <IconX /> Weaknesses
                    </div>
                    <ul className={styles.analysisList}>
                      {resumeData.analysis.weaknesses.map((w, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.weakness}`}><IconX /><span>{w}</span></li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className={styles.analysisCard}>
                    <div className={`${styles.analysisCardTitle} ${styles.suggestionTitle}`}>
                      <IconLightbulb /> Suggestions
                    </div>
                    <ul className={styles.analysisList}>
                      {resumeData.analysis.improvementSuggestions.map((s, i) => (
                        <li key={i} className={`${styles.analysisItem} ${styles.suggestion}`}><IconLightbulb /><span>{s}</span></li>
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
                  <p className={styles.dataContact}>{resumeData.personalInfo.email} • {resumeData.personalInfo.phone}</p>

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
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={exportPDF}><IconDownload /> Export PDF</button>
                  <button className={`${styles.btn} ${styles.btnOutline}`} onClick={exportDOCX}><IconDownload /> Export DOCX</button>
                </div>

                <div className={styles.resumePreviewWrap}>
                  <div className={styles.resumePreview} ref={resumeRef}>
                    <div className={styles.rpHeader}>
                      <h1 className={styles.rpName}>{resumeData.personalInfo.fullName}</h1>
                      <div className={styles.rpContact}>
                        {resumeData.personalInfo.email} • {resumeData.personalInfo.phone}
                        {resumeData.personalInfo.links?.length > 0 && ` • ${resumeData.personalInfo.links.join(" • ")}`}
                      </div>
                    </div>

                    {resumeData.experience.length > 0 && (
                      <div className={styles.rpSection}>
                        <div className={styles.rpSectionTitle}>Professional Experience</div>
                        {resumeData.experience.map((exp, i) => (
                          <div className={styles.rpItem} key={i}>
                            <div className={styles.rpItemHeader}>
                              <span>{exp.role}</span>
                              <span>{exp.duration}</span>
                            </div>
                            <div className={styles.rpItemSub}>{exp.company}</div>
                            <p className={styles.rpItemDesc}>{exp.description}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.education.length > 0 && (
                      <div className={styles.rpSection}>
                        <div className={styles.rpSectionTitle}>Education</div>
                        {resumeData.education.map((ed, i) => (
                          <div className={styles.rpItem} key={i}>
                            <div className={styles.rpItemHeader}>
                              <span>{ed.degree}</span>
                              <span>{ed.year}</span>
                            </div>
                            <div className={styles.rpItemSub}>{ed.institution}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.projects?.length > 0 && (
                      <div className={styles.rpSection}>
                        <div className={styles.rpSectionTitle}>Projects</div>
                        {resumeData.projects.map((proj, i) => (
                          <div className={styles.rpItem} key={i}>
                            <div className={styles.rpItemHeader}>
                              <span>{proj.name}</span>
                            </div>
                            <p className={styles.rpItemDesc}>{proj.description}</p>
                            <p className={styles.rpItemDesc} style={{ fontStyle: "italic", marginTop: "3px" }}>Tech: {proj.technologies.join(", ")}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.skills.length > 0 && (
                      <div className={styles.rpSection}>
                        <div className={styles.rpSectionTitle}>Skills</div>
                        <div className={styles.rpSkills}>{resumeData.skills.join(", ")}</div>
                      </div>
                    )}
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
