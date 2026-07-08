"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./pricing.module.css";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";
import HomeBackdrop from "../components/HomeBackdrop";
import BorderGlow from "../components/BorderGlow";
import ShinyText from "../components/ShinyText";
import { motion, AnimatePresence } from "framer-motion";

const faqItems = [
  {
    question: "Can I try HireMate AI for free before upgrading?",
    answer: "Yes! Our Free plan allows you to try basic features including 3 resume analyses and 5 mock interviews. You can also start a 7-day free trial of our Professional plan with no credit card required to experience the full premium suite."
  },
  {
    question: "What payment methods do you support?",
    answer: "We support all major credit and debit cards (Visa, MasterCard, American Express), UPI payments, and popular net banking options. All payments are securely processed through Razorpay."
  },
  {
    question: "How do I cancel my subscription and what happens when it expires?",
    answer: "You can cancel your subscription at any time with a single click from your Profile Billing settings. Once cancelled or expired, your account will downgrade to the Free plan, but all of your saved resumes, interview history, and data will remain securely preserved."
  },
  {
    question: "Can I switch between monthly and yearly billing?",
    answer: "Yes, absolutely. You can upgrade from monthly to yearly billing (and vice versa) at any time from your Profile Billing dashboard. Switches to yearly billing apply a pro-rata credit of your unused monthly days to the new invoice."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 100% full refund within 7 days of any new subscription or upgrade purchase if you are not completely satisfied. To request a refund, simply reach out to our team at support@hiremate.ai."
  },
  {
    question: "Are there discounts for students or teams?",
    answer: "Yes! We offer a 50% discount for verified students with a valid academic email address or ID. We also offer custom bulk volume pricing for enterprise teams of 5 or more members. Contact us for details."
  },
  {
    question: "Is my payment and transaction secure?",
    answer: "Absolutely. All transactions are handled by Razorpay, a PCI-DSS Level 1 compliant gateway. We never store or process your credit card details on our servers, and all transactions are fully encrypted end-to-end."
  }
];

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

