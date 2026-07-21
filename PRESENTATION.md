# HireMate AI — 10-Slide Presentation Deck

---

## Slide 1: Title Slide
# HireMate AI
### Intelligent Interview Preparation & Resume Analyzer System

* **Presented By:** MANAN VASANI
* **Department:** Computer Science & Engineering
* **Core Technology Stack:**
  * Next.js 16 & React 19 (Frontend Framework)
  * Node.js & Express.js (Backend REST API)
  * Local Python ML Microservice (Scikit-Learn & TF-IDF)
  * Google Gemini AI API
  * MongoDB & Mongoose (Database)
  * TypeScript (Strict Type Safety)

---

## Slide 2: Introduction & Objectives
### Introduction
* Manual resume review is slow, repetitive, and prone to human error.
* Candidates lack real-time feedback during technical interview practice.
* **HireMate AI** combines a Local Python ML microservice and Cloud Gemini AI to automate ATS resume screening, conduct live mock interviews, and build dynamic career roadmaps.

### Objectives
* Automate ATS resume screening and score calculation.
* Provide an interactive AI mock interview platform with real-time feedback.
* Synthesize adaptive company-tailored career roadmaps with strict phase progression.
* Track candidate learning progress with studied hours, XP, and daily streaks.

---

## Slide 3: Problem Statement & Proposed Solution
### Problem Statement
* **Slow & Manual Review:** Manual resume reviews and interview prep take weeks.
* **High ATS Rejections:** 75% of resumes fail automated ATS screening filters.
* **Lack of Feedback:** Job seekers rarely receive actionable feedback after rejection.
* **Unstructured Roadmaps:** Generic study plans don't adapt to target roles or companies.

### Proposed Solution
* Develop **HireMate AI**, an integrated hybrid system using a Local Python ML Microservice for instant resume scoring and Google Gemini AI for generative interview feedback and learning roadmaps.

---

## Slide 4: Technology Stack
### Core Technologies
* **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
* **Local ML Microservice:** Python, Scikit-Learn (RandomForest), TF-IDF Vectorizer, Pandas
* **Cloud AI Engine:** Google Gemini AI API (`@google/genai`)
* **Backend API:** Node.js, Express.js REST Microservices, Proxy Router (`/api/ml`)
* **Database & Auth:** MongoDB, Mongoose ODM, JWT, Passport.js (Google & GitHub OAuth)
* **Document Processing:** `pdf-parse` (PDF), `mammoth` (DOCX)

---

## Slide 5: System Architecture
### Hybrid Architecture (Cloud AI + Local ML Microservice)

* **Client Layer (Next.js 16 & React 19):** Responsive web interface connecting candidate tools to backend microservices.
* **Backend Gateway (Node.js & Express):** Central API gateway handling auth, session routing, and `/api/ml` proxy endpoints.
* **Local ML Microservice (Python on Port 8000):** Executes offline Scikit-Learn RandomForest scoring, skill extraction, and TF-IDF Cosine Similarity matching.
* **Cloud AI Engine (Google Gemini AI API):** Handles generative interview response streams, STAR feedback rubrics, and AI curator roadmap notes.

---

## Slide 6: Working Process
* **Step 1:** Candidate signs in via JWT or Google/GitHub OAuth and selects target role & company.
* **Step 2:** Candidate uploads a resume (PDF/DOCX) or inputs a target job description.
* **Step 3:** System extracts text (`pdf-parse`/`mammoth`) and passes it to the Local ML Service (`:8000`).
* **Step 4:** Local ML Service calculates ATS score (RandomForest) and job match (TF-IDF Cosine Similarity).
* **Step 5:** Local NLP engine extracts technical skills and identifies missing skill gaps.
* **Step 6:** Candidate configures an AI Mock Interview loop.
* **Step 7:** Cloud Gemini AI evaluates technical accuracy and provides turn-by-turn STAR feedback.
* **Step 8:** System generates a multi-phase Career Roadmap tailored to the target company.
* **Step 9:** Candidate logs studied hours to earn XP and unlock downstream phases sequentially.
* **Step 10:** Dashboard updates match score, level, and target certification recommendations in real-time.

---

## Slide 7: Key Features
* **Local ML Resume Scoring:** Instant offline scoring using trained Scikit-Learn classification models.
* **TF-IDF Job Match Evaluator:** Computes mathematical similarity percentage between resume and job description.
* **Modular Resume Builder:** Live section editing with single-column ATS templates and PDF export.
* **AI Mock Interview Studio:** Interactive interview loops with instant scoring and STAR feedback.
* **Sequential Career Roadmap:** Adaptive curriculum where Phase N unlocks only after Phase N-1 is complete.
* **Master Analytics Dashboard:** Real-time level tracking, XP earned, studied hours, and dynamic certifications.

---

## Slide 8: Important Code Modules
* **`backend/src/routes/ml.ts`:** Proxy router connecting Node.js backend to Local Python ML Service (`:8000`).
* **`layout.tsx` & `Navbar.tsx`:** Global layout shell, site metadata, and white HireMate logo icon.
* **`resume-optimizer/page.tsx`:** Multi-format file uploader (PDF/DOCX) and ATS match score breakdown.
* **`resume-builder/page.tsx`:** Modular resume compiler, live visual preview, and PDF downloader.
* **`interview/live-interview/page.tsx`:** Interactive interview session controller and AI response parsing.
* **`roadmap/page.tsx` & `store.ts`:** Sequential phase lock logic, hours tracker, and Zustand state synchronization.

---

## Slide 9: Project Output & Benefits
### Project Output
* **Production Web App:** 18 fully functional Next.js App Router routes.
* **Local ML Service Integration:** Fast offline resume scoring and TF-IDF similarity calculation.
* **Cloud AI Mock Interviewer:** Conversational interview simulator with turn-by-turn evaluation.
* **Interactive Roadmap:** Gamified, company-tailored learning timeline with strict phase unlocks.

### Key Benefits
* **Fast & Offline ML Processing:** Local ML service handles resume scoring without external latency.
* **Accurate ATS Matching:** Mathematical TF-IDF cosine similarity measures real keyword alignment.
* **Builds Interview Confidence:** Practice real technical questions in a simulated environment.
* **Tracks Progress:** Clear weekly goals, XP levels, and daily streak validation keep learning consistent.

---

## Slide 10: Conclusion & Future Scope
### Conclusion
**HireMate AI** combines a Local Python ML Microservice (Scikit-Learn & TF-IDF) and Cloud Gemini AI to automate resume screening, calculate match scores, simulate technical interviews, and generate adaptive learning roadmaps.

### Future Scope
* **Local ML Model Retraining Pipeline:** Automatic retraining using MLflow experiment tracking.
* **Peer-to-Peer Mock Interviews:** Collaborative live practice rooms for candidates.
* **In-Browser Code Execution:** Embedded coding sandbox inside technical interview loops.

---
### Thank You
**MANAN VASANI**  
*Computer Science & Engineering*