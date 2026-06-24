"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../interview.module.css";
import nav from "../../home.module.css";
import { useToast } from "../../components/Toast";
import SiteFooter from "../../components/SiteFooter";
import HomeBackdrop from "../../components/HomeBackdrop";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── Inline SVG Icons ─────────────────────────────────────────
const IconCode = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IconLayout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);
const IconPlay = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
    <line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </svg>
);

const IconTimerShort = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="15" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </svg>
);

const IconClockStandard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 12" />
  </svg>
);

const IconHourglassDetailed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M5 2h14" />
    <path d="M5 22h14" />
    <path d="M19 2v4c0 3.3-2.7 6-6 6h-2c-3.3 0-6-2.7-6-6V2" />
    <path d="M5 22v-4c0-3.3 2.7-6 6-6h2c3.3 0 6 2.7 6 6v4" />
  </svg>
);

const IconTerminal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const IconDatabase = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const IconCaseStudy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const companyActiveClasses: Record<string, string> = {
  Google: styles.logoGoogleActive,
  Amazon: styles.logoAmazonActive,
  Microsoft: styles.logoMicrosoftActive,
  Meta: styles.logoMetaActive,
  Netflix: styles.logoNetflixActive,
  Apple: styles.logoAppleActive,
  Uber: styles.logoUberActive,
  TCS: styles.logoTCSActive,
  Infosys: styles.logoInfosysActive,
  Accenture: styles.logoAccentureActive,
};

