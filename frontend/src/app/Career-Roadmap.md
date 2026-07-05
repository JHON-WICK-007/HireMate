# HireMate AI — Career Roadmap Page
### Flagship Feature Specification & Build Brief

> **Status:** Design brief for `/roadmap`
> **Depends on:** Design tokens from `HIREMATE_MASTER_SYSTEM_PROMPT.md` (Section ⓱ override applies if filled)
> **Consumes data from:** Profile, Resume Analyzer, Interview History/Results

---

## 0. Non-Negotiables

This is one of HireMate AI's flagship AI features. It must read as a product a recruiter would screenshot, not a student project.

| Must NOT feel like | Must feel like |
|---|---|
| A checklist | An intelligent, adaptive system |
| A static timeline | A living roadmap that reacts to real data |
| A generic dashboard template | Linear × Roadmap.sh × GitHub Projects, in HireMate's own skin |

**Reference bar:** Linear, Stripe, Notion, Roadmap.sh, Vercel, Framer, Duolingo, GitHub Projects — for *interaction quality and information density*, not for their color systems.

**Hard constraint — reuse, never reinvent:**
- Zero new colors, radii, shadows, or type scale. Pull every token from the master system prompt (`#080810` background, `#7c6ee6` primary, `#10b981` success, Space Grotesk).
- Navbar and Footer are imported unmodified — no page-level overrides.
- Buttons, Inputs, Cards, Dropdowns, Sliders, Modals, Toasts = existing components only. If a needed variant doesn't exist yet, extend the component contract in the design system doc first — do not one-off style it inside this page.

**Definition of done** — every item below must be YES before shipping:
- [ ] Navbar/Footer reused with zero overrides
- [ ] No layout shift on hover, load, or state change (buttons and text never move — only transform/opacity/glow animate)
- [ ] Borders/radii pixel-consistent with the rest of the app
- [ ] Fully responsive at 375 / 768 / 1024 / 1440
- [ ] Every state has a designed empty/loading/error version (see §10–11)
- [ ] AI outputs feel personalized, not templated (no two roadmaps should read identically)
- [ ] `prefers-reduced-motion` respected everywhere
- [ ] Keyboard nav + focus rings on every interactive element
- [ ] No placeholder text, no lorem ipsum, no generic stock icons

If any box is unchecked, keep iterating — do not ship a partial version of this page.

---

## 1. Data Model (drives everything below)

Before UI, define the shape. The roadmap is generated from, and continuously updated by:

```
UserContext {
  targetCompany: string
  targetRole: string
  experienceLevel: enum
  currentSkillLevel: enum        // self-reported
  weeklyStudyHours: number
  learningStyle: enum[]
  resumeAnalysis: {              // from Resume Analyzer
    extractedSkills: string[]
    matchScore: number
    gaps: string[]
  }
  interviewPerformance: {        // from Interview History
    avgScore: number
    weakCompetencies: string[]   // e.g. "System Design", "Behavioral - STAR method"
    sessionsCompleted: number
  }
}

RoadmapPhase {
  id, order, title, theme
  status: locked | active | completed
  progressPercent: number
  estimatedWeeks: number
  difficulty: enum
  skills: SkillNode[]
  projects: ProjectNode[]
  aiRationale: string            // WHY this phase, in this order, for THIS user
}

SkillNode {
  id, name, icon, difficulty, estimatedHours
  status: locked | in-progress | completed
  progressPercent: number
  aiPriority: high | medium | low   // derived from gap analysis
  resources: Resource[]
  practiceQuestions: Question[]
  miniProject: ProjectNode
}
```

**Why this matters:** the roadmap must visibly derive from resume + interview data, not just the intake form. The AI Insights Panel (§7) exists specifically to surface that connection so the feature doesn't look like a static generator.

---

## 2. Page Architecture

```
┌────────────────────────────────────────────────────────┐
│ Navbar (reused, untouched)                              │
├────────────────────────────────────────────────────────┤
│ HERO — title, subtitle, illustration, ambient background│
├────────────────────────────────────────────────────────┤
│ EMPTY STATE  ── or ──  GENERATOR CARD (if no roadmap)   │
├──────────────────────────────────┬───────────────────────┤
│  ROADMAP CANVAS (phases, skills) │  AI INSIGHTS PANEL     │
│  scroll-owns this column          │  (sticky, own scroll)│
├──────────────────────────────────┴───────────────────────┤
│ SKILL GAP ANALYSIS · CERTIFICATIONS · GAMIFICATION STRIP │
├────────────────────────────────────────────────────────┤
│ Footer (reused, untouched)                               │
└────────────────────────────────────────────────────────┘
```

