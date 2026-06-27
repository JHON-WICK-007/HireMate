# HireMate AI — Resume Builder: Component Architecture Prompt

> Give this to your AI coding assistant. Your design system MD handles all visual styling. This prompt covers only **what components exist, what they do, what props they accept, what state they own, and how they connect**.

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

Full-screen workspace. No footer. No page-level scroll. Height = `100vh`, overflow hidden. Each panel scrolls independently.

---

## Global State — Zustand Store

**File:** `/store/resumeStore.ts`

```typescript
// Data shape
interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: Record<SkillCategory, SkillEntry[]>
  projects: ProjectEntry[]
  certifications: CertificationEntry[]
  languages: LanguageEntry[]
  achievements: string[]
  interests: string[]
  references: ReferenceEntry[]
}

// UI state
interface UIState {
  activeSection: SectionId
  collapsedSections: Set<SectionId>
  visibleSections: SectionId[]          // which optional sections are toggled on
  selectedTemplate: TemplateId
  zoom: number                           // 50 | 75 | 100 | 125 | 150
  pageSize: 'A4' | 'Letter'
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  atsScore: number | null
  history: ResumeData[]                  // max 50 snapshots
  historyIndex: number
}

// Actions
interface ResumeActions {
  updatePersonalInfo: (field: keyof PersonalInfo, value: string) => void
  updateSummary: (value: string) => void
  addEntry: (section: ListSection) => void
  updateEntry: (section: ListSection, id: string, field: string, value: any) => void
  removeEntry: (section: ListSection, id: string) => void
  reorderEntries: (section: ListSection, from: number, to: number) => void
  addSkill: (category: SkillCategory, skill: SkillEntry) => void
  removeSkill: (category: SkillCategory, skillId: string) => void
  toggleSection: (id: SectionId) => void        // collapse/expand
  toggleSectionVisible: (id: SectionId) => void  // show/hide optional
  setActiveSection: (id: SectionId) => void
  setTemplate: (id: TemplateId) => void
  setZoom: (value: number) => void
  setPageSize: (size: 'A4' | 'Letter') => void
  undo: () => void
  redo: () => void
  triggerSave: () => void
  setAtsScore: (score: number) => void
}
```

Auto-save: debounce `triggerSave` by 1200ms on every data mutation. History snapshot taken on every mutation before applying change.

---

## Section ID Enum

```typescript
type SectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements'
  | 'interests'
  | 'references'
```

Core sections (always visible): `personal`, `summary`, `experience`, `education`, `skills`, `projects`, `certifications`

Optional sections (toggled via sidebar): `languages`, `achievements`, `interests`, `references`

---

## Component Tree

```
ResumeBuilderPage                      ← /app/resume-builder/page.tsx
├── ResumeBuilderNavbar                ← top bar, 56px
├── SectionSidebar                     ← left, 260px fixed
│   ├── SidebarHeader
│   │   └── AddSectionPopover          ← optional section toggles
│   ├── SectionNavList
│   │   └── SectionNavItem × N
│   └── SidebarFooter
│       ├── ProgressRing
│       └── AtsMiniBar
├── BuilderForm                        ← center, flex-1, overflow-y-auto
│   ├── PersonalInfoSection
│   ├── SummarySection
│   ├── ExperienceSection
│   │   ├── SortableList
│   │   │   └── ExperienceCard × N
│   │   └── AddEntryButton
│   ├── EducationSection
│   │   ├── SortableList
│   │   │   └── EducationCard × N
│   │   └── AddEntryButton
│   ├── SkillsSection
│   ├── ProjectsSection
│   │   ├── SortableList
│   │   │   └── ProjectCard × N
│   │   └── AddEntryButton
│   ├── CertificationsSection
│   │   ├── SortableList
│   │   │   └── CertificationCard × N
│   │   └── AddEntryButton
│   ├── LanguagesSection               ← only if toggled visible
│   ├── AchievementsSection            ← only if toggled visible
│   ├── InterestsSection               ← only if toggled visible
│   └── ReferencesSection              ← only if toggled visible
├── LivePreviewPanel                   ← right, 420px fixed
│   ├── PreviewToolbar
│   └── ScaledResumePreview
│       └── [ActiveTemplate]           ← swapped by template selection
├── AIAssistantFAB                     ← floating button, center panel
├── AIAssistantDrawer                  ← slides in from right (z-50)
├── AtsScoreSheet                      ← shadcn Sheet, right side
└── ExportModal                        ← shadcn Dialog
```

