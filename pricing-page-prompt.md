# Pricing Page Design Specification

## Overview
Create an exact replica of a modern pricing page with dark theme, 3-column layout, and highlighted middle card.

---

## Page Background & Layout

- **Background Color**: `#1a1a1a` or `#0f1419` (charcoal/navy black)
- **Layout Type**: Full-width section with centered content
- **Padding**: 
  - Top: 80px
  - Bottom: 60px
  - Sides: Auto (centered)
- **Max Width**: 1200px (recommended)

---

## Main Heading

- **Text Content**: "Pricing"
- **Font Size**: 72px (extra large)
- **Font Weight**: Bold/900
- **Color**: White (`#ffffff`)
- **Text Alignment**: Center
- **Margin Bottom**: 60px
- **Font Family**: Inter, Segoe UI, or modern sans-serif

---

## Pricing Cards Grid

### Container Properties
- **Layout**: CSS Grid - 3 columns
- **Gap Between Cards**: 30px
- **Column Width**: Equal (1fr 1fr 1fr)
- **Responsive Breakpoints**:
  - Desktop (>1024px): 3 columns
  - Tablet (768px-1024px): 2-3 columns
  - Mobile (<768px): 1 column stack

### Individual Card Properties
- **Background**: `rgba(40, 40, 50, 0.8)` or semi-transparent dark
- **Border**: 1px solid `rgba(200, 200, 200, 0.1)` (subtle)
- **Border Radius**: 12px
- **Padding**: 40px
- **Height**: Equal across all cards (min-height or equal grid height)
- **Box Shadow**: `0 8px 32px rgba(0, 0, 0, 0.3)`
- **Display**: Flex column (for internal layout)

---

## Card #1 - Free Plan (Left Card)

### Plan Label
- **Text**: "Free Plan"
- **Font Size**: 12px
- **Color**: `#999999` (light gray)
- **Text Transform**: Uppercase (optional)
- **Letter Spacing**: 0.5px
- **Margin Bottom**: 10px

### Price Display
- **Text**: "Free"
- **Font Size**: 48px
- **Font Weight**: Bold (700-900)
- **Color**: White (`#ffffff`)
- **Margin Bottom**: 30px

### Features List
```
✓ Send up to 2 transfers per month
✓ Basic transaction history
✓ Email support
✓ Limited currency support (USD, EUR, GBP)
✓ Basic security features
```

**Feature Item Styling**:
- **Font Size**: 14-15px
- **Color**: `#e0e0e0` (light gray)
- **Line Height**: 1.6
- **Margin Bottom**: 15px
- **Display**: Flex (icon + text)
- **Gap**: 12px (between icon and text)

**Checkmark Icon**:
- **Symbol**: ✓
- **Color**: White or `#4ade80` (light green)
- **Size**: 18px
- **Flex Shrink**: 0

### Call-to-Action Button
- **Text**: "Get Started"
- **Background**: Dark (`#2a2a2a`)
- **Color**: White (`#ffffff`)
- **Width**: 100% (full card width)
- **Font Size**: 16px
- **Font Weight**: 600
- **Padding**: 14px 20px (vertical horizontal)
- **Border Radius**: 8px
- **Border**: None
- **Cursor**: Pointer
- **Margin Top**: Auto (pushes to bottom)
- **Transition**: `all 0.3s ease`
- **Hover State**: Opacity 0.8 or slight scale

---

## Card #2 - Standard Plan (Middle Card - HIGHLIGHTED)

### Plan Label
- **Text**: "Standard Plan"
- **Font Size**: 12px
- **Color**: `#999999` (light gray)
- **Text Transform**: Uppercase (optional)
- **Letter Spacing**: 0.5px
- **Margin Bottom**: 10px

### Price Display
- **Text**: "$9.99/m"
- **Font Size**: 48px
- **Font Weight**: Bold (700-900)
- **Color**: White (`#ffffff`)
- **Margin Bottom**: 30px

### Features List
```
✓ Unlimited transfers
✓ Transaction history with export options
✓ Priority email support
✓ Expanded currency support
✓ Advanced security features
```

