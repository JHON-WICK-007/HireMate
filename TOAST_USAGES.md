# HireMate AI — Toast Notification Usages

This document lists all active locations where the Toast notifications are called throughout the codebase, grouped by file and categorized by type (`success`, `error`).

---

## ❶ Codebase Summary
*   **Total Success Toasts (`toast.success`):** 15 calls
*   **Total Error Toasts (`toast.error`):** 41 calls
*   **Info & Warning Toasts (`toast.info` / `toast.warning`):** 0 calls (API exists but currently unused)

---

## ❷ Detailed Usage List

### 1. Authentication Page
*   **File:** [frontend/src/app/auth/page.tsx](file:///d:/HireMate/frontend/src/app/auth/page.tsx)
*   **Type: Success (1)**
    *   Line 231: `toast.success("Welcome back, ${data.user.fullName}! 🎉")`
*   **Type: Error (1)**
    *   Line 247: `toast.error("Unable to connect to server. Please try again.")`

### 2. Contact Page
*   **File:** [frontend/src/app/contact/page.tsx](file:///d:/HireMate/frontend/src/app/contact/page.tsx)
*   **Type: Error (1)**
    *   Line 118: `toast.error("Please fill in all required fields.")`

### 3. Live Mock Interview Page
*   **File:** [frontend/src/app/interview/live-interview/page.tsx](file:///d:/HireMate/frontend/src/app/interview/live-interview/page.tsx)
*   **Type: Success (2)**
    *   Line 600: `toast.success("Interview completed! Loading report...")`
    *   Line 692: `toast.success("Session ended. Loading your results...")`
*   **Type: Error (9)**
    *   Line 459: `toast.error("No interview session ID provided.")`
    *   Line 513: `toast.error(data.message || "Failed to load session details.")`
    *   Line 518: `toast.error("Network error loading interview session.")`
    *   Line 616: `toast.error(data.message || "Failed to evaluate answer.")`
    *   Line 621: `toast.error("Network error submitting answer.")`
    *   Line 633: `toast.error("Please end the session first before navigating away.")`
    *   Line 649: `toast.error("Please end the session first before navigating away.")` (in hook)
    *   Line 697: `toast.error(data.message || "Failed to end session.")`
    *   Line 700: `toast.error("Network error ending session.")`

### 4. Interview Setup Page
*   **File:** [frontend/src/app/interview/setup/page.tsx](file:///d:/HireMate/frontend/src/app/interview/setup/page.tsx)
*   **Type: Error (6)**
    *   Line 555: `toast.error("Failed to authenticate session.")`
    *   Line 563: `toast.error(message)`
    *   Line 597: `toast.error("A session with this name already exists.")`
    *   Line 630: `toast.error(data.message || "A session with this name already exists.")`
    *   Line 632: `toast.error(data.message || "Failed to initialize interview.")`
    *   Line 635: `toast.error("Network error. Could not connect to the server.")`

### 5. Interview Results Page
*   **File:** [frontend/src/app/interview/results/page.tsx](file:///d:/HireMate/frontend/src/app/interview/results/page.tsx)
*   **Type: Error (3)**
    *   Line 410: `toast.error("No interview session ID provided.")`
    *   Line 431: `toast.error(data.message || "Failed to load interview report.")`
    *   Line 437: `toast.error("Network error loading interview report.")`

### 6. User Profile Page
*   **File:** [frontend/src/app/profile/page.tsx](file:///d:/HireMate/frontend/src/app/profile/page.tsx)
*   **Type: Success (3)**
    *   Line 233: `toast.success("Changes saved successfully.")`
    *   Line 265: `toast.success("Profile photo updated.")`
    *   Line 297: `toast.success("Profile photo removed.")`
*   **Type: Error (14)**
    *   Line 205: `toast.error("Failed to load profile.")`
    *   Line 236: `toast.error(data.message || "Failed to save.")`
    *   Line 237: `toast.error("Network error.")`
    *   Line 244: `toast.error("Image must be under 2MB.")`
    *   Line 269: `toast.error(data.message || "Upload failed.")`
    *   Line 270: `toast.error("Upload error.")`
    *   Line 277: `toast.error("Failed to read file.")`
    *   Line 301: `toast.error(data.message || "Failed to remove photo.")`
    *   Line 304: `toast.error("Network error.")`
    *   Line 420: `toast.error("Full name is required.")`
    *   Line 421: `toast.error("Phone number is required.")`
    *   Line 468: `toast.error("Add at least one skill before saving.")`
    *   Line 526: `toast.error("Add at least one experience entry before saving.")`
    *   Line 601: `toast.error("Add at least one education entry before saving.")`
    *   Line 603: `toast.error("Institution is required.")`
    *   Line 604: `toast.error("Degree is required.")`
    *   Line 674: `toast.error("Target role is required.")`

### 7. Resume Builder Page
*   **File:** [frontend/src/app/resume-builder/page.tsx](file:///d:/HireMate/frontend/src/app/resume-builder/page.tsx)
*   **Type: Success (3)**
    *   Line 101: `toast.success("Profile Autofilled", "Resume fields loaded from your profile.")`
    *   Line 240: `toast.success("Generating PDF...", "Compiling vector PDF on backend...")`
    *   Line 268: `toast.success("Success ✓", "PDF downloaded successfully!")`
*   **Type: Error (4)**
    *   Line 70: `toast.error("Authentication Required", "Please log in or sign up to access the Resume Builder.")`
    *   Line 109: `toast.error("Session Expired", "Please log in again.")`
    *   Line 165: `toast.error("Export Failed", "Capture target not found.")`
    *   Line 271: `toast.error("Export Failed", "Could not render PDF document.")`

### 8. Resume Builder Preview Component
*   **File:** [frontend/src/app/resume-builder/components/preview.tsx](file:///d:/HireMate/frontend/src/app/resume-builder/components/preview.tsx)
*   **Type: Success (1)**
    *   Line 3496: `toast.success("Success ✓", "Template and theme color updated!")`

### 9. Resume Optimizer Page
*   **File:** [frontend/src/app/resume-optimizer/page.tsx](file:///d:/HireMate/frontend/src/app/resume-optimizer/page.tsx)
*   **Type: Success (3)**
    *   Line 387: `toast.success("Resume analyzed successfully!")`
    *   Line 424: `toast.success("PDF exported!")`
    *   Line 727: `toast.success("DOCX exported!")`
*   **Type: Error (6)**
    *   Line 372: `toast.error("Please select a file first.")`
    *   Line 393: `toast.error("The AI service is temporarily busy. Please wait a moment and try again.")`
    *   Line 395: `toast.error(msg || "Failed to analyze resume.")`
    *   Line 399: `toast.error("An error occurred during upload. Please try again.")`
    *   Line 426: `toast.error("Failed to export PDF. Please try again.")`
    *   Line 730: `toast.error("Failed to export DOCX. Please try again.")`
