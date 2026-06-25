"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./contact.module.css";
import homeStyles from "../home.module.css";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import { motion } from "framer-motion";

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
const IconMail = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const IconMapPin = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>;

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
      toast.success("Message sent! We'll get back to you shortly.");
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
        <div className={styles.heroGlow} />
        <div className={`${styles.heroOrb} ${styles.heroOrb1}`} />
        <div className={`${styles.heroOrb} ${styles.heroOrb2}`} />

        <motion.div
          className={styles.container}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <div className={styles.grid}>
            {/* Left Column: Info Card */}
            <motion.div className={styles.infoCard} variants={fadeInUp}>
              <div className={styles.titleBadge}>
                <span className={styles.titleBadgeDot} />
                Contact Support
              </div>
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
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <SiteFooter showCta={false} />
    </main>
  );
}