const renderCompanyLogo = (company: string) => {
  switch (company) {
    case "Google":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "#ffffff", fontFamily: "'Product Sans', sans-serif" }}>Google</span>
        </div>
      );
    case "Amazon":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="/amazon.png"
            alt="Amazon"
            style={{ height: "18px", width: "auto", flexShrink: 0, filter: "url(#amazon-orange-arrow)" }}
          />
        </div>
      );
    case "Microsoft":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="18" height="18" viewBox="0 0 23 23" style={{ flexShrink: 0 }}>
            <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022" />
            <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00" />
            <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A4EF" />
            <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "'Segoe UI', sans-serif" }}>Microsoft</span>
        </div>
      );
    case "TCS":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="34" height="22" viewBox="0 4.2 24 15.6" fill="none" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="tcsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9F00" />
                <stop offset="30%" stopColor="#E50914" />
                <stop offset="60%" stopColor="#D946EF" />
                <stop offset="100%" stopColor="#7000FF" />
              </linearGradient>
            </defs>
            <path
              d="M24 16.262c0-1.305-.522-2.174-1.827-3.088l-1.785-1.24c-.033-.022-.06-.045-.092-.068-.629-.473-.91-.912-.91-1.43 0-.696.567-1.13 1.371-1.13 1.022 0 1.503.477 2.111.477.479 0 .805-.326.805-.804 0-.348-.174-.631-.631-.848-.718-.348-1.503-.48-2.35-.48-.892 0-1.676.262-2.241.697a.984.984 0 0 0 0-.001 3.64 3.64 0 0 0-.326.283l-.008.01c-.65.695-1.19 1.714-1.623 3.145l-.501 1.652c-.893 2.912-2.306 4.304-4.504 4.304-2.415 0-3.938-1.675-3.938-4.153v.026-.025c0-2.468 1.509-4.159 3.69-4.174l.03-.002a4.857 4.857 0 0 1 2.089.457c.282.13.522.174.74.174.1 0 .192-.017.279-.041.362-.103.592-.408.592-.83 0-.326-.196-.653-.653-.87-.827-.414-1.894-.653-3.046-.653-.86 0-1.653.152-2.359.436-2.117.851-3.452 2.886-3.452 5.545l.002-.024-.001.024c0 .931.169 1.783.479 2.536-.452.985-1.143 1.509-2.046 1.509-1.087 0-1.804-.63-1.806-2.06V9.477h2.546c.588 0 .979-.348.979-.848s-.39-.848-.98-.848H2.09V5.563c0-.653-.435-1.088-1.044-1.088C.435 4.475 0 4.911 0 5.563v10.285c0 2.393 1.37 3.655 3.7 3.655.486.001.97-.08 1.43-.24h.005a3.49 3.49 0 0 0 1.81-1.514c1.034 1.117 2.565 1.775 4.48 1.775.999 0 1.868-.195 2.65-.607h.003c1.588-.827 2.72-2.502 3.503-5.068l.457-1.5a2.984 2.984 0 0 1-.162-.234c.308.492.785.953 1.468 1.43l1.631 1.13c.244.17.463.34.668.51.289.322.378.67.378 1.078 0 .935-.74 1.566-1.807 1.566-1.022 0-1.893-.522-2.371-.522s-.806.325-.806.804c0 .348.174.63.632.848.631.304 1.653.566 2.567.566 1.153 0 2.111-.348 2.785-.957a1.59 1.59 0 0 0 .156-.161A3.104 3.104 0 0 0 24 16.262z"
              fill="url(#tcsGrad)"
            />
          </svg>
        </div>
      );
    case "Infosys":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="48" height="17" viewBox="0 7.3 21.5 7.7" fill="currentColor" style={{ flexShrink: 0, color: "#1970C2" }}>
            <path d="M8.1367 7.625c-.9001 0-1.549.5917-1.6387 1.6406h-.6953v.5215h.6856c.0028 1.6664-.002 3.334-.002 4.998h.7774c-.0022-1.6659-.002-3.3319-.002-4.998h1.748c-.646.5242-1.0663 1.3739-1.0663 2.334 0 1.593 1.1564 2.8848 2.582 2.8848 1.4258 0 2.582-1.2918 2.582-2.8848 0-.1896-.0174-.3753-.0488-.5547.2565.4131.7488.6133 1.4082.8985.7784.329 1.2129.6165 1.2129 1.1074 0 .5885-.556.8955-1.1817.8906-.611 0-1.0883-.249-1.6191-.7305v.9239c.3239.2088.8256.3281 1.3691.3281.6844-.0023 2.0918-.249 2.0918-1.6758-.0044-.8557-.715-1.2239-1.4863-1.5586-.9383-.4653-1.2965-.5629-1.2871-1.0957 0-.7088.6178-.9219 1.0996-.9219.2099 0 .3891.0293.5586.086.3163.1194.4209.3553.5332.6113.5283 1.2356 1.0344 2.4811 1.5488 3.7227-.2464.5637-.526 1.1519-.7168 1.5273l-.0039.0098-.1601.2969-.1797.336h.7617c.3322-.7342 1.7436-4.1688 2.0469-4.9083.1995.533.6857.7467 1.4297 1.0684.7783.329 1.2148.6166 1.2148 1.1074 0 .5886-.5562.8936-1.1816.8887-.6348 0-1.1257-.2685-1.6817-.7871l-.0507-.041v.9413c.3115.259.8713.4102 1.4824.4102.6844-.0022 2.0918-.249 2.0918-1.6758-.0042-.8557-.7151-1.2258-1.4863-1.5605-.9384-.4654-1.2593-.563-1.25-1.0957 0-.709.5787-.9219 1.0605-.9219.5483 0 .8958.2037 1.379.5547V9.584c-.3923-.1381-.7212-.1915-1.1642-.1895-.8912-.0018-1.6966.3234-1.9004 1.0762l-1.1054 2.7344-.1153.3437-.1015-.3437c-.5022-1.2089-.9934-2.4236-1.4863-3.6309-.3154-.0828-.8307-.201-1.1934-.1953-.0377-.0007-.0758-.0002-.1152 0-1.0302-.002-2.0235.4332-2.0235 1.457 0 .0596.0022.1155.006.17-.412-.9813-1.3036-1.6602-2.338-1.6602-.1245 0-.2472.0085-.3672.0273H7.254c-.1194-.733.2228-1.1503.7383-1.1503.6472-.0006.9242.192 1.205.4511 0 0 .0195-.0007.0274 0 .0038-.2457.002-.5318.002-.7949-.185-.0857-.5061-.1465-1.0899-.1465z M0 7.756v7.1367h.8594V7.7559z M4.1719 9.3555c-.945 0-1.3429.3359-1.6582.6738a.2474.2474 0 00-.0352.0644h-.0078v-.043l-.0098-.623H1.707v5.4649h.7754v-3.9961c.0226-.4905.7134-.9746 1.252-.9746.6477 0 1.1777.4364 1.1777 1.039v3.9317h.7754c-.0019-1.429-.002-2.858-.002-4.2871-.0234-.4835-.6094-1.25-1.5136-1.25zm6.2832.5566c.9741-.0175 1.7825 1.0214 1.8047 2.3184.022 1.297-.7504 2.3614-1.7246 2.3789-.9742.0171-1.7825-1.0195-1.8047-2.3164-.0221-1.2971.7503-2.3634 1.7246-2.3809Z" />
          </svg>
        </div>
      );
    case "Accenture":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 4l8 8-8 8" stroke="#a100ff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#a100ff", fontFamily: "sans-serif" }}>accenture</span>
        </div>
      );
    case "Meta":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" style={{ flexShrink: 0, color: "#0081FB" }}>
            <path fillRule="evenodd" d="M8.217 5.243C9.145 3.988 10.171 3 11.483 3 13.96 3 16 6.153 16.001 9.907c0 2.29-.986 3.725-2.757 3.725-1.543 0-2.395-.866-3.924-3.424l-.667-1.123-.118-.197a55 55 0 0 0-.53-.877l-1.178 2.08c-1.673 2.925-2.615 3.541-3.923 3.541C1.086 13.632 0 12.217 0 9.973 0 6.388 1.995 3 4.598 3q.477-.001.924.122c.31.086.611.22.913.407.577.359 1.154.915 1.782 1.714m1.516 2.224q-.378-.615-.727-1.133L9 6.326c.845-1.305 1.543-1.954 2.372-1.954 1.723 0 3.102 2.537 3.102 5.653 0 1.188-.39 1.877-1.195 1.877-.773 0-1.142-.51-2.61-2.87zM4.846 4.756c.725.1 1.385.634 2.34 2.001A212 212 0 0 0 5.551 9.3c-1.357 2.126-1.826 2.603-2.581 2.603-.777 0-1.24-.682-1.24-1.9 0-2.602 1.298-5.264 2.846-5.264q.137 0 .27.018" />
          </svg>
          <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "#ffffff", fontFamily: "sans-serif" }}>Meta</span>
        </div>
      );
    case "Netflix":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#E50914" style={{ flexShrink: 0 }}>
            <path d="M5.5 0H8.8L15.3 16.7V0H18.5V24H15.2L8.7 7.3V24H5.5V0Z" />
          </svg>
          <span style={{ fontWeight: "800", fontSize: "0.95rem", color: "#E50914", fontFamily: "sans-serif", letterSpacing: "-0.02em" }}>Netflix</span>
        </div>
      );
    case "Apple":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.31.12.52.12.8 0 1.64-.47 2.3-1.45" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)", fontFamily: "sans-serif" }}>Apple</span>
        </div>
      );
    case "Uber":
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg width="54" height="18" viewBox="0 7.8 24 8.4" fill="currentColor" style={{ flexShrink: 0, color: "#ffffff" }}>
            <path d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101.826 0 1.562-.316 2.094-.87v.736H6.27V7.97H5.082v4.888c0 1.257-.85 2.106-1.947 2.106-1.11 0-1.946-.827-1.946-2.106V7.971H0zm7.44 0v7.925h1.13v-.725c.521.532 1.257.86 2.06.86a3.006 3.006 0 0 0 3.034-3.01 3.01 3.01 0 0 0-3.033-3.024 2.86 2.86 0 0 0-2.049.861V7.971H7.439zm9.869 2.038c-1.687 0-2.965 1.37-2.965 3 0 1.72 1.334 3.01 3.066 3.01 1.053 0 1.913-.463 2.49-1.233l-.826-.611c-.43.577-.996.847-1.664.847-.973 0-1.753-.7-1.912-1.64h4.697v-.373c0-1.72-1.222-3-2.886-3zm6.295.068c-.634 0-1.098.294-1.381.758v-.713h-1.131v5.774h1.142V12.61c0-.894.544-1.47 1.291-1.47H24v-1.065h-.396zm-6.319.928c.85 0 1.564.588 1.756 1.47H15.52c.203-.882.916-1.47 1.765-1.47zm-6.732.012c1.086 0 1.98.883 1.98 2.004a1.993 1.993 0 0 1-1.98 2.001A1.989 1.989 0 0 1 8.56 13.02a1.99 1.99 0 0 1 1.992-2.004z" />
          </svg>
        </div>
      );
    case "Custom":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text-primary)" }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
          <span style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--text-primary)" }}>Custom</span>
        </div>
      );
    default:
      return null;
  }
};

