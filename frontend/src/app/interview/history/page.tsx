"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";
import { useToast } from "../../components/Toast";
import styles from "../interview.module.css";
import { Calendar, Award, Clock, Play, History, ChevronRight, AlertCircle, Search, HelpCircle } from "lucide-react";

interface QuestionLog {
  questionText: string;
  type: string;
  userAnswer?: string;
  score?: number;
  feedback?: string;
}

interface InterviewSession {
  _id: string;
  company: string;
  role: string;
  level: string;
  questionTypes: string[];
  questions: QuestionLog[];
  currentQuestionIndex: number;
  totalQuestions: number;
  overallScore?: number;
  status: "in-progress" | "completed";
  sessionName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InterviewHistoryPage() {
  const router = useRouter();
  const toast = useToast();
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredInterviews = interviews.filter((session) => {
    const query = searchQuery.toLowerCase();
    return (
      session.role.toLowerCase().includes(query) ||
      session.company.toLowerCase().includes(query) ||
      (session.sessionName && session.sessionName.toLowerCase().includes(query))
    );
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to view your interview history.");
      router.push("/auth?mode=signin");
      return;
    }

    fetchInterviews(token);
  }, [router]);

  const fetchInterviews = (token: string) => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/interviews`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch interview history.");
        }
        return r.json();
      })
      .then((data) => {
        if (data.success) {
          setInterviews(data.interviews || []);
        } else {
          setError(data.message || "Failed to load interviews.");
        }
      })
      .catch((err) => {
        console.error("Fetch interviews error:", err);
        setError(err.message || "A network error occurred.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Date unknown";
    }
  };

  return (
    <div className={styles.page} style={{ minHeight: "100vh" }}>
      <Navbar activePage="interview-history" />
      <HomeBackdrop />

      <main className={styles.historyContainer}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px", color: "var(--text-secondary)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
              <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ fontSize: "1.1rem", color: "#a3a3a3" }}>Loading interview history...</p>
          </div>
        ) : (
          <>
            <h1 className={styles.historyTitle}>Interview History</h1>
            <p className={styles.historySub}>
              Review your past mock interview sessions, scores, and detailed performance feedback.
            </p>

            {interviews.length > 0 && (
              <div className={styles.historyHeaderRow}>
                <div className={styles.searchWrapper}>
                  <input
                    type="text"
                    placeholder="Search by role, company, or session name..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search interviews"
                  />
                  <Search className={styles.searchIcon} size={18} />
                </div>

                <button
                  className={styles.newInterviewBtn}
                  onClick={() => router.push("/interview/setup")}
                >
                  New Interview
                </button>
              </div>
            )}

            <div className={styles.historyList}>
              {error ? (
                <div key="error-card" className={styles.emptyCard} style={{ borderColor: "rgba(239, 68, 68, 0.2)", width: "100%" }}>
                  <div className={styles.emptyIcon} style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.05)" }}>
                    <AlertCircle size={24} />
                  </div>
                  <div className={styles.emptyText} style={{ color: "#ef4444" }}>Error Loading History</div>
                  <p className={styles.emptySubText}>{error}</p>
                  <button
                    className={styles.historyBtnSecondary}
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (token) fetchInterviews(token);
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : interviews.length === 0 ? (
                <div key="empty-card" className={styles.emptyCard} style={{ width: "100%" }}>
                  <div className={styles.emptyIcon}>
                    <History size={24} />
                  </div>
                  <div className={styles.emptyText}>No interview sessions found</div>
                  <p className={styles.emptySubText}>
                    You haven't started any mock interviews yet. Setup your profile and practice to boost your career readiness!
                  </p>
                  <button
                    className={styles.historyBtnPrimary}
                    onClick={() => router.push("/interview/setup")}
                  >
                    Start New Interview
                  </button>
                </div>
              ) : filteredInterviews.length === 0 ? (
                <div key="no-results-card" className={styles.emptyCard} style={{ width: "100%" }}>
                  <div className={styles.emptyIcon}>
                    <Search size={24} />
                  </div>
                  <div className={styles.emptyText}>No matching interviews found</div>
                  <p className={styles.emptySubText}>
                    No results matched "{searchQuery}". Try checking the spelling or search for a different role or company.
                  </p>
                </div>
              ) : (
                filteredInterviews.map((session) => {
                  const isCompleted = session.status === "completed";
                  const displayScore = session.overallScore || 0;
                  
                  // Score ring styling (same logic as optimizer page)
                  const scoreColor = displayScore > 80 ? "#10b981" : displayScore > 60 ? "#f59e0b" : "#ef4444";
                  const scoreGlow = displayScore > 80 ? "rgba(16, 185, 129, 0.45)" : displayScore > 60 ? "rgba(245, 158, 11, 0.45)" : "rgba(239, 68, 68, 0.45)";
                  const gradientStart = displayScore > 80 ? "#34d399" : displayScore > 60 ? "#fbbf24" : "#f43f5e";
                  const gradientEnd = displayScore > 80 ? "#059669" : displayScore > 60 ? "#ea580c" : "#be123c";

                  const radius = 42;
                  const center = 50;
                  const progressPercent = displayScore / 100;
                  const angle = (progressPercent * 2 * Math.PI) - (Math.PI / 2);
                  const indicatorX = center + radius * Math.cos(angle);
                  const indicatorY = center + radius * Math.sin(angle);

                  return (
                    <div
                      key={session._id}
                      className={styles.historyCard}
                      style={{
                        paddingTop: session.sessionName ? "1.05rem" : "1.5rem",
                        paddingBottom: session.sessionName ? "1.05rem" : "1.5rem"
                      }}
                    >
                       <div className={styles.cardLeft}>
                        {session.sessionName ? (
                          <>
                            <div className={styles.cardMainInfo}>
                              <span className={styles.cardRole}>{session.sessionName}</span>
                            </div>
                            <div className={styles.cardMeta} style={{ marginBottom: "0.4rem" }}>
                              <span className={styles.cardMetaItem}>
                                <Calendar size={12} />
                                {formatDate(session.createdAt)}
                              </span>
                              <span className={styles.cardMetaItem}>
                                <Award size={12} />
                                {session.level}
                              </span>
                              <span className={styles.cardMetaItem}>
                                <HelpCircle size={12} />
                                {session.totalQuestions} Questions
                              </span>
                            </div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 500, marginTop: "0.25rem" }}>
                              {session.role} at {session.company}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.cardMainInfo}>
                              <span className={styles.cardRole}>{session.role}</span>
                              <span className={styles.cardCompany}>at {session.company}</span>
                            </div>
                            <div className={styles.cardMeta}>
                              <span className={styles.cardMetaItem}>
                                <Calendar size={12} />
                                {formatDate(session.createdAt)}
                              </span>
                              <span className={styles.cardMetaItem}>
                                <Award size={12} />
                                {session.level}
                              </span>
                              <span className={styles.cardMetaItem}>
                                <HelpCircle size={12} />
                                {session.totalQuestions} Questions
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className={styles.cardMiddle}>
                        <span
                          className={`${styles.statusBadge} ${isCompleted ? styles.statusCompleted : styles.statusInProgress
                            }`}
                        >
                          {isCompleted ? (
                            <>
                              <Award size={12} />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              In Progress
                            </>
                          )}
                        </span>
                      </div>

                      <div className={styles.cardRight}>
                        <div
                          className={styles.historyScoreRing}
                          style={{
                            "--score-color": scoreColor,
                            "--score-glow": scoreGlow
                          } as React.CSSProperties}
                        >
                          <svg className={styles.scoreRingSvg} viewBox="0 0 100 100">
                            <defs>
                              <linearGradient id={`scoreRingGradient-${session._id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={gradientStart} stopOpacity={1} />
                                <stop offset="100%" stopColor={gradientEnd} stopOpacity={1} />
                              </linearGradient>
                            </defs>
                            
                            {isCompleted ? (
                              <>
                                <circle
                                  className={styles.scoreRingOuterOrbit}
                                  cx="50" cy="50" r="48"
                                />
                                <circle
                                  className={styles.scoreRingBg}
                                  cx="50" cy="50" r="42"
                                />
                                <circle
                                  className={styles.scoreRingTrack}
                                  cx="50" cy="50" r="42"
                                />
                                <circle
                                  className={styles.scoreRingFillGlow}
                                  cx="50" cy="50" r="42"
                                  style={{
                                    strokeDasharray: 263.89,
                                    strokeDashoffset: 263.89 - (263.89 * displayScore) / 100,
                                    stroke: `url(#scoreRingGradient-${session._id})`,
                                  } as React.CSSProperties}
                                />
                                <circle
                                  className={styles.scoreRingFill}
                                  cx="50" cy="50" r="42"
                                  style={{
                                    strokeDasharray: 263.89,
                                    strokeDashoffset: 263.89 - (263.89 * displayScore) / 100,
                                    stroke: `url(#scoreRingGradient-${session._id})`,
                                  } as React.CSSProperties}
                                />
                              </>
                            ) : (
                              <>
                                <circle
                                  className={styles.scoreRingOuterOrbit}
                                  cx="50" cy="50" r="48"
                                  style={{ stroke: "rgba(249, 115, 22, 0.08)" }}
                                />
                                <circle
                                  className={styles.scoreRingBg}
                                  cx="50" cy="50" r="42"
                                  style={{ stroke: "rgba(249, 115, 22, 0.03)" }}
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="42"
                                  fill="none"
                                  stroke="#f97316"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeDasharray="30 234"
                                  style={{
                                    animation: "spin-slow 4s linear infinite",
                                    transformOrigin: "center",
                                    opacity: 0.7
                                  }}
                                />
                              </>
                            )}
                          </svg>

                          <div className={styles.scoreBannerInner}>
                            {isCompleted && session.overallScore !== undefined ? (
                              <>
                                <span className={styles.scoreBannerNumber}>{displayScore}</span>
                                <span className={styles.scoreBannerLabel}>Score</span>
                              </>
                            ) : isCompleted ? (
                              <>
                                <span className={styles.scoreBannerNumber} style={{ color: "var(--text-secondary)" }}>—</span>
                                <span className={styles.scoreBannerLabel}>None</span>
                              </>
                            ) : (
                              <Clock size={20} style={{ color: "#f97316", opacity: 0.85 }} />
                            )}
                          </div>
                        </div>

                        {isCompleted ? (
                          <button
                            className={styles.historyBtnSecondary}
                            onClick={() => router.push(`/interview/results?id=${session._id}`)}
                          >
                            View Results
                          </button>
                        ) : (
                          <button
                            className={styles.historyBtnPrimary}
                            onClick={() => router.push(`/interview/live-interview?id=${session._id}`)}
                          >
                            <Play size={14} fill="currentColor" />
                            Resume
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
