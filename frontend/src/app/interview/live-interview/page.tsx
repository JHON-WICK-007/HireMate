"use client";

import React, { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import { useToast } from "../../components/Toast";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Inline SVG Icons ─────────────────────────────────────────
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
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
const IconBarChart = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
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
  if (score >= 90) return { icon: <IconScoreExcellent />, label: "Excellent", style: "scorePillExcellent" };
  if (score >= 75) return { icon: <IconScoreGood />, label: "Good", style: "scorePillGood" };
  if (score >= 50) return { icon: <IconScoreAverage />, label: "Average", style: "scorePillAverage" };
  if (score >= 25) return { icon: <IconScoreOk />, label: "Below Avg", style: "scorePillOk" };
  return { icon: <IconScorePoor />, label: "Poor", style: "scorePillPoor" };
};

const IconSparkles = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
  </svg>
);

// ─── Question Type Icons (matching setup page) ─────────────────
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

const getQuestionTypeStyles = (type?: string) => {
  const defaultVal = {
    bg: "rgba(168, 85, 247, 0.05)",
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.12)",
    focus: "rgba(168, 85, 247, 0.35)",
    c1: "rgba(168, 85, 247, 0.25)", // Violet
    c2: "rgba(239, 68, 68, 0.25)",  // Red
    c3: "rgba(249, 115, 22, 0.25)",  // Orange
    c4: "rgba(234, 179, 8, 0.25)",   // Yellow
    c5: "rgba(16, 185, 129, 0.25)",  // Emerald
    c6: "rgba(59, 130, 246, 0.25)",  // Blue
    c1Focus: "#a855f7",
    c2Focus: "#ef4444",
    c3Focus: "#f97316",
    c4Focus: "#eab308",
    c5Focus: "#10b981",
    c6Focus: "#3b82f6",
  };

  if (!type) return defaultVal;
  
  const normalized = type.toLowerCase().trim();
  if (normalized.includes("technical")) {
    return {
      bg: "rgba(59, 130, 246, 0.05)",
      color: "#3b82f6",
      glow: "rgba(59, 130, 246, 0.08)",
      border: "rgba(59, 130, 246, 0.12)",
      focus: "rgba(59, 130, 246, 0.35)",
      c1: "rgba(59, 130, 246, 0.25)",
      c2: "rgba(99, 102, 241, 0.25)",
      c3: "rgba(168, 85, 247, 0.25)",
      c4: "rgba(239, 68, 68, 0.25)",
      c5: "rgba(249, 115, 22, 0.25)",
      c6: "rgba(6, 182, 212, 0.25)",
      c1Focus: "#3b82f6",
      c2Focus: "#6366f1",
      c3Focus: "#a855f7",
      c4Focus: "#ef4444",
      c5Focus: "#f97316",
      c6Focus: "#06b6d4",
    };
  }
  if (normalized.includes("behavioral")) {
    return {
      bg: "rgba(20, 184, 166, 0.05)",
      color: "#14b8a6",
      glow: "rgba(20, 184, 166, 0.08)",
      border: "rgba(20, 184, 166, 0.12)",
      focus: "rgba(20, 184, 166, 0.35)",
      c1: "rgba(20, 184, 166, 0.25)",
      c2: "rgba(16, 185, 129, 0.25)",
      c3: "rgba(234, 179, 8, 0.25)",
      c4: "rgba(249, 115, 22, 0.25)",
      c5: "rgba(239, 68, 68, 0.25)",
      c6: "rgba(59, 130, 246, 0.25)",
      c1Focus: "#14b8a6",
      c2Focus: "#10b981",
      c3Focus: "#eab308",
      c4Focus: "#f97316",
      c5Focus: "#ef4444",
      c6Focus: "#3b82f6",
    };
  }
  if (normalized.includes("hr")) {
    return {
      bg: "rgba(244, 63, 94, 0.05)",
      color: "#f43f5e",
      glow: "rgba(244, 63, 94, 0.08)",
      border: "rgba(244, 63, 94, 0.12)",
      focus: "rgba(244, 63, 94, 0.35)",
      c1: "rgba(244, 63, 94, 0.25)",
      c2: "rgba(236, 72, 153, 0.25)",
      c3: "rgba(239, 68, 68, 0.25)",
      c4: "rgba(249, 115, 22, 0.25)",
      c5: "rgba(234, 179, 8, 0.25)",
      c6: "rgba(168, 85, 247, 0.25)",
      c1Focus: "#f43f5e",
      c2Focus: "#ec4899",
      c3Focus: "#ef4444",
      c4Focus: "#f97316",
      c5Focus: "#eab308",
      c6Focus: "#a855f7",
    };
  }
  if (normalized.includes("system design")) {
    return {
      bg: "rgba(249, 115, 22, 0.05)",
      color: "#f97316",
      glow: "rgba(249, 115, 22, 0.08)",
      border: "rgba(249, 115, 22, 0.12)",
      focus: "rgba(249, 115, 22, 0.35)",
      c1: "rgba(249, 115, 22, 0.25)",
      c2: "rgba(245, 158, 11, 0.25)",
      c3: "rgba(234, 179, 8, 0.25)",
      c4: "rgba(34, 197, 94, 0.25)",
      c5: "rgba(239, 68, 68, 0.25)",
      c6: "rgba(244, 63, 94, 0.25)",
      c1Focus: "#f97316",
      c2Focus: "#f59e0b",
      c3Focus: "#eab308",
      c4Focus: "#22c55e",
      c5Focus: "#ef4444",
      c6Focus: "#f43f5e",
    };
  }
  if (normalized.includes("scenario")) {
    return {
      bg: "rgba(168, 85, 247, 0.05)",
      color: "#a855f7",
      glow: "rgba(168, 85, 247, 0.08)",
      border: "rgba(168, 85, 247, 0.12)",
      focus: "rgba(168, 85, 247, 0.35)",
      c1: "rgba(168, 85, 247, 0.25)",
      c2: "rgba(217, 70, 239, 0.25)",
      c3: "rgba(236, 72, 153, 0.25)",
      c4: "rgba(239, 68, 68, 0.25)",
      c5: "rgba(234, 179, 8, 0.25)",
      c6: "rgba(99, 102, 241, 0.25)",
      c1Focus: "#a855f7",
      c2Focus: "#d946ef",
      c3Focus: "#ec4899",
      c4Focus: "#ef4444",
      c5Focus: "#eab308",
      c6Focus: "#6366f1",
    };
  }
  if (normalized.includes("database") || normalized.includes("sql")) {
    return {
      bg: "rgba(16, 185, 129, 0.05)",
      color: "#10b981",
      glow: "rgba(16, 185, 129, 0.08)",
      border: "rgba(16, 185, 129, 0.12)",
      focus: "rgba(16, 185, 129, 0.35)",
      c1: "rgba(16, 185, 129, 0.25)",
      c2: "rgba(20, 184, 166, 0.25)",
      c3: "rgba(234, 179, 8, 0.25)",
      c4: "rgba(249, 115, 22, 0.25)",
      c5: "rgba(239, 68, 68, 0.25)",
      c6: "rgba(59, 130, 246, 0.25)",
      c1Focus: "#10b981",
      c2Focus: "#14b8a6",
      c3Focus: "#eab308",
      c4Focus: "#f97316",
      c5Focus: "#ef4444",
      c6Focus: "#3b82f6",
    };
  }
  if (normalized.includes("coding") || normalized.includes("algo")) {
    return {
      bg: "rgba(245, 158, 11, 0.05)",
      color: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.08)",
      border: "rgba(245, 158, 11, 0.12)",
      focus: "rgba(245, 158, 11, 0.35)",
      c1: "rgba(245, 158, 11, 0.25)",
      c2: "rgba(249, 115, 22, 0.25)",
      c3: "rgba(234, 179, 8, 0.25)",
      c4: "rgba(239, 68, 68, 0.25)",
      c5: "rgba(168, 85, 247, 0.25)",
      c6: "rgba(16, 185, 129, 0.25)",
      c1Focus: "#f59e0b",
      c2Focus: "#f97316",
      c3Focus: "#eab308",
      c4Focus: "#ef4444",
      c5Focus: "#a855f7",
      c6Focus: "#10b981",
    };
  }
  
  return defaultVal;
};