const IconBackend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const IconFrontend = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const IconFullStack = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const IconDevOps = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconDataAnalyst = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconMobile = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconBug = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="8" y="2" width="8" height="14" rx="4" />
    <line x1="6" y1="19" x2="8" y2="15" />
    <line x1="6" y1="11" x2="8" y2="11" />
    <line x1="6" y1="7" x2="8" y2="8" />
    <line x1="18" y1="19" x2="16" y2="15" />
    <line x1="18" y1="11" x2="16" y2="11" />
    <line x1="18" y1="7" x2="16" y2="8" />
  </svg>
);

const IconCompass = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconSecurity = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconAI = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconLevelBars = ({ level }: { level: number }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ flexShrink: 0 }}>
    <rect x="2" y="16" width="3.5" height="5" rx="0.75" opacity={level >= 1 ? 1 : 0.25} />
    <rect x="7.5" y="11" width="3.5" height="10" rx="0.75" opacity={level >= 2 ? 1 : 0.25} />
    <rect x="13" y="6" width="3.5" height="15" rx="0.75" opacity={level >= 3 ? 1 : 0.25} />
    <rect x="18.5" y="1" width="3.5" height="20" rx="0.75" opacity={level >= 4 ? 1 : 0.25} />
  </svg>
);

const getRoleAvatar = (role: string) => {
  switch (role) {
    case "Backend developer":
      return <IconBackend />;
    case "Frontend developer":
      return <IconFrontend />;
    case "Full stack":
      return <IconFullStack />;
    case "DevOps":
      return <IconDevOps />;
    case "Data analyst":
      return <IconDataAnalyst />;
    case "Mobile developer":
      return <IconMobile />;
    case "QA engineer":
      return <IconBug />;
    case "Product manager":
      return <IconCompass />;
    case "Security engineer":
      return <IconSecurity />;
    case "AI / ML engineer":
      return <IconAI />;
    default:
      return null;
  }
};

