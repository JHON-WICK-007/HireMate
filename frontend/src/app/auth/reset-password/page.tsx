"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../auth.module.css";
import { useToast } from "../../components/Toast";
import HomeBackdrop from "../../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const toast = useToast();
  
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation tooltips
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmFocused, setIsConfirmFocused] = useState(false);
  const [showPasswordErrors, setShowPasswordErrors] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const getPasswordErrors = () => {
    const errors = [];
    if (password.length < 12) {
      errors.push("Password must be at least 12 characters.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one capital letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!token) {
      toast.error("Invalid token link. Please request a new link.");
      return;
    }

    const errors = getPasswordErrors();
    if (errors.length > 0) {
      setShowPasswordErrors(true);
      setFormErrors({ password: "Please meet all password requirements." });
      return;
    }

    if (password !== confirmPassword) {
      setFormErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to reset password.");
        return;
      }

      toast.success("Password reset successful!");
      setIsSuccess(true);
      
      // Auto redirect to login page after 2.5 seconds
      setTimeout(() => {
        router.push("/auth?mode=signin");
      }, 2500);
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

          {/* Right Panel - Form */}
          <div className={styles.formPanel}>
            <div className={styles.formContainer}>
              {/* Form Header */}
              {token && !isSuccess && (
                <div className={styles.formHeader} style={{ textAlign: "center" }}>
                  <h2 className={styles.formTitle}>Reset password</h2>
                  <p className={styles.formSubtitle}>
                    Please choose a strong, secure new password.
                  </p>
                </div>
              )}

              {!token ? (
                <div className={styles.form} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className={styles.loadingLogo} style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.05)", borderColor: "rgba(239, 68, 68, 0.2)", animation: "none", margin: "0 auto 1.5rem" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h2 className={styles.formTitle} style={{ fontSize: "1.3rem" }}>Invalid Reset Link</h2>
                  <p className={styles.formSubtitle} style={{ marginBottom: "0.5rem" }}>This link does not contain a valid reset token.</p>
                  <button
                    type="button"
                    onClick={() => router.push("/auth?mode=signin")}
                    className={styles.submitBtn}
                    style={{ marginTop: "1rem" }}
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : isSuccess ? (
                <div className={styles.form} style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className={styles.loadingLogo} style={{ margin: "0 auto 1rem", animation: "none", color: "#22c55e", borderColor: "rgba(34, 197, 94, 0.2)", background: "rgba(34, 197, 94, 0.05)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className={styles.formTitle} style={{ fontSize: "1.3rem" }}>Password Reset Complete</h3>
                  <p className={styles.formSubtitle}>
                    Your password has been successfully updated. Redirecting you to login...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                  {/* Password */}
                  <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                      New Password
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
                          setShowPasswordErrors(true);
                        }}
                        onFocus={() => {
                          setIsPasswordFocused(true);
                          setShowPasswordErrors(true);
                        }}
                        onBlur={() => setIsPasswordFocused(false)}
                        autoComplete="new-password"
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

                      {/* Password Rules Tooltip */}
                      {isPasswordFocused && showPasswordErrors && (
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

                  {/* Confirm Password */}
                  <div className={styles.inputGroup}>
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
                        <div className={styles.confirmPasswordTooltip} onMouseDown={(e) => e.preventDefault()}>
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
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <>
                        Update Password
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
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
      <ResetPasswordContent />
    </Suspense>
  );
}
