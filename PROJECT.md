# HireMate AI — Project Context & Documentation

HireMate AI is a full-stack, AI-powered career development and interview preparation platform designed for college students, freshers, job seekers, and career switchers. The product is designed to feel like a high-end, premium SaaS developer tool (reminiscent of Vercel, Linear, or Raycast) featuring dark mode by default, clean glassmorphism, and minimal but high-impact color coding.

---

## 1. Project Summary
HireMate AI provides a unified journey for technical candidates:
1. **Resume Audit & Parsing:** Extract skills, experience, and education from PDF/DOCX files and run automated ATS-scoring and feedback reports.
2. **AI Mock Interviews (Planned):** Conduct company-specific and role-specific mock interviews via text and voice with real-time feedback.
3. **Career Roadmap Generation (Planned):** Create custom skills timelines, learning guides, and project recommendations to close profile gaps.
4. **Coding Sandbox (Planned):** Practice technical challenges in a browser-based online editor with automated test cases and AI evaluations.

---

## 2. Tech Stack

| Layer | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js | `16.2.7` (App Router) | React server/client application framework |
| **UI Library** | React / React DOM | `19.2.4` | Core rendering engine |
| **Styling** | Tailwind CSS | `v4.0.0` (PostCSS `^4`) | Modern CSS-first utility-class styling |
| **Animations** | Framer Motion | `^12.40.0` | Fluid state-transitions and micro-animations |
| **Icons** | Lucide React | `^1.21.0` | SVG iconography |
| **3D Graphics** | Spline React | `^4.1.0` | Embedding the interactive hero 3D console |
| **Document Parsing** | pdf-parse, mammoth | `2.4.5` / `1.12.0` | Extraction of raw text from PDFs and DOCXs |
| **File Generation** | docx, html2pdf.js, file-saver | `9.7.1` / `0.14.0` / `2.0.5` | Client-side exports for resume documents |
| **Backend Framework** | Express.js | `^4.21.2` (TypeScript) | API Server controller |
| **Language** | TypeScript | `^5` (Frontend / Backend) | Static typing and type safety |
| **Database** | MongoDB | Atlas (Cloud Hosting) | Document store database |
| **ORM / ODM** | Mongoose | `^8.9.5` | MongoDB schema modeling and object-relational mapping |
| **AI Integration** | Google GenAI SDK | `@google/genai ^2.8.0` | Querying `gemini-2.5-flash-lite` |
| **Authentication** | JWT, bcryptjs, cookie-parser | `9.0.2` / `2.4.3` / `1.4.7` | Token authentication stored in HTTP-Only Cookies |
| **Security / Logs** | Helmet, Morgan, CORS | `8.0.0` / `1.10.0` / `2.8.5` | Express security compliance and access control |

---

## 3. Current Status (Built vs Planned)

```mermaid
graph TD
    classDef built fill:#10b981,stroke:#047857,color:#fff;
    classDef planned fill:#111,stroke:#333,color:#888,stroke-dasharray: 5 5;

    A[Landing Page /] :::built
    B[Auth /auth] :::built
    C[Resume Analyzer /resume] :::built
    D[Profile /profile] :::built
    E[Mock Interview /interview] :::planned
    F[Roadmap Gen /roadmap] :::planned
    G[Dashboard /dashboard] :::planned
    H[Coding Sandbox /coding] :::planned

    A --> B
    A --> C
    A --> D
    C --> D
    D --> E
    D --> F
    E --> G
    F --> G
```

### Built Pages / Components
- **Landing Page (`/`):** Full homepage featuring animated backdrop grids, a premium WebGL Shader visual console, dynamic pricing toggles, testimonials, and functional tab navigation demonstrating resume rating, mock interviews, and roadmaps.
- **Authentication (`/auth`):** Fully custom Login & Registration screen with layout slide transitions, password rules validator, and JWT authorization flow.
- **Resume Upload & Audit (`/resume`):** Custom drag-and-drop file upload component supporting PDF and DOCX, a visual check checklist divided into 5 groups (ATS Essentials, Content, Red Flags, Sections, Job Tailoring), and automated evaluation summary page showing ATS scores, strengths, weaknesses, and missing skills.
- **User Profile (`/profile`):** Multi-step user profile management allowing edits to personal information, skills chips, experience logs, and educational background.

