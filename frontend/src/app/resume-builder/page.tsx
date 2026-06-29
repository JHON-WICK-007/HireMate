"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HomeBackdrop from "../components/HomeBackdrop";
import Navbar from "../components/Navbar";
import { useResumeStore } from "./store";
import { StepSidebar, StepNavigation } from "./components/navigation";
import { LivePreviewPanel } from "./components/preview";
import PersonalInfoStep from "./components/steps/PersonalInfoStep";
import SummaryStep from "./components/steps/SummaryStep";
import ExperienceStep from "./components/steps/ExperienceStep";
import EducationStep from "./components/steps/EducationStep";
import SkillsStep from "./components/steps/SkillsStep";
import ProjectsStep from "./components/steps/ProjectsStep";
import CertificationsStep from "./components/steps/CertificationsStep";
import styles from "./builder.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import { X, FileDown, FileText, Printer } from "lucide-react";

export default function ResumeBuilderPage() {
  const router = useRouter();
  const toast = useToast();
  const currentStep = useResumeStore((state) => state.currentStep);
  const selectedColor = useResumeStore((state) => state.selectedColor);
  const actions = useResumeStore((state) => state.actions);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sign In Required", "Please sign in to start generating your resume.");
      router.push("/auth?mode=signin&redirect=/resume-builder");
      return;
    }

    // Prefill from cache first
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        actions.loadFromProfile(user);
      } catch (e) {}
    }

    // Fetch fresh profile data
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          actions.loadFromProfile(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          toast.error("Session Expired", "Please log in again.");
          router.push("/auth?mode=signin&redirect=/resume-builder");
        }
      })
      .catch(() => {
        // Fallback silently to cache if network fails
      })
      .finally(() => {
        setIsCheckingAuth(false);
      });
  }, [router, actions, toast]);

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <SummaryStep />;
      case 3:
        return <ExperienceStep />;
      case 4:
        return <EducationStep />;
      case 5:
        return <SkillsStep />;
      case 6:
        return <ProjectsStep />;
      case 7:
        return <CertificationsStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  const handleFinish = () => {
    setIsExportModalOpen(true);
  };

  const formatMonthYear = (date: { month: number | null; year: number | null }) => {
    if (!date.year) return "";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mStr = date.month ? monthNames[date.month - 1] : "";
    return `${mStr} ${date.year}`;
  };

  // 1. Backend PDF export utilizing Express Puppeteer API
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("resume-print-capture");
      if (!element) {
        toast.error("Export Failed", "Capture target not found.");
        setIsExporting(false);
        return;
      }

      const personalInfo = useResumeStore.getState().personalInfo;
      const templateId = useResumeStore.getState().selectedTemplateId;
      const fullName = `${personalInfo.firstName || ""} ${personalInfo.surname || ""}`.trim() || "Resume";

      // Wrap the extracted preview card HTML in a complete document structure
      const resumeHTML = element.innerHTML;
      
      const googleFontsLink = templateId === 2
        ? `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`
        : `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">`;

      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${googleFontsLink}
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>
  ${resumeHTML}
