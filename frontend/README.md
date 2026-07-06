# HireMate AI — Next.js Client Application

This directory contains the premium, dark-themed frontend client application for **HireMate AI**, built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4.

---

## ❶ Core Tech Stack

*   **Framework:** Next.js 16.2.7 (App Router)
*   **UI Library:** React 19.2.4
*   **Styling:** Tailwind CSS v4 (mapped using CSS custom properties via `@theme inline` block in `globals.css`)
*   **State Management:** Zustand v5 (with localStorage persistence)
*   **Animations:** Framer Motion v12 (for step wizard page-transitions and subtle micro-animations)
*   **Icons:** Lucide React (stroke width: 2px, stroke color: `currentColor`)

---

## ❷ Interface Directories (`src/app/`)

The application is structured around flat routing directories:

*   `/` — Landing homepage with spring-damped parallax 3D HUD visuals and color theme selectors.
*   `/auth` — Split-screen registration and login portal supporting OAuth integrations.
*   `/profile` — Profile setting panel, skills configurator, and activity statistics dashboard.
*   `/resume-optimizer` — Resume uploader supporting drag-and-drop parsing and ATS scoring feedback.
*   `/resume-builder` — 7-step structural resume editor supporting active preview panels and PDF downloads.
*   `/interview` — Mock interview core directory:
    *   `setup/` — Company, role, and practice type selectors.
    *   `live-interview/` — Real-time typing composer, voice orb waveform, and Monaco editor compiler workspace.
    *   `results/` — Post-interview results HUD displaying circular scores, competency matrices, and radar charts.
*   `/roadmap` — Career roadmap timeline milestones tracker.
*   `/pricing` — Tiered subscription options page.
*   `/contact` — Validated contact and query form.

---

## ❸ Client Scripts

Execute these scripts from the `/frontend` directory:

```bash
# Run the local development server on Port 3000
npm run dev

# Build the optimized production application bundle
npm run build

# Run the built production application
npm run start

# Run ESLint validation audits
npm run lint
```

---

## ❹ Environment Settings

Create a `.env.local` file inside the `frontend/` directory (ignored by Git):

```env
# URL pointer to the API Gateway Node.js server (Default: Port 5000)
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## ❺ Formatting & Design Compliance

All custom components and page layouts must adhere strictly to the monochrome design system.
*   Refer to `DESIGN_SYSTEM.md` in the repository root for typography, sizing scales, and spacing details.
*   Refer to `MASTER_SYSTEM_PROMPT.md` in the repository root for code component contracts and visual rules.
