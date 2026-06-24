"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";
import { useToast } from "../components/Toast";
import HomeBackdrop from "../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else if (mode === "signin") {
      setIsLogin(true);
    }
  }, []);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    toast.dismissAll();
    setPassword("");
    setConfirmPassword("");
    setShowPasswordErrors(false);
    setFormErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

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
      newErrors.email = "Email address is required.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    if (!isLogin) {
      if (password && password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }

      if (password) {
        const rulesErrors = getPasswordErrors();
        if (rulesErrors.length > 0) {
          newErrors.password = "Please satisfy all password rules.";
          setShowPasswordErrors(true);
        }
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
        // Redirect to homepage after 1.5s
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("showWelcomeModal", "true");
        router.push("/");
      }
    } catch (err) {
      toast.error("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
                      transform: `translateX(${i * -10}px)`,
                    }}
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
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className={styles.formSubtitle}>
                {isLogin
                  ? "Sign in to continue your interview preparation"
                  : "Start your journey to landing your dream job"}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className={styles.tabSwitcher}>
              <button
                className={`${styles.tab} ${isLogin ? styles.tabActive : ""}`}
                onClick={() => toggleMode()}
                type="button"
              >
                Sign In
              </button>
              <button
                className={`${styles.tab} ${!isLogin ? styles.tabActive : ""}`}
                onClick={() => toggleMode()}
                type="button"
              >
                Sign Up
              </button>
              <div
                className={styles.tabIndicator}
                style={{ transform: isLogin ? "translateX(0)" : "translateX(100%)" }}
              />
            </div>



            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
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
                    <rect x="3" y="11" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`${styles.input} ${formErrors.password ? styles.inputError : ""}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setFormErrors((prev) => ({ ...prev, password: undefined }));
                      setShowPasswordErrors(false);
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
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

                  {/* Password Rules Tooltip (Positioned relative to inputWrapper) */}
                  {!isLogin && isPasswordFocused && (
                    <div className={styles.passwordRulesTooltip} onMouseDown={(e) => e.preventDefault()}>
                      <div className={styles.tooltipArrow} />
                      <h4 className={styles.rulesTitle}>PASSWORD RULES</h4>
                      <ul className={styles.rulesList}>
                        <li className={password.length >= 8 ? styles.ruleValid : styles.ruleInvalid}>
                          <span className={styles.ruleIcon}>
                            {password.length >= 8 ? (
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
                          8 characters minimum
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
                          Contains at least 1 capital letter
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
                          Contains at least 1 number
                        </li>
                        <li className={!["password", "user", "username"].includes(password.toLowerCase()) ? styles.ruleValid : styles.ruleInvalid}>
                          <span className={styles.ruleIcon}>
                            {!["password", "user", "username"].includes(password.toLowerCase()) ? (
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
                          Can't be "password", "user", "username"
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Password field missing validation error */}
                {!showPasswordErrors && formErrors.password && (
                  <div className={styles.fieldError}>
                    <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span>{formErrors.password}</span>
                  </div>
                )}

                {/* Inline Validation Error Messages (Shown below field if validation is broken) */}
                {!isLogin && showPasswordErrors && getPasswordErrors().map((err, idx) => (
                  <div key={idx} className={styles.fieldError}>
                    <svg viewBox="0 0 24 24" className={styles.fieldErrorIcon} fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 7v5M12 16h.01" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    <span>{err}</span>
                  </div>
                ))}
              </div>

              {/* Confirm Password - only for register */}
              {!isLogin && (
                <div className={styles.inputGroup + " " + styles.animateIn}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Confirm Password
                  </label>
                  <div className={styles.inputWrapper}>
                    <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      id="confirmPassword"
                      type="password"
                      className={`${styles.input} ${formErrors.confirmPassword ? styles.inputError : ""}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFormErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                      }}
                      autoComplete="new-password"
                    />
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
                  <button type="button" className={styles.forgotLink}>
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
                  <div className={styles.spinner} />
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
              <button type="button" className={styles.socialBtn} id="google-login-btn">
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
              <button type="button" className={styles.socialBtn} id="github-login-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
            </div>

            {/* Bottom text */}
            <p className={styles.bottomText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" onClick={toggleMode} className={styles.switchLink}>
                {isLogin ? "Sign up for free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
