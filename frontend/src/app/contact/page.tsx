"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./contact.module.css";
import homeStyles from "../home.module.css";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import Navbar from "../components/Navbar";
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
        .catch(() => { });
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSuccessModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const allFieldsFilled = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Full name check
    const nameRegex = /^[a-zA-Z]+([ \'-][a-zA-Z]+)*$/;
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error("Full name must be between 2 and 50 characters.");
      return;
    }
    if (!nameRegex.test(trimmedName)) {
      toast.error("Full name must contain only letters, spaces, hyphens or apostrophes.");
      return;
    }

    // Email check
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Subject check
    if (trimmedSubject.length > 100) {
      toast.error("Subject cannot exceed 100 characters.");
      return;
    }

    // Message check
    if (trimmedMessage.length < 10) {
      toast.error("Message must be at least 10 characters long.");
      return;
    }
    if (trimmedMessage.length > 2000) {
      toast.error("Message cannot exceed 2000 characters.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      <Navbar activePage="contact" />

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
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
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

                <div className={styles.formGroup} style={{ marginBottom: "-10px" }}>
                  <label htmlFor="message" className={styles.label}>
                    Message *
                    <span className={styles.charHint} style={formData.message.length >= 1900 ? { color: formData.message.length >= 2000 ? "#ef4444" : "#f59e0b" } : undefined}>
                      {formData.message.length}/2000
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.textarea}
                    placeholder="Write your message here..."
                  />
                  {/* Fixed space reserved for warning message to prevent button shifts */}
                  <div style={{ height: "16px", marginTop: "4px", display: "flex", alignItems: "center" }}>
                    {formData.message.length >= 1900 && (
                      <span style={{ color: formData.message.length >= 2000 ? "#ef4444" : "#f59e0b", fontSize: "0.78rem", display: "block" }}>
                        {formData.message.length >= 2000 ? "Character limit reached." : `Only ${2000 - formData.message.length} characters left.`}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !allFieldsFilled}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "contactSpin 1s linear infinite" }}>
                        <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        <style>{`@keyframes contactSpin { 100% { transform: rotate(360deg); } }`}</style>
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : !allFieldsFilled ? (
                    <>
                      <span>Please fill all fields</span>
                    </>
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

                  <div className={homeStyles.welcomeGridItem} onClick={() => { setShowSuccessModal(false); router.push("/resume-optimizer"); }} style={{ cursor: "pointer" }}>
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

      <SiteFooter />
    </main>
  );
}
