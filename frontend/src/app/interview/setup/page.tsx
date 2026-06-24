"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import ThemeToggle from "../../components/ThemeToggle";
import { useToast } from "../../components/Toast";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Inline SVG Icons ─────────────────────────────────────────
const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconLayout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const IconTimerShort = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="15" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

const IconClockStandard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 12" />
  </svg>
);

const IconHourglassDetailed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M5 2h14" />
    <path d="M5 22h14" />
    <path d="M19 2v4c0 3.3-2.7 6-6 6h-2c-3.3 0-6-2.7-6-6V2" />
    <path d="M5 22v-4c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v4" />
  </svg>
);

const IconTerminal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const IconDatabase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconCaseStudy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const companyActiveClasses: Record<string, string> = {
  Google: styles.logoGoogleActive,
  Amazon: styles.logoAmazonActive,
  Microsoft: styles.logoMicrosoftActive,
  Meta: styles.logoMetaActive,
  Netflix: styles.logoNetflixActive,
  Apple: styles.logoAppleActive,
  Uber: styles.logoUberActive,
  TCS: styles.logoTCSActive,
  Infosys: styles.logoInfosysActive,
  Accenture: styles.logoAccentureActive,
};

const renderCompanyLogo = (company: string) => {
  switch (company) {
    case "Google":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#4285F4", fontFamily: "'Product Sans', sans-serif" }}>Google</span>
        </div>
      );
    case "Amazon":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "sans-serif" }}>amazon</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color: "#ff9900", marginTop: "4px" }}>
            <path d="M15.93 17.13c-1.16.8-2.7 1.17-4.22 1.17-2.5 0-4.66-1.03-5.63-2.67-.14-.23-.03-.43.2-.3l2.84 1.65c.18.1.33.02.43-.13.5-1.03 1.68-1.57 2.76-1.57 1.18 0 2.23.53 2.62 1.57.06.18.2.22.36.1l2.55-1.7c.18-.1.2-.32.06-.48-1.5-1.9-4.07-2.8-6.66-2.8-3.3 0-6.13 1.56-7.23 4.25-.13.3.06.6.35.48a17.27 17.27 0 0111.43-1.03c.2.06.33-.12.16-.27z" fill="currentColor" />
            <path d="M18.8 13.9a17.1 17.1 0 00.93-3.23c.08-.4-.25-.66-.6-.48a20.2 20.2 0 01-3.66 1.25c-.38.07-.46.43-.13.62.96.53 2.1 1.26 3.08 2 .18.12.33.03.38-.16z" fill="#FF9900" />
          </svg>
        </div>
      );
    case "Microsoft":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 23 23" style={{ flexShrink: 0 }}>
            <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
            <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
            <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
            <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "'Segoe UI', sans-serif" }}>Microsoft</span>
        </div>
      );
    case "TCS":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="24" height="20" viewBox="0 0 90 50" fill="none" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="tcsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9F00" />
                <stop offset="30%" stopColor="#E50914" />
                <stop offset="60%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#7000FF" />
              </linearGradient>
            </defs>
            {/* t */}
            <path d="M 12 8 L 12 36 C 12 42 18 44 22 44 C 26 44 28 40 28 36" stroke="url(#tcsGrad)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 5 18 L 22 18" stroke="url(#tcsGrad)" strokeWidth="6.5" strokeLinecap="round" />
            {/* c */}
            <path d="M 54 18 C 48 12 36 14 36 26 C 36 38 48 40 54 34" stroke="url(#tcsGrad)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* s */}
            <path d="M 80 16 C 74 10 64 16 64 24 C 64 32 80 30 80 38 C 80 44 72 46 66 40" stroke="url(#tcsGrad)" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontWeight: "800",
            fontSize: "0.95rem",
            background: "linear-gradient(135deg, #FF9F00 0%, #D946EF 50%, #7000FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "sans-serif",
            letterSpacing: "0.02em"
          }}>TCS</span>
        </div>
      );
    case "Infosys":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{
            fontWeight: "600",
            fontSize: "0.95rem",
            color: "#1970C2",
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.01em"
          }}>Infosys</span>
        </div>
      );
    case "Accenture":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 4l8 8-8 8" stroke="#a100ff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#a100ff", fontFamily: "sans-serif" }}>accenture</span>
        </div>
      );
    case "Meta":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M16.03 6C14.18 6 12.56 6.94 11.53 8.39 10.5 6.94 8.88 6 7.03 6 3.61 6 .49 9.12.49 13s3.12 7 6.54 7c1.85 0 3.47-.94 4.5-2.39.11-.15.21-.31.31-.48.1.17.2.33.31.48 1.03 1.45 2.65 2.39 4.5 2.39 3.42 0 6.54-3.12 6.54-7 0-3.88-3.12-7-6.54-7zm-9 11.5c-2.48 0-4.54-2.02-4.54-4.5S4.55 8.5 7.03 8.5c1.47 0 2.78.71 3.59 1.82a6.38 6.38 0 00-.61 2.68c0 1 .22 1.95.61 2.68-.81 1.11-2.12 1.82-3.59 1.82zm9 0c-1.47 0-2.78-.71-3.59-1.82.39-.73.61-1.68.61-2.68 0-1-.22-1.95-.61-2.68.81-1.11 2.12-1.82 3.59-1.82 2.48 0 4.54 2.02 4.54 4.5s-2.06 4.5-4.54 4.5z" fill="#0064E0" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#0064E0", fontFamily: "sans-serif" }}>Meta</span>
        </div>
      );
    case "Netflix":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#E50914" style={{ flexShrink: 0 }}>
            <path d="M5.5 0H8.8L15.3 16.7V0H18.5V24H15.2L8.7 7.3V24H5.5V0Z" />
          </svg>
          <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#E50914", fontFamily: "sans-serif", letterSpacing: "-0.02em" }}>Netflix</span>
        </div>
      );
    case "Apple":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.31.12.52.12.8 0 1.64-.47 2.3-1.45" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "sans-serif" }}>Apple</span>
        </div>
      );
    case "Uber":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 3v9c0 3.87 3.13 7 7 7s7-3.13 7-7V3h-3v9c0 2.21-1.79 4-4 4s-4-1.79-4-4V3H5z" fill="#ffffff" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#ffffff", fontFamily: "sans-serif", letterSpacing: "-0.03em" }}>Uber</span>
        </div>
      );
    case "Custom":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-primary)" }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)" }}>Custom</span>
        </div>
      );
    default:
      return null;
  }
};

