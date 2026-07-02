"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useResumeStore } from "../store";
import styles from "../builder.module.css";
import { LayoutTemplate, X, Check, ZoomIn, Plus, Minus, Maximize } from "lucide-react";
import { useToast } from "../../components/Toast";
import { motion, AnimatePresence } from "framer-motion";

// Premium color swatches
const COLOR_SWATCHES = [
  { value: "#1B365D", label: "Midnight Navy" },
  { value: "#1A1A1A", label: "Classic Black" },
  { value: "#2D3748", label: "Charcoal" },
  { value: "#4A607A", label: "Slate Blue" },
  { value: "#143D2D", label: "Deep Emerald" },
  { value: "#7A2828", label: "Heritage Red" },
  { value: "#B87333", label: "Copper (Signature)" },
  { value: "#C9A84C", label: "Gold (Blueprint)" },
];

const TEMPLATES_LIST = [
  { id: 1, name: "Premium HireMate", desc: "Signature copper hairline, clean single-column ATS-ready layout." },
  { id: 2, name: "Blueprint Schematic", desc: "Architectural left-sidebar navy layout with timeline nodes." },
  { id: 3, name: "Creative Editorial", desc: "Bold left-column layout, modern serif headers, and vertical grids." },
  { id: 4, name: "Modern Technical Grid", desc: "Structured mono-spaced blocks, geometric dividers, and clean metadata." },
  { id: 5, name: "Executive Heritage", desc: "Center-aligned heritage headings, double-border accents, and classic look." },
  { id: 6, name: "Luxury Editorial", desc: "Champagne gold accents, Garamond serif, luxury editorial feel." }
];

interface ResumeCardRenderProps {
  templateId: number;
  color: string;
}

