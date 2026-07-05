"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import homeStyles from "../home.module.css";

interface NavbarProps {
  activePage?: "resume" | "resume-builder" | "pricing" | "contact" | "interview" | "roadmap";
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
  const [userLoading, setUserLoading] = useState(true);
  const lastScrollY = useRef(0);

  const initials = mounted && user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : (mounted && !userLoading ? "U" : "");

  useEffect(() => {
    setAvatarFailed(false);
    setAvatarLoaded(false); // Reset on avatar change
  }, [user?.avatar]);

  useEffect(() => {
    if (user?.fullName) {
      const parts = user.fullName.split(" ");
      let initialsStr = "";
      for (let i = 0; i < parts.length && i < 2; i++) {
        if (parts[i]) initialsStr += parts[i][0];
      }
      initialsStr = initialsStr.toUpperCase();
      document.documentElement.style.setProperty('--user-initials', `"${initialsStr}"`);
    }
  }, [user?.fullName]);

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

  // ── Load cached user & toggle auth view BEFORE browser paints (no flicker) ──
  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      // Immediately load cached user data to prevent loading flicker
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {}
      } else {
        // No cached user but has token - need to load from API
        setUserLoading(true);
      }
      document.documentElement.style.setProperty('--auth-logged-in-display', 'flex');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'none');
    } else {
      document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
      document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
    }
    setMounted(true);
  }, []);

  // ── Background API refresh ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include"
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            const cachedUser = localStorage.getItem("user");
            const cachedFullName = cachedUser ? JSON.parse(cachedUser).fullName : "";
            const cachedAvatar = cachedUser ? JSON.parse(cachedUser).avatar : "";

            const finalUser = {
              ...data.user,
              fullName: data.user.fullName || cachedFullName,
              avatar: (data.user.avatar && data.user.avatar.trim() !== "") ? data.user.avatar : cachedAvatar,
            };

            setUser(finalUser);
            localStorage.setItem("user", JSON.stringify(finalUser));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            setUser(null);
            document.documentElement.style.setProperty('--auth-logged-in-display', 'none');
            document.documentElement.style.setProperty('--auth-logged-out-display', 'flex');
          }
        })
        .catch(() => { })
        .finally(() => {
          // Only set loading false if we didn't already have cached data
          if (!localStorage.getItem("user")) {
            setUserLoading(false);
          }
        });
    } else {
      setUserLoading(false);
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
          <Link href="/roadmap" className={homeStyles.navLink} style={activePage === "roadmap" ? activeLinkStyle : undefined}>Career Roadmap</Link>
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
              <div className="avatar-container-instant" style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0, borderRadius: "50%", background: "var(--surface-300)", overflow: "hidden" }}>
                {/* Initials - only when no valid avatar */}
                <div
                  className="avatar-fallback-prevent-flash"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                    zIndex: 1,
                    opacity: (!user?.avatar || avatarFailed || !avatarLoaded) ? 1 : 0,
                    transition: "opacity 0.2s ease"
                  }}
                />

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
                      zIndex: 2
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
                {mounted && user?.fullName ? user.fullName.split(" ")[0] : (mounted && !userLoading ? "Profile" : "")}
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
          <Link href="/roadmap" className={homeStyles.mobileLink} style={activePage === "roadmap" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Career Roadmap</Link>
          <Link href="/pricing" className={homeStyles.mobileLink} style={activePage === "pricing" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Pricing</Link>
          <Link href="/contact" className={homeStyles.mobileLink} style={activePage === "contact" ? activeLinkStyle : undefined} onClick={() => setMobileMenu(false)}>Contact Us</Link>
          <div className={homeStyles.mobileDivider} />
          {mounted && (
            isLoggedIn ? (
              <Link href="/profile" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="avatar-container-instant" style={{ position: "relative", width: "42px", height: "42px", flexShrink: 0, borderRadius: "50%", background: "var(--surface-300)", overflow: "hidden" }}>
                  {/* Initials - only when no valid avatar */}
                  <div
                    className="avatar-fallback-prevent-flash"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.95rem",
                      fontWeight: "bold",
                      color: "var(--text-primary)",
                      zIndex: 1,
                      opacity: (!user?.avatar || avatarFailed || !avatarLoaded) ? 1 : 0,
                      transition: "opacity 0.2s ease"
                    }}
                  />

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
                        zIndex: 2
                      }}
                    />
                  )}
                </div>
                <span>{mounted && user?.fullName ? user.fullName.split(" ")[0] : (mounted && !userLoading ? "Profile" : "")}</span>
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
