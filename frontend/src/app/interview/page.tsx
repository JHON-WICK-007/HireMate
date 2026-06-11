"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./interview.module.css";
import ShaderBackground from "../components/ShaderBackground";

interface Message {
  id: string;
  sender: "ai" | "user";
  name: string;
  time: string;
  text: string;
  isStreaming?: boolean;
}

const interviewQuestions = [
  "Welcome! Let's get started. To begin, could you tell me about a time you had to handle a major conflict within a design or development team? How did you resolve it and what was the outcome?",
  "That is a great example of team collaboration. Following up on that, how do you handle cross-functional disagreements regarding moving to a new technology or design system mid-project when timelines are tight?",
  "Understood. Let's pivot to user experience. How do you balance high-fidelity visuals and aesthetic styling with performance, quick load times, and accessibility requirements in modern SaaS platforms?",
  "Excellent response. Lastly, how do you ensure that your design handoffs to frontend engineers are clean, and what workflows do you establish to make sure the final coded UI matches your mockup precisely?"
];

const mockUserAnswers = [
  "In my previous role at PixelSync, we had a fundamental disagreement about moving to a new design system mid-project. Half the team felt it was too risky, while others felt our current system was failing. I organized a cross-functional workshop to map out the risks, aligned our engineering leads, and we decided on an incremental migration path that kept our release on track.",
  "When handling timeline-sensitive changes, I establish a transparent risk matrix. For instance, in our last project, we did a side-by-side performance review of the old vs. new system. By showing the product managers that the new structure would reduce future refactoring time by 40%, we secured an extra week to complete the core components.",
  "Balancing visuals and speed is about asset optimization and strict CSS principles. I focus on CSS Modules or Tailwind to keep stylesheet sizes minimal, leverage WebGL or custom shaders only for high-impact header spots, and use lazy loading for complex interactive components so the core interactive speed isn't blocked.",
  "Clean handoffs require clear design tokens. I build unified libraries in Figma, document spacing grids, and use automated tools to generate styling structures. We also run design QA sessions where we inspect the coded interface inside browser development tools to double check fine pixel gaps before releasing."
];

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      name: "AI Coach (Alex)",
      time: "10:42 AM",
      text: "Welcome! Let's get started. To begin, could you tell me about a time you had to handle a major conflict within a design or development team? How did you resolve it and what was the outcome?"
    }
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  
  // Audio waveform heights array
  const [waveformHeights, setWaveformHeights] = useState<number[]>(new Array(30).fill(5));
  const [timerText, setTimerText] = useState("14:32");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const transcriptionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll chat history on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Session timer counter
  useEffect(() => {
    let totalSeconds = 872; // Start from 14:32
    const interval = setInterval(() => {
      totalSeconds++;
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      setTimerText(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Audio Waveform Animation Loop
  useEffect(() => {
    let active = true;
    const animateWaveform = () => {
      if (!active) return;
      
      setWaveformHeights(prev => 
        prev.map(() => {
          let multiplier = 5; // Idle state
          if (isRecording && !micMuted) {
            multiplier = 45; // User speaking
          } else if (isAiSpeaking) {
            multiplier = 35; // AI speaking
          }
          return Math.random() * multiplier + 5;
        })
      );
      
      setTimeout(() => {
        requestAnimationFrame(animateWaveform);
      }, 90);
    };
    
    animateWaveform();
    return () => {
      active = false;
    };
  }, [isRecording, isAiSpeaking, micMuted]);

  // Start AI speaking visualization on mount or new question
  useEffect(() => {
    setIsAiSpeaking(true);
    const timer = setTimeout(() => {
      setIsAiSpeaking(false);
    }, 4000); // AI speaks for 4s
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  // Handle Speech Toggle / Simulation
  const handleMicClick = () => {
    if (isThinking || isAiSpeaking) return;

    if (isRecording) {
      // If user stops recording manually early, trigger submission
      if (transcriptionTimerRef.current) {
        clearInterval(transcriptionTimerRef.current);
      }
      finalizeAnswer();
    } else {
      // Start mock transcription
      setIsRecording(true);
      
      const answerText = mockUserAnswers[currentQuestionIndex] || "I agree with that perspective. In my experience, setting up modular styling modules and optimizing assets ensures that the UI renders flawlessly without any performance lags.";
      const words = answerText.split(" ");
      let currentWordIndex = 0;
      
      const newMsgId = `user-msg-${Date.now()}`;
      
      // Add initial user message block
      setMessages(prev => [
        ...prev,
        {
          id: newMsgId,
          sender: "user",
          name: "You (Alex Johnson)",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "",
          isStreaming: true
        }
      ]);

      // Stream words in slowly to simulate transcription
      transcriptionTimerRef.current = setInterval(() => {
        if (currentWordIndex < words.length) {
          const streamedText = words.slice(0, currentWordIndex + 1).join(" ");
          setMessages(prev => 
            prev.map(m => m.id === newMsgId ? { ...m, text: streamedText } : m)
          );
          currentWordIndex++;
        } else {
          if (transcriptionTimerRef.current) {
            clearInterval(transcriptionTimerRef.current);
          }
          finalizeAnswer();
        }
      }, 250);
    }
  };

  const finalizeAnswer = () => {
    setIsRecording(false);
    // Mark streaming as completed
    setMessages(prev => prev.map(m => m.isStreaming ? { ...m, isStreaming: false } : m));
    
    // Trigger AI thinking/response logic
    setIsThinking(true);
    
    setTimeout(() => {
      setIsThinking(false);
      
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < interviewQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-msg-${Date.now()}`,
            sender: "ai",
            name: "AI Coach (Alex)",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: interviewQuestions[nextIndex]
          }
        ]);
      } else {
        // End of questions
        setMessages(prev => [
          ...prev,
          {
            id: `ai-msg-end`,
            sender: "ai",
            name: "AI Coach (Alex)",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: "Excellent! We have covered all the core questions for today's session. I will now analyze your speech cadence, body language, and answers to generate your interview scorecard. Click 'End Session' to view your results."
          }
        ]);
      }
    }, 3200);
  };

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerList = {
    visible: { transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className={styles.page}>
      {/* 3D WebGL Shader interactive background */}
      <ShaderBackground dim={0.4} />

      {/* ─── Header ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brandGroup}>
            <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#headerLogoGrad)" />
                <path d="M12 14h16M12 20h10M12 26h14" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="headerLogoGrad" x1="0" y1="0" x2="40" y2="40">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#c6c6c7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={styles.logoText}>HireMate AI</span>
            </Link>
            <div className={styles.divider} />
            <div className={styles.sessionMeta}>
              <span className={styles.sessionStatus}>SESSION IN PROGRESS</span>
              <span className={styles.sessionTitle}>Senior Product Designer Interview</span>
            </div>
          </div>

          <div className={styles.progressContainer}>
            <div className={styles.progressLabel}>
              <span>Question {currentQuestionIndex + 1} of 4</span>
              <span>{Math.round(((currentQuestionIndex + (isThinking ? 1 : 0)) / 4) * 100)}% Complete</span>
            </div>
            <div className={styles.progressBarTrack}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${((currentQuestionIndex + (isThinking ? 1 : 0)) / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content Layout ───────────────────────────── */}
      <main className={styles.main}>
        
        {/* Left Column - Video Feeds */}
        <motion.section 
          className={styles.leftColumn}
          initial="hidden"
          animate="visible"
          variants={panelVariants}
        >
          {/* AI Coach Feed */}
          <div className={`${styles.glassPanel} ${styles.interviewerCard}`}>
            <img 
              className={styles.interviewerImg} 
              src="/coach-alex.png" 
              alt="AI Coach Alex"
            />
            <div className={styles.cardGradientOverlay} />
            
            <div className={styles.interviewerOverlayContent}>
              <div className={styles.statusIndicator}>
                <div className={isAiSpeaking ? styles.pulseDot : styles.recordingPulseDot} />
                <span className={styles.statusText}>
                  {isAiSpeaking ? "AI INTERVIEWER SPEAKING" : isRecording ? "RECORDING RESPONSE" : "AI COACH ACTIVE"}
                </span>
              </div>
              
              {/* Waveform Visualization */}
              <div className={styles.waveformContainer}>
                {waveformHeights.map((h, i) => (
                  <div 
                    key={i} 
                    className={`${styles.waveformBar} ${
                      isRecording ? styles.waveformListening : isAiSpeaking ? styles.waveformActive : ""
                    }`}
                    style={{ 
                      height: `${h}px`,
                      opacity: isRecording || isAiSpeaking ? (h / 55) : 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Self Preview Feed */}
          <div className={`${styles.glassPanel} ${styles.selfPreviewCard}`}>
            {cameraOff ? (
              <div className="absolute inset-0 bg-surface-dark flex items-center justify-center text-text-secondary text-sm">
                Camera is off
              </div>
            ) : (
              <img 
                className={`${styles.selfPreviewImg} ${!micMuted ? styles.selfPreviewImgActive : ""}`} 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                alt="Your camera feed preview"
              />
            )}
            <div className={styles.selfPreviewGlow} />
            
            {/* Quick mute control toggles */}
            <div className={styles.previewIcons}>
              <button 
                className={`${styles.previewIconBtn} ${micMuted ? styles.previewIconBtnMuted : styles.previewIconBtnActive}`}
                onClick={() => setMicMuted(!micMuted)}
                title={micMuted ? "Unmute Mic" : "Mute Mic"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {micMuted ? (
                    <>
                      <line x1="1" y1="1" x2="23" y2="23" />
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </>
                  )}
                </svg>
              </button>
              
              <button 
                className={`${styles.previewIconBtn} ${cameraOff ? styles.previewIconBtnMuted : styles.previewIconBtnActive}`}
                onClick={() => setCameraOff(!cameraOff)}
                title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {cameraOff ? (
                    <>
                      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10l-3.5-2.5" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  ) : (
                    <>
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className={styles.selfNameLabel}>You (Alex Johnson)</div>
          </div>
        </motion.section>

        {/* Right Column - Live Transcript & Chat */}
        <motion.section 
          className={`${styles.glassPanel} ${styles.rightColumn}`}
          initial="hidden"
          animate="visible"
          variants={panelVariants}
        >
          <div className={styles.chatHeader}>
            <h3 className={styles.chatTitle}>Live Transcript</h3>
            <div className={styles.chatActions}>
              <button className={styles.iconBtn} aria-label="Settings">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
              <button className={styles.iconBtn} aria-label="More Options">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.chatHistory}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.messageRow} ${msg.sender === "ai" ? styles.aiMessage : styles.userMessage}`}
                >
                  <div className={styles.bubbleMeta}>
                    {msg.sender === "ai" ? (
                      <>
                        <span className={styles.aiMetaName}>{msg.name}</span>
                        <span>{msg.time}</span>
                      </>
                    ) : (
                      <>
                        <span>{msg.time}</span>
                        <span className={styles.userMetaName}>{msg.name}</span>
                      </>
                    )}
                  </div>
                  
                  <div className={`${styles.bubble} ${msg.sender === "ai" ? styles.aiBubble : styles.userBubble}`}>
                    <p>{msg.text}</p>
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-black animate-pulse" />
                    )}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className={`${styles.messageRow} ${styles.aiMessage}`}>
                  <div className={styles.bubbleMeta}>
                    <span className={styles.aiMetaName}>AI Coach (Alex)</span>
                  </div>
                  <div className={`${styles.bubble} ${styles.thinkingBubble}`}>
                    <div className={styles.loaderText}>
                      <span>Analyzing response...</span>
                      <div className={styles.dots}>
                        <div className={`${styles.dot}`} />
                        <div className={`${styles.dot} ${styles.dot2}`} />
                        <div className={`${styles.dot} ${styles.dot3}`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>
        </motion.section>
      </main>

      {/* ─── Footer Controls ────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          
          {/* Timer and microphone status */}
          <div className={styles.footerStats}>
            <div className={styles.statGroup}>
              <span className={styles.statLabel}>SESSION TIMER</span>
              <span className={styles.statValue}>{timerText}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.statGroup}>
              <span className={styles.statLabel}>INPUT STATUS</span>
              <span className={styles.statValue} style={{ color: micMuted ? "var(--error)" : "var(--success)" }}>
                {micMuted ? "MUTED" : "LIVE"}
              </span>
            </div>
          </div>

          {/* Central speak button */}
          <div className={styles.micCenter}>
            <button 
              className={`${styles.micBtn} ${isRecording ? styles.micBtnActive : ""}`} 
              onClick={handleMicClick}
              disabled={isThinking || isAiSpeaking}
              style={{ opacity: (isThinking || isAiSpeaking) ? 0.6 : 1 }}
              aria-label="Tap to speak"
            >
              <div className={styles.micBtnHoverEffect} />
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
            <span className={`${styles.micLabel} ${isRecording ? styles.micLabelActive : ""}`}>
              {isRecording ? "TAP TO FINISH" : "TAP TO SPEAK"}
            </span>
          </div>

          {/* Controls right */}
          <div className={styles.footerActions}>
            <button 
              className={styles.btnSecondary}
              onClick={() => {
                if (isThinking || isAiSpeaking || isRecording) return;
                // Simply skip to next question
                setIsThinking(true);
                setTimeout(() => {
                  setIsThinking(false);
                  const nextIndex = currentQuestionIndex + 1;
                  if (nextIndex < interviewQuestions.length) {
                    setCurrentQuestionIndex(nextIndex);
                    setMessages(prev => [
                      ...prev,
                      {
                        id: `ai-msg-skipped-${Date.now()}`,
                        sender: "ai",
                        name: "AI Coach (Alex)",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        text: interviewQuestions[nextIndex]
                      }
                    ]);
                  }
                }, 1000);
              }}
            >
              Skip Question
            </button>
            <Link 
              href="/resume" 
              className={styles.btnDanger}
              style={{ textDecoration: "none" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 22s-1-4-5-4H7c-4 0-5 4-5 4V2h20v20z" />
              </svg>
              End Session
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
