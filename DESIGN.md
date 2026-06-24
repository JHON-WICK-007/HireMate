# HireMate AI — Design System

> The single source of truth for HireMate AI's visual language. Every value here is concrete and implementation-ready. Decisions are intentionally tuned to the existing codebase (`frontend/src/app/globals.css`, `layout.tsx`) and the tech stack: **Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 (CSS-first config), Framer Motion, Lucide icons**.

---

## 1. Design Philosophy

HireMate AI's visual identity is **monochrome with surgical color accents**. The product surface is built on pure neutrals (true black `#000` → true white `#fff`), and color is reserved exclusively for *meaning* — feature domains (cyan/purple/orange), semantic states (green/red/amber), and AI-generated scores. This is the deliberate choice that separates HireMate from generic AI-blue-and-purple SaaS clones: instead of leading with gradient washes, we lead with **typography, depth, and motion**, and use color like a scalpel.

**Tone & personality:** calm, focused, premium, trustworthy. The feeling of a well-funded developer-tools startup (think Vercel, Linear, Raycast) — not a careers portal or a college project. Dense information presented with breathing room. Confident, not loud.

**What makes it feel "startup-grade":**
- **Ruthless restraint.** One neutral palette, three feature accents, three semantic colors. Nothing else.
- **Depth over decoration.** Glassmorphism, layered surfaces (`--surface-0` → `--surface-400`), and subtle shadows create hierarchy — not drop shadows on everything.
- **Motion with intent.** Animations communicate state changes and spatial relationships; they never decorate.
- **Dark mode is the default**, light mode is a first-class peer. Both are tuned by hand, never auto-inverted.

**Guiding principles:**
1. **Meaning over ornament.** Color, weight, and motion all carry information. If a visual choice communicates nothing, remove it.
2. **Neutral canvas, colored signal.** The UI shell is monochrome; color appears only to mark domain (resume/interview/roadmap), state (success/error/warning), or a generated metric (scores).
3. **Depth creates hierarchy.** Use surface layering, blur, and shadow — not borders-everywhere — to separate content.
4. **Type does the heavy lifting.** Strong size/weight contrast carries layout; backgrounds stay quiet.
5. **Motion is functional.** It explains "where things came from and where they go." Cap durations tight; respect `prefers-reduced-motion`.

---

## 2. Color System

### Palette rationale
A **monochrome (true black ↔ true white) neutral foundation** is chosen because (a) it reads as premium and developer-native, matching the target user (students/freshers/job-seekers who aspire to tech careers); (b) it lets the three product domains and AI outputs "pop" without competing with a loud brand color; (c) it makes a genuinely good dark mode trivial, and dark mode is the default. The three feature accents — **cyan (resume), purple (interview), orange (roadmap)** — already exist in the hero 3D console (`3d_model_specification.md`) and are promoted here to the canonical domain-color system so the entire product stays consistent with its own marketing.

### 2.1 Light mode token table

| Token (CSS var)            | Hex / value              | Tailwind mapping        | Role                                            |
| -------------------------- | ------------------------ | ----------------------- | ----------------------------------------------- |
| `--background`             | `#ffffff`                | `bg-background`         | App canvas                                      |
| `--surface` / `--card`     | `#fafafa`                | `bg-card`               | Cards, panels                                   |
| `--surface-100`            | `#f5f5f5`                | `bg-muted`              | Inset surfaces, hover troughs                   |
| `--surface-200`            | `#e5e5e5`                | `bg-muted/60`           | Dividers, disabled fills                        |
| `--foreground`             | `#000000`                | `text-foreground`       | Primary text                                    |
| `--text-secondary`         | `#525252`                | `text-muted-foreground` | Secondary text, captions                        |
| `--text-muted`             | `#737373`                | `text-muted-foreground` | Tertiary / placeholder text                     |
| `--border`                 | `rgba(0,0,0,0.12)`       | `border`                | Default borders                                 |
| `--border-subtle`          | `rgba(0,0,0,0.06)`       | `border-border-subtle`  | Hairline dividers                               |
| `--border-strong`          | `rgba(0,0,0,0.20)`       | `border-border-strong`  | Emphasis borders, focus rings                   |
| `--primary`                | `#000000`                | `bg-primary`            | Solid CTA fill                                  |
| `--primary-foreground`     | `#ffffff`                | `text-primary-foreground`| Text on primary                                |
| `--primary-hover`          | `#171717` (`--gray-900`) | `hover:bg-primary/90`   | Primary hover                                   |
| `--secondary`              | `#f5f5f5`                | `bg-secondary`          | Secondary buttons, chips                        |
| `--secondary-foreground`   | `#000000`                | `text-secondary-foreground`| Text on secondary                             |
| `--accent`                 | `#000000`                | `text-accent-foreground`| Accent fills / icon emphasis                    |
| `--muted`                  | `#f5f5f5`                | `bg-muted`              | Muted backgrounds                               |
| `--destructive`            | `#ef4444`                | `bg-destructive`        | Errors, destructive actions                     |
| `--destructive-foreground` | `#ffffff`                | `text-destructive-fg`   | Text on destructive                             |
| `--success`                | `#16a34a`                | `text-success`          | "Strong area", pass, positive                   |
| `--warning`                | `#d97706`                | `text-warning`          | Caution, partial                                |
| `--info`                   | `#0284c7`                | `text-info`             | Neutral informational                           |
| Domain: resume             | `#0891b2`                | `text-domain-resume`    | Resume feature accent                           |
| Domain: interview          | `#9333ea`                | `text-domain-interview` | Interview feature accent                        |
| Domain: roadmap            | `#ea580c`                | `text-domain-roadmap`   | Roadmap feature accent                          |

### 2.2 Dark mode token table (default)

| Token (CSS var)            | Hex / value              | Tailwind mapping        | Role                                            |
| -------------------------- | ------------------------ | ----------------------- | ----------------------------------------------- |
| `--background`             | `#000000`                | `bg-background`         | App canvas (`--surface-0`)                      |
| `--surface` / `--card`     | `#0a0a0a`                | `bg-card`               | Sidebar, top-level cards (`--surface-50`)       |
| `--surface-100`            | `#111111`                | `bg-muted`              | Raised panels (`--surface-100`)                 |
| `--surface-200`            | `#1a1a1a`                | `bg-muted/60`           | Inputs, hover troughs (`--surface-200`)         |
| `--surface-300/400`        | `#222222` / `#2a2a2a`    | `bg-muted/40`           | Active states, tooltips                         |
| `--foreground`             | `#ffffff`                | `text-foreground`       | Primary text                                    |
| `--text-secondary`         | `#a3a3a3`                | `text-muted-foreground` | Secondary text                                  |
| `--text-muted`             | `#525252`                | `text-muted-foreground` | Tertiary text                                   |
| `--border`                 | `rgba(255,255,255,0.12)` | `border`                | Default borders                                 |
| `--border-subtle`          | `rgba(255,255,255,0.06)` | `border-border-subtle`  | Hairlines                                       |
| `--border-strong`          | `rgba(255,255,255,0.20)` | `border-border-strong`  | Focus rings, emphasis                           |
| `--primary`                | `#ffffff`                | `bg-primary`            | Solid CTA fill (inverted vs light)              |
| `--primary-foreground`     | `#000000`                | `text-primary-foreground`| Text on primary                                |
| `--primary-hover`          | `#e5e5e5` (`--gray-200`) | `hover:bg-primary/90`   | Primary hover                                   |
| `--secondary`              | `#1a1a1a`                | `bg-secondary`          | Secondary buttons                               |
| `--secondary-foreground`   | `#ffffff`                | `text-secondary-foreground`| Text on secondary                             |
| `--accent`                 | `#ffffff`                | `text-accent-foreground`| Accent / glow source                            |
| `--muted`                  | `#1a1a1a`                | `bg-muted`              | Muted backgrounds                               |
| `--destructive`            | `#ef4444`                | `bg-destructive`        | Errors (kept identical in both themes)          |
| `--destructive-foreground` | `#ffffff`                | `text-destructive-fg`   | Text on destructive                             |
| `--success`                | `#22c55e`                | `text-success`          | Brightened for dark bg                          |
| `--warning`                | `#f59e0b`                | `text-warning`          | Brightened for dark bg                          |
| `--info`                   | `#38bdf8`                | `text-info`             | Brightened for dark bg                          |
| Domain: resume             | `#06b6d4`                | `text-domain-resume`    | Resume feature accent                           |
| Domain: interview          | `#a855f7`                | `text-domain-interview` | Interview feature accent                        |
| Domain: roadmap            | `#f97316`                | `text-domain-roadmap`   | Roadmap feature accent                          |

