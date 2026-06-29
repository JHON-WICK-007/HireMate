# HireMate AI — Resume Builder: Component Architecture Prompt

> Give this to your AI coding assistant. Your design system MD (`#080810` bg, `#7c6ee6` accent, `#10b981` success, Space Grotesk font, glassmorphism cards) handles all visual styling. This prompt covers only **what components exist, what they do, what props they accept, what state they own, and how they connect**.

---

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · shadcn/ui · @dnd-kit · react-hook-form + zod

---

## Dependencies to Install

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install zustand
npm install framer-motion
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install html2canvas jspdf
npm install docx file-saver
npm install @types/file-saver
```

shadcn components:
```bash
npx shadcn-ui@latest add dialog sheet toast select tabs switch progress popover tooltip dropdown-menu
```

---

## Route

`/app/resume-builder/page.tsx`

Full-screen wizard. No footer. No page-level scroll. Height = `100vh`, overflow hidden.

---

## Layout Architecture

**Three-column fixed layout. The center and right columns are the working area.**

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAVBAR  (56px, full width)                                          │
├──────────────┬───────────────────────────┬───────────────────────────┤
│              │                           │                           │
│  STEP        │  STEP FORM                │  LIVE PREVIEW             │
│  SIDEBAR     │  (active step only)       │  (resume preview)         │
│  72px wide   │  flex-1, overflow-y-auto  │  380px fixed              │
│              │                           │                           │
│  ①②③④⑤⑥⑦  │  [Step Heading]           │  [Resume thumbnail]       │
│              │  [Step Description]       │                           │
│              │  [Form Fields]            │  [Change Template]        │
│              │                           │                           │
│              │  [← Back]  [Continue →]   │                           │
└──────────────┴───────────────────────────┴───────────────────────────┘
```

Grid: `grid-template-columns: 72px 1fr 380px` · `grid-template-rows: 56px 1fr` · `height: 100vh`

---

## The 7 Steps

```typescript
const WIZARD_STEPS: WizardStep[] = [
  { step: 1, id: 'personal',        label: 'Contact',        icon: User },
  { step: 2, id: 'summary',         label: 'Summary',        icon: FileText },
  { step: 3, id: 'experience',      label: 'Experience',     icon: Briefcase },
  { step: 4, id: 'education',       label: 'Education',      icon: GraduationCap },
  { step: 5, id: 'skills',          label: 'Skills',         icon: Code2 },
  { step: 6, id: 'projects',        label: 'Projects',       icon: FolderGit2 },
  { step: 7, id: 'certifications',  label: 'Certifications', icon: Award },
]
```

Each step renders one `StepForm` component in the center. Only the active step is visible at a time. The step is changed by clicking the sidebar or clicking Back/Continue.

---

## Global State — Zustand Store

**File:** `/store/resumeStore.ts`

```typescript
// Resume data
interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: Record<SkillCategory, SkillEntry[]>
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
}

// Wizard + UI state
interface UIState {
  currentStep: number                    // 1–7
  stepCompletion: Record<number, number> // step → 0–100 percent
  selectedTemplate: TemplateId
  pageSize: 'A4' | 'Letter'
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  atsScore: number | null
  history: ResumeData[]                  // max 50 snapshots
  historyIndex: number
}

// Actions
interface ResumeActions {
  // Navigation
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  // Data mutations (each triggers auto-save + history snapshot)
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
  updateSummary: (value: string) => void
  addEntry: (section: ListSection) => void
  updateEntry: (section: ListSection, id: string, field: string, value: any) => void
  removeEntry: (section: ListSection, id: string) => void
  reorderEntries: (section: ListSection, from: number, to: number) => void
  addSkill: (category: SkillCategory, skill: SkillEntry) => void
  removeSkill: (category: SkillCategory, skillId: string) => void

  // Template + export
  setTemplate: (id: TemplateId) => void
  setPageSize: (size: 'A4' | 'Letter') => void

  // History
  undo: () => void
  redo: () => void

  // Misc
  triggerSave: () => void
  setAtsScore: (score: number) => void
}
```

Auto-save: debounce `triggerSave` by 1200ms on every data mutation.
History: snapshot taken before every mutation. Max 50 snapshots. `historyIndex` tracks position.
`stepCompletion` is recomputed after every mutation by `computeCompletion(step, data)`.

---

## Component Tree

