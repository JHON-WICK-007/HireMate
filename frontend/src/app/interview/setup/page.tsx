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
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "'Product Sans', sans-serif" }}>Google</span>
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00539b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" />
          </svg>
          <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#00539b", fontFamily: "sans-serif", letterSpacing: "0.02em" }}>TCS</span>
        </div>
      );
    case "Infosys":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007cc3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#007cc3", fontFamily: "sans-serif" }}>Infosys</span>
        </div>
      );
    case "Accenture":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a100ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#a100ff", fontFamily: "sans-serif" }}>accenture</span>
        </div>
      );
    case "Other / Custom":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#10b981", fontFamily: "sans-serif" }}>Custom</span>
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
    default:
      return null;
  }
};

const IconSeedling = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 22V12" />
    <path d="M12 12a5 5 0 0 0 5-5c0-1.5 0-3-3-3s-2 2.5-2 3" />
    <path d="M12 14a5 5 0 0 1-5-5c0-1.5 0-3 3-3s2 2.5 2 3" />
  </svg>
);

const IconUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconBriefcaseSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconCrown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M3 20h18" />
  </svg>
);

const getLevelAvatar = (level: string) => {
  switch (level) {
    case "Fresher":
      return <IconSeedling />;
    case "1–3 years":
      return <IconUser />;
    case "3–5 years":
      return <IconBriefcaseSmall />;
    case "5+ years":
      return <IconCrown />;
    default:
      return null;
  }
};

