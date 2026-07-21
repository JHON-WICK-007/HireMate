# 🎙️ HireMate AI — Live Website Presentation & Spoken Script
**Presenter:** MANAN VASANI  
**Department:** Computer Science & Engineering  
**Project:** HireMate AI — Intelligent Interview Preparation & Resume Analyzer System  

---

## 📌 How to Use This Script
If your professor or evaluator ("Sir") asks for a **Live Website Demo** instead of a PowerPoint presentation, open `http://localhost:3000` in your browser and follow this step-by-step guide. 

This guide tells you **WHAT TO CLICK** on the website and **WHAT TO SAY** out loud at each step.

---

## 🎬 1. Opening & Introduction (Homepage: `http://localhost:3000`)

### 🖱️ What to Click / Show:
* Open `http://localhost:3000` (Homepage).
* Point to the white **HireMate** brand logo in the top navbar and the sleek dark-mode hero section.

### 🗣️ Spoken Script:
> *"Respected Sir, good morning / good afternoon. I am **Manan Vasani** from the Computer Science & Engineering department, and today I am excited to present my project: **HireMate AI**."*
>
> *"HireMate AI is a complete, intelligent career development and interview preparation web platform designed specifically for software engineering candidates aiming for top tech companies."*
>
> *"It solves a major industry problem: over 75% of candidate resumes are filtered out by automated ATS scanners before a human ever reads them, and candidates lack realistic, real-time practice for technical interviews. Let me walk you through the live platform."*

---

## 📄 2. Module 1: AI Resume Optimizer (`/resume-optimizer`)

### 🖱️ What to Click / Show:
* Click **Resume** in the Navbar $\rightarrow$ select **Resume Optimizer**.
* Show the file upload area for PDF/DOCX resumes and the target Job Description input box.
* Trigger a sample scan to display the **ATS Match Score Gauge** (e.g. 78%), missing technical keywords list, and bullet point improvement suggestions.

### 🗣️ Spoken Script:
> *"Our first core module is the **AI Resume Optimizer**."*
>
> *"Here, a candidate can upload their resume in PDF or DOCX format and input their target Job Description."*
>
> *"When we run the audit, the system extracts the text using our backend ingestion tools (`pdf-parse` & `mammoth`), passes it to our **Local Python ML Microservice** and **Google Gemini AI**, and computes an instant **ATS Match Score** out of 100."*
>
> *"As you can see on the screen, it highlights missing technical skills, section formatting gaps, and gives actionable STAR-format bullet point suggestions to make the resume pass automated screening filters."*

---

## 📝 3. Module 2: Professional Resume Builder (`/resume-builder`)

### 🖱️ What to Click / Show:
* Click **Resume** $\rightarrow$ select **Resume Builder**.
* Show the modular section editor on the left (Experience, Projects, Education, Technical Skills) and the live visual preview on the right.
* Point out the one-click PDF export button.

### 🗣️ Spoken Script:
> *"Once candidates identify their resume gaps, they can build a clean, ATS-compliant resume using our **Professional Resume Builder**."*
>
> *"It features a modular editor with live side-by-side preview formatted strictly in single-column layouts standard for ATS software."*
>
> *"Candidates can edit sections in real-time and export a high-fidelity PDF with a single click."*

---

## 🎙️ 4. Module 3: AI Mock Interview Studio (`/interview`)

### 🖱️ What to Click / Show:
* Click **Interview** in the Navbar to open the Mock Interview setup page (`/interview/setup` or `/interview`).
* Select target role (e.g., *Frontend / Software Engineer*), difficulty (*Intermediate*), and round type (*Technical / System Design*).
* Click **Start Interview** to launch the live session (`/interview/live-interview`). Show the interactive turn-by-turn chat interface.

### 🗣️ Spoken Script:
> *"Now let's look at our second major feature: the **AI Mock Interview Studio**."*
>
> *"Candidates can set up realistic interview loops by choosing their target role, experience level, and round type."*
>
> *"During the live session, our AI interlocutor poses technical and behavioral questions, probes edge cases based on candidate answers, and evaluates technical accuracy in real-time."*
>
> *"Upon completion, HireMate generates a quantitative report scored from 0 to 100 with detailed STAR-method feedback on technical correctness, communication clarity, and problem solving."*

