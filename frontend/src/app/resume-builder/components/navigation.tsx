"use client";

import React from "react";
import styles from "../builder.module.css";
import { useResumeStore } from "../store";
import { Check, ChevronLeft, ChevronRight, Download, User, FileText, Briefcase, GraduationCap, Code, Folder, Award } from "lucide-react";

interface StepHeaderProps {
  title: string;
  description: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-6 text-left">
      <h2 className="font-display font-bold text-2xl lg:text-3xl text-white tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-sm text-gray-400 font-sans">
        {description}
      </p>
    </div>
  );
};

interface StepNavigationProps {
  onFinish?: () => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({ onFinish }) => {
  const currentStep = useResumeStore((state) => state.currentStep);
  const actions = useResumeStore((state) => state.actions);

  const handleContinue = () => {
    if (currentStep === 7) {
      if (onFinish) onFinish();
    } else {
      actions.nextStep();
    }
  };

  return (
    <div className={styles.navContainer}>
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={actions.prevStep}
          className={styles.btnBack}
        >
          <ChevronLeft size={16} />
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={handleContinue}
        className={styles.btnContinue}
      >
        {currentStep === 7 ? (
          <>
            Finish & Export
            <Download size={16} />
          </>
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
    if (isActive) return `${styles.stepIconContainer} ${styles.stepIconActive}`;
    if (isComplete) return `${styles.stepIconContainer} ${styles.stepIconComplete}`;
    return styles.stepIconContainer;
  };

  const getLabelClass = () => {
    if (isActive) return `${styles.stepLabel} ${styles.stepLabelActive}`;
    if (isComplete) return `${styles.stepLabel} ${styles.stepLabelComplete}`;
    return styles.stepLabel;
  };

  return (
    <button
      type="button"
      className={styles.sidebarItem}
      onClick={isReachable ? onClick : undefined}
      disabled={!isReachable}
      style={{ cursor: isReachable ? "pointer" : "not-allowed" }}
    >
      <div className={getIconContainerClass()}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      <span className={getLabelClass()}>{label}</span>
    </button>
  );
};

export const StepSidebar: React.FC = () => {
  const currentStep = useResumeStore((state) => state.currentStep);
  const actions = useResumeStore((state) => state.actions);

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
          isComplete={s.step < currentStep}
          isReachable={s.step <= currentStep + 1}
          icon={s.icon}
          onClick={() => actions.goToStep(s.step)}
        />
      ))}
    </div>
  );
};