> **Note on accent inversion:** In dark mode the primary/accent is **white** (light text on dark → dark text on the white button). This is intentional and already implemented in `globals.css` (`--btn-solid-bg: var(--white)`, `--btn-solid-fg: var(--black)`). The product "glows white" against black, reinforcing the monochrome identity.

### 2.3 Usage rules

- **Text on surfaces:** `--foreground` only on `--background` / `--surface` / `--card`. Never place `--foreground` on `--primary` — use `--primary-foreground`. Secondary text (`--text-secondary`) only on surfaces ≥ `--surface`; never on `--primary`.
- **Domain colors are semantic, never decorative.** Cyan/purple/orange appear only (a) on a UI element belonging to that domain, (b) as a 1px accent line / icon / glow — never as a large fill behind unrelated content.
- **Semantic colors are reserved.** Green = success, red = destructive/error, amber = warning, sky = info. Do not reuse these for branding.
- **Glass surfaces** (`--glass-*`) are used for floating, elevated UI only (navbar, floating action cards, modals). Not for static page sections.
- **WCAG AA (≥ 4.5:1 for body, ≥ 3:1 for large text and UI components):**
  - Light: `#000` on `#fff` = 21:1 ✓ · `#525252` on `#fff` = 9.0:1 ✓ · `#737373` on `#fff` = 4.6:1 ✓ (body min) · domain accents on white: cyan `#0891b2` 4.6:1 ✓, purple `#9333ea` 7.4:1 ✓, orange `#ea580c` 4.0:1 (large/UI only — pair with an icon or use `#c2410c` for body).
  - Dark: `#fff` on `#000` = 21:1 ✓ · `#a3a3a3` on `#000` = 9.0:1 ✓ · domain accents on black: cyan `#06b6d4` 7.2:1 ✓, purple `#a855f7` 6.9:1 ✓, orange `#f97316` 8.5:1 ✓.
  - Never put `--text-muted` (`#525252` dark / `#737373` light) on a colored accent fill.

---

## 3. Typography

### Font choices
- **Headings / display:** `Outfit` (loaded via `next/font/google` as `--font-outfit`). Rationale: geometric, modern, slightly techy — reads as a premium product wordmark without feeling corporate. Fallback: `'Outfit', var(--font-sans)`.
- **Body / UI:** `Inter` (loaded as `--font-inter`). Rationale: best-in-class screen legibility, tabular figures for dashboards/tables, variable-weight for fine hierarchy. Fallback: `'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.
- **Code / data:** `ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, monospace`. (Coding interview editor uses the chosen editor's own monospace.)

Both fonts use `display: "swap"` and `subsets: ["latin"]` (matches `layout.tsx`).

### Type scale

| Step        | Tag    | Desktop (≥1024px)               | Mobile (<640px)                 | Typical use                              |
| ----------- | ------ | ------------------------------- | ------------------------------- | ---------------------------------------- |
| Display     | —      | 64px / 4rem · 1.05 · 700 (Outfit) | 40px / 2.5rem · 1.1 · 700      | Hero headline                            |
| H1          | `h1`   | 48px / 3rem · 1.1 · 700 (Outfit)  | 32px / 2rem · 1.15 · 700       | Page titles, section heroes              |
| H2          | `h2`   | 36px / 2.25rem · 1.15 · 600      | 28px / 1.75rem · 1.2 · 600     | Section headings                         |
| H3          | `h3`   | 28px / 1.75rem · 1.2 · 600       | 22px / 1.375rem · 1.25 · 600   | Card / subsection titles                 |
| H4          | `h4`   | 22px / 1.375rem · 1.3 · 600      | 20px / 1.25rem · 1.3 · 600     | Stat card labels, dialog titles          |
| H5          | `h5`   | 18px / 1.125rem · 1.4 · 600      | 16px / 1rem · 1.4 · 600        | Sidebar groups, list headers             |
| H6 / overline | `h6` | 12px / 0.75rem · 1.4 · 600 · uppercase · 0.08em tracking | same | Eyebrows, section labels    |
| Body-lg     | —      | 18px / 1.125rem · 1.65 · 400     | 16px / 1rem · 1.6 · 400        | Hero subcopy, lead paragraphs            |
| Body        | `p`    | 16px / 1rem · 1.6 · 400          | 15px / 0.9375rem · 1.6 · 400   | Default body                             |
| Body-sm     | —      | 14px / 0.875rem · 1.55 · 400     | same                            | Secondary text, table cells, form hints  |
| Caption     | —      | 12px / 0.75rem · 1.45 · 400      | same                            | Metadata, timestamps, legal              |
| Stat (mono-tabular) | — | 40–56px · 1.0 · 700 · tabular-nums | 32–40px · 1.0 · 700 | Dashboard stat numbers, scores           |

### Usage guidance
- **Dashboard stat numbers** → `Stat` step, tabular-nums, `Outfit` weight 700. Unit/suffix (e.g. `%`, `/100`) drops to H4 weight 500 and dims to `--text-secondary`.
- **Card titles** → H3 desktop / H4 mobile. Never bold body text where an H-level exists.
- **Table text** → Body-sm; row headers get weight 500.
- **Buttons** → Body-sm weight 500, uppercase overline (12px, 0.08em tracking) only for icon-less ghost links in the navbar.
- **Max line-length** for long-form (resume analysis report, roadmap narrative): `max-width: 68ch`.

---

## 4. Spacing, Layout & Grid

### Base unit & scale
Base unit = **4px** (0.25rem). Scale (matches Tailwind defaults so utilities map 1:1):

| Token | px   | rem    | Tailwind |
| ----- | ---- | ------ | -------- |
| `0`   | 0    | 0      | `p-0`    |
| `0.5` | 2    | 0.125  | `p-0.5`  |
| `1`   | 4    | 0.25   | `p-1`    |
| `2`   | 8    | 0.5    | `p-2`    |
| `3`   | 12   | 0.75   | `p-3`    |
| `4`   | 16   | 1      | `p-4`    |
| `5`   | 20   | 1.25   | `p-5`    |
| `6`   | 24   | 1.5    | `p-6`    |
| `8`   | 32   | 2      | `p-8`    |
| `10`  | 40   | 2.5    | `p-10`   |
| `12`  | 48   | 3      | `p-12`   |
| `16`  | 64   | 4      | `p-16`   |
| `20`  | 80   | 5      | `p-20`   |
| `24`  | 96   | 6      | `p-24`   |

### Breakpoints & containers (Tailwind defaults, confirmed in use)

| Name     | Min width | Container max | Typical device      |
| -------- | --------- | ------------- | ------------------- |
| `sm`     | 640px     | 640px         | Large phones (landscape) |
| `md`     | 768px     | 768px         | Tablets (portrait)  |
| `lg`     | 1024px    | 1024px        | Tablets (landscape), small laptops |
| `xl`     | 1280px    | 1280px        | Laptops             |
| `2xl`    | 1536px    | 1400px        | Desktops            |

- **Marketing container:** `max-width: 1200px`, centered, `px-6 md:px-8`.
- **App/dashboard container:** full-width inside the sidebar gutter (`pl-64` at `lg+`, see `globals.css` `.dashboard-layout-main`), content max `1152px`, `px-6 lg:px-8`.
- **Form container:** `max-width: 480px` (auth, single-column forms) or `640px` (multi-step), centered.

### Grid / layout rules
- **Marketing pages:** 12-col CSS grid at `lg+`, single column on mobile. Hero is asymmetric (`lg:grid-cols-2`, copy 5 / visual 7). Feature cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `gap-6`.
- **Dashboard:** fixed **256px (16rem) sidebar** at `lg+` (matches `.sidebar-desktop`); collapses to a drawer below `lg`. Main area is a 12-col grid; stat cards use `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`, `gap-5`.
- **Forms:** single column, label-above-input, `max-w` per container above. Multi-step flows use a left-rail stepper (`lg:grid-cols-[200px_1fr]`).

### Border-radius scale

| Token        | px    | Use                                          |
| ------------ | ----- | -------------------------------------------- |
| `--radius-sm`| 8     | Inputs, small chips, tags                    |
| `--radius-md`| 12    | Buttons, list items, tooltips                |
| `--radius-lg`| 16    | Cards, dialogs body                          |
| `--radius-xl`| 20    | Hero panels, large feature cards             |
| `--radius-full` | 9999 | Pills, avatars, circular progress, icon buttons |

### Elevation / shadow scale

| Token        | Value (dark)                              | Value (light)                             | Use                                   |
| ------------ | ----------------------------------------- | ----------------------------------------- | ------------------------------------- |
| `--shadow-sm`| `0 1px 2px rgba(0,0,0,.5)`                | `0 1px 2px rgba(0,0,0,.05)`               | Inputs, sticky rows                    |
| `--shadow-md`| `0 4px 16px rgba(0,0,0,.5)`               | `0 4px 16px rgba(0,0,0,.05)`              | Cards on hover, dropdowns              |
| `--shadow-lg`| `0 12px 40px rgba(0,0,0,.6)`              | `0 12px 40px rgba(0,0,0,.08)`             | Modals, popovers, floating cards       |
| `--shadow-glow` | `0 0 60px rgba(255,255,255,.04)`       | `0 0 60px rgba(0,0,0,.02)`                | Hero accent, score reveal              |
| Glass shadow | `0 8px 32px rgba(0,0,0,.3)`               | `0 8px 32px rgba(0,0,0,.04)`              | Glassmorphic navbar / FAB              |

**Rule:** default surface = border-only (`--border`). Add shadow only on *interaction* (hover/focus/open) or for genuinely floating UI (modals, popovers, glass navbar). Never shadow static page sections.

---

## 5. Component Library Specification

All components are built on **Shadcn/UI primitives** (Radix-based) styled with the monochrome tokens, plus **custom** components where Shadcn lacks a suitable primitive (chat, code editor, score HUD, roadmap timeline). State tables below use: `●` = apply.

### 5.1 Buttons

| Variant       | `--primary` CTA | Secondary | Ghost | Destructive | Icon-only |
| ------------- | --------------- | --------- | ----- | ----------- | --------- |
| **Default**   | `--btn-solid-bg` / `--btn-solid-fg`, `radius-md`, `h-10 px-5`, `text-sm font-medium` | `--secondary`, `1px solid --border` | transparent | `--destructive` / `--destructive-foreground` | `h-10 w-10`, `radius-md` |
| **Hover**     | `--btn-solid-hover` | `--surface-200` | `--surface-100` (subtle fill) | `#dc2626` | `bg --surface-100`, icon `scale(1.08)` |
| **Active**    | `scale(0.98)`   | `scale(0.98)` | `scale(0.98)` | `scale(0.98)` | `scale(0.94)` |
| **Focus**     | `1px --white/--black ring, offset 2px` (see `*:focus-visible`) | same | same | same | same |
| **Disabled**  | `opacity-50 cursor-not-allowed` | same | same | same | same |
| **Loading**   | Spinner (Lucide `Loader2`, `animate-spin`) replaces leading icon; label kept | same | spinner only | same | spinner replaces icon |
| **Error**     | n/a | n/a | n/a | pulse `--destructive` border | n/a |

