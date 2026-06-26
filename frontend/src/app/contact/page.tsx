"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./contact.module.css";
import homeStyles from "../home.module.css";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { motion, AnimatePresence } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Icons
const IconMail = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IconMapPin = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconClock = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;

export default function ContactPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sync navbar scroll
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
    window.addEventListener("scroll", handleScroll);

    // Fetch user details
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setIsLoggedIn(true);
            setUser(data.user);
            setFormData((prev) => ({
              ...prev,
              name: data.user.fullName || "",
              email: data.user.email || ""
            }));
          }
        })
        .catch(() => {});
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: ""
      }));
    }, 1500);
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <main className={styles.main}>
      <HomeBackdrop />
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className={`${homeStyles.nav} ${scrolled ? homeStyles.navScrolled : ""} ${navHidden ? homeStyles.navHidden : ""}`}>
        <div className={homeStyles.navInner}>
          <Link href="/" className={homeStyles.navLogo}>
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

          <div className={homeStyles.navLinks}>
            <Link href="/resume" className={homeStyles.navLink}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={homeStyles.navLink}>Mock Interview</Link>
            <Link href="/pricing" className={homeStyles.navLink}>Pricing</Link>
            <Link href="/contact" className={homeStyles.navLink} style={{ color: "var(--text-primary)" }}>Contact Us</Link>
          </div>

          <div className={homeStyles.navActions} suppressHydrationWarning>
            <div className="auth-logged-in-only">
              <Link
                href="/profile"
                className={homeStyles.navBtnGhost}
                style={{
                  width: "136px",
                  paddingLeft: "6px",
                  paddingRight: "16px",
                  justifyContent: "flex-start"
                }}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid var(--border-default)"
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
                      color: "var(--text-primary)"
                    }}
                  >
                    {initials}
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
                  {user?.fullName ? user.fullName.split(" ")[0] : "Profile"}
                </span>
              </Link>
            </div>

            <div className="auth-logged-out-only">
              <Link href="/auth?mode=signin" className={homeStyles.navBtnGhost}>Sign In</Link>
              <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid}>Get Started</Link>
            </div>
          </div>

          <button
            className={homeStyles.hamburger}
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Menu"
          >
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen1 : ""}`} />
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen2 : ""}`} />
            <span className={`${homeStyles.hamburgerLine} ${mobileMenu ? homeStyles.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {mobileMenu && (
          <div className={homeStyles.mobileMenu}>
            <Link href="/resume" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Mock Interview</Link>
            <Link href="/pricing" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Pricing</Link>
            <Link href="/contact" className={homeStyles.mobileLink} style={{ color: "var(--text-primary)" }} onClick={() => setMobileMenu(false)}>Contact Us</Link>
            <div className={homeStyles.mobileDivider} />
            {mounted && (
              isLoggedIn ? (
                <Link href="/profile" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
              ) : (
                <>
                  <Link href="/auth?mode=signin" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Sign In</Link>
                  <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={() => setMobileMenu(false)}>Get Started</Link>
                </>
              )
            )}
          </div>
        )}
      </nav>

      {/* ─── Hero / Content Section ─────────────────────────── */}
      <section className={styles.heroSection}>
        <motion.div
          className={styles.container}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className={styles.grid}>
            {/* Left Column: Info Card */}
            <motion.div className={styles.infoCard} variants={fadeInUp}>

              <h1 className={styles.title}>Let&apos;s build your career together</h1>
              <p className={styles.subtitle}>
                Have questions about resume optimization, mock interviews, or enterprise pricing? Reach out to our team, we are ready to assist you.
              </p>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <IconMail />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Email Us</span>
                    <a href="mailto:support@hiremate.ai" className={styles.infoValue}>support@hiremate.ai</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <IconMapPin />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Headquarters</span>
                    <span className={styles.infoValue}>Remote-First, Global Team</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <IconClock />
                  </div>
                  <div className={styles.infoText}>
                    <span className={styles.infoLabel}>Typical Reply Time</span>
                    <span className={styles.infoValue}>Within 2 to 4 hours</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div className={styles.formCard} variants={fadeInUp}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.formTitle}>Send us a message</h2>
                
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="john@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.label}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="How can we help?"
                    autoComplete="off"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.label}>Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Write your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <IconSend />
                    </>
                  )}
                </button>

                <p className={styles.privacyText}>
                  Your data is encrypted and never sold. By sending, you agree to our{" "}
                  <Link href="/privacy" className={styles.privacyLink}>Privacy Policy</Link>
                </p>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className={homeStyles.welcomeOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={homeStyles.welcomeCard}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className={styles.closeBtn}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Left Side: Glowing Lottie */}
              <div className={homeStyles.welcomeLeft}>
                {/* 5 dots row */}
                <div className={homeStyles.dotRow}>
                  <div className={homeStyles.dot} style={{ background: "#fbbf24" }} />
                  <div className={homeStyles.dot} style={{ background: "#22d3ee" }} />
                  <div className={homeStyles.dot} style={{ background: "#f87171" }} />
                  <div className={homeStyles.dot} style={{ background: "#a855f7" }} />
                  <div className={homeStyles.dot} style={{ background: "#34d399" }} />
                </div>
                <div className={homeStyles.lottieWrapper}>
                  <DotLottieReact
                    src="/IQfvNaggtl.json"
                    loop={true}
                    autoplay={true}
                  />
                </div>
              </div>

              {/* Right Side: Details */}
              <div className={homeStyles.welcomeRight}>

                <div className={homeStyles.successBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Message Received</span>
                </div>

                <h2 className={homeStyles.welcomeTitle}>
                  Thanks for reaching out!
                </h2>

                <p className={homeStyles.welcomeDesc}>
                  We have received your message successfully. Our team will review your inquiry and get back to you shortly (typically within 2 to 4 hours).
                </p>

                {/* 3-Column Grid */}
                <div className={homeStyles.welcomeGrid}>
                  <div className={homeStyles.welcomeGridItem} onClick={() => { setShowSuccessModal(false); }} style={{ cursor: "pointer" }}>
                    <div className={homeStyles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <span className={homeStyles.gridItemText}>Replies in 2-4 hours</span>
                  </div>

                  <div className={homeStyles.welcomeGridItem} onClick={() => { setShowSuccessModal(false); router.push("/"); }} style={{ cursor: "pointer" }}>
                    <div className={homeStyles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <span className={homeStyles.gridItemText}>Return to Homepage</span>
                  </div>

                  <div className={homeStyles.welcomeGridItem} onClick={() => { setShowSuccessModal(false); router.push("/resume"); }} style={{ cursor: "pointer" }}>
                    <div className={homeStyles.gridItemIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <span className={homeStyles.gridItemText}>Optimize your Resume</span>
                  </div>
                </div>

                <div className={homeStyles.welcomeActions}>
                  {/* Primary Button */}
                  <button 
                    className={homeStyles.welcomeButton} 
                    onClick={() => { setShowSuccessModal(false); router.push("/"); }}
                    style={{ transform: 'none' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; }}
                  >
                    <span>Go to Dashboard</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Secondary Link */}
                  <button className={homeStyles.exploreLink} onClick={() => setShowSuccessModal(false)}>
                    Stay on this page
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter showCta={false} />
    </main>
  );
}