**Layout logic:** once a roadmap exists, the page becomes a two-column workspace (roadmap canvas + sticky insights panel), echoing the Resume Builder's proven pattern (active-content-left, live-context-right) rather than a single center column. This keeps the two flagship pages feeling like one family.

- **Desktop (≥1280px):** 68% / 32% split, insights panel `sticky top`, its own internal scroll.
- **Tablet (768–1279px):** insights panel collapses into a horizontal summary strip above the roadmap, expandable via a "View AI Insights" toggle.
- **Mobile (<768px):** insights panel becomes a bottom sheet, swipe-up, summoned by a floating pill button ("AI Insights · 3 new").

---

## 3. Hero Section

- **Headline:** "Career Roadmap"
- **Subhead:** "Your personalized AI-powered journey to your dream career."
- **Right side:** a single SVG/lottie illustration — an abstract node-path graphic (nodes connected by a glowing curved line, one node pulsing as "current position") rendered in primary/success accent tones only. This doubles as a visual metaphor reused later in the phase connector (§5), so the hero isn't decorative — it previews the mechanic.
- **Background:** animated gradient mesh + faint aurora glow + low-opacity dot grid, identical treatment/opacity budget to the Landing page hero so the two don't visually compete. Motion amplitude must be subtle enough to sit behind readable text — cap gradient drift at low speed, no strobing.
- If the user already has a roadmap, hero compresses to a slim header (title + "Regenerate" + "Last updated Xd ago") so returning users land on their progress, not a marketing moment.

---

## 4. Roadmap Generator (Intake)

Presented as a single elevated Card, multi-section within it (not a modal — this is a destination, not an interruption).

| Field | Control | Notes |
|---|---|---|
| Target Company | Searchable dropdown | Google, Amazon, Microsoft, Meta, Netflix, Apple, Adobe, Uber, Stripe, Vercel, NVIDIA, OpenAI, Zoho, Infosys, TCS, Accenture + "Other / General" |
| Target Role | Searchable dropdown | Frontend, Backend, Full Stack, AI Engineer, ML Engineer, DevOps, SWE, Data Analyst, Cloud Engineer, Mobile, Cybersecurity |
| Experience | Segmented radio pills | Student, Fresher, 0–1y, 1–3y, 3–5y, 5+y |
| Current Skill Level | Existing slider component | Beginner / Intermediate / Advanced, with live label |
| Weekly Study Hours | Existing slider component | 5–30, step 5, shows derived "≈ X weeks to job-ready" live estimate |
| Learning Style | Multi-select chip group | Video, Articles, Projects, Coding Practice, Mixed |
| **Auto-detected context** | Read-only summary chips (non-editable, sourced from Resume Analyzer / Interview History) | e.g. "Resume match: 62%" · "Weak: System Design" — shown so the user sees the AI already has context before they even generate |
| Generate button | Primary gradient button (existing component) | Disabled state until required fields filled; label switches to "Regenerating…" if a roadmap already exists |

The "Auto-detected context" row is the detail that makes this feel intelligent rather than a form: it proves the AI already knows something about the user before they've clicked anything.

---

## 5. Roadmap Canvas — Phase Structure

Not a plain vertical timeline. Structure:

- A **persistent vertical spine** (the connector line from the hero illustration, now functional) runs down the left edge of the canvas, with each phase's node sitting on it. The spine fills with the primary→success gradient up to the current phase — this is the single clearest "how far am I" signal on the page.
- Each **Phase** is a large collapsible section (default: current phase expanded, others collapsed to a summary row), not six equally-weighted timeline entries. This mirrors GitHub Projects' grouped view rather than a flat Gantt chart.

**Phases (fixed order, AI fills content per user):**
1. Foundation
2. Core Development
3. Advanced Topics
4. Interview Preparation
5. Portfolio Building
6. Job Ready

**Phase summary row (collapsed state):**
`[status node] Phase N · Title — X/Y skills · progress ring · estimated weeks remaining`

