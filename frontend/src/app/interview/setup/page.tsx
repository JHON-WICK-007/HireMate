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
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#007cc3", fontFamily: "sans-serif", fontStyle: "italic", letterSpacing: "-0.01em" }}>Infosys</span>
        </div>
      );
    case "Accenture":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#a100ff", fontFamily: "sans-serif" }}>accenture</span>
          <span style={{ color: "#a100ff", fontWeight: "900", fontSize: "1rem", lineHeight: "1" }}>&gt;</span>
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
  const companies = ["Google", "Amazon", "Microsoft", "TCS", "Infosys", "Accenture"];
  const roles = ["Backend developer", "Frontend developer", "Full stack", "DevOps", "Data analyst"];
  const experienceLevels = ["Fresher", "1–3 years", "3–5 years", "5+ years"];

  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [selectedRole, setSelectedRole] = useState("Backend developer");
  const [selectedLevel, setSelectedLevel] = useState("1–3 years");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(["Technical", "Behavioral"]);
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
          company: selectedCompany,
          role: selectedRole,
          level: selectedLevel,
          questionTypes: selectedQuestionTypes,
          totalQuestions: 5,
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
              <span className={styles.fieldLabel}>Question types</span>
              <div className={styles.typeGrid}>
                <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Technical") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Technical")}>
                  <div className={styles.tcTitle}>
                    <IconCode />Technical
                  </div>
                  <div className={styles.tcSub}>Concepts, architecture, debugging</div>
                </div>

                <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Behavioral") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Behavioral")}>
                  <div className={styles.tcTitle}>
                    <IconUsers />Behavioral
                  </div>
                  <div className={styles.tcSub}>Teamwork, conflict, leadership</div>
                </div>

                <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("HR") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("HR")}>
                  <div className={styles.tcTitle}>
                    <IconBriefcase />HR
                  </div>
                  <div className={styles.tcSub}>Goals, salary, culture fit</div>
                </div>

                <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("System design") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("System design")}>
                  <div className={styles.tcTitle}>
                    <IconLayout />System design
                  </div>
                  <div className={styles.tcSub}>Scalability, trade-offs</div>
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <button className={styles.startBtn} onClick={startInterview} disabled={isStartingSession}>
              {isStartingSession ? (
                <>
                  <IconSpinner /> Initializing AI Interviewer...
                </>
              ) : (
                <>
                  <IconPlay /> Start interview — {selectedCompany} · {selectedRole.split(" ")[0]} · {selectedLevel.replace(" years", " yrs")}
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
