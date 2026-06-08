"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./home.module.css";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      fetch(`${API_URL}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      })
      .catch(() => {
        // Fallback: keep logged in state if fetch fails
      });
    }
  }, []);

  const handleSignOut = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "AI Mock Interviews",
      description: "Practice with an AI interviewer tailored to your target company, role, and experience level. Get real-time feedback.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/>
          <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Resume Analysis",
      description: "Upload your resume and get instant ATS scoring, skill gap analysis, and actionable improvement suggestions.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="16 18 22 12 16 6" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="8 6 2 12 8 18" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="14" y1="4" x2="10" y2="20" strokeLinecap="round"/>
        </svg>
      ),
      title: "Coding Playground",
      description: "Solve coding challenges in a real editor with syntax highlighting, AI code review, and complexity analysis.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Career Roadmaps",
      description: "Get personalized learning paths with skill milestones, project ideas, and resource recommendations.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 20V10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 20V4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20v-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Performance Analytics",
      description: "Track your progress with detailed dashboards showing scores, trends, and improvement areas over time.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Voice Interviews",
      description: "Speak your answers naturally with voice-to-text transcription for a realistic interview simulation.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Sign up and tell us about your skills, experience, and career goals.",
    },
    {
      number: "02",
      title: "Upload Your Resume",
      description: "Get instant AI analysis with ATS scoring and improvement tips.",
    },
    {
      number: "03",
      title: "Practice Interviews",
      description: "Take mock interviews tailored to your target role and company.",
    },
    {
      number: "04",
      title: "Land Your Dream Job",
      description: "Track progress, refine skills, and walk into interviews with confidence.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Mock Interviews" },
    { value: "95%", label: "User Satisfaction" },
    { value: "2.5K+", label: "Users Active" },
    { value: "50+", label: "Companies Covered" },
  ];

  return (
    <div className={styles.page}>
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""} ${navHidden ? styles.navHidden : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#navLogoGrad)" />
              <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8" />
              <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="var(--logo-grad-start)" />
                  <stop offset="1" stopColor="var(--logo-grad-end)" />
                </linearGradient>
              </defs>
            </svg>
            <span>HireMate AI</span>
          </Link>

          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#how-it-works" className={styles.navLink}>How It Works</a>
            <a href="#stats" className={styles.navLink}>Results</a>
          </div>

          <div className={styles.navActions}>
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link href="/profile" className={styles.navBtnGhost}>
                  {user?.fullName ? `Profile (${user.fullName.split(" ")[0]})` : "Profile"}
                </Link>
                <button onClick={handleSignOut} className={styles.navBtnSolid}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin" className={styles.navBtnGhost}>Sign In</Link>
                <Link href="/auth?mode=signup" className={styles.navBtnSolid}>Get Started</Link>
              </>
            )}
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen1 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen2 : ""}`} />
            <span className={`${styles.hamburgerLine} ${mobileMenu ? styles.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className={styles.mobileMenu}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
              <span className={styles.mobileLink} style={{ margin: 0 }}>Theme</span>
              <ThemeToggle />
            </div>
            <div className={styles.mobileDivider} />
            <a href="#features" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#how-it-works" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>How It Works</a>
            <a href="#stats" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Results</a>
            <div className={styles.mobileDivider} />
            {isLoggedIn ? (
              <>
                <Link href="/profile" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
                <button onClick={() => { handleSignOut(); setMobileMenu(false); }} className={styles.navBtnSolid} style={{ width: "100%", textAlign: "center", cursor: "pointer" }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/auth?mode=signin" className={styles.mobileLink} onClick={() => setMobileMenu(false)}>Sign In</Link>
                <Link href="/auth?mode=signup" className={styles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={() => setMobileMenu(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroGrid} />

        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            AI-Powered Interview Platform
          </div>

          <h1 className={styles.heroTitle}>
            Prepare Smarter.
            <br />
            <span className={styles.heroTitleAccent}>Interview Better.</span>
            <br />
            Land Faster.
          </h1>

          <p className={styles.heroSubtitle}>
            HireMate AI gives you mock interviews, resume analysis, coding practice,
            and career roadmaps — all powered by AI that adapts to your goals.
          </p>

          <div className={styles.heroCtas}>
            <Link href="/auth?mode=signup" className={styles.heroCtaPrimary}>
              Start Practicing Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a href="#features" className={styles.heroCtaSecondary}>
              See How It Works
            </a>
          </div>

          <div className={styles.heroProof}>
            <div className={styles.heroAvatars}>
              {[
                "https://randomuser.me/api/portraits/women/44.jpg",
                "https://randomuser.me/api/portraits/men/32.jpg",
                "https://randomuser.me/api/portraits/women/68.jpg",
                "https://randomuser.me/api/portraits/men/75.jpg",
                "https://randomuser.me/api/portraits/women/90.jpg",
              ].map((src, i) => (
                <img
                  key={i}
                  className={styles.heroAvatar}
                  src={src}
                  alt={`User ${i + 1}`}
                  style={{ zIndex: 5 - i, marginLeft: i > 0 ? "-10px" : 0 }}
                />
              ))}
            </div>
            <p className={styles.heroProofText}>
              <strong>2,500+</strong> developers already preparing
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features Section ───────────────────────────────── */}
      <section className={styles.features} id="features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Features</span>
            <h2 className={styles.sectionTitle}>Everything you need to ace your next interview</h2>
            <p className={styles.sectionSubtitle}>
              From resume review to live mock interviews — one platform, zero guesswork.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {features.map((feature, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────── */}
      <section className={styles.howItWorks} id="how-it-works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>How It Works</span>
            <h2 className={styles.sectionTitle}>Four steps to interview confidence</h2>
          </div>

          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                {i < steps.length - 1 && <div className={styles.stepConnector} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ──────────────────────────────────── */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.sectionInner}>
          <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to land your dream job?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of developers who are preparing smarter with HireMate AI.
              Start for free — no credit card required.
            </p>
            <Link href="/auth?mode=signup" className={styles.ctaButton}>
              Get Started for Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#ftLogoGrad)" />
                  <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="ftLogoGrad" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="var(--logo-grad-start)" />
                      <stop offset="1" stopColor="var(--logo-grad-end)" />
                    </linearGradient>
                  </defs>
                </svg>
                <span>HireMate AI</span>
              </Link>
              <p className={styles.footerTagline}>
                Intelligent interview preparation & career development platform.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Product</h4>
                <a href="#features">Mock Interviews</a>
                <a href="#features">Resume Analysis</a>
                <a href="#features">Coding Practice</a>
                <a href="#features">Career Roadmaps</a>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className={styles.footerCol}>
                <h4 className={styles.footerColTitle}>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 HireMate AI. All rights reserved.</p>
            <div className={styles.footerSocials}>
              <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