---

## Component Specs

---

### `ResumeBuilderPage`

**File:** `page.tsx`

Responsibilities:
- Renders 3-column CSS grid layout
- Mounts all top-level panels
- Sets up keyboard shortcut listeners (`useEffect` on mount)
- Renders `<Toaster />` from shadcn

Keyboard shortcuts wired here:
| Key | Action |
|---|---|
| `Ctrl+Z` | `store.undo()` |
| `Ctrl+Shift+Z` | `store.redo()` |
| `Ctrl+S` | `store.triggerSave()` |
| `Ctrl+E` | open export modal |
| `Ctrl+/` | open AI drawer |
| `Ctrl+P` | `window.print()` |
| `Esc` | close active drawer/modal |
| `?` | open keyboard shortcuts modal |

---

### `ResumeBuilderNavbar`

**Props:** none (reads from store)

Contains:
- Left: HireMate logo + "Resume Builder" breadcrumb label
- Center: `SaveStatusBadge`
- Right (in order): `UndoRedoControls` · `AtsScoreBadge` · `ExportButton`

---

### `SaveStatusBadge`

Reads `saveStatus` from store.

States:
- `idle` → "Auto Save" with a static cloud-check icon
- `saving` → "Saving..." with animated pulse dot
- `saved` → "Saved ✓" — shows for 2s then reverts to idle
- `error` → "Save Failed" — stays until next successful save

No props. Purely reactive to store.

---

### `UndoRedoControls`

Two icon buttons: Undo (`Undo2`), Redo (`Redo2`).

- Undo disabled when `historyIndex === 0`
- Redo disabled when `historyIndex === history.length - 1`
- Each calls `store.undo()` / `store.redo()`

---

### `AtsScoreBadge`

Reads `atsScore` from store.

- If `null`: shows "Analyze ATS" label
- If set: shows score as `XX / 100`, colour determined by value (< 50 / 50–74 / ≥ 75)
- Clicking opens `AtsScoreSheet`

---

### `ExportButton`

Primary filled button. Clicking opens `ExportModal`.

---

### `SectionSidebar`

**Props:** none

Reads from store: `activeSection`, `collapsedSections`, `visibleSections`, resume data (to compute per-section completion)

Contains:
1. `SidebarHeader` — title + `AddSectionPopover`
2. `SectionNavList` — list of `SectionNavItem`
3. `SidebarFooter` — progress ring + ATS mini bar

---

### `AddSectionPopover`

Uses shadcn `Popover`.

Renders a list of optional sections (`languages`, `achievements`, `interests`, `references`) each with a shadcn `Switch`. Toggling calls `store.toggleSectionVisible(id)`.

---

### `SectionNavItem`

**Props:**
```typescript
{
  id: SectionId
  label: string
  icon: LucideIcon
  completionPercent: number   // 0–100, computed from section data
  isActive: boolean
  isComplete: boolean
  hasErrors: boolean
}
```

Clicking calls `store.setActiveSection(id)` and scrolls the center panel to the matching section anchor.

Completion percent computed by a utility function `computeSectionCompletion(sectionId, resumeData): number`.

---

### `ProgressRing`

**Props:**
```typescript
{
  percent: number   // 0–100, overall resume completeness
}
```

SVG circle. Animated with Framer Motion `animate` on `strokeDashoffset`. Computed as average of all visible sections' completion percents.

---

### `AtsMiniBar`

**Props:**
```typescript
{
  score: number | null
}
```

Thin progress bar below the ring. Gradient fill from left (red) to right (green). Animates on score change. Shows `null` state as grey bar with "Not analyzed yet" label.

---

### `BuilderForm`

**Props:** none