### Built Backend Services
- **Auth Service:** Registration, Login, logout, and token validation middlewares (`/api/auth`).
- **Profile Service:** GET/PUT endpoints to fetch and update user records including nested arrays (`/api/users`).
- **Resume parsing & analysis:** Server-side file reception (`multer`), doc reader (`pdf-parse`, `mammoth`), and Google Gemini model integration (`/api/resume/analyze`).

### Planned Features & Screens
- **Mock Interview Engine (`/interview`):** Interactive AI text and voice chat. Voice speaking capability requires speech-to-text integration.
- **Career Roadmap Builder (`/roadmap`):** Visual study pathway rendering learning timeline nodes based on target roles.
- **Coding Interview Area (`/coding`):** Code sandbox editor, compiler simulator, and AI code reviewer.
- **Progress Dashboard (`/dashboard`):** Historical tracking of interview scores, skill metrics, and progress logs.
- **Admin Control Panel (`/admin`):** System diagnostics and content creation editor.

---

## 4. Page Map

| Route | Purpose | Modules / Code Coverage | Connected Pages | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Application Home / Landing | `frontend/src/app/page.tsx`, `home.module.css` | `/auth`, `/profile`, `/resume` | **Built** |
| `/auth` | Authentication Entry | `frontend/src/app/auth/page.tsx`, `auth.module.css` | `/` | **Built** |
| `/profile` | Profile View & Customization | `frontend/src/app/profile/page.tsx`, `profile.module.css` | `/`, `/resume` | **Built** |
| `/resume` | Upload, Parse & Audit Resume | `frontend/src/app/resume/page.tsx`, `resume.module.css` | `/`, `/profile` | **Built** |
| `/interview` | Interactive AI Mock Interview | *Planned screen* | `/dashboard` | *Planned* |
| `/roadmap` | Career Timeline & Goals | *Planned screen* | `/dashboard` | *Planned* |
| `/coding` | Code Sandbox Practice | *Planned screen* | `/dashboard` | *Planned* |
| `/dashboard` | Analytics & History Gutter | *Planned screen* | `/interview`, `/roadmap`, `/resume` | *Planned* |

---

## 5. Component Tree (Shared Components)

All shared components are currently housed in `frontend/src/app/components`:
```
frontend/src/app/components/
├── ThemeToggle.tsx        # Manages Tailwind v4 light/dark modes (saved to localStorage)
├── ShaderBackground.tsx   # Premium WebGL canvas rendering console-like backdrop patterns
├── HomeBackdrop.tsx       # Standard home screen background animation particles
├── SiteFooter.tsx         # Unified footer containing layout links and legal notices
├── Toast.tsx              # Stateful toast messaging system with slide-out alerts
└── Toast.module.css       # Toast animation layers
```

---

## 6. API Map

### 1. Authentication Routes (`/api/auth`)
- **`POST /register`**
  - **Description:** Registers a new user. Has password complexity checks.
  - **Body:** `{ fullName, email, password }`
  - **Response:** `{ success: true, token, user: { id, fullName, email, ... } }` (and sets HTTP-Only cookie `token`)
- **`POST /login`**
  - **Description:** Authenticates user credentials.
  - **Body:** `{ email, password }`
  - **Response:** `{ success: true, token, user }` (and sets HTTP-Only cookie `token`)
- **`GET /me`** (Protected)
  - **Description:** Retrieves current user authentication status and profile summary.
  - **Response:** `{ success: true, user }`
- **`POST /logout`**
  - **Description:** Destroys active HTTP-Only session token.
  - **Response:** `{ success: true, message }`

### 2. Profile Routes (`/api/users`)
- **`GET /profile`** (Protected)
  - **Description:** Fetches complete profile database document of the current user.
  - **Response:** `{ success: true, user }`
- **`PUT /profile`** (Protected)
  - **Description:** Updates specific profile properties (skills, experience arrays, educational items, etc.).
  - **Body:** `{ fullName, avatar, phone, bio, skills, experience, education, careerGoal, targetRole, targetCompany }`
  - **Response:** `{ success: true, message, user }`

### 3. Resume Routes (`/api/resume`)
- **`POST /analyze`** (Protected)
  - **Description:** Multi-part file upload. Extracts doc text and passes it to Gemini AI for structural assessment.
  - **Body:** FormData containing file `resume` (PDF or DOCX)
  - **Response:** `{ success: true, data: { personalInfo, skills, education, experience, projects, analysis: { atsScore, strengths, weaknesses, missingSkills, improvementSuggestions } } }`