---

## 🗺️ 5. Module 4: Dynamic Career Roadmap Engine (`/roadmap`)

### 🖱️ What to Click / Show:
* Click **Roadmap** in the Navbar (`/roadmap`).
* **Top Banner:** Point out **Current Level**, **XP Earned**, **Skills Done (7/18)**, **Est. Weeks Left (21)**, and the **39% Match Progress Circle**.
* **Role Competency Gaps:** Point out the live calculated match bars (*Data Structures 84%*, *System Design 59%*, *STAR Method 98%*).
* **Target Certifications:** Show dynamic recommendations (*AWS Developer Associate*, *Meta Software Engineer*).
* **Timeline Canvas:** Scroll down to show Phase 1 (Completed with green tickmark), Phase 2 (Active glowing dot), and Phase 3/4 (Locked dark dots). Show skill hours input fields.

### 🗣️ Spoken Script:
> *"Finally, let's explore our **Dynamic Career Roadmap Engine**."*
>
> *"Based on the candidate's target role and company (like Google, Amazon, or Meta), HireMate synthesizes a multi-phase learning path."*
>
> *"Please notice the **Strict Sequential Progression** rule: Phase 2 only unlocks when Phase 1 is 100% completed. Lower phases remain locked with a dark lock icon, preventing candidates from skipping ahead."*
>
> *"As candidates log studied hours per skill, they earn XP, level up, and validate daily learning streaks. Notice that the **Role Competency Gaps** and **Target Certifications** in the top banner calculate dynamically in real-time based on the candidate's active role and progress."*

---

## 🏗️ 6. System Architecture & Technical Highlights

### 🗣️ Spoken Script:
> *"Behind the scenes, HireMate is built on a high-performance **Hybrid System Architecture**:"*
>
> 1. *"**Frontend Framework:** Next.js 16 App Router and React 19 with strict TypeScript type safety, providing sub-second page transitions."*
> 2. *"**Backend API & Storage:** Node.js Express REST API connected to a MongoDB database with JWT authentication and Passport.js OAuth."*
> 3. *"**Local Python ML Microservice:** A fast local service running on port 8000 using **Scikit-Learn (RandomForest)** and **TF-IDF Cosine Similarity** for instant offline resume scoring and skill extraction."*
> 4. *"**Cloud AI Engine:** **Google Gemini AI API** for generative interview question evaluation and AI curator roadmap notes."*

---

## 🏁 7. Conclusion & Q&A

### 🗣️ Spoken Script:
> *"In conclusion, HireMate AI provides software engineering candidates with a complete, end-to-end preparation platform — from passing ATS resume filters to mastering technical interviews and completing company-tailored learning roadmaps."*
>
> *"Thank you Sir for your time. I am now ready for your questions!"*

---

## ❓ Common Questions Sir Might Ask & How to Answer

### Q1: *"How does the ATS Resume Optimizer calculate the score?"*
> **Answer:** *"Sir, we extract the document text using `pdf-parse` or `mammoth`. Then our backend runs a keyword extraction algorithm to compare candidate skills against target job description keywords using TF-IDF cosine similarity and Scikit-learn models, evaluating hard skills, section formatting, and impact bullet strength."*

### Q2: *"What is the strict sequential progression rule in the roadmap?"*
> **Answer:** *"Sir, to prevent candidates from skipping foundational topics, Phase N only unlocks when Phase 0 through N-1 are 100% completed. If an upper phase is incomplete, downstream phases remain locked, disabling skill checks and hours inputs."*

### Q3: *"Which AI model do you use for interviews?"*
> **Answer:** *"Sir, we use a hybrid model setup: Google Gemini AI API handles generative conversational evaluation and feedback, while our Local Python ML microservice handles instant resume classification and TF-IDF similarity math."*