Container with `overflow-y-auto`, `scroll-behavior: smooth`. Each child section has an `id` attribute matching its `SectionId` for scroll anchoring.

Renders each visible section in order. Section order is fixed (not user-reorderable at the section level, only entries within sections).

Wraps the whole thing in a `DndContext` from `@dnd-kit/core` to handle all drag-and-drop across sortable lists.

---

### `SectionCard` (base wrapper, used by every section)

**Props:**
```typescript
{
  id: SectionId
  title: string
  icon: LucideIcon
  isCollapsed: boolean
  onToggleCollapse: () => void
  children: ReactNode
  isEmpty: boolean
}
```

When `isEmpty === true`, renders `SectionEmptyState` instead of `children`.

Header always visible. Children hidden/shown with Framer Motion `AnimatePresence` + height animation.

Drag handle (Lucide `GripVertical`) on header right — this is for future section reordering, currently just visual.

---

### `SectionEmptyState`

**Props:**
```typescript
{
  icon: LucideIcon
  sectionLabel: string
  onAdd: () => void
}
```

Centered empty state with icon, label, and add button.

---

### `AddEntryButton`

**Props:**
```typescript
{
  label: string       // e.g. "Add Experience"
  onClick: () => void
}
```

Full-width dashed button. Uses Lucide `Plus` icon. One per list-based section.

---

### `SortableList`

**Props:**
```typescript
{
  items: { id: string }[]
  onReorder: (from: number, to: number) => void
  children: ReactNode
}
```

Wraps `@dnd-kit/sortable` `SortableContext`. Uses `verticalListSortingStrategy`. Handles `onDragEnd` and calls `onReorder`.

---

### `SortableItem`

**Props:**
```typescript
{
  id: string
  children: ReactNode
}
```

Uses `useSortable` hook from `@dnd-kit/sortable`. Exposes drag handle via context or slot pattern.

---

## Section Components

---

### `PersonalInfoSection`

**Form fields** (all use `react-hook-form`, registered to the `personalInfo` sub-object in the store):

| Field | Type | Validation |
|---|---|---|
| `fullName` | text input | required, 2–80 chars |
| `professionalTitle` | text input | optional, max 100 chars |
| `email` | email input | required, valid email format |
| `phone` | tel input | optional, matches phone regex |
| `location` | text input | optional |
| `linkedinUrl` | url input | optional, must contain `linkedin.com` |
| `githubUrl` | url input | optional, must contain `github.com` |
| `portfolioUrl` | url input | optional, valid URL |
| `profilePicture` | file upload | optional, image only |

Sub-components used:
- `TextInput` (shared)
- `UrlInput` (shared, shows icon prefix inside input)
- `ProfilePictureUpload` (custom, drag-and-drop zone)

`ProfilePictureUpload` component:
- Accepts drag-and-drop or click-to-browse
- On image select: renders 80px circular preview
- Shows "Remove" button on hover over preview
- Stores as base64 string in store

---

### `SummarySection`

Sub-components:
- `TextareaField` — auto-resizing textarea (min height 120px), tracks character count
- `CharacterCounter` — shows `XX / 600`, changes colour as limit approaches
- `AIActionBar` — row of AI action buttons

`AIActionBar` for summary contains these buttons:
```
Generate | Improve | Shorten | Expand | Make Professional | ATS Friendly
```

Each button is an `AIActionButton` (shared component — see below).

When any AI action succeeds, text is written into the textarea using a `useTypewriter` hook.

---

### `ExperienceSection`

Renders a `SortableList` of `ExperienceCard` + `AddEntryButton`.

---

### `ExperienceCard`

**Props:**
```typescript
{
  entry: ExperienceEntry
  index: number
  onUpdate: (field: string, value: any) => void
  onRemove: () => void
  onDuplicate: () => void
}
```

Fields:
| Field | Type |
|---|---|
| `company` | TextInput |
| `position` | TextInput |
| `location` | TextInput |
| `employmentType` | Select (Full-time / Part-time / Contract / Internship / Freelance) |
| `startDate` | MonthYearPicker |
| `endDate` | MonthYearPicker or "Present" |
| `isCurrent` | Checkbox — when checked, disables `endDate` and sets it to "Present" |
| `description` | BulletTextarea |

