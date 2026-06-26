"use client";

import React, { useState, InputHTMLAttributes, forwardRef } from "react";
import styles from "./AuthInput.module.css";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
  showPasswordToggle?: boolean;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      icon,
      error,
      success,
      showPasswordToggle,
      type,
      value,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const hasValue = value !== undefined && value !== "";
    const isFocused = focused || hasValue;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur?.(e);
    };

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.inputContainer} ${error ? styles.inputError : ""} ${success ? styles.inputSuccess : ""} ${focused ? styles.inputFocused : ""}`}
        >
          {icon && <div className={styles.icon}>{icon}</div>}

          <input
            ref={ref}
            type={inputType}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`${styles.input} ${icon ? styles.inputWithIcon : ""} ${showPasswordToggle ? styles.inputWithToggle : ""}`}
            autoComplete={props.autoComplete}
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />

          <label
            className={`${styles.label} ${isFocused ? styles.labelFloated : ""} ${error ? styles.labelError : ""} ${success ? styles.labelSuccess : ""}`}
            htmlFor={props.id}
          >
            {label}
          </label>

          {showPasswordToggle && (
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {success && !error && (
            <div className={styles.successIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage} id={`${props.id}-error`} role="alert">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