**Sizes:** `sm` (`h-8 px-3 text-xs`), `md` (default `h-10`), `lg` (`h-12 px-7 text-base`), `icon` (`h-10 w-10`). All transitions: `var(--transition-base)` (250ms ease). Extends Shadcn `Button`.

### 5.2 Form controls

| Control        | Default | Hover | Focus | Disabled | Error |
| -------------- | ------- | ----- | ----- | -------- | ----- |
| **Input / Textarea** | `bg --input-bg`, `border --border-subtle`, `radius-sm`, `h-10`, `text-sm`, placeholder `--text-muted` | `border --border` | `border --input-focus-border`, `bg --input-focus-bg`, ring `1px` | `opacity-50` | `border --destructive`, helper text `--destructive` |
| **Select** (Shadcn) | same as input; chevron `ChevronDown` (Lucide) | same | same | same | same |
| **Checkbox / Switch** | border `--border-strong`, unchecked fill transparent; checked = `--primary` + `--primary-foreground` check | border `--white/--black` | ring | `opacity-50` | — |
| **File upload (resume)** | Dashed `2px --border` dropzone, `radius-lg`, `min-h-[200px]`; center icon `UploadCloud` (Lucide, 32px, `--text-secondary`), H4 label, Body-sm hint; accepted: `.pdf,.doc,.docx`; max 5MB | `bg --surface-100`, border `--border-strong` | border `--input-focus-border` | `opacity-50` | drag-over: border `--domain-resume`, `bg rgba(resume,.06)` (matches hero resume theme) |

States common to all: focus always uses the global `*:focus-visible` ring. Extends Shadcn `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`.

### 5.3 Cards

| Card type            | Surface          | Border / shadow                  | Padding | Radius |
| -------------------- | ---------------- | -------------------------------- | ------- | ------ |
| **Base card**        | `--card`         | `1px --border`                   | `p-6`   | `--radius-lg` |
| **Stat card**        | `--card`         | `1px --border`; hover `--shadow-md` + border→`--border-strong` | `p-5` | `--radius-lg` |
| **Interview-result card** | `--card`    | `1px --border`; left accent stripe `4px` in domain color (cyan/purple/orange by source) | `p-6` | `--radius-lg` |
| **Glass card** (floating UI) | `--glass-bg` + `--glass-blur` | `1px --glass-border`; hover `--glass-border-hover` + `--glass-shadow-hover` | `p-5` | `--radius-xl` |

Stat card anatomy: H5 overline label (`--text-secondary`) → `Stat` number → Body-sm delta (`+12%` in `--success` / `−3%` in `--destructive`) with `TrendingUp`/`TrendingDown` icon.

### 5.4 Navigation