const IconBackend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const IconFrontend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconFullStack = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconDevOps = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconDataAnalyst = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconMobile = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconBug = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="8" y="2" width="8" height="14" rx="4" />
    <line x1="6" y1="19" x2="8" y2="15" />
    <line x1="6" y1="11" x2="8" y2="11" />
    <line x1="6" y1="7" x2="8" y2="8" />
    <line x1="18" y1="19" x2="16" y2="15" />
    <line x1="18" y1="11" x2="16" y2="11" />
    <line x1="18" y1="7" x2="16" y2="8" />
  </svg>
);

const IconCompass = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconSecurity = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconAI = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconLevelBars = ({ level }: { level: number }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ flexShrink: 0 }}>
    <rect x="2" y="16" width="3.5" height="5" rx="0.75" opacity={level >= 1 ? 1 : 0.25} />
    <rect x="7.5" y="11" width="3.5" height="10" rx="0.75" opacity={level >= 2 ? 1 : 0.25} />
    <rect x="13" y="6" width="3.5" height="15" rx="0.75" opacity={level >= 3 ? 1 : 0.25} />
    <rect x="18.5" y="1" width="3.5" height="20" rx="0.75" opacity={level >= 4 ? 1 : 0.25} />
  </svg>
);

const getRoleAvatar = (role: string) => {
  switch (role) {
    case "Backend developer":
      return <IconBackend />;
    case "Frontend developer":
      return <IconFrontend />;
    case "Full stack":
      return <IconFullStack />;
    case "DevOps":
      return <IconDevOps />;
    case "Data analyst":
      return <IconDataAnalyst />;
    case "Mobile developer":
      return <IconMobile />;
    case "QA engineer":
      return <IconBug />;
    case "Product manager":
      return <IconCompass />;
    case "Security engineer":
      return <IconSecurity />;
    case "AI / ML engineer":
      return <IconAI />;
    default:
      return null;
  }
};