const priceVariants = {
  enter: (direction: "up" | "down") => ({
    y: direction === "up" ? 24 : -24,
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction: "up" | "down") => ({
    y: direction === "up" ? -24 : 24,
    opacity: 0
  })
};

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.page}>
      <HomeBackdrop />
      <Navbar activePage="pricing" />

      <ShinyText
        text="Pricing"
        speed={3}
        delay={0.5}
        color="rgba(255,255,255,0.6)"
        shineColor="#ffffff"
        spread={100}
        direction="left"
        className={styles.heroWord}
      />

      <section className={styles.content}>

        <div className={styles.cardsContainer}>

          <div className={styles.cardsWrap} ref={cardsRef}>
            <div className={styles.bottomSection}>
              <div className={styles.billingToggle}>
                <button
                  type="button"
                  className={`${styles.billingOption} ${!yearly ? styles.billingOptionActive : ""}`}
                  onClick={() => setYearly(false)}
                >
                  {!yearly && (
                    <motion.div
                      layoutId="activeBillingPill"
                      className={styles.activeBillingBg}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 2 }}>Monthly</span>
                </button>
                <button
                  type="button"
                  className={`${styles.billingOption} ${yearly ? styles.billingOptionActive : ""}`}
                  onClick={() => setYearly(true)}
                >
                  {yearly && (
                    <motion.div
                      layoutId="activeBillingPill"
                      className={styles.activeBillingBg}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span style={{ position: "relative", zIndex: 2 }}>Yearly</span>
                </button>
              </div>
            </div>

            <div className={styles.cardsGrid}>
              {plans.map((plan, idx) => {
                const cardContent = (
                  <>
                    <div className={styles.cardHeader}>
                      <span className={styles.planLabel}>{plan.name} Plan</span>
                    </div>

                     <div className={styles.priceBlock}>
                       {plan.monthlyPrice === 0 ? (
                         <span className={styles.price}>Free</span>
                       ) : (
                         <span className={styles.price} style={{ display: "inline-flex", alignItems: "baseline" }}>
                           <span>₹</span>
                           {String(yearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice).split("").map((digit, charIdx) => (
                             <span key={charIdx} style={{ display: "inline-block", overflow: "hidden", position: "relative", verticalAlign: "baseline", width: "0.58em", textAlign: "center" }}>
                               <AnimatePresence mode="popLayout" custom={yearly ? "down" : "up"}>
                                 <motion.span
                                   key={digit}
                                   custom={yearly ? "down" : "up"}
                                   variants={priceVariants}
                                   initial="enter"
                                   animate="center"
                                   exit="exit"
                                   transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                   style={{ display: "block", width: "100%", textAlign: "center" }}
                                 >
                                   {digit}
                                 </motion.span>
                               </AnimatePresence>
                             </span>
                           ))}
                           <span className={styles.pricePeriod}>/m</span>
                         </span>
                       )}
                     </div>

                    <div className={styles.divider} />

                    <ul className={styles.features}>
                      {plan.features.map((feature, i) => {
                        let checkClass = styles.featureCheck;
                        if (plan.name === "Professional") {
                          checkClass = `${styles.featureCheck} ${styles.featureCheckProfessional}`;
                        } else if (plan.name === "Enterprise") {
                          checkClass = `${styles.featureCheck} ${styles.featureCheckEnterprise}`;
                        }
                        return (
                          <li key={i} className={styles.feature} style={{ animationDelay: `${idx * 0.12 + i * 0.05}s` }}>
                            <span className={checkClass}>
                              <CheckIcon />
                            </span>
                            <span>{feature}</span>
                          </li>
                        );
                      })}
                    </ul>

                    <Link
                      href={plan.name === "Enterprise" ? "/contact" : "/auth?mode=signup"}
                      className={`${styles.cta} ${
                        plan.featured
                          ? styles.ctaPrimary
                          : plan.name === "Enterprise"
                          ? styles.ctaEnterprise
                          : styles.ctaSecondary
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </>
                );

                if (plan.featured) {
                  return (
                    <div key={plan.name} className={styles.cardWrapper} style={{ animationDelay: `${idx * 0.12}s` }}>
                      <span className={styles.recommendedBadge}>Recommended</span>
                      <BorderGlow
                        edgeSensitivity={30}
                        glowColor="40 80 80"
                        backgroundColor="rgba(255, 255, 255, 0.02)"
                        fillColor="var(--surface-50)"
                        borderRadius={24}
                        glowRadius={40}
                        glowIntensity={1}
                        coneSpread={25}
                        animated={true}
                        glass={true}
                        colors={['#c084fc', '#f472b6', '#38bdf8']}
                        className={styles.card}
                      >
                        {cardContent}
                      </BorderGlow>
                    </div>
                  );
                }

                if (plan.name === "Enterprise") {
                  return (
                    <div key={plan.name} className={styles.cardWrapper} style={{ animationDelay: `${idx * 0.12}s` }}>
                      <span className={styles.enterpriseBadge}>Enterprise</span>
                      <BorderGlow
                        edgeSensitivity={30}
                        glowColor="24 95 55"
                        backgroundColor="rgba(255, 255, 255, 0.02)"
                        fillColor="var(--surface-50)"
                        borderRadius={24}
                        glowRadius={40}
                        glowIntensity={1}
                        coneSpread={25}
                        animated={true}
                        glass={true}
                        colors={['#fbbf24', '#f97316', '#ea580c', '#e11d48']}
                        className={styles.card}
                      >
                        {cardContent}
                      </BorderGlow>
                    </div>
                  );
                }

                return (
                  <div
                    key={plan.name}
                    className={styles.cardWrapper}
                    style={{ animationDelay: `${idx * 0.12}s` }}
                  >
                    <div className={styles.card}>
                      <div className={styles.cardGlow} />
                      {cardContent}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.comparisonSection}>
        <div className={styles.comparisonContainer}>
          <h2 className={styles.comparisonTitle}>Compare Plans</h2>
          <div className={styles.comparisonTable}>
            {/* Header Row */}
            <div className={styles.comparisonRow + ' ' + styles.comparisonHeader}>
              <div className={styles.comparisonFeature}></div>
              <div className={styles.comparisonPlan}>Free</div>
              <div className={styles.comparisonPlan}>Professional</div>
              <div className={styles.comparisonPlan}>Enterprise</div>
            </div>

            {/* Resume Section */}
            <div className={styles.comparisonCategory}>Resume</div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>AI Resume Analysis</div>
              <div className={styles.comparisonValue}>3 / month</div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow + ' ' + styles.comparisonAlt}>
              <div className={styles.comparisonFeature}>Resume Builder</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>ATS Score</div>
              <div className={styles.comparisonValue}>Basic</div>
              <div className={styles.comparisonValue}>Advanced</div>
              <div className={styles.comparisonValue}>Advanced</div>
            </div>

            {/* Interview Section */}
            <div className={styles.comparisonCategory}>Interview</div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>Mock Interviews</div>
              <div className={styles.comparisonValue}>5</div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow + ' ' + styles.comparisonAlt}>
              <div className={styles.comparisonFeature}>Company-specific Questions</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>AI Feedback</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            {/* Career Section */}
            <div className={styles.comparisonCategory}>Career</div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>Career Roadmap</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow + ' ' + styles.comparisonAlt}>
              <div className={styles.comparisonFeature}>Learning Recommendations</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            {/* Team Section */}
            <div className={styles.comparisonCategory}>Team & Enterprise</div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>Recruiter Dashboard</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow + ' ' + styles.comparisonAlt}>
              <div className={styles.comparisonFeature}>Team Management</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow}>
              <div className={styles.comparisonFeature}>API Access</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>

            <div className={styles.comparisonRow + ' ' + styles.comparisonAlt}>
              <div className={styles.comparisonFeature}>Dedicated Support</div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.crossIcon}>✕</span></div>
              <div className={styles.comparisonValue}><span className={styles.checkIcon}>✓</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <p className={styles.faqSubtitle}>
            Answered all frequently asked questions. Still confused?{" "}
            <Link href="/contact" className={styles.faqLink}>
              feel free to contact us
            </Link>
          </p>

          <div className={styles.faqList}>
            {faqItems.map((item, idx) => {
              const isOpen = expandedFaqId === idx;
              return (
                <div
                  key={idx}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqHeader}
                    onClick={() => setExpandedFaqId(isOpen ? null : idx)}
                  >
                    <span className={styles.faqQuestion}>{item.question}</span>
                    <span className={styles.faqToggle}>
                      {isOpen ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </span>
                  </button>
                  <div
                    className={styles.faqBody}
                    style={{
                      maxHeight: isOpen ? "200px" : "0px",
                      opacity: isOpen ? 1 : 0
                    }}
                  >
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
