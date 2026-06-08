"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";
import ThemeToggle from "../components/ThemeToggle";
import { useToast } from "../components/Toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "skills" | "experience" | "education" | "goals">("personal");

  // Authentication & User state
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Section Editing states
  const [isEditing, setIsEditing] = useState({
    personal: false,
    skills: false,
    experience: false,
    education: false,
    goals: false,
  });

  // Personal Info Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Skills Form State
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  // Experience Form State
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);

  // Education Form State
  const [educationList, setEducationList] = useState<EducationItem[]>([]);

  // Career Goals Form State
  const [careerGoal, setCareerGoal] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");

  // Load User Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to view your profile.");
      router.push("/auth?mode=signin");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await res.json();

        if (data.success && data.user) {
          const u = data.user;
          setUserId(u._id || u.id || "");
          setEmail(u.email || "");
          setAvatar(u.avatar || "");
          setFullName(u.fullName || "");
          setPhone(u.phone || "");
          setBio(u.bio || "");
          setSkills(u.skills || []);
          setExperienceList(u.experience || []);
          setEducationList(u.education || []);
          setCareerGoal(u.careerGoal || "");
          setTargetRole(u.targetRole || "");
          setTargetCompany(u.targetCompany || "");
        } else {
          localStorage.removeItem("token");
          toast.error("Session expired. Please sign in again.");
          router.push("/auth?mode=signin");
        }
      } catch (err) {
        toast.error("Unable to load profile from server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router, toast]);

  // Handle Profile Save
  const handleSaveSection = async (section: keyof typeof isEditing) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to save changes.");
      router.push("/auth?mode=signin");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Record<string, any> = {};

      if (section === "personal") {
        payload.fullName = fullName;
        payload.phone = phone;
        payload.bio = bio;
      } else if (section === "skills") {
        payload.skills = skills;
      } else if (section === "experience") {
        payload.experience = experienceList;
      } else if (section === "education") {
        payload.education = educationList;
      } else if (section === "goals") {
        payload.careerGoal = careerGoal;
        payload.targetRole = targetRole;
        payload.targetCompany = targetCompany;
      }

      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} information updated successfully! ✨`);
        setIsEditing((prev) => ({ ...prev, [section]: false }));
      } else {
        toast.error(data.message || "Failed to save profile.");
      }
    } catch (err) {
      toast.error("Network error. Could not connect to server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelSection = async (section: keyof typeof isEditing) => {
    // Re-fetch to discard edits
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.user) {
        const u = data.user;
        if (section === "personal") {
          setFullName(u.fullName || "");
          setPhone(u.phone || "");
          setBio(u.bio || "");
        } else if (section === "skills") {
          setSkills(u.skills || []);
        } else if (section === "experience") {
          setExperienceList(u.experience || []);
        } else if (section === "education") {
          setEducationList(u.education || []);
        } else if (section === "goals") {
          setCareerGoal(u.careerGoal || "");
          setTargetRole(u.targetRole || "");
          setTargetCompany(u.targetCompany || "");
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsLoading(false);
      setIsEditing((prev) => ({ ...prev, [section]: false }));
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem("token");
    toast.success("Signed out successfully.");
    router.push("/");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ avatar: base64 }),
        });
        const data = await res.json();
        if (data.success) {
          setAvatar(base64);
          toast.success("Profile picture updated successfully! 📸");
        } else {
          toast.error(data.message || "Failed to update profile picture.");
        }
      } catch (err) {
        toast.error("Error connecting to server.");
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file.");
      setIsUploadingAvatar(false);
    };
  };

  // Skill Tags Helpers
  const addSkill = (e: FormEvent) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills((prev) => [...prev, clean]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Experience List Helpers
  const addExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      { company: "", role: "", duration: "", description: "" },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperienceList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
    setExperienceList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // Education List Helpers
  const addEducation = () => {
    setEducationList((prev) => [
      ...prev,
      { institution: "", degree: "", field: "", year: "" },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setEducationList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Fetching professional profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* ─── Header Navbar ─────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logoGrad)" />
              <path d="M12 14h16M12 20h10M12 26h14" stroke="var(--logo-stroke)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="30" cy="26" r="4" fill="var(--logo-stroke)" opacity="0.8" />
              <path d="M29 25.5l1 1 2-2" stroke="var(--logo-check-bg)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="var(--logo-grad-start)" />
                  <stop offset="1" stopColor="var(--logo-grad-end)" />
                </linearGradient>
              </defs>
            </svg>
            <span>HireMate AI</span>
          </Link>
          <div className={styles.navActions}>
            <ThemeToggle />
            <Link href="/" className={styles.navLink}>Home</Link>
            <button onClick={handleSignOut} className={styles.navSignOutBtn}>Sign Out</button>
          </div>
        </div>
      </nav>

      {/* ─── Main Content Grid ──────────────────────────────────────── */}
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <div className={styles.avatarSquareContainer}>
            {avatar ? (
              <img src={avatar} alt="Profile" className={styles.avatarSquare} />
            ) : (
              <div className={styles.avatarSquareFallback}>
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <label htmlFor="avatar-upload" className={styles.avatarUploadOverlay} title="Upload Profile Picture">
              {isUploadingAvatar ? (
                <div className={styles.avatarSpinner} />
              ) : (
                <>
                  <span className={styles.cameraIcon}>📷</span>
                  <span className={styles.overlayText}>Edit</span>
                </>
              )}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              disabled={isUploadingAvatar}
            />
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>{fullName || "HireMate Professional"}</h1>
            <p className={styles.subtitle}>{targetRole ? `${targetRole} @ ${targetCompany || "Dream Company"}` : "Configure your career goals to get started"}</p>
            <span className={styles.emailBadge}>{email}</span>
          </div>
        </div>

        <div className={styles.layoutGrid}>
          {/* Sidebar Tabs */}
          <aside className={styles.sidebar}>
            {[
              { id: "personal", label: "Personal Info", icon: "👤" },
              { id: "skills", label: "Skills", icon: "⚡" },
              { id: "experience", label: "Work Experience", icon: "💼" },
              { id: "education", label: "Education", icon: "🎓" },
              { id: "goals", label: "Career Goals", icon: "🎯" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* Dynamic Panel Content */}
          <section className={styles.panel}>
            {/* ─── Personal Info ─── */}
            {activeTab === "personal" && (
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h2>Personal Information</h2>
                  {!isEditing.personal ? (
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, personal: true }))}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => handleSaveSection("personal")}
                        disabled={isSaving}
                        className={styles.saveBtn}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleCancelSection("personal")}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing.personal ? (
                  <div className={styles.displayContent}>
                    <div className={styles.infoGroup}>
                      <label>Full Name</label>
                      <p>{fullName || <em className={styles.placeholder}>No name specified</em>}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Contact Phone</label>
                      <p>{phone || <em className={styles.placeholder}>No phone number specified</em>}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Professional Bio</label>
                      <p className={styles.bioText}>
                        {bio || <em className={styles.placeholder}>Write a short bio detailing your professional highlights.</em>}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formContent}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="bio">Professional Bio</label>
                      <textarea
                        id="bio"
                        rows={4}
                        maxLength={500}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Brief summary of your professional expertise..."
                        className={styles.textarea}
                      />
                      <span className={styles.charCount}>{bio.length}/500</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Skills ─── */}
            {activeTab === "skills" && (
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h2>Skills & Core Competencies</h2>
                  {!isEditing.skills ? (
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, skills: true }))}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => handleSaveSection("skills")}
                        disabled={isSaving}
                        className={styles.saveBtn}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleCancelSection("skills")}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing.skills ? (
                  <div className={styles.displayContent}>
                    <p className={styles.sectionDesc}>Skills listed here will guide the AI Interviewer and customize coding playground challenges.</p>
                    {skills.length > 0 ? (
                      <div className={styles.tagCloud}>
                        {skills.map((skill, index) => (
                          <span key={index} className={styles.tag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No skills specified yet. Click edit to add your stack!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.formContent}>
                    <p className={styles.sectionDesc}>Add your skills (e.g. React, Python, Systems Design) to tailor HireMate AI.</p>
                    
                    <form onSubmit={addSkill} className={styles.tagForm}>
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Type a skill and press Enter"
                        className={styles.tagInput}
                      />
                      <button type="submit" className={styles.addTagBtn}>Add</button>
                    </form>

                    <div className={styles.tagCloudEditable}>
                      {skills.map((skill, index) => (
                        <span key={index} className={styles.editableTag}>
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className={styles.removeTagBtn}
                            aria-label={`Remove ${skill}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Work Experience ─── */}
            {activeTab === "experience" && (
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h2>Work Experience</h2>
                  {!isEditing.experience ? (
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, experience: true }))}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => handleSaveSection("experience")}
                        disabled={isSaving}
                        className={styles.saveBtn}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleCancelSection("experience")}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing.experience ? (
                  <div className={styles.displayContent}>
                    {experienceList.length > 0 ? (
                      <div className={styles.timeline}>
                        {experienceList.map((exp, index) => (
                          <div key={index} className={styles.timelineItem}>
                            <div className={styles.timelineDot} />
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineHeader}>
                                <h3>{exp.role || "Developer"}</h3>
                                <span className={styles.duration}>{exp.duration || "N/A"}</span>
                              </div>
                              <h4 className={styles.company}>{exp.company || "Company"}</h4>
                              <p className={styles.description}>{exp.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No work experience added yet. Click edit to build your timeline.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.formContent}>
                    {experienceList.map((exp, index) => (
                      <div key={index} className={styles.entryCard}>
                        <div className={styles.entryCardHeader}>
                          <h3>Position #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className={styles.removeEntryBtn}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.inputGroup}>
                            <label>Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(index, "company", e.target.value)}
                              placeholder="e.g. Acme Corp"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Role</label>
                            <input
                              type="text"
                              value={exp.role}
                              onChange={(e) => updateExperience(index, "role", e.target.value)}
                              placeholder="e.g. Senior Software Engineer"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Duration</label>
                            <input
                              type="text"
                              value={exp.duration}
                              onChange={(e) => updateExperience(index, "duration", e.target.value)}
                              placeholder="e.g. Jan 2022 - Present or 3 Years"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
                            <label>Description / Core Achievements</label>
                            <textarea
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(index, "description", e.target.value)}
                              placeholder="Describe your role, stack, and primary business impacts..."
                              className={styles.textarea}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addExperience}
                      className={styles.addEntryBtn}
                    >
                      ➕ Add Experience Position
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── Education ─── */}
            {activeTab === "education" && (
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h2>Education</h2>
                  {!isEditing.education ? (
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, education: true }))}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => handleSaveSection("education")}
                        disabled={isSaving}
                        className={styles.saveBtn}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleCancelSection("education")}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing.education ? (
                  <div className={styles.displayContent}>
                    {educationList.length > 0 ? (
                      <div className={styles.educationGrid}>
                        {educationList.map((edu, index) => (
                          <div key={index} className={styles.eduCard}>
                            <div className={styles.eduIcon}>🎓</div>
                            <div className={styles.eduDetails}>
                              <h3>{edu.institution || "Institution"}</h3>
                              <p className={styles.degree}>
                                {edu.degree || "Degree"} in {edu.field || "Field of Study"}
                              </p>
                              <span className={styles.year}>Graduation: {edu.year || "N/A"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.emptyState}>
                        <p>No educational credentials added yet. Click edit to update.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.formContent}>
                    {educationList.map((edu, index) => (
                      <div key={index} className={styles.entryCard}>
                        <div className={styles.entryCardHeader}>
                          <h3>Education Item #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className={styles.removeEntryBtn}
                          >
                            🗑️ Remove
                          </button>
                        </div>
                        <div className={styles.formGrid}>
                          <div className={styles.inputGroup} style={{ gridColumn: "1 / -1" }}>
                            <label>Institution Name</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => updateEducation(index, "institution", e.target.value)}
                              placeholder="e.g. Stanford University"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, "degree", e.target.value)}
                              placeholder="e.g. Bachelor of Science"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Field of Study</label>
                            <input
                              type="text"
                              value={edu.field}
                              onChange={(e) => updateEducation(index, "field", e.target.value)}
                              placeholder="e.g. Computer Science"
                              className={styles.input}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Graduation Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) => updateEducation(index, "year", e.target.value)}
                              placeholder="e.g. 2024"
                              className={styles.input}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addEducation}
                      className={styles.addEntryBtn}
                    >
                      ➕ Add Education Item
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ─── Career Goals ─── */}
            {activeTab === "goals" && (
              <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <h2>Career Goals</h2>
                  {!isEditing.goals ? (
                    <button
                      onClick={() => setIsEditing((prev) => ({ ...prev, goals: true }))}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                  ) : (
                    <div className={styles.btnGroup}>
                      <button
                        onClick={() => handleSaveSection("goals")}
                        disabled={isSaving}
                        className={styles.saveBtn}
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => handleCancelSection("goals")}
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing.goals ? (
                  <div className={styles.displayContent}>
                    <div className={styles.infoGroup}>
                      <label>Target Role</label>
                      <p>{targetRole || <em className={styles.placeholder}>No target role specified (e.g. Senior Frontend Engineer)</em>}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Target Company</label>
                      <p>{targetCompany || <em className={styles.placeholder}>No target company specified (e.g. Stripe, Google)</em>}</p>
                    </div>
                    <div className={styles.infoGroup}>
                      <label>Career Objectives & Goals</label>
                      <p className={styles.goalText}>
                        {careerGoal || <em className={styles.placeholder}>Outline where you want to be professionally in 2-3 years.</em>}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.formContent}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="targetRole">Target Role</label>
                      <input
                        id="targetRole"
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. Principal Product Manager"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="targetCompany">Target Company (Optional)</label>
                      <input
                        id="targetCompany"
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        placeholder="e.g. OpenAI, Stripe"
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label htmlFor="careerGoal">Career Objectives & Goal Statement</label>
                      <textarea
                        id="careerGoal"
                        rows={4}
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        placeholder="Tell us what you aim to achieve next in your career. We will construct mock interviews to help you reach this goal..."
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
