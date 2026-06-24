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
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
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

interface QuestionBreakdown {
  questionText: string;
  type: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

function ResultsContent() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // User details for navbar
  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  // Session results
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [overallScore, setOverallScore] = useState(0);
  const [metrics, setMetrics] = useState({
    technicalAccuracy: 0,
    communication: 0,
    problemSolving: 0,
  });
  const [qaBreakdown, setQaBreakdown] = useState<QuestionBreakdown[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);

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
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
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
        } else {
          localStorage.removeItem("token");
          router.push("/auth?mode=signin");
        }
      })
      .catch(() => {});

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

  if (isLoadingResults) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--text-secondary)" }}>
        <IconSpinner />
        <p>Loading interview evaluation report...</p>
      </div>
    );
  }

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
            <Link href="/resume" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={nav.mobileLink} onClick={() => setMobileMenu(false)} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {/* ── Main Layout Content ── */}
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

              <div className={styles.scoreLabel}>Overall score · {company} {role}</div>
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
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>{metrics.technicalAccuracy}</div>
                <div className={styles.metricLbl}>Technical accuracy</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>{metrics.communication}</div>
                <div className={styles.metricLbl}>Communication</div>
              </div>
              <div className={styles.metricCard}>
                <div className={styles.metricVal}>{metrics.problemSolving}</div>
                <div className={styles.metricLbl}>Problem solving</div>
              </div>
            </div>

            {/* Question Breakdown List */}
            <div className={styles.breakdownTitle}>Question breakdown</div>
            <div className={styles.qaReview}>
              {qaBreakdown.map((q, idx) => (
                <div key={idx} className={styles.qaItem}>
                  <div className={styles.qaQ}>
                    Q{idx + 1} · {q.type}
                  </div>
                  <div style={{ fontSize: "0.875rem", fontStyle: "italic", marginBottom: "8px", color: "var(--text-secondary)" }}>
                    "{q.questionText}"
                  </div>
                  <div className={styles.qaA}>
                    <strong>Your answer:</strong> {q.userAnswer || "No answer provided"}
                  </div>
                  {q.feedback && (
                    <div className={styles.qaFeedback}>
                      <strong>AI Feedback:</strong> {q.feedback}
                    </div>
                  )}
                  {q.score !== undefined && (
                    <span className={`${styles.qaScore} ${q.score >= 75 ? styles.scoreGood : q.score >= 50 ? styles.scoreOk : styles.scorePoor}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
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
                </div>
              ))}
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