const getLevelAvatar = (level: string) => {
  switch (level) {
    case "Fresher":
      return <IconLevelBars level={1} />;
    case "1–3 years":
      return <IconLevelBars level={2} />;
    case "3–5 years":
      return <IconLevelBars level={3} />;
    case "5+ years":
      return <IconLevelBars level={4} />;
    default:
      return null;
  }
};

export default function SetupPage() {
  const router = useRouter();
  const toast = useToast();

  const [avatar, setAvatar] = useState("");
  const [fullName, setFullName] = useState("");
  const [userInitials, setUserInitials] = useState("U");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const lastScrollY = useRef(0);
  const lastToastTimes = useRef<Record<string, number>>({});

  // Setup options
  const companies = ["Google", "Amazon", "Microsoft", "Meta", "Netflix", "Apple", "Uber", "TCS", "Infosys", "Accenture", "Custom"];
  const roles = [
    "Backend developer",
    "Frontend developer",
    "Full stack",
    "Mobile developer",
    "DevOps",
    "QA engineer",
    "Product manager",
    "Security engineer",
    "Data analyst",
    "AI / ML engineer"
  ];
  const experienceLevels = ["Fresher", "1–3 years", "3–5 years", "5+ years"];
  const durations = [
    { label: "Short (5 questions)", value: 5, icon: <IconTimerShort /> },
    { label: "Standard (10 questions)", value: 10, icon: <IconClockStandard /> },
    { label: "Detailed (15 questions)", value: 15, icon: <IconHourglassDetailed /> }
  ];

  const [selectedCompany, setSelectedCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const isCompanySelected = selectedCompany === "Custom" ? !!customCompany.trim() : !!selectedCompany;

  // Calculate completed sections count
  const completedSections = [
    isCompanySelected,
    !!selectedRole,
    !!selectedLevel,
    selectedQuestionTypes.length > 0,
    !!selectedDuration
  ].filter(Boolean).length;

  const progressColor =
    completedSections === 1
      ? "#ef4444"
      : completedSections === 2
        ? "#f97316"
        : completedSections === 3
          ? "#fbbf24"
          : completedSections === 4
            ? "#10b981"
            : completedSections === 5
              ? "#22c55e"
              : "var(--text-muted)";

  // Scroll logic for navbar
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setNavHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch authentication and user details
  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth?mode=signin");
      return;
    }
    const savedUserStr = localStorage.getItem("user");
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        setAvatar(savedUser.avatar || "");
        setFullName(savedUser.fullName || "");
        const parts = (savedUser.fullName || "").trim().split(/\s+/);
        const firstInitial = parts[0] ? parts[0][0] : "";
        const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
        const initials = (firstInitial + lastInitial).toUpperCase() || "U";
        setUserInitials(initials);
      } catch (e) {}
    }
    fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setAvatar(data.user.avatar || "");
          setFullName(data.user.fullName || "");
          const parts = (data.user.fullName || "").trim().split(/\s+/);
          const firstInitial = parts[0] ? parts[0][0] : "";
          const lastInitial = parts.length > 1 ? parts[parts.length - 1][0] : "";
          const initials = (firstInitial + lastInitial).toUpperCase() || "U";
          setUserInitials(initials);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth?mode=signin");
        }
      })
      .catch(() => {
        toast.error("Failed to authenticate session.");
      });
  }, []);

  const showWarningToast = (section: string, message: string) => {
    const now = Date.now();
    const lastTime = lastToastTimes.current[section] || 0;
    if (now - lastTime > 2500) {
      toast.error(message);
      lastToastTimes.current[section] = now;
    }
  };

  // Toggle Type Selection
  const toggleQuestionType = (type: string) => {
    if (selectedQuestionTypes.includes(type)) {
      if (selectedQuestionTypes.length > 1) {
        setSelectedQuestionTypes((p) => p.filter((t) => t !== type));
      } else {
        showWarningToast("questionTypes", "Please select at least one question type.");
      }
    } else {
      setSelectedQuestionTypes((p) => [...p, type]);
    }
  };

  // Start Session API and Redirect
  const startInterview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsStartingSession(true);
    try {
      const res = await fetch(`${API_URL}/api/interviews/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: selectedCompany === "Custom" ? customCompany.trim() : selectedCompany,
          role: selectedRole,
          level: selectedLevel,
          questionTypes: selectedQuestionTypes,
          totalQuestions: selectedDuration || 5,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Redirect directly to the live interview screen with the new interview session ID
        router.push(`/interview/live-interview?id=${data.interviewId}`);
      } else {
        toast.error(data.message || "Failed to initialize interview.");
      }
    } catch (err) {
      toast.error("Network error. Could not connect to the server.");
    } finally {
      setIsStartingSession(false);
    }
  };

  return (
    <div className={styles.page}>
      <HomeBackdrop />

      {/* ── Navbar ── */}
      <nav className={`${nav.nav} ${scrolled ? nav.navScrolled : ""} ${navHidden ? nav.navHidden : ""}`}>
        <div className={nav.navInner}>
          <Link href="/" className={nav.navLogo}>
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#navGrad)" />
              <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8" />
              <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="navGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="var(--logo-grad-start)" />
                  <stop offset="1" stopColor="var(--logo-grad-end)" />
                </linearGradient>
              </defs>
            </svg>
            <span>HireMate AI</span>
          </Link>

          <div className={nav.navLinks}>
            <Link href="/resume" className={nav.navLink}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={`${nav.navLink} ${nav.navActive || ""}`} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.navLink}>Profile</Link>
          </div>

          <div className={nav.navActions} suppressHydrationWarning>
            <Link href="/profile" className={nav.navBtnGhost} style={{ paddingLeft: "6px", paddingRight: "16px" }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1.5px solid var(--border-default)",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "var(--surface-300)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    color: "var(--text-primary)",
                  }}
                >
                  {userInitials}
                </div>
              )}
              <span>{fullName ? fullName.split(" ")[0] : "Profile"}</span>
            </Link>
          </div>

          <button className={nav.hamburger} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen1 : ""}`} />
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen2 : ""}`} />
            <span className={`${nav.hamburgerLine} ${mobileMenu ? nav.hamburgerOpen3 : ""}`} />
          </button>
        </div>

        {mobileMenu && (
          <div className={nav.mobileMenu}>
            <Link href="/resume" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Resume Optimizer</Link>
            <Link href="/interview/setup" className={nav.mobileLink} onClick={() => setMobileMenu(false)} style={{ color: "var(--domain-interview)" }}>Mock Interview</Link>
            <Link href="/profile" className={nav.mobileLink} onClick={() => setMobileMenu(false)}>Profile</Link>
          </div>
        )}
      </nav>

      {/* ── Main Layout Content ── */}
      <main className={styles.layout}>
        <div className={styles.consoleCard}>


          <div className={styles.setupBody}>
            <div className={styles.setupTitle}>Start a mock interview</div>
            <div className={styles.setupSub}>Configure your session and the AI interviewer will ask role-specific questions and evaluate your answers.</div>

            {/* Stepper / Progress Bar */}
            <div className={styles.topProgress}>
              <div className={styles.topProgressText}>
                <span>Configuration Progress</span>
                <span className={styles.topProgressCount} style={{ color: progressColor }}>
                  {completedSections}/5
                </span>
              </div>
              <div className={styles.topProgressBar}>
                <div
                  className={styles.topProgressFill}
                  style={{
                    width: `${(completedSections / 5) * 100}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #f97316 50%, #22c55e 100%)",
                    boxShadow: completedSections > 0 ? `0 0 10px ${progressColor}` : "none",
                  }}
                />
              </div>
            </div>

            <div className={styles.setupGrid}>
              <div className={styles.setupForm}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Company</span>
                  <div className={styles.logoWall}>
                    {companies.map((c) => {
                      const isActive = selectedCompany === c;
                      const activeClass = isActive ? (companyActiveClasses[c] || styles.logoItemActive) : "";
                      return (
                        <div
                          key={c}
                          className={`${styles.logoItem} ${activeClass}`}
                          onClick={() => {
                            if (selectedCompany === c) {
                              showWarningToast("company", "Please select at least one company.");
                            } else {
                              setSelectedCompany(c);
                            }
                          }}
                        >
                          {renderCompanyLogo(c)}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      height: selectedCompany === "Custom" ? "62px" : "0px",
                      opacity: selectedCompany === "Custom" ? 1 : 0,
                      visibility: selectedCompany === "Custom" ? "visible" : "hidden",
                      overflow: "hidden",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                      width: "100%",
                      maxWidth: "320px",
                    }}
                  >
                    <div style={{ marginTop: "1rem" }}>
                      <input
                        type="text"
                        placeholder="Enter custom company name..."
                        value={customCompany}
                        onChange={(e) => setCustomCompany(e.target.value)}
                        className={styles.setupInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Role</span>
                  <div className={styles.chipGroup}>
                    {roles.map((r) => (
                      <span
                        key={r}
                        className={`${styles.chip} ${selectedRole === r ? styles.chipSelectedRole : ""}`}
                        onClick={() => {
                          if (selectedRole === r) {
                            showWarningToast("role", "Please select at least one role.");
                          } else {
                            setSelectedRole(r);
                          }
                        }}
                      >
                        {getRoleAvatar(r)}
                        <span>{r}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Experience level</span>
                  <div className={styles.chipGroup}>
                    {experienceLevels.map((l) => (
                      <span
                        key={l}
                        className={`${styles.chip} ${selectedLevel === l ? styles.chipSelectedLevel : ""}`}
                        onClick={() => {
                          if (selectedLevel === l) {
                            showWarningToast("level", "Please select at least one experience level.");
                          } else {
                            setSelectedLevel(l);
                          }
                        }}
                      >
                        {getLevelAvatar(l)}
                        <span>{l}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Duration</span>
                  <div className={styles.chipGroup}>
                    {durations.map((d) => (
                      <span
                        key={d.value}
                        className={`${styles.chip} ${selectedDuration === d.value ? styles.chipSelectedDuration : ""}`}
                        onClick={() => {
                          if (selectedDuration === d.value) {
                            showWarningToast("duration", "Please select at least one duration.");
                          } else {
                            setSelectedDuration(d.value);
                          }
                        }}
                      >
                        {d.icon}
                        <span>{d.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Question types</span>
                  <div className={styles.typeGrid}>
                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Technical") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Technical")}>
                      <div className={styles.tcTitle}>
                        <IconCode />Technical
                      </div>
                      <div className={styles.tcSub}>Concepts, architecture, debugging</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Behavioral") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Behavioral")}>
                      <div className={styles.tcTitle}>
                        <IconUsers />Behavioral
                      </div>
                      <div className={styles.tcSub}>Teamwork, conflict, leadership</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("HR") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("HR")}>
                      <div className={styles.tcTitle}>
                        <IconBriefcase />HR
                      </div>
                      <div className={styles.tcSub}>Goals, salary, culture fit</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("System design") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("System design")}>
                      <div className={styles.tcTitle}>
                        <IconLayout />System design
                      </div>
                      <div className={styles.tcSub}>Scalability, trade-offs</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Scenario & Case study") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Scenario & Case study")}>
                      <div className={styles.tcTitle}>
                        <IconCaseStudy />Scenario &amp; Case study
                      </div>
                      <div className={styles.tcSub}>Real-world cases, analysis, strategy</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Database & SQL") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Database & SQL")}>
                      <div className={styles.tcTitle}>
                        <IconDatabase />Database &amp; SQL
                      </div>
                      <div className={styles.tcSub}>Query design, normalization, indexing</div>
                    </div>

                    <div className={`${styles.typeCard} ${selectedQuestionTypes.includes("Coding & Algorithms") ? styles.typeCardSelectedQuestion : ""}`} onClick={() => toggleQuestionType("Coding & Algorithms")}>
                      <div className={styles.tcTitle}>
                        <IconTerminal />Coding &amp; Algorithms
                      </div>
                      <div className={styles.tcSub}>Data structures, efficiency, problem solving</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Summary Sticky Sidebar */}
              <aside className={styles.summarySidebar}>
                <div className={styles.sidebarTitle}>Session Summary</div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Company</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedCompany ? (
                      selectedCompany === "Custom" ? (
                        customCompany.trim() ? (
                          <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{customCompany}</span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                            Enter name
                          </span>
                        )
                      ) : (
                        renderCompanyLogo(selectedCompany) || selectedCompany
                      )
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Role</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedRole ? (
                      <>
                        {getRoleAvatar(selectedRole)}
                        <span>{selectedRole}</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Experience Level</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedLevel ? (
                      <>
                        {getLevelAvatar(selectedLevel)}
                        <span>{selectedLevel}</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Duration</span>
                  <div className={styles.sidebarSectionValue}>
                    {selectedDuration ? (
                      <>
                        {durations.find((d) => d.value === selectedDuration)?.icon}
                        <span>{selectedDuration} questions</span>
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        Not selected
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.sidebarSection}>
                  <span className={styles.sidebarSectionLabel}>Question Types</span>
                  <div className={styles.sidebarBadgeList}>
                    {selectedQuestionTypes.length > 0 ? (
                      selectedQuestionTypes.map((t) => (
                        <span key={t} className={styles.sidebarBadge}>{t}</span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "0.85rem" }}>
                        None selected
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={styles.startBtn}
                  onClick={startInterview}
                  disabled={isStartingSession || completedSections < 5}
                  style={{ marginTop: "1rem" }}
                >
                  {isStartingSession ? (
                    <>
                      <IconSpinner /> Initializing AI Interviewer...
                    </>
                  ) : completedSections < 5 ? (
                    <>
                      Please select all options
                    </>
                  ) : (
                    <>
                      <IconPlay /> Start interview
                    </>
                  )}
                </button>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* SVG filter to make Amazon logo text white while keeping the arrow orange */}
      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }}>
        <filter id="amazon-orange-arrow">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    -1 1 0 0 1
                    -1 0 1 0 1
                    0 0 0 1 0"
          />
        </filter>
      </svg>
    </div>
  );
}
