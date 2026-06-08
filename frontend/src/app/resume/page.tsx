"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./resume.module.css";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/Toast";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Icons
const IconUpload = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconLightbulb = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2v1" /><path d="M12 7a5 5 0 0 0-5 5c0 2 1.5 3 2 4.5V18h6v-1.5c.5-1.5 2-2.5 2-4.5a5 5 0 0 0-5-5Z" /></svg>;
const IconDownload = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;

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
  const [activeTab, setActiveTab] = useState<"analysis" | "preview">("analysis");

  const resumeRef = useRef<HTMLDivElement>(null);

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
        toast.error(data.message || "Failed to analyze resume.");
      }
    } catch (err) {
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const exportPDF = async () => {
    if (!resumeRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;
    const opt = {
      margin: 10,
      filename: 'HireMate_Resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(resumeRef.current).save();
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

  if (!isLoggedIn) return null;

  return (
    <div className={styles.page}>
      <nav style={{ padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-subtle)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold", fontSize: "1.2rem", color: "var(--text-primary)" }}>
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none"><rect x="2" y="2" width="36" height="36" rx="10" fill="var(--text-primary)" /><path d="M12 14h16M12 20h10M12 26h14" stroke="var(--surface-0)" strokeWidth="2.5" /></svg>
          HireMate AI
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/profile" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Dashboard</Link>
          <ThemeToggle />
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Resume Optimizer</h1>
          <p className={styles.subtitle}>Upload your resume to instantly get an ATS score, AI-driven improvements, and generate a perfectly formatted template.</p>

          {!resumeData && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%" }}>
              <div className={styles.uploadArea} style={{ width: "100%" }}>
                <IconUpload />
                <div className={styles.uploadText}>{file ? file.name : "Drag & drop or click to upload"}</div>
                <div className={styles.uploadSubtext}>Supports PDF and DOCX files</div>
                <input id="fileInput" type="file" accept=".pdf,.docx" className={styles.uploadInput} onChange={handleFileChange} />
              </div>
              
              <button 
                onClick={handleUpload} 
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={!file || isUploading}
                style={{ minWidth: "200px", justifyContent: "center" }}
              >
                {isUploading ? "Analyzing with AI..." : "Analyze Resume"}
              </button>
            </div>
          )}
        </div>
      </section>

      {resumeData && (
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>ATS Score</h3>
              <div className={styles.atsScoreWrap}>
                <div className={styles.atsScoreRing} style={{ "--score-pct": `${resumeData.analysis.atsScore}%` } as React.CSSProperties}>
                  <div className={styles.atsScoreInner}>
                    <span className={styles.atsNumber}>{resumeData.analysis.atsScore}</span>
                    <span className={styles.atsLabel}>Out of 100</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center" }}>
                {resumeData.analysis.atsScore > 80 ? "Great job! Your resume is highly optimized." : "There is room for improvement to pass ATS filters."}
              </p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Analysis</h3>
              <ul className={styles.analysisList}>
                {resumeData.analysis.strengths.map((s, i) => <li key={`s-${i}`} className={`${styles.analysisItem} ${styles.strength}`}><IconCheck />{s}</li>)}
                {resumeData.analysis.weaknesses.map((w, i) => <li key={`w-${i}`} className={`${styles.analysisItem} ${styles.weakness}`}><IconX />{w}</li>)}
                {resumeData.analysis.improvementSuggestions.map((s, i) => <li key={`i-${i}`} className={`${styles.analysisItem} ${styles.suggestion}`}><IconLightbulb />{s}</li>)}
              </ul>
            </div>
          </aside>

          <main className={styles.main}>
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === "analysis" ? styles.active : ""}`} onClick={() => setActiveTab("analysis")}>Extracted Data</button>
              <button className={`${styles.tab} ${activeTab === "preview" ? styles.active : ""}`} onClick={() => setActiveTab("preview")}>Resume Builder Preview</button>
            </div>

            {activeTab === "analysis" && (
              <div>
                <h2 style={{ marginBottom: "1rem" }}>{resumeData.personalInfo.fullName}</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>{resumeData.personalInfo.email} | {resumeData.personalInfo.phone}</p>

                <h3 style={{ marginBottom: "0.5rem" }}>Skills</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
                  {resumeData.skills.map((s, i) => <span key={i} style={{ background: "var(--surface-200)", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.8rem" }}>{s}</span>)}
                </div>

                <h3 style={{ marginBottom: "0.5rem" }}>Experience</h3>
                {resumeData.experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border-default)" }}>
                    <div style={{ fontWeight: "bold" }}>{exp.role}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{exp.company} | {exp.duration}</div>
                    <p style={{ fontSize: "0.9rem" }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "preview" && (
              <div>
                <div className={styles.exportBar}>
                  <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={exportPDF}><IconDownload /> Export PDF</button>
                  <button className={`${styles.btn} ${styles.btnOutline}`} onClick={exportDOCX}><IconDownload /> Export DOCX</button>
                </div>

                <div style={{ overflowX: "auto", padding: "20px", background: "var(--surface-200)", borderRadius: "8px" }}>
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
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