const getLevelAvatar = (level: string) => {
  switch (level) {
    case "Fresher":
      return <IconLevelBars level={1} />;
    case "1–3 years":
      return <IconLevelBars level={2} />;
    case "3–5 years":
      return <IconLevelBars level={3} />;
    case "5+ years":
      return <IconLevelBars level={4} />;
    default:
      return null;
  }
};

export default function SetupPage() {
  const router = useRouter();
  const toast = useToast();

  // User Profile information for Navbar
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  // Setup options
  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Apple", "Uber", "TCS", "Infosys", "Accenture", "Custom"];
  const roles = [
    "Backend developer",
    "Frontend developer",
    "Full stack",
    "Mobile developer",
    "DevOps",
    "QA engineer",
    "Product manager",
    "Security engineer",
    "Data analyst",
    "AI / ML engineer"
  ];
  const experienceLevels = ["Fresher", "1–3 years", "3–5 years", "5+ years"];
  const durations = [
    { label: "Short (5 questions)", value: 5, icon: <IconTimerShort /> },
    { label: "Standard (10 questions)", value: 10, icon: <IconClockStandard /> },
    { label: "Detailed (15 questions)", value: 15, icon: <IconHourglassDetailed /> }
  ];

  const [selectedCompany, setSelectedCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const isCompanySelected = selectedCompany === "Custom" ? !!customCompany.trim() : !!selectedCompany;

  // Calculate completed sections count
  const completedSections = [
    isCompanySelected,
    !!selectedRole,
    !!selectedLevel,
    selectedQuestionTypes.length > 0,
    !!selectedDuration
  ].filter(Boolean).length;

  const progressColor =
    completedSections === 1
      ? "#ef4444"
      : completedSections === 2
      ? "#f97316"
      : completedSections === 3
      ? "#fbbf24"
      : completedSections === 4
      ? "#10b981"
      : completedSections === 5
      ? "#22c55e"
      : "var(--text-muted)";

  // Scroll logic for navbar
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setNavHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch authentication and user details
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setAvatar(data.user.avatar || "");
          setFullName(data.user.fullName || "");
          const initials = data.user.fullName
            ? data.user.fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
            : "U";
          setUserInitials(initials);
        } else {
          localStorage.removeItem("token");
          router.push("/auth?mode=signin");
        }
      })
      .catch(() => {
        toast.error("Failed to authenticate session.");
      });
  }, []);

  // Toggle Type Selection
  const toggleQuestionType = (type: string) => {
    if (selectedQuestionTypes.includes(type)) {
      if (selectedQuestionTypes.length > 1) {
        setSelectedQuestionTypes((p) => p.filter((t) => t !== type));
      } else {
        toast.error("Please select at least one question type.");
      }
    } else {
      setSelectedQuestionTypes((p) => [...p, type]);
    }
  };

  // Start Session API and Redirect
  const startInterview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsStartingSession(true);
    try {
      const res = await fetch(`${API_URL}/api/interviews/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: selectedCompany === "Custom" ? customCompany.trim() : selectedCompany,
          role: selectedRole,
          level: selectedLevel,
          questionTypes: selectedQuestionTypes,
          totalQuestions: selectedDuration || 5,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect directly to the live interview screen with the new interview session ID
        router.push(`/interview/live-interview?id=${data.interviewId}`);
      } else {
        toast.error(data.message || "Failed to initialize interview.");
      }
    } catch (err) {
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsStartingSession(false);
    }
  };

  return (
    <div className={styles.page}>
      <HomeBackdrop />

      {/* ── Navbar ── */}
      <nav className={`${nav.nav} ${scrolled ? nav.navScrolled : ""} ${navHidden ? nav.navHidden : ""}`}>
        <div className={nav.navInner}>
          <Link href="/" className={nav.navLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#navGrad)" />
              <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8" />
              <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="var(--logo-grad-start)" />
                  <stop offset="1" stopColor="var(--logo-grad-end)" />
                </linearGradient>
              </defs>
            </svg>
            <span>HireMate AI</span>
          </Link>

          <div className={nav.navLinks}>
            <Link href="/resume" className={nav.navLink}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={`${nav.navLink} ${nav.navActive || ""}`} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.navLink}>Profile</Link>
          </div>

          <div className={nav.navActions}>
            <ThemeToggle />
            <Link href="/profile" className={nav.navBtnGhost} style={{ paddingLeft: "6px", paddingRight: "16px" }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--border-default)",
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
                    color: "var(--text-primary)",
                  }}
                >
                  {userInitials}
                </div>
              )}
              <span>{fullName ? fullName.split(" ")[0] : "Profile"}</span>
            </Link>
          </div>

          <button className={nav.hamburger} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen1 : ""}`} />
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen2 : ""}`} />
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {mobileMenu && (
          <div className={nav.mobileMenu}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span className={nav.mobileLink} style={{ margin: 0 }}>Theme</span>
              <ThemeToggle />
            </div>
            <div className={nav.mobileDivider} />
            <Link href="/resume" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={nav.mobileLink} onClick={() => setMobileMenu(false)} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {/* ── Main Layout Content ── */}
      <main className={styles.layout}>
        <div className={styles.consoleCard}>


          <div className={styles.setupBody}>
            <div className={styles.setupTitle}>Start a mock interview</div>
            <div className={styles.setupSub}>Configure your session and the AI interviewer will ask role-specific questions and evaluate your answers.</div>

            {/* Stepper / Progress Bar */}
            <div className={styles.topProgress}>
              <div className={styles.topProgressText}>
                <span>Configuration Progress</span>
                <span className={styles.topProgressCount} style={{ color: progressColor }}>
                  {completedSections}/5
                </span>
              </div>
              <div className={styles.topProgressBar}>
                <div
                  className={styles.topProgressFill}
                  style={{
                    width: `${(completedSections / 5) * 100}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #f97316 50%, #22c55e 100%)",
                    boxShadow: completedSections > 0 ? `0 0 10px ${progressColor}` : "none",
                  }}
                />
              </div>
            </div>

            <div className={styles.setupGrid}>
              <div className={styles.setupForm}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Company</span>
                  <div className={styles.logoWall}>
                    {companies.map((c) => {
                      const isActive = selectedCompany === c;
                      const activeClass = isActive ? (companyActiveClasses[c] || styles.logoItemActive) : "";
                      return (
                        <div
                          key={c}
                          className={`${styles.logoItem} ${activeClass}`}
                          onClick={() => {
                            if (selectedCompany === c) {
                              setSelectedCompany("");
                              if (c === "Custom") setCustomCompany("");
                            } else {
                              setSelectedCompany(c);
                            }
                          }}
                        >
                          {renderCompanyLogo(c)}
                        </div>
                      );
                    })}
                  </div>

                  {selectedCompany === "Custom" && (
                    <div style={{ marginTop: "1rem", width: "100%", maxWidth: "320px" }}>
                      <input
                        type="text"
                        placeholder="Enter custom company name..."
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.85rem",
                          borderRadius: "var(--radius-sm)",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          color: "var(--text-primary)",
                          fontSize: "0.85rem",
                          outline: "none",
                          transition: "all var(--transition-fast)",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(16, 185, 129, 0.5)";
                          e.target.style.boxShadow = "0 0 10px rgba(16, 185, 129, 0.15)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Role</span>
                  <div className={styles.chipGroup}>
                    {roles.map((r) => (
                      <span key={r} className={`${styles.chip} ${selectedRole === r ? styles.chipSelectedRole : ""}`} onClick={() => setSelectedRole(r)}>
                        {getRoleAvatar(r)}
                        <span>{r}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Experience level</span>
                  <div className={styles.chipGroup}>
                    {experienceLevels.map((l) => (
                      <span key={l} className={`${styles.chip} ${selectedLevel === l ? styles.chipSelectedLevel : ""}`} onClick={() => setSelectedLevel(l)}>
                        {getLevelAvatar(l)}
                        <span>{l}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Duration</span>
                  <div className={styles.chipGroup}>
                    {durations.map((d) => (
                      <span key={d.value} className={`${styles.chip} ${selectedDuration === d.value ? styles.chipSelectedRole : ""}`} onClick={() => setSelectedDuration(d.value)}>
                        {d.icon}
                        <span>{d.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Question types</span>
                  <div className={styles.typeGrid}>
                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Technical") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Technical")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("Technical") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconCode />Technical
                      </div>
                      <div className={styles.tcSub}>Concepts, architecture, debugging</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Behavioral") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Behavioral")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("Behavioral") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconUsers />Behavioral
                      </div>
                      <div className={styles.tcSub}>Teamwork, conflict, leadership</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("HR") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("HR")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("HR") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconBriefcase />HR
                      </div>
                      <div className={styles.tcSub}>Goals, salary, culture fit</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("System design") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("System design")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("System design") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconLayout />System design
                      </div>
                      <div className={styles.tcSub}>Scalability, trade-offs</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Coding & Algorithms") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Coding & Algorithms")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("Coding & Algorithms") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconTerminal />Coding & Algorithms
                      </div>
                      <div className={styles.tcSub}>Data structures, efficiency, problem solving</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Database & SQL") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Database & SQL")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("Database & SQL") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconDatabase />Database & SQL
                      </div>
                      <div className={styles.tcSub}>Query design, normalization, indexing</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Scenario & Case study") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Scenario & Case study")}>
                      <span className={styles.typeCardCheckbox}>
                        {selectedQuestionTypes.includes("Scenario & Case study") ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                      <div className={styles.tcTitle}>
                        <IconCaseStudy />Scenario & Case study
                      </div>
                      <div className={styles.tcSub}>Real-world cases, analysis, strategy</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Summary Sticky Sidebar */}
              <aside className={styles.summarySidebar}>
                <div className={styles.sidebarTitle}>Session Summary</div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Company</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedCompany ? (
                      selectedCompany === "Custom" ? (
                        customCompany.trim() ? (
                          <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{customCompany}</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                            Enter name
                          </span>
                        )
                      ) : (
                        renderCompanyLogo(selectedCompany) || selectedCompany
                      )
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Role</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedRole ? (
                      <>
                        {getRoleAvatar(selectedRole)}
                        <span>{selectedRole}</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Experience Level</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedLevel ? (
                      <>
                        {getLevelAvatar(selectedLevel)}
                        <span>{selectedLevel}</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Duration</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedDuration ? (
                      <>
                        {durations.find((d) => d.value === selectedDuration)?.icon}
                        <span>{selectedDuration} questions</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Question Types</span>
                  <div className={styles.sidebarBadgeList}>
                    {selectedQuestionTypes.length > 0 ? (
                      selectedQuestionTypes.map((t) => (
                        <span key={t} className={styles.sidebarBadge}>{t}</span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        None selected
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={styles.startBtn}
                  onClick={startInterview}
                  disabled={isStartingSession || completedSections < 5}
                  style={{ marginTop: "1rem" }}
                >
                  {isStartingSession ? (
                    <>
                      <IconSpinner /> Initializing AI Interviewer...
                    </>
                  ) : completedSections < 5 ? (
                    <>
                      Please select all options
                    </>
                  ) : (
                    <>
                      <IconPlay /> Start interview
                    </>
                  )}
                </button>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