export const ResumeCardRender: React.FC<ResumeCardRenderProps> = ({ templateId, color }) => {
  const personalInfo = useResumeStore((state) => state.personalInfo);
  const summary = useResumeStore((state) => state.summary);
  const experiences = useResumeStore((state) => state.experiences);
  const educations = useResumeStore((state) => state.educations);
  const skills = useResumeStore((state) => state.skills);
  const projects = useResumeStore((state) => state.projects);
  const certifications = useResumeStore((state) => state.certifications);

  // Fallback placeholder data
  const displayFirst = personalInfo.firstName || "Bradley";
  const displayLast = personalInfo.surname || "Parker";
  const displayEmail = personalInfo.email || "bradley.parker@email.com";
  const displayPhone = personalInfo.phone || "+1 (310) 555-2486";
  const displayLocation = (personalInfo.city || personalInfo.country)
    ? `${personalInfo.city || ""}${personalInfo.city && personalInfo.country ? ", " : ""}${personalInfo.country || ""}`
    : "Los Angeles, CA";
  const displayLinkedin = personalInfo.linkedinUrl || "linkedin.com/in/bradleyparker";
  const displayGithub = personalInfo.githubUrl || "github.com/bradleyparker";
  const displayPortfolio = personalInfo.portfolioUrl || "bradleyparker.dev";

  const displayTitle = experiences[0]?.role || "Senior Full Stack Engineer";
  const displayTagline = "Building scalable web applications with modern technologies.";

  const displaySummary = summary || "Senior Full Stack Engineer with 9+ years of experience designing and building scalable web applications using React, Node.js, TypeScript, and cloud-native technologies. Passionate about performance optimization, clean architecture, and delivering exceptional user experiences.";

  const displayExperiences = experiences.length > 0 ? experiences : [
    {
      id: "mock-exp-1",
      role: "Senior Full Stack Engineer",
      company: "Netflix",
      location: "Los Angeles, CA",
      startDate: { month: 1, year: 2022 },
      endDate: { month: null, year: null },
      isCurrent: true,
      description: "Designed and built scalable web applications serving millions of users globally.\nLed frontend architecture migration improving performance by 40%.\nMentored junior engineers and established coding best practices across teams.\nBuilt real-time collaboration features using WebSockets and event-driven architecture.\nReduced API response times by 55% through caching strategies and query optimization."
    },
    {
      id: "mock-exp-2",
      role: "Software Engineer",
      company: "Microsoft",
      location: "Redmond, WA",
      startDate: { month: 6, year: 2018 },
      endDate: { month: 12, year: 2021 },
      isCurrent: false,
      description: "Developed cloud-native microservices handling 10M+ daily requests.\nImplemented CI/CD pipelines reducing deployment time by 60%.\nCollaborated with cross-functional teams to deliver enterprise features.\nDesigned and built internal tooling dashboard used by 500+ engineers.\nLed migration from monolithic architecture to microservices, improving system resilience."
    },
    {
      id: "mock-exp-3",
      role: "Frontend Developer",
      company: "Airbnb",
      location: "San Francisco, CA",
      startDate: { month: 3, year: 2016 },
      endDate: { month: 5, year: 2018 },
      isCurrent: false,
      description: "Built responsive web interfaces for the booking platform using React and Redux.\nImplemented A/B testing framework that increased conversion rates by 12%.\nOptimized bundle size reducing initial load time by 35%.\nCollaborated with design team to create a component library used across 15+ teams."
    },
    {
      id: "mock-exp-4",
      role: "Junior Web Developer",
      company: "Startup Labs",
      location: "Santa Monica, CA",
      startDate: { month: 8, year: 2014 },
      endDate: { month: 2, year: 2016 },
      isCurrent: false,
      description: "Developed and maintained client-facing web applications using JavaScript and PHP.\nBuilt RESTful APIs serving mobile and web clients.\nImplemented payment integration with Stripe and PayPal.\nParticipated in agile ceremonies and contributed to sprint planning."
    }
  ];

  const displayEducations = educations.length > 0 ? educations : [
    {
      id: "mock-edu-1",
      degree: "B.S. Computer Science",
      fieldOfStudy: "",
      institution: "University of California, Los Angeles (UCLA)",
      startDate: { month: 9, year: 2012 },
      endDate: { month: 6, year: 2016 },
      grade: "",
      isCurrent: false,
      description: ""
    }
  ];

  const displaySkills = (skills.length > 0 ? skills : [
    { id: "mock-sk-1", name: "React", category: "Frontend" },
    { id: "mock-sk-2", name: "Next.js", category: "Frontend" },
    { id: "mock-sk-3", name: "TypeScript", category: "Frontend" },
    { id: "mock-sk-4", name: "Node.js", category: "Backend" },
    { id: "mock-sk-5", name: "Express.js", category: "Backend" },
    { id: "mock-sk-6", name: "PostgreSQL", category: "Backend" },
    { id: "mock-sk-7", name: "MongoDB", category: "Backend" },
    { id: "mock-sk-8", name: "Docker", category: "DevOps" },
    { id: "mock-sk-9", name: "Kubernetes", category: "DevOps" },
    { id: "mock-sk-10", name: "AWS", category: "DevOps" },
    { id: "mock-sk-11", name: "GraphQL", category: "Backend" },
    { id: "mock-sk-12", name: "Redis", category: "Backend" }
  ]) as any[];

  const displayProjects = projects.length > 0 ? projects : [
    {
      id: "mock-proj-1",
      name: "StreamFlow",
      role: "Personal Project",
      description: "A real-time data streaming platform built with React, Node.js, and WebSocket for live collaboration. Supports 10K concurrent users with sub-100ms latency.",
      technologies: ["React", "Node.js", "WebSocket", "Redis", "Docker"]
    },
    {
      id: "mock-proj-2",
      name: "AI Resume Analyzer",
      role: "Personal Project",
      description: "An AI-powered tool that analyzes resumes against job descriptions and provides actionable improvement suggestions using GPT-4.",
      technologies: ["Next.js", "TypeScript", "OpenAI", "PostgreSQL", "Tailwind"]
    },
    {
      id: "mock-proj-3",
      name: "DevPortfolio",
      role: "Personal Project",
      description: "A modern developer portfolio template with dynamic project showcases, blog integration, and analytics dashboard.",
      technologies: ["Next.js", "Tailwind CSS", "MDX", "Vercel"]
    },
    {
      id: "mock-proj-4",
      name: "CloudDeploy CLI",
      role: "Open Source",
      description: "A command-line tool for seamless deployment to AWS, GCP, and Azure with zero-config support for common frameworks.",
      technologies: ["Go", "AWS SDK", "GCP SDK", "Cobra"]
    }
  ];

  const displayCertifications = certifications.length > 0 ? certifications : [
    {
      id: "mock-cert-1",
      name: "AWS Certified Developer – Associate",
      organization: "Amazon Web Services"
    },
    {
      id: "mock-cert-2",
      name: "Microsoft Certified: Azure Developer Associate",
      organization: "Microsoft"
    },
    {
      id: "mock-cert-3",
      name: "Certified Kubernetes Application Developer (CKAD)",
      organization: "Cloud Native Computing Foundation"
    },
    {
      id: "mock-cert-4",
      name: "Google Cloud Professional Cloud Architect",
      organization: "Google Cloud"
    },
    {
      id: "mock-cert-5",
      name: "Meta Frontend Developer Professional Certificate",
      organization: "Meta"
    }
  ];

  const formatMonthYear = (date: { month: number | null; year: number | null }) => {
    if (!date.year) return "";
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mStr = date.month ? monthNames[date.month - 1] : "";
    return `${mStr} ${date.year}`;
  };

  // Group skills by category
  const groupedSkills: { [key: string]: typeof displaySkills } = {};
  displaySkills.forEach((sk) => {
    const cat = sk.category || "General";
    if (!groupedSkills[cat]) {
      groupedSkills[cat] = [];
    }
    groupedSkills[cat].push(sk);
  });

  // Template 1 Style System (Premium HireMate Copper Single Column)
  const premiumStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

    .resume-container-t1 {
      --color-bg: #FFFFFF;
      --color-surface: #FFFFFF;
      --color-ink-heavy: #0D1B2A;
      --color-ink-mid: #2D3748;
      --color-ink-light: #4A5568;
      --color-ink-muted: #718096;
      --color-accent: ${color};
      --color-rule: #E2D9CE;
      --color-tag-bg: #F0EBE3;

      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'Inter', sans-serif;

      --size-name: 36px;
      --size-title: 13.5px;
      --size-section: 13px;
      --size-role: 15px;
      --size-body: 13px;
      --size-small: 11.5px;

      font-family: var(--font-body);
      font-size: var(--size-body);
      color: var(--color-ink-light);
      background: var(--color-bg);
      line-height: 1.5;
    }

    .resume-container-t1 .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--color-surface);
      padding: 34px 40px;
      margin: 0 auto;
      text-align: left;
    }

    .resume-container-t1 .resume-header {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: end;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 2.5px solid var(--color-accent);
      margin-bottom: 24px;
    }

    .resume-container-t1 .resume-profile-pic {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--color-accent);
      flex-shrink: 0;
    }

    .resume-container-t1 .header-avatar-initials {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      background: var(--color-tag-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 400;
      color: var(--color-accent);
      letter-spacing: 0.04em;
    }

    .resume-container-t1 .header-identity {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container-t1 .resume-name {
      font-family: var(--font-display);
      font-size: var(--size-name);
      font-weight: 700;
      color: var(--color-ink-heavy);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .resume-container-t1 .resume-title {
      font-size: var(--size-title);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .resume-container-t1 .resume-tagline {
      font-size: var(--size-small);
      font-style: italic;
      color: var(--color-ink-muted);
      margin-top: 1px;
    }

    .resume-container-t1 .header-contact {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3.5px;
    }

    .resume-container-t1 .contact-item {
      font-size: var(--size-small);
      color: var(--color-ink-light);
      display: flex;
      align-items: center;
      gap: 4px;
      overflow-wrap: anywhere;
      word-break: break-all;
    }

    .resume-container-t1 .contact-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-ink-heavy);
      opacity: 0.45;
    }

    .resume-container-t1 .resume-section {
      margin-bottom: 24px;
    }

    .resume-container-t1 .section-heading {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--size-section);
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-ink-heavy);
      margin-bottom: 12px;
    }

    .resume-container-t1 .section-heading::before {
      content: '';
      display: block;
      width: 3.5px;
      height: 0.8em;
      background: var(--color-accent);
      border-radius: 1.5px;
      flex-shrink: 0;
    }

    .resume-container-t1 .section-heading::after {
      content: '';
      display: block;
      flex: 1;
      height: 1px;
      background: var(--color-rule);
    }

    .resume-container-t1 .summary-text {
      font-size: var(--size-body);
      line-height: 1.6;
      color: var(--color-ink-light);
    }

    .resume-container-t1 .entry-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .resume-container-t1 .entry {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 0 14px;
    }

    .resume-container-t1 .entry-date {
      font-size: var(--size-small);
      color: var(--color-accent);
      font-weight: 600;
      padding-top: 2px;
      line-height: 1.4;
      text-align: right;
    }

    .resume-container-t1 .entry-date .date-current {
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      font-size: 9px;
    }

    .resume-container-t1 .entry-content {
      border-left: 1.5px solid var(--color-rule);
      padding-left: 12px;
    }

    .resume-container-t1 .entry-role {
      font-size: var(--size-role);
      font-weight: 600;
      color: var(--color-ink-mid);
      line-height: 1.2;
    }

    .resume-container-t1 .entry-company {
      font-size: var(--size-small);
      font-weight: 500;
      color: var(--color-ink-muted);
      margin-top: 2px;
    }

    .resume-container-t1 .entry-divider {
      display: inline-block;
      margin: 0 4px;
      color: var(--color-rule);
    }

    .resume-container-t1 .entry-location {
      font-size: 11px;
      color: var(--color-ink-muted);
    }

    .resume-container-t1 .entry-description {
      margin-top: 4px;
      font-size: var(--size-body);
      line-height: 1.5;
      color: var(--color-ink-light);
    }

    .resume-container-t1 .entry-bullets {
      margin-top: 6px;
      padding-left: 12px;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .resume-container-t1 .entry-bullets li {
      font-size: var(--size-body);
      line-height: 1.5;
      color: var(--color-ink-light);
      position: relative;
    }

    .resume-container-t1 .entry-bullets li::before {
      content: '▸';
      position: absolute;
      left: -12px;
      color: var(--color-accent);
      font-size: 10px;
      top: 0.1em;
    }

    .resume-container-t1 .entry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }

    .resume-container-t1 .entry-tag {
      font-size: 9px;
      font-weight: 500;
      color: var(--color-ink-mid);
      background: var(--color-tag-bg);
      border: 0.5px solid var(--color-rule);
      border-radius: 2px;
      padding: 2px 6px;
    }

    .resume-container-t1 .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .resume-container-t1 .skill-category {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 0 14px;
      align-items: start;
    }

    .resume-container-t1 .skill-category-label {
      font-size: var(--size-small);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.02em;
      padding-top: 2px;
      text-align: right;
    }

    .resume-container-t1 .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      border-left: 1.5px solid var(--color-rule);
      padding-left: 12px;
    }

    .resume-container-t1 .skill-tag {
      font-size: 10.5px;
      font-weight: 500;
      color: var(--color-ink-mid);
      background: var(--color-tag-bg);
      border: 0.5px solid var(--color-rule);
      border-radius: 2px;
      padding: 2px 7px;
      white-space: nowrap;
    }

    .resume-container-t1 .cert-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .resume-container-t1 .cert-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: var(--size-body);
    }

    .resume-container-t1 .cert-name {
      font-weight: 500;
      color: var(--color-ink-mid);
    }

    .resume-container-t1 .cert-issuer {
      font-size: var(--size-small);
      color: var(--color-ink-muted);
      margin-left: 4px;
    }
  `;

  // Template 2 Style System (Blueprint Schematic Navy + Gold Sidebar Layout)
  const blueprintStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

    .resume-container-t2 {
      --navy:          #0F1923;
      --navy-mid:      #1C2D3E;
      --navy-soft:     #233142;
      --slate:         #3D5166;
      --gold:          ${color};
      --gold-dim:      ${color};
      --canvas:        #F7F5F2;
      --surface:       #FFFFFF;
      --rule:          #E0DBD4;
      --rule-soft:     #EDE9E3;

      --ink-1:         #111820;
      --ink-2:         #2C3E50;
      --ink-3:         #4A5E72;
      --ink-4:         #7A8FA3;

      --sidebar-ink-1: #EEF2F6;
      --sidebar-ink-2: #A8BDCD;
      --sidebar-ink-3: #6A8499;

      --font-display:  'DM Serif Display', Georgia, serif;
      --font-body:     'DM Sans', system-ui, sans-serif;
      --font-mono:     'JetBrains Mono', monospace;

      --size-name:     36px;
      --size-section:  10px;
      --size-role:     14.5px;
      --size-body:     13px;
      --size-small:    11.5px;
      --size-micro:    10.5px;

      --sidebar-w:     184px;

      font-family: var(--font-body);
      font-size: var(--size-body);
      color: var(--ink-3);
      background: var(--surface);
      line-height: 1.6;
    }

    .resume-container-t2 .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--surface);
      margin: 0 auto;
      text-align: left;
    }

    .resume-container-t2 .resume-header {
      background: var(--navy);
      padding: 34px 34px 28px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: end;
      border-bottom: 3.5px solid var(--gold);
    }

    .resume-container-t2 .resume-profile-pic {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--gold);
      flex-shrink: 0;
    }

    .resume-container-t2 .header-avatar-initials {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 2px solid var(--gold);
      background: var(--navy);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 400;
      color: var(--gold);
      letter-spacing: 0.04em;
    }

    .resume-container-t2 .header-identity {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container-t2 .resume-name {
      font-family: var(--font-display);
      font-size: var(--size-name);
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
      line-height: 1.05;
    }

    .resume-container-t2 .resume-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold);
      margin-top: 2px;
    }

    .resume-container-t2 .resume-tagline {
      font-size: 13px;
      font-style: italic;
      color: var(--sidebar-ink-2);
      margin-top: 4px;
    }

    .resume-container-t2 .header-contact {
      display: grid;
      grid-template-columns: auto;
      gap: 3.5px;
      align-content: end;
    }

    .resume-container-t2 .contact-item {
      display: flex;
      align-items: baseline;
      gap: 6px;
      overflow-wrap: anywhere;
      word-break: break-all;
    }

    .resume-container-t2 .contact-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gold);
      min-width: 50px;
    }

    .resume-container-t2 .contact-value {
      font-size: var(--size-small);
      color: var(--sidebar-ink-1);
    }

    .resume-container-t2 .resume-body {
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr;
      min-height: calc(1123px - 140px);
    }

    .resume-container-t2 .resume-sidebar {
      background: var(--navy-soft);
      padding: 28px 16px;
    }

    .resume-container-t2 .sidebar-block {
      padding-bottom: 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 18px;
    }

    .resume-container-t2 .sidebar-block:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .resume-container-t2 .sidebar-heading {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .resume-container-t2 .sidebar-heading::before {
      content: '';
      display: block;
      width: 20px;
      height: 1.5px;
      background: var(--gold);
      flex-shrink: 0;
    }

    .resume-container-t2 .sidebar-skill-group {
      margin-bottom: 12px;
    }

    .resume-container-t2 .sidebar-skill-group:last-child {
      margin-bottom: 0;
    }

    .resume-container-t2 .sidebar-skill-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--sidebar-ink-3);
      margin-bottom: 4px;
    }

    .resume-container-t2 .sidebar-skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }

    .resume-container-t2 .sidebar-tag {
      font-size: var(--size-micro);
      color: var(--sidebar-ink-2);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 2px;
      padding: 1.5px 5px;
      line-height: 1.4;
      white-space: nowrap;
    }

    .resume-container-t2 .sidebar-cert {
      margin-bottom: 10px;
    }

    .resume-container-t2 .sidebar-cert:last-child { margin-bottom: 0; }

    .resume-container-t2 .sidebar-cert-name {
      font-size: var(--size-small);
      font-weight: 500;
      color: var(--sidebar-ink-1);
      line-height: 1.3;
    }

    .resume-container-t2 .sidebar-cert-meta {
      font-size: var(--size-micro);
      color: var(--sidebar-ink-3);
      margin-top: 1.5px;
    }

    .resume-container-t2 .resume-content {
      padding: 28px 28px;
    }

    .resume-container-t2 .content-section {
      margin-bottom: 28px;
    }

    .resume-container-t2 .content-section:last-child {
      margin-bottom: 0;
    }

    .resume-container-t2 .section-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: var(--size-section);
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-1);
      margin-bottom: 16px;
    }

    .resume-container-t2 .section-heading::before {
      content: '';
      display: block;
      width: 7px;
      height: 7px;
      background: var(--gold);
      flex-shrink: 0;
      transform: rotate(45deg);
    }

    .resume-container-t2 .section-heading::after {
      content: '';
      flex: 1;
      height: 1.2px;
      background: var(--rule);
    }

    .resume-container-t2 .summary-text {
      font-size: var(--size-body);
      line-height: 1.65;
      color: var(--ink-3);
    }

    .resume-container-t2 .entry-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .resume-container-t2 .entry {
      display: grid;
      grid-template-columns: 8px 1fr;
      gap: 0 14px;
      position: relative;
    }

    .resume-container-t2 .entry-track {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .resume-container-t2 .entry-track::before {
      content: '';
      display: block;
      width: 7.5px;
      height: 7.5px;
      background: var(--gold);
      transform: rotate(45deg);
      flex-shrink: 0;
      margin-top: 3.5px;
      position: relative;
      z-index: 1;
    }

    .resume-container-t2 .entry-track::after {
      content: '';
      display: block;
      flex: 1;
      width: 1.5px;
      background: linear-gradient(to bottom, var(--rule) 0%, transparent 100%);
      margin-top: 4px;
    }

    .resume-container-t2 .entry:last-child .entry-track::after {
      display: none;
    }

    .resume-container-t2 .entry-role {
      font-size: var(--size-role);
      font-weight: 600;
      color: var(--ink-2);
      line-height: 1.25;
    }

    .resume-container-t2 .entry-meta {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0 7px;
      margin-top: 2px;
      font-size: var(--size-small);
      color: var(--ink-4);
    }

    .resume-container-t2 .entry-company { font-weight: 500; color: var(--ink-3); }
    .resume-container-t2 .entry-date { margin-left: auto; font-family: var(--font-mono); font-size: 10px; color: var(--ink-4); white-space: nowrap; }

    .resume-container-t2 .entry-sep {
      color: var(--rule);
    }

    .resume-container-t2 .badge-current {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--gold);
      background: rgba(201,168,76,0.1);
      border: 0.5px solid rgba(201,168,76,0.28);
      border-radius: 2px;
      padding: 1px 5px;
      vertical-align: middle;
    }

    .resume-container-t2 .entry-bullets {
      list-style: none;
      margin-top: 8px;
      padding-left: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container-t2 .entry-bullets li {
      font-size: var(--size-body);
      line-height: 1.55;
      color: var(--ink-3);
      padding-left: 16px;
      position: relative;
    }

    .resume-container-t2 .entry-bullets li::before {
      content: '—';
      position: absolute;
      left: 0;
      color: var(--gold);
      font-size: 11px;
      top: 0.15em;
      line-height: 1;
    }

    .resume-container-t2 .entry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      margin-top: 8px;
    }

    .resume-container-t2 .entry-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--ink-3);
      background: var(--rule-soft);
      border: 0.5px solid var(--rule);
      border-radius: 2px;
      padding: 1.5px 5.5px;
    }

    .resume-container-t2 .entry-description {
      font-size: var(--size-body);
      line-height: 1.6;
      color: var(--ink-3);
      margin-top: 5px;
    }
  `;

  // Template 3 Style System (Creative Editorial)
  const editorialStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

    .resume-container-t3 {
      --color-primary: #2B2D42;
      --color-secondary: #8D99AE;
      --color-accent: ${color};
      --color-bg: #EDF2F4;
      --color-surface: #FFFFFF;
      --color-text: #2B2D42;
      --color-text-muted: #6C757D;
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'Inter', sans-serif;

      font-family: var(--font-body);
      color: var(--color-text);
      background: var(--color-bg);
      line-height: 1.6;
    }

    .resume-container-t3 .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--color-surface);
      padding: 40px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 210px 1fr;
      gap: 28px;
      text-align: left;
    }

    .resume-container-t3 .left-col {
      border-right: 1px solid var(--color-bg);
      padding-right: 20px;
    }

    .resume-container-t3 .resume-profile-pic {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 3px solid var(--color-accent);
      object-fit: cover;
      margin-bottom: 18px;
    }

    .resume-container-t3 .header-avatar-initials {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 3px solid var(--color-accent);
      background: var(--color-surface);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: 18px;
      font-family: var(--font-display);
      font-size: 40px;
      font-weight: 400;
      color: var(--color-accent);
      letter-spacing: 0.04em;
    }

    .resume-container-t3 .name-heading {
      font-family: var(--font-display);
      font-size: 30px;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 6px;
      color: var(--color-primary);
    }

    .resume-container-t3 .title-sub {
      font-size: 11px;
      font-weight: 600;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 20px;
    }

    .resume-container-t3 .contact-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 24px;
    }

    .resume-container-t3 .contact-item {
      font-size: 12px;
      color: var(--color-text);
    }

    .resume-container-t3 .contact-label {
      font-weight: 600;
      color: var(--color-secondary);
      font-size: 9.5px;
      text-transform: uppercase;
      display: block;
    }

    .resume-container-t3 .sec-title {
      font-family: var(--font-display);
      font-size: 14.5px;
      font-weight: 700;
      margin-bottom: 10px;
      color: var(--color-primary);
      border-bottom: 2px solid var(--color-accent);
      padding-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .resume-container-t3 .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .resume-container-t3 .tag {
      background: var(--color-bg);
      padding: 3px 7px;
      border-radius: 3px;
      font-size: 10.5px;
      color: var(--color-primary);
      border: 0.5px solid var(--color-secondary);
    }

    .resume-container-t3 .entry {
      margin-bottom: 18px;
    }

    .resume-container-t3 .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .resume-container-t3 .role-title {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--color-primary);
    }

    .resume-container-t3 .meta {
      font-size: 11.5px;
      color: var(--color-secondary);
    }

    .resume-container-t3 .bullets {
      margin-top: 6px;
      padding-left: 14px;
    }

    .resume-container-t3 .bullets li {
      font-size: 12.5px;
      margin-bottom: 3px;
      color: var(--color-text);
    }
  `;

  // Template 4 Style System (Modern Technical Grid)
  const technicalGridStyles = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap');

    .resume-container-t4 {
      --color-grid: #E5E7EB;
      --color-text: #1F2937;
      --color-accent: ${color};
      --font-mono: 'JetBrains Mono', monospace;
      --font-sans: 'DM Sans', sans-serif;

      font-family: var(--font-sans);
      color: var(--color-text);
      background: #F9FAFB;
      line-height: 1.5;
    }

    .resume-container-t4 .resume {
      width: 794px;
      min-height: 1123px;
      background: #FFFFFF;
      border: 1px solid var(--color-grid);
      padding: 40px;
      margin: 0 auto;
      text-align: left;
    }

    .resume-container-t4 .grid-header {
      display: grid;
      grid-template-columns: auto 1fr;
      border-bottom: 2px solid var(--color-text);
      padding-bottom: 18px;
      margin-bottom: 24px;
      align-items: center;
      gap: 18px;
    }

    .resume-container-t4 .resume-profile-pic {
      width: 110px;
      height: 110px;
      border: 2px solid var(--color-accent);
      object-fit: cover;
      flex-shrink: 0;
    }

    .resume-container-t4 .header-avatar-initials {
      width: 110px;
      height: 110px;
      border: 2px solid var(--color-accent);
      background: #F9FAFB;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: var(--font-mono);
      font-size: 36px;
      font-weight: 400;
      color: var(--color-accent);
      letter-spacing: 0.04em;
    }

    .resume-container-t4 .name {
      font-family: var(--font-mono);
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -1px;
      color: var(--color-text);
    }

    .resume-container-t4 .contact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--color-grid);
      padding-bottom: 12px;
      color: var(--color-text);
      overflow-wrap: anywhere;
      word-break: break-all;
    }

    .resume-container-t4 .section-title {
      font-family: var(--font-mono);
      font-size: 12.5px;
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      margin-bottom: 14px;
      letter-spacing: 0.5px;
    }

    .resume-container-t4 .grid-block {
      border-bottom: 1px solid var(--color-grid);
      padding-bottom: 18px;
      margin-bottom: 18px;
    }

    .resume-container-t4 .job-entry {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 14px;
      margin-bottom: 14px;
    }

    .resume-container-t4 .job-date {
      font-family: var(--font-mono);
      font-size: 11.5px;
      color: var(--color-accent);
      font-weight: 500;
    }

    .resume-container-t4 .bullets {
      list-style-type: square;
      padding-left: 16px;
      margin-top: 4px;
      font-size: 12.5px;
    }

    .resume-container-t4 .bullets li {
      margin-bottom: 3px;
    }
  `;

  // Template 5 Style System (Executive Heritage)
  const executiveHeritageStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');

    .resume-container-t5 {
      --color-accent: ${color};
      --color-text: #2C3539;
      --font-display: 'Playfair Display', Georgia, serif;
      --font-body: 'Inter', sans-serif;

      font-family: var(--font-body);
      color: var(--color-text);
      background: #FDFBF7;
      line-height: 1.6;
    }

    .resume-container-t5 .resume {
      width: 794px;
      min-height: 1123px;
      background: #FFFFFF;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 46px;
      margin: 0 auto;
      text-align: left;
    }

    .resume-container-t5 .header-center {
      text-align: center;
      border-bottom: 2.5px double var(--color-accent);
      padding-bottom: 18px;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .resume-container-t5 .resume-profile-pic {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      object-fit: cover;
      flex-shrink: 0;
    }

    .resume-container-t5 .header-avatar-initials {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 2px solid var(--color-accent);
      background: #FDFBF7;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: var(--font-display);
      font-size: 40px;
      font-weight: 400;
      color: var(--color-accent);
      letter-spacing: 0.04em;
    }

    .resume-container-t5 .name {
      font-family: var(--font-display);
      font-size: 34px;
      font-weight: 700;
      color: var(--color-accent);
    }

    .resume-container-t5 .tagline {
      font-family: var(--font-display);
      font-style: italic;
      font-size: 13.5px;
      color: var(--color-text);
      margin-top: 2px;
    }

    .resume-container-t5 .contact-bar {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 6px 14px;
      font-size: 11.5px;
      margin-top: 6px;
      color: var(--color-text);
    }

    .resume-container-t5 .sec-title {
      font-family: var(--font-display);
      font-size: 14.5px;
      font-weight: 700;
      color: var(--color-accent);
      text-align: center;
      margin-top: 22px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .resume-container-t5 .divider {
      width: 50px;
      height: 1px;
      background: var(--color-accent);
      margin: 0 auto 10px;
    }

    .resume-container-t5 .experience-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .resume-container-t5 .exp-item {
      margin-bottom: 10px;
    }

    .resume-container-t5 .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 600;
      font-size: 13px;
      color: var(--color-text);
    }

    .resume-container-t5 .exp-role {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--size-role);
      color: var(--color-text);
    }

    .resume-container-t5 .exp-date {
      font-size: var(--size-small);
      color: var(--color-accent);
      font-weight: 600;
      white-space: nowrap;
    }

    .resume-container-t5 .exp-sub {
      font-size: var(--size-small);
      color: var(--ink-muted, #6C757D);
      margin-bottom: 0.4rem;
    }

    .resume-container-t5 .exp-bullets {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      padding-left: 0;
    }

    .resume-container-t5 .exp-bullets li {
      font-size: var(--size-body, 13px);
      position: relative;
      padding-left: 0.75rem;
      line-height: 1.55;
      color: var(--color-text);
    }

    .resume-container-t5 .exp-bullets li::before {
      content: '\\2014';
      position: absolute;
      left: 0;
      color: var(--color-accent);
      font-size: 10px;
      top: 0.15em;
    }

    .resume-container-t5 .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
    }

    .resume-container-t5 .skill-category {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 0 14px;
      align-items: start;
    }

    .resume-container-t5 .skill-cat-label {
      font-size: var(--size-small, 11.5px);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.02em;
      padding-top: 2px;
      text-align: right;
    }

    .resume-container-t5 .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      border-left: 1.5px solid var(--ink-muted, #718096);
      padding-left: 12px;
    }

    .resume-container-t5 .skill-tag {
      font-size: 10.5px;
      font-weight: 500;
      color: var(--color-text);
      background: var(--tag-bg, #F0EBE3);
      border: 0.5px solid var(--tag-border, #E2D9CE);
      border-radius: 2px;
      padding: 2px 7px;
      white-space: nowrap;
    }

    .resume-container-t5 .project-item {
      margin-bottom: 14px;
    }

    .resume-container-t5 .project-item:last-child {
      margin-bottom: 0;
    }

    .resume-container-t5 .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }

    .resume-container-t5 .project-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--size-role, 15px);
      color: var(--color-text);
    }

    .resume-container-t5 .project-context {
      font-size: var(--size-small, 11.5px);
      color: var(--color-accent);
      font-weight: 600;
      white-space: nowrap;
    }

    .resume-container-t5 .project-desc {
      font-size: var(--size-body, 13px);
      color: var(--color-text);
      line-height: 1.6;
      margin-top: 0.2rem;
    }

    .resume-container-t5 .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 0.4rem;
    }

    .resume-container-t5 .project-tag {
      font-size: 10px;
      font-weight: 500;
      color: var(--color-text);
      background: var(--tag-bg, #F0EBE3);
      border: 0.5px solid var(--tag-border, #E2D9CE);
      border-radius: 2px;
      padding: 1.5px 6px;
    }

    .resume-container-t5 .edu-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .resume-container-t5 .edu-item {
      border-left: 2.5px solid var(--ink-muted, #718096);
      padding-left: 1rem;
    }

    .resume-container-t5 .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .resume-container-t5 .edu-degree {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: var(--size-role, 15px);
      color: var(--color-text);
    }

    .resume-container-t5 .edu-date {
      font-size: var(--size-small, 11.5px);
      color: var(--color-accent);
      font-weight: 600;
    }

    .resume-container-t5 .edu-sub {
      font-size: var(--size-small, 11.5px);
      color: var(--ink-muted, #6C757D);
    }

    .resume-container-t5 .edu-desc {
      font-size: var(--size-body, 13px);
      color: var(--color-text);
      margin-top: 0.2rem;
    }

    .resume-container-t5 .cert-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .resume-container-t5 .cert-item {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0 1rem;
      align-items: baseline;
    }

    .resume-container-t5 .cert-name {
      font-size: var(--size-body, 13px);
      font-weight: 500;
      color: var(--color-text);
    }

    .resume-container-t5 .cert-issuer {
      font-size: var(--size-small, 11.5px);
      color: var(--ink-muted, #6C757D);
    }
  `;

  // Template 6 Style System (Luxury Editorial Gold Sidebar Layout)
  const luxuryGoldStyles = `
    .resume-container-t6 {
      --color-ink: #1A1916;
      --color-ink-2: #3D3B37;
      --color-ink-3: #706D66;
      --color-ink-4: #A09D97;
      --color-rule: #D4CFC8;
      --color-rule-light: #EAE6E0;
      --color-paper: #FDFBF8;
      --color-gold: var(--accent);
      --color-gold-light: var(--accent);
      --color-gold-bg: #F5EED8;
      --color-sidebar: #211F1B;
      --color-sidebar-2: #2F2C27;

      --font-display: 'Cormorant Garamond', Georgia, serif;
      --font-body: 'DM Sans', system-ui, sans-serif;

      --sidebar-w: 210px;

      font-family: var(--font-body);
      font-size: 13px;
      color: var(--color-ink);
      background: #E8E4DC;
      line-height: 1.5;
    }

    .resume-container-t6 .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--color-paper);
      margin: 0 auto;
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr;
      grid-template-rows: auto 1fr;
      text-align: left;
    }

    .resume-container-t6 .resume-header {
      grid-column: 1 / -1;
      background: var(--color-sidebar);
      padding: 32px 40px 28px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 24px;
      border-bottom: 3px solid var(--color-gold);
    }

    .resume-container-t6 .resume-profile-pic {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 2px solid var(--color-gold);
      object-fit: cover;
      flex-shrink: 0;
      background: var(--color-sidebar-2);
    }

    .resume-container-t6 .header-avatar-initials {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      border: 2px solid var(--color-gold);
      background: var(--color-sidebar-2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 400;
      color: var(--color-gold);
      letter-spacing: 0.04em;
    }

    .resume-container-t6 .header-identity {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container-t6 .resume-name {
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 300;
      letter-spacing: 0.06em;
      color: #FDFBF8;
      line-height: 1.0;
      text-transform: uppercase;
    }

    .resume-container-t6 .resume-name strong {
      font-weight: 500;
    }

    .resume-container-t6 .resume-title {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 300;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--color-gold-light);
      margin-top: 4px;
    }

    .resume-container-t6 .resume-tagline {
      font-style: italic;
      font-size: 12px;
      color: var(--color-ink-3);
      margin-top: 2px;
    }

    .resume-container-t6 .header-contact {
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: flex-end;
      min-width: 180px;
    }

    .resume-container-t6 .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10.5px;
      color: #C8C4BC;
      text-decoration: none;
      font-weight: 300;
      letter-spacing: 0.01em;
      overflow-wrap: anywhere;
      word-break: break-all;
    }

    .resume-container-t6 .contact-label {
      display: none;
    }

    .resume-container-t6 .contact-dot {
      width: 3px;
      height: 3px;
      background: var(--color-gold);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .resume-container-t6 .resume-sidebar {
      background: var(--color-sidebar);
      padding: 28px 20px 40px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .resume-container-t6 .sidebar-section-title {
      font-family: var(--font-body);
      font-size: 8.5px;
      font-weight: 500;
      letter-spacing: 0.20em;
      text-transform: uppercase;
      color: var(--color-gold);
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 0.5px solid rgba(180, 150, 90, 0.30);
    }

    .resume-container-t6 .skill-group {
      margin-bottom: 10px;
    }

    .resume-container-t6 .skill-group:last-child {
      margin-bottom: 0;
    }

    .resume-container-t6 .sidebar-skill-label {
      font-size: 9.5px;
      font-weight: 500;
      color: #A09D97;
      letter-spacing: 0.04em;
      margin-bottom: 4px;
    }

    .resume-container-t6 .sidebar-skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }

    .resume-container-t6 .sidebar-tag {
      font-size: 9px;
      font-weight: 300;
      color: #D4CFC8;
      background: rgba(255, 255, 255, 0.05);
      border: 0.5px solid rgba(255, 255, 255, 0.10);
      padding: 1.5px 6px;
      border-radius: 2px;
      letter-spacing: 0.02em;
      line-height: 1.5;
      white-space: nowrap;
    }

    .resume-container-t6 .sidebar-cert {
      margin-bottom: 8px;
    }

    .resume-container-t6 .sidebar-cert:last-child {
      margin-bottom: 0;
    }

    .resume-container-t6 .sidebar-cert-name {
      font-size: 10px;
      font-weight: 400;
      color: #EAE6E0;
      line-height: 1.3;
    }

    .resume-container-t6 .sidebar-cert-meta {
      font-size: 8.5px;
      color: #706D66;
      margin-top: 1px;
      letter-spacing: 0.04em;
    }

    .resume-container-t6 .sidebar-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .resume-container-t6 .sidebar-list li {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 9.5px;
      font-weight: 300;
      color: #C8C4BC;
      line-height: 1.4;
    }

    .resume-container-t6 .sidebar-list li::before {
      content: '';
      width: 4px;
      height: 4px;
      background: var(--color-gold);
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .resume-container-t6 .sidebar-list .list-sub {
      font-size: 8px;
      color: #706D66;
      display: block;
      margin-top: 1px;
      letter-spacing: 0.04em;
    }

    .resume-container-t6 .resume-main {
      padding: 28px 32px 40px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .resume-container-t6 .content-section {
      margin-bottom: 0;
    }

    .resume-container-t6 .content-section:last-child {
      margin-bottom: 0;
    }

    .resume-container-t6 .section-heading {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 300;
      letter-spacing: 0.10em;
      color: var(--color-ink);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }

    .resume-container-t6 .section-heading::after {
      content: '';
      flex: 1;
      height: 0.5px;
      background: var(--color-rule);
    }

    .resume-container-t6 .summary-text {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 300;
      color: var(--color-ink-2);
      line-height: 1.65;
      font-style: italic;
      padding-left: 14px;
      border-left: 2px solid var(--color-gold);
    }

    .resume-container-t6 .entry-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .resume-container-t6 .entry {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
      padding-bottom: 16px;
      border-bottom: 0.5px solid var(--color-rule-light);
    }

    .resume-container-t6 .entry:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .resume-container-t6 .entry-role {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 500;
      color: var(--color-ink);
      line-height: 1.2;
    }

    .resume-container-t6 .entry-meta {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0 6px;
      margin-top: 1px;
      font-size: 10px;
      color: var(--color-ink-4);
    }

    .resume-container-t6 .entry-company {
      font-weight: 500;
      color: var(--color-ink-2);
    }

    .resume-container-t6 .entry-date {
      margin-left: auto;
      font-size: 9px;
      color: var(--color-gold);
      white-space: nowrap;
      background: var(--color-gold-bg);
      padding: 1px 6px;
      border-radius: 1px;
    }

    .resume-container-t6 .badge-current {
      font-size: 8px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--color-gold);
      background: rgba(184, 152, 96, 0.1);
      border: 0.5px solid rgba(184, 152, 96, 0.28);
      border-radius: 2px;
      padding: 1px 4px;
      vertical-align: middle;
    }

    .resume-container-t6 .entry-sep {
      color: var(--color-rule);
    }

    .resume-container-t6 .entry-bullets {
      list-style: none;
      margin-top: 5px;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .resume-container-t6 .entry-bullets li {
      font-size: 11px;
      line-height: 1.5;
      color: var(--color-ink-2);
      position: relative;
      padding-left: 10px;
    }

    .resume-container-t6 .entry-bullets li::before {
      content: '\\2013';
      position: absolute;
      left: 0;
      color: var(--color-gold);
      font-size: 10px;
      top: 0.1em;
    }

    .resume-container-t6 .entry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      margin-top: 6px;
    }

    .resume-container-t6 .entry-tag {
      font-size: 9px;
      font-weight: 400;
      color: var(--color-gold);
      letter-spacing: 0.10em;
      text-transform: uppercase;
    }

    .resume-container-t6 .entry-description {
      font-size: 11px;
      line-height: 1.55;
      color: var(--color-ink-2);
      margin-top: 4px;
    }

    .resume-container-t6 .project-card {
      background: #F7F3EC;
      border-left: 2px solid var(--color-gold);
      padding: 10px 12px;
      border-radius: 0 2px 2px 0;
    }

    .resume-container-t6 .project-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 3px;
    }

    .resume-container-t6 .project-card-name {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 500;
      color: var(--color-ink);
    }

    .resume-container-t6 .project-card-stack {
      font-size: 8px;
      font-weight: 400;
      color: var(--color-gold);
      letter-spacing: 0.10em;
      text-transform: uppercase;
    }

    .resume-container-t6 .project-card-desc {
      font-size: 10px;
      font-weight: 300;
      color: var(--color-ink-2);
      line-height: 1.5;
    }

    .resume-container-t6 .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .resume-container-t6 .skill-category-label {
      font-size: 8px;
      font-weight: 600;
      color: var(--color-ink-4);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 3px;
    }

    .resume-container-t6 .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }

    .resume-container-t6 .skill-tag {
      font-size: 9px;
      font-weight: 300;
      color: var(--color-ink-2);
      background: #F7F3EC;
      border: 0.5px solid var(--color-rule);
      padding: 1.5px 5px;
      border-radius: 2px;
      white-space: nowrap;
    }

    .resume-container-t6 .cert-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .resume-container-t6 .cert-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: 11px;
    }

    .resume-container-t6 .cert-name {
      font-weight: 400;
      color: var(--color-ink-2);
    }

    .resume-container-t6 .cert-issuer {
      font-size: 9px;
      color: var(--color-ink-4);
      margin-left: 4px;
    }
  `;

  // Render Template 6: Luxury Editorial Gold
  if (templateId === 6) {
    return (
      <div className="resume-container resume-container-t6" style={{ '--accent': color } as React.CSSProperties}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: luxuryGoldStyles }} />
        <article className="resume">
          <header className="resume-header">
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              {personalInfo.profilePicture ? (
                <img
                  src={personalInfo.profilePicture}
                  alt={`${displayFirst} ${displayLast}`}
                  className="resume-profile-pic"
                />
              ) : (
                <div className="header-avatar-initials" aria-hidden="true">
                  {displayFirst.charAt(0)}{displayLast.charAt(0)}
                </div>
              )}
              <div className="header-identity">
                <h1 className="resume-name">
                  {displayFirst} <strong>{displayLast}</strong>
                </h1>
                <p className="resume-title">{displayTitle}</p>
              </div>
            </div>
            <address className="header-contact" style={{ fontStyle: "normal" }}>
              {displayEmail && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayEmail}
                </span>
              )}
              {displayPhone && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayPhone}
                </span>
              )}
              {displayLocation && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayLocation}
                </span>
              )}
              {displayLinkedin && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayLinkedin}
                </span>
              )}
              {displayGithub && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayGithub}
                </span>
              )}
              {displayPortfolio && (
                <span className="contact-item">
                  <span className="contact-dot" />
                  {displayPortfolio}
                </span>
              )}
            </address>
          </header>

          <aside className="resume-sidebar">
            {displaySkills.length > 0 && (
              <section>
                <h2 className="sidebar-section-title">Skills</h2>
                {Object.keys(groupedSkills).map((cat) => (
                  <div key={cat} className="skill-group">
                    <p className="sidebar-skill-label">{cat}</p>
                    <div className="sidebar-skill-tags">
                      {groupedSkills[cat].map((sk) => (
                        <span key={sk.id} className="sidebar-tag">{sk.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {displayEducations.length > 0 && (
              <section>
                <h2 className="sidebar-section-title">Education</h2>
                {displayEducations.map((edu: any) => {
                  const dateStart = formatMonthYear(edu.startDate);
                  const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                  return (
                    <div key={edu.id} className="skill-group">
                      <p className="sidebar-skill-label" style={{ color: "#EAE6E0", fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 400 }}>
                        {edu.degree}
                      </p>
                      {edu.fieldOfStudy && (
                        <p className="sidebar-skill-label">{edu.fieldOfStudy}</p>
                      )}
                      <p className="sidebar-skill-label" style={{ color: "#A09D97" }}>
                        {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                      </p>
                      <p className="sidebar-skill-label" style={{ color: "#706D66", fontSize: "8px", letterSpacing: "0.06em" }}>
                        {dateStart} – {dateEnd}
                      </p>
                    </div>
                  );
                })}
              </section>
            )}

            {displayCertifications.length > 0 && (
              <section>
                <h2 className="sidebar-section-title">Certifications</h2>
                {displayCertifications.map((cert: any) => (
                  <div key={cert.id} className="skill-group">
                    <p className="sidebar-cert-name">{cert.name}</p>
                    {cert.organization && <p className="sidebar-cert-meta">{cert.organization}</p>}
                  </div>
                ))}
              </section>
            )}
          </aside>

          <main className="resume-main">
            {displaySummary && (
              <section className="content-section">
                <h2 className="section-heading">Profile</h2>
                <p className="summary-text">{displaySummary}</p>
              </section>
            )}

            {displayExperiences.length > 0 && (
              <section className="content-section">
                <h2 className="section-heading">Experience</h2>
                <div className="entry-list">
                  {displayExperiences.map((exp: any) => {
                    const dateStart = formatMonthYear(exp.startDate);
                    const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                    return (
                      <article key={exp.id} className="entry">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                          <h3 className="entry-role">{exp.role}</h3>
                          <span className="entry-date">
                            {exp.isCurrent ? <span className="badge-current">Present</span> : null} {dateStart} — {dateEnd}
                          </span>
                        </div>
                        <div className="entry-meta">
                          <span className="entry-company">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="entry-sep">·</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>
                        {exp.description && (
                          <ul className="entry-bullets">
                            {exp.description.split("\n").map((line: string, idx: number) => {
                              const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                              if (!clean) return null;
                              return <li key={idx}>{clean}</li>;
                            })}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {displayProjects.length > 0 && (
              <section className="content-section">
                <h2 className="section-heading">Projects</h2>
                <div className="entry-list">
                  {displayProjects.map((proj: any) => (
                    <div key={proj.id} className="project-card">
                      <div className="project-card-header">
                        <h3 className="project-card-name">{proj.name}</h3>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="project-card-stack">{proj.technologies.join(" · ")}</span>
                        )}
                      </div>
                      {proj.role && <p className="project-card-desc" style={{ fontWeight: 500 }}>{proj.role}</p>}
                      {proj.description && <p className="project-card-desc">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </article>
      </div>
    );
  }

  // Render Template 3: Creative Editorial
  if (templateId === 3) {
    return (
      <div className="resume-container resume-container-t3">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: editorialStyles }} />
        <article className="resume">
          <div className="left-col">
            {personalInfo.profilePicture ? (
              <img src={personalInfo.profilePicture} className="resume-profile-pic" alt="Profile" />
            ) : (
              <div className="header-avatar-initials" aria-hidden="true">
                {displayFirst.charAt(0)}{displayLast.charAt(0)}
              </div>
            )}
            <h1 className="name-heading">{displayFirst} {displayLast}</h1>
            <p className="title-sub">{displayTitle}</p>

            <div className="contact-list">
              {displayEmail && (
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  {displayEmail}
                </div>
              )}
              {displayPhone && (
                <div className="contact-item">
                  <span className="contact-label">Phone</span>
                  {displayPhone}
                </div>
              )}
              {displayLocation && (
                <div className="contact-item">
                  <span className="contact-label">Location</span>
                  {displayLocation}
                </div>
              )}
              {displayLinkedin && (
                <div className="contact-item">
                  <span className="contact-label">LinkedIn</span>
                  {displayLinkedin}
                </div>
              )}
              {displayGithub && (
                <div className="contact-item">
                  <span className="contact-label">GitHub</span>
                  {displayGithub}
                </div>
              )}
              {displayPortfolio && (
                <div className="contact-item">
                  <span className="contact-label">Portfolio</span>
                  {displayPortfolio}
                </div>
              )}
            </div>

            {displaySkills.length > 0 && (
              <div className="skills-sec">
                <h2 className="sec-title">Expertise</h2>
                <div className="skill-tags">
                  {displaySkills.slice(0, 10).map((sk) => (
                    <span key={sk.id} className="tag">{sk.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="right-col">
            {displaySummary && (
              <section className="content-section">
                <h2 className="sec-title">Profile</h2>
                <p style={{ fontSize: "12.5px", marginBottom: "20px" }}>{displaySummary}</p>
              </section>
            )}

            {displayExperiences.length > 0 && (
              <section className="content-section">
                <h2 className="sec-title">Experience</h2>
                {displayExperiences.map((exp: any) => {
                  const dateStart = formatMonthYear(exp.startDate);
                  const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                  return (
                    <div key={exp.id} className="entry">
                      <div className="entry-header">
                        <h3 className="role-title">{exp.role}</h3>
                        <span className="meta">{dateStart} — {dateEnd}</span>
                      </div>
                      <p className="meta" style={{ marginBottom: "4px" }}>{exp.company} · {exp.location}</p>
                      {exp.description && (
                        <ul className="bullets">
                          {exp.description.split("\n").map((line: string, idx: number) => {
                            const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                            if (!clean) return null;
                            return <li key={idx}>{clean}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </section>
            )}

            {/* PROJECTS */}
            {displayProjects.length > 0 && (
              <section className="content-section">
                <h2 className="sec-title">Notable Projects</h2>
                {displayProjects.map((proj: any) => (
                  <div key={proj.id} className="entry">
                    <h3 className="role-title">{proj.name}</h3>
                    {proj.role && <p className="meta">{proj.role}</p>}
                    {proj.description && <p style={{ fontSize: "12.5px", marginTop: "4px" }}>{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="skill-tags" style={{ marginTop: "6px" }}>
                        {proj.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* EDUCATION */}
            {displayEducations.length > 0 && (
              <section className="content-section">
                <h2 className="sec-title">Education</h2>
                {displayEducations.map((edu: any) => {
                  const dateStart = formatMonthYear(edu.startDate);
                  const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                  return (
                    <div key={edu.id} className="entry">
                      <div className="entry-header">
                        <h3 className="role-title">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</h3>
                        <span className="meta">{dateStart} — {dateEnd}</span>
                      </div>
                      <p className="meta">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}</p>
                      {edu.description && <p style={{ fontSize: "12.5px", marginTop: "4px" }}>{edu.description}</p>}
                    </div>
                  );
                })}
              </section>
            )}

            {/* CERTIFICATIONS */}
            {displayCertifications.length > 0 && (
              <section className="content-section">
                <h2 className="sec-title">Certifications</h2>
                {displayCertifications.map((cert: any) => (
                  <div key={cert.id} style={{ marginBottom: "6px", fontSize: "12.5px" }}>
                    <span style={{ fontWeight: 500 }}>{cert.name}</span>
                    {cert.organization && <span className="meta"> — {cert.organization}</span>}
                  </div>
                ))}
              </section>
            )}
          </div>
        </article>
      </div>
    );
  }


  // Render Template 4: Modern Technical Grid
  if (templateId === 4) {
    return (
      <div className="resume-container resume-container-t4">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: technicalGridStyles }} />
        <article className="resume">
          <div className="grid-header">
            {personalInfo.profilePicture ? (
              <img src={personalInfo.profilePicture} className="resume-profile-pic" alt="Profile" />
            ) : (
              <div className="header-avatar-initials" aria-hidden="true">
                {displayFirst.charAt(0)}{displayLast.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="name">{displayFirst} {displayLast}</h1>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--color-accent)" }}>
                [ {displayTitle.toUpperCase()} ]
              </p>
            </div>
          </div>

          <div className="contact-grid">
            {displayEmail && <div>EMAIL: {displayEmail}</div>}
            {displayPhone && <div>PHONE: {displayPhone}</div>}
            {displayLocation && <div>LOC: {displayLocation}</div>}
            {displayLinkedin && <div>LINKEDIN: {displayLinkedin}</div>}
            {displayGithub && <div>GITHUB: {displayGithub}</div>}
            {displayPortfolio && <div>PORTFOLIO: {displayPortfolio}</div>}
          </div>

          {displaySummary && (
            <div className="grid-block">
              <h2 className="section-title">// SUMMARY</h2>
              <p style={{ fontSize: "12.5px" }}>{displaySummary}</p>
            </div>
          )}

          {displayExperiences.length > 0 && (
            <div className="grid-block">
              <h2 className="section-title">// EXPERIENCE</h2>
              {displayExperiences.map((exp: any) => {
                const dateStart = formatMonthYear(exp.startDate);
                const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                return (
                  <div key={exp.id} className="job-entry">
                    <span className="job-date">{dateStart.toUpperCase()} — {dateEnd.toUpperCase()}</span>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "13px" }}>{exp.role} @ {exp.company}</h3>
                      {exp.description && (
                        <ul className="bullets">
                          {exp.description.split("\n").map((line: string, idx: number) => {
                            const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                            if (!clean) return null;
                            return <li key={idx}>{clean}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PROJECTS */}
          {displayProjects.length > 0 && (
            <div className="grid-block">
              <h2 className="section-title">// PROJECTS</h2>
              {displayProjects.map((proj: any) => (
                <div key={proj.id} className="job-entry">
                  <span className="job-date">PROJECT</span>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "13px" }}>{proj.name}</h3>
                    {proj.description && <p style={{ fontSize: "12.5px", marginTop: "4px" }}>{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                        {proj.technologies.map((tech: string, idx: number) => (
                          <span key={idx} style={{
                            fontFamily: "var(--font-mono)", fontSize: "10px",
                            background: "var(--tag-bg, #F3F4F6)", border: "1px solid var(--color-grid, #E5E7EB)",
                            borderRadius: "2px", padding: "1.5px 5px", color: "var(--color-text)"
                          }}>{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {displayEducations.length > 0 && (
            <div className="grid-block">
              <h2 className="section-title">// EDUCATION</h2>
              {displayEducations.map((edu: any) => {
                const dateStart = formatMonthYear(edu.startDate);
                const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                return (
                  <div key={edu.id} className="job-entry">
                    <span className="job-date">{dateStart.toUpperCase()} — {dateEnd.toUpperCase()}</span>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "13px" }}>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</h3>
                      <p style={{ fontSize: "11.5px", color: "var(--text-muted, #9CA3AF)" }}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}</p>
                      {edu.description && <p style={{ fontSize: "12.5px", marginTop: "4px" }}>{edu.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SKILLS */}
          {displaySkills.length > 0 && (
            <div className="grid-block">
              <h2 className="section-title">// TECHNICAL STACK</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {Object.keys(groupedSkills).map((cat) => (
                  <div key={cat}>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, color: "var(--text-muted, #9CA3AF)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{cat}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {groupedSkills[cat].map((sk) => (
                        <span key={sk.id} style={{
                          fontFamily: "var(--font-mono)", fontSize: "10px",
                          background: "var(--tag-bg, #F3F4F6)", border: "1px solid var(--color-grid, #E5E7EB)",
                          borderRadius: "2px", padding: "2px 6px", color: "var(--color-text)"
                        }}>{sk.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {displayCertifications.length > 0 && (
            <div className="grid-block">
              <h2 className="section-title">// CERTIFICATIONS</h2>
              {displayCertifications.map((cert: any) => (
                <div key={cert.id} style={{ marginBottom: "6px", fontSize: "12.5px" }}>
                  <span style={{ fontWeight: 500 }}>{cert.name}</span>
                  {cert.organization && <span style={{ color: "var(--text-muted, #9CA3AF)", fontSize: "11px" }}> — {cert.organization}</span>}
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Render Template 5: Executive Heritage
  if (templateId === 5) {
    return (
      <div className="resume-container resume-container-t5">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: executiveHeritageStyles }} />
        <article className="resume">
          <div className="header-center">
            {personalInfo.profilePicture ? (
              <img src={personalInfo.profilePicture} className="resume-profile-pic" alt="Profile" />
            ) : (
              <div className="header-avatar-initials" aria-hidden="true">
                {displayFirst.charAt(0)}{displayLast.charAt(0)}
              </div>
            )}
            <h1 className="name">{displayFirst} {displayLast}</h1>
            <p className="tagline">{displayTitle}</p>
            <div className="contact-bar">
              {displayEmail && <span>{displayEmail}</span>}
              {displayPhone && (
                <>
                  <span>·</span>
                  <span>{displayPhone}</span>
                </>
              )}
              {displayLocation && (
                <>
                  <span>·</span>
                  <span>{displayLocation}</span>
                </>
              )}
              {displayLinkedin && (
                <>
                  <span>·</span>
                  <span>{displayLinkedin}</span>
                </>
              )}
              {displayGithub && (
                <>
                  <span>·</span>
                  <span>{displayGithub}</span>
                </>
              )}
              {displayPortfolio && (
                <>
                  <span>·</span>
                  <span>{displayPortfolio}</span>
                </>
              )}
            </div>
          </div>

          {displaySummary && (
            <>
              <h2 className="sec-title">Profile</h2>
              <div className="divider"></div>
              <p style={{ fontSize: "12.5px", textAlign: "center", marginBottom: "20px" }}>{displaySummary}</p>
            </>
          )}

          {displayExperiences.length > 0 && (
            <>
              <h2 className="sec-title">Experience</h2>
              <div className="divider"></div>
              <div className="experience-list">
                {displayExperiences.map((exp: any) => {
                  const dateStart = formatMonthYear(exp.startDate);
                  const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                  return (
                    <div key={exp.id} className="exp-item">
                      <div className="exp-header">
                        <span className="exp-role">{exp.role}</span>
                        <span className="exp-date">{dateStart} — {dateEnd}</span>
                      </div>
                      <p className="exp-sub">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                      {exp.description && (
                        <ul className="exp-bullets">
                          {exp.description.split("\n").map((line: string, idx: number) => {
                            const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                            if (!clean) return null;
                            return <li key={idx}>{clean}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {displayProjects.length > 0 && (
            <>
              <h2 className="sec-title">Projects</h2>
              <div className="divider"></div>
              {displayProjects.map((proj: any) => (
                <div key={proj.id} className="project-item">
                  <div className="project-header">
                    <span className="project-name">{proj.name}</span>
                    {proj.role && <span className="project-context">{proj.role}</span>}
                  </div>
                  {proj.description && <p className="project-desc">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="project-tags">
                      {proj.technologies.map((tech: string, idx: number) => (
                        <span key={idx} className="project-tag">{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {displayEducations.length > 0 && (
            <>
              <h2 className="sec-title">Education</h2>
              <div className="divider"></div>
              <div className="edu-list">
                {displayEducations.map((edu: any) => {
                  const dateStart = formatMonthYear(edu.startDate);
                  const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                  return (
                    <div key={edu.id} className="edu-item">
                      <div className="edu-header">
                        <span className="edu-degree">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}</span>
                        <span className="edu-date">{dateStart} — {dateEnd}</span>
                      </div>
                      <p className="edu-sub">{edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}</p>
                      {edu.description && <p className="edu-desc">{edu.description}</p>}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {displaySkills.length > 0 && (
            <>
              <h2 className="sec-title">Skills</h2>
              <div className="divider"></div>
              <div className="skills-grid">
                {Object.keys(groupedSkills).map((cat) => (
                  <div key={cat} className="skill-category">
                    <span className="skill-cat-label">{cat}</span>
                    <div className="skill-tags">
                      {groupedSkills[cat].map((sk) => (
                        <span key={sk.id} className="skill-tag">{sk.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {displayCertifications.length > 0 && (
            <>
              <h2 className="sec-title">Certifications</h2>
              <div className="divider"></div>
              <div className="cert-list">
                {displayCertifications.map((cert: any) => (
                  <div key={cert.id} className="cert-item">
                    <span className="cert-name">{cert.name}</span>
                    {cert.organization && <span className="cert-issuer">{cert.organization}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </article>
      </div>
    );
  }

  // Render Template 2: Blueprint Schematic
  if (templateId === 2) {
    return (
      <div className="resume-container resume-container-t2">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: blueprintStyles }} />
        <article className="resume">
          {/* HEADER */}
          <header className="resume-header">
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              {personalInfo.profilePicture ? (
                <img
                  src={personalInfo.profilePicture}
                  alt={`${displayFirst} ${displayLast}`}
                  className="resume-profile-pic"
                />
              ) : (
                <div className="header-avatar-initials" aria-hidden="true">
                  {displayFirst.charAt(0)}{displayLast.charAt(0)}
                </div>
              )}
              <div className="header-identity">
                <h1 className="resume-name">{displayFirst} {displayLast}</h1>
                <p className="resume-title">{displayTitle}</p>
                <p className="resume-tagline">{displayTagline}</p>
              </div>
            </div>
            <address className="header-contact" style={{ fontStyle: "normal" }}>
              {displayEmail && (
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">{displayEmail}</span>
                </div>
              )}
              {displayPhone && (
                <div className="contact-item">
                  <span className="contact-label">Phone</span>
                  <span className="contact-value">{displayPhone}</span>
                </div>
              )}
              {displayLocation && (
                <div className="contact-item">
                  <span className="contact-label">Location</span>
                  <span className="contact-value">{displayLocation}</span>
                </div>
              )}
              {displayLinkedin && (
                <div className="contact-item">
                  <span className="contact-label">LinkedIn</span>
                  <span className="contact-value">{displayLinkedin}</span>
                </div>
              )}
              {displayGithub && (
                <div className="contact-item">
                  <span className="contact-label">GitHub</span>
                  <span className="contact-value">{displayGithub}</span>
                </div>
              )}
              {displayPortfolio && (
                <div className="contact-item">
                  <span className="contact-label">Portfolio</span>
                  <span className="contact-value">{displayPortfolio}</span>
                </div>
              )}
            </address>
          </header>

          {/* BODY: SIDEBAR + CONTENT */}
          <div className="resume-body">
            {/* SIDEBAR */}
            <aside className="resume-sidebar">
              {/* Skills */}
              {displaySkills.length > 0 && (
                <div className="sidebar-block">
                  <h2 className="sidebar-heading">Skills</h2>
                  {Object.keys(groupedSkills).map((cat) => (
                    <div key={cat} className="sidebar-skill-group">
                      <p className="sidebar-skill-label">{cat}</p>
                      <div className="sidebar-skill-tags">
                        {groupedSkills[cat].map((sk) => (
                          <span key={sk.id} className="sidebar-tag">{sk.name}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {displayCertifications.length > 0 && (
                <div className="sidebar-block">
                  <h2 className="sidebar-heading">Certifications</h2>
                  {displayCertifications.map((cert: any) => (
                    <div key={cert.id} className="sidebar-cert">
                      <p className="sidebar-cert-name">{cert.name}</p>
                      {cert.organization && <p className="sidebar-cert-meta">{cert.organization}</p>}
                    </div>
                  ))}
                </div>
              )}
            </aside>

            {/* MAIN CONTENT */}
            <main className="resume-content">
              {/* PROFILE */}
              {displaySummary && (
                <section className="content-section">
                  <h2 className="section-heading">Profile</h2>
                  <p className="summary-text">{displaySummary}</p>
                </section>
              )}

              {/* EXPERIENCE */}
              {displayExperiences.length > 0 && (
                <section className="content-section">
                  <h2 className="section-heading">Experience</h2>
                  <div className="entry-list">
                    {displayExperiences.map((exp: any) => {
                      const dateStart = formatMonthYear(exp.startDate);
                      const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                      return (
                        <article key={exp.id} className="entry">
                          <div className="entry-track" aria-hidden="true"></div>
                          <div className="entry-content">
                            <h3 className="entry-role">{exp.role}</h3>
                            <div className="entry-meta">
                              <span className="entry-company">{exp.company}</span>
                              {exp.location && (
                                <>
                                  <span className="entry-sep" aria-hidden="true">·</span>
                                  <span className="entry-location">{exp.location}</span>
                                </>
                              )}
                              <span className="entry-date">
                                {dateStart} — {exp.isCurrent ? <span className="badge-current">Present</span> : dateEnd}
                              </span>
                            </div>
                            {exp.description && (
                              <ul className="entry-bullets">
                                {exp.description.split("\n").map((line: string, idx: number) => {
                                  const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                                  if (!clean) return null;
                                  return <li key={idx}>{clean}</li>;
                                })}
                              </ul>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* PROJECTS */}
              {displayProjects.length > 0 && (
                <section className="content-section">
                  <h2 className="section-heading">Notable Projects</h2>
                  <div className="entry-list">
                    {displayProjects.map((proj: any) => (
                      <article key={proj.id} className="entry">
                        <div className="entry-track" aria-hidden="true"></div>
                        <div className="entry-content">
                          <h3 className="entry-role">{proj.name}</h3>
                          <div className="entry-meta">
                            {proj.role && <span className="entry-company">{proj.role}</span>}
                          </div>
                          {proj.description && <p className="entry-description">{proj.description}</p>}
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="entry-tags">
                              {proj.technologies.map((tech: string, idx: number) => (
                                <span key={idx} className="entry-tag">{tech}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* EDUCATION */}
              {displayEducations.length > 0 && (
                <section className="content-section">
                  <h2 className="section-heading">Education</h2>
                  <div className="entry-list">
                    {displayEducations.map((edu: any) => {
                      const dateStart = formatMonthYear(edu.startDate);
                      const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                      return (
                        <article key={edu.id} className="entry">
                          <div className="entry-track" aria-hidden="true"></div>
                          <div className="entry-content">
                            <h3 className="entry-role">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</h3>
                            <div className="entry-meta">
                              <span className="entry-company">{edu.institution}</span>
                              <span className="entry-date">{dateStart} — {dateEnd}</span>
                            </div>
                            {edu.description && <p className="entry-description">{edu.description}</p>}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </main>
          </div>
        </article>
      </div>
    );
  }

  // Fallback / default: Template 1
  return (
    <div className="resume-container resume-container-t1">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: premiumStyles }} />
      <article className="resume">
        {/* HEADER */}
        <header className="resume-header">
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {personalInfo.profilePicture ? (
              <img
                src={personalInfo.profilePicture}
                alt={`${displayFirst} ${displayLast}`}
                className="resume-profile-pic"
              />
            ) : (
              <div className="header-avatar-initials" aria-hidden="true">
                {displayFirst.charAt(0)}{displayLast.charAt(0)}
              </div>
            )}
            <div className="header-identity">
              <h1 className="resume-name">{displayFirst} {displayLast}</h1>
              <p className="resume-title">{displayTitle}</p>
              <p className="resume-tagline">{displayTagline}</p>
            </div>
          </div>
          <address className="header-contact" style={{ fontStyle: "normal" }}>
            {displayEmail && (
              <span className="contact-item">
                <span className="contact-label">Email</span>
                {displayEmail}
              </span>
            )}
            {displayPhone && (
              <span className="contact-item">
                <span className="contact-label">Phone</span>
                {displayPhone}
              </span>
            )}
            {displayLocation && (
              <span className="contact-item">
                <span className="contact-label">Location</span>
                {displayLocation}
              </span>
            )}
            {displayLinkedin && (
              <span className="contact-item">
                <span className="contact-label">LinkedIn</span>
                {displayLinkedin}
              </span>
            )}
            {displayGithub && (
              <span className="contact-item">
                <span className="contact-label">GitHub</span>
                {displayGithub}
              </span>
            )}
            {displayPortfolio && (
              <span className="contact-item">
                <span className="contact-label">Portfolio</span>
                {displayPortfolio}
              </span>
            )}
          </address>
        </header>

        {/* SUMMARY */}
        {displaySummary && (
          <section className="resume-section">
            <h2 className="section-heading">Professional Summary</h2>
            <p className="summary-text">{displaySummary}</p>
          </section>
        )}

        {/* EXPERIENCE */}
        {displayExperiences.length > 0 && (
          <section className="resume-section">
            <h2 className="section-heading">Experience</h2>
            <div className="entry-list">
              {displayExperiences.map((exp: any) => {
                const dateStart = formatMonthYear(exp.startDate);
                const dateEnd = exp.isCurrent ? "Present" : formatMonthYear(exp.endDate);
                return (
                  <article key={exp.id} className="entry">
                    <div className="entry-date">
                      {exp.isCurrent ? (
                        <>
                          <span className="date-current">Present</span>
                          <br />
                          {dateStart}
                        </>
                      ) : (
                        <>
                          {dateEnd}
                          <br />
                          {dateStart}
                        </>
                      )}
                    </div>
                    <div className="entry-content">
                      <h3 className="entry-role">{exp.role}</h3>
                      <p className="entry-company">
                        {exp.company}
                        {exp.location && (
                          <>
                            <span className="entry-divider">·</span>
                            <span className="entry-location">{exp.location}</span>
                          </>
                        )}
                      </p>
                      {exp.description && (
                        <ul className="entry-bullets">
                          {exp.description.split("\n").map((line: string, idx: number) => {
                            const clean = line.trim().replace(/^•/, "").replace(/^-/, "").trim();
                            if (!clean) return null;
                            return <li key={idx}>{clean}</li>;
                          })}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {displayProjects.length > 0 && (
          <section className="resume-section">
            <h2 className="section-heading">Notable Projects</h2>
            <div className="entry-list">
              {displayProjects.map((proj: any) => (
                <article key={proj.id} className="entry">
                  <div className="entry-date">Project</div>
                  <div className="entry-content">
                    <h3 className="entry-role">{proj.name}</h3>
                    {proj.role && <p className="entry-company">{proj.role}</p>}
                    {proj.description && <p className="entry-description">{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="entry-tags">
                        {proj.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="entry-tag">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION */}
        {displayEducations.length > 0 && (
          <section className="resume-section">
            <h2 className="section-heading">Education</h2>
            <div className="entry-list">
              {displayEducations.map((edu: any) => {
                const dateStart = formatMonthYear(edu.startDate);
                const dateEnd = edu.isCurrent ? "Present" : formatMonthYear(edu.endDate);
                return (
                  <article key={edu.id} className="entry">
                    <div className="entry-date">
                      {dateEnd}
                      <br />
                      {dateStart}
                    </div>
                    <div className="entry-content">
                      <h3 className="entry-role">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}</h3>
                      <p className="entry-company">{edu.institution}</p>
                      {edu.description && <p className="entry-description">{edu.description}</p>}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {displaySkills.length > 0 && (
          <section className="resume-section">
            <h2 className="section-heading">Skills</h2>
            <div className="skills-grid">
              {Object.keys(groupedSkills).map((cat) => (
                <div key={cat} className="skill-category">
                  <span className="skill-category-label">{cat}</span>
                  <div className="skill-tags">
                    {groupedSkills[cat].map((sk) => (
                      <span key={sk.id} className="skill-tag">{sk.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {displayCertifications.length > 0 && (
          <section className="resume-section">
            <h2 className="section-heading">Certifications</h2>
            <div className="cert-list">
              {displayCertifications.map((cert: any) => (
                <div key={cert.id} className="cert-item">
                  <div>
                    <span className="cert-name">{cert.name}</span>
                    {cert.organization && <span className="cert-issuer">— {cert.organization}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export const LivePreviewPanel: React.FC = () => {
  const toast = useToast();
  const selectedTemplateId = useResumeStore((state) => state.selectedTemplateId);
  const selectedColor = useResumeStore((state) => state.selectedColor);
  const actions = useResumeStore((state) => state.actions);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [showZoomControls, setShowZoomControls] = useState(false);
  const [zoomScale, setZoomScale] = useState(0.60);
  const [tempTemplateId, setTempTemplateId] = useState(selectedTemplateId);
  const [tempColor, setTempColor] = useState(selectedColor);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fitToScreen = React.useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const headerH = 48;
    const containerPadX = 16 * 2;
    const containerPadY = 16 * 2;
    const zoomControlsW = 64;
    const docW = 794;
    const docH = 1123;
    const scaleX = (vw - containerPadX - zoomControlsW) / docW;
    const scaleY = (vh - headerH - containerPadY) / docH;
    const raw = Math.min(scaleX, scaleY, 1);
    const snapped = Math.round(raw * 20) / 20;
    setZoomScale(Math.max(0.05, Math.min(1, snapped)));
  }, []);

  const isInitialMount = React.useRef(true);

  React.useEffect(() => {
    const saved = sessionStorage.getItem("isZoomOpen");
    if (saved === "true") {
      setIsZoomOpen(true);
    }
  }, []);

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    sessionStorage.setItem("isZoomOpen", isZoomOpen ? "true" : "false");
  }, [isZoomOpen]);

  React.useEffect(() => {
    if (isModalOpen || isZoomOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen, isZoomOpen]);

  React.useEffect(() => {
    if (isZoomOpen) fitToScreen();
  }, [isZoomOpen, fitToScreen]);

  React.useEffect(() => {
    if (!isZoomOpen) return;
    const viewport = document.getElementById('zoom-viewport') as HTMLElement | null;
    if (!viewport) return;
    const checkScroll = () => {
      setShowScrollTop(viewport.scrollHeight > viewport.clientHeight + 10);
    };
    checkScroll();
    viewport.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(viewport);
    return () => {
      viewport.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      ro.disconnect();
    };
  }, [isZoomOpen, zoomScale]);

  return (
    <div className={styles.previewColumn}>
      {/* Content */}
      <div className={styles.previewContent}>
        <div
          className={styles.previewResumeWrapper}
          onClick={() => mounted && setIsZoomOpen(true)}
        >
          <div style={{ zoom: 0.44, width: "794px", userSelect: "none" }}>
            <div id="resume-print-capture" onDragStart={(e) => e.preventDefault()}>
              {mounted ? (
                <ResumeCardRender templateId={selectedTemplateId} color={selectedColor} />
              ) : (
                <ResumeCardRender templateId={1} color="#B87333" />
              )}
            </div>
          </div>

          {/* Zoom button — positioned at bottom-right of resume */}
          <button
            type="button"
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#18181b]/60 hover:bg-[#18181b]/80 backdrop-blur-md text-white border border-white/10 shadow-lg flex items-center justify-center cursor-pointer transition-all z-10"
            onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
            aria-label="Zoom Preview"
          >
            <ZoomIn size={20} strokeWidth={2.5} />
          </button>
        </div>

        <button
          type="button"
          className={styles.btnChangeTemplate}
          onClick={() => setIsModalOpen(true)}
        >
          <LayoutTemplate size={14} />
          Change Template & Accent
        </button>
      </div>

      {/* Select Modal */}
      {isModalOpen && (
        <div className={`${styles.modalBackdrop} backdrop-blur-lg`}>
          <div className={styles.modalCard}>

            {/* Main Body (Split Columns) */}
            <div className={styles.modalBody}>

              {/* Left Column: Live Resume Preview */}
              <div className={styles.modalLeftColumn}>
                {/* Scrollable wrapper next to template card */}
                <div
                  className={`h-full overflow-y-auto pr-2 custom-scrollbar ${styles.zoomViewportScrollbar}`}
                  style={{ width: `${794 * 0.65 + 20}px` }}
                >
                  <div
                    className="bg-white shadow-lg rounded-sm overflow-hidden flex-shrink-0"
                    style={{
                      width: "794px",
                      minHeight: "1123px",
                      color: "#000000",
                      zoom: 0.65,
                      margin: "auto",
                      userSelect: "none"
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <ResumeCardRender templateId={tempTemplateId} color={hoverColor || tempColor} />
                  </div>
                </div>
              </div>

              {/* Right Column: Settings Panel */}
              <div className={styles.modalRightColumn}>

                {/* Header */}
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>Change Template</h3>
                  <button
                    type="button"
                    className={styles.modalCloseBtn}
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Fixed Colors Section */}
                <div className={styles.colorsSectionFixed}>
                  <div className={styles.colorsRow}>
                    <span className={styles.colorsLabel}>Colors</span>
                    <div className={styles.colorSwatchesGrid}>
                      {COLOR_SWATCHES.map((swatch) => {
                        const isSelected = tempColor === swatch.value;
                        return (
                          <div
                            key={swatch.value}
                            role="button"
                            tabIndex={0}
                            onClick={() => setTempColor(swatch.value)}
                            onMouseEnter={() => setHoverColor(swatch.value)}
                            onMouseLeave={() => setHoverColor(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setTempColor(swatch.value);
                              }
                            }}
                            className={`${styles.colorSwatchItem} ${isSelected ? styles.colorSwatchItemActive : ""
                              }`}
                            style={{ backgroundColor: swatch.value }}
                            title={swatch.label}
                          >
                            {isSelected && (
                              <Check size={10} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className={styles.modalContent}>

                  {/* Templates List */}
                  <div className={styles.modalSection}>
                    <div className={styles.templatesGrid}>
                      {TEMPLATES_LIST.map((temp) => {
                        const isSelected = tempTemplateId === temp.id;
                        return (
                          <div
                            key={temp.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setTempTemplateId(temp.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                setTempTemplateId(temp.id);
                              }
                            }}
                            className={`${styles.templateCard} ${isSelected ? styles.templateCardActive : ""
                              }`}
                          >
                            {/* Visual Template Thumbnail */}
                            <div className={styles.templateCardPreview}>
                              <div style={{ transform: "scale(0.24)", transformOrigin: "top center", width: "794px", height: "1123px" }}>
                                <ResumeCardRender templateId={temp.id} color={tempColor} />
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-black border border-black flex items-center justify-center shadow-md z-10">
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.modalCancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalSaveBtn}
                onClick={() => {
                  actions.setSelectedTemplateId(tempTemplateId);
                  actions.setSelectedColor(tempColor);
                  setIsModalOpen(false);
                  toast.success("Success ✓", "Template and theme color updated!");
                }}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Full-screen high-res preview modal — portalled to body for true full-page coverage */}
      {mounted && createPortal(
        <AnimatePresence>
          {isZoomOpen && (
            <div className="fixed inset-0 bg-white/20 backdrop-blur-lg z-[99999] flex flex-col animate-fadeIn select-none">
              {/* Top black header bar */}
              <div className="w-full h-12 bg-[#18181c]/90 backdrop-blur-md border-b border-[#27272a] px-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                {/* Left Side: Preview Mode label moved inwards to the right via inline style */}
                <div className="text-sm font-sans font-semibold text-white" style={{ paddingLeft: "24px" }}>
                  Preview Mode
                </div>

                {/* Right Side: Change template & Close button moved inwards to the left via inline style */}
                <div className="flex items-center gap-2" style={{ paddingRight: "24px" }}>
                  <button
                    type="button"
                    className={`${styles.btnChangeTemplate} !mt-0 !rounded !px-2`}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    <LayoutTemplate size={14} />
                    Change template
                  </button>
                  <div className="w-px h-6 bg-[#27272a]" />
                  <button
                    type="button"
                    className="w-8 h-8 rounded border border-white/15 bg-[#27272a] text-white hover:bg-[#3f3f46] hover:border-white/30 flex items-center justify-center cursor-pointer transition-all duration-200"
                    onClick={() => setIsZoomOpen(false)}
                    aria-label="Close Preview"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Document Viewport Wrapper with Glass Background */}
              <div
                className="flex-1 p-4 flex justify-center items-start bg-black/40 backdrop-blur-xl relative overflow-hidden cursor-pointer"
                onClick={() => setIsZoomOpen(false)}
              >
                {/* Centered scrollable container matching template width */}
                <div
                  id="zoom-viewport"
                  className={`h-full overflow-y-auto pr-2 custom-scrollbar ${styles.zoomViewportScrollbar} cursor-default`}
                  style={{ width: `${794 * zoomScale + 20}px` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Document Container scaled dynamically */}
                  <div
                    className="bg-white shadow-2xl rounded-sm overflow-hidden"
                    style={{
                      width: "794px",
                      minHeight: "1123px",
                      color: "#000000",
                      zoom: zoomScale,
                      margin: "0 auto",
                      userSelect: "none"
                    }}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <ResumeCardRender templateId={selectedTemplateId} color={selectedColor} />
                  </div>
                </div>
              </div>

              {/* Zoom Controls — positioned on right side */}
              <div
                className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-[99999] select-none cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Fit / Reset button with tooltip */}
                <div className="relative group">
                  <button
                    type="button"
                    onClick={fitToScreen}
                    className="w-10 h-10 bg-white border border-gray-200 shadow-xl rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 hover:border-gray-300 active:scale-90 flex items-center justify-center cursor-pointer transition-all"
                  >
                    <Maximize size={16} />
                  </button>
                  <span style={{ position: 'absolute', right: '100%', marginRight: '12px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', background: '#1c1c1e', color: '#fff', fontSize: '11px', fontWeight: 500, borderRadius: '6px', whiteSpace: 'nowrap', opacity: 0, pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', transition: 'opacity 0.15s ease', zIndex: 100000 }} className="group-hover:!opacity-100">
                    Fit to width
                  </span>
                </div>

                {/* Vertical Range Bar */}
                <div className="w-10 bg-white border border-gray-200 shadow-xl rounded-lg flex flex-col items-center pt-3 pb-3 gap-2">
                  {/* Plus */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setZoomScale((prev) => Math.min(1, +(prev + 0.05).toFixed(2)))}
                      className="w-8 h-8 text-gray-500 hover:text-black hover:bg-gray-100 active:bg-gray-200 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150"
                    >
                      <Plus size={16} />
                    </button>
                    <span style={{ position: 'absolute', right: '100%', marginRight: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', background: '#1c1c1e', color: '#fff', fontSize: '11px', fontWeight: 500, borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 100000 }} className="group-hover:!opacity-100 opacity-0 transition-opacity duration-150">
                      Zoom in
                    </span>
                  </div>

                  {/* Slider Input */}
                  <div className="h-40 flex items-center justify-center">
                    <input
                      type="range"
                      min="0.05"
                      max="1"
                      step="0.05"
                      value={zoomScale}
                      onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                      style={{
                        writingMode: "vertical-lr",
                        direction: "rtl",
                        WebkitAppearance: "slider-vertical",
                        width: "4px",
                        height: "100%",
                        cursor: "pointer",
                        accentColor: "#000000",
                        background: "#e2e8f0"
                      }}
                    />
                  </div>

                  {/* Zoom Percentage */}
                  <span className="text-[11px] font-semibold text-gray-700 tabular-nums select-none leading-none">
                    {Math.round(zoomScale * 100)}%
                  </span>

                  {/* Minus */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setZoomScale((prev) => Math.max(0.05, +(prev - 0.05).toFixed(2)))}
                      className="w-8 h-8 text-gray-500 hover:text-black hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150"
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ position: 'absolute', right: '100%', marginRight: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', background: '#1c1c1e', color: '#fff', fontSize: '11px', fontWeight: 500, borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 100000 }} className="group-hover:!opacity-100 opacity-0 transition-opacity duration-150">
                      Zoom out
                    </span>
                  </div>
                </div>

                {/* Scroll to Top - positioned absolutely below bar, never shifts layout */}
                <div
                  className={`transition-opacity duration-200 ${showScrollTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => {
                        const viewport = document.getElementById('zoom-viewport');
                        viewport?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-10 h-10 bg-white border border-gray-200 shadow-xl rounded-lg text-gray-700 hover:text-black hover:bg-gray-50 hover:border-gray-300 active:scale-90 flex items-center justify-center cursor-pointer transition-all"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                    <span style={{ position: 'absolute', right: '100%', marginRight: '8px', top: '50%', transform: 'translateY(-50%)', padding: '4px 8px', background: '#1c1c1e', color: '#fff', fontSize: '11px', fontWeight: 500, borderRadius: '6px', whiteSpace: 'nowrap', pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 100000 }} className="group-hover:!opacity-100 opacity-0 transition-opacity duration-150">
                      Scroll to top
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default LivePreviewPanel;