```
ResumeBuilderPage                       ← /app/resume-builder/page.tsx
├── ResumeBuilderNavbar                 ← top bar, 56px, full width
├── StepSidebar                         ← left column, 72px wide
│   └── StepSidebarItem × 7            ← numbered step buttons
├── StepFormPanel                       ← center column, flex-1
│   ├── StepHeader                      ← title + description for current step
│   ├── StepFormContent                 ← renders the active step's form
│   │   ├── PersonalInfoStep            ← step 1
│   │   ├── SummaryStep                 ← step 2
│   │   ├── ExperienceStep              ← step 3
│   │   │   ├── ExperienceCard × N
│   │   │   └── AddEntryButton
│   │   ├── EducationStep               ← step 4
│   │   │   ├── EducationCard × N
│   │   │   └── AddEntryButton
│   │   ├── SkillsStep                  ← step 5
│   │   ├── ProjectsStep                ← step 6
│   │   │   ├── ProjectCard × N
│   │   │   └── AddEntryButton
│   │   └── CertificationsStep          ← step 7
│   │       ├── CertificationCard × N
│   │       └── AddEntryButton
│   └── StepNavigation                  ← Back + Continue buttons
├── LivePreviewPanel                    ← right column, 380px
│   ├── PreviewToolbar                  ← template switch + zoom
│   ├── ScaledResumePreview             ← scaled resume thumbnail
│   │   └── [ActiveTemplate]
│   └── PreviewActions                  ← "Change Template" link + zoom button
├── AIAssistantFAB                      ← floating, bottom-right of center panel
├── AIAssistantDrawer                   ← slides in over right panel (z-50)
├── AtsScoreSheet                       ← shadcn Sheet, right side
├── ExportModal                         ← shadcn Dialog
└── ShortcutsModal                      ← shadcn Dialog, triggered by "?"
```

---

## Component Specs

---

### `ResumeBuilderPage`

**File:** `page.tsx`

Responsibilities:
- Renders 3-column CSS grid (`72px 1fr 380px`)
- Mounts all top-level panels and modals
- Sets up keyboard shortcut listeners in `useEffect`
- Renders `<Toaster />` from shadcn
- Holds local state: `isAIDrawerOpen`, `isExportModalOpen`, `isAtsSheetOpen`, `isShortcutsModalOpen`

Keyboard shortcuts:
| Key | Action |
|---|---|
| `Ctrl+Z` | `store.undo()` |
| `Ctrl+Shift+Z` | `store.redo()` |
| `Ctrl+S` | `store.triggerSave()` |
| `Ctrl+E` | `setIsExportModalOpen(true)` |
| `Ctrl+/` | `setIsAIDrawerOpen(true)` |
| `Ctrl+P` | `window.print()` |
| `Esc` | close whichever drawer/modal is open |
| `?` | `setIsShortcutsModalOpen(true)` |

---

### `ResumeBuilderNavbar`

**Props:** none (reads from store)

Slot layout — left / center / right:
- **Left:** HireMate logo + "/" breadcrumb + "Resume Builder" label
- **Center:** `SaveStatusBadge`
- **Right:** `UndoRedoControls` · `AtsScoreBadge` · `ExportButton`

---

### `SaveStatusBadge`

No props. Reads `saveStatus` from store.

| State | Display |
|---|---|
| `idle` | Cloud-check icon + "Auto Save" |
| `saving` | Animated pulse dot + "Saving..." |
| `saved` | "Saved ✓" — auto-reverts to `idle` after 2s |
| `error` | "Save Failed" — persists until next successful save |

---

### `UndoRedoControls`

Two icon buttons: Lucide `Undo2` and `Redo2`.
- Undo disabled when `historyIndex === 0`
- Redo disabled when `historyIndex === history.length - 1`
- Calls `store.undo()` / `store.redo()`

---

### `AtsScoreBadge`

No props. Reads `atsScore` from store.
- `null` → label "Analyze ATS" with `ScanSearch` icon
- Set → shows `XX / 100`. Colour: red if < 50, amber if 50–74, green if ≥ 75
- Clicking sets `isAtsSheetOpen(true)` in page

---

### `ExportButton`

Primary filled button. Clicking sets `isExportModalOpen(true)`.
Uses Lucide `Download` icon.

---

## StepSidebar

### `StepSidebar`

**Props:** none. Reads `currentStep`, `stepCompletion` from store.

Narrow 72px left column. Contains only `StepSidebarItem` × 7, stacked vertically, centered.

No header label. No footer. Purely the numbered step buttons.

---

### `StepSidebarItem`

**Props:**
```typescript
{
  step: number           // 1–7
  label: string          // "Contact", "Summary", etc.
  icon: LucideIcon
  isActive: boolean      // currentStep === this step
  isComplete: boolean    // stepCompletion[step] === 100
  isReachable: boolean   // step <= currentStep (can jump back)
  onClick: () => void    // calls store.goToStep(step)
}
```

