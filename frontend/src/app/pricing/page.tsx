"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./pricing.module.css";
import homeStyles from "../home.module.css";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "Free forever",
    featured: false,
    features: [
      "1 resume analysis per month",
      "Basic ATS score",
      "Standard resume templates",
      "Email support",
      "Basic interview tips",
    ],
    cta: "Get Started",
    ctaStyle: "secondary",
  },
  {
    name: "Professional",
    monthlyPrice: 19,
    yearlyPrice: 190,
    period: "/month",
    yearlyPeriod: "/year",
    featured: true,
    features: [
      "Unlimited resume analysis",
      "Advanced ATS optimization",
      "Premium resume templates",
      "AI mock interviews",
      "Priority email support",
      "Career insights dashboard",
    ],
    cta: "Get Started",
    ctaStyle: "primary",
  },
  {
    name: "Enterprise",
    monthlyPrice: 49,
    yearlyPrice: 490,
    period: "/month",
    yearlyPeriod: "/year",
    featured: false,
    features: [
      "Everything in Professional",
      "Team management portal",
      "Custom branding options",
      "API access",
      "Dedicated account manager",
      "Advanced analytics",
      "SSO integration",
    ],
    cta: "Contact Sales",
    ctaStyle: "secondary",
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className={styles.page}>
      <HomeBackdrop />

      {/* Nav */}
      <nav className={homeStyles.nav}>
        <div className={homeStyles.navInner}>
          <Link href="/" className={homeStyles.logo}>
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
            <Link href="/" className={homeStyles.navLink}>Home</Link>
            <Link href="/resume" className={homeStyles.navLink}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={homeStyles.navLink}>Mock Interview</Link>
            <Link href="/pricing" className={homeStyles.navLink} style={{ color: "var(--text-primary)" }}>Pricing</Link>
            <Link href="/contact" className={homeStyles.navLink}>Contact</Link>
          </div>

          <div className={homeStyles.navActions}>
            <Link href="/auth?mode=signin" className={homeStyles.navBtnGhost}>Sign In</Link>
            <Link href="/auth?mode=signup" className={homeStyles.navBtnSolid}>Get Started</Link>
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
            <Link href="/" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Home</Link>
            <Link href="/resume" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Mock Interview</Link>
            <Link href="/pricing" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Pricing</Link>
            <Link href="/contact" className={homeStyles.mobileLink} onClick={() => setMobileMenu(false)}>Contact</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <h1 className={styles.heroTitle}>Pricing</h1>
        <p className={styles.heroSubtitle}>
          Simple, transparent pricing. Start for free, upgrade when you need more.
        </p>

        <div className={styles.toggleWrap}>
          <span className={`${styles.toggleLabel} ${!yearly ? styles.active : ""}`}>Monthly</span>
          <button
            className={`${styles.toggle} ${yearly ? styles.active : ""}`}
            onClick={() => setYearly(!yearly)}
          >
            <div className={styles.toggleKnob} />
          </button>
          <span className={`${styles.toggleLabel} ${yearly ? styles.active : ""}`}>Yearly</span>
          {yearly && <span className={styles.saveBadge}>Save 20%</span>}
        </div>
      </section>

      {/* Cards */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.card} ${plan.featured ? styles.featured : ""}`}
            >
              <div className={styles.cardName}>{plan.name}</div>
              <div className={styles.cardPrice}>
                {plan.monthlyPrice === 0 ? "Free" : `$${yearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}`}
              </div>
              <div className={styles.cardPeriod}>
                {plan.monthlyPrice === 0
                  ? plan.period
                  : yearly
                    ? `$${plan.yearlyPrice}${plan.yearlyPeriod} billed annually`
                    : plan.period}
              </div>

              <div className={styles.features}>
                {plan.features.map((feature, i) => (
                  <div key={i} className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <CheckIcon />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/auth?mode=signup"}
                className={`${styles.cta} ${plan.ctaStyle === "primary" ? styles.ctaPrimary : styles.ctaSecondary}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
