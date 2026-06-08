"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ExperienceItem { company: string; role: string; duration: string; description: string; }
interface EducationItem { institution: string; degree: string; field: string; year: string; }

// ─── SVG Icons ────────────────────────────────────────────────
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/>
  </svg>
);
const IconGradCap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconEdit2 = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.54 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // User state
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [careerGoal, setCareerGoal] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");

  // Section edit states
  const [editing, setEditing] = useState({ personal: false, skills: false, experience: false, education: false, goals: false });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/auth?mode=signin"); return; }
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` }, credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user) {
          const u = data.user;
          setEmail(u.email || ""); setAvatar(u.avatar || ""); setFullName(u.fullName || "");
          setPhone(u.phone || ""); setBio(u.bio || ""); setSkills(u.skills || []);
          setExperienceList(u.experience || []); setEducationList(u.education || []);
          setCareerGoal(u.careerGoal || ""); setTargetRole(u.targetRole || ""); setTargetCompany(u.targetCompany || "");
        } else { localStorage.removeItem("token"); router.push("/auth?mode=signin"); }
      })
      .catch(() => toast.error("Failed to load profile."))
      .finally(() => setIsLoading(false));
  }, []);

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
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          credentials: "include",
          body: JSON.stringify({ avatar: base64 }),
        });
        const data = await res.json();
        if (data.success) { setAvatar(base64); toast.success("Profile photo updated."); }
        else toast.error(data.message || "Upload failed.");
      } catch { toast.error("Upload error."); }
      finally { setIsUploadingAvatar(false); }
    };
    reader.onerror = () => { toast.error("Failed to read file."); setIsUploadingAvatar(false); };
  };

  const addSkill = (e: FormEvent) => {
    e.preventDefault();
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills(p => [...p, s]); setNewSkill(""); }
  };

  const signOut = async () => {
    try { await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" }); } catch {}
    localStorage.removeItem("token");
    router.push("/");
  };

  if (isLoading) return (
    <div className={styles.loadingScreen}>
      <div className={styles.loadingSpinner} />
      <p>Loading profile…</p>
    </div>
  );

  const initials = fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className={styles.page}>
      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <Link href="/" className={styles.topbarBack}>
          <IconArrowLeft />
          <span>Back to Home</span>
        </Link>
        <Link href="/" className={styles.topbarBrand}>
          <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
            <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#tg)"/>
            <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8"/>
            <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs><linearGradient id="tg" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="var(--logo-grad-start)"/><stop offset="1" stopColor="var(--logo-grad-end)"/>
            </linearGradient></defs>
          </svg>
          <span>HireMate AI</span>
        </Link>
        <div className={styles.topbarRight}>
          <ThemeToggle />
          <button onClick={signOut} className={styles.signOutBtn}>
            <IconLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        {/* ── Left: Profile Card ── */}
        <aside className={styles.profileCard}>
          {/* Avatar */}
          <div className={styles.avatarWrap}>
            {avatar
              ? <img src={avatar} alt="Profile" className={styles.avatarImg} />
              : <div className={styles.avatarFallback}>{initials}</div>
            }
            <label htmlFor="avatarInput" className={styles.avatarEditBtn} title="Change photo">
              {isUploadingAvatar ? <div className={styles.avatarLoading} /> : <IconCamera />}
            </label>
            <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} disabled={isUploadingAvatar} />
          </div>

          {/* Name & role */}
          <h1 className={styles.cardName}>{fullName || "Your Name"}</h1>
          {targetRole && <p className={styles.cardRole}>{targetRole}{targetCompany ? ` · ${targetCompany}` : ""}</p>}

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
        </aside>

        {/* ── Right: Sections ── */}
        <main className={styles.sections}>

          {/* ── Personal Info ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><IconUser /><h2>Personal Information</h2></div>
              {!editing.personal
                ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, personal: true }))}><IconEdit2 />Edit</button>
                : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, personal: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "personal"} onClick={() => save("personal", { fullName, phone, bio })}>
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
                <div className={styles.field}><label>Full Name</label><input className={styles.input} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" /></div>
                <div className={styles.field}><label>Phone</label><input className={styles.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-1234" /></div>
                <div className={styles.field + " " + styles.span2}><label>Bio <span className={styles.charHint}>{bio.length}/500</span></label><textarea className={styles.textarea} value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={500} placeholder="Brief professional summary…" /></div>
              </div>
            )}
          </section>

          {/* ── Skills ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><IconZap /><h2>Skills & Expertise</h2></div>
              {!editing.skills
                ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, skills: true }))}><IconEdit2 />Edit</button>
                : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, skills: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "skills"} onClick={() => save("skills", { skills })}>
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
                  <input className={styles.input} value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Type a skill and press Enter…" />
                  <button type="submit" className={styles.addSkillBtn}><IconPlus /></button>
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
          </section>

          {/* ── Work Experience ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><IconBriefcase /><h2>Work Experience</h2></div>
              {!editing.experience
                ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, experience: true }))}><IconEdit2 />Edit</button>
                : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, experience: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "experience"} onClick={() => save("experience", { experience: experienceList })}>
                      <IconCheck />{isSaving === "experience" ? "Saving…" : "Save"}
                    </button>
                  </div>
              }
            </div>
            {!editing.experience ? (
              experienceList.length > 0 ? (
                <div className={styles.timeline}>
                  {experienceList.map((exp, i) => (
                    <div key={i} className={styles.timelineItem}>
                      <div className={styles.timelineDot} />
                      <div className={styles.timelineBody}>
                        <div className={styles.timelineTop}>
                          <span className={styles.timelineRole}>{exp.role || "Role"}</span>
                          {exp.duration && <span className={styles.timelineDuration}><IconClock />{exp.duration}</span>}
                        </div>
                        <span className={styles.timelineCompany}><IconBuilding />{exp.company || "Company"}</span>
                        {exp.description && <p className={styles.timelineDesc}>{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className={styles.empty}>No experience added yet. Click Edit to build your timeline.</p>
            ) : (
              <div className={styles.entryList}>
                {experienceList.map((exp, i) => (
                  <div key={i} className={styles.entryCard}>
                    <div className={styles.entryCardHeader}>
                      <span className={styles.entryIndex}>Position {i + 1}</span>
                      <button className={styles.removeEntry} onClick={() => setExperienceList(p => p.filter((_, j) => j !== i))}><IconTrash />Remove</button>
                    </div>
                    <div className={styles.entryGrid}>
                      <div className={styles.field}><label>Company</label><input className={styles.input} value={exp.company} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, company: e.target.value } : x))} placeholder="Acme Corp" /></div>
                      <div className={styles.field}><label>Role / Title</label><input className={styles.input} value={exp.role} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, role: e.target.value } : x))} placeholder="Senior Engineer" /></div>
                      <div className={styles.field}><label>Duration</label><input className={styles.input} value={exp.duration} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, duration: e.target.value } : x))} placeholder="Jan 2022 – Present" /></div>
                      <div className={styles.field + " " + styles.span2}><label>Description</label><textarea className={styles.textarea} rows={3} value={exp.description} onChange={e => setExperienceList(p => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} placeholder="Key responsibilities and achievements…" /></div>
                    </div>
                  </div>
                ))}
                <button className={styles.addEntryBtn} onClick={() => setExperienceList(p => [...p, { company: "", role: "", duration: "", description: "" }])}><IconPlus />Add Position</button>
              </div>
            )}
          </section>

          {/* ── Education ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><IconGradCap /><h2>Education</h2></div>
              {!editing.education
                ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, education: true }))}><IconEdit2 />Edit</button>
                : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, education: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "education"} onClick={() => save("education", { education: educationList })}>
                      <IconCheck />{isSaving === "education" ? "Saving…" : "Save"}
                    </button>
                  </div>
              }
            </div>
            {!editing.education ? (
              educationList.length > 0 ? (
                <div className={styles.eduGrid}>
                  {educationList.map((edu, i) => (
                    <div key={i} className={styles.eduCard}>
                      <div className={styles.eduIcon}><IconGradCap /></div>
                      <div>
                        <p className={styles.eduInstitution}>{edu.institution || "Institution"}</p>
                        <p className={styles.eduDegree}>{edu.degree}{edu.field ? ` · ${edu.field}` : ""}</p>
                        {edu.year && <p className={styles.eduYear}>Class of {edu.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className={styles.empty}>No education records yet. Click Edit to add.</p>
            ) : (
              <div className={styles.entryList}>
                {educationList.map((edu, i) => (
                  <div key={i} className={styles.entryCard}>
                    <div className={styles.entryCardHeader}>
                      <span className={styles.entryIndex}>Education {i + 1}</span>
                      <button className={styles.removeEntry} onClick={() => setEducationList(p => p.filter((_, j) => j !== i))}><IconTrash />Remove</button>
                    </div>
                    <div className={styles.entryGrid}>
                      <div className={styles.field + " " + styles.span2}><label>Institution</label><input className={styles.input} value={edu.institution} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, institution: e.target.value } : x))} placeholder="Stanford University" /></div>
                      <div className={styles.field}><label>Degree</label><input className={styles.input} value={edu.degree} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, degree: e.target.value } : x))} placeholder="B.S. Computer Science" /></div>
                      <div className={styles.field}><label>Field</label><input className={styles.input} value={edu.field} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, field: e.target.value } : x))} placeholder="Computer Science" /></div>
                      <div className={styles.field}><label>Graduation Year</label><input className={styles.input} value={edu.year} onChange={e => setEducationList(p => p.map((x, j) => j === i ? { ...x, year: e.target.value } : x))} placeholder="2024" /></div>
                    </div>
                  </div>
                ))}
                <button className={styles.addEntryBtn} onClick={() => setEducationList(p => [...p, { institution: "", degree: "", field: "", year: "" }])}><IconPlus />Add Education</button>
              </div>
            )}
          </section>

          {/* ── Career Goals ── */}
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <div className={styles.sectionTitle}><IconTarget /><h2>Career Goals</h2></div>
              {!editing.goals
                ? <button className={styles.editBtn} onClick={() => setEditing(p => ({ ...p, goals: true }))}><IconEdit2 />Edit</button>
                : <div className={styles.actionRow}>
                    <button className={styles.cancelBtn} onClick={() => setEditing(p => ({ ...p, goals: false }))}><IconX />Cancel</button>
                    <button className={styles.saveBtn} disabled={isSaving === "goals"} onClick={() => save("goals", { careerGoal, targetRole, targetCompany })}>
                      <IconCheck />{isSaving === "goals" ? "Saving…" : "Save"}
                    </button>
                  </div>
              }
            </div>
            {!editing.goals ? (
              <div className={styles.infoGrid}>
                <div className={styles.infoCell}><label>Target Role</label><p>{targetRole || <em>Not set</em>}</p></div>
                <div className={styles.infoCell}><label>Target Company</label><p>{targetCompany || <em>Not set</em>}</p></div>
                <div className={styles.infoCell + " " + styles.span2}><label>Career Objectives</label><p className={styles.bioText}>{careerGoal || <em>Describe where you want to be in 2–3 years…</em>}</p></div>
              </div>
            ) : (
              <div className={styles.formGrid}>
                <div className={styles.field}><label>Target Role</label><input className={styles.input} value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Principal Engineer" /></div>
                <div className={styles.field}><label>Target Company</label><input className={styles.input} value={targetCompany} onChange={e => setTargetCompany(e.target.value)} placeholder="Google, OpenAI…" /></div>
                <div className={styles.field + " " + styles.span2}><label>Career Objectives</label><textarea className={styles.textarea} value={careerGoal} onChange={e => setCareerGoal(e.target.value)} rows={4} placeholder="Describe your career ambitions and goals…" /></div>
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}
