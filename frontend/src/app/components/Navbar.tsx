"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import homeStyles from "../home.module.css";

interface NavbarProps {
  activePage?: "resume" | "resume-builder" | "pricing" | "contact" | "interview";
}

export default function Navbar({ activePage }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [resumeDropdown, setResumeDropdown] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const lastScrollY = useRef(0);

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  useEffect(() => {
    setAvatarFailed(false);
    if (user?.avatar && user.avatar.startsWith("data:image")) {
      setAvatarLoaded(true);
    } else {
      setAvatarLoaded(false);
    }
  }, [user?.avatar]);

  useEffect(() => {
    const syncProfile = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setIsLoggedIn(true);
        } catch (e) {}
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };
    window.addEventListener("userProfileUpdated", syncProfile);
    return () => window.removeEventListener("userProfileUpdated", syncProfile);
  }, []);

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

  // ── Load cached user BEFORE browser paints (no flicker) ──
  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try { setUser(JSON.parse(savedUser)); } catch (e) { }
      }
    }
    setMounted(true);
  }, []);

  // ── Background API refresh + CSS property sync ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'flex');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'none');
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
            document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
            document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
          }
        })
        .catch(() => { });
    } else {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
    }
  }, []);

  const activeLinkStyle = { color: "var(--text-primary)" };

  return (
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
          <div
            className={homeStyles.dropdownContainer}
            onMouseEnter={() => setResumeDropdown(true)}
            onMouseLeave={() => setResumeDropdown(false)}
          >
            <Link
              href="/resume-optimizer"
              className={`${homeStyles.navLink} ${homeStyles.dropdownTrigger} ${resumeDropdown || activePage === "resume" || activePage === "resume-builder" ? homeStyles.dropdownTriggerActive : ""}`}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Resume
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: resumeDropdown ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </Link>
            {resumeDropdown && (
              <div className={homeStyles.dropdownMenu}>
                <Link
                  href="/resume-optimizer"
                  className={`${homeStyles.dropdownLink} ${activePage === "resume" ? homeStyles.dropdownLinkActive : ""}`}
                >
                  Resume Optimizer
                </Link>
                <Link
                  href="/resume-builder"
                  className={`${homeStyles.dropdownLink} ${activePage === "resume-builder" ? homeStyles.dropdownLinkActive : ""}`}
                >
                  Resume Builder
                </Link>
              </div>
            )}
          </div>
          <Link href="/interview/setup" className={homeStyles.navLink} style={activePage === "interview" ? activeLinkStyle : undefined}>Mock Interview</Link>
          <Link href="/pricing" className={homeStyles.navLink} style={activePage === "pricing" ? activeLinkStyle : undefined}>Pricing</Link>
          <Link href="/contact" className={homeStyles.navLink} style={activePage === "contact" ? activeLinkStyle : undefined}>Contact Us</Link>
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
              <div style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0 }}>
                {/* Initials Fallback - Base layer */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "var(--surface-300)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                    zIndex: 1
                  }}
                >
                  {initials}
                </div>

                {/* Avatar Image - Overlay layer */}
                {user?.avatar && !avatarFailed && (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    onLoad={() => setAvatarLoaded(true)}
                    onError={() => setAvatarFailed(true)}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid var(--border-default)",
                      zIndex: 2,
                      opacity: avatarLoaded ? 1 : 0,
                      transition: "opacity 0.2s ease-in-out"
                    }}
                  />
                )}
              </div>
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
          <Link href="/resume-optimizer" className={homeStyles.mobileLink} style={activePage === "resume" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
          <Link href="/resume-builder" className={homeStyles.mobileLink} style={activePage === "resume-builder" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Resume Builder</Link>
          <Link href="/interview/setup" className={homeStyles.mobileLink} style={activePage === "interview" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Mock Interview</Link>
          <Link href="/pricing" className={homeStyles.mobileLink} style={activePage === "pricing" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Pricing</Link>
          <Link href="/contact" className={homeStyles.mobileLink} style={activePage === "contact" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Contact Us</Link>
          <div className={homeStyles.mobileDivider} />
          {mounted && (
            isLoggedIn ? (
              <Link href="/profile" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0 }}>
                  {/* Initials Fallback - Base layer */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "var(--surface-300)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      zIndex: 1
                    }}
                  >
                    {initials}
                  </div>

                  {/* Avatar Image - Overlay layer */}
                  {user?.avatar && !avatarFailed && (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      onLoad={() => setAvatarLoaded(true)}
                      onError={() => setAvatarFailed(true)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid var(--border-default)",
                        zIndex: 2,
                        opacity: avatarLoaded ? 1 : 0,
                        transition: "opacity 0.2s ease-in-out"
                      }}
                    />
                  )}
                </div>
                <span>{user?.fullName ? user.fullName.split(" ")[0] : "Profile"}</span>
              </Link>
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
  );
}
