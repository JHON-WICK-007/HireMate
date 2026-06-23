"use client";

import { useState, useEffect, useRef, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import ThemeToggle from "../../components/ThemeToggle";
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
  const messageEndRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
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


          <div className={styles.chatLayout}>
            {/* Header metadata */}
            <div className={styles.chatMeta}>
              <div className={styles.metaLeft}>
                <div className={styles.aiDot} />
                <div>
                  <div className={styles.metaCompany}>HireMate AI — {company} {role}</div>
                  <div className={styles.metaRole}>Question {currentQuestionIndex + 1} of {totalQuestions}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className={styles.timer}>
                  <IconClock /> {formatTime(elapsedTime)}
                </div>
                <button className={styles.endBtn} onClick={forceEndSession}>
                  End session
                </button>
              </div>
            </div>

            {/* Progress bar fill */}
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} />
            </div>

            {/* Message Feed */}
            <div className={styles.chatMessages}>
              {messages.map((m, idx) => (
                <div key={idx} className={`${styles.msg} ${m.sender === "user" ? styles.msgUser : ""}`}>
                  <div className={`${styles.avatar} ${m.sender === "ai" ? styles.avatarAi : styles.avatarUser}`}>
                    {m.sender === "ai" ? "AI" : userInitials}
                  </div>
                  <div className={styles.msgBody}>
                    {m.sender === "ai" && m.type && <div className={styles.qBadge}>{m.type}</div>}
                    <div className={`${styles.bubble} ${m.sender === "ai" ? styles.bubbleAi : styles.bubbleUser}`}>
                      {m.text}
                    </div>
                    {m.sender === "user" && m.score !== undefined && (
                      <div style={{ alignSelf: "flex-end", marginTop: "4px" }}>
                        <span className={styles.scorePill}>
                          <IconCheck /> Score: {m.score}/100
                        </span>
                      </div>
                    )}
                    {m.sender === "user" && m.isPending && (
                      <div style={{ alignSelf: "flex-end", marginTop: "4px", fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <IconSpinner /> Grading response...
                      </div>
                    )}
                  </div>
                </div>
              ))}

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
              <div ref={messageEndRef} />
            </div>

            {/* Text Input composer */}
            <form className={styles.chatInputArea} onSubmit={handleSend}>
              <textarea
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
              <button type="submit" className={styles.sendBtn} disabled={isAiTyping || !userAnswer.trim()} aria-label="Send answer">
                <IconArrowUp />
              </button>
            </form>
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
