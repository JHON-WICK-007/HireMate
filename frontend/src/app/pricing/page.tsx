"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./pricing.module.css";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";
import HomeBackdrop from "../components/HomeBackdrop";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    period: "",
    featured: false,
    features: [
      "3 AI Resume Analyses / month",
      "5 Mock Interviews",
      "Basic ATS Score",
      "Community Support",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    monthlyPrice: 499,
    yearlyPrice: 4790,
    period: "/month",
    yearlyPeriod: "/year",
    featured: true,
    features: [
      "Unlimited Resume Analysis",
      "Unlimited AI Interviews",
      "Company-specific Questions",
      "Career Roadmap",
      "Resume Builder",
      "AI Feedback",
      "Learning Recommendations",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    monthlyPrice: 999,
    yearlyPrice: 9590,
    period: "/month",
    yearlyPeriod: "/year",
    featured: false,
    features: [
      "Everything in Professional",
      "Recruiter Dashboard",
      "Team Management",
      "Advanced Analytics",
      "Priority AI Processing",
      "API Access",
      "Dedicated Support",
    ],
    cta: "Get Started",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="pricing" />

      <section className={styles.content}>
        <div className={styles.cardsContainer}>
          <div className={styles.heroWord}>Pricing</div>

          <div className={styles.cardsWrap} ref={cardsRef}>
            <div className={styles.cardsGrid}>
              {plans.map((plan, idx) => (
                <div
                  key={plan.name}
                  className={`${styles.card} ${plan.featured ? styles.featured : ""}`}
                  style={{ animationDelay: `${idx * 0.12}s` }}
                >
                  <div className={styles.cardGlow} />

                  <div className={styles.cardHeader}>
                    <span className={styles.planLabel}>{plan.name} Plan</span>
                  </div>

                  <div className={styles.priceBlock}>
                    {plan.monthlyPrice === 0 ? (
                      <span className={styles.price}>Free</span>
                    ) : (
                      <span className={styles.price}>
                        ₹{yearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                        <span className={styles.pricePeriod}>/m</span>
                      </span>
                    )}
                  </div>

                  <div className={styles.divider} />

                  <ul className={styles.features}>
                    {plan.features.map((feature, i) => (
                      <li key={i} className={styles.feature} style={{ animationDelay: `${idx * 0.12 + i * 0.05}s` }}>
                        <span className={styles.featureCheck}>
                          <CheckIcon />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/auth?mode=signup"}
                    className={`${styles.cta} ${plan.featured ? styles.ctaPrimary : styles.ctaSecondary}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>

            <div className={styles.bottomSection}>
              <div className={styles.toggleContainer}>
                <button
                  className={`${styles.toggle} ${yearly ? styles.toggleActive : ""}`}
                  onClick={() => setYearly(!yearly)}
                >
                  <div className={styles.toggleKnob} />
                </button>
                <span className={styles.toggleLabel}>Billed Yearly</span>
              </div>

              <div className={styles.plansPillContainer}>
                <div className={styles.plansPill}>
                  Plans
                </div>
              </div>
              <div />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
