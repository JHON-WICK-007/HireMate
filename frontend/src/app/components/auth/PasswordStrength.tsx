"use client";

import React from "react";
import styles from "./PasswordStrength.module.css";

interface PasswordStrengthProps {
  password: string;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score === 0) return { score: 0, label: "", color: "" };
  if (score === 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score: 2, label: "Fair", color: "#f97316" };
  if (score === 3) return { score: 3, label: "Good", color: "#eab308" };
  return { score: 4, label: "Strong", color: "#22c55e" };
};

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const { score, label, color } = getPasswordStrength(password);

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`${styles.segment} ${i <= score ? styles.segmentFilled : ""}`}
            style={{
              backgroundColor: i <= score ? color : "rgba(255, 255, 255, 0.08)",
            }}
          />
        ))}
      </div>
      <span className={styles.label} style={{ color }}>
        {label}
      </span>
    </div>
  );
}
