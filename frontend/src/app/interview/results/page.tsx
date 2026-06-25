"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import { useToast } from "../../components/Toast";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Inline SVG Icons ─────────────────────────────────────────
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const IconScoreExcellent = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconScoreGood = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconScoreAverage = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconScoreOk = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconScoreBad = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const IconScorePoor = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const getScoreDetails = (score: number) => {
  if (score >= 90) return { icon: <IconScoreExcellent />, label: "Excellent Performance", style: "scorePillExcellent" };
  if (score >= 75) return { icon: <IconScoreGood />, label: "Good Performance", style: "scorePillGood" };
  if (score >= 50) return { icon: <IconScoreAverage />, label: "Average Performance", style: "scorePillAverage" };
  if (score >= 25) return { icon: <IconScoreOk />, label: "Below Average", style: "scorePillOk" };
  return { icon: <IconScorePoor />, label: "Requires Practice", style: "scorePillPoor" };
};

const IconCode = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconUsers = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconLayout = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
const IconCaseStudy = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconDatabase = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);
const IconTerminal = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);
const IconSparkles = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
  </svg>
);

const getQuestionTypeIcon = (type?: string) => {
  if (!type) return <IconSparkles />;
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("technical")) return <IconCode />;
  if (normalized.includes("behavioral")) return <IconUsers />;
  if (normalized.includes("hr")) return <IconBriefcase />;
  if (normalized.includes("system design")) return <IconLayout />;
  if (normalized.includes("scenario") || normalized.includes("case study")) return <IconCaseStudy />;
  if (normalized.includes("database") || normalized.includes("sql")) return <IconDatabase />;
  if (normalized.includes("coding") || normalized.includes("algo")) return <IconTerminal />;
  return <IconSparkles />;
};

const getQuestionTypeColor = (type?: string) => {
  if (!type) return "#a855f7"; // purple fallback
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("technical")) return "#3b82f6"; // blue
  if (normalized.includes("behavioral")) return "#14b8a6"; // teal
  if (normalized.includes("hr")) return "#f43f5e"; // rose/pink
  if (normalized.includes("system design")) return "#f97316"; // orange
  if (normalized.includes("scenario") || normalized.includes("case study")) return "#a855f7"; // purple
  if (normalized.includes("database") || normalized.includes("sql")) return "#10b981"; // emerald
  if (normalized.includes("coding") || normalized.includes("algo")) return "#f59e0b"; // amber
  return "#a855f7";
};

interface QuestionBreakdown {
  questionText: string;
  type: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
  strongAnswer?: string;
  competencies?: string[];
}

const IconUserBlue = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", flexShrink: 0, color: "#60a5fa" }}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSparklesPurple = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", flexShrink: 0, color: "#c084fc" }}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z" />
    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" />
  </svg>
);

const IconLightbulbTeal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px", flexShrink: 0, color: "#2dd4bf" }}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

const getStrongAnswer = (q: QuestionBreakdown) => {
  if (q.strongAnswer) return q.strongAnswer;
  const normalized = (q.type || "").toLowerCase().trim();
  if (normalized.includes("technical") || normalized.includes("coding")) {
    return "To solve this, I would first analyze the performance bottlenecks, walk through edge cases, choose an optimal data structure (like a hash map or trie) for time complexity, and implement the solution while handling potential errors.";
  }
  if (normalized.includes("behavioral")) {
    return "I resolved the conflict by scheduling a 1-on-1 discussion, actively listening to their concerns, comparing both options objectively with data, and aligning on a hybrid solution that addressed both of our priorities.";
  }
  if (normalized.includes("hr")) {
    return "I would explain how my past achievements align directly with this role, highlighting my motivation to contribute to the company's growth, collaborate effectively, and continuously develop my technical and professional skills.";
  }
  if (normalized.includes("system design") || normalized.includes("layout")) {
    return "For this system, I would design a microservices architecture using load balancers, an API gateway, a distributed caching layer (like Redis), and an asynchronous message queue (like Kafka) to ensure horizontal scalability.";
  }
  return "A strong answer should demonstrate structured thinking, specific examples of past experiences, clear technical knowledge, and focus on positive team outcomes and lessons learned.";
};


function ResultsContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  // Session results
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [sessionName, setSessionName] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const [metrics, setMetrics] = useState({
    technicalAccuracy: 0,
    communication: 0,
    problemSolving: 0,
  });
  const [qaBreakdown, setQaBreakdown] = useState<QuestionBreakdown[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion((prev) => (prev === idx ? null : idx));
  };

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

  // Fetch authentication and results details
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
    }
    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        setAvatar(savedUser.avatar || "");
        setFullName(savedUser.fullName || "");
        const parts = (savedUser.fullName || "").trim().split(/\s+/);
        const firstInitial = parts[0] ? parts[0][0] : "";
        const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
        const initials = (firstInitial + lastInitial).toUpperCase() || "U";
        setUserInitials(initials);
      } catch (e) { }
    }

    // Fetch navbar user profile details
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setAvatar(data.user.avatar || "");
          setFullName(data.user.fullName || "");
          const parts = (data.user.fullName || "").trim().split(/\s+/);
          const firstInitial = parts[0] ? parts[0][0] : "";
          const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
          const initials = (firstInitial + lastInitial).toUpperCase() || "U";
          setUserInitials(initials);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth?mode=signin");
        }
      })
      .catch(() => { });

    // Fetch completed interview results
    if (!id) {
      toast.error("No interview session ID provided.");
      router.push("/interview/setup");
      return;
    }

    fetch(`${API_URL}/api/interviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.interview) {
          const session = data.interview;
          setCompany(session.company);
          setRole(session.role);
          setSessionName(session.sessionName || "");
          setOverallScore(session.overallScore || 0);
          setMetrics(session.metrics || { technicalAccuracy: 0, communication: 0, problemSolving: 0 });
          setQaBreakdown(session.questions || []);
        } else {
          toast.error(data.message || "Failed to load interview report.");
          router.push("/interview/setup");
        }
      })
      .catch(() => {
        toast.error("Network error loading interview report.");
        router.push("/interview/setup");
      })
      .finally(() => {
        setIsLoadingResults(false);
      });
  }, [id]);

  const getStrokeDashOffset = (score: number) => {
    const circumference = 2 * Math.PI * 60; // radius = 60
    return circumference - (score / 100) * circumference;
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

          <div className={nav.navActions} suppressHydrationWarning>
            <Link
              href="/profile"
              className={nav.navBtnGhost}
              style={{
                width: "136px",
                paddingLeft: "6px",
                paddingRight: "16px",
                justifyContent: "flex-start"
              }}
            >
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
              <span
                style={{
                  display: "inline-block",
                  width: "64px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "left"
                }}
              >
                {fullName ? fullName.split(" ")[0] : "Profile"}
              </span>
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
            <Link href="/resume" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={nav.mobileLink} onClick={() => setMobileMenu(false)} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {isLoadingResults ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--text-secondary)" }}>
          <IconSpinner />
          <p>Loading interview evaluation report...</p>
        </div>
      ) : (
        <main className={styles.layout}>
          <div className={styles.consoleCard}>


            <div className={styles.resultsBody}>
              <div className={styles.resultsHeader}>
                <div className={styles.scoreCircle}>
                  <svg className={styles.scoreSvg} viewBox="0 0 140 140">
                    <circle className={styles.scoreCircleBackground} cx="70" cy="70" r="60" />
                    <circle
                      className={styles.scoreCircleFill}
                      cx="70"
                      cy="70"
                      r="60"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={getStrokeDashOffset(overallScore)}
                    />
                  </svg>
                  <div className={styles.bigScore}>{overallScore}</div>
                </div>

                <div className={styles.scoreLabel}>Overall score · {sessionName || `${company} ${role}`}</div>
                <div className={styles.verdictBadge}>
                  {(() => {
                    const scoreInfo = getScoreDetails(overallScore);
                    return (
                      <span className={`${styles.scorePill} ${styles[scoreInfo.style]}`} style={{ display: "inline-flex", fontSize: "0.8rem", padding: "4px 12px" }}>
                        {scoreInfo.icon}
                        <span style={{ marginLeft: "4px" }}>{scoreInfo.label}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              {/* Metrics Grid */}
            <div className={styles.metricsGrid}>
              <div className={`${styles.metricCard} ${styles.metricTechnical}`}>
                <div className={styles.metricVal}>
                  {metrics.technicalAccuracy}
                  <span className={styles.metricMax}>/100</span>
                </div>
                <div className={styles.metricLbl}>Technical accuracy</div>
                <div className={styles.metricTrack}>
                  <div 
                    className={styles.metricFill} 
                    style={{ width: `${metrics.technicalAccuracy}%` }}
                  />
                </div>
              </div>

              <div className={`${styles.metricCard} ${styles.metricCommunication}`}>
                <div className={styles.metricVal}>
                  {metrics.communication}
                  <span className={styles.metricMax}>/100</span>
                </div>
                <div className={styles.metricLbl}>Communication</div>
                <div className={styles.metricTrack}>
                  <div 
                    className={styles.metricFill} 
                    style={{ width: `${metrics.communication}%` }}
                  />
                </div>
              </div>

              <div className={`${styles.metricCard} ${styles.metricProblemSolving}`}>
                <div className={styles.metricVal}>
                  {metrics.problemSolving}
                  <span className={styles.metricMax}>/100</span>
                </div>
                <div className={styles.metricLbl}>Problem solving</div>
                <div className={styles.metricTrack}>
                  <div 
                    className={styles.metricFill} 
                    style={{ width: `${metrics.problemSolving}%` }}
                  />
                </div>
              </div>
            </div>

              {/* Question Breakdown List */}
              <div className={styles.breakdownTitle}>Question breakdown</div>
              <div className={styles.qaReview}>
                {qaBreakdown.map((q, idx) => {
                  const isExpanded = expandedQuestion === idx;
                  return (
                    <div key={idx} className={`${styles.qaItem} ${isExpanded ? styles.qaItemExpanded : ""}`}>
                      <div
                        className={styles.qaHeader}
                        onClick={() => toggleQuestion(idx)}
                      >
                        <div className={styles.qaHeaderLeft}>
                          <div className={styles.qaQTextRow}>
                            <span className={styles.qaQNumber}>Q{idx + 1}</span>
                            <span className={styles.qaQText}>{q.questionText}</span>
                          </div>
                          {(() => {
                            const typeColor = getQuestionTypeColor(q.type);
                            return (
                              <span
                                className={styles.qaTypeBadge}
                                style={{
                                  color: typeColor,
                                  backgroundColor: `${typeColor}15`,
                                }}
                              >
                                {getQuestionTypeIcon(q.type)}
                                <span>{q.type}</span>
                              </span>
                            );
                          })()}
                        </div>
                        <div className={styles.qaHeaderRight}>
                          {q.score !== undefined && (
                            <span
                              className={`${styles.qaScore} ${q.score >= 75
                                  ? styles.scoreGood
                                  : q.score >= 50
                                    ? styles.scoreOk
                                    : styles.scorePoor
                                }`}
                              style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                            >
                              {q.score >= 75 ? (
                                <IconScoreGood />
                              ) : q.score >= 50 ? (
                                <IconScoreOk />
                              ) : (
                                <IconScoreBad />
                              )}
                              Score: {q.score}/100
                            </span>
                          )}
                          <span className={`${styles.qaToggleIcon} ${isExpanded ? styles.qaToggleIconExpanded : ""}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" className={styles.verticalLine} />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </span>
                        </div>
                      </div>

                      <div className={`${styles.qaContentWrapper} ${isExpanded ? styles.qaContentWrapperExpanded : ""}`}>
                        <div className={`${styles.qaContent} ${isExpanded ? styles.qaContentExpanded : ""}`}>
                          <div className={styles.qaContentInner}>
                            <div className={styles.qaBoxes}>
                              {/* Box 1: Your Answer */}
                              <div className={styles.qaBoxAnswer}>
                                <div className={styles.qaBoxHeaderAnswer}>
                                  <IconUserBlue />
                                  <span>YOUR ANSWER</span>
                                </div>
                                 <div className={`${styles.qaBoxBodyAnswer} ${!q.userAnswer ? styles.qaNoAnswer : ""}`}>
                                   {q.userAnswer || "No answer provided"}
                                 </div>
                              </div>

                              {/* Box 2: AI Feedback */}
                              {q.feedback && (
                                <div className={styles.qaBoxFeedback}>
                                  <div className={styles.qaBoxHeaderFeedback}>
                                    <IconSparklesPurple />
                                    <span>AI FEEDBACK</span>
                                  </div>
                                  <div className={styles.qaBoxBody}>
                                    {q.feedback}
                                  </div>
                                </div>
                              )}

                              {/* Box 3: What a strong answer looks like */}
                              {getStrongAnswer(q) && (
                                <div className={styles.qaBoxStrong}>
                                  <div className={styles.qaBoxHeaderStrong}>
                                    <IconLightbulbTeal />
                                    <span>WHAT A STRONG ANSWER LOOKS LIKE</span>
                                  </div>
                                  <div className={styles.qaBoxBodyStrong}>
                                    "{getStrongAnswer(q)}"
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions row */}
              <div className={styles.actionRow}>
                <button className={styles.btnPrimary} onClick={() => router.push("/interview/setup")}>
                  New interview
                </button>
                <button className={styles.btnSecondary} onClick={() => router.push("/profile")}>
                  View profile history
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "12px", color: "var(--text-secondary)" }}>
        <IconSpinner />
        <p>Loading results workspace...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