**Feature Item Styling**: (Same as Card #1)
- Font Size: 14-15px
- Color: `#e0e0e0`
- Line Height: 1.6
- Margin Bottom: 15px

### Call-to-Action Button (PRIMARY/HIGHLIGHTED)
- **Text**: "Get Started"
- **Background**: White (`#ffffff`) ⭐ **STANDS OUT**
- **Color**: Dark (`#1a1a1a`) ⭐ **STANDS OUT**
- **Width**: 100% (full card width)
- **Font Size**: 16px
- **Font Weight**: 600
- **Padding**: 14px 20px (vertical horizontal)
- **Border Radius**: 8px
- **Border**: None
- **Cursor**: Pointer
- **Margin Top**: Auto (pushes to bottom)
- **Transition**: `all 0.3s ease`
- **Hover State**: Opacity 0.9 or slight scale
- **Box Shadow**: Optional subtle glow

### Card Visual Distinction
- Consider slight scale effect on page load (transform: scale(1.02))
- Optional: Slightly brighter border or additional shadow
- This card should visually communicate it's the "recommended" option

---

## Card #3 - Premium Plan (Right Card)

### Plan Label
- **Text**: "Free Plan"
- **Font Size**: 12px
- **Color**: `#999999` (light gray)
- **Text Transform**: Uppercase (optional)
- **Letter Spacing**: 0.5px
- **Margin Bottom**: 10px

### Price Display
- **Text**: "$19.99/m"
- **Font Size**: 48px
- **Font Weight**: Bold (700-900)
- **Color**: White (`#ffffff`)
- **Margin Bottom**: 30px

### Features List
```
✓ Unlimited transfers with priority processing
✓ Comprehensive transaction analytics
✓ 24/7 priority support
✓ Full currency support
✓ Enhanced security features
```

**Feature Item Styling**: (Same as other cards)
- Font Size: 14-15px
- Color: `#e0e0e0`
- Line Height: 1.6
- Margin Bottom: 15px

### Call-to-Action Button
- **Text**: "Get Started"
- **Background**: Dark (`#2a2a2a`)
- **Color**: White (`#ffffff`)
- **Width**: 100% (full card width)
- **Font Size**: 16px
- **Font Weight**: 600
- **Padding**: 14px 20px (vertical horizontal)
- **Border Radius**: 8px
- **Border**: None
- **Cursor**: Pointer
- **Margin Top**: Auto (pushes to bottom)
- **Transition**: `all 0.3s ease`
- **Hover State**: Opacity 0.8 or slight scale

---

## Bottom Section - Billing Toggle

### Toggle Switch Component
- **Position**: Bottom-left of pricing section
- **Display**: Flex layout
- **Alignment**: Items center
- **Gap**: 10px (between toggle and label)

### Toggle Switch Styling
- **Background**: Dark (`#2a2a2a`)
- **Width**: 50px
- **Height**: 28px
- **Border Radius**: 14px (fully rounded)
- **Cursor**: Pointer
- **Position**: Relative (for inner circle)

### Toggle Inner Circle
- **Background**: White (`#ffffff`) or light gray
- **Width**: 24px
- **Height**: 24px
- **Border Radius**: 12px (fully rounded)
- **Position**: Absolute
- **Top**: 2px
- **Left**: 2px (default) / 24px (active state)
- **Transition**: `left 0.3s ease`

### Toggle Label
- **Text**: "Billed Yearly"
- **Font Size**: 14px
- **Color**: `#e0e0e0` (light gray)
- **Font Weight**: 500

---

## Typography Reference

### Font Family
- **Primary**: Inter, Segoe UI, -apple-system, BlinkMacSystemFont, sans-serif
- **Fallback**: System font stack for better performance

### Font Smoothing
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
text-rendering: optimizeLegibility;
```

### Font Sizes Summary
- Main Heading: 72px
- Price: 48px
- Plan Label: 12px
- Feature Text: 14-15px
- Button Text: 16px
- Toggle Label: 14px

### Font Weights
- Headings: 700-900 (Bold)
- Button Text: 600 (Semi-Bold)
- Labels: 500 (Medium)
- Body Text: 400 (Regular)

---

## Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Main Background | Dark Charcoal | `#1a1a1a` |
| Card Background | Semi-transparent Dark | `rgba(40, 40, 50, 0.8)` |
| Card Border | Subtle Light | `rgba(200, 200, 200, 0.1)` |
| Heading Text | White | `#ffffff` |
| Feature Text | Light Gray | `#e0e0e0` |
| Label Text | Gray | `#999999` |
| Primary Button BG | Dark | `#2a2a2a` |
| Primary Button Text | White | `#ffffff` |
| Highlight Button BG | White | `#ffffff` |
| Highlight Button Text | Dark | `#1a1a1a` |
| Checkmark Icon | White/Green | `#ffffff` or `#4ade80` |
| Toggle Switch BG | Dark | `#2a2a2a` |
| Toggle Inner | Light | `#ffffff` |

---

## Interactive States

### Button Hover State
- **Opacity**: 0.8-0.9
- **Transform**: `scale(1.01)` (subtle grow)
- **Transition**: `all 0.3s ease`
- **Cursor**: pointer

### Card Hover State (Optional)
- **Transform**: `translateY(-4px)` (slight lift)
- **Box Shadow**: Slightly increased
- **Transition**: `all 0.3s ease`

### Toggle Hover State
- **Opacity**: 0.8
- **Cursor**: pointer

---

## Responsive Design Breakpoints

### Desktop (>1024px)
- **Grid Columns**: 3
- **Card Width**: Approximately 33.33% each
- **Padding**: Full 40px on cards
- **Gap**: 30px

### Tablet (768px - 1024px)
- **Grid Columns**: 2 (or 1 if preferred)
- **Card Width**: Approximately 50% each or full width
- **Padding**: 30px on cards
- **Gap**: 20px

### Mobile (<768px)
- **Grid Columns**: 1
- **Card Width**: 100% (full width)
- **Padding**: 25px on cards
- **Gap**: 20px
- **Heading Font Size**: 48-52px
- **Price Font Size**: 36-40px

---

## Animation & Effects

### Optional Smooth Transitions
- **Card Load**: Fade-in + slight scale
- **Button Hover**: Opacity + subtle scale
- **Toggle Click**: Smooth left position transition
- **Overall Duration**: 0.3s - 0.4s

### Glass Morphism Effect (Optional)
```css
backdrop-filter: blur(10px);
```

### Shadow Effects
- **Card Shadow**: `0 8px 32px rgba(0, 0, 0, 0.3)`
- **Hover Shadow**: `0 12px 48px rgba(0, 0, 0, 0.4)`

---

## Implementation Notes

### HTML Structure
1. Container div with background and padding
2. Main heading "Pricing"
3. Pricing cards grid container
4. 3 individual card elements (left, middle, right)
5. Each card contains:
   - Plan label
   - Price display
   - Features unordered list
   - Call-to-action button
6. Billing toggle at bottom

### CSS Approach
- Use CSS Grid for card layout
- Flexbox for card internal layout
- CSS variables for colors (for easy theme switching)
- Media queries for responsive design
- Smooth transitions for interactions

### JavaScript Features
- Toggle switch functionality (monthly/yearly)
- Optional: Smooth scroll animations
- Optional: Click handlers for "Get Started" buttons

---

## Design Summary

✅ Dark theme with high contrast
✅ 3-column pricing layout
✅ Middle card highlighted as primary option
✅ Clean, minimalist aesthetic
✅ White checkmarks for features
✅ Fully responsive design
✅ Modern button styling with clear hierarchy
✅ Professional typography hierarchy
✅ Smooth interactions and transitions

---

## Ready to Implement?

This specification is detailed enough to:
- **Recreate exactly** with HTML/CSS/JavaScript
- **Convert to React** component
- **Use with Tailwind CSS**
- **Implement with any framework** (Vue, Svelte, etc.)

**Next Step**: Use this document to build or provide to an AI/developer for implementation.
