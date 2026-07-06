# HireMate AI — Project Context & Documentation

HireMate AI is a full-stack, AI-powered career development and interview preparation platform designed for college students, freshers, job seekers, and career switchers. The product is designed to feel like a high-end, premium SaaS developer tool (reminiscent of Vercel, Linear, or Raycast) featuring dark mode by default, clean glassmorphism, and minimal but high-impact color coding.

---

## 1. Project Summary
HireMate AI provides a unified journey for technical candidates:
1. **Resume Audit & Parsing:** Extract skills, experience, and education from PDF/DOCX files and run automated ATS-scoring and feedback reports.
2. **AI Mock Interviews:** Conduct company-specific and role-specific mock interviews via text and voice with real-time feedback.
3. **Career Roadmap Generation:** Create custom skills timelines, learning guides, and project recommendations to close profile gaps.
4. **Coding Sandbox:** Practice technical challenges in a browser-based online editor with automated test cases and AI evaluations.

---

## 2. Tech Stack

| Layer | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js | `16.2.7` (App Router) | React server/client application framework |
| **UI Library** | React / React DOM | `19.2.4` | Core rendering engine |
| **Styling** | Tailwind CSS | `v4.0.0` (PostCSS `^4`) | Modern CSS-first utility-class styling |
| **Animations** | Framer Motion | `^12.40.0` | Fluid state-transitions and micro-animations |
| **Icons** | Lucide React | `^1.21.0` | SVG iconography |
| **Document Parsing** | pdf-parse, mammoth | `2.4.5` / `1.12.0` | Extraction of raw text from PDFs and DOCXs |
| **File Generation** | docx, html2pdf.js, file-saver | `9.7.1` / `0.14.0` / `2.0.5` | Client-side exports for resume documents |
| **Backend Framework** | Express.js | `^4.21.2` (TypeScript) | API Server controller |
| **Language** | TypeScript | `^5` (Frontend / Backend) | Static typing and type safety |
| **Database** | MongoDB | Atlas (Cloud Hosting) | Document store database |
| **ORM / ODM** | Mongoose | `^8.9.5` | MongoDB schema modeling and object-relational mapping |
| **AI Integration** | Google GenAI SDK | `@google/genai ^2.8.0` | Querying `gemini-2.5-flash` |
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
    C[Resume Analyzer /resume-optimizer] :::built
    D[Profile /profile] :::built
    E[Mock Interview /interview] :::built
    F[Roadmap Gen /roadmap] :::built
    G[Resume Builder /resume-builder] :::built
    H[Sandbox Compiler] :::planned

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
- **Resume Upload & Audit (`/resume-optimizer`):** Custom drag-and-drop file upload component supporting PDF and DOCX, a visual check checklist divided into 5 groups (ATS Essentials, Content, Red Flags, Sections, Job Tailoring), and automated evaluation summary page showing ATS scores, strengths, weaknesses, and missing skills.
- **Resume Builder (`/resume-builder`):** Structured resume form with templates, theme selectors, live preview pane, and vector PDF compilation downloads.
- **User Profile (`/profile`):** Multi-step user profile management allowing edits to personal information, skills chips, experience logs, and educational background.
- **Mock Interview Console (`/interview`):** Dashboard setup and live workspace routing candidates through typing chat, voice mode (mic orb), or coding module with Monaco editor and test cases, followed by post-interview evaluation report cards.
- **Career Roadmap Builder (`/roadmap`):** Visual path timelines rendering milestones, ETA bounds, skill prerequisite tags, and learning resources.

### Built Backend Services
- **Auth Service:** Registration, Login, logout, and token validation middlewares (`/api/auth`).
- **Profile Service:** GET/PUT endpoints to fetch and update user records including nested arrays (`/api/users`).
- **Resume parsing & analysis:** Server-side file reception (`multer`), doc reader (`pdf-parse`, `mammoth`), and Google Gemini model integration (`/api/resume/analyze`).
- **Interview Service:** Session setup checker, start handlers, answer graders, and session termination/evaluation controllers (`/api/interviews`).

### Planned Features & Screens
- **Code Execution Sandbox Compiler:** Sandboxed container execution engine (e.g., Docker or Judge0 API Integration) to evaluate custom code submissions in virtualised sandboxes rather than mockup validation.
- **Low-Latency WebRTC Speech:** Native WebRTC audio stream connections for near zero-latency voice conversations during live mock interviews.

---

## 4. Page Map