interface Message {
  sender: "ai" | "user";
  text: string;
  type?: string;
  score?: number;
  feedback?: string;
  isPending?: boolean;
}

function LiveInterviewContent() {
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

  // Interview Session states
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // DOM Refs
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [userAnswer]);

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

  // Fetch authentication and session data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
    }

    // Fetch user details for navbar
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

    // Fetch the active interview session
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
          if (session.status === "completed") {
            router.push(`/interview/results?id=${id}`);
            return;
          }

          setCompany(session.company);
          setRole(session.role);
          setTotalQuestions(session.totalQuestions);
          setCurrentQuestionIndex(session.currentQuestionIndex);

          // Restore elapsed time from session's createdAt timestamp
          if (session.createdAt) {
            const startTime = new Date(session.createdAt).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - startTime) / 1000);
            setElapsedTime(elapsedSeconds > 0 ? elapsedSeconds : 0);
          }

          // Rebuild message log history
          const reconstructedMsgs: Message[] = [];
          session.questions.forEach((q: any) => {
            reconstructedMsgs.push({
              sender: "ai",
              text: q.questionText,
              type: q.type,
            });
            if (q.userAnswer) {
              reconstructedMsgs.push({
                sender: "user",
                text: q.userAnswer,
                score: q.score,
                feedback: q.feedback,
              });
            }
          });

          setMessages(reconstructedMsgs);
        } else {
          toast.error(data.message || "Failed to load session details.");
          router.push("/interview/setup");
        }
      })
      .catch(() => {
        toast.error("Network error loading interview session.");
        router.push("/interview/setup");
      })
      .finally(() => {
        setIsLoadingSession(false);
      });
  }, [id]);

  // Timer Effect
  useEffect(() => {
    if (!isLoadingSession && !isAiTyping) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isLoadingSession, isAiTyping]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const ans = userAnswer.trim();
    if (!ans || isAiTyping || !id) return;

    const userMsgIndex = messages.length;
    setMessages((p) => [
      ...p,
      {
        sender: "user",
        text: ans,
        isPending: true,
      },
    ]);
    setUserAnswer("");
    setIsAiTyping(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/interviews/${id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answer: ans }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[userMsgIndex] = {
            ...updated[userMsgIndex],
            isPending: false,
            score: data.evaluation.score,
            feedback: data.evaluation.feedback,
          };
          return updated;
        });

        if (data.isEnded) {
          toast.success("Interview completed! Loading report...");
          setTimeout(() => {
            router.push(`/interview/results?id=${id}`);
          }, 1000);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: data.nextQuestion.questionText,
              type: data.nextQuestion.type,
            },
          ]);
          setCurrentQuestionIndex(data.currentQuestionIndex);
        }
      } else {
        toast.error(data.message || "Failed to evaluate answer.");
        setMessages((prev) => prev.filter((_, i) => i !== userMsgIndex));
        setUserAnswer(ans);
      }
    } catch (err) {
      toast.error("Network error submitting answer.");
      setMessages((prev) => prev.filter((_, i) => i !== userMsgIndex));
      setUserAnswer(ans);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Block navigation during active interview
  const blockNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.error("Please end the session first before navigating away.");
  };

  // Warn on browser refresh/close and block ALL link clicks globally
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    // Intercept any <a> click on the page (catches footer, external links, etc.)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.getAttribute("href") !== "#") {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Please end the session first before navigating away.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleGlobalClick, true);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  const forceEndSession = () => {
    if (confirm("Are you sure you want to end this interview early? Your answers up to this point will not be finalized.")) {
      router.push("/interview/setup");
    }
  };

  if (isLoadingSession) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px", color: "var(--text-secondary)" }}>
        <IconSpinner />
        <p>Loading active mock interview...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HomeBackdrop />

      {/* ── Navbar ── */}
      <nav className={`${nav.nav} ${scrolled ? nav.navScrolled : ""} ${navHidden ? nav.navHidden : ""}`}>
        <div className={nav.navInner}>
          <Link href="/" className={nav.navLogo} onClick={blockNavigation}>
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
            <Link href="/resume" className={nav.navLink} onClick={blockNavigation}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={`${nav.navLink} ${nav.navActive || ""}`} style={{ color: "var(--domain-interview)" }} onClick={blockNavigation}>Mock Interview</Link>
            <Link href="/profile" className={nav.navLink} onClick={blockNavigation}>Profile</Link>
          </div>

          <div className={nav.navActions}>
            <Link href="/profile" className={nav.navBtnGhost} style={{ paddingLeft: "6px", paddingRight: "16px" }} onClick={blockNavigation}>
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
            <Link href="/resume" className={nav.mobileLink} onClick={(e) => { blockNavigation(e); setMobileMenu(false); }}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={nav.mobileLink} onClick={(e) => { blockNavigation(e); setMobileMenu(false); }} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.mobileLink} onClick={(e) => { blockNavigation(e); setMobileMenu(false); }}>Profile</Link>
          </div>
        )}
      </nav>

      {/* ── Main Layout Content ── */}
      <main className={styles.layout}>
        <div className={styles.consoleCard}>


          <div className={styles.chatLayout}>
            {/* Unified Console Header */}
            <div className={styles.chatHeader}>
              <div className={styles.chatMeta}>
                <div className={styles.metaLeft}>
                  <div>
                    <div className={styles.metaCompany}>
                      HireMate AI — {fullName ? fullName.split(" ")[0] : "Candidate"} · {role}
                    </div>
                    <div className={styles.metaRole}>
                      {([...messages].reverse().find(m => m.sender === "ai")?.type || "Technical")} round · {totalQuestions} questions
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div className={`${styles.timer} ${(totalQuestions * 120 - elapsedTime <= 60) ? styles.timerWarning : ""}`}>
                    <IconClock /> {formatTime(elapsedTime)}
                  </div>
                  <button className={styles.endBtn} onClick={forceEndSession}>
                    End session
                  </button>
                </div>
              </div>

              {/* Progress Container inside header */}
              <div className={styles.progressContainer}>
                {/* Progress Info Row */}
                <div className={styles.progressInfoRow}>
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% complete</span>
                </div>

                {/* Segmented Progress Bar */}
                <div className={styles.segmentedProgressBar}>
                  {Array.from({ length: totalQuestions }).map((_, i) => {
                    const isFilled = i <= currentQuestionIndex;
                    const segHue = totalQuestions > 1 ? (i / (totalQuestions - 1)) * 120 : 120;
                    const segColor = `hsl(${segHue}, 85%, 45%)`;
                    return (
                      <div
                        key={i}
                        className={`${styles.segment} ${isFilled ? styles.segmentFilled : ""}`}
                        style={isFilled ? {
                          background: segColor,
                          boxShadow: `0 0 8px ${segColor}`,
                        } : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Message Feed */}
            <div className={styles.chatMessages} ref={chatMessagesRef}>
              {(() => {
                let aiCount = 0;
                return messages.map((m, idx) => {
                  let questionDivider = null;
                  if (m.sender === "ai") {
                    aiCount++;
                    const typeTheme = getQuestionTypeStyles(m.type);
                    questionDivider = (
                      <div
                        key={`div-${idx}`}
                        className={styles.questionSeparator}
                        style={{
                          "--badge-bg": typeTheme.bg,
                          "--badge-color": typeTheme.color,
                          "--badge-glow": typeTheme.glow,
                        } as React.CSSProperties}
                      >
                        <div className={styles.separatorLine} />
                        <div className={styles.separatorTextBadge}>
                          {getQuestionTypeIcon(m.type)}
                          <span>Question {aiCount} {m.type ? `· ${m.type}` : ""}</span>
                        </div>
                        <div className={styles.separatorLine} />
                      </div>
                    );
                  }
                  return (
                    <React.Fragment key={idx}>
                      {questionDivider}
                      <div className={`${styles.msg} ${m.sender === "user" ? styles.msgUser : ""}`}>
                        <div className={`${styles.avatar} ${m.sender === "ai" ? styles.avatarAi : styles.avatarUser}`}>
                          {m.sender === "ai" ? (
                            "AI"
                          ) : avatar ? (
                            <img src={avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            userInitials
                          )}
                        </div>
                        <div className={styles.msgBody}>
                          {m.sender === "ai" && m.type && <div className={styles.qBadge}>{m.type}</div>}
                          <div className={`${styles.bubble} ${m.sender === "ai" ? styles.bubbleAi : styles.bubbleUser}`}>
                            {m.text}
                          </div>
                          {m.sender === "user" && m.score !== undefined && (
                            <div style={{ alignSelf: "flex-end", marginTop: "4px" }}>
                              {(() => {
                                const scoreInfo = getScoreDetails(m.score);
                                return (
                                  <span className={`${styles.scorePill} ${styles[scoreInfo.style]}`}>
                                    {scoreInfo.icon}
                                    <span>{scoreInfo.label} · {m.score}/100</span>
                                  </span>
                                );
                              })()}
                            </div>
                          )}
                          {m.sender === "user" && m.isPending && (
                            <div style={{ alignSelf: "flex-end", marginTop: "4px", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <IconSpinner /> Grading response...
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                });
              })()}

              {isAiTyping && (
                <div className={styles.msg}>
                  <div className={`${styles.avatar} ${styles.avatarAi}`}>AI</div>
                  <div className={styles.typing}>
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                    <div className={styles.dot} />
                  </div>
                </div>
              )}
            </div>

            {/* Text Input composer */}
            <div className={styles.inputSection}>
              {(() => {
                const activeQuestionType = [...messages].reverse().find(m => m.sender === "ai")?.type || "Technical";
                const typeTheme = getQuestionTypeStyles(activeQuestionType);
                return (
                  <form className={styles.chatInputAreaForm} onSubmit={handleSend}>
                    <div
                      className={styles.chatInputContainer}
                      style={{
                        "--active-type-border": typeTheme.border,
                        "--active-type-focus": typeTheme.focus,
                        "--active-type-color": typeTheme.color,
                        "--active-gradient-c1": typeTheme.c1,
                        "--active-gradient-c2": typeTheme.c2,
                        "--active-gradient-c3": typeTheme.c3,
                        "--active-gradient-c4": typeTheme.c4,
                        "--active-gradient-c5": typeTheme.c5,
                        "--active-gradient-c6": typeTheme.c6,
                        "--active-gradient-c1-focus": typeTheme.c1Focus,
                        "--active-gradient-c2-focus": typeTheme.c2Focus,
                        "--active-gradient-c3-focus": typeTheme.c3Focus,
                        "--active-gradient-c4-focus": typeTheme.c4Focus,
                        "--active-gradient-c5-focus": typeTheme.c5Focus,
                        "--active-gradient-c6-focus": typeTheme.c6Focus,
                      } as React.CSSProperties}
                    >
                      <textarea
                        ref={textareaRef}
                        placeholder={isAiTyping ? "AI is processing..." : "Type your answer here..."}
                        rows={1}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                          }
                        }}
                        disabled={isAiTyping}
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.sendBtn}
                      style={{
                        "--active-type-color": typeTheme.color,
                        "--active-type-focus": typeTheme.focus,
                      } as React.CSSProperties}
                      disabled={isAiTyping || !userAnswer.trim()}
                      aria-label="Submit answer"
                    >
                      Submit
                    </button>
                  </form>
                );
              })()}
              <div className={styles.inputHelper}>
                <span className={styles.keyBadge}>Enter</span> to send
                <span className={styles.helperDot}>·</span>
                <span className={styles.keyBadge}>Shift + Enter</span> for new line
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function LiveInterviewPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "12px", color: "var(--text-secondary)" }}>
        <IconSpinner />
        <p>Loading workspace...</p>
      </div>
    }>
      <LiveInterviewContent />
    </Suspense>
  );
}
