"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./auth.module.css";
import { useToast } from "../components/Toast";
import HomeBackdrop from "../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [isForgotSuccess, setIsForgotSuccess] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();

  // Sync cooldown with localStorage on mount (survives page refresh)
  useEffect(() => {
    const lastRequest = localStorage.getItem("forgotPasswordLastRequest");
    if (lastRequest) {
      const elapsed = Date.now() - parseInt(lastRequest);
      const remaining = Math.ceil((60000 - elapsed) / 1000);
      if (remaining > 0) {
        setResendCooldown(remaining);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) { clearInterval(timer); return 0; }
            return prev - 1;
          });
        }, 1000);
      }
    }
  }, []);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const getPasswordErrors = () => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one capital letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (["password", "user", "username"].includes(password.toLowerCase())) {
      errors.push("Password cannot be 'password', 'user', or 'username'.");
    }
    return errors;
  };

  // Animated background particles
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; delay: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  const [redirectPath, setRedirectPath] = useState("/");

  useEffect(() => {
    const mode = searchParams.get("mode");
    const redirect = searchParams.get("redirect");
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      try {
        localStorage.setItem("token", token);
        
        // Clean URL params immediately so they don't linger in location bar
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Fetch fresh user profile from backend
        fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              toast.success("Successfully signed in!");
              setIsRedirecting(true);

              // Check if user is new (created in the last 15 seconds)
              const isNew = data.user.createdAt
                ? (Date.now() - new Date(data.user.createdAt).getTime()) < 15000
                : false;

              setTimeout(() => {
                if (isNew) {
                  localStorage.setItem("showWelcomeModal", "true");
                  window.location.replace("/");
                } else {
                  window.location.replace(redirect || "/");
                }
              }, 3000);
            } else {
              toast.error("Failed to retrieve user profile.");
            }
          })
          .catch(() => {
            toast.error("Failed to retrieve user profile.");
          });
        return;
      } catch (e) {
        toast.error("An error occurred during authentication.");
      }
    } else if (error === "oauth_failed") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
      toast.error("Sign in with social provider failed.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "signin") {
      setIsLogin(true);
    }
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams, toast]);

  const toggleMode = (forcedMode?: "signin" | "signup") => {
    const nextLoginState = forcedMode !== undefined ? forcedMode === "signin" : !isLogin;
    setIsLogin(nextLoginState);
    toast.dismissAll();
    setPassword("");
    setConfirmPassword("");
    setShowPasswordErrors(false);
    setFormErrors({});

    // Synchronize browser URL query parameters
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("mode", nextLoginState ? "signin" : "signup");
      window.history.replaceState({}, document.title, `${window.location.pathname}?${params.toString()}`);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setShowPasswordErrors(false);

    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!isLogin && !fullName) {
      newErrors.fullName = "Full name is required.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim().toLowerCase())) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      if (newErrors.password && !newErrors.fullName && !newErrors.email) {
        setIsPasswordFocused(true);
      }
      return;
    }

    if (!isLogin) {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
        setIsConfirmFocused(true);
        setIsPasswordFocused(false);
        setFormErrors(newErrors);
        return;
      }

      const rulesErrors = getPasswordErrors();
      if (rulesErrors.length > 0) {
        newErrors.password = "Please satisfy all password rules.";
        setShowPasswordErrors(true);
        setIsPasswordFocused(true);
        setFormErrors(newErrors);
        return;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email, password }
        : { fullName, email, password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Something went wrong.");
        return;
      }

      if (isLogin) {
        toast.success(`Welcome back, ${data.user.fullName}! 🎉`);
        // Store token for API calls
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsRedirecting(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => {
          window.location.replace(redirectPath);
        }, 3000);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("showWelcomeModal", "true");
        setIsRedirecting(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        setTimeout(() => {
          window.location.replace(redirectPath);
        }, 3000);
      }
    } catch (err) {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!email) {
      setFormErrors({ email: "Email is required." });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to request password reset.");
        return;
      }

      toast.success("Password reset link sent! Check your inbox.");
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
      localStorage.setItem("forgotPasswordLastRequest", Date.now().toString());
      setIsForgotSuccess(true);
    } catch (err) {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!data.success) {
        if (res.status === 429) {
          const match = data.message.match(/(\d+)\s*second/);
          const waitSeconds = match ? parseInt(match[1]) : 60;
          setResendCooldown(waitSeconds);
          localStorage.setItem("forgotPasswordLastRequest", (Date.now() - (60000 - waitSeconds * 1000)).toString());
          toast.error(data.message);
          return;
        }
        toast.error(data.message || "Failed to resend reset link.");
        return;
      }
      toast.success("Password reset link resent successfully.");
      if (data.resetUrl) setDevResetUrl(data.resetUrl);
      localStorage.setItem("forgotPasswordLastRequest", Date.now().toString());
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) { clearInterval(timer); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    setIsForgotSuccess(false);
    setResendCooldown(0);
    setDevResetUrl("");
    localStorage.removeItem("forgotPasswordLastRequest");
  };

  const isCallbackInProgress = (searchParams.get("token") !== null) || isRedirecting;

  if (isCallbackInProgress) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingGlow} />
        <div className={styles.loadingCard}>
          <div className={styles.loadingLogo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6v6h6" />
              <rect width="20" height="20" x="2" y="2" rx="6" />
              <path d="M9 18v-6H3" />
            </svg>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressBarFill} />
          </div>
          <h2 className={styles.loadingTitle}>Securing Session</h2>
          <p className={styles.loadingSubtitle}>Synchronizing your profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={styles.container}>
      {/* Animated Background */}
      <HomeBackdrop />

      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className={styles.content}>
        {/* Left Panel - Branding */}
        <div className={styles.brandPanel}>
          <div className={styles.brandContent}>
            {/* Logo */}
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="2"
                    y="2"
                    width="36"
                    height="36"
                    rx="10"
                    fill="url(#logoGrad)"
                  />
                  <path
                    d="M12 14h16M12 20h10M12 26h14"
                    stroke="var(--logo-stroke)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.9" />
                  <path
                    d="M29 25.5l1 1 2-2"
                    stroke="var(--logo-check-bg)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="logoGrad"
                      x1="0"
                      y1="0"
                      x2="40"
                      y2="40"
                    >
                      <stop stopColor="var(--logo-grad-start)" />
                      <stop offset="1" stopColor="var(--logo-grad-end)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={styles.logoText}>HireMate AI</span>
            </div>

            {/* Tagline */}
            <h1 className={styles.brandTitle}>
              Your AI-Powered
              <br />
              <span className="gradient-text">Career Partner</span>
            </h1>
            <p className={styles.brandSubtitle}>
              Ace your next interview with intelligent mock interviews, resume
              analysis, and personalized career roadmaps.
            </p>

            {/* Feature pills */}
            <div className={styles.featurePills}>
              {[
                { icon: "🎯", text: "Smart Mock Interviews" },
                { icon: "📄", text: "AI Resume Analysis" },
                { icon: "💻", text: "Coding Playground" },
                { icon: "🗺️", text: "Career Roadmaps" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className={styles.featurePill}
                  style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
                >
                  <span className={styles.featurePillIcon}>{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className={styles.socialProof}>
              <div className={styles.avatarStack}>
                {[
                  "https://randomuser.me/api/portraits/women/44.jpg",
                  "https://randomuser.me/api/portraits/men/32.jpg",
                  "https://randomuser.me/api/portraits/women/68.jpg",
                  "https://randomuser.me/api/portraits/men/75.jpg",
                  "https://randomuser.me/api/portraits/women/90.jpg",
                ].map((src, i) => (
                  <img
                    key={i}
                    className={styles.avatar}
                    src={src}
                    alt={`User ${i + 1}`}
                    style={{
                      zIndex: 5 - i,
                      '--tx': `${i * -10}px`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
              <p className={styles.socialProofText}>
                <strong>2,500+</strong> developers preparing with HireMate AI
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className={styles.formPanel}>
          <div className={styles.formContainer}>
            {/* Form Header */}
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>
                {isForgot
                  ? "Forgot password"
                  : isLogin
                  ? "Welcome back"
                  : "Create your account"}
              </h2>
              <p className={styles.formSubtitle}>
                {isForgot
                  ? "Enter your email address and we'll send you a recovery link"
                  : isLogin
                  ? "Sign in to continue your interview preparation"
                  : "Start your journey to landing your dream job"}
              </p>
            </div>

            {/* Tab Switcher */}
            {!isForgot && (
              <div className={styles.tabSwitcher}>
                <button
                  className={`${styles.tab} ${isLogin ? styles.tabActive : ""}`}
                  onClick={() => toggleMode("signin")}
                  type="button"
                >
                  Sign In
                </button>
                <button
                  className={`${styles.tab} ${!isLogin ? styles.tabActive : ""}`}
                  onClick={() => toggleMode("signup")}
                  type="button"
                >
                  Sign Up
                </button>
                <div
                  className={styles.tabIndicator}
                  style={{ transform: isLogin ? "translateX(0)" : "translateX(100%)" }}
                />
              </div>
            )}

            {isForgot && isForgotSuccess ? (
              <div className={styles.form} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Check Icon — larger 40px */}
                <div className={styles.loadingLogo} style={{ margin: "0 auto 0.5rem", animation: "none", color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.2)", background: "rgba(34, 197, 94, 0.05)", width: "64px", height: "64px" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <h3 className={styles.formTitle} style={{ fontSize: "1.3rem" }}>Check your inbox</h3>

                <p className={styles.formSubtitle} style={{ marginBottom: "0.25rem" }}>
                  We've sent a secure password reset link to
                </p>
                <p style={{ color: "#f1f5f9", fontWeight: "600", fontSize: "15px", fontFamily: "var(--font-sans)", margin: 0 }}>
                  {email}
                </p>
                <p className={styles.formSubtitle} style={{ marginTop: "0.25rem" }}>
                  The link will expire in 10 minutes.
                </p>

                {/* Didn't receive it? + Resend / Change Email */}
                <p className={styles.formSubtitle} style={{ marginTop: "0.5rem" }}>Didn't receive the email?</p>
                <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={resendCooldown > 0 || isResending}
                    className={styles.submitBtn}
                    style={{ width: "180px", padding: "12px 24px", height: "auto", marginTop: 0, opacity: resendCooldown > 0 || isResending ? 0.4 : 1 }}
                  >
                    <>
                      {isResending ? "Sending..." : "Resend Email"}
                      {resendCooldown > 0 && !isResending && (
                        <span style={{ marginLeft: "4px", fontSize: "12px", opacity: 0.5 }}>{resendCooldown}s</span>
                      )}
                    </>
                  </button>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className={styles.submitBtn}
                    style={{ width: "auto", padding: "12px 24px", height: "auto", marginTop: 0, background: "transparent", color: "#f1f5f9", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                  >
                    Change Email
                  </button>
                </div>

                {/* Spam hint */}
                <p className={styles.formSubtitle} style={{ fontSize: "12px", marginTop: "0.25rem" }}>
                  Please check your Spam or Junk folder if you don't see the email.
                </p>

                {/* Divider */}
                <div style={{ width: "100%", height: "1px", background: "rgba(255, 255, 255, 0.08)", margin: "0.5rem 0" }} />

                {/* Return to Sign In */}
                <div className={styles.forgotRow} style={{ justifyContent: "center" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setIsForgotSuccess(false);
                      setIsLogin(true);
                      setEmail("");
                      setDevResetUrl("");
                      setResendCooldown(0);
                      localStorage.removeItem("forgotPasswordLastRequest");
                      toast.dismissAll();
                      setFormErrors({});
                    }}
                    className={styles.forgotLink}
                    style={{ fontSize: "15px" }}
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : isForgot ? (
              <form onSubmit={handleForgotPasswordSubmit} className={styles.form} noValidate>
                {/* Email */}
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M22 7l-10 6L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      id="email"
                      type="email"
                      className={`${styles.input} ${formErrors.email ? styles.inputError : ""}`}
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      autoComplete="email"
                    />
                  </div>
                  {formErrors.email && (
                    <div className={styles.fieldError}>
                      <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                      <span>{formErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "authSpin 1s linear infinite" }}>
                        <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                        <style>{`@keyframes authSpin { 100% { transform: rotate(360deg); } }`}</style>
                      </svg>
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      Send Recovery Link
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>

                {/* Back to Sign In Link */}
                <div className={styles.forgotRow} style={{ justifyContent: "center", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgot(false);
                      setIsLogin(true);
                      toast.dismissAll();
                      setFormErrors({});
                    }}
                    className={styles.forgotLink}
                    style={{ fontSize: "15px" }}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            ) : (
              <>
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  {/* Full Name - only for register */}
                  {!isLogin && (
                    <div className={styles.inputGroup + " " + styles.animateIn}>
                      <label htmlFor="fullName" className={styles.label}>
                        Full Name
                      </label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <input
                          id="fullName"
                          type="text"
                          className={`${styles.input} ${formErrors.fullName ? styles.inputError : ""}`}
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                          }}
                          autoComplete="name"
                        />
                      </div>
                      {formErrors.fullName && (
                        <div className={styles.fieldError}>
                          <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                          <span>{formErrors.fullName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email Address
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
                        <path d="M22 7l-10 6L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <input
                        id="email"
                        type="email"
                        className={`${styles.input} ${formErrors.email ? styles.inputError : ""}`}
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setFormErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        autoComplete="email"
                      />
                    </div>
                    {formErrors.email && (
                      <div className={styles.fieldError}>
                        <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <span>{formErrors.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                      Password
                    </label>
                    <div className={styles.inputWrapper}>
                      <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`${styles.input} ${formErrors.password ? styles.inputError : ""}`}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setFormErrors((prev) => ({ ...prev, password: undefined }));
                          if (!isLogin) {
                            setShowPasswordErrors(true);
                          }
                        }}
                        onFocus={() => {
                          if (!isLogin) {
                            setIsPasswordFocused(true);
                            setShowPasswordErrors(true);
                          }
                        }}
                        onBlur={() => setIsPasswordFocused(false)}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        )}
                      </button>

                      {/* Password Rules Tooltip - only for register */}
                      {!isLogin && isPasswordFocused && showPasswordErrors && (
                        <div className={styles.passwordRulesTooltip} onMouseDown={(e) => e.preventDefault()}>
                          <div className={styles.tooltipArrow} />
                          <h4 className={styles.rulesTitle}>PASSWORD REQUIREMENTS</h4>
                          <ul className={styles.rulesList}>
                            <li className={password.length >= 12 ? styles.ruleValid : styles.ruleInvalid}>
                              <span className={styles.ruleIcon}>
                                {password.length >= 12 ? (
                                  <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              At least 12 characters ({password.length}/12)
                            </li>
                            <li className={/[A-Z]/.test(password) ? styles.ruleValid : styles.ruleInvalid}>
                              <span className={styles.ruleIcon}>
                                {/[A-Z]/.test(password) ? (
                                  <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              One uppercase letter
                            </li>
                            <li className={/[a-z]/.test(password) ? styles.ruleValid : styles.ruleInvalid}>
                              <span className={styles.ruleIcon}>
                                {/[a-z]/.test(password) ? (
                                  <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              One lowercase letter
                            </li>
                            <li className={/\d/.test(password) ? styles.ruleValid : styles.ruleInvalid}>
                              <span className={styles.ruleIcon}>
                                {/\d/.test(password) ? (
                                  <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              One number
                            </li>
                            <li className={/[@$!%*?&]/.test(password) ? styles.ruleValid : styles.ruleInvalid}>
                              <span className={styles.ruleIcon}>
                                {/[@$!%*?&]/.test(password) ? (
                                  <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                ) : (
                                  <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                  </svg>
                                )}
                              </span>
                              One special character (@$!%*?&)
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                    {formErrors.password && (
                      <div className={styles.fieldError}>
                        <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                        <span>{formErrors.password}</span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password - only for register */}
                  {!isLogin && (
                    <div className={styles.inputGroup + " " + styles.animateIn}>
                      <label htmlFor="confirmPassword" className={styles.label}>
                        Confirm Password
                      </label>
                      <div className={styles.inputWrapper}>
                        <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <input
                          id="confirmPassword"
                          type="password"
                          className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ""}`}
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                          }}
                          onFocus={() => setIsConfirmFocused(true)}
                          onBlur={() => setIsConfirmFocused(false)}
                          onPaste={(e) => e.preventDefault()}
                          disabled={getPasswordErrors().length > 0 || password.length < 8}
                          autoComplete="new-password"
                          style={getPasswordErrors().length > 0 || password.length < 8 ? { opacity: 0.4, cursor: "not-allowed" } : {}}
                        />

                        {/* Confirm Password Match Tooltip */}
                        {isConfirmFocused && (
                          <div className={styles.passwordRulesTooltip} onMouseDown={(e) => e.preventDefault()}>
                            <div className={styles.tooltipArrow} />
                            <h4 className={styles.rulesTitle}>MATCH CHECK</h4>
                            <ul className={styles.rulesList}>
                              <li className={confirmPassword.length > 0 && confirmPassword === password ? styles.ruleValid : styles.ruleInvalid}>
                                <span className={styles.ruleIcon}>
                                  {confirmPassword.length > 0 && confirmPassword === password ? (
                                    <svg viewBox="0 0 24 24" className={styles.checkIcon} fill="currentColor">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M8.5 12.5l2 2 5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  ) : (
                                    <svg viewBox="0 0 24 24" className={styles.alertIcon} fill="currentColor">
                                      <circle cx="12" cy="12" r="10" />
                                      <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                  )}
                                </span>
                                Passwords match
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      {formErrors.confirmPassword && (
                        <div className={styles.fieldError}>
                          <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                          <span>{formErrors.confirmPassword}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Forgot Password */}
                  {isLogin && (
                    <div className={styles.forgotRow}>
                      <button
                        type="button"
                        className={styles.forgotLink}
                        onClick={() => {
                          setIsForgot(true);
                          toast.dismissAll();
                          setFormErrors({});
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "authSpin 1s linear infinite" }}>
                          <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                          <style>{`@keyframes authSpin { 100% { transform: rotate(360deg); } }`}</style>
                        </svg>
                        <span>{isLogin ? "Signing In..." : "Creating Account..."}</span>
                      </>
                    ) : isLogin ? (
                      <>
                        Sign In
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className={styles.divider}>
                  <span>or continue with</span>
                </div>

                {/* Social Login */}
                <div className={styles.socialButtons}>
                  <button
                    type="button"
                    className={styles.socialBtn}
                    id="google-login-btn"
                    onClick={() => {
                      window.location.href = `${API_URL}/api/auth/google${redirectPath !== "/" ? `?redirect=${encodeURIComponent(redirectPath)}` : ""}`;
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                </div>

                {/* Bottom text */}
                <p className={styles.bottomText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button type="button" onClick={() => toggleMode(isLogin ? "signup" : "signin")} className={styles.switchLink}>
                    {isLogin ? "Sign up for free" : "Sign in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className={styles.loadingContainer}>
        <div className={styles.loadingGlow} />
        <div className={styles.loadingCard}>
          <div className={styles.loadingLogo}>
            <span className={styles.logoText}>HireMate</span>
            <span className={styles.logoDot}>.ai</span>
          </div>
          <div className={styles.spinner} />
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}
