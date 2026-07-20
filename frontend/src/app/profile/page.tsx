"use client";

import React, { useState, useEffect, useLayoutEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./profile.module.css";
import { useToast } from "../components/Toast";
import SiteFooter from "../components/SiteFooter";
import HomeBackdrop from "../components/HomeBackdrop";
import Navbar from "../components/Navbar";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ExperienceItem { company: string; role: string; duration: string; description: string; }
interface EducationItem { institution: string; degree: string; field: string; year: string; }
interface GoalItem { targetRole: string; targetCompany: string; careerGoal: string; }

// ─── SVG Icons ────────────────────────────────────────────────
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="12.01" />
  </svg>
);
const IconGradCap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
);
const IconEdit2 = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);
const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconLogOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

interface ProfileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const ProfileInput: React.FC<ProfileInputProps> = ({ error, className = "", ...props }) => {
  const [isTouched, setIsTouched] = React.useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
    if (props.onBlur) props.onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    if (props.onChange) props.onChange(e);
  };

  const showError = isTouched && !!error;

  return (
    <div className="relative flex items-center w-full">
      <input
        className={`${styles.input} ${showError ? styles.inputError : ""} ${className}`}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {showError && (
        <div className="absolute right-3 text-red-500 flex items-center pointer-events-none">
          <IconX />
        </div>
      )}
    </div>
  );
};

interface ProfileTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
}