Visual anatomy (vertical stack, centered):
```
  ┌───┐
  │ ① │   ← circle with step number (or ✓ check icon when isComplete)
  └───┘
  Contact ← label below, 10px
```

States:
- **Active:** filled circle with `#7c6ee6` background, white number, label visible
- **Complete:** circle shows Lucide `Check` icon in `#10b981`, label muted
- **Reachable (past):** outlined circle, muted colour, clickable
- **Unreachable (future):** outlined circle, dimmed, `cursor-not-allowed`, not clickable

Connector line: a 1px vertical line runs between each step circle to visually chain them. Line segment above a complete step is `#10b981`. Line segment above an incomplete step is `rgba(255,255,255,0.08)`.

Clicking a reachable step calls `store.goToStep(step)`.

---

## StepFormPanel

### `StepFormPanel`

**Props:** none. Reads `currentStep` from store.

Center column. `overflow-y-auto`. Padding `32px 40px`. Contains:
1. `StepHeader` at top
2. `StepFormContent` (the active step's fields)
3. `StepNavigation` pinned to bottom

---

### `StepHeader`

**Props:**
```typescript
{
  step: number
  title: string        // e.g. "Let's review the basics"
  description: string  // e.g. "Add your contact info so employers can reach you."
}
```

Renders the step's human-readable heading and one-line description above the form.
Title: large, prominent. Description: muted, small.

Each step's title and description are defined in `sectionConfig.ts`:

| Step | Title | Description |
|---|---|---|
| 1 | Let's start with your contact info | Add your name and details so employers can reach you. |
| 2 | Write your professional summary | A 3–4 sentence overview of who you are and what you bring. |
| 3 | Add your work experience | List your most recent roles first. |
| 4 | Add your education | Include degrees, institutions, and graduation dates. |
| 5 | Add your skills | List technical and soft skills relevant to your target role. |
| 6 | Showcase your projects | Add personal or professional projects that demonstrate your skills. |
| 7 | Add your certifications | List any certificates, licenses, or credentials you hold. |

---

### `StepFormContent`

**Props:** none. Reads `currentStep` from store.

Renders only the active step component using a simple `switch(currentStep)`.

```typescript
switch (currentStep) {
  case 1: return <PersonalInfoStep />
  case 2: return <SummaryStep />
  case 3: return <ExperienceStep />
  case 4: return <EducationStep />
  case 5: return <SkillsStep />
  case 6: return <ProjectsStep />
  case 7: return <CertificationsStep />
}
```

Wrap the rendered step in a Framer Motion `AnimatePresence` with slide transition:
- Entering step slides in from right: `x: 40 → 0`, `opacity: 0 → 1`
- Exiting step slides out to left: `x: 0 → -40`, `opacity: 1 → 0`
- Duration: 220ms, ease: `easeInOut`
- Use `key={currentStep}` on the motion div to trigger re-animation on step change

---

### `StepNavigation`

**Props:** none. Reads `currentStep` from store.

Fixed to the bottom of `StepFormPanel`. Contains:
- **Left:** `← Back` ghost/text button — calls `store.prevStep()`. Hidden on step 1.
- **Right:** `Continue →` filled primary button — calls `store.nextStep()`. On step 7, label changes to `Finish & Export`.

Clicking `Finish & Export` on step 7 opens `ExportModal`.

---

## Step Components

---

### `PersonalInfoStep` (Step 1)

**Form layout:** two-column grid, with full-width rows for name and title.

Fields (in render order):
```
Row 1 (full width):  ProfilePictureUpload
Row 2 (full width):  fullName
Row 3 (full width):  professionalTitle
Row 4 (2-col):       email | phone
Row 5 (2-col):       location | (empty)
Row 6 (2-col):       linkedinUrl | githubUrl
Row 7 (full width):  portfolioUrl
```

Sub-components used:
- `ProfilePictureUpload`
- `TextInput` (for name, title, location, credentialId)
- `EmailInput` (extends TextInput, validates email format on blur, shows ✓ when valid)
- `PhoneInput` (extends TextInput, validates phone regex on blur, shows ✓ when valid)
- `UrlInput` (for LinkedIn, GitHub, portfolio — shows domain icon as input prefix)

**Validation (react-hook-form + zod):**
| Field | Rule |
|---|---|
| `fullName` | required, 2–80 chars |
| `email` | required, valid email |
| `phone` | optional, `/^\+?[\d\s\-().]{7,20}$/` if provided |
| `linkedinUrl` | optional, must contain `linkedin.com` if provided |
| `githubUrl` | optional, must contain `github.com` if provided |
| `portfolioUrl` | optional, valid URL if provided |

All values write to store via `store.updatePersonalInfo(field, value)` on change.

---

#### `ProfilePictureUpload`

No props (writes to `personalInfo.profilePicture` in store).

States:
- **Empty:** dashed-border upload zone, centered `ImagePlus` icon + "Upload photo" text + "Optional" badge
- **Uploading:** spinner overlay on zone
- **Filled:** 96px circular avatar preview. On hover: shows "Remove" overlay with `Trash2` icon
- Accepts drag-and-drop or click-to-browse. File types: `image/jpeg`, `image/png`, `image/webp`. Max size: 2MB.
- On select: converts to base64, stores in `personalInfo.profilePicture`

---

### `SummaryStep` (Step 2)

Sub-components:
- `TextareaField` — main textarea, auto-expands, min 5 rows
- `CharacterCounter` — shows `XX / 600`. Turns amber at 500, red at 580
- `AIActionBar` — row of AI buttons specific to summary

`AIActionBar` buttons for this step:
```
[✨ Generate]  [✨ Improve]  [✨ Shorten]  [✨ Expand]  [✨ Make Professional]  [✨ ATS Friendly]
```

Each button is an `AIActionButton`. On success, result is written into the textarea via `useTypewriter` hook.

All changes write to `store.updateSummary(value)`.

---

### `ExperienceStep` (Step 3)

Renders a `SortableList` of `ExperienceCard` entries + `AddEntryButton` at bottom.

If no entries exist: renders `StepEmptyState` with a "Add Experience" button.

`AddEntryButton` calls `store.addEntry('experience')` which appends a new blank `ExperienceEntry` with a generated `id` (uuid).

---

#### `ExperienceCard`

**Props:**
```typescript
{
  entry: ExperienceEntry
  onUpdate: (field: string, value: any) => void   // calls store.updateEntry
  onRemove: () => void                            // calls store.removeEntry
  onDuplicate: () => void                         // clones entry with new id
}
```

Card is collapsible. When collapsed, header shows: `[Company] — [Position] · [StartDate]–[EndDate]`.

Fields (expanded):
```
Row 1 (2-col): company | position
Row 2 (2-col): location | employmentType (Select)
Row 3 (2-col): startDate (MonthYearPicker) | endDate (MonthYearPicker)
Row 4 (full):  isCurrent checkbox — "I currently work here"
               When checked: endDate disabled, value set to "Present"
Row 5 (full):  description (BulletTextarea)
```

`employmentType` options: Full-time / Part-time / Contract / Internship / Freelance

Card header right side: shadcn `DropdownMenu` with `MoreHorizontal` icon. Menu items: Duplicate / Delete.

`AIActionBar` below description:
```
[✨ Improve Bullets]  [✨ Add Action Verbs]  [✨ Quantify Results]  [✨ Rewrite Professionally]
```

On AI rewrite: renders `BeforeAfterPanel` below description with original and new text side by side. User accepts or discards.

---

#### `BeforeAfterPanel`

**Props:**
```typescript
{
  before: string
  after: string
  onAccept: () => void    // replaces description with `after`
  onDiscard: () => void   // hides the panel
}
```

Renders two side-by-side panels: "Before" (left) and "After" (right).
Two action buttons below: `✓ Accept` and `✗ Discard`.
Animated slide-down with `AnimatePresence`. Exits on either action.

---

### `EducationStep` (Step 4)

Same pattern as `ExperienceStep`. `SortableList` of `EducationCard` + `AddEntryButton`.

---

#### `EducationCard`

**Props:** same shape as `ExperienceCard` but for `EducationEntry`.

Fields:
```
Row 1 (full):  institution
Row 2 (2-col): degree | fieldOfStudy
Row 3 (2-col): grade | location
Row 4 (2-col): startDate (MonthYearPicker) | endDate (MonthYearPicker)
Row 5 (full):  description (TextareaField, optional — hidden behind "Add description ▾" toggle link)
```

No AI action bar.

---

### `SkillsStep` (Step 5)

Sub-components:
- `SkillCategoryTabs`
- `SkillSearchInput`
- `SkillChipList`
- `AISuggestedSkills`
- `ProficiencyToggle`

**`SkillCategoryTabs`:** shadcn `Tabs`. One tab per category + "All" tab.

Categories: `All` · `Languages` · `Frontend` · `Backend` · `Database` · `Cloud` · `DevOps` · `AI/ML` · `Soft Skills`

Active tab filters which chips are shown below. "All" shows every skill across all categories.

**`SkillSearchInput`:** shadcn `Popover` + `Command` combo. Pre-loaded with top 200 tech skills from `skillsList.ts`. User types to filter. Press Enter or click item to add skill to the active category. Prevents duplicate additions.

**`SkillChipList`:** renders current skills for the active tab as chips using `SortableList`. Each chip is a `SkillChip`.

**`SkillChip`:**
```typescript
{
  label: string
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  showProficiency: boolean
  onRemove: () => void
}
```
Remove via × on right. When `showProficiency` is true, shows a coloured dot: slate / amber / purple / green.

**`AISuggestedSkills`:** appears below the chip list. Calls `/api/ai/skills` on mount with experience + projects context. Shows suggestions as dashed-border chips with `+` prefix. Clicking `+` moves skill into the active category and removes it from suggestions.

**`ProficiencyToggle`:** shadcn `Switch` labelled "Show proficiency levels". When on, `showProficiency` passed as true to all chips.

All mutations call `store.addSkill(category, skill)` or `store.removeSkill(category, skillId)`.

---

### `ProjectsStep` (Step 6)

`SortableList` of `ProjectCard` + `AddEntryButton`.
Empty state if no entries.

---

#### `ProjectCard`

**Props:** same shape as `ExperienceCard` but for `ProjectEntry`.

Fields:
```
Row 1 (full):  name
Row 2 (full):  description (TextareaField)
Row 3 (full):  technologies (ChipInput — inline tag input)
Row 4 (2-col): githubUrl (UrlInput) | liveDemoUrl (UrlInput)
Row 5 (full):  role (TextInput, optional — "e.g. Solo Developer / Team Lead")
```

`AIActionBar`:
```
[✨ Generate Description]  [✨ Improve]  [✨ ATS Optimize]
```

---

### `CertificationsStep` (Step 7)

`SortableList` of `CertificationCard` + `AddEntryButton`.
Empty state if no entries.

---

#### `CertificationCard`

**Props:** same shape as `ExperienceCard` but for `CertificationEntry`.

Fields:
```
Row 1 (full):  name
Row 2 (2-col): organization | issueDate (MonthYearPicker)
Row 3 (2-col): expiryDate (MonthYearPicker) | credentialId
Row 4 (full):  noExpiry checkbox — "This credential does not expire"
               When checked: expiryDate disabled and cleared
Row 5 (full):  credentialUrl (UrlInput)
```

No AI action bar.

---

## Shared Sub-components

All in `/components/resume-builder/shared/`

---

### `StepEmptyState`

**Props:**
```typescript
{
  icon: LucideIcon
  title: string          // e.g. "No experience added yet"
  description: string    // e.g. "Add your most recent role to get started."
  actionLabel: string    // e.g. "Add Experience"
  onAction: () => void
}
```

Centered layout: icon (40px, muted purple) + title + description + action button.

---

### `AddEntryButton`

**Props:**
```typescript
{
  label: string       // e.g. "+ Add Another Experience"
  onClick: () => void
}
```

Full-width dashed-border button. Uses Lucide `Plus` icon on left.

---

### `SortableList`

**Props:**
```typescript
{
  items: { id: string }[]
  onReorder: (from: number, to: number) => void
  renderItem: (item: any, index: number) => ReactNode
}
```

Wraps `@dnd-kit/core` `DndContext` + `@dnd-kit/sortable` `SortableContext` with `verticalListSortingStrategy`. Handles `onDragEnd`, calls `onReorder(activeIndex, overIndex)`.

---

### `SortableItem`

**Props:**
```typescript
{
  id: string
  children: ReactNode
}
```

Uses `useSortable` from `@dnd-kit/sortable`. Exposes drag handle ref via render prop or wraps children. While dragging, applies lifted shadow and slight scale.

---

### `AIActionBar`

**Props:**
```typescript
{
  buttons: {
    label: string
    action: () => Promise<string>
    onResult: (text: string) => void
  }[]
}
```

Renders a row of `AIActionButton` components. Uses `flex flex-wrap gap-2`.

---

### `AIActionButton`

**Props:**
```typescript
{
  label: string
  action: () => Promise<string>      // async call to AI API route
  onResult: (text: string) => void   // called with result to write into field
}
```

Internal state: `'idle' | 'loading' | 'success' | 'error'`

| State | Display |
|---|---|
| `idle` | `Sparkles` icon + label |
| `loading` | `Loader2` spin + "Generating..." — disabled |
| `success` | Brief colour-flash to green for 800ms, then back to idle |
| `error` | `AlertCircle` icon + "Failed — Retry" — clickable |

---

## Shared Input Components

All in `/components/resume-builder/inputs/`

---

### `TextInput`

**Props:**
```typescript
{
  label: string
  name: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  prefix?: ReactNode
  suffix?: ReactNode
  error?: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}
```

Shows error text below on blur if invalid. Shows ✓ (`CheckCircle2` icon) as suffix when valid + non-empty.

---

### `TextareaField`

**Props:**
```typescript
{
  label?: string
  name: string
  placeholder?: string
  maxLength?: number
  minRows?: number        // default: 4
  value: string
  onChange: (value: string) => void
  showCharCount?: boolean
}
```

Auto-expands: `useRef` on textarea, sets `height: 'auto'` then `height: scrollHeight` on every change.

---

### `BulletTextarea`

Extends `TextareaField`. On `Enter` keydown: inserts `\n• ` at cursor. On load if value is non-empty and does not start with `•`, prepends `• ` to the first line.

---

### `CharacterCounter`

**Props:**
```typescript
{
  current: number
  max: number
}
```

Renders `XX / max`. Colour: normal when `current < max * 0.83`, amber when `≥ 0.83`, red when `≥ 0.97`.

---

### `MonthYearPicker`

**Props:**
```typescript
{
  label: string
  value: { month: number | null; year: number | null }
  onChange: (value: { month: number | null; year: number | null }) => void
  disabled?: boolean
  placeholder?: string   // default: "Select date"
}
```

Two shadcn `Select` side-by-side. Month: 1–12 (Jan–Dec labels). Year: current year down to 1960.

---

### `UrlInput`

Extends `TextInput`. Infers the domain icon from field name:
- `linkedinUrl` → LinkedIn icon (Lucide `Linkedin`)
- `githubUrl` → Lucide `Github`
- Any other URL → Lucide `Link`

Validates URL format on blur. Shows ✓ when valid.

---

### `ChipInput`

**Props:**
```typescript
{
  label?: string
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  suggestions?: string[]
}
```

Inline tag input. Type text → press Enter or comma → adds chip. Backspace on empty input removes last chip. Chips are not draggable. No duplicates.

---

## Live Preview Panel

### `LivePreviewPanel`

**Props:** none. Reads template, page size, and full resume data from store.

Right column, 380px wide, fixed height. Contains:
1. `PreviewToolbar` — top
2. `ScaledResumePreview` — fills remaining height
3. `PreviewActions` — below preview

---

### `PreviewToolbar`

Contains:
- Page indicator: `Page X of Y` (X-of-Y computed from content height overflow)
- Zoom out button (`ZoomOut` icon)
- Zoom label: current percent
- Zoom in button (`ZoomIn` icon)
- "Fit" button: resets zoom to auto-fit

---

### `ScaledResumePreview`

**Props:** none (reads from store).

Renders the active template at A4/Letter pixel dimensions (`794px × 1123px` for A4), then applies `transform: scale(fitScale)` where `fitScale = panelWidth / 794`. The outer container clips with `overflow: hidden`.

The resume template component receives the full `ResumeData` as props and renders a white-background printable layout.

When content overflows one page height, a "Page Break" visual divider appears and Page 2 renders below. Page count is computed by measuring the rendered height and dividing by page height in pixels.

---

### `PreviewActions`

Below the preview. Contains:
- `TemplateSelector` dropdown — "Change Template" label + dropdown arrow
- `ZoomButton` — Lucide `ZoomIn` icon button, opens zoom control popover

---

### `TemplateSelector`

shadcn `DropdownMenu`. Label: "Change Template". Options:

| ID | Label |
|---|---|
| `modern` | Modern |
| `corporate` | Corporate |
| `minimal` | Minimal |
| `tech` | Tech |
| `executive` | Executive |

Selecting calls `store.setTemplate(id)`. Preview re-renders immediately.

---

### Resume Templates

Five template components in `/components/resume-builder/templates/`.

Each receives:
```typescript
interface TemplateProps {
  data: ResumeData
  pageSize: 'A4' | 'Letter'
}
```

Templates use **CSS Modules only** (not Tailwind) so their white-page styles don't collide with the app's dark theme.

| Template | Personality |
|---|---|
| `ModernTemplate` | Two-column, purple header strip, name large white on purple |
| `CorporateTemplate` | Single column, conservative, clean dividers |
| `MinimalTemplate` | Lots of white space, thin rules, no colour |
| `TechTemplate` | Dark sidebar, monospace skill badges, green accent |
| `ExecutiveTemplate` | Wide margins, elegant typographic hierarchy, serif feel |

---

## AI Assistant

### `AIAssistantFAB`

Floating action button. Positioned `absolute bottom-6 right-6` within `StepFormPanel` (not page-level).

Uses Lucide `Sparkles` icon.
Shows amber badge dot when unread suggestions exist.
Clicking sets `isAIDrawerOpen(true)` in page.

---

### `AIAssistantDrawer`

Slides in from right at `z-index: 50`. Width: 360px. Overlaps `LivePreviewPanel`.

Controlled by `isAIDrawerOpen` in `ResumeBuilderPage`.

**Structure:**
```
Header: "HireMate Assistant"  [✕]
─────────────────────────────────
Tab: [Suggestions]  [Chat]
─────────────────────────────────
(active tab content)
```

---

### `AISuggestionCard`

**Props:**
```typescript
{
  id: string
  type: 'missing' | 'weak-language' | 'ats' | 'grammar'
  message: string
  fixAction?: () => void
  onDismiss: () => void
}
```

Renders: type icon + message + optional "Fix Now →" button + × dismiss button.

---

### `AIChat`

Local state: `messages: ChatMessage[]`, `inputValue: string`, `isTyping: boolean`

`ChatMessage`: `{ role: 'user' | 'assistant', content: string, timestamp: Date }`

On send: appends user message → calls `/api/ai/chat` with full conversation history + current resume data → streams response into assistant message.

Quick prompt chips above input:
```
"What's missing?"  "How's my ATS score?"  "Suggest skills"  "Fix my summary"
```

---

## ATS Score Sheet

### `AtsScoreSheet`

shadcn `Sheet` (`side="right"`, width 480px). Controlled by `isAtsSheetOpen` in page.

Sections:
1. `AtsScoreRing` — SVG animated ring, score centre, label below
2. `AtsStrengthsList` — green `CheckCircle2` items
3. `AtsIssuesList` — red `XCircle` items
4. `AtsKeywordAnalysis` — keyword chips with `TargetRoleSelect` dropdown
5. "Auto-Fix What's Possible" button — calls `/api/ai/ats-fix`, merges result into store
6. "Copy Report" button — copies plain-text ATS summary to clipboard

`AtsScoreRing`: SVG circle. Stroke animates from 0 to score value on sheet open (1.2s spring). Stroke colour: red / amber / green based on score.

`AtsKeywordAnalysis`: has a `TargetRoleSelect` (shadcn `Select`) for target role. Changing role re-calls analysis. Present keywords = green chips. Missing keywords = red chips.

---

## Export Modal

### `ExportModal`

shadcn `Dialog`. Controlled by `isExportModalOpen` in page.

**Sections:**
1. Format cards (single-select): PDF · DOCX · Print
2. Version radio: ATS-Friendly / Styled
3. Template selector (only for PDF + DOCX)
4. Page size: A4 / Letter toggle
5. Buttons: Cancel · Download

Download states: Idle → Loading (`Loader2` + "Generating...") → Success (triggers download + closes) → Error (toast stays open).

Export logic:
- **PDF:** `html2canvas` captures the template DOM node → `jsPDF` encodes and triggers download
- **DOCX:** POST to `/api/export/docx` with `ResumeData + template + pageSize` → streams file
- **Print:** `window.print()` — only `ScaledResumePreview` has `print:block`, everything else `print:hidden`

---

## Shortcuts Modal

### `ShortcutsModal`

shadcn `Dialog`. Triggered by `?` keypress.

Two-column table of all shortcuts. No interactive elements other than close.

---

## Utility Hooks

All in `/hooks/resume-builder/`

### `useTypewriter(text: string, speed?: number): { displayed: string, isDone: boolean }`
Animates text character by character via `setInterval`. Default speed: 20ms per char. `isDone` becomes true when all characters are shown. Used by `AIActionButton` to animate AI-generated text into textareas.

### `useAutoSave(delay?: number): void`
Subscribes to store data changes. Debounces by `delay` (default 1200ms). On trigger: sets `saveStatus → 'saving'`, POSTs to `/api/resume/save`, on success sets `saveStatus → 'saved'`, then `'idle'` after 2s.

### `useAtsAnalysis(): { analyze: (targetRole?: string) => Promise<void>, isAnalyzing: boolean }`
Calls `/api/ai/ats-analyze` with full resume data + target role. On success: calls `store.setAtsScore(score)` and updates suggestion list.

### `useSectionCompletion(step: number): number`
Returns 0–100 completion for a given step. Logic lives in `computeCompletion.ts`. Called per-step; result feeds into `store.stepCompletion`.

### `useResumeHistory(): { canUndo: boolean, canRedo: boolean }`
Thin hook exposing computed booleans from `historyIndex` and `history.length`.

### `useStepValidation(step: number): { isValid: boolean, errors: Record<string, string> }`
Runs zod schema for the active step against current store data. Returns validation result without triggering form submission. Used by `StepNavigation` to optionally block Continue if required fields are empty.

---

## API Routes

All in `/app/api/`

| Route | Method | Input | Output |
|---|---|---|---|
| `/api/resume/save` | POST | `ResumeData` | `{ success: boolean }` |
| `/api/resume/load` | GET | — | `ResumeData` |
| `/api/ai/summary` | POST | `{ action: SummaryAction, currentText: string, context: ResumeContext }` | `{ result: string }` |
| `/api/ai/experience` | POST | `{ action: ExperienceAction, description: string, role: string, company: string }` | `{ result: string }` |
| `/api/ai/project` | POST | `{ action: ProjectAction, name: string, technologies: string[] }` | `{ result: string }` |
| `/api/ai/skills` | POST | `{ experience: ExperienceEntry[], projects: ProjectEntry[] }` | `{ suggestions: string[] }` |
| `/api/ai/chat` | POST | `{ messages: ChatMessage[], resumeContext: ResumeData }` | `{ reply: string }` |
| `/api/ai/ats-analyze` | POST | `ResumeData & { targetRole?: string }` | `AtsReport` |
| `/api/ai/ats-fix` | POST | `{ report: AtsReport, data: ResumeData }` | `Partial<ResumeData>` |
| `/api/export/docx` | POST | `{ data: ResumeData, template: TemplateId, pageSize: 'A4' \| 'Letter' }` | File stream |

All AI routes use model `claude-sonnet-4-6`. Max tokens: 1000.

`SummaryAction`: `'generate' | 'improve' | 'shorten' | 'expand' | 'professional' | 'ats'`
`ExperienceAction`: `'improve-bullets' | 'action-verbs' | 'quantify' | 'rewrite'`
`ProjectAction`: `'generate' | 'improve' | 'ats-optimize'`

---

## File Structure

```
/app
  /resume-builder
    page.tsx
  /api
    /resume
      save/route.ts
      load/route.ts
    /ai
      summary/route.ts
      experience/route.ts
      project/route.ts
      skills/route.ts
      chat/route.ts
      ats-analyze/route.ts
      ats-fix/route.ts
    /export
      docx/route.ts

/components
  /resume-builder
    ResumeBuilderNavbar.tsx
    StepSidebar.tsx
    StepFormPanel.tsx
    LivePreviewPanel.tsx
    AIAssistantFAB.tsx
    AIAssistantDrawer.tsx
    AtsScoreSheet.tsx
    ExportModal.tsx
    ShortcutsModal.tsx
    /steps
      PersonalInfoStep.tsx
      SummaryStep.tsx
      ExperienceStep.tsx
      EducationStep.tsx
      SkillsStep.tsx
      ProjectsStep.tsx
      CertificationsStep.tsx
    /cards
      ExperienceCard.tsx
      EducationCard.tsx
      ProjectCard.tsx
      CertificationCard.tsx
    /inputs
      TextInput.tsx
      TextareaField.tsx
      BulletTextarea.tsx
      MonthYearPicker.tsx
      UrlInput.tsx
      ChipInput.tsx
      CharacterCounter.tsx
      ProfilePictureUpload.tsx
    /shared
      StepHeader.tsx
      StepFormContent.tsx
      StepNavigation.tsx
      StepEmptyState.tsx
      AddEntryButton.tsx
      SortableList.tsx
      SortableItem.tsx
      BeforeAfterPanel.tsx
      AIActionBar.tsx
      AIActionButton.tsx
      SaveStatusBadge.tsx
      UndoRedoControls.tsx
    /sidebar
      StepSidebarItem.tsx
    /templates
      ModernTemplate.tsx
      CorporateTemplate.tsx
      MinimalTemplate.tsx
      TechTemplate.tsx
      ExecutiveTemplate.tsx
    /preview
      ScaledResumePreview.tsx
      PreviewToolbar.tsx
      PreviewActions.tsx
      TemplateSelector.tsx
    /ats
      AtsScoreRing.tsx
      AtsStrengthsList.tsx
      AtsIssuesList.tsx
      AtsKeywordAnalysis.tsx
    /ai
      AIChat.tsx
      AISuggestionCard.tsx

/hooks
  /resume-builder
    useTypewriter.ts
    useAutoSave.ts
    useAtsAnalysis.ts
    useSectionCompletion.ts
    useResumeHistory.ts
    useStepValidation.ts

/store
  resumeStore.ts

/types
  resume.ts           ← ResumeData, all Entry interfaces, TemplateId, SectionId, etc.

/lib
  /resume-builder
    sectionConfig.ts  ← WIZARD_STEPS array with step number, id, label, icon, title, description
    skillsList.ts     ← string[] of top 200 tech skills
    exportPdf.ts      ← html2canvas + jspdf helpers
    computeCompletion.ts ← (step: number, data: ResumeData) => number
```

---

*Visual styling, colours, spacing, and typography are defined in your design system MD. This file covers only component structure, props, state, behaviour, and wiring.*