Sub-components:
- `MonthYearPicker` — two selects (month dropdown + year dropdown), no calendar UI
- `BulletTextarea` — textarea that auto-prefixes `•` on new lines
- `BeforeAfterPanel` — conditionally rendered after AI rewrite (see below)

Card header (collapsible):
- Shows `[Company] — [Position]` when collapsed
- Shows full form when expanded
- Three-dot menu (shadcn `DropdownMenu`): Edit / Duplicate / Delete

`AIActionBar` for experience:
```
Improve Bullets | Add Action Verbs | Quantify Results | Rewrite Professionally
```

`BeforeAfterPanel`:
- Only visible after an AI rewrite action
- Shows original text (left) and AI-generated text (right)
- Two buttons: `Accept` (replaces textarea content) and `Discard` (hides panel)
- Animated slide-down with `AnimatePresence`

---

### `EducationCard`

Same structure as `ExperienceCard` without `employmentType`, `isCurrent`.

Fields:
| Field | Type |
|---|---|
| `institution` | TextInput |
| `degree` | TextInput |
| `fieldOfStudy` | TextInput |
| `grade` | TextInput (e.g. "8.5 / 10") |
| `location` | TextInput |
| `startDate` | MonthYearPicker |
| `endDate` | MonthYearPicker |
| `description` | TextareaField (optional, hidden behind "Add description +" link) |

No AI action bar.

---

### `SkillsSection`

Sub-components:
- `SkillCategoryTabs` — shadcn `Tabs` with one tab per category + "All" tab
- `SkillSearchInput` — autocomplete input with pre-loaded skill list
- `SkillChipList` — renders draggable chips via `SortableList`
- `SkillChip` — individual chip with remove button
- `AISuggestedSkills` — panel of suggested skill chips based on experience entries
- `ProficiencyToggle` — shadcn `Switch` to show/hide proficiency dots on chips

`SkillSearchInput`:
- Uses `Combobox` pattern (shadcn `Popover` + `Command`)
- Pre-loaded with top 200 tech skills
- Filters as user types
- `Enter` or click adds the skill to the active category
- Prevents duplicates

`AISuggestedSkills`:
- Calls `/api/ai/skills` with experience and projects data
- Returns array of suggested skill strings
- Renders as dashed-border chips
- `+` prefix on each: clicking adds to skills, removes from suggestions

---

### `ProjectCard`

Fields:
| Field | Type |
|---|---|
| `name` | TextInput |
| `description` | TextareaField |
| `technologies` | ChipInput (inline tag input) |
| `githubUrl` | UrlInput |
| `liveDemoUrl` | UrlInput |
| `role` | TextInput (optional) |

`AIActionBar`:
```
Generate Description | Improve | ATS Optimize
```

---

### `CertificationCard`

Fields:
| Field | Type |
|---|---|
| `name` | TextInput |
| `organization` | TextInput |
| `issueDate` | MonthYearPicker |
| `expiryDate` | MonthYearPicker (disabled if `noExpiry` checked) |
| `noExpiry` | Checkbox |
| `credentialId` | TextInput |
| `credentialUrl` | UrlInput |

---

### `LanguagesSection`

Simple list. Each entry: `language` (TextInput) + `proficiency` (Select: Native / Fluent / Conversational / Basic).

No drag-and-drop. `AddEntryButton` at bottom.

---

### `AchievementsSection`

Single-line bullet list. Each entry is a `TextInput` with a drag handle and remove button. `AddEntryButton` adds a new entry.

`AIActionButton`: "Make Impactful" per entry.

---

### `InterestsSection`

Chip-based input (same as `SkillsSection` but single category, no proficiency). No AI actions.

---

### `ReferencesSection`

Fields per entry: `name`, `title`, `company`, `email`, `phone`, `relationship`.

No AI actions. Available on request only.

---

## Shared Input Components