const ProfileTextarea: React.FC<ProfileTextareaProps> = ({ error, className = "", ...props }) => {
  const [isTouched, setIsTouched] = React.useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsTouched(true);
    if (props.onBlur) props.onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsTouched(true);
    if (props.onChange) props.onChange(e);
  };

  const showError = isTouched && !!error;

  return (
    <div className="relative flex items-start w-full">
      <textarea
        className={`${styles.textarea} ${showError ? styles.inputError : ""} ${className}`}
        {...props}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {showError && (
        <div className="absolute right-3 top-3 text-red-500 flex items-center pointer-events-none">
          <IconX />
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
    setAvatarLoaded(true);
    if (mounted) {
      if (avatar && avatar.trim() !== "") {
        document.documentElement.style.setProperty('--user-avatar-url', `url("${avatar}")`);
        document.documentElement.classList.add('has-avatar');
      } else {
        document.documentElement.style.setProperty('--user-avatar-url', 'none');
        document.documentElement.classList.remove('has-avatar');
      }
    }
  }, [avatar, mounted]);

  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [goalList, setGoalList] = useState<GoalItem[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [careerGoal, setCareerGoal] = useState("");

  const [snapshot, setSnapshot] = useState<{ skills: string[]; experience: ExperienceItem[]; education: EducationItem[]; goals: GoalItem[]; careerGoal: string; targetRole: string; targetCompany: string }>({ skills: [], experience: [], education: [], goals: [], careerGoal: "", targetRole: "", targetCompany: "" });

  // Section edit states
  const [editing, setEditing] = useState({ personal: false, skills: false, experience: false, education: false, goals: false });

  // ── Compute validation errors dynamically ──
  const personalErrors = {
    fullName: fullName.trim() && !/^[a-zA-Z]+([ \'-][a-zA-Z]+)*$/.test(fullName.trim()) ? "Invalid name" : (!fullName.trim() && editing.personal ? "Required" : ""),
    phone: phone.trim() && !/^[\d\s()+\-]{7,20}$/.test(phone.trim()) ? "Invalid phone" : (!phone.trim() && editing.personal ? "Required" : ""),
  };

  const skillInputError = newSkill.trim() && !/^[a-zA-Z0-9\s.#+()\-]{1,30}$/.test(newSkill.trim()) ? "Invalid skill" : "";

  const expErrors = experienceList.map(exp => ({
    company: !exp.company.trim() ? "Required" : (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/.test(exp.company.trim()) ? "Invalid" : ""),
    role: !exp.role.trim() ? "Required" : (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/.test(exp.role.trim()) ? "Invalid" : ""),
    duration: exp.duration.trim() && !/^(?=.*(\d|present|current))[a-zA-Z0-9\s.,\-\–/()]{2,30}$/i.test(exp.duration.trim()) ? "Invalid" : "",
    description: exp.description.trim() && exp.description.trim().length > 500 ? "Too long" : "",
  }));

  const eduErrors = educationList.map(edu => ({
    institution: !edu.institution.trim() ? "Required" : (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(edu.institution.trim()) ? "Invalid" : ""),
    degree: !edu.degree.trim() ? "Required" : (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(edu.degree.trim()) ? "Invalid" : ""),
    field: edu.field.trim() && !/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,()\-]{2,100}$/.test(edu.field.trim()) ? "Invalid" : "",
    year: edu.year.trim() && !/^(?=.*(\d|present|expected))[a-zA-Z0-9\s\-\–]{4,15}$/i.test(edu.year.trim()) ? "Invalid" : "",
  }));

  const goalErrors = {
    targetRole: !targetRole.trim() ? "Required" : (!/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&/\-]{2,50}$/.test(targetRole.trim()) ? "Invalid" : ""),
    targetCompany: targetCompany.trim() && !/^(?=.*[a-zA-Z])[a-zA-Z0-9\s&.,\-]{2,50}$/.test(targetCompany.trim()) ? "Invalid" : "",
  };

  // Section error flags for disabling Save buttons
  const personalHasError = !!(personalErrors.fullName || personalErrors.phone);
  const skillsHasError = false; // Add Skill button is disabled locally if input is invalid
  const experienceHasError = expErrors.some(e => e.company || e.role || e.duration || e.description);
  const educationHasError = eduErrors.some(e => e.institution || e.degree || e.field || e.year);
  const goalsHasError = !!(goalErrors.targetRole || goalErrors.targetCompany);

  // ── Load from cache BEFORE browser paints (no flicker) ──
  useLayoutEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setEmail(u.email || ""); setAvatar(u.avatar || ""); setFullName(u.fullName || "");
        setPhone(u.phone || ""); setBio(u.bio || ""); setSkills(u.skills || []);
        setExperienceList(u.experience || []); setEducationList(u.education || []);
        setCareerGoal(u.careerGoal || ""); setTargetRole(u.targetRole || ""); setTargetCompany(u.targetCompany || "");
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) { router.push("/auth?mode=signin"); return; }
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setEmail(u.email || ""); setAvatar(u.avatar || ""); setFullName(u.fullName || "");
        setPhone(u.phone || ""); setBio(u.bio || ""); setSkills(u.skills || []);
        setExperienceList(u.experience || []); setEducationList(u.education || []);
        setCareerGoal(u.careerGoal || ""); setTargetRole(u.targetRole || ""); setTargetCompany(u.targetCompany || "");
      } catch (e) { }
    }
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user) {
          const u = data.user;
          const savedUser = localStorage.getItem("user");
          const cachedFullName = savedUser ? JSON.parse(savedUser).fullName : "";
          const cachedAvatar = savedUser ? JSON.parse(savedUser).avatar : "";
          
          const finalAvatar = (u.avatar !== undefined) ? (u.avatar || "") : (cachedAvatar || "");
          const finalFullName = u.fullName || cachedFullName;
          
          const finalUser = {
            ...u,
            fullName: finalFullName,
            avatar: finalAvatar
          };
          
          setEmail(finalUser.email || ""); setAvatar(finalUser.avatar || ""); setFullName(finalUser.fullName || "");
          setPhone(finalUser.phone || ""); setBio(finalUser.bio || ""); setSkills(finalUser.skills || []);
          setExperienceList(finalUser.experience || []); setEducationList(finalUser.education || []);
          setCareerGoal(finalUser.careerGoal || ""); setTargetRole(finalUser.targetRole || ""); setTargetCompany(finalUser.targetCompany || "");
          localStorage.setItem("user", JSON.stringify(finalUser));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/auth?mode=signin");
        }
      })
      .catch(() => toast.error("Failed to load profile."));
  }, []);

  useEffect(() => {
    if (fullName) {
      const parts = fullName.split(" ");
      let initialsStr = "";
      for (let i = 0; i < parts.length && i < 2; i++) {
        if (parts[i]) initialsStr += parts[i][0];
      }
      initialsStr = initialsStr.toUpperCase();
      document.documentElement.style.setProperty('--user-initials', `"${initialsStr}"`);
    }
  }, [fullName]);

  const save = async (section: keyof typeof editing, payload: Record<string, unknown>) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setIsSaving(section);
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Changes saved successfully.");
        setEditing(p => ({ ...p, [section]: false }));
        localStorage.setItem("user", JSON.stringify(data.user));
      } else toast.error(data.message || "Failed to save.");
    } catch { toast.error("Network error."); }
    finally { setIsSaving(null); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB."); return; }
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result as string;
      const token = localStorage.getItem("token");
      if (!token) {
        setIsUploadingAvatar(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          credentials: "include",
          body: JSON.stringify({ avatar: base64 }),
        });
        const data = await res.json();
        if (data.success) {
          setAvatar(base64);
          toast.success("Profile photo updated.");
          localStorage.setItem("user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
        else toast.error(data.message || "Upload failed.");
      } catch { toast.error("Upload error."); }
      finally {
        setIsUploadingAvatar(false);
        e.target.value = "";
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read file.");
      setIsUploadingAvatar(false);
      e.target.value = "";
    };
  };

  const handleAvatarDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify({ avatar: "" }),
      });
      const data = await res.json();
      if (data.success) {
        setAvatar("");
        toast.success("Profile photo removed.");
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userProfileUpdated"));
      } else {
        toast.error(data.message || "Failed to remove photo.");
      }
    } catch {
      toast.error("Network error.");
    }
  };

  const addSkill = (e: FormEvent) => {
    e.preventDefault();
    const s = newSkill.trim();
    if (!s || skillInputError) return;
    if (!skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(""); }
  };

  const signOut = async () => {
    try { await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch { }
    localStorage.removeItem("token");
    router.push("/");
  };



  const initials = mounted && fullName ? fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "";


  return (
    <div className={styles.page}>
      <HomeBackdrop />
      {/* ── Navbar (same as home) ── */}
      <Navbar />

      <motion.div className={styles.layout} variants={staggerContainer} initial="hidden" animate="visible">
          {/* ── Left: Profile Card ── */}
          <motion.aside className={styles.profileCard} variants={cardVariant}>
            {/* Avatar */}
            <div
              className={`${styles.avatarWrap} avatar-container-instant`}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest(`.${styles.avatarDeleteBtn}`)) {
                  return;
                }
                if (!isUploadingAvatar) {
                  document.getElementById("avatarInput")?.click();
                }
              }}
            >
              {/* Initials Fallback - Base layer */}
              <div className={`${styles.avatarFallback} avatar-fallback-prevent-flash`} />

              {/* Avatar Image - Overlay layer */}
              {avatar && !avatarFailed && (
                <img
                  src={avatar}
                  alt="Profile"
                  draggable={false}
                  className={styles.avatarImg}
                  onLoad={() => setAvatarLoaded(true)}
                  onError={() => setAvatarFailed(true)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    userSelect: "none",
                    WebkitUserDrag: "none"
                  } as React.CSSProperties}
                />
              )}
              <span className={styles.avatarEditBtn} title="Change photo">
                {isUploadingAvatar ? <div className={styles.avatarLoading} /> : <IconCamera />}
              </span>
              {avatar && <button type="button" className={styles.avatarDeleteBtn} title="Remove photo" onClick={handleAvatarDelete}><IconTrash /></button>}
              <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} disabled={isUploadingAvatar} />
            </div>

            {/* Name & role */}
            <h1 className={styles.cardName}>{fullName || "Your Name"}</h1>
            {targetRole && <p className={styles.cardRole}><IconTarget />{targetRole}{targetCompany ? ` · ${targetCompany}` : ""}</p>}

            {/* Meta row */}
            <div className={styles.cardMeta}>
              {email && <span className={styles.metaItem}><IconMail />{email}</span>}
              {phone && <span className={styles.metaItem}><IconPhone />{phone}</span>}
              {targetCompany && <span className={styles.metaItem}><IconBuilding />{targetCompany}</span>}
            </div>

            {/* Skills preview */}
            {skills.length > 0 && (
              <div className={styles.cardSkills}>
                {skills.slice(0, 8).map((s, i) => <span key={i} className={styles.skillPill}>{s}</span>)}
                {skills.length > 8 && <span className={styles.skillMore}>+{skills.length - 8}</span>}
              </div>
            )}

            {/* Completion bar */}
            <div className={styles.completionWrap}>
              <div className={styles.completionHeader}>
                <span>Profile Completion</span>
                <span className={styles.completionPct}>
                  {Math.round(
                    ([fullName, phone, bio, skills.length > 0, experienceList.length > 0, educationList.length > 0, targetRole, careerGoal]
                      .filter(Boolean).length / 8) * 100
                  )}%
                </span>
              </div>
              <div className={styles.completionBar}>
                <div className={styles.completionFill} style={{
                  width: `${Math.round(
                    ([fullName, phone, bio, skills.length > 0, experienceList.length > 0, educationList.length > 0, targetRole, careerGoal]
                      .filter(Boolean).length / 8) * 100
                  )}%`
                }} />
              </div>
            </div>

            <button
              onClick={signOut}
              className={styles.signOutBtn}
            >
              <IconLogOut />Sign Out
            </button>
          </motion.aside>

          {/* ── Right: Sections ── */}
          <motion.main className={styles.sections} variants={staggerContainer} initial="hidden" animate="visible">

            {/* ── Personal Info ── */}
            <motion.section className={styles.section} variants={cardVariant}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><IconUser /><h2>Personal Information</h2></div>
                {!editing.personal
                  ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, personal: true }))}><IconEdit2 />Edit</button>
                  : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, personal: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "personal" || personalHasError} onClick={() => {
                      if (!fullName.trim() || personalErrors.fullName) return;
                      if (!phone.trim() || personalErrors.phone) return;
                      save("personal", { fullName, phone, bio });
                    }}>
                      <IconCheck />{isSaving === "personal" ? "Saving…" : "Save"}
                    </button>
                  </div>
                }
              </div>
              {!editing.personal ? (
                <div className={styles.infoGrid}>
                  <div className={styles.infoCell}><label>Full Name</label><p>{fullName || <em>Not set</em>}</p></div>
                  <div className={styles.infoCell}><label>Email</label><p>{email}</p></div>
                  <div className={styles.infoCell}><label>Phone</label><p>{phone || <em>Not set</em>}</p></div>
                  <div className={styles.infoCell + " " + styles.span2}><label>Bio</label><p className={styles.bioText}>{bio || <em>Add a short professional bio…</em>}</p></div>
                </div>
              ) : (
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>Full Name<span className={styles.required}>*</span></label><ProfileInput value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" error={personalErrors.fullName} /></div>
                  <div className={styles.field}><label>Phone<span className={styles.required}>*</span></label><ProfileInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-1234" error={personalErrors.phone} /></div>
                  <div className={styles.field + " " + styles.span2}><label>Bio <span className={styles.charHint} style={bio.length >= 480 ? { color: bio.length >= 500 ? "#ef4444" : "#f59e0b" } : undefined}>{bio.length}/500</span></label><ProfileTextarea value={bio} onChange={e => setBio(e.target.value)} rows={5} maxLength={500} placeholder="Brief professional summary…" />{bio.length >= 480 && <span style={{ color: bio.length >= 500 ? "#ef4444" : "#f59e0b", fontSize: "0.8rem", marginTop: "0.35rem", display: "block" }}>{bio.length >= 500 ? "Character limit reached." : `Only ${500 - bio.length} characters left.`}</span>}</div>
                </div>
              )}
            </motion.section>

            {/* ── Skills ── */}
            <motion.section className={styles.section} variants={cardVariant}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><IconZap /><h2>Skills & Expertise</h2></div>
                {!editing.skills
                  ? <button className={styles.editBtn} onClick={() => { setSnapshot(s => ({ ...s, skills })); setEditing(p => ({ ...p, skills: true })); }}><IconEdit2 />Edit</button>
                  : <div className={styles.actionRow}>
                    {skills.length > 0 && (
                      <button
                        className={styles.removeEntry}
                        style={{ position: "static", marginRight: "auto" }}
                        onClick={() => {
                          setSkills([]);
                          setEditing(p => ({ ...p, skills: false }));
                          save("skills", { skills: [] });
                        }}
                        disabled={isSaving === "skills"}
                      >
                        <IconTrash />Clear Skills
                      </button>
                    )}
                    <button className={styles.cancelBtn} onClick={() => { setSkills(snapshot.skills); setEditing(p => ({ ...p, skills: false })); }}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "skills" || skills.length === 0} onClick={() => {
                      if (skills.length === 0) return;
                      save("skills", { skills });
                    }}>
                      <IconCheck />{isSaving === "skills" ? "Saving…" : "Save"}
                    </button>
                  </div>
                }
              </div>
              {!editing.skills ? (
                skills.length > 0
                  ? <div className={styles.tagCloud}>{skills.map((s, i) => <span key={i} className={styles.tag}>{s}</span>)}</div>
                  : <p className={styles.empty}>No skills added yet. Click Edit to add your stack.</p>
              ) : (
                <>
                  <form onSubmit={addSkill} className={styles.skillForm}>
                    <ProfileInput value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Type a skill and press Enter…" error={skillInputError} />
                    <button type="submit" className={styles.addSkillBtn} disabled={!!skillInputError}><IconPlus /></button>
                  </form>
                  <div className={styles.tagCloud}>
                    {skills.map((s, i) => (
                      <span key={i} className={styles.tagEditable}>
                        {s}
                        <button onClick={() => setSkills(p => p.filter((_, j) => j !== i))} className={styles.removeTag}><IconX /></button>
                      </span>
                    ))}
                  </div>
                </>
              )}
            </motion.section>

            {/* ── Work Experience ── */}
            <motion.section className={styles.section} variants={cardVariant}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><IconBriefcase /><h2>Work Experience</h2></div>
                {!editing.experience
                  ? <button className={styles.editBtn} onClick={() => {
                    setSnapshot(s => ({ ...s, experience: experienceList }));
                    if (experienceList.length === 0) setExperienceList([{ company: "", role: "", duration: "", description: "" }]);
                    setEditing(p => ({ ...p, experience: true }));
                  }}><IconEdit2 />Edit</button>
                  : <div className={styles.actionRow}>
                    {(snapshot.experience && snapshot.experience.length > 0) && (
                      <button
                        className={styles.removeEntry}
                        style={{ position: "static", marginRight: "auto" }}
                        onClick={() => {
                          setExperienceList([]);
                          setEditing(p => ({ ...p, experience: false }));
                          save("experience", { experience: [] });
                        }}
                        disabled={isSaving === "experience"}
                      >
                        <IconTrash />Clear Experience
                      </button>
                    )}
                    <button className={styles.cancelBtn} onClick={() => { setExperienceList(snapshot.experience); setEditing(p => ({ ...p, experience: false })); }}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "experience" || experienceHasError} onClick={() => {
                      const filled = experienceList.filter(e => e.role || e.company || e.duration || e.description);
                      if (filled.length === 0 || experienceHasError) return;
                      save("experience", { experience: filled });
                    }}>
                      <IconCheck />{isSaving === "experience" ? "Saving…" : "Save"}
                    </button>
                  </div>
                }
              </div>
              {!editing.experience ? (
                experienceList.some(exp => exp.role || exp.company || exp.duration || exp.description) ? (
                  <div className={styles.timeline}>
                    {experienceList.filter(exp => exp.role || exp.company || exp.duration || exp.description).map((exp, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div className={styles.timelineBody}>
                          <div className={styles.timelineTop}>
                            <span className={styles.timelineRole}>{exp.role}</span>
                            {exp.duration && <span className={styles.timelineDuration}><IconClock />{exp.duration}</span>}
                          </div>
                          {exp.company && <span className={styles.timelineCompany}><IconBuilding />{exp.company}</span>}
                          {exp.description && <p className={styles.timelineDesc}>{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className={styles.empty}>No experience added yet. Click Edit to build your timeline.</p>
              ) : (
                <div className={styles.entryList}>
                  {experienceList.map((exp, i) => {
                    const errs = expErrors[i] || {};
                    return (
                      <div key={i} className={styles.entryCard}>
                        <div className={styles.entryCardHeader}>
                          <span className={styles.entryIndex}>Position {i + 1}</span>
                          <button className={styles.removeEntry} onClick={() => setExperienceList(p => p.filter((_, j) => j !== i))}><IconTrash />Remove</button>
                        </div>
                        <div className={styles.entryGrid}>
                          <div className={styles.field}><label>Company<span className={styles.required}>*</span></label><ProfileInput value={exp.company} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} placeholder="Acme Corp" error={errs.company} /></div>
                          <div className={styles.field}><label>Role / Title<span className={styles.required}>*</span></label><ProfileInput value={exp.role} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} placeholder="Senior Engineer" error={errs.role} /></div>
                          <div className={styles.field}><label>Duration</label><ProfileInput value={exp.duration} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, duration: e.target.value } : x))} placeholder="Jan 2022 – Present" error={errs.duration} /></div>
                          <div className={styles.field + " " + styles.span2}><label>Description <span className={styles.charHint} style={exp.description.length >= 480 ? { color: exp.description.length >= 500 ? "#ef4444" : "#f59e0b" } : undefined}>{exp.description.length}/500</span></label><ProfileTextarea rows={5} value={exp.description} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} maxLength={500} placeholder="Key responsibilities and achievements…" error={errs.description} />{exp.description.length >= 480 && <span style={{ color: exp.description.length >= 500 ? "#ef4444" : "#f59e0b", fontSize: "0.8rem", marginTop: "0.35rem", display: "block" }}>{exp.description.length >= 500 ? "Character limit reached." : `Only ${500 - exp.description.length} characters left.`}</span>}</div>
                        </div>
                      </div>
                    );
                  })}
                  <button className={styles.addEntryBtn} onClick={() => setExperienceList(p => [...p, { company: "", role: "", duration: "", description: "" }])}><IconPlus />Add Position</button>
                </div>
              )}
            </motion.section>

            {/* ── Education ── */}
            <motion.section className={styles.section} variants={cardVariant}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><IconGradCap /><h2>Education</h2></div>
                {!editing.education
                  ? <button className={styles.editBtn} onClick={() => {
                    setSnapshot(s => ({ ...s, education: educationList }));
                    if (educationList.length === 0) setEducationList([{ institution: "", degree: "", field: "", year: "" }]);
                    setEditing(p => ({ ...p, education: true }));
                  }}><IconEdit2 />Edit</button>
                  : <div className={styles.actionRow}>
                    {(snapshot.education && snapshot.education.length > 0) && (
                      <button
                        className={styles.removeEntry}
                        style={{ position: "static", marginRight: "auto" }}
                        onClick={() => {
                          setEducationList([]);
                          setEditing(p => ({ ...p, education: false }));
                          save("education", { education: [] });
                        }}
                        disabled={isSaving === "education"}
                      >
                        <IconTrash />Clear Education
                      </button>
                    )}
                    <button className={styles.cancelBtn} onClick={() => { setEducationList(snapshot.education); setEditing(p => ({ ...p, education: false })); }}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "education" || educationHasError} onClick={() => {
                      const filled = educationList.filter(e => e.institution || e.degree || e.field || e.year);
                      if (filled.length === 0 || educationHasError) return;
                      save("education", { education: filled });
                    }}>
                      <IconCheck />{isSaving === "education" ? "Saving…" : "Save"}
                    </button>
                  </div>
                }
              </div>
              {!editing.education ? (
                educationList.some(edu => edu.institution || edu.degree || edu.field || edu.year) ? (
                  <div className={styles.eduGrid}>
                    {educationList.filter(edu => edu.institution || edu.degree || edu.field || edu.year).map((edu, i) => (
                      <div key={i} className={styles.eduCard}>
                        <div className={styles.eduIcon}><IconGradCap /></div>
                        <div>
                          {edu.institution && <p className={styles.eduInstitution}>{edu.institution}</p>}
                          {(edu.degree || edu.field) && <p className={styles.eduDegree}>{edu.degree}{edu.field ? ` · ${edu.field}` : ""}</p>}
                          {edu.year && <p className={styles.eduYear}>Class of {edu.year}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className={styles.empty}>No education records yet. Click Edit to add.</p>
              ) : (
                <div className={styles.entryList}>
                  {educationList.map((edu, i) => {
                    const errs = eduErrors[i] || {};
                    return (
                      <div key={i} className={styles.entryCard}>
                        <div className={styles.entryCardHeader}>
                          <span className={styles.entryIndex}>Education {i + 1}</span>
                          <button className={styles.removeEntry} onClick={() => setEducationList(p => p.filter((_, j) => j !== i))}><IconTrash />Remove</button>
                        </div>
                        <div className={styles.entryGrid}>
                          <div className={styles.field + " " + styles.span2}><label>Institution<span className={styles.required}>*</span></label><ProfileInput value={edu.institution} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, institution: e.target.value } : x))} placeholder="Stanford University" error={errs.institution} /></div>
                          <div className={styles.field}><label>Degree<span className={styles.required}>*</span></label><ProfileInput value={edu.degree} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))} placeholder="B.S. Computer Science" error={errs.degree} /></div>
                          <div className={styles.field}><label>Field</label><ProfileInput value={edu.field} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, field: e.target.value } : x))} placeholder="Computer Science" error={errs.field} /></div>
                          <div className={styles.field}><label>Graduation Year</label><ProfileInput value={edu.year} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, year: e.target.value } : x))} placeholder="2024" error={errs.year} /></div>
                        </div>
                      </div>
                    );
                  })}
                  <button className={styles.addEntryBtn} onClick={() => setEducationList(p => [...p, { institution: "", degree: "", field: "", year: "" }])}><IconPlus />Add Education</button>
                </div>
              )}
            </motion.section>

            {/* ── Career Goals ── */}
            <motion.section className={styles.section} variants={cardVariant}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionTitle}><IconTarget /><h2>Career Goals</h2></div>
                {!editing.goals
                  ? <button className={styles.editBtn} onClick={() => { setSnapshot(s => ({ ...s, careerGoal, targetRole, targetCompany })); setEditing(p => ({ ...p, goals: true })); }}><IconEdit2 />Edit</button>
                  : <div className={styles.actionRow}>
                    {(snapshot.targetRole || snapshot.targetCompany || snapshot.careerGoal) && (
                      <button
                        className={styles.removeEntry}
                        style={{ position: "static", marginRight: "auto" }}
                        onClick={() => {
                          setTargetRole("");
                          setTargetCompany("");
                          setCareerGoal("");
                          setEditing(p => ({ ...p, goals: false }));
                          save("goals", { targetRole: "", targetCompany: "", careerGoal: "" });
                        }}
                        disabled={isSaving === "goals"}
                      >
                        <IconTrash />Clear Goals
                      </button>
                    )}
                    <button className={styles.cancelBtn} onClick={() => { setCareerGoal(snapshot.careerGoal); setTargetRole(snapshot.targetRole); setTargetCompany(snapshot.targetCompany); setEditing(p => ({ ...p, goals: false })); }}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "goals" || goalsHasError} onClick={() => {
                      if (!targetRole.trim() || goalErrors.targetRole) return;
                      if (targetCompany.trim() && goalErrors.targetCompany) return;
                      save("goals", { careerGoal, targetRole, targetCompany });
                    }}>
                      <IconCheck />{isSaving === "goals" ? "Saving…" : "Save"}
                    </button>
                  </div>
                }
              </div>
              {!editing.goals ? (
                (targetRole || targetCompany || careerGoal) ? (
                  <div className={styles.infoGrid}>
                    <div className={styles.infoCell}><label>Target Role</label><p>{targetRole || <em>Not set</em>}</p></div>
                    <div className={styles.infoCell}><label>Target Company</label><p>{targetCompany || <em>Not set</em>}</p></div>
                    <div className={styles.infoCell + " " + styles.span2}><label>Career Objectives</label><p className={styles.bioText}>{careerGoal || <em>Describe where you want to be in 2–3 years…</em>}</p></div>
                  </div>
                ) : <p className={styles.empty}>No goals set yet. Click Edit to add.</p>
              ) : (
                <div className={styles.formGrid}>
                  <div className={styles.field}><label>Target Role<span className={styles.required}>*</span></label><ProfileInput value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Principal Engineer" error={goalErrors.targetRole} /></div>
                  <div className={styles.field}><label>Target Company</label><ProfileInput value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="Google, OpenAI…" error={goalErrors.targetCompany} /></div>
                  <div className={styles.field + " " + styles.span2}><label>Career Objectives</label><ProfileTextarea value={careerGoal} onChange={e => setCareerGoal(e.target.value)} rows={4} placeholder="Describe your career ambitions and goals…" /></div>
                </div>
              )}
            </motion.section>

          </motion.main>
        </motion.div>

      <SiteFooter />
    </div>
  );
}