const getRoleTooltipText = (role: string) => {
  switch (role) {
    case "Backend developer":
      return "APIs, Databases, Scalability, Node/Python";
    case "Frontend developer":
      return "React, Next.js, CSS, JS, UI Performance";
    case "Full stack":
      return "System Architecture, Client & Server Integrations";
    case "DevOps":
      return "Docker, K8s, CI/CD, AWS, System Monitoring";
    case "Data analyst":
      return "SQL, Python, Excel, BI Dashboards, Statistics";
    default:
      return "Skill assessments";
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
  const companies = ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Accenture", "Other / Custom"];
  const roles = ["Backend developer", "Frontend developer", "Full stack", "DevOps", "Data analyst"];
  const experienceLevels = ["Fresher", "1–3 years", "3–5 years", "5+ years"];

  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [customCompany, setCustomCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("Backend developer");
  const [selectedLevel, setSelectedLevel] = useState("1–3 years");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(["Technical", "Behavioral"]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [isStartingSession, setIsStartingSession] = useState(false);

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
          company: selectedCompany === "Other / Custom" ? (customCompany || "Custom Company") : selectedCompany,
          role: selectedRole,
          level: selectedLevel,
          questionTypes: selectedQuestionTypes,
          totalQuestions: 5,
          difficulty,
          duration,
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
            <Link href="/resume" className={nav.navLink}>Resume Builder</Link>
            <Link href="/interview/setup" className={`${nav.navLink} ${nav.navActive || ""}`} style={{ color: "var(--domain-interview)", position: "relative" }}>
              Mock Interview
              <span className={styles.activeLinkUnderline} />
            </Link>
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
            <Link href="/resume" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Resume Builder</Link>
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

            {/* Stepper Progress bar */}
            {(() => {
              let configuredCount = 0;
              if (selectedCompany === "Other / Custom" ? customCompany.trim() !== "" : selectedCompany) configuredCount++;
              if (selectedRole) configuredCount++;
              if (selectedLevel) configuredCount++;
              if (selectedQuestionTypes.length > 0) configuredCount++;
              if (difficulty) configuredCount++;
              if (duration) configuredCount++;
              const progressPercent = Math.round((configuredCount / 6) * 100);

              return (
                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressTitle}>Setup Progress</span>
                    <span className={styles.progressPercentage}>{configuredCount} of 6 configured ({progressPercent}%)</span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div className={styles.progressBarFill} style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              );
            })()}

            {/* 2-Column Grid Layout */}
            {(() => {
              let configuredCount = 0;
              if (selectedCompany === "Other / Custom" ? customCompany.trim() !== "" : selectedCompany) configuredCount++;
              if (selectedRole) configuredCount++;
              if (selectedLevel) configuredCount++;
              if (selectedQuestionTypes.length > 0) configuredCount++;
              if (difficulty) configuredCount++;
              if (duration) configuredCount++;
              const progressPercent = Math.round((configuredCount / 6) * 100);

              return (
                <div className={styles.setupBodyGrid}>
                  {/* Summary Sidebar (Left Column) */}
                  <div className={styles.summarySidebar}>
                    <div className={styles.sidebarTitle}>Session Summary</div>
                    <div className={styles.sidebarList}>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Target Company</span>
                        <span className={styles.sidebarItemValue}>
                          {selectedCompany === "Other / Custom" ? (customCompany || "Custom Company") : selectedCompany}
                        </span>
                      </div>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Target Role</span>
                        <span className={styles.sidebarItemValue}>
                          {getRoleAvatar(selectedRole)}
                          {selectedRole}
                        </span>
                      </div>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Experience Level</span>
                        <span className={styles.sidebarItemValue}>
                          {getLevelAvatar(selectedLevel)}
                          {selectedLevel}
                        </span>
                      </div>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Question Types</span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px" }}>
                          {selectedQuestionTypes.map(type => (
                            <span key={type} style={{ fontSize: "0.7rem", background: "rgba(14, 165, 233, 0.1)", color: "#0ea5e9", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Difficulty</span>
                        <span className={styles.sidebarItemValue} style={{ color: "#6366f1", fontWeight: "600" }}>
                          {difficulty}
                        </span>
                      </div>
                      <div className={styles.sidebarItem}>
                        <span className={styles.sidebarItemLabel}>Duration</span>
                        <span className={styles.sidebarItemValue} style={{ color: "#8b5cf6", fontWeight: "600" }}>
                          {duration} mins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Configurable Form (Right Column) */}
                  <div style={{ flex: 1 }}>
                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Company</span>
                      <div className={styles.logoWall}>
                        {companies.map((c) => (
                          <div
                            key={c}
                            className={`${styles.logoItem} ${selectedCompany === c ? styles.logoItemActive : ""}`}
                            onClick={() => setSelectedCompany(c)}
                          >
                            {renderCompanyLogo(c)}
                          </div>
                        ))}
                      </div>
                      {selectedCompany === "Other / Custom" && (
                        <div className={styles.customInputContainer}>
                          <input
                            type="text"
                            className={styles.customInput}
                            placeholder="Type custom company name (e.g. OpenAI)"
                            value={customCompany}
                            onChange={(e) => setCustomCompany(e.target.value)}
                          />
                        </div>
                      )}
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Role</span>
                      <div className={styles.chipGroup}>
                        {roles.map((r) => (
                          <div key={r} className={styles.tooltipContainer}>
                            <span className={`${styles.chip} ${selectedRole === r ? styles.chipSelectedRole : ""}`} onClick={() => setSelectedRole(r)}>
                              {getRoleAvatar(r)}
                              <span>{r}</span>
                            </span>
                            <span className={styles.tooltipText}>{getRoleTooltipText(r)}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
                        <Link href="/resume" style={{ fontSize: "0.75rem", color: "#14b8a6", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "2px", fontWeight: "500" }}>
                          Upload resume to auto-fill your role
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                          </svg>
                        </Link>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

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

                    <hr className={styles.sectionDivider} />

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
                          <div className={styles.tcSub} style={{ paddingRight: "1.5rem" }}>Concepts, architecture, debugging</div>
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
                          <div className={styles.tcSub} style={{ paddingRight: "1.5rem" }}>Teamwork, conflict, leadership</div>
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
                          <div className={styles.tcSub} style={{ paddingRight: "1.5rem" }}>Goals, salary, culture fit</div>
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
                          <div className={styles.tcSub} style={{ paddingRight: "1.5rem" }}>Scalability, trade-offs</div>
                        </div>
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Difficulty</span>
                      <div className={styles.toggleGroup}>
                        {["Easy", "Medium", "Hard"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            className={`${styles.toggleBtn} ${difficulty === d ? styles.toggleBtnSelectedIndigo : ""}`}
                            onClick={() => setDifficulty(d)}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <hr className={styles.sectionDivider} />

                    <div className={styles.field}>
                      <span className={styles.fieldLabel}>Duration</span>
                      <div className={styles.toggleGroup}>
                        {[15, 30, 45].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            className={`${styles.toggleBtn} ${duration === mins ? styles.toggleBtnSelectedViolet : ""}`}
                            onClick={() => setDuration(mins)}
                          >
                            {mins} mins
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            <hr className={styles.divider} />

            <button className={styles.startBtn} onClick={startInterview} disabled={isStartingSession || (selectedCompany === "Other / Custom" && !customCompany.trim())}>
              {isStartingSession ? (
                <>
                  <IconSpinner /> Initializing AI Interviewer...
                </>
              ) : (
                <>
                  <IconPlay /> Start interview — {selectedCompany === "Other / Custom" ? (customCompany || "Custom") : selectedCompany} · {selectedRole.split(" ")[0]} · {selectedLevel.replace(" years", " yrs")}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Sticky Bottom CTA Bar */}
      <div className={styles.stickyCTA}>
        <div className={styles.stickyCTAInner}>
          <div className={styles.stickyCTAMeta}>
            <span className={styles.stickyCTATitle}>Ready to begin?</span>
            <span className={styles.stickyCTASub}>
              {selectedCompany === "Other / Custom" ? (customCompany || "Custom") : selectedCompany} · {selectedRole.split(" ")[0]} · {selectedLevel.replace(" years", " yrs")}
            </span>
          </div>
          <button 
            className={styles.stickyCTAButton} 
            onClick={startInterview} 
            disabled={isStartingSession || (selectedCompany === "Other / Custom" && !customCompany.trim())}
          >
            {isStartingSession ? (
              <>
                <IconSpinner /> Initializing...
              </>
            ) : (
              <>
                <IconPlay /> Start Mock Interview
              </>
            )}
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