All live in `/components/resume-builder/inputs/`.

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
  prefix?: ReactNode     // icon prefix inside input
  error?: string
  hint?: string
  value: string
  onChange: (value: string) => void
}
```

Validation runs `onBlur`. Shows error text below. Shows ✓ icon on right when valid and non-empty.

---

### `TextareaField`

**Props:**
```typescript
{
  label?: string
  name: string
  placeholder?: string
  maxLength?: number
  minRows?: number
  value: string
  onChange: (value: string) => void
  showCharCount?: boolean
}
```

Uses `useRef` on the textarea and sets `height: auto` then `height: scrollHeight` on every change (auto-expand pattern).

---

### `BulletTextarea`

Extends `TextareaField`. On `Enter`, automatically inserts `• ` at the start of the new line. On `Backspace` at the start of a bullet line, removes the bullet prefix.

---

### `MonthYearPicker`

**Props:**
```typescript
{
  label: string
  value: { month: number | null; year: number | null }
  onChange: (value: { month: number | null; year: number | null }) => void
  disabled?: boolean
}
```

Two shadcn `Select` components side-by-side. Month: Jan–Dec. Year: current year down to 1970.

---

### `UrlInput`

Extends `TextInput`. Shows a domain-specific icon as `prefix` (LinkedIn, GitHub, or generic link icon based on the field name). Validates URL format on blur.

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

Inline tag input. Type text → press Enter or comma → adds chip. Chips are removable. No drag-and-drop (for project tech stack use).

---

### `AIActionButton`

**Props:**
```typescript
{
  label: string
  action: () => Promise<string>     // returns AI-generated text
  onResult: (text: string) => void  // called with result to populate field
  variant?: 'inline' | 'bar'
}
```

Internal states: `idle` | `loading` | `success` | `error`

- `idle`: normal appearance
- `loading`: shows `Loader2` spinner + "Generating..." label, disabled
- `success`: brief colour flash for 800ms, then back to idle
- `error`: shows `AlertCircle` icon + "Failed" label, clickable to retry

The `action` prop is an async function provided by each section that calls the appropriate API route.

---

## Live Preview Panel

---

### `LivePreviewPanel`

**Props:** none (reads from store)

Contains:
1. `PreviewToolbar` at top
2. `ScaledResumePreview` filling remaining height

---

### `PreviewToolbar`

Contains:
- Page indicator: `Page X of Y` (computed from preview content height)
- Zoom controls: Minus button · `ZoomSelect` dropdown (50% / 75% / 100% / 125% / 150%) · Plus button · "Fit" button
- `TemplateSelector` dropdown
- `PageSizeToggle`: A4 / Letter toggle

---

### `TemplateSelector`

shadcn `DropdownMenu`. Options:

| ID | Label |
|---|---|
| `modern` | Modern |
| `corporate` | Corporate |
| `minimal` | Minimal |
| `tech` | Tech |
| `executive` | Executive |

Selecting calls `store.setTemplate(id)`. Preview re-renders instantly.

---

### `ScaledResumePreview`

**Props:** none (reads from store)

Renders the active template inside a `transform: scale()` wrapper. Scale value derived from `zoom` state and panel width.

Uses CSS `transform-origin: top center`.

The resume HTML is rendered at actual A4/Letter pixel dimensions, then scaled down to fit the panel.

Page break is a visual `<div>` with a dashed top border + "Page 2" label inserted when content height exceeds one page.

---

### Resume Templates

Five template components, all in `/components/resume-builder/templates/`:

Each receives the full `ResumeData` object as props and renders a static HTML resume layout.

```typescript
interface TemplateProps {
  data: ResumeData
  pageSize: 'A4' | 'Letter'
}
```

Templates:
- `ModernTemplate` — two-column, purple header strip
- `CorporateTemplate` — single column, conservative serif-style
- `MinimalTemplate` — clean, lots of white space, thin dividers
- `TechTemplate` — monospace accent, dark sidebar, skill badges
- `ExecutiveTemplate` — wide margins, elegant typographic hierarchy

All templates use their own internal CSS (not Tailwind) scoped via CSS modules so they don't conflict with the app's dark theme. The resume must look like a printable document regardless of the app theme.

---

## AI Assistant

---

### `AIAssistantFAB`

Floating action button fixed to bottom-right of the center panel (not the page).

Uses Lucide `Sparkles` icon.

Shows a count badge (amber dot) when there are unread suggestions.

Clicking toggles the `AIAssistantDrawer` open/closed.

---

### `AIAssistantDrawer`

Slides in from right at `z-index: 50`. Width: 360px. Overlaps the preview panel on desktop.

Controlled by local state in `ResumeBuilderPage`: `isAIDrawerOpen`.

Sections inside:
1. **Header** — "HireMate Assistant" title + close button
2. **Suggestions tab** — list of `AISuggestionCard`
3. **Chat tab** — `AIChat`

Tab switcher: simple two-tab toggle at top of drawer content.

---

### `AISuggestionCard`

**Props:**
```typescript
{
  id: string
  type: 'missing' | 'weak-language' | 'ats' | 'grammar'
  message: string
  fixAction?: () => void     // if a one-click fix exists
  onDismiss: () => void
}
```

Shows type icon, message text, optional "Fix Now →" button, and dismiss × button.

---

### `AIChat`

Local state: `messages: ChatMessage[]`, `inputValue: string`, `isTyping: boolean`

`ChatMessage` shape: `{ role: 'user' | 'assistant', content: string, timestamp: Date }`

On send: appends user message, calls `/api/ai/chat` with full conversation history + current resume context, streams response into assistant message.

Quick prompt chips pre-rendered above input:
```
What's missing? | How's my ATS score? | Suggest skills for Frontend Dev | Fix my summary
```

Clicking a chip sends it as a message.

---

## ATS Score Sheet

### `AtsScoreSheet`

Uses shadcn `Sheet` (side="right"), width 480px.

Triggered by `AtsScoreBadge` click.

Sections inside:
1. `AtsScoreRing` — SVG animated ring + score + label
2. `AtsStrengthsList` — green checkmarks
3. `AtsIssuesList` — red ✗ items
4. `AtsKeywordAnalysis` — keyword presence checker
5. "Auto-Fix" button — calls `/api/ai/ats-fix`, applies fixes to store
6. "Copy Report" button — copies plain text summary to clipboard

`AtsKeywordAnalysis`:
- Has a `TargetRoleSelect` dropdown (shadcn `Select`) — changing role re-runs keyword check
- Shows present keywords as green chips, missing as red chips

---

## Export Modal

### `ExportModal`

Uses shadcn `Dialog`.

Controlled by local state in `ResumeBuilderPage`: `isExportModalOpen`.

Sections:
1. **Format selector** — three cards: PDF / DOCX / Print. Single-select. Default: PDF.
2. **Version selector** — two radio options: ATS-Friendly / Styled
3. **Template selector** — only visible when format = PDF or DOCX
4. **Page size** — A4 / Letter toggle
5. **Action buttons** — Cancel + Download

Download button states:
- Idle: "Download"
- Loading: `Loader2` + "Generating..." — disabled
- Success: triggers file download, closes modal
- Error: shows error toast, stays open

Export handlers:
- PDF: uses `html2canvas` on the template DOM node → `jsPDF` to encode
- DOCX: calls `/api/export/docx` with resume data → streams file download
- Print: `window.print()` with print-only CSS that shows only the template

---

## Keyboard Shortcuts Modal

### `ShortcutsModal`

Uses shadcn `Dialog`. Triggered by pressing `?`.

Renders a two-column table of all keyboard shortcuts. No interactive elements other than close button.

---

## Utility Hooks

All in `/hooks/resume-builder/`:

### `useTypewriter(text: string, speed?: number): string`
Animates text character by character. Returns the current visible string. Used when AI writes content into fields.

### `useAutoSave(data: ResumeData, delay?: number): void`
Debounces a POST to `/api/resume/save`. Updates store's `saveStatus`.

### `useAtsAnalysis(): { analyze: () => Promise<void>, isAnalyzing: boolean }`
Calls `/api/ai/ats-analyze` with full resume data. Updates store's `atsScore` and the suggestions list.

### `useSectionCompletion(sectionId: SectionId): number`
Computes 0–100 completion percentage for a given section based on required field fill rate.

### `useResumeHistory()`
Thin hook over the store's `history`, `historyIndex`, `undo`, `redo`. Exposes `canUndo` and `canRedo` booleans.

---

## API Routes

All in `/app/api/resume-builder/`:

| Route | Method | Purpose | Input | Output |
|---|---|---|---|---|
| `/api/resume/save` | POST | Save resume to DB | `ResumeData` | `{ success: boolean }` |
| `/api/resume/load` | GET | Load saved resume | — | `ResumeData` |
| `/api/ai/summary` | POST | Generate/improve summary | `{ action, currentText, context }` | `{ result: string }` |
| `/api/ai/experience` | POST | Improve bullets | `{ action, description, role, company }` | `{ result: string }` |
| `/api/ai/project` | POST | Generate project description | `{ action, name, technologies }` | `{ result: string }` |
| `/api/ai/skills` | POST | Suggest skills | `{ experience, projects }` | `{ suggestions: string[] }` |
| `/api/ai/chat` | POST | AI assistant chat | `{ messages, resumeContext }` | `{ reply: string }` |
| `/api/ai/ats-analyze` | POST | Run ATS analysis | `ResumeData + targetRole` | `AtsReport` |
| `/api/ai/ats-fix` | POST | Apply auto-fixes | `AtsReport + ResumeData` | `Partial<ResumeData>` |
| `/api/export/docx` | POST | Generate DOCX | `ResumeData + template + pageSize` | File stream |

All AI routes use `claude-sonnet-4-6`. Max tokens: 1000 per call.

---

## File Structure

```
/app
  /resume-builder
    page.tsx