**Phase expanded state contains:**
- One-line **AI Explanation** ("Why this phase, why now") — this is the field that most needs to feel personalized; it should reference the user's actual gaps, not generic copy.
- Skill grid (§6)
- Project recommendations (§9) scoped to that phase
- Phase-level progress bar + "Mark milestone" state

**Status semantics** (locked / active / completed) are expressed via node fill + border treatment, not by graying out content into illegibility — locked content stays readable (users need to see what's ahead) but is visually receded and non-interactive except a "Preview" affordance.

---

## 6. Skill Card

Grid within each phase, existing Card component as the base shell.

**Contents:**
- Icon (tech logo where available, generic skill icon otherwise — never emoji)
- Skill name
- Difficulty badge
- Estimated hours
- Progress bar (0–100%)
- Status: Locked / Unlocked / Completed
- AI Recommendation — one short sentence, specific ("Prioritize this — it appeared in 4 of your last 5 mock interview weak-points")
- Expandable drawer (not a modal — keep context) revealing:
  - Resources (see §8)
  - Mini project
  - Practice questions
  - Interview questions
  - Related certification, if any

**Interaction:** click/tap expands in place with height animation; only one card per phase expands at a time to avoid runaway vertical growth. Progress bar animates on mount (fill from 0) and on update (never instant-snap).

---

## 7. AI Insights Panel (sticky sidebar)

This is the page's credibility anchor — it's where "AI-powered" stops being a label and starts being visible. Group into three clusters rather than a flat list of ten stats:

**Cluster 1 — Where you stand**
- Current Strengths (chips)
- Weak Skills (chips, tied to interview data)
- Resume Match %
- Interview Readiness %

**Cluster 2 — Where you're headed**
- Estimated Completion date
- Hiring Probability (with 1-line "based on" explanation — never show a bare number with no source)
- Top Missing Skills
- Confidence Score

**Cluster 3 — What to do today**
- Daily Recommendation
- Weekly Recommendation
- Motivational message (rotates, tone matches brand voice — encouraging, not saccharine)

Each metric that's a derived score needs a tiny "i" affordance showing what it's computed from — this is what separates "intelligent" from "decorative number."

---

## 8. Learning Resources

Per skill, resource chips linking out to: Official Docs, YouTube, Coursera, Udemy, freeCodeCamp, Roadmap.sh, GitHub, Articles, Books.

Render as a compact tag/chip row with source-icon, not a bulleted list — keeps skill cards from becoming walls of links. Sort by the user's stated Learning Style preference (§4) so a "Video" learner sees YouTube/Coursera first.

---

## 9. Project Recommendations

Every phase surfaces 1–3 relevant projects from a pool including: Weather App, Task Manager, Chat App, AI Resume Analyzer, HireMate Clone, Expense Tracker, Netflix Clone, AI Chatbot — matched to phase difficulty, not shown all at once.

**Project card:** Name · Difficulty · Tech stack chips · Estimated time · GitHub reference link · "Start project" action.

---

## 10. Certifications

Horizontal scroll or grid of certification cards: AWS, Azure, Google Cloud, Meta, Microsoft, MongoDB, Docker, Cisco.

Each: logo, name, relevance-to-role indicator, progress if started, completion link. Only surface certifications relevant to the target role/company — do not show all eight to every user.

---

## 11. Company-Specific Requirements

Selecting a Target Company changes what the Interview Preparation phase (and the skill gap weighting) emphasizes:

| Company | Emphasis |
|---|---|
| Google | DSA, System Design, Behavioral, Resume, Projects |
| Amazon | Leadership Principles, System Design, DSA, OOP, Behavioral |
| Microsoft | Problem Solving, Communication, Projects, System Design |
| Meta | (extend similarly) |
| *Other/General* | Balanced generic weighting |

Surface this as a small "Tailored for {Company}" badge near the Phase 4 (Interview Prep) header so the personalization is visible, not just backend logic.

---

## 12. Skill Gap Analysis

A dedicated comparison module (its own card, above or alongside the canvas):

- **Current Skills vs Required Skills** — paired horizontal bar or split view, not two separate bare lists
- Match % (large, prominent number)
- Missing Skills (chips)
- Recommended Learning Order (numbered, ties directly back to phase ordering above — the two must never contradict each other)
- Expected Learning Time

Use a **radial/gauge chart** for the overall Match % (performance-vs-target pattern: gradient fill toward the number, numeric label always visible beside it — never a bare dial with no number) and a **horizontal comparison bar** per skill for current-vs-required depth.

---

## 13. Overall Roadmap Progress

A summary strip (own section, after the canvas, before gamification):

Overall Completion · Current Phase · Skills Completed · Projects Completed · Certificates Earned · Interview Readiness · Resume Readiness

Render as a row of compact stat tiles with a shared progress-ring or bar treatment — visually distinct from the AI Insights Panel (§7) so the two don't feel redundant: this strip is *retrospective* (what's done), the panel is *prospective* (what's next).

---

## 14. Gamification Layer

Applied lightly — this supports the roadmap, it doesn't compete with it for attention:

- XP counter (header-adjacent, small)
- Daily streak indicator
- Level badge
- Achievement/milestone unlocks
- Confetti burst **only** on phase completion (not on every micro-action — reserve delight for real milestones or it cheapens)

Keep all gamification chrome secondary in visual weight to the actual roadmap content — this is a career tool first, a game second.

---

## 15. Empty State

Shown when no roadmap exists yet (first visit, or after account reset):

- Premium illustration (same visual language as hero, not a generic "empty box" icon)
- Message: *"Generate your personalized AI career roadmap and let HireMate AI guide your journey toward your dream job."*
- Single clear CTA scrolling to / revealing the Generator Card

---

## 16. Loading State (roadmap generation)

No spinner. Build an **"AI thinking" card** that stays in place where the roadmap will render:

- Sequential status lines with typing-effect reveal, e.g.:
  1. "Analyzing your resume and interview history…"
  2. "Comparing against {Target Role} requirements at {Target Company}…"
  3. "Identifying skill gaps…"
  4. "Building your personalized phases…"
- A slim progress indicator beneath (indeterminate-to-determinate as steps complete)
- Target duration: 5–10s. If generation exceeds ~12s, surface a reassuring "still working" state rather than letting the animation loop silently.

---

## 17. Motion & Micro-interaction Spec

| Element | Behavior |
|---|---|
| Cards | Subtle lift (translateY + shadow deepen) on hover, never on scroll |
| Borders | Glow transition on hover/active, using existing accent glow token |
| Icons | Small scale/rotate on relevant state change (e.g. lock → unlock) |
| Progress bars | Animate fill on mount and on value change; never jump instantly |
| Phase completion | Confetti burst, once, then settles |
| Panel/section transitions | Smooth height/opacity, respecting `prefers-reduced-motion` (fallback: instant, no confetti) |
| **Forbidden** | Any animation that shifts button position or reflows adjacent text |

---

## 18. Responsiveness Checklist

- 375px (mobile): single column, insights panel as bottom sheet, phase cards full-width, skill grid → 1 column
- 768px (tablet): insights panel as collapsible top strip, skill grid → 2 columns
- 1024px (small laptop): two-column canvas/panel layout begins, skill grid → 2–3 columns
- 1440px+ (desktop): full two-column layout, skill grid → 3 columns, spine + nodes fully visible

No horizontal overflow at any breakpoint; no orphaned single-column cards in a grid.

---

## 19. Tech Notes

- Next.js 15 / TypeScript / Tailwind / Framer Motion / Zustand, matching the rest of the app
- Roadmap state (phases, skills, progress) lives in its own Zustand slice, separate from the Resume Builder wizard slice, but both should follow the same store conventions (`currentX`, `xCompletion`, action naming)
- AI generation call should be structured to return the `RoadmapPhase[]` shape in §1 directly — treat that schema as the contract between backend/AI response and the UI, so components can be built against mock data matching it before generation logic is finalized
- Component reuse over duplication: skill card, phase card, and stat tile should each be a single reusable component parametrized by status/data, not six near-identical variants

---

## 20. Suggested Build Sequence

1. Static shell with mock data matching the §1 schema (canvas + insights panel layout, no generation logic)
2. Generator Card + loading state
3. Skill Gap Analysis + AI Insights Panel wired to mock resume/interview data
4. Gamification + certifications + project recommendations
5. Real AI generation wiring, replacing mock data
6. Motion polish pass against §17, then the Definition of Done checklist in §0

---

*This spec assumes `HIREMATE_MASTER_SYSTEM_PROMPT.md` is pasted alongside it for any implementation session — this document defines structure and behavior only and intentionally repeats no color, spacing, or typography values already owned by the master system prompt.*