- **Top navbar (marketing + app):** `h-16`, sticky, `--nav-bg` (80% surface + `backdrop-blur(12px)`), `border-b --border`. Left: logo (gradient wordmark). Center/`md+`: nav links (Body-sm). Right: theme toggle (`ThemeToggle` component, `36×36`, icon-only ghost), "Sign in" (ghost), "Get started" (primary). Mobile: hamburger → full-screen drawer (`--surface-0`, `slide-in-right`, staggered link reveal).
- **Dashboard sidebar:** fixed `w-64`, `bg #0a0a0a` (dark) / `#fafafa` (light), `border-r --border`. Sections: brand, primary nav (icon + label, `Lucide` 18px), group label (H6 overline), user card at bottom (avatar 32px + name + `ChevronUp`). Active item: `bg --surface-100`, `border-l-2` domain-neutral (white/black) OR domain color when inside that feature. Collapses to drawer `<lg`.
- **Mobile drawer:** same content, full-height, `--surface-0`, overlay `rgba(0,0,0,.6)` + `blur(4px)`.

### 5.5 Modals, dialogs & toasts

| Component | Trigger | Anatomy | Motion |
| --------- | ------- | ------- | ------ |
| **Dialog** (Shadcn) | button | Overlay `rgba(0,0,0,.6)` + `backdrop-blur(4px)`; panel `--card`, `--radius-lg`, `max-w-md`, `p-6`; H3 title + Body-sm description + content + footer (right-aligned buttons) | overlay `fade 200ms`, panel `scale .96→1 + opacity`, `250ms ease-out` |
| **Sheet/Drawer** | button | Slides from side; same surface/radius | `slide-in` `300ms ease-out` |
| **Toast** (`Toast.tsx`) | programmatic | Bottom-right stack (`fixed bottom-6 right-6 z-[100]`), `--glass-bg` + `--glass-blur`, `--radius-md`, `min-w-[320px]`, left icon by type (`CheckCircle2` success / `XCircle` error / `Info` info), title H5 + Body-sm message | `slide-in-right + fade`, `250ms`; auto-dismiss 4s (error: 6s, persistent until dismissed) |

Toast types map to semantic colors for the leading icon only; body stays neutral.

### 5.6 Tables / data grids

- Built on TanStack Table + Shadcn `Table`.
- Header row: `bg --surface-100`, H6 overline, `--text-secondary`, `py-3 px-4`, `border-b --border`.
- Body rows: `border-b --border-subtle`, `hover:bg --surface-100`, Body-sm, `py-3 px-4`.
- Selection: leading checkbox column. Sort indicator: `ChevronUp/Down`. Pagination: footer row, `Previous`/`Next` ghost buttons + page-size select.
- Bulk actions bar appears above the table when rows selected: glass bar, destructive + secondary actions.
- Used for: interview history, admin user management.

### 5.7 Badges / tags

| Badge          | Fill                        | Text                  | Use |
| -------------- | --------------------------- | --------------------- | --- |
| **Neutral**    | `--badge-bg`                | `--text-secondary`    | Default tags (skill chips) |
| **Domain**     | `rgba(domain,.12)`          | domain color          | Source label (Resume/Interview/Roadmap) |
| **Strong area**| `rgba(success,.12)`         | `--success`           | Skill ≥ 80 |
| **Weak area**  | `rgba(destructive,.12)`     | `--destructive`       | Skill < 50 |
| **Status: pass/fail** | success/destructive solid | `--*-foreground` | Interview outcome |
| **Status: pending** | `rgba(warning,.12)`      | `--warning`           | In-progress |

All badges: `radius-full`, `px-2.5 py-0.5`, Body-sm (`text-xs`), optional leading `dot` (`6px`). Custom (extends Shadcn `Badge`).

### 5.8 Progress indicators

| Indicator | Anatomy | Use |
| --------- | ------- | --- |
| **Linear progress** | `h-2 --radius-full` track `--surface-200`, fill `--primary`; optional domain color when tied to a feature | Roadmap completion, upload progress |
| **Circular score** | `size 120–160px`, `stroke 8–12`, track `--border`, value arc `--primary` (or domain color); center: `Stat` number + `/100` caption | ATS score, interview score (reuses hero HUD dial pattern from `3d_model_specification.md`) |
| **Skill meter** | Row: H5 label left, `Stat`-sm % right; below, linear progress in domain/semantic color | Skill breakdown |
| **Stepper** | Horizontal at top of multi-step forms; numbered circles (`--radius-full`, `h-8 w-8`), connector line `--border`; complete = `--primary` fill + check; current = `--primary` ring; pending = `--surface-200` | Resume optimizer, roadmap generator |

### 5.9 Charts / graphs (performance dashboard)

Use **Recharts** styled to the monochrome system. No default chart colors — drive everything from tokens.

| Chart | Use | Style |
| ----- | --- | ---- |
| **Line** | Score-over-time | 2px stroke `--primary`; area fill `rgba(primary,.06)`; grid `--border-subtle`; axis labels Body-sm `--text-muted`; tooltip glass |
| **Bar** | Practice volume by week | bars `--surface-300`, active bar `--primary` (or domain) |
| **Radar** | Skill breakdown | single series, polygon fill `rgba(domain,.15)`, stroke domain color, 2px; spokes `--border-subtle` |
| **Donut** | Question-type distribution | segments in domain + semantic colors, center hole shows total |

Animation: chart entrance `600ms ease-out`, drawn-once only. No looping motion on data.

### 5.10 Chat interface (AI mock interview)

Custom component set (no suitable Shadcn primitive):
- **Container:** full-height column. Header: avatar + role label + timer + "End interview" (destructive). Body: scrollable message list, `px-6 py-4`, `gap-4`.
- **Message bubble (AI):** left-aligned, `bg --surface-100`, `radius-lg` (with tail corner flattened), `max-w-[80%]`, Body, leading 28px avatar.
- **Message bubble (user):** right-aligned, `bg --primary` + `--primary-foreground`, `radius-lg`, `max-w-[80%]`.
- **Typing indicator:** three dots, `--text-muted`, `bounce 1s infinite` (disabled under reduced-motion → static ellipsis).
- **Composer:** sticky bottom, `--surface` + top border, `textarea` auto-grow + send button (primary, icon `SendHorizonal`); Shift+Enter newline, Enter sends.
- **Voice mode variant:** composer replaced by a centered **mic orb** (circular `--radius-full`, `size 120px`, `--primary` ring, pulsing `--shadow-glow` while listening) + live transcript above; "Pause" / "End" buttons below.

### 5.11 Tabs, accordions, steppers

- **Tabs** (Shadcn): underline style. Trigger: Body-sm, `px-4 py-2`, `--text-secondary` default → `--foreground` active; active indicator = `2px` bar `--primary` with `layoutId` slide (Framer Motion). Pills variant for the hero console (matches existing `--tab-indicator-bg`).
- **Accordion** (Shadcn): `border-b --border`; trigger H5 + `ChevronDown` rotating `180°` on open; content Body, `py-4`.
- **Stepper**: see 5.8.

---

## 6. Page-by-Page UI Specification

### 6.1 Landing / homepage
- **Hero:** asymmetric `lg:grid-cols-2`. Left: H6 eyebrow ("AI-powered interview prep") → Display headline with `.gradient-text` → Body-lg subcopy → primary CTA ("Start free") + ghost ("Watch demo") → trust row (logos / stat chips). Right: the **3D parallax console** (`HomeBackdrop` + console from `3d_model_specification.md`) with tab switcher (Resume/Interview/Roadmap) that swaps domain colors.
- **Logos / social proof:** horizontal marquee, `opacity-60`, grayscale.
- **Feature highlights:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, glass cards, Lucide icon (domain color), H3 title, Body-sm.
- **How it works:** 3-step horizontal stepper with connecting line; each step = number circle + H4 + Body-sm.
- **Stats band:** full-width `--surface-100`, 4 stats (`Stat` numbers, H5 labels), subtle count-up on scroll-in.
- **Testimonials:** `grid-cols-1 md:grid-cols-3`, quote cards with avatar + name + role.
- **Final CTA:** centered, Display headline, primary button, faint `--shadow-glow` behind.

### 6.2 Auth (login / register / forgot / reset)
- Split screen: left brand panel (`--brand-panel-bg`, logo + tagline + 3 bullets), right form (`max-w-[400px]`, centered). Collapses to single column `<lg` (brand panel hidden).
- Form: H1 title, Body-sm subtitle, Google OAuth button (ghost, `Google` icon) with "or" divider, email + password inputs, "Forgot password?" link (right-aligned, Body-sm), primary submit (full-width), footer switch link ("Don't have an account? Sign up").
- Reset/forgot: single email input + submit; success state replaces form with check icon + confirmation text.

### 6.3 Onboarding / profile setup
- Centered `max-w-[640px]` card, top stepper (3 steps: Account → Profile → Goals).
- Step fields: target role (select), experience level (radio cards), target companies (multi-select chips), preferred interview domains.
- Footer: ghost "Back" + primary "Continue"; final step = "Finish" → routes to dashboard.

### 6.4 Resume upload & analysis results
- **Upload:** H2 + Body-lg intro, large file-upload dropzone (5.2), recent uploads list (table-lite).
- **Results:** top stat row — **ATS score circular** (left, resume-cyan arc) + 3 stat cards (keyword match, formatting, impact). Below: 2-col layout — left: skill/strength breakdown (skill meters), right: keyword gaps (chips, weak-area style) + AI recommendations (accordion). Sticky right rail "Download report" + "Generate interview" (primary).

### 6.5 Resume optimizer (multi-step)
- 3-pane: top stepper, left form sections accordion (Contact / Summary / Experience / Education / Skills), right live preview (`--surface-100` A4-ish page, `--radius-lg`, `shadow-lg`). Footer: Back / Continue / "Export DOCX/PDF" (uses `docx` + `html2pdf.js` deps). Each experience entry = repeatable card with add/remove.

### 6.6 Interview setup
- Card layout, `max-w-[640px]`: company select (searchable), role input, experience level (radio cards), interview type (chat / voice / coding) as 3 selectable cards with Lucide icons, difficulty slider, "Number of questions" stepper. Primary "Start interview" → routes to chosen mode.

### 6.7 Mock interview — chat mode
- Full-height chat layout (5.10). Top bar: company logo + role + elapsed timer + progress (`3 / 10`). Right rail (`hidden <lg`): collapsible question list + notes. On finish → confirmation dialog → evaluation screen.

### 6.8 Mock interview — voice mode
- Same shell as chat, but message area shows **live transcript** (interim text dimmed, finalized normal). Center mic orb (5.10) pulsing while AI is "speaking"/listening. Subtitles toggle. Right rail: same.

### 6.9 Coding interview module
- 3-pane IDE (responsive, see §10):
  - **Left:** problem statement (H3 title + difficulty badge + tags + Body description + examples).
  - **Center:** Monaco editor (theme-synced, see §7), language select top-right, run button.
  - **Right:** tabbed panel — Test cases (table pass/fail) / Console / **AI review** (chat-style, inline suggestions with Accept buttons).
- Top bar: timer, submit (primary), "Ask AI hint" (ghost). Bottom status bar: language + line/col.

### 6.10 Post-interview evaluation / feedback
- Hero: **overall score circular** (large, domain-colored) + verdict badge (Pass/Fail) + Body-lg summary.
- Stat row: 4 metrics (clarity, accuracy, depth, communication) as small circular scores.
- Skill radar (5.9). Strengths (green badges) / Weaknesses (red badges) two-column.
- Question-by-question breakdown: accordion, each item shows question, your answer (collapsed), AI feedback (Body), per-question score.
- Footer: "Practice similar" (secondary) + "Download report" (ghost) + "Back to dashboard" (ghost).

### 6.11 Performance dashboard
- **Top bar:** greeting + date-range select + export.
- **Stat card row** (4): total interviews, avg score, avg ATS, streak — each with delta.
- **Main grid (`lg:grid-cols-3`):** score-over-time line (col-span-2) + skill radar (col-span-1). Below: practice volume bar chart (col-span-2) + recent activity feed (col-span-1).
- **Interview history table** (5.6) below the fold.

### 6.12 Career roadmap generator & result
- **Generator:** centered card — current role, target role, timeframe (slider), "Generate" primary button; skeleton placeholders while generating.
- **Result:** vertical timeline (left rail dots + connector `--border`, roadmap-orange domain accents). Each milestone: H4 title + ETA + skill chips + linked learning resources (Body-sm links). Right rail: overall progress circular + "Regenerate" / "Export".

