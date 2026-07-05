"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import { useToast } from "../../components/Toast";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";
import Navbar from "../../components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

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

const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);
const IconCheckSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [filterPos, setFilterPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });
  const [resultsLoaded, setResultsLoaded] = useState(false);

  const toggleQuestion = (idx: number) => {
    setExpandedQuestion((prev) => (prev === idx ? null : idx));
  };

  const FILTER_TYPE_OPTIONS = [
    { value: "all", label: "All Types" },
    { value: "technical", label: "Technical", icon: <IconCode />, color: "#3b82f6" },
    { value: "behavioral", label: "Behavioral", icon: <IconUsers />, color: "#14b8a6" },
    { value: "hr", label: "HR", icon: <IconBriefcase />, color: "#f43f5e" },
    { value: "system design", label: "System Design", icon: <IconLayout />, color: "#f97316" },
    { value: "scenario", label: "Scenario / Case Study", icon: <IconCaseStudy />, color: "#a855f7" },
    { value: "database", label: "Database / SQL", icon: <IconDatabase />, color: "#10b981" },
    { value: "coding", label: "Coding / Algo", icon: <IconTerminal />, color: "#f59e0b" },
  ];

  const FILTER_SCORE_OPTIONS = [
    { value: "all", label: "All Scores" },
    { value: "excellent", label: "Excellent", range: "90–100", color: "#3b82f6" },
    { value: "good", label: "Good", range: "75–89", color: "#22c55e" },
    { value: "average", label: "Average", range: "50–74", color: "#f59e0b" },
    { value: "below", label: "Below Avg", range: "25–49", color: "#f97316" },
    { value: "poor", label: "Poor", range: "0–24", color: "#ef4444" },
  ];

  const matchesFilter = (type: string | undefined, filter: string) => {
    if (filter === "all") return true;
    if (!type) return false;
    const t = type.toLowerCase().trim();
    if (filter === "technical") return t.includes("technical");
    if (filter === "behavioral") return t.includes("behavioral");
    if (filter === "hr") return t.includes("hr");
    if (filter === "system design") return t.includes("system design");
    if (filter === "scenario") return t.includes("scenario") || t.includes("case study");
    if (filter === "database") return t.includes("database") || t.includes("sql");
    if (filter === "coding") return t.includes("coding") || t.includes("algo");
    return true;
  };

  const matchesScoreFilter = (score: number | undefined, filter: string) => {
    if (filter === "all") return true;
    if (score === undefined) return false;
    if (filter === "excellent") return score >= 90;
    if (filter === "good") return score >= 75 && score < 90;
    if (filter === "average") return score >= 50 && score < 75;
    if (filter === "below") return score >= 25 && score < 50;
    if (filter === "poor") return score < 25;
    return true;
  };

  const filteredQaBreakdown = qaBreakdown.filter(
    (q) => matchesFilter(q.type, filterType) && matchesScoreFilter(q.score, filterScore)
  );

  const hasActiveFilter = filterType !== "all" || filterScore !== "all";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const inBtn = filterRef.current?.contains(target);
      const inDropdown = filterDropdownRef.current?.contains(target);
      if (!inBtn && !inDropdown) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update dropdown position on scroll
  useEffect(() => {
    if (!filterOpen) return;
    const updatePos = () => {
      if (filterBtnRef.current) {
        const rect = filterBtnRef.current.getBoundingClientRect();
        setFilterPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
      }
    };
    const onScroll = () => requestAnimationFrame(updatePos);
    window.addEventListener("scroll", onScroll, { passive: true });
    updatePos();
    return () => window.removeEventListener("scroll", onScroll);
  }, [filterOpen]);

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
    let cachedFullName = "";
    let cachedAvatar = "";
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        cachedAvatar = savedUser.avatar || "";
        cachedFullName = savedUser.fullName || "";
        setAvatar(cachedAvatar);
        setFullName(cachedFullName);
        const parts = (cachedFullName || "").trim().split(/\s+/);
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
          const finalAvatar = data.user.avatar || cachedAvatar;
          const finalFullName = data.user.fullName || cachedFullName;
          setAvatar(finalAvatar);
          setFullName(finalFullName);
          const parts = (finalFullName || "").trim().split(/\s+/);
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
          setResultsLoaded(true);
        } else {
          toast.error(data.message || "Failed to load interview report.");
          router.push("/interview/setup");
          setResultsLoaded(true);
        }
      })
      .catch(() => {
        toast.error("Network error loading interview report.");
        router.push("/interview/setup");
        setResultsLoaded(true);
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
      <Navbar activePage="interview" />

      <main className={styles.layout}>
        <div className={styles.consoleCard}>
          {!resultsLoaded ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px", color: "var(--text-secondary)" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
              </svg>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: "1.1rem", color: "#a3a3a3" }}>Loading interview report...</p>
            </div>
          ) : (
          <div className={styles.resultsBody}>
              <div className={styles.resultsHeader}>
                <div className={styles.scoreCircleInfo}>
                  <div className={styles.scoreCircleWrap}>
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
                  <div className={styles.scoreLabel}>/100</div>
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
                  <div className={styles.sessionName}>{sessionName || `${company} ${role}`}</div>
                </div>

                {/* Metrics Grid */}
                <div className={styles.metricsGrid}>
              {[
                { score: metrics.technicalAccuracy, label: "Technical accuracy", metricClass: styles.metricTechnical },
                { score: metrics.communication, label: "Communication", metricClass: styles.metricCommunication },
                { score: metrics.problemSolving, label: "Problem solving", metricClass: styles.metricProblemSolving },
              ].map(({ score, label, metricClass }) => {
                const s = getScoreDetails(score);
                const perfColors: Record<string, { bg: string; color: string; border: string }> = {
                  scorePillExcellent: { bg: "rgba(59, 130, 246, 0.08)", color: "#3b82f6", border: "rgba(59, 130, 246, 0.25)" },
                  scorePillGood: { bg: "rgba(34, 197, 94, 0.06)", color: "#22c55e", border: "rgba(34, 197, 94, 0.2)" },
                  scorePillAverage: { bg: "rgba(245, 158, 11, 0.06)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.2)" },
                  scorePillOk: { bg: "rgba(249, 115, 22, 0.06)", color: "#f97316", border: "rgba(249, 115, 22, 0.2)" },
                  scorePillPoor: { bg: "rgba(239, 68, 68, 0.06)", color: "#ef4444", border: "rgba(239, 68, 68, 0.2)" },
                };
                const pc = perfColors[s.style] || perfColors.scorePillAverage;
                return (
                  <div key={label} className={`${styles.metricCard} ${metricClass}`}>
                    <div className={styles.metricVal}>
                      {score}
                      <span className={styles.metricMax}>/100</span>
                    </div>
                    <div className={styles.metricLbl}>{label}</div>
                    <div className={styles.metricTrack}>
                      <div 
                        className={styles.metricFill} 
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <div className={styles.metricPerf} style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}` }}>
                      {s.icon} {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>

              {/* Question Breakdown List */}
              <div className={styles.breakdownTitleRow}>
                <div className={styles.breakdownTitle}>Question breakdown</div>
                <div className={styles.filterWrapper} ref={filterRef}>
                  <button
                    ref={filterBtnRef}
                    className={styles.filterBtn}
                    onClick={() => {
                      if (!filterOpen && filterBtnRef.current) {
                        const rect = filterBtnRef.current.getBoundingClientRect();
                        setFilterPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
                      }
                      setFilterOpen((o) => !o);
                    }}
                    title="Filter questions"
                  >
                    <IconFilter />
                    {hasActiveFilter && <span className={styles.filterActiveDot} />}
                  </button>
                  {filterOpen && createPortal(
                    <div
                      ref={filterDropdownRef}
                      className={styles.filterDropdown}
                      style={{ position: "fixed", top: filterPos.top, right: filterPos.right }}
                    >
                      <div className={styles.filterColumns}>
                        {/* Left: Question Type */}
                        <div className={styles.filterCol}>
                          <div className={styles.filterColHeader}>Question Type</div>
                          {FILTER_TYPE_OPTIONS.map((opt) => {
                            const isActive = filterType === opt.value;
                            const activeColor = opt.color || "#a855f7";
                            return (
                              <button
                                key={opt.value}
                                className={`${styles.filterOption} ${isActive ? styles.filterOptionActive : ""}`}
                                style={isActive ? { color: activeColor } : undefined}
                                onClick={() => {
                                  setFilterType(opt.value);
                                  setExpandedQuestion(null);
                                }}
                              >
                                <span className={styles.filterOptionLabel}>
                                  {opt.icon && (
                                    <span className={styles.filterTypeIcon} style={{ color: activeColor }}>
                                      {opt.icon}
                                    </span>
                                  )}
                                  {opt.label}
                                </span>
                                <span className={styles.filterCheckSlot} style={isActive ? { color: activeColor } : undefined}>
                                  {isActive && <IconCheckSmall />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {/* Divider */}
                        <div className={styles.filterDivider} />
                        {/* Right: Score */}
                        <div className={styles.filterCol}>
                          <div className={styles.filterColHeader}>Score</div>
                          {FILTER_SCORE_OPTIONS.map((opt) => {
                            const isActive = filterScore === opt.value;
                            const activeColor = opt.color || "#a855f7";
                            return (
                              <button
                                key={opt.value}
                                className={`${styles.filterOption} ${isActive ? styles.filterOptionActive : ""}`}
                                style={isActive ? { color: activeColor } : undefined}
                                onClick={() => {
                                  setFilterScore(opt.value);
                                  setExpandedQuestion(null);
                                }}
                              >
                                <span className={styles.filterOptionLabel}>
                                  {opt.color && (
                                    <span className={styles.filterColorDot} style={{ background: opt.color }} />
                                  )}
                                  <span>{opt.label}</span>
                                  {opt.range && <span className={styles.filterRange}>{opt.range}</span>}
                                </span>
                                <span className={styles.filterCheckSlot} style={isActive ? { color: activeColor } : undefined}>
                                  {isActive && <IconCheckSmall />}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {/* Reset */}
                      {hasActiveFilter && (
                        <button
                          className={styles.filterReset}
                          onClick={() => {
                            setFilterType("all");
                            setFilterScore("all");
                            setExpandedQuestion(null);
                          }}
                        >
                          Reset filters
                        </button>
                      )}
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              <div className={styles.qaReview}>
                {filteredQaBreakdown.length === 0 && (
                  <div className={styles.filterEmpty}>No questions match this filter.</div>
                )}
                {filteredQaBreakdown.map((q, idx) => {
                  const origIdx = qaBreakdown.indexOf(q);
                  const isExpanded = expandedQuestion === origIdx;
                  return (
                    <div key={origIdx} className={`${styles.qaItem} ${isExpanded ? styles.qaItemExpanded : ""}`}>
                      <div
                        className={styles.qaHeader}
                        onClick={() => toggleQuestion(origIdx)}
                      >
                        <div className={styles.qaHeaderLeft}>
                          <div className={styles.qaQTextRow}>
                            <span className={styles.qaQNumber}>Q{origIdx + 1}</span>
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
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px", color: "var(--text-secondary)", background: "var(--surface-0)" }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
          <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: "0.9rem" }}>Loading results workspace...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