</body>
</html>`;

      toast.success("Generating PDF...", "Compiling vector PDF on backend...");

      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(`${API_URL}/api/resume/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`
        },
        body: JSON.stringify({ html: fullHTML })
      });

      if (!response.ok) {
        throw new Error("Failed to compile PDF on the server.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success("Success ✓", "PDF downloaded successfully!");
      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Export Failed", "Could not render PDF document.");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Programmatic DOCX export utilizing docx & file-saver
  const handleExportDOCX = async () => {
    setIsExporting(true);
    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } = await import("docx");
      const { saveAs } = await import("file-saver");      
      const personalInfo = useResumeStore.getState().personalInfo;
      const summary = useResumeStore.getState().summary;
      const experiences = useResumeStore.getState().experiences;
      const educations = useResumeStore.getState().educations;
      const skills = useResumeStore.getState().skills;
      const projects = useResumeStore.getState().projects;
      const certifications = useResumeStore.getState().certifications;
      const templateId = useResumeStore.getState().selectedTemplateId;

      const displayFirst = personalInfo.firstName || "Alexandra";
      const displayLast = personalInfo.surname || "Chen";
      const displayEmail = personalInfo.email || "alexandra.chen@email.com";
      const displayPhone = personalInfo.phone || "+1 (415) 892-3041";
      const displayLocation = (personalInfo.city || personalInfo.country)
        ? `${personalInfo.city || ""}${personalInfo.city && personalInfo.country ? ", " : ""}${personalInfo.country || ""}`
        : "San Francisco, CA";

      const displayTitle = experiences[0]?.role || "Principal Software Engineer & Technical Lead";
      const displayTagline = "Building systems at scale — from 0 to 200 million users";

      const displaySummary = summary || "Principal Engineer with 11 years of experience designing distributed systems and leading cross-functional teams at Google, Stripe, and Series-B startups. Specialize in high-throughput backend architecture, platform reliability, and translating ambiguous product vision into precise technical roadmaps.";

      const displayExperiences = experiences.length > 0 ? experiences : [
        {
          id: "mock-exp-1",
          role: "Principal Software Engineer — Technical Lead",
          company: "Stripe, Inc.",
          location: "San Francisco, CA",
          startDate: { month: 1, year: 2021 },
          endDate: { month: null, year: null },
          isCurrent: true,
          description: "Architected Stripe's next-generation payment routing engine, reducing transaction latency by 42% and saving $18M annually.\nLed a 14-engineer team through a 9-month migration from monolith to event-driven microservices.\nDesigned the fraud detection ML pipeline processing 4.2M events/sec."
        }
      ];

      const displayEducations = educations.length > 0 ? educations : [
        {
          id: "mock-edu-1",
          degree: "M.S. Computer Science",
          fieldOfStudy: "Distributed Systems",
          institution: "Stanford University",
          startDate: { month: 9, year: 2010 },
          endDate: { month: 6, year: 2014 },
          grade: "3.92 GPA",
          isCurrent: false,
          description: "Thesis: Adaptive Consistency Models for Geo-Replicated Key-Value Stores."
        }
      ];

      const displaySkills = (skills.length > 0 ? skills : [
        { id: "mock-sk-1", name: "Go", category: "Languages" },
        { id: "mock-sk-2", name: "Python", category: "Languages" }
      ]) as any[];

      const displayProjects = projects.length > 0 ? projects : [
        {
          id: "mock-proj-1",
          name: "OpenFlux — Open-Source Workflow Orchestrator",
          role: "Personal / Open Source",
          description: "A lightweight, dependency-free task orchestration engine for Python with first-class async support. Garnered 6.2k GitHub stars and 340+ forks.",
          technologies: ["Python", "asyncio", "Redis", "Docker"]
        }
      ];

      const displayCertifications = certifications.length > 0 ? certifications : [
        {
          id: "mock-cert-1",
          name: "AWS Solutions Architect — Professional",
          organization: "Amazon Web Services"
        }
      ];

      const accentColorHex = selectedColor.replace("#", "");

      // Helper to group skills by category
      const groupedSkills: { [key: string]: typeof displaySkills } = {};
      displaySkills.forEach((sk) => {
        const cat = sk.category || "General";
        if (!groupedSkills[cat]) {
          groupedSkills[cat] = [];
        }
        groupedSkills[cat].push(sk);
      });

      let doc: any;

      if (templateId === 2) {
        // ─── TEMPLATE 2: BLUEPRINT 2-COLUMN SIDEBAR LAYOUT ───
        const headerTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.SINGLE, size: 24, color: accentColorHex },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  shading: { fill: "0F1923" },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 40 },
                      children: [
                        new TextRun({ text: `${displayFirst} ${displayLast}`.toUpperCase(), bold: true, size: 32, color: "FFFFFF", font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: displayTitle.toUpperCase(), bold: true, size: 16, color: accentColorHex, font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      spacing: { before: 0, after: 60 },
                      children: [
                        new TextRun({ text: displayTagline, italics: true, size: 14, color: "A8BDCD", font: "Arial" })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  shading: { fill: "0F1923" },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Email: ", bold: true, size: 13, color: accentColorHex, font: "Arial" }),
                        new TextRun({ text: displayEmail, size: 13, color: "FFFFFF", font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Phone: ", bold: true, size: 13, color: accentColorHex, font: "Arial" }),
                        new TextRun({ text: displayPhone, size: 13, color: "FFFFFF", font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Location: ", bold: true, size: 13, color: accentColorHex, font: "Arial" }),
                        new TextRun({ text: displayLocation, size: 13, color: "FFFFFF", font: "Arial" })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });

        const sidebarElements: any[] = [];
        if (displaySkills.length > 0) {
          sidebarElements.push(
            new Paragraph({
              spacing: { before: 100, after: 80 },
              children: [new TextRun({ text: "━  SKILLS", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            })
          );
          Object.keys(groupedSkills).forEach((cat) => {
            sidebarElements.push(
              new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [new TextRun({ text: cat.toUpperCase(), bold: true, size: 12, color: "A8BDCD", font: "Arial" })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [new TextRun({ text: groupedSkills[cat].map((sk) => sk.name).join(", "), size: 13, color: "EEF2F6", font: "Arial" })]
              })
            );
          });
        }

        if (displayCertifications.length > 0) {
          sidebarElements.push(
            new Paragraph({
              spacing: { before: 120, after: 80 },
              children: [new TextRun({ text: "━  CERTIFICATIONS", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            })
          );
          displayCertifications.forEach((cert: any) => {
            sidebarElements.push(
              new Paragraph({
                spacing: { before: 40, after: 20 },
                children: [new TextRun({ text: cert.name, bold: true, size: 13, color: "EEF2F6", font: "Arial" })]
              }),
              cert.organization ? new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: cert.organization, size: 11, color: "A8BDCD", font: "Arial" })]
              }) : new Paragraph({ children: [] })
            );
          });
        }

        const mainElements: any[] = [];
        if (displaySummary) {
          mainElements.push(
            new Paragraph({
              spacing: { before: 100, after: 60 },
              children: [new TextRun({ text: "♦  PROFILE", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            }),
            new Paragraph({
              spacing: { before: 0, after: 120 },
              children: [new TextRun({ text: displaySummary, size: 14, color: "4A5E72", font: "Arial" })]
            })
          );
        }

        if (displayExperiences.length > 0) {
          mainElements.push(
            new Paragraph({
              spacing: { before: 120, after: 80 },
              children: [new TextRun({ text: "♦  EXPERIENCE", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            })
          );
          displayExperiences.forEach((exp: any) => {
            const dateStart = formatMonthYear(exp.startDate);
            const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
            const dateString = `${dateStart} — ${dateEnd}`;
            const bulletParagraphs: any[] = [];
            if (exp.description) {
              exp.description.split("\n").forEach((line: string) => {
                const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                if (!clean) return;
                bulletParagraphs.push(
                  new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [new TextRun({ text: `—  ${clean}`, size: 13, color: "4A5E72", font: "Arial" })]
                  })
                );
              });
            }
            mainElements.push(
              new Paragraph({
                spacing: { before: 60, after: 20 },
                children: [new TextRun({ text: exp.role, bold: true, size: 15, color: "111820", font: "Arial" })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: `${exp.company}  ·  ${exp.location}    (${dateString})`, size: 12, color: "7A8FA3", font: "Arial" })]
              }),
              ...bulletParagraphs,
              new Paragraph({ spacing: { before: 40, after: 0 }, children: [] })
            );
          });
        }

        if (displayProjects.length > 0) {
          mainElements.push(
            new Paragraph({
              spacing: { before: 120, after: 80 },
              children: [new TextRun({ text: "♦  NOTABLE PROJECTS", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            })
          );
          displayProjects.forEach((proj: any) => {
            mainElements.push(
              new Paragraph({
                spacing: { before: 60, after: 20 },
                children: [new TextRun({ text: proj.name, bold: true, size: 14, color: "111820", font: "Arial" })]
              }),
              proj.role ? new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: proj.role, size: 12, color: "7A8FA3", font: "Arial" })]
              }) : new Paragraph({ children: [] }),
              proj.description ? new Paragraph({
                spacing: { before: 20, after: 40 },
                children: [new TextRun({ text: proj.description, size: 13, color: "4A5E72", font: "Arial" })]
              }) : new Paragraph({ children: [] }),
              new Paragraph({ spacing: { before: 40, after: 0 }, children: [] })
            );
          });
        }

        if (displayEducations.length > 0) {
          mainElements.push(
            new Paragraph({
              spacing: { before: 120, after: 80 },
              children: [new TextRun({ text: "♦  EDUCATION", bold: true, size: 16, color: accentColorHex, font: "Arial" })]
            })
          );
          displayEducations.forEach((edu: any) => {
            const dateStart = formatMonthYear(edu.startDate);
            const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
            mainElements.push(
              new Paragraph({
                spacing: { before: 60, after: 20 },
                children: [new TextRun({ text: `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}`, bold: true, size: 14, color: "111820", font: "Arial" })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: `${edu.institution}    (${dateStart} — ${dateEnd})`, size: 12, color: "7A8FA3", font: "Arial" })]
              }),
              edu.description ? new Paragraph({
                spacing: { before: 20, after: 40 },
                children: [new TextRun({ text: edu.description, size: 13, color: "4A5E72", font: "Arial" })]
              }) : new Paragraph({ children: [] }),
              new Paragraph({ spacing: { before: 40, after: 0 }, children: [] })
            );
          });
        }

        const bodyTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  shading: { fill: "233142" },
                  margins: { top: 240, bottom: 240, left: 240, right: 240 },
                  children: sidebarElements
                }),
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  margins: { top: 240, bottom: 240, left: 300, right: 240 },
                  children: mainElements
                })
              ]
            })
          ]
        });

        doc = new Document({
          sections: [{
            properties: {
              page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 0, bottom: 0, left: 0, right: 0 }
              }
            },
            children: [headerTable, bodyTable]
          }]
        });
      } else {
        // ─── TEMPLATE 1: SINGLE-COLUMN COPPER HAIRLINE LAYOUT ───
        const createSectionHeader = (title: string) => {
          return new Paragraph({
            spacing: { before: 180, after: 120 },
            border: {
              left: { color: accentColorHex, style: BorderStyle.SINGLE, size: 24, space: 6 }
            },
            children: [
              new TextRun({
                text: `   ${title.toUpperCase()}`,
                bold: true,
                size: 20,
                color: "0D1B2A",
                font: "Arial"
              })
            ]
          });
        };

        const headerTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "auto" },
            bottom: { style: BorderStyle.SINGLE, size: 18, color: accentColorHex },
            left: { style: BorderStyle.NONE, size: 0, color: "auto" },
            right: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 70, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      spacing: { before: 0, after: 40 },
                      children: [
                        new TextRun({
                          text: `${displayFirst} ${displayLast}`.toUpperCase(),
                          bold: true,
                          size: 36,
                          color: "0D1B2A",
                          font: "Arial"
                        })
                      ]
                    }),
                    new Paragraph({
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({
                          text: displayTitle.toUpperCase(),
                          bold: true,
                          size: 16,
                          color: accentColorHex,
                          font: "Arial"
                        })
                      ]
                    }),
                    new Paragraph({
                      spacing: { before: 0, after: 100 },
                      children: [
                        new TextRun({
                          text: displayTagline,
                          italics: true,
                          size: 14,
                          color: "718096",
                          font: "Arial"
                        })
                      ]
                    })
                  ]
                }),
                new TableCell({
                  width: { size: 30, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Email: ", bold: true, size: 13, color: "0d1b2a", font: "Arial" }),
                        new TextRun({ text: displayEmail, size: 13, color: "4b5563", font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Phone: ", bold: true, size: 13, color: "0d1b2a", font: "Arial" }),
                        new TextRun({ text: displayPhone, size: 13, color: "4b5563", font: "Arial" })
                      ]
                    }),
                    new Paragraph({
                      alignment: AlignmentType.RIGHT,
                      spacing: { before: 0, after: 30 },
                      children: [
                        new TextRun({ text: "Location: ", bold: true, size: 13, color: "0d1b2a", font: "Arial" }),
                        new TextRun({ text: displayLocation, size: 13, color: "4b5563", font: "Arial" })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });

        const docChildren: any[] = [headerTable];

        if (displaySummary) {
          docChildren.push(
            createSectionHeader("Professional Summary"),
            new Paragraph({
              spacing: { before: 40, after: 120 },
              children: [
                new TextRun({
                  text: displaySummary,
                  size: 16,
                  color: "4A5568",
                  font: "Arial"
                })
              ]
            })
          );
        }

        if (displayExperiences.length > 0) {
          docChildren.push(createSectionHeader("Experience"));
          displayExperiences.forEach((exp: any) => {
            const dateStart = formatMonthYear(exp.startDate);
            const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
            const dateString = exp.isCurrent ? `Present\n${dateStart}` : `${dateEnd}\n${dateStart}`;

            const entryChildren: any[] = [
              new Paragraph({
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: exp.role,
                    bold: true,
                    size: 16,
                    color: "2D3748",
                    font: "Arial"
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: `${exp.company}  ·  ${exp.location}`,
                    size: 14,
                    color: "718096",
                    font: "Arial"
                  })
                ]
              })
            ];

            if (exp.description) {
              exp.description.split("\n").forEach((line: string) => {
                const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                if (!clean) return;
                entryChildren.push(
                  new Paragraph({
                    spacing: { before: 20, after: 20 },
                    children: [
                      new TextRun({
                        text: `▸  ${clean}`,
                        size: 14,
                        color: "4A5568",
                        font: "Arial"
                      })
                    ]
                  })
                );
              });
            }

            const entryTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: dateString,
                              bold: true,
                              size: 14,
                              color: accentColorHex,
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      margins: { left: 144 },
                      borders: {
                        left: { style: BorderStyle.SINGLE, size: 12, color: "E2D9CE" }
                      },
                      children: entryChildren
                    })
                  ]
                })
              ]
            });

            docChildren.push(
              entryTable,
              new Paragraph({ spacing: { before: 80, after: 0 }, children: [] })
            );
          });
        }

        if (displayProjects.length > 0) {
          docChildren.push(createSectionHeader("Notable Projects"));
          displayProjects.forEach((proj: any) => {
            const entryChildren: any[] = [
              new Paragraph({
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: proj.name,
                    bold: true,
                    size: 16,
                    color: "2D3748",
                    font: "Arial"
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 60 },
                children: [
                  new TextRun({
                    text: proj.role || "Personal Project",
                    size: 14,
                    color: "718096",
                    font: "Arial"
                  })
                ]
              })
            ];

            if (proj.description) {
              entryChildren.push(
                new Paragraph({
                  spacing: { before: 20, after: 40 },
                  children: [
                    new TextRun({
                      text: proj.description,
                      size: 14,
                      color: "4A5568",
                      font: "Arial"
                    })
                  ]
                })
              );
            }

            if (proj.technologies && proj.technologies.length > 0) {
              entryChildren.push(
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: `Stack: ${proj.technologies.join(", ")}`,
                      bold: true,
                      size: 12,
                      color: "2D3748",
                      font: "Arial"
                    })
                  ]
                })
              );
            }

            const entryTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: "Project",
                              bold: true,
                              size: 14,
                              color: accentColorHex,
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      margins: { left: 144 },
                      borders: {
                        left: { style: BorderStyle.SINGLE, size: 12, color: "E2D9CE" }
                      },
                      children: entryChildren
                    })
                  ]
                })
              ]
            });

            docChildren.push(
              entryTable,
              new Paragraph({ spacing: { before: 80, after: 0 }, children: [] })
            );
          });
        }

        if (displayEducations.length > 0) {
          docChildren.push(createSectionHeader("Education"));
          displayEducations.forEach((edu: any) => {
            const dateStart = formatMonthYear(edu.startDate);
            const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);

            const entryChildren = [
              new Paragraph({
                spacing: { before: 0, after: 30 },
                children: [
                  new TextRun({
                    text: `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}`,
                    bold: true,
                    size: 16,
                    color: "2D3748",
                    font: "Arial"
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [
                  new TextRun({
                    text: edu.institution,
                    size: 14,
                    color: "718096",
                    font: "Arial"
                  })
                ]
              })
            ];

            if (edu.description) {
              entryChildren.push(
                new Paragraph({
                  spacing: { before: 20, after: 20 },
                  children: [
                    new TextRun({
                      text: edu.description,
                      size: 14,
                      color: "4A5568",
                      font: "Arial"
                    })
                  ]
                })
              );
            }

            const entryTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: `${dateEnd}\n${dateStart}`,
                              bold: true,
                              size: 14,
                              color: accentColorHex,
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      margins: { left: 144 },
                      borders: {
                        left: { style: BorderStyle.SINGLE, size: 12, color: "E2D9CE" }
                      },
                      children: entryChildren
                    })
                  ]
                })
              ]
            });

            docChildren.push(
              entryTable,
              new Paragraph({ spacing: { before: 80, after: 0 }, children: [] })
            );
          });
        }

        if (displaySkills.length > 0) {
          docChildren.push(createSectionHeader("Skills"));
          Object.keys(groupedSkills).forEach((cat) => {
            const skillsListString = groupedSkills[cat].map((sk) => sk.name).join(", ");
            const entryTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: cat,
                              bold: true,
                              size: 14,
                              color: accentColorHex,
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      margins: { left: 144 },
                      borders: {
                        left: { style: BorderStyle.SINGLE, size: 12, color: "E2D9CE" }
                      },
                      children: [
                        new Paragraph({
                          spacing: { before: 0, after: 30 },
                          children: [
                            new TextRun({
                              text: skillsListString,
                              size: 14,
                              color: "4A5568",
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            });

            docChildren.push(
              entryTable,
              new Paragraph({ spacing: { before: 40, after: 0 }, children: [] })
            );
          });
        }

        if (displayCertifications.length > 0) {
          docChildren.push(createSectionHeader("Certifications"));
          displayCertifications.forEach((cert: any) => {
            const entryTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "auto" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
                left: { style: BorderStyle.NONE, size: 0, color: "auto" },
                right: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          children: [
                            new TextRun({
                              text: "Award",
                              bold: true,
                              size: 14,
                              color: accentColorHex,
                              font: "Arial"
                            })
                          ]
                        })
                      ]
                    }),
                    new TableCell({
                      width: { size: 80, type: WidthType.PERCENTAGE },
                      margins: { left: 144 },
                      borders: {
                        left: { style: BorderStyle.SINGLE, size: 12, color: "E2D9CE" }
                      },
                      children: [
                        new Paragraph({
                          spacing: { before: 0, after: 30 },
                          children: [
                            new TextRun({
                              text: cert.name,
                              bold: true,
                              size: 14,
                              color: "2D3748",
                              font: "Arial"
                            }),
                            cert.organization ? new TextRun({
                              text: `  —  ${cert.organization}`,
                              size: 14,
                              color: "718096",
                              font: "Arial"
                            }) : new TextRun({ text: "" })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            });

            docChildren.push(
              entryTable,
              new Paragraph({ spacing: { before: 40, after: 0 }, children: [] })
            );
          });
        }

        doc = new Document({
          sections: [{
            properties: {
              page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
              }
            },
            children: docChildren
          }]
        });
      }

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${displayFirst}_${displayLast}_Resume.docx`);
      toast.success("Success ✓", "Your DOCX resume has been downloaded!");
      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Export Failed", "Could not generate DOCX.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    setIsExportModalOpen(false);
    toast.success("Opening Print Menu...", "Select Print to PDF in your system settings.");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (isCheckingAuth) {
    return (
      <div className={styles.page}>
        <HomeBackdrop />
        <Navbar activePage="resume-builder" />
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500 mb-4" />
          <p className="font-display text-xs text-gray-400">Loading your profile data...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="resume-builder" />

      <main className={styles.workspace}>
        {/* Step 1-7 Sidebar (Left) */}
        <StepSidebar />

        {/* Form Panel (Center) */}
        <div className={styles.formPanel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="flex-1">{renderActiveStep()}</div>
              <StepNavigation onFinish={handleFinish} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Preview Panel (Right) */}
        <LivePreviewPanel />
      </main>
      <SiteFooter />

      {/* Glassmorphic Export Options Modal */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center backdrop-blur-md p-4 animate-fadeIn">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl text-white flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
                <h3 className="font-display font-bold text-lg text-white">Export Resume</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col gap-4">
                <p className="text-xs text-gray-400 font-sans mb-2">
                  Select your preferred export layout format below. All exports will incorporate your chosen custom colors.
                </p>

                {/* Option 1: PDF */}
                <button
                  type="button"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#27272a] bg-[#141416] hover:bg-[#18181b] hover:border-cyan-500 transition-all text-left group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
                    <FileDown size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Download PDF</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">High-quality vector layout (PDF)</div>
                  </div>
                </button>

                {/* Option 2: DOCX */}
                <button
                  type="button"
                  onClick={handleExportDOCX}
                  disabled={isExporting}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#27272a] bg-[#141416] hover:bg-[#18181b] hover:border-purple-500 transition-all text-left group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                    <FileText size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Download DOCX</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Fully editable Word format (Word/Docx)</div>
                  </div>
                </button>

                {/* Option 3: Print */}
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={isExporting}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#27272a] bg-[#141416] hover:bg-[#18181b] hover:border-gray-500 transition-all text-left group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 group-hover:scale-105 transition-transform">
                    <Printer size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Print Document</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Open browser print window</div>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#27272a] bg-[#111113] flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  onClick={() => setIsExportModalOpen(false)}
                  disabled={isExporting}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