### 6.13 Learning recommendations
- Filter bar (domain tabs, difficulty select). Grid of resource cards (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`): type icon (video/article/course), H4 title, source, duration, "Mark complete" checkbox + progress. "Recommended for you" rail at top.

### 6.14 Notifications panel
- Right-side sheet (or dedicated page). List of items: leading icon by type, H5 title, Body-sm preview, relative timestamp, unread dot. Filter tabs (All / Unread). "Mark all read" ghost at top.

### 6.15 Admin dashboard
- Sidebar gets an **Admin** section. Tabs: Overview / Users / Interviews / Content.
- **Overview:** platform KPIs (stat cards), signups line chart, interview volume bar.
- **Users:** data table (5.6) with avatar, name, email, role, status badge, joined date, row actions (suspend/delete). Bulk actions bar.
- **Interviews monitoring:** table of sessions with user, type, score, date; row expand → full transcript drawer.
- **Content:** CRUD table for question banks with inline edit dialogs.

---

## 7. Dark Mode Specification

Dark mode is the **default** (the inline script in `layout.tsx` sets `data-theme="dark"` when no preference is stored). Light is toggled via `ThemeToggle` which flips `data-theme` on `<html>` and persists to `localStorage`.

### Rules
1. **Primary inverts.** Dark: primary = white, foreground-on-primary = black. Light: primary = black, foreground-on-primary = white. All `--btn-solid-*` tokens flip accordingly (already in `globals.css`).
2. **Surfaces step in the same direction as the theme.** Dark surfaces ascend from true black (`#000` → `#2a2a2a`); light surfaces descend from true white (`#fff` → `#a3a3a3`). Never reuse the dark ramp in light mode.
3. **Borders invert polarity.** Dark borders are white-alpha; light borders are black-alpha, at matching opacities (0.06 / 0.12 / 0.20).
4. **Semantic colors brighten in dark mode** for perceptual parity: success `#16a34a`→`#22c55e`, warning `#d97706`→`#f59e0b`, info `#0284c7`→`#38bdf8`. Destructive stays `#ef4444` (sufficient on both).
5. **Glassmorphism changes strength.** Dark: low-opacity white tints (`rgba(255,255,255,.008)`) + heavy blur (`40px`). Light: high-opacity white tints (`rgba(255,255,255,.55)`) + lighter blur (`20px`) to read as frosted glass on a bright canvas.
6. **Shadows invert weight.** Dark shadows are heavier/darker (0.5–0.6 alpha); light shadows are subtle (0.05–0.08 alpha).
7. **Domain colors shift one step** brighter in dark (see token tables) so they pop against black at identical perceptual luminance.

### Special handling
- **Charts:** Recharts reads the same tokens, so it re-themes automatically. Ensure grid lines use `--border-subtle` (alpha-based), not a fixed gray.
- **Code editor (Monaco):** define two themes — `hiremate-dark` (bg `#0a0a0a`, gutter `#111`, lineHighlight `#1a1a1a`, default text `#e5e5e5`, keyword `#a855f7`, string `#22c55e`, comment `#525252`) and `hiremate-light` (bg `#ffffff`, gutter `#f5f5f5`, lineHighlight `#fafafa`, default text `#171717`, keyword `#9333ea`, string `#16a34a`, comment `#737373`). Switch by `data-theme`.
- **3D console** already swaps domain accents per tab; ensure its backdrop dimming increases in light mode so the glow reads.
- **Selection color** (`::selection`) already flips per theme in `globals.css`.

---

## 8. Motion & Animation Guidelines

Implemented with **Framer Motion** (already a dependency). Standardized transition tokens live in `globals.css` (`--transition-fast/base/slow`).

### Standard durations & easings
| Name | Duration | Easing | Use |
| ---- | -------- | ------ | --- |
| `fast` | 150ms | `cubic-bezier(0.4,0,0.2,1)` | Hover micro-interactions, toggles |
| `base` | 250ms | `cubic-bezier(0.4,0,0.2,1)` | Default state changes, buttons |
| `slow` | 400ms | `cubic-bezier(0.4,0,0.2,1)` | Theme transitions, large surfaces |
| `entrance` | 500–600ms | `cubic-bezier(0.16,1,0.3,1)` (matches existing `fadeInUp`) | Content reveal on mount/scroll-in |
| `page` | 300ms | `cubic-bezier(0.16,1,0.3,1)` | Route transitions |

### What gets animated
- **Page transitions:** subtle fade + `y: 8 → 0`, 300ms. Applied via a root `AnimatePresence` + `motion.main`.
- **Content reveal on scroll:** `fadeInUp` variant (already defined in `page.tsx`): `opacity 0→1`, `y 25→0`, 600ms ease. Use `whileInView` with `viewport={{ once: true, margin: "-80px" }}`. Stagger children 80–100ms (existing `staggerContainer` / `cardContainerVariants`).
- **Modal/dialog entry:** overlay fade 200ms; panel `scale .96→1 + opacity`, 250ms ease-out; exit reverses with `150ms`.
- **Hover micro-interactions:** buttons `scale .98` active; icon buttons icon `scale(1.08)`; cards lift via `--shadow-md` + `y -2px` (transform only, 150ms).
- **Skeleton loading:** shimmer using `--shimmer-color` gradient sweep, `1.2s linear infinite`.
- **Score reveal:** circular score animates arc from 0 → value over 900ms with ease-out; number counts up (Framer Motion `useMotionValue` + `animate`), synced to the arc.
- **Tab indicator:** shared `layoutId` underline slides between tabs (`layout` transition, `base` duration).
- **3D console:** existing spring-damped tilt (`useSpring`) + layered `translateZ` parallax — keep as-is per `3d_model_specification.md`.

### What should NOT be animated
- Data values inside tables (no count-up on every cell).
- Text content on hover (no fading/replacement of body copy).
- Looping/ambient motion on primary content (no infinite pulses on CTAs, scores, or charts).
- Layout-affecting properties where `transform`/`opacity` suffice (avoid animating `width`/`height`/`top`).
- Theme switch (keep at `--transition-base` background/color only — no element reshuffles).

### Reduced motion
Honor `prefers-reduced-motion: reduce`: disable entrance staggers, count-ups, parallax tilt, shimmer; keep only opacity fades ≤ 150ms for state changes. Implement via Framer Motion's `useReducedMotion()` and a CSS `@media (prefers-reduced-motion: reduce)` block that neutralizes `@keyframes`.

---

## 9. Iconography & Imagery

### Icons
- **Library:** **Lucide** (`lucide-react`, already installed). Rationale: tree-shakeable, consistent 2px stroke, matches the Shadcn ecosystem, visually aligned with the monochrome/technical aesthetic.
- **Sizing:** 16px (inline/body), 18px (nav + buttons), 20px (theme toggle / feature headers), 24px (empty states), 32px (upload/empty hero). Always `stroke-width: 2` (default); 2.5 for emphasis (score checkmark). Color = `currentColor`.
- **Usage:** icons always paired with a text label in nav/buttons (icon-only buttons get `aria-label`). Never use an icon as the only cue for a destructive action.

### Imagery & illustration
- **No stock photos** of people/handshakes (dated, anti-startup). Prefer abstract geometric/3D renders (continuing the console aesthetic).
- **Empty states:** centered Lucide icon (24–32px, `--text-muted`) + H4 title + Body-sm description + a single primary or ghost CTA. No illustrations required; keep monochrome.
- **Avatars:** generated initials on `--surface-200` (rounded-full, H5) or uploaded image; fallback to `User` icon.
- **Logo:** the gradient wordmark already in the codebase (`--logo-grad-start` → `--logo-grad-end` with `--logo-check-bg` mark).

---

## 10. Responsive Behavior Rules

Baseline: **mobile-first**; the app is fully usable at 360px. Breakpoints per §4.

### Performance dashboard
- `≥ xl`: 4-col stat row, 3-col main grid (chart 2 / radar 1), sidebar visible.
- `lg`: 2-col stats, 2-col grid (chart spans 2), sidebar visible.
- `md`: 2-col stats, single-col stacked charts, sidebar → drawer.
- `< md`: 1-col everything; stat cards stack; table collapses key columns (hide "delta", keep score + date); chart legend moves below chart; radar shrinks to `min(280px, 80vw)`.

### Coding editor
- `≥ lg`: 3-pane (problem | editor | test/AI), each independently scrollable, resizable dividers.
- `md`: 2-pane — editor + tabs (problem moves into the right tab as "Problem"); or problem becomes a collapsible top sheet.
- `< md`: single pane with a **bottom tab bar** switching between *Problem / Code / Tests / AI*; editor gets `min-height: 50vh`; test cases render as stacked cards, not a table.

### Mock interview chat
- `≥ lg`: chat column + right rail (question list / notes).
- `< lg`: right rail hidden; question progress moves into the top bar as `3 / 10`; composer stays sticky bottom; message `max-w` tightens to `88%`.
- Voice mode: mic orb scales with viewport (`min(120px, 30vw)`).

### Global
- Sidebar → drawer below `lg` (matches existing `.dashboard-layout-main` media queries).
- Top navbar collapses links to hamburger below `md`.
- Tables: hide non-essential columns progressively; offer a "card view" toggle on `< md`.
- Forms: stay single-column at all sizes; only widen container.

---

## 11. Accessibility Standards

- **Keyboard navigation:** every interactive element reachable in DOM order via Tab; visible focus via the global `*:focus-visible` ring (`1px solid --white/--black`, `offset 2px`). Custom components (chat composer, code editor, score HUD) implement full keyboard support: Enter to send (chat), Monaco defaults (editor), space/enter to reveal score detail.
- **Focus order:** modal traps focus (Radix `Dialog` default); focus returns to trigger on close. Drawer/sheet same.
- **Skip links:** "Skip to content" link at top of every app page, visible on focus.
- **ARIA:**
  - Chat: `role="log"` on the message container, `aria-live="polite"` for AI messages, `aria-live="off"` for the user's own; typing indicator `aria-label="Assistant is typing"`.
  - Live scoring: score arc uses `role="img"` with `aria-label="Score: 82 out of 100"`; count-up announces final value once.
  - Tabs/accordion/dialog/toast/select use Radix's built-in ARIA; do not override roles.
  - Icon-only buttons: always `aria-label`.
- **Color contrast:** meet WCAG AA per §2.3 (≥ 4.5:1 body, ≥ 3:1 large/UI). Color is never the sole carrier of meaning — pair status colors with icons/text/badges.
- **Motion:** `prefers-reduced-motion` respected per §8.
- **Forms:** every input has an associated `<label>`; errors are announced via `aria-describedby` + `role="alert"`; required fields marked with both `*` and `aria-required`.
- **Zoom:** layout must remain usable at 200% browser zoom (no fixed `px` widths on containers; use `rem`/`%`/viewport units).
- **Language:** `<html lang="en">` (already set).

---

## 12. Frontend Folder Structure

Opinionated Next.js 16 (App Router) structure for `frontend/`. Mirrors the existing layout (`src/app/...`) and extends it to cover the full product. Shadcn components live in `src/components/ui/`; feature components in `src/features/<domain>/components/`.

```
frontend/
├── src/
│   ├── app/
│   │   ├── (marketing)/                 # Route group: public site (no sidebar)
│   │   │   ├── page.tsx                 # Landing/homepage
│   │   │   ├── features/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── layout.tsx               # Marketing shell (navbar + footer)
│   │   ├── (auth)/                      # Route group: auth (split-screen shell)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   └── layout.tsx
│   │   ├── onboarding/page.tsx
│   │   ├── (app)/                       # Route group: authenticated app (sidebar shell)
│   │   │   ├── layout.tsx               # Sidebar + topbar shell
│   │   │   ├── dashboard/page.tsx       # Performance dashboard
│   │   │   ├── resume/
│   │   │   │   ├── page.tsx             # Upload + list
│   │   │   │   ├── analyze/[id]/page.tsx
│   │   │   │   └── optimizer/page.tsx
│   │   │   ├── interview/
│   │   │   │   ├── setup/page.tsx
│   │   │   │   ├── chat/[id]/page.tsx
│   │   │   │   ├── voice/[id]/page.tsx
│   │   │   │   ├── coding/[id]/page.tsx
│   │   │   │   └── result/[id]/page.tsx
│   │   │   ├── roadmap/page.tsx         # Generator + result
│   │   │   ├── learning/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── admin/                       # Separate shell (admin sidebar)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                 # Overview
│   │   │   ├── users/page.tsx
│   │   │   ├── interviews/page.tsx
│   │   │   └── content/page.tsx
│   │   ├── api/                         # Route handlers (BFF / proxy to backend)
│   │   │   ├── auth/[...]route.ts
│   │   │   ├── resume/route.ts
│   │   │   └── interview/route.ts
│   │   ├── globals.css                  # Design tokens (see §13)
│   │   ├── layout.tsx                   # Root layout (fonts, theme script, ToastProvider)
│   │   ├── not-found.tsx
│   │   └── error.tsx
│   ├── components/
│   │   ├── ui/                          # Shadcn primitives, styled to tokens
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── label.tsx
│   │   ├── shared/                      # Cross-feature shared components
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── ThemeToggle.tsx          # (already exists)
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── MobileDrawer.tsx
│   │   │   ├── Toast.tsx                # (already exists) + toaster
│   │   │   ├── StatCard.tsx
│   │   │   ├── ScoreCircular.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── DomainBadge.tsx
│   │   │   ├── HomeBackdrop.tsx         # (already exists)
│   │   │   └── ShaderBackground.tsx     # (already exists)
│   │   └── charts/
│   │       ├── LineChart.tsx
│   │       ├── BarChart.tsx
│   │       ├── RadarChart.tsx
│   │       └── DonutChart.tsx
│   ├── features/                        # Feature-first modules
│   │   ├── resume/
│   │   │   ├── components/
│   │   │   │   ├── UploadDropzone.tsx
│   │   │   │   ├── AtsScoreHud.tsx
│   │   │   │   ├── SkillBreakdown.tsx
│   │   │   │   ├── KeywordGaps.tsx
│   │   │   │   └── OptimizerPreview.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useResumeAnalysis.ts
│   │   │   └── types.ts
│   │   ├── interview/
│   │   │   ├── components/
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatComposer.tsx
│   │   │   │   ├── TypingIndicator.tsx
│   │   │   │   ├── VoiceOrb.tsx
│   │   │   │   ├── TranscriptView.tsx
│   │   │   │   ├── InterviewTimer.tsx
│   │   │   │   ├── EvaluationSummary.tsx
│   │   │   │   └── QuestionBreakdown.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useChatInterview.ts
│   │   │   │   └── useVoiceInterview.ts
│   │   │   └── types.ts
│   │   ├── coding/
│   │   │   ├── components/
│   │   │   │   ├── CodeEditor.tsx       # Monaco wrapper
│   │   │   │   ├── ProblemPanel.tsx
│   │   │   │   ├── TestCasesPanel.tsx
│   │   │   │   └── AiReviewPanel.tsx
│   │   │   └── hooks/useCodeRunner.ts
│   │   ├── roadmap/
│   │   │   ├── components/
│   │   │   │   ├── RoadmapTimeline.tsx
│   │   │   │   └── MilestoneCard.tsx
│   │   │   └── hooks/useRoadmap.ts
│   │   └── dashboard/
│   │       └── components/
│   │           ├── StatsRow.tsx
│   │           ├── ScoreOverTime.tsx
│   │           └── RecentActivity.tsx
│   ├── hooks/
│   │   ├── useTheme.ts                  # Reads/writes data-theme + localStorage
│   │   ├── useMediaQuery.ts
│   │   ├── useReducedMotion.ts
│   │   └── useCountUp.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts               # fetch wrapper, JWT/refresh attach
│   │   │   ├── auth.ts
│   │   │   ├── resume.ts
│   │   │   ├── interview.ts
│   │   │   ├── roadmap.ts
│   │   │   └── admin.ts
│   │   ├── ai/
│   │   │   └── gemini.ts               # Gemini API client (server-only)
│   │   ├── utils.ts                    # cn(), formatters
│   │   ├── constants.ts                # domains, nav items, breakpoints
│   │   └── validations.ts              # zod schemas
│   ├── providers/
│   │   ├── ThemeProvider.tsx
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx           # React Query
│   ├── types/
│   │   ├── api.ts
│   │   ├── domain.ts                   # User, Resume, Interview, Roadmap...
│   │   └── index.ts
│   └── styles/
│       └── tokens.css                  # Optional: extracted token-only import
├── public/
│   ├── fonts/                          # Self-hosted fallbacks (optional)
│   ├── icons/
│   └── og/
├── tests/
│   ├── unit/
│   └── e2e/
├── next.config.ts
├── tailwind.config.ts                  # Minimal; v4 is CSS-first (content paths only)
├── postcss.config.mjs
├── tsconfig.json
├── components.json                     # Shadcn config
└── package.json
```

---

## 13. Design Tokens File

Drop-in for `frontend/src/app/globals.css`. This **extends** the existing file with the full token set, semantic mappings, Tailwind v4 `@theme` integration, and Shadcn-compatible variables. Tailwind v4 reads CSS variables directly, so `bg-background`, `text-foreground`, `border`, etc. resolve to the values below.

```css
@import "tailwindcss";

/* Tell Tailwind v4 to expose these CSS vars as utilities
   (e.g. --color-background → bg-background, text-background, border-background). */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-info: var(--info);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-domain-resume: var(--domain-resume);
  --color-domain-interview: var(--domain-interview);
  --color-domain-roadmap: var(--domain-roadmap);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.6);

  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Outfit', var(--font-sans);
}

/* ─── Default theme: DARK (matches layout.tsx inline script) ─── */
:root,
[data-theme="dark"] {
  /* Neutral ramp */
  --white: #ffffff;
  --gray-50: #fafafa;  --gray-100: #f5f5f5; --gray-200: #e5e5e5;
  --gray-300: #d4d4d4; --gray-400: #a3a3a3; --gray-500: #737373;
  --gray-600: #525252; --gray-700: #404040; --gray-800: #262626;
  --gray-900: #171717; --gray-950: #0a0a0a; --black: #000000;

  /* Surfaces */
  --background: #000000;
  --surface-0: #000000;
  --surface-50: #0a0a0a;
  --surface-100: #111111;
  --surface-200: #1a1a1a;
  --surface-300: #222222;
  --surface-400: #2a2a2a;
  --card: #0a0a0a;
  --card-foreground: #ffffff;
  --popover: #111111;
  --popover-foreground: #ffffff;
  --muted: #1a1a1a;
  --muted-foreground: #a3a3a3;

  /* Text */
  --foreground: #ffffff;
  --text-secondary: #a3a3a3;
  --text-muted: #525252;

  /* Borders */
  --border: rgba(255, 255, 255, 0.12);
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.20);
  --input: rgba(255, 255, 255, 0.05);
  --input-focus-border: rgba(255, 255, 255, 0.30);
  --input-focus-bg: rgba(255, 255, 255, 0.05);
  --ring: rgba(255, 255, 255, 0.65);

  /* Primary (inverted: white button, black text) */
  --primary: #ffffff;
  --primary-foreground: #000000;
  --primary-hover: #e5e5e5;
  --secondary: #1a1a1a;
  --secondary-foreground: #ffffff;
  --accent: #ffffff;
  --accent-foreground: #000000;

  /* Semantic */
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --success: #22c55e;
  --warning: #f59e0b;
  --info: #38bdf8;

  /* Domain accents */
  --domain-resume: #06b6d4;
  --domain-interview: #a855f7;
  --domain-roadmap: #f97316;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 60px rgba(255, 255, 255, 0.04);

  /* Theme-specific */
  --nav-bg: rgba(0, 0, 0, 0.8);
  --btn-solid-bg: var(--white);
  --btn-solid-fg: var(--black);
  --btn-solid-hover: var(--gray-200);
  --hero-glow: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 60%);
  --hero-grid-color: rgba(255, 255, 255, 0.015);
  --badge-bg: rgba(255, 255, 255, 0.04);
  --badge-dot: var(--white);
  --cta-border-glow: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  --logo-grad-start: #ffffff;  --logo-grad-end: #a3a3a3;
  --logo-stroke: #000000;       --logo-check-bg: #ffffff;
  --gradient-text-start: #ffffff; --gradient-text-end: #737373;
  --particle-bg: rgba(255, 255, 255, 0.15);
  --particle-bg-even: rgba(255, 255, 255, 0.08);
  --auth-content-bg: rgba(10, 10, 10, 0.7);
  --brand-panel-bg: rgba(255, 255, 255, 0.015);
  --tab-indicator-bg: rgba(255, 255, 255, 0.07);

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.008);
  --glass-bg-hover: rgba(255, 255, 255, 0.015);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-border-hover: rgba(255, 255, 255, 0.10);
  --glass-blur: blur(40px);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  --glass-shadow-hover: 0 16px 40px 0 rgba(0, 0, 0, 0.4);
  --spotlight-color: rgba(255, 255, 255, 0.03);
  --border-glow-color: rgba(255, 255, 255, 0.06);
  --shimmer-color: rgba(255, 255, 255, 0.02);
  --shimmer-color-strong: rgba(255, 255, 255, 0.04);

  /* Type */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-display: 'Outfit', var(--font-sans);

  /* Motion */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Light theme ─── */
[data-theme="light"] {
  --background: #ffffff;
  --surface-0: #ffffff;
  --surface-50: #fafafa;
  --surface-100: #f5f5f5;
  --surface-200: #e5e5e5;
  --surface-300: #d4d4d4;
  --surface-400: #a3a3a3;
  --card: #fafafa;
  --card-foreground: #000000;
  --popover: #ffffff;
  --popover-foreground: #000000;
  --muted: #f5f5f5;
  --muted-foreground: #525252;

  --foreground: #000000;
  --text-secondary: #525252;
  --text-muted: #737373;

  --border: rgba(0, 0, 0, 0.12);
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-strong: rgba(0, 0, 0, 0.20);
  --input: rgba(0, 0, 0, 0.02);
  --input-focus-border: rgba(0, 0, 0, 0.30);
  --input-focus-bg: rgba(0, 0, 0, 0.03);
  --ring: rgba(0, 0, 0, 0.55);

  /* Primary (inverted: black button, white text) */
  --primary: #000000;
  --primary-foreground: #ffffff;
  --primary-hover: #171717;
  --secondary: #f5f5f5;
  --secondary-foreground: #000000;
  --accent: #000000;
  --accent-foreground: #ffffff;

  /* Semantic — perceptually matched for light bg */
  --destructive: #ef4444;
  --destructive-foreground: #ffffff;
  --success: #16a34a;
  --warning: #d97706;
  --info: #0284c7;

  /* Domain accents — one step darker for contrast on white */
  --domain-resume: #0891b2;
  --domain-interview: #9333ea;
  --domain-roadmap: #ea580c;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.08);
  --shadow-glow: 0 0 60px rgba(0, 0, 0, 0.02);

  --nav-bg: rgba(255, 255, 255, 0.8);
  --btn-solid-bg: var(--black);
  --btn-solid-fg: var(--white);
  --btn-solid-hover: var(--gray-800);
  --hero-glow: radial-gradient(circle, rgba(0, 0, 0, 0.03) 0%, transparent 60%);
  --hero-grid-color: rgba(0, 0, 0, 0.015);
  --badge-bg: rgba(0, 0, 0, 0.04);
  --badge-dot: var(--black);
  --cta-border-glow: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent);
  --logo-grad-start: #000000;  --logo-grad-end: #525252;
  --logo-stroke: #ffffff;       --logo-check-bg: #000000;
  --gradient-text-start: #000000; --gradient-text-end: #525252;
  --particle-bg: rgba(0, 0, 0, 0.1);
  --particle-bg-even: rgba(0, 0, 0, 0.05);
  --auth-content-bg: rgba(255, 255, 255, 0.75);
  --brand-panel-bg: rgba(0, 0, 0, 0.01);
  --tab-indicator-bg: rgba(0, 0, 0, 0.04);

  --glass-bg: rgba(255, 255, 255, 0.55);
  --glass-bg-hover: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-border-hover: rgba(0, 0, 0, 0.15);
  --glass-blur: blur(20px);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.04);
  --glass-shadow-hover: 0 20px 50px 0 rgba(0, 0, 0, 0.08);
  --spotlight-color: rgba(0, 0, 0, 0.05);
  --border-glow-color: rgba(0, 0, 0, 0.12);
  --shimmer-color: rgba(255, 255, 255, 0.3);
  --shimmer-color-strong: rgba(255, 255, 255, 0.5);
}

/* ─── Base ─── */
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-sans);
  background: var(--background);
  color: var(--foreground);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  transition: background var(--transition-base), color var(--transition-base);
}

::selection { background: rgba(255, 255, 255, 0.2); color: #fff; }
[data-theme="light"] ::selection { background: rgba(0, 0, 0, 0.15); color: #000; }

::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--background); }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: var(--gray-500); }

*:focus-visible { outline: 1px solid var(--ring); outline-offset: 2px; }
a { color: inherit; text-decoration: none; }

.gradient-text {
  background: linear-gradient(135deg, var(--gradient-text-start) 0%, var(--gradient-text-end) 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> **Implementation note for Tailwind v4:** utilities like `bg-primary`, `text-muted-foreground`, `border`, `ring`, and the semantic utilities resolve through the `@theme inline` block. Domain utilities (`text-domain-resume`, `bg-domain-interview/10`, etc.) become available automatically. The existing `globals.css` keeps its component-class overrides (`.sidebar-desktop`, `.dashboard-layout-*`, `.theme-toggle`); the snippet above is a strict superset and replaces the `:root` / `[data-theme="light"]` blocks verbatim.
