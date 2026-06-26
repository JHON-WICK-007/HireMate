# Auth Page Improvements — Changelog

## Files Modified

### 1. `frontend/src/app/auth/auth.module.css`

**Input Styling:**
- Changed input padding from `11px 13px 11px 42px` → `14px 16px 14px 44px`
- Added consistent `height: 48px` to all inputs
- Changed background from `var(--input-bg)` → `var(--surface-100)`
- Added `box-sizing: border-box`
- Added subtle hover background: `var(--surface-200)`
- Added focus glow: `box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05)`
- Updated placeholder opacity to `0.6`

**Input Icon:**
- Changed icon size from `17px` → `18px`
- Changed icon left position from `13px` → `14px`
- Icon now turns `var(--text-primary)` on focus (was `var(--text-secondary)`)

**Submit Button:**
- Changed from `translateY(-1px)` hover → no movement
- Changed active state to `scale(0.98)` instead of `translateY(0)`
- Added `height: 48px`
- Changed font-weight from `700` → `600`
- Updated hover shadow to `rgba(255, 255, 255, 0.1)`

**Social Buttons:**
- Added `height: 48px`
- Changed background from `transparent` → `var(--surface-100)`
- Added hover background: `var(--surface-200)`
- Changed gap from `8px` → `10px`
- Updated font-size from `0.88rem` → `0.9rem`

**Eye Button:**
- Added `padding: 6px` (was `4px`)
- Added `justify-content: center`
- Added `border-radius: var(--radius-sm)`
- Added hover background: `var(--surface-200)`
- Hover color now `var(--text-primary)` (was `var(--text-secondary)`)

**Labels:**
- Changed font-size from `0.82rem` → `0.85rem`

**Form Spacing:**
- Changed form gap from `1rem` → `1.25rem`
- Changed input group gap from `5px` → `6px`

**Autofill Fix:**
- Updated to use `var(--surface-100)` instead of `var(--input-bg)`

**Forgot Link:**
- Changed color from `var(--text-secondary)` → `var(--text-muted)`
- Changed margin-top from `-2px` → `-4px`

---

## Summary

| Element | Before | After |
|---------|--------|-------|
| Input height | auto | 48px |
| Input background | `var(--input-bg)` | `var(--surface-100)` |
| Focus effect | border color change | border + glow shadow |
| Submit hover | translateY(-1px) | no movement |
| Submit active | translateY(0) | scale(0.98) |
| Social buttons | transparent bg | `var(--surface-100)` bg |
| Eye button | minimal | has hover background |
| Icon on focus | gray | white |
