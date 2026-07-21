"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import homeStyles from "../home.module.css";

const IconSpinner = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin-nav 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
    <style>{`@keyframes spin-nav { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

interface NavbarProps {
  activePage?: "resume" | "resume-builder" | "pricing" | "contact" | "interview" | "roadmap" | "interview-history";
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Navbar({ activePage, onClick }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [resumeDropdown, setResumeDropdown] = useState(false);
  const [interviewDropdown, setInterviewDropdown] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const lastScrollY = useRef(0);

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMobileMenu(false);
    if (onClick) onClick(e);
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

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
          setUserLoading(false);
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
          setUserLoading(false);
        });
    } else {
      setUserLoading(false);
    }
  }, []);

  const activeLinkStyle = { color: "var(--text-primary)" };

  return (
    <nav className={`${homeStyles.nav} ${scrolled ? homeStyles.navScrolled : ""} ${navHidden ? homeStyles.navHidden : ""}`}>
      <div className={homeStyles.navInner}>
        <Link href="/" className={homeStyles.navLogo} onClick={onClick}>
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
          <span>HireMate</span>
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
              onClick={onClick}
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
                  onClick={onClick}
                >
                  Resume Optimizer
                </Link>
                <Link
                  href="/resume-builder"
                  className={`${homeStyles.dropdownLink} ${activePage === "resume-builder" ? homeStyles.dropdownLinkActive : ""}`}
                  onClick={onClick}
                >
                  Resume Builder
                </Link>
              </div>
            )}
          </div>
          <div
            className={homeStyles.dropdownContainer}
            onMouseEnter={() => setInterviewDropdown(true)}
            onMouseLeave={() => setInterviewDropdown(false)}
          >
            <Link
              href="/interview/setup"
              className={`${homeStyles.navLink} ${homeStyles.dropdownTrigger} ${interviewDropdown || activePage === "interview" || activePage === "interview-history" ? homeStyles.dropdownTriggerActive : ""}`}
              onClick={onClick}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                Mock Interview
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
                    transform: interviewDropdown ? "rotate(180deg)" : "rotate(0deg)"
                  }}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </Link>
            {interviewDropdown && (
              <div className={homeStyles.dropdownMenu}>
                <Link
                  href="/interview/setup"
                  className={`${homeStyles.dropdownLink} ${activePage === "interview" ? homeStyles.dropdownLinkActive : ""}`}
                  onClick={onClick}
                >
                  Start Interview
                </Link>
                <Link
                  href="/interview/history"
                  className={`${homeStyles.dropdownLink} ${activePage === "interview-history" ? homeStyles.dropdownLinkActive : ""}`}
                  onClick={onClick}
                >
                  Interview History
                </Link>
              </div>
            )}
          </div>
          <Link href="/roadmap" className={homeStyles.navLink} style={activePage === "roadmap" ? activeLinkStyle : undefined} onClick={onClick}>Career Roadmap</Link>
          <Link href="/pricing" className={homeStyles.navLink} style={activePage === "pricing" ? activeLinkStyle : undefined} onClick={onClick}>Pricing</Link>
          <Link href="/contact" className={homeStyles.navLink} style={activePage === "contact" ? activeLinkStyle : undefined} onClick={onClick}>Contact Us</Link>
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
              onClick={onClick}
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
                >
                  {initials}
                </div>

                {/* Avatar Image - Overlay layer */}
                {user?.avatar && !avatarFailed && (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    draggable={false}
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
                      userSelect: "none",
                      WebkitUserDrag: "none"
                    } as React.CSSProperties}
                  />
                )}

                {/* Spinner Overlay during initial user API fetch or avatar image download */}
                {(userLoading || (user?.avatar && !avatarLoaded && !avatarFailed)) && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0, 0, 0, 0.55)",
                      color: "var(--text-primary)",
                      borderRadius: "50%",
                      zIndex: 3
                    }}
                  >
                    <IconSpinner />
                  </div>
                )}
              </div>
              <span>
                {user?.fullName ? user.fullName.split(" ")[0] : "Profile"}
              </span>
            </Link>
          </div>

          <div className="auth-logged-out-only">
            <Link href="/auth?mode=signin" className={homeStyles.navBtnGhost} onClick={onClick}>Sign In</Link>
            <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid} onClick={onClick}>Get Started</Link>
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
          <Link href="/resume-optimizer" className={homeStyles.mobileLink} style={activePage === "resume" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Resume Optimizer</Link>
          <Link href="/resume-builder" className={homeStyles.mobileLink} style={activePage === "resume-builder" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Resume Builder</Link>
          <Link href="/interview/setup" className={homeStyles.mobileLink} style={activePage === "interview" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Mock Interview</Link>
          <Link href="/interview/history" className={homeStyles.mobileLink} style={activePage === "interview-history" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Interview History</Link>
          <Link href="/roadmap" className={homeStyles.mobileLink} style={activePage === "roadmap" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Career Roadmap</Link>
          <Link href="/pricing" className={homeStyles.mobileLink} style={activePage === "pricing" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Pricing</Link>
          <Link href="/contact" className={homeStyles.mobileLink} style={activePage === "contact" ? activeLinkStyle : undefined} onClick={handleMobileClick}>Contact Us</Link>
          <div className={homeStyles.mobileDivider} />
          {mounted && (
            isLoggedIn ? (
              <Link href="/profile" className={homeStyles.mobileLink} onClick={handleMobileClick} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                  >
                    {initials}
                  </div>

                  {/* Avatar Image - Overlay layer */}
                  {user?.avatar && !avatarFailed && (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      draggable={false}
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
                        userSelect: "none",
                        WebkitUserDrag: "none"
                      } as React.CSSProperties}
                    />
                  )}

                  {/* Spinner Overlay during initial user API fetch or avatar image download */}
                  {(userLoading || (user?.avatar && !avatarLoaded && !avatarFailed)) && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(0, 0, 0, 0.55)",
                        color: "var(--text-primary)",
                        borderRadius: "50%",
                        zIndex: 3
                      }}
                    >
                      <IconSpinner />
                    </div>
                  )}
                </div>
                <span>{user?.fullName ? user.fullName.split(" ")[0] : "Profile"}</span>
              </Link>
            ) : (
              <>
                <Link href="/auth?mode=signin" className={homeStyles.mobileLink} onClick={handleMobileClick}>Sign In</Link>
                <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid} style={{ width: "100%", textAlign: "center" }} onClick={handleMobileClick}>Get Started</Link>
              </>
            )
          )}
        </div>
      )}
    </nav>
  );
}