---

## 7. AI Integration Points

### Resume Audit (`/api/resume/analyze`)
- **Model:** `gemini-2.5-flash-lite`
- **Integration library:** `@google/genai`
- **Logic:**
  - Raw document text is parsed out of the uploaded buffer (PDF text extracted using `pdf-parse`; DOCX text extracted using `mammoth`).
  - Text snippet (truncated up to 15,000 characters) is appended to a structured prompt.
  - Gemini is forced to respond with a **strict JSON schema** structure.
  - A custom wrapper helper `callWithRetry` handles API availability issues by retrying up to 3 times on `503`, `RESOURCE_EXHAUSTED`, or `UNAVAILABLE` errors using exponential backoff (2s, 4s, 6s).
- **Prompt definition:**
```
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Please analyze the following resume text. Extract the required fields and provide a professional analysis.
Respond ONLY with a valid JSON object matching this exact schema:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "links": ["string"]
  },
  "skills": ["string"],
  "education": [
    { "institution": "string", "degree": "string", "year": "string" }
  ],
  "experience": [
    { "company": "string", "role": "string", "duration": "string", "description": "string" }
  ],
  "projects": [
    { "name": "string", "description": "string", "technologies": ["string"] }
  ],
  "analysis": {
    "atsScore": number (0 to 100),
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingSkills": ["string"],
    "improvementSuggestions": ["string"]
  }
}
```

---

## 8. Database Schema Overview

```
User Document (Mongoose Schema)
├── _id: ObjectId
├── fullName: String (2-50 chars, required)
├── email: String (lowercase, unique, match regex)
├── password: String (minlength: 6, select: false)
├── avatar: String (url / default: "")
├── phone: String
├── bio: String (max: 500 chars)
├── skills: [ String ]
├── experience: [
│   ├── company: String
│   ├── role: String
│   ├── duration: String
│   └── description: String
│   ]
├── education: [
│   ├── institution: String
│   ├── degree: String
│   ├── field: String
│   └── year: String
│   ]
├── careerGoal: String
├── targetRole: String
├── targetCompany: String
├── resumeUrl: String
├── resumeParsedData: Mixed Schema (JSON)
├── interviewHistory: [ ObjectId -> ref: 'Interview' ]
└── timestamps (createdAt, updatedAt)
```

---

## 9. Known Issues & Gaps
1. **Resume Database Persistence:** While the backend successfully parses files and returns structured evaluation details, the extracted skills, experience data, and score summaries are **not** auto-persisted to the active User document in MongoDB. The user must copy or submit these details separately on the Profile page to update their record.
2. **Text Layout Scrambling:** Basic PDF text extraction (`pdf-parse`) can occasionally scramble strings in multi-column, complex layout resume designs, reducing the accuracy of the Gemini parsed JSON.
3. **Session Refresh Token Missing:** The authentication system relies on a single JWT token valid for 7 days. There is no active token rotation/refresh flow configured.
4. **Interview Model Missing:** The `User` model defines an `interviewHistory` reference array referencing `'Interview'`, but the corresponding Mongoose model is not yet implemented.

---

## 10. Next Priority Build Order

1. **Step 1: Mock Interview Database Model & Routes**
   - Create `Interview.ts` schema on the backend (storing session state, logs of QA, overall score).
   - Hook up endpoints `/api/interviews` to initialize sessions and handle answer submissions.
2. **Step 2: Interactive Interview Screen (`/interview`)**
   - Build a clean chat console featuring dynamic messaging layouts.
   - Implement audio response recording using HTML5 MediaRecorder and integrate a transcription API.
3. **Step 3: AI Interview Evaluator**
   - Integrate Gemini prompts on the backend to grade candidate responses based on communication, technical accuracy, and problem solving.
4. **Step 4: Career Roadmap Builder (`/roadmap`)**
   - Map profile gap values (skills candidate has vs target job prerequisites) to generate visual milestone roadmaps.
5. **Step 5: Automated Resume Sync**
   - Modify the `/api/resume/analyze` handler to automatically write the extracted skills, education, and experience fields directly to the user's Mongoose record on successful evaluation.
