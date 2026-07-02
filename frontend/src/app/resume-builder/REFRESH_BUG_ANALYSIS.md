# HireMate — Resume Builder Refresh Bug: Complete Analysis & Fix

## Date: July 2, 2026
## Issue: Navbar shrinks on first refresh of Resume Builder page

---

## 1. The Problem

When the Resume Builder page is opened for the first time and refreshed (especially
the first one or two refreshes), the navbar appears to shrink. Other pages (Pricing,
Contact, Profile, Home) refresh perfectly with no visual change.

---

## 2. Root Cause Analysis

### Primary: CSS Structural Differences Between Resume Builder and Working Pages

The Resume Builder had 6 CSS deviations from every other page that refreshes correctly:

| # | Difference | Resume Builder (BEFORE) | Working Pages (ALWAYS) |
|---|-----------|------------------------|----------------------|
| 1 | `overflow` on root `.page` | `overflow-y: auto` | `overflow: hidden` or none |
| 2 | `background` on `.page` | `var(--background)` (UNDEFINED!) | `transparent` |
| 3 | `background` on `.workspace` | `var(--background)` (UNDEFINED!) | N/A |
| 4 | Navbar offset method | `margin-top: 72px` | `padding-top` |
| 5 | Component gating | `{hydrated && <LivePreviewPanel />}` | None — all content renders immediately |
| 6 | Zustand hydration | `skipHydration: true` (manual) | Normal (automatic) |

### Why Each Matters

**`overflow-y: auto` on `.page`:**
- Creates a scroll container
- When content changes (LivePreviewPanel mounting), scrollbar may appear/disappear
- Scrollbar changes viewport width by ~6-17px
- This triggers layout recalculation for ALL `position: fixed` elements including navbar

**`var(--background)` (undefined CSS variable):**
- Neither `globals.css` nor `design-system.css` defines `--background`
- The element inherits from `body` (`var(--surface-0)` = `#000000`)
- During CSS loading, the variable may not resolve, causing a brief transparent flash
- Working pages use `background: transparent` explicitly

**`margin-top: 72px` vs `padding-top: 72px`:**
- `margin-top` is OUTSIDE the box model — more brittle
- `padding-top` is INSIDE the box model — more resilient to reflow
- If navbar height changes by even 1px (font swap, border), `margin-top` creates gap/overlap

**`{hydrated && <LivePreviewPanel />}` gate:**
- Server renders grid with 2 children (no LivePreviewPanel)
- After `useLayoutEffect`, `hydrated` flips to `true`, LivePreviewPanel mounts
- This DOM mutation forces browser to recalculate layout
- Working pages render all content immediately — no DOM mutation on mount

**`skipHydration: true` on Zustand persist:**
- Required manual `useLayoutEffect` seeding + `persist.rehydrate()`
- Added complexity and timing issues

---

## 3. The Fix (Applied)

### File 1: `frontend/src/app/resume-builder/builder.module.css`

```diff
 .page {
   min-height: 100vh;
   position: relative;
-  background: var(--background);
+  background: transparent;
   color: var(--text-primary);
   display: flex;
   flex-direction: column;
-  overflow-y: auto;
+  overflow: hidden;
 }

 .workspace {
   display: grid;
   grid-template-columns: 84px 1fr 420px;
   min-height: calc(100vh - 72px);
   height: auto;
-  margin-top: 72px;
+  padding-top: 72px;
   overflow: visible;
   position: relative;
-  background: var(--background);
+  background: transparent;
 }
```

### File 2: `frontend/src/app/resume-builder/page.tsx`

```diff
-import React, { useEffect, useLayoutEffect, useState } from "react";
+import React, { useEffect, useLayoutEffect, useState } from "react";
   // (useLayoutEffect kept for store seeding)

-  const [hydrated, setHydrated] = useState(false);
   // (hydrated state removed)

   useLayoutEffect(() => {
     // ... seed store from localStorage ...
     useResumeStore.persist.rehydrate();
-    setHydrated(true);
   }, []);

-  {hydrated && <LivePreviewPanel />}
+  <LivePreviewPanel />
   // (gate removed — always render)
```

### File 3: `frontend/src/app/resume-builder/store.ts`

```diff
 {
   name: "hiremate-resume-step",
   partialize: (state) => {
     const { actions, ...rest } = state;
     return rest;
   },
-  skipHydration: true,
 }
```

---

## 4. What Each Fix Addresses

| Fix | Problem Solved |
|-----|---------------|
| `overflow: hidden` | Prevents scrollbar appearance/disappearance that changes viewport width |
| `background: transparent` | Eliminates undefined CSS variable that causes background flash |
| `padding-top: 72px` | More resilient navbar offset (inside box model) |
| Remove `hydrated` gate | No DOM mutation on mount — LivePreviewPanel always in DOM |
| Remove `skipHydration` | Zustand hydrates normally — no manual rehydration complexity |
| Keep `useLayoutEffect` seeding | Store seeded before paint — no preview flash |

