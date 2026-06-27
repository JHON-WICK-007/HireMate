# Dedicated Resume Builder Page & Navbar Hover Dropdown

Create a dedicated route `/resume-builder` (under `src/app/resume-builder/page.tsx`) for the Resume Builder service. Implement a hover dropdown menu in the navbar to let users navigate directly to either the Resume Optimizer (`/resume`) or the new Resume Builder (`/resume-builder`). Refactor duplicate inline navbars to use the shared `<Navbar />` component.

## User Review Required

> [!IMPORTANT]
> - We will create a **new page** at `src/app/resume-builder/page.tsx` which will share the styles from the resume module to prevent duplicating 2400 lines of CSS.
> - The new "Resume Builder" link in the navbar dropdown will link directly to `/resume-builder`.
> - The `/resume-builder` page will be tailored for building: it will display "Resume Builder" title, updated subtext, and automatically default to the **"Resume Preview/Builder" template selection tab** once the user uploads/inputs their resume.

## Proposed Changes

### New Route & Page

#### [NEW] [page.tsx](file:///d:/HireMate/frontend/src/app/resume-builder/page.tsx)
- Create a copy of the resume page logic, but configure it for building:
  - Import CSS module from `../resume/resume.module.css`.
  - Set the default active tab to `"preview"` instead of `"analysis"`.
  - Customize UI text: Title: "Resume Builder", subtitle: "Build your resume from premium templates and export to PDF or Word", button: "Build Resume".
  - Clean up any unused optimizer-specific references if needed.

---

### Navbar Component & Styles

#### [MODIFY] [Navbar.tsx](file:///d:/HireMate/frontend/src/app/components/Navbar.tsx)
- Wrap the "Resume Optimizer" link in a `.navDropdownContainer`.
- Render a hidden absolute-positioned dropdown menu `.navDropdownMenu` that displays when the parent is hovered.
- Add sub-items in the desktop menu: "Resume Optimizer" (pointing to `/resume`) and "Resume Builder" (pointing to `/resume-builder`).
- Update the mobile menu layout to display a labeled group containing the two sub-items.

#### [MODIFY] [home.module.css](file:///d:/HireMate/frontend/src/app/home.module.css)
- Add CSS classes for dropdown hover activation, transition effects, glassmorphic styles, text formatting, and mobile spacing.

---

### Page Refactoring (DRY Cleanup)

#### [MODIFY] [page.tsx](file:///d:/HireMate/frontend/src/app/page.tsx)
- Import `<Navbar />` from `./components/Navbar`.
- Remove duplicate inline `<nav>` JSX, scroll state hook declarations, and user fetching effects.
- Render `<Navbar />`.

#### [MODIFY] [resume page](file:///d:/HireMate/frontend/src/app/resume/page.tsx)
- Import `<Navbar />` from `../components/Navbar`.
- Remove duplicate inline `<nav>` JSX, scroll state hook declarations, and user fetching effects.
- Render `<Navbar activePage="resume" />`.

#### [MODIFY] [contact page](file:///d:/HireMate/frontend/src/app/contact/page.tsx)
- Import `<Navbar />` from `../components/Navbar`.
- Remove duplicate inline `<nav>` JSX, scroll state hook declarations, and user fetching effects.
- Render `<Navbar activePage="contact" />`.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no compilation, ESLint, or TypeScript errors.

### Manual Verification
- Navigate to `/`, hover over "Resume Optimizer". Verify the dropdown displays.
- Click "Resume Builder" and verify it navigates to `/resume-builder`.
- Upload a file on `/resume-builder` and confirm that it immediately opens the "Resume Preview" builder template selector rather than the analysis diagnostics report.
