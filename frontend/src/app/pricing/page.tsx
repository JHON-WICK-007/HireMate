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
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, MasterCard, American Express), UPI payments, and net banking. All transactions are securely processed through Razorpay."
  },
  {
    question: "Is there a free trial for the Professional plan?",
    answer: "Yes! You can try the Professional plan for free for 7 days. No credit card required. If you decide not to continue, you will automatically be moved to the Free plan with no charges."
  },
  {
    question: "Can I switch between monthly and yearly billing?",
    answer: "Absolutely. You can switch from monthly to yearly billing (and vice versa) at any time from your Profile Billing dashboard. When switching to yearly, you will receive a pro-rata credit for the remaining days of your current billing cycle."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription at any time from your Profile Billing settings. Your access will continue until the end of your current billing period. No cancellation fees apply."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a full refund within 7 days of any new purchase or upgrade if you are not satisfied. After 7 days, refunds are handled on a case-by-case basis. Contact our support team for assistance."
  },
  {
    question: "What happens when my plan expires?",
    answer: "When your plan expires, you will be automatically moved to the Free plan. Your data and history are preserved. You can re-upgrade at any time to regain access to premium features."
  },
  {
    question: "Are there discounts for students or teams?",
    answer: "Yes! We offer a 50% discount for verified students with a valid student ID. For teams of 5 or more, our Enterprise plan includes volume discounts. Contact us at support@hiremate.ai for custom team pricing."
  },
  {
    question: "Is my payment information secure?",
    answer: "Absolutely. All payment processing is handled by Razorpay, a PCI-DSS Level 1 compliant payment gateway. We never store your card details on our servers. All transactions are encrypted end-to-end."
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
