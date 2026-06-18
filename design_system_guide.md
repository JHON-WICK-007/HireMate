# HireMate AI — Design System & Branding Reference

This guide serves as a complete reference for replicating the exact visual style, layout structure, color system, and animation patterns of HireMate AI when building new pages from scratch.

---

## 1. Brand Identity & Theme
HireMate AI uses a **Premium Monochrome + Success Emerald** theme. 
- **Dark Mode (Default):** Pitch black canvases, dark glass layers, and sharp white elements paired with pure white radial glows.
- **Light Mode:** Crisp white canvases, light glass layers, pitch black text/buttons, and subtle gray outlines.
- **Action / Status Indicators:** High-contrast Emerald Green (`#22c55e`) for success/active states, and Coral Red (`#ef4444`) for errors.

---

## 2. Color System
All colors are mapped to CSS custom variables in [globals.css](file:///d:/HireMate/frontend/src/app/globals.css). Always reference variables rather than hardcoding hex codes.

### Core Surface Palettes
| Variable Name | Dark Mode Value (Default) | Light Mode Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--surface-0` | `#000000` | `#ffffff` | Primary body background |
| `--surface-50` | `#0a0a0a` | `#fafafa` | Card backdrops |
| `--surface-100` | `#111111` | `#f5f5f5` | Section overlays, tab bars |
| `--surface-200` | `#1a1a1a` | `#e5e5e5` | Sub-panels, input fields |
| `--surface-300` | `#222222` | `#d4d4d4` | Highlight containers |
| `--surface-400` | `#2a2a2a` | `#a3a3a3` | Hover highlights |

### Text Contrast Colors
| Variable Name | Dark Mode Value | Light Mode Value | Purpose |
| :--- | :--- | :--- | :--- |
| `--text-primary` | `#ffffff` | `#000000` | Primary headers, body text |
| `--text-secondary` | `#a3a3a3` | `#525252` | Subtitles, descriptive paragraphs |
| `--text-muted` | `#525252` | `#737373` | Metadata, labels, inactive tabs |

### Status Colors
- `--success`: `#22c55e` (Emerald Green)
- `--error`: `#ef4444` (Coral Red)

---

## 3. Typography & Hierarchy
HireMate AI utilizes two Google Fonts loaded globally:
- **Display Font:** `Outfit` (used for large headers, badges, and scores).
- **Body Font:** `Inter` (used for paragraphs, buttons, forms, and tables).

### Styling Rules
- **Page Titles (`H1`):** Use large font size (`4rem`), `Outfit`, ultra-bold (`font-weight: 800`), letter-spacing (`-0.04em`), and a gradient clipping clip mask:
  ```css
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, var(--white) 0%, var(--gray-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  ```
- **Sub-headings (`H2`, `H3`):** Use display font, semi-bold (`font-weight: 700`), and tight tracking (`-0.02em`).
- **Body / Metadata:** Use `Inter` font, `line-height: 1.6` for readable text spacing.

---

## 4. Glassmorphism & Borders
To create depth in a dark/monochrome canvas, HireMate AI uses a sleek glass layer structure:

### CSS Glass Properties
```css
background: var(--glass-bg);               /* Dark mode: rgba(255,255,255,0.02) */
border: 1px solid var(--glass-border);     /* Dark mode: rgba(255,255,255,0.08) */
backdrop-filter: var(--glass-blur);        /* blur(16px) */
box-shadow: var(--glass-shadow);
```

### Corner Radii Guidelines
- **Small Corners (`--radius-sm` = `8px`):** Small buttons, status pills.
- **Medium Corners (`--radius-md` = `12px`):** Text areas, list items, info capsules.
- **Large Corners (`--radius-lg` = `16px`):** Main upload blocks, results lists, feature cards.
- **Full Radius (`--radius-full` = `9999px`):** Navigation bars, search bars, pill-shaped primary action buttons.

---

## 5. Standard Layout Components

### 1. Title Badge Pill
A tiny dot-activated capsule at the top of a page indicating the page category.
```tsx
<div className={styles.titleBadge}>
  <span className={styles.titleBadgeDot} />
  AI-Powered Assistant
</div>
```
```css
.titleBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: var(--glass-blur);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}
.titleBadgeDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  animation: dotPulse 2s ease-in-out infinite;
}
```

### 2. Primary Pill Button
High-contrast action buttons.
```tsx
<motion.button 
  className={styles.btnPrimary}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  Get Started
</motion.button>
```
```css
.btnPrimary {
  border-radius: var(--radius-full);
  background: var(--white);
  color: var(--black);
  padding: 0.9rem 2.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
}
```

### 3. Glass Card (Standard Grid Card)
Use cards with subtle border animations for showing features.
```css
.card {
  background: var(--surface-50);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all var(--transition-base);
}
.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
}
```

---

## 6. Animation Conventions (Framer Motion)
HireMate AI builds page animations using the following standardized motion variants:

### 1. Springy Viewport Stagger
```tsx
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
};
```

### 2. Continuously Floating Background Orbs
Create two blurred radial gradients in the background that drift floatingly:
```tsx
<motion.div
  className={styles.heroOrb}
  animate={{
    y: [0, -12, 0],
    scale: [1, 1.05, 1]
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```
```css
.heroOrb {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  filter: blur(80px);
  background: rgba(99, 102, 241, 0.06); /* Indigo glow */
  pointer-events: none;
}
```
