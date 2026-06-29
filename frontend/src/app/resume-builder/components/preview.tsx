"use client";

import React, { useState } from "react";
import { useResumeStore } from "../store";
import styles from "../builder.module.css";
import { LayoutTemplate, X, Check } from "lucide-react";
import { useToast } from "../../components/Toast";

// Premium color swatches
const COLOR_SWATCHES = [
  { value: "#B87333", label: "Copper (Signature)" },
  { value: "#C9A84C", label: "Gold (Blueprint)" },
  { value: "#1f2937", label: "Dark Gray" },
  { value: "#6366f1", label: "Slate Blue" },
  { value: "#3b82f6", label: "Royal Blue" },
  { value: "#0ea5e9", label: "Sky Blue" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#10b981", label: "Green" },
  { value: "#ef4444", label: "Red" },
];

const TEMPLATES_LIST = [
  { id: 1, name: "Premium HireMate", desc: "Signature copper hairline, clean single-column ATS-ready layout." },
  { id: 2, name: "Blueprint Schematic", desc: "Architectural 2-column sidebar layout with timeline track nodes." }
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

  // Fallback placeholder data matching the premium Alexandra Chen profile
  const displayFirst = personalInfo.firstName || "Alexandra";
  const displayLast = personalInfo.surname || "Chen";
  const displayEmail = personalInfo.email || "alexandra.chen@email.com";
  const displayPhone = personalInfo.phone || "+1 (415) 892-3041";
  const displayLocation = (personalInfo.city || personalInfo.country)
    ? `${personalInfo.city || ""}${personalInfo.city && personalInfo.country ? ", " : ""}${personalInfo.country || ""}`
    : "San Francisco, CA";
  const displayLinkedin = personalInfo.linkedinUrl || "linkedin.com/in/alexchen";
  const displayGithub = personalInfo.githubUrl || "github.com/alexchen-dev";
  const displayPortfolio = personalInfo.portfolioUrl || "alexchen.io";
  
  const displayTitle = experiences[0]?.role || "Principal Software Engineer & Technical Lead";
  const displayTagline = "Building systems at scale — from 0 to 200 million users";

  const displaySummary = summary || "Principal Engineer with 11 years of experience designing distributed systems and leading cross-functional teams at Google, Stripe, and Series-B startups. Specialize in high-throughput backend architecture, platform reliability, and translating ambiguous product vision into precise technical roadmaps.";

  const displayExperiences = experiences.length > 0 ? experiences : [
    {
      id: "mock-exp-1",
      role: "Principal Software Engineer — Technical Lead",
      company: "Stripe, Inc.",
      location: "San Francisco, CA",
      startDate: { month: 1, year: 2021 },
      endDate: { month: null, year: null },
      isCurrent: true,
      description: "Architected Stripe's next-generation payment routing engine, reducing transaction latency by 42% and saving $18M annually.\nLed a 14-engineer team through a 9-month migration from monolith to event-driven microservices.\nDesigned the fraud detection ML pipeline processing 4.2M events/sec."
    },
    {
      id: "mock-exp-2",
      role: "Senior Software Engineer, Infrastructure",
      company: "Google LLC",
      location: "Mountain View, CA",
      startDate: { month: 3, year: 2017 },
      endDate: { month: 12, year: 2020 },
      isCurrent: false,
      description: "Built the core scheduling layer of Google Kubernetes Engine (GKE) auto-scaler.\nReduced cold-start provisioning time by 68% through a novel predictive node-pooling algorithm."
    }
  ];

  const displayEducations = educations.length > 0 ? educations : [
    {
      id: "mock-edu-1",
      degree: "M.S. Computer Science",
      fieldOfStudy: "Distributed Systems",
      institution: "Stanford University",
      startDate: { month: 9, year: 2010 },
      endDate: { month: 6, year: 2014 },
      grade: "3.92 GPA",
      isCurrent: false,
      description: "Thesis: Adaptive Consistency Models for Geo-Replicated Key-Value Stores."
    }
  ];

  const displaySkills = (skills.length > 0 ? skills : [
    { id: "mock-sk-1", name: "Go", category: "Languages" },
    { id: "mock-sk-2", name: "Python", category: "Languages" },
    { id: "mock-sk-3", name: "Rust", category: "Languages" },
    { id: "mock-sk-4", name: "Kubernetes", category: "Infrastructure" },
    { id: "mock-sk-5", name: "Docker", category: "Infrastructure" },
    { id: "mock-sk-6", name: "Kafka", category: "Data & ML" },
    { id: "mock-sk-7", name: "System Design", category: "Practices" }
  ]) as any[];

  const displayProjects = projects.length > 0 ? projects : [
    {
      id: "mock-proj-1",
      name: "OpenFlux — Open-Source Workflow Orchestrator",
      role: "Personal / Open Source",
      description: "A lightweight, dependency-free task orchestration engine for Python with first-class async support. Garnered 6.2k GitHub stars and 340+ forks.",
      technologies: ["Python", "asyncio", "Redis", "Docker"]
    }
  ];

  const displayCertifications = certifications.length > 0 ? certifications : [
    {
      id: "mock-cert-1",
      name: "AWS Solutions Architect — Professional",
      organization: "Amazon Web Services"
    },
    {
      id: "mock-cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      organization: "Cloud Native Computing Foundation"
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

    .resume-container {
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

    .resume-container .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--color-surface);
      padding: 34px 40px;
      margin: 0 auto;
      text-align: left;
    }

    .resume-container .resume-header {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: end;
      gap: 16px;
      padding-bottom: 12px;
      border-bottom: 2.5px solid var(--color-accent);
      margin-bottom: 24px;
    }

    .resume-container .header-identity {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container .resume-name {
      font-family: var(--font-display);
      font-size: var(--size-name);
      font-weight: 700;
      color: var(--color-ink-heavy);
      letter-spacing: -0.02em;
      line-height: 1.1;
    }

    .resume-container .resume-title {
      font-size: var(--size-title);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .resume-container .resume-tagline {
      font-size: var(--size-small);
      font-style: italic;
      color: var(--color-ink-muted);
      margin-top: 1px;
    }

    .resume-container .header-contact {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3.5px;
    }

    .resume-container .contact-item {
      font-size: var(--size-small);
      color: var(--color-ink-light);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .resume-container .contact-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--color-ink-heavy);
      opacity: 0.45;
    }

    .resume-container .resume-section {
      margin-bottom: 24px;
    }

    .resume-container .section-heading {
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

    .resume-container .section-heading::before {
      content: '';
      display: block;
      width: 3.5px;
      height: 0.8em;
      background: var(--color-accent);
      border-radius: 1.5px;
      flex-shrink: 0;
    }

    .resume-container .section-heading::after {
      content: '';
      display: block;
      flex: 1;
      height: 1px;
      background: var(--color-rule);
    }

    .resume-container .summary-text {
      font-size: var(--size-body);
      line-height: 1.6;
      color: var(--color-ink-light);
    }

    .resume-container .entry-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .resume-container .entry {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 0 14px;
    }

    .resume-container .entry-date {
      font-size: var(--size-small);
      color: var(--color-accent);
      font-weight: 600;
      padding-top: 2px;
      line-height: 1.4;
      text-align: right;
    }

    .resume-container .entry-date .date-current {
      font-weight: 700;
      color: var(--color-accent);
      text-transform: uppercase;
      font-size: 9px;
    }

    .resume-container .entry-content {
      border-left: 1.5px solid var(--color-rule);
      padding-left: 12px;
    }

    .resume-container .entry-role {
      font-size: var(--size-role);
      font-weight: 600;
      color: var(--color-ink-mid);
      line-height: 1.2;
    }

    .resume-container .entry-company {
      font-size: var(--size-small);
      font-weight: 500;
      color: var(--color-ink-muted);
      margin-top: 2px;
    }

    .resume-container .entry-divider {
      display: inline-block;
      margin: 0 4px;
      color: var(--color-rule);
    }

    .resume-container .entry-location {
      font-size: 11px;
      color: var(--color-ink-muted);
    }

    .resume-container .entry-description {
      margin-top: 4px;
      font-size: var(--size-body);
      line-height: 1.5;
      color: var(--color-ink-light);
    }

    .resume-container .entry-bullets {
      margin-top: 6px;
      padding-left: 12px;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .resume-container .entry-bullets li {
      font-size: var(--size-body);
      line-height: 1.5;
      color: var(--color-ink-light);
      position: relative;
    }

    .resume-container .entry-bullets li::before {
      content: '▸';
      position: absolute;
      left: -12px;
      color: var(--color-accent);
      font-size: 10px;
      top: 0.1em;
    }

    .resume-container .entry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 6px;
    }

    .resume-container .entry-tag {
      font-size: 9px;
      font-weight: 500;
      color: var(--color-ink-mid);
      background: var(--color-tag-bg);
      border: 0.5px solid var(--color-rule);
      border-radius: 2px;
      padding: 2px 6px;
    }

    .resume-container .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .resume-container .skill-category {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 0 14px;
      align-items: start;
    }

    .resume-container .skill-category-label {
      font-size: var(--size-small);
      font-weight: 600;
      color: var(--color-accent);
      letter-spacing: 0.02em;
      padding-top: 2px;
      text-align: right;
    }

    .resume-container .skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      border-left: 1.5px solid var(--color-rule);
      padding-left: 12px;
    }

    .resume-container .skill-tag {
      font-size: 10.5px;
      font-weight: 500;
      color: var(--color-ink-mid);
      background: var(--color-tag-bg);
      border: 0.5px solid var(--color-rule);
      border-radius: 2px;
      padding: 2px 7px;
      white-space: nowrap;
    }

    .resume-container .cert-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .resume-container .cert-item {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: var(--size-body);
    }

    .resume-container .cert-name {
      font-weight: 500;
      color: var(--color-ink-mid);
    }

    .resume-container .cert-issuer {
      font-size: var(--size-small);
      color: var(--color-ink-muted);
      margin-left: 4px;
    }

    .resume-container .cert-date {
      font-size: var(--size-small);
      color: var(--color-ink-muted);
      white-space: nowrap;
    }
  `;

  // Template 2 Style System (Blueprint Schematic Navy + Gold Sidebar Layout)
  const blueprintStyles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');

    .resume-container {
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

    .resume-container .resume {
      width: 794px;
      min-height: 1123px;
      background: var(--surface);
      margin: 0 auto;
      text-align: left;
    }

    .resume-container .resume-header {
      background: var(--navy);
      padding: 34px 34px 28px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 16px;
      align-items: end;
      border-bottom: 3.5px solid var(--gold);
    }

    .resume-container .header-identity {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container .resume-name {
      font-family: var(--font-display);
      font-size: var(--size-name);
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.01em;
      line-height: 1.05;
    }

    .resume-container .resume-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold);
      margin-top: 2px;
    }

    .resume-container .resume-tagline {
      font-size: 13px;
      font-style: italic;
      color: var(--sidebar-ink-2);
      margin-top: 4px;
    }

    .resume-container .header-contact {
      display: grid;
      grid-template-columns: auto;
      gap: 3.5px;
      align-content: end;
    }

    .resume-container .contact-item {
      display: flex;
      align-items: baseline;
      gap: 6px;
      white-space: nowrap;
    }

    .resume-container .contact-label {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gold);
      min-width: 50px;
    }

    .resume-container .contact-value {
      font-size: var(--size-small);
      color: var(--sidebar-ink-1);
    }

    .resume-container .resume-body {
      display: grid;
      grid-template-columns: var(--sidebar-w) 1fr;
      min-height: calc(1123px - 140px);
    }

    .resume-container .resume-sidebar {
      background: var(--navy-soft);
      padding: 28px 16px;
    }

    .resume-container .sidebar-block {
      padding-bottom: 22px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 18px;
    }

    .resume-container .sidebar-block:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .resume-container .sidebar-heading {
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

    .resume-container .sidebar-heading::before {
      content: '';
      display: block;
      width: 20px;
      height: 1.5px;
      background: var(--gold);
      flex-shrink: 0;
    }

    .resume-container .sidebar-skill-group {
      margin-bottom: 12px;
    }

    .resume-container .sidebar-skill-group:last-child {
      margin-bottom: 0;
    }

    .resume-container .sidebar-skill-label {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--sidebar-ink-3);
      margin-bottom: 4px;
    }

    .resume-container .sidebar-skill-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
    }

    .resume-container .sidebar-tag {
      font-size: var(--size-micro);
      color: var(--sidebar-ink-2);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 2px;
      padding: 1.5px 5px;
      line-height: 1.4;
      white-space: nowrap;
    }

    .resume-container .sidebar-cert {
      margin-bottom: 10px;
    }

    .resume-container .sidebar-cert:last-child { margin-bottom: 0; }

    .resume-container .sidebar-cert-name {
      font-size: var(--size-small);
      font-weight: 500;
      color: var(--sidebar-ink-1);
      line-height: 1.3;
    }

    .resume-container .sidebar-cert-meta {
      font-size: var(--size-micro);
      color: var(--sidebar-ink-3);
      margin-top: 1.5px;
    }

    .resume-container .resume-content {
      padding: 28px 28px;
    }

    .resume-container .content-section {
      margin-bottom: 28px;
    }

    .resume-container .content-section:last-child {
      margin-bottom: 0;
    }

    .resume-container .section-heading {
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

    .resume-container .section-heading::before {
      content: '';
      display: block;
      width: 7px;
      height: 7px;
      background: var(--gold);
      flex-shrink: 0;
      transform: rotate(45deg);
    }

    .resume-container .section-heading::after {
      content: '';
      flex: 1;
      height: 1.2px;
      background: var(--rule);
    }

    .resume-container .summary-text {
      font-size: var(--size-body);
      line-height: 1.65;
      color: var(--ink-3);
    }

    .resume-container .entry-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .resume-container .entry {
      display: grid;
      grid-template-columns: 8px 1fr;
      gap: 0 14px;
      position: relative;
    }

    .resume-container .entry-track {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    .resume-container .entry-track::before {
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

    .resume-container .entry-track::after {
      content: '';
      display: block;
      flex: 1;
      width: 1.5px;
      background: linear-gradient(to bottom, var(--rule) 0%, transparent 100%);
      margin-top: 4px;
    }

    .resume-container .entry:last-child .entry-track::after {
      display: none;
    }

    .resume-container .entry-role {
      font-size: var(--size-role);
      font-weight: 600;
      color: var(--ink-2);
      line-height: 1.25;
    }

    .resume-container .entry-meta {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0 7px;
      margin-top: 2px;
      font-size: var(--size-small);
      color: var(--ink-4);
    }

    .resume-container .entry-company { font-weight: 500; color: var(--ink-3); }
    .resume-container .entry-date { margin-left: auto; font-family: var(--font-mono); font-size: 10px; color: var(--ink-4); white-space: nowrap; }

    .resume-container .entry-sep {
      color: var(--rule);
    }

    .resume-container .badge-current {
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

    .resume-container .entry-bullets {
      list-style: none;
      margin-top: 8px;
      padding-left: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .resume-container .entry-bullets li {
      font-size: var(--size-body);
      line-height: 1.55;
      color: var(--ink-3);
      padding-left: 16px;
      position: relative;
    }

    .resume-container .entry-bullets li::before {
      content: '—';
      position: absolute;
      left: 0;
      color: var(--gold);
      font-size: 11px;
      top: 0.15em;
      line-height: 1;
    }

    .resume-container .entry-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3.5px;
      margin-top: 8px;
    }

    .resume-container .entry-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--ink-3);
      background: var(--rule-soft);
      border: 0.5px solid var(--rule);
      border-radius: 2px;
      padding: 1.5px 5.5px;
    }

    .resume-container .entry-description {
      font-size: var(--size-body);
      line-height: 1.6;
      color: var(--ink-3);
      margin-top: 5px;
    }
  `;

  if (templateId === 2) {
    return (
      <div className="resume-container">
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
            <div className="header-identity">
              <h1 className="resume-name">{displayFirst} {displayLast}</h1>
              <p className="resume-title">{displayTitle}</p>
              <p className="resume-tagline">{displayTagline}</p>
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
    <div className="resume-container">
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
          <div className="header-identity">
            <h1 className="resume-name">{displayFirst} {displayLast}</h1>
            <p className="resume-title">{displayTitle}</p>
            <p className="resume-tagline">{displayTagline}</p>
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
  const [tempTemplateId, setTempTemplateId] = useState(selectedTemplateId);
  const [tempColor, setTempColor] = useState(selectedColor);

  return (
    <div className={styles.previewColumn}>
      {/* Content */}
      <div className={styles.previewContent}>
        <div style={{ width: "350px", height: "495px", overflow: "hidden", position: "relative", borderRadius: "8px", boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
          <div style={{ transform: "scale(0.44)", transformOrigin: "top left", width: "794px", height: "1123px" }}>
            <div id="resume-print-capture">
              <ResumeCardRender templateId={selectedTemplateId} color={selectedColor} />
            </div>
          </div>
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
        <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#121214] border border-[#27272a] rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl text-white">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
              <h3 className="font-display font-bold text-lg text-white">Change Layout & Accent</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* Choose Template */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Template Layout</span>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES_LIST.map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => setTempTemplateId(temp.id)}
                      className={`flex flex-col gap-1.5 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${tempTemplateId === temp.id
                        ? "border-cyan-500 bg-cyan-950/20"
                        : "border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{temp.name}</span>
                        {tempTemplateId === temp.id && <Check size={14} className="text-cyan-400" />}
                      </div>
                      <span className="text-[10px] text-gray-400 leading-normal">{temp.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Color */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Theme Color</span>
                <div className="grid grid-cols-3 gap-3">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      onClick={() => setTempColor(swatch.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-[11px] transition-all duration-200 cursor-pointer ${tempColor === swatch.value
                        ? "border-cyan-500 bg-cyan-950/20"
                        : "border-[#27272a] bg-[#18181b] hover:border-[#3f3f46]"
                        }`}
                    >
                      <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: swatch.value }} />
                      <span className="truncate">{swatch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#27272a] bg-[#161618] flex items-center justify-between">
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-5 py-2.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white rounded-lg transition-all"
                onClick={() => {
                  actions.setSelectedTemplateId(tempTemplateId);
                  actions.setSelectedColor(tempColor);
                  setIsModalOpen(false);
                  toast.success("Success ✓", "Template and theme color updated!");
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreviewPanel;
