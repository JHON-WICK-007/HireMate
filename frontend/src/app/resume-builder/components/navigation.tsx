"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "../builder.module.css";
import { useResumeStore } from "../store";
import { Check, ChevronLeft, ChevronRight, Download, User, FileText, Briefcase, GraduationCap, Code, Folder, Award } from "lucide-react";

const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

export const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

interface StepHeaderProps {
  title: string;
  description: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ title, description }) => {
  return (
    <motion.div variants={cardVariant} className="mb-6 text-left">
      <h2 className="font-display font-bold text-2xl lg:text-3xl text-white tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-400 font-sans">
        {description}
      </p>
    </motion.div>
  );
};

export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone.trim());
};

export const isValidPinCode = (pin: string): boolean => {
  if (!pin) return false;
  return /^[a-zA-Z0-9\s-]{3,10}$/.test(pin.trim());
};

export const isValidUrl = (url: string): boolean => {
  if (!url) return true;
  return /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[a-zA-Z0-9-_.~!$&'()*+,;=:@%]*)*\/?$/.test(url.trim());
};

const validateStep = (step: number, state: any): boolean => {
  switch (step) {
    case 1: {
      const p = state.personalInfo;
      return !!(
        p.firstName?.trim() &&
        p.surname?.trim() &&
        p.city?.trim() &&
        p.country?.trim() &&
        p.pinCode?.trim() &&
        isValidPinCode(p.pinCode) &&
        p.phone?.trim() &&
        isValidPhone(p.phone) &&
        p.email?.trim() &&
        isValidEmail(p.email) &&
        isValidUrl(p.linkedinUrl) &&
        isValidUrl(p.githubUrl) &&
        isValidUrl(p.portfolioUrl)
      );
    }
    case 2:
      return !!state.summary?.trim();
    case 3:
      return state.experiences.every(
        (exp: any) => exp.company?.trim() && exp.role?.trim()
      );
    case 4:
      return state.educations.every(
        (edu: any) => edu.institution?.trim() && edu.degree?.trim()
      );
    case 5:
      return state.skills.length > 0;
    case 6:
      return state.projects.every((proj: any) => proj.name?.trim());
    case 7:
      return state.certifications.every(
        (cert: any) => cert.name?.trim() && cert.organization?.trim()
      );
    default:
      return true;
  }
};

const isStepReachable = (step: number, maxStepReached: number, state: any): boolean => {
  if (step <= maxStepReached) return true;
  if (step === maxStepReached + 1) {
    return validateStep(maxStepReached, state);
  }
  return false;
};

const isStepCompleted = (step: number, state: any): boolean => {
  if (!validateStep(step, state)) return false;
  switch (step) {
    case 3:
      return state.experiences.length > 0;
    case 4:
      return state.educations.length > 0;
    case 6:
      return state.projects.length > 0;
    case 7:
      return state.certifications.length > 0;
    default:
      return true;
  }
};

interface StepNavigationProps {
  onFinish?: () => void;
  isLoading?: boolean;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ onFinish, isLoading = false }) => {
  const state = useResumeStore((state) => state);
  const { currentStep, actions } = state;
  const isCurrentStepValid = validateStep(currentStep, state);
  const areAllStepsComplete = [1, 2, 3, 4, 5, 6, 7].every((s) => isStepCompleted(s, state));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = async () => {
    if (currentStep === 7) {
      if (onFinish) onFinish();
    } else {
      setIsTransitioning(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      actions.nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
      await new Promise((resolve) => setTimeout(resolve, 150));
      setIsTransitioning(false);
    }
  };

  const showSpinner = isTransitioning || isLoading;

  return (
    <div className={styles.navContainer}>
      <button
        type="button"
        onClick={actions.prevStep}
        className={styles.btnBack}
        disabled={currentStep <= 1}
        style={{ visibility: currentStep > 1 ? 'visible' : 'hidden' }}
      >
        <ChevronLeft size={16} />
        Back
      </button>
      <button
        type="button"
        onClick={handleContinue}
        className={styles.btnContinue}
        disabled={currentStep === 7 ? !areAllStepsComplete : !isCurrentStepValid || showSpinner}
      >
        {showSpinner ? (
          <>
            <IconSpinner />
            Processing...
          </>
        ) : !isCurrentStepValid ? (
          "Please fill all required fields"
        ) : currentStep === 7 ? (
          areAllStepsComplete ? (
            <>
              Finish & Export
              <Download size={16} />
            </>
          ) : (
            "Finish all steps first"
          )
        ) : (
          <>
            Continue
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
};

interface StepSidebarItemProps {
  step: number;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  isReachable: boolean;
  icon: React.ComponentType<any>;
  onClick: () => void;
}

export const StepSidebarItem: React.FC<StepSidebarItemProps> = ({
  step,
  label,
  isActive,
  isComplete,
  isReachable,
  icon: Icon,
  onClick,
}) => {
  const getIconContainerClass = () => {
    if (isActive && isComplete) return `${styles.stepIconContainer} ${styles.stepIconActiveComplete}`;
    if (isActive) return `${styles.stepIconContainer} ${styles.stepIconActive}`;
    if (isComplete) return `${styles.stepIconContainer} ${styles.stepIconComplete}`;
    if (isReachable) return `${styles.stepIconContainer} ${styles.stepIconIncomplete}`;
    return styles.stepIconContainer;
  };

  return (
    <button
      type="button"
      className={styles.sidebarItem}
      onClick={isReachable ? onClick : undefined}
      disabled={!isReachable}
      style={{ cursor: isReachable ? "pointer" : "not-allowed" }}
    >
      <div className={styles.tooltipWrap}>
        <div className={getIconContainerClass()}>
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={styles.tooltipText}>{label}</span>
      </div>
    </button>
  );
};

export const StepSidebar: React.FC = () => {
  const state = useResumeStore((state) => state);
  const { currentStep, actions } = state;

  const WIZARD_STEPS = [
    { step: 1, label: "Contact", icon: User },
    { step: 2, label: "Summary", icon: FileText },
    { step: 3, label: "Experience", icon: Briefcase },
    { step: 4, label: "Education", icon: GraduationCap },
    { step: 5, label: "Skills", icon: Code },
    { step: 6, label: "Projects", icon: Folder },
    { step: 7, label: "Certifications", icon: Award },
  ];

  return (
    <div className={styles.sidebarColumn}>
      {WIZARD_STEPS.map((s) => (
        <StepSidebarItem
          key={s.step}
          step={s.step}
          label={s.label}
          isActive={currentStep === s.step}
          isComplete={isStepCompleted(s.step, state)}
          isReachable={isStepReachable(s.step, state.maxStepReached, state)}
          icon={s.icon}
          onClick={() => actions.goToStep(s.step)}
        />
      ))}
    </div>
  );
};
