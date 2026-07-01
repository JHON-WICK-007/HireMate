"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
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

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function ResumeBuilderPage() {
  const router = useRouter();
  const toast = useToast();
  const currentStep = useResumeStore((state) => state.currentStep);
  const selectedColor = useResumeStore((state) => state.selectedColor);
  const actions = useResumeStore((state) => state.actions);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // ── Load from cache BEFORE browser paints (no flicker) ──
  useLayoutEffect(() => {
    const cachedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token && cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        actions.loadFromProfile(user);
        setIsCheckingAuth(false);
      } catch (e) { }
    }
  }, [actions]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication Required", "Please log in or sign up to access the Resume Builder.");
      router.push("/auth?mode=signin&redirect=/resume-builder");
      return;
    }

    // Prefill from cache first
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        const user = JSON.parse(cachedUser);
        actions.loadFromProfile(user);
        setIsCheckingAuth(false);
      } catch (e) { }
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
          if (data.user.fullName || data.user.email || data.user.phone || data.user.bio) {
            const alreadyShown = sessionStorage.getItem("resume_autofill_toast_shown");
            if (!alreadyShown) {
              toast.success("Profile Autofilled", "Resume fields loaded from your profile.");
              sessionStorage.setItem("resume_autofill_toast_shown", "true");
            }
          }
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
  }, [router, actions]);

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
    handleExportPDF();
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

      // Clone the element to manipulate without affecting the live preview DOM
      const clone = element.cloneNode(true) as HTMLElement;

      // Extract the CSS content from the <style> tag before removing it
      const styleEl = element.querySelector("style");
      const cssContent = styleEl?.innerHTML || "";

      // Strip <link> and <style> tags from the clone — they move to <head>
      clone.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach((el) => el.remove());
      clone.querySelectorAll("style").forEach((el) => el.remove());

      // Google Fonts <link> per template
      let googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">`;
      if (templateId === 2) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">`;
      } else if (templateId === 4) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">`;
      } else if (templateId === 6) {
        googleFontsLink = `<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">`;
      }

      const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ${googleFontsLink}
  <style>
    @page { size: A4; margin: 0; }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background: #FFFFFF;
    }

    /* Force colour rendering on every element for print */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    /* Break-inside control for clean page breaks */
    .resume-container .resume-section,
    .resume-container .content-section,
    .resume-container .entry {
      break-inside: avoid;
    }

    /* Template CSS extracted from preview component */
    ${cssContent}
  </style>
</head>
<body>
  ${clone.innerHTML}
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
    } catch (err) {
      console.error(err);
      toast.error("Export Failed", "Could not render PDF document.");
    } finally {
      setIsExporting(false);
    }
  };


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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              style={{ display: "flex", flexDirection: "column", flex: 1 }}
            >
              <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                {renderActiveStep()}
              </motion.div>
              <StepNavigation onFinish={handleFinish} isLoading={isExporting} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Preview Panel (Right) */}
        <LivePreviewPanel />
      </main>
      <SiteFooter />
    </div>
  );
}