/components
  /resume-builder
    ResumeBuilderNavbar.tsx
    SectionSidebar.tsx
    BuilderForm.tsx
    LivePreviewPanel.tsx
    AIAssistantFAB.tsx
    AIAssistantDrawer.tsx
    AtsScoreSheet.tsx
    ExportModal.tsx
    ShortcutsModal.tsx
    /sections
      PersonalInfoSection.tsx
      SummarySection.tsx
      ExperienceSection.tsx
      EducationSection.tsx
      SkillsSection.tsx
      ProjectsSection.tsx
      CertificationsSection.tsx
      LanguagesSection.tsx
      AchievementsSection.tsx
      InterestsSection.tsx
      ReferencesSection.tsx
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
      AIActionButton.tsx
    /shared
      SectionCard.tsx
      SectionEmptyState.tsx
      AddEntryButton.tsx
      SortableList.tsx
      SortableItem.tsx
      BeforeAfterPanel.tsx
      AIActionBar.tsx
    /templates
      ModernTemplate.tsx
      CorporateTemplate.tsx
      MinimalTemplate.tsx
      TechTemplate.tsx
      ExecutiveTemplate.tsx
    /preview
      ScaledResumePreview.tsx
      PreviewToolbar.tsx
      TemplateSelector.tsx
    /sidebar
      SectionNavItem.tsx
      AddSectionPopover.tsx
      ProgressRing.tsx
      AtsMiniBar.tsx
    /ats
      AtsScoreRing.tsx
      AtsStrengthsList.tsx
      AtsIssuesList.tsx
      AtsKeywordAnalysis.tsx
    /ai
      AIChat.tsx
      AISuggestionCard.tsx
      SaveStatusBadge.tsx
      UndoRedoControls.tsx

/hooks
  /resume-builder
    useTypewriter.ts
    useAutoSave.ts
    useAtsAnalysis.ts
    useSectionCompletion.ts
    useResumeHistory.ts

/store
  resumeStore.ts

/types
  resume.ts      ← all TypeScript interfaces for ResumeData, entries, etc.

/lib
  /resume-builder
    sectionConfig.ts     ← section metadata (id, label, icon, required fields)
    skillsList.ts        ← pre-loaded top 200 tech skills
    exportPdf.ts         ← html2canvas + jspdf logic
    computeCompletion.ts ← per-section completion calculation
```

---

*Visual styling, colours, spacing, and typography are in your design system MD. This prompt covers only component structure, props, state, and behaviour.*