| Route | Purpose | Modules / Code Coverage | Connected Pages | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Application Home / Landing | `frontend/src/app/page.tsx`, `home.module.css` | `/auth`, `/profile`, `/resume-optimizer` | **Built** |
| `/auth` | Authentication Entry | `frontend/src/app/auth/page.tsx`, `auth.module.css` | `/` | **Built** |
| `/profile` | Profile View & Customization | `frontend/src/app/profile/page.tsx`, `profile.module.css` | `/`, `/resume-optimizer` | **Built** |
| `/resume-optimizer` | Upload, Parse & Audit Resume | `frontend/src/app/resume-optimizer/page.tsx`, `resume-optimizer/` | `/`, `/profile`, `/resume-builder` | **Built** |
| `/resume-builder` | Structural Resume Document Builder | `frontend/src/app/resume-builder/page.tsx`, `resume-builder/` | `/profile` | **Built** |
| `/interview` | Interactive AI Mock Interview | `frontend/src/app/interview/page.tsx`, `interview/` (setup, live-interview, results) | `/profile` | **Built** |
| `/roadmap` | Career Timeline & Goals | `frontend/src/app/roadmap/page.tsx`, `roadmap/` | `/profile` | **Built** |
| `/pricing` | Dynamic Subscription Pricing Plans | `frontend/src/app/pricing/page.tsx`, `pricing/` | `/` | **Built** |

---

## 5. Component Tree (Shared Components)

All shared components are currently housed in `frontend/src/app/components`:
```
frontend/src/app/components/
├── BorderGlow.tsx         # Renders animated high-impact border lighting
├── HomeBackdrop.tsx       # Standard home screen background animation particles
├── Navbar.tsx             # Unified top navbar containing navigation and page links
├── ScrollToTop.tsx        # Inset utility to scroll user back to top
├── ShinyText.tsx          # Styling wrapper component for shiny/glowing text effects
├── SiteFooter.tsx         # Unified footer containing layout links and legal notices
├── SiteFooter.module.css  # Footer layout styles
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
- **`POST /download`** (Protected)
  - **Description:** Triggers Puppeteer PDF compiling/rendering download task of the current resume state.

### 4. Mock Interview Routes (`/api/interviews`)
- **`GET /check-session-name`** (Protected)
  - **Description:** Verifies whether a given session name is already used by the candidate.
  - **Params:** `?name=string`
  - **Response:** `{ success: true, exists: boolean }`
- **`POST /start`** (Protected)
  - **Description:** Creates an in-progress Interview session document and yields the first question prompt.
  - **Body:** `{ company, role, level, questionTypes, totalQuestions, sessionName }`
  - **Response:** `{ success: true, session: { _id, company, role, questions: [...] }, question: string }`
- **`POST /:id/submit`** (Protected)
  - **Description:** Submits the user's text answer, invokes Gemini for scoring/feedback of the answer, and generates the next question.
  - **Body:** `{ answer }`
  - **Response:** `{ success: true, feedback, score, nextQuestion, isFinished }`
- **`POST /:id/end`** (Protected)
  - **Description:** Gracefully terminates the session, triggers global evaluation analysis metrics via Gemini, and marks the status as completed.
  - **Response:** `{ success: true, overallScore, metrics: { technicalAccuracy, communication, problemSolving } }`
- **`GET /:id`** (Protected)
  - **Description:** Fetches all details, questions, answers, and scores for a specific completed session.

---

## 7. AI Integration Points

### Resume Audit (`/api/resume/analyze`)
- **Model:** `gemini-2.5-flash`
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

Interview Document (Mongoose Schema)
├── _id: ObjectId
├── user: ObjectId (ref: 'User', required)
├── company: String (required)
├── role: String (required)
├── level: String (required)
├── questionTypes: [ String ]
├── questions: [
│   ├── questionText: String
│   ├── type: String
│   ├── userAnswer: String
│   ├── score: Number
│   ├── feedback: String
│   ├── strongAnswer: String
│   └── competencies: [ String ]
│   ]
├── currentQuestionIndex: Number
├── totalQuestions: Number
├── overallScore: Number
├── metrics:
│   ├── technicalAccuracy: Number
│   ├── communication: Number
│   └── problemSolving: Number
├── status: String ("in-progress" | "completed")
├── sessionName: String
└── timestamps (createdAt, updatedAt)
```

---

## 9. Known Issues & Gaps
1. **Resume Database Persistence:** While the backend successfully parses files and returns structured evaluation details, the extracted skills, experience data, and score summaries are **not** auto-persisted to the active User document in MongoDB. The user must copy or submit these details separately on the Profile page to update their record.
2. **Text Layout Scrambling:** Basic PDF text extraction (`pdf-parse`) can occasionally scramble strings in multi-column, complex layout resume designs, reducing the accuracy of the Gemini parsed JSON.
3. **Session Refresh Token Missing:** The authentication system relies on a single JWT token valid for 7 days. There is no active token rotation/refresh flow configured.

---

## 10. Next Priority Build Order

1. **Step 1: Automated Resume Sync**
   - Modify the `/api/resume/analyze` handler to automatically write the extracted skills, education, and experience fields directly to the user's Mongoose record on successful evaluation.
2. **Step 2: Coding Sandbox Compiler Sandbox**
   - Move from client-side Monaco mockup validations to a sandboxed execution runtime environment (e.g. Judge0 API or docker containers) to run active code test cases safely.
3. **Step 3: Low-Latency WebRTC Voice**
   - Shift the voice mock interview from client-side Web Audio chunks transcribed on REST calls to a WebRTC audio streaming connection for fluid, low-latency conversational turns.