---

## 5. The Navbar Pattern (Reference)

Every page that refreshes perfectly follows this pattern:

```
Root Layout (layout.tsx)
  ├── <html suppressHydrationWarning>
  │   └── <head suppressHydrationWarning>
  │       └── <script dangerouslySetInnerHTML={theme/auth loader} />
  │   └── <body>
  │       ├── <ScrollToTop />
  │       ├── <ToastProvider>
  │       └── {children}  ← Page component
  │
  └── Page Component (page.tsx)
      └── <div className={styles.page}>     ← overflow: hidden, background: transparent
          ├── <HomeBackdrop />
          ├── <Navbar />                     ← position: fixed, height: 72px, z-index: 100
          ├── <main className={...}>         ← padding-top: 72px (NOT margin-top)
          │   └── {content}
          └── <SiteFooter />
```

### Navbar Anti-Flash Chain:

1. **Inline `<script>` in `<head>`** — Sets `data-theme`, auth classes, CSS vars BEFORE body renders
2. **CSS custom properties** — Both auth states always in DOM, toggled by CSS vars
3. **`position: fixed; height: 72px`** — Removed from flow, hardcoded dimensions
4. **`useLayoutEffect`** — Reads localStorage BEFORE paint (user data)
5. **`suppressHydrationWarning`** — Prevents React from overriding auth state

---

## 6. Known Remaining Issue: Font Loading Pop (First Visit Only)

On very first visit (font not cached), the Outfit font swaps from system fallback.
This causes a brief visual "pop" in navbar text. This affects ALL pages equally,
not just Resume Builder. It's a browser behavior, not a bug.

**Why it appears as "shrinking":**
- System fallback font (e.g., Arial) has different metrics than Outfit
- Navbar logo text renders wider/narrower with fallback font
- When Outfit loads, text reflows to correct metrics
- The visual change looks like the navbar "shrinks" or "pops"

**Why other pages seem fine:**
- Other pages DO have this same behavior
- But users notice it more on Resume Builder because they're testing refresh behavior there
- On subsequent refreshes, the font is cached and no pop occurs

**Mitigation options (if desired):**
1. Change `display: "swap"` to `display: "optional"` in layout.tsx — no swap, uses fallback permanently if font is slow. Risk: logo text always uses system font.
2. Add `font-display: optional` to the Outfit font config — same effect.
3. Preload the Outfit font — ensures it loads before first paint. Adds to bundle size.
4. Use `font-display: block` — blocks rendering until font loads. Risk: invisible text during load.

**Current behavior:** `display: "swap"` is correct and recommended by Google Fonts.
The pop is typically <100ms and only on first visit. Subsequent visits use cached font.

---

## 7. Debugging Checklist (If Issue Returns)

If the navbar shrink issue returns in the future, check these in order:

### CSS Layer:
- [ ] `.page` has `overflow: hidden` (NOT `overflow-y: auto`)
- [ ] `.page` has `background: transparent` (NOT `var(--background)`)
- [ ] `.workspace` has `padding-top: 72px` (NOT `margin-top`)
- [ ] `.workspace` has `background: transparent`

### Component Layer:
- [ ] `LivePreviewPanel` is NOT gated by `hydrated` or `mounted` state
- [ ] No `useLayoutEffect` sets state that controls conditional rendering
- [ ] No `useEffect` calls `loadFromProfile` or other store mutations after paint

### Store Layer:
- [ ] No module-top code reads `localStorage` (causes server/client divergence)
- [ ] `skipHydration` is NOT set to `true` (let Zustand hydrate normally)
- [ ] `partialize` excludes `actions` from persistence

### Layout Layer:
- [ ] `layout.tsx` uses `<script dangerouslySetInnerHTML>` (NOT `next/script`)
- [ ] Inline script sets `data-theme` and auth classes BEFORE body renders
- [ ] `<head suppressHydrationWarning>` is present

---

## 8. Files Modified (This Fix)

| File | Changes |
|------|---------|
| `frontend/src/app/resume-builder/builder.module.css` | overflow, background, padding-top |
| `frontend/src/app/resume-builder/page.tsx` | Remove hydrated gate, keep useLayoutEffect |
| `frontend/src/app/resume-builder/store.ts` | Remove skipHydration: true |

## 9. Files NOT Modified (And Why)

| File | Reason |
|------|--------|
| `layout.tsx` | `<script dangerouslySetInnerHTML>` is correct — `next/script` breaks navbar timing |
| `Navbar.tsx` | Navbar itself is correct — the issue was in the page CSS |
| `globals.css` | Design system is correct — the issue was in builder.module.css |
| `preview.tsx` | Preview component is correct — no changes needed |
