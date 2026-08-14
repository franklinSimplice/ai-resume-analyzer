# ResumeEly - Remaining Functionalities Roadmap

This document outlines the remaining features, enhancements, and technical tasks to complete for the AI Resume Analyzer & Creator (`ResumeEly`).

---

## 1. 🎨 Theme & Template Customization (Frontend & Studio)

- [ ] **Customizer Studio Integration (`app/components/Templates/CustomizerStudio.tsx`)**
  - Connect dynamic controls for typography (Serif vs Sans-Serif fonts).
  - Implement dynamic color palette selection (Default, Modern Navy, Executive Charcoal, Creative Emerald).
  - Add spacing preference toggles (Compact, Comfortable, Spacious).
- [ ] **Drag-and-Drop Section Reordering**
  - Allow users to reorder resume sections (Header, Summary, Experience, Projects, Skills, Education).
- [ ] **Real-time Live Preview**
  - Instant re-rendering of template preview as form fields or customization parameters change.

---

## 2. 📄 Advanced Export & Formatting

- [ ] **Native PDF Export**
  - Implement direct browser-side `.pdf` generation (using `html2pdf.js`, `@react-pdf/renderer`, or `jspdf`) ensuring high-resolution layout fidelity and selectable text for ATS parsers.
- [ ] **Print-Optimized Stylesheet**
  - Add `@media print` rules for clean single-page / multi-page pagination without orphan headers.
- [ ] **Export Options Expansion**
  - Support JSON resume schema export/import (`jsonresume` standard).

---

## 3. 🤖 AI Capabilities Expansion

- [ ] **AI Cover Letter Generator**
  - Generate tailored cover letters matching the applicant's experience and targeted job description.
- [ ] **Industry Keyword & Skill Gap Analysis**
  - Interactive pill suggestions for missing technical and soft skills identified during ATS analysis.
- [ ] **LinkedIn Profile Optimizer**
  - Generate optimized LinkedIn headlines, about/summary sections, and key accomplishment bullet points.
- [ ] **Resume Version Comparison Tool**
  - Side-by-side diff comparison tool to track changes between original resume uploads and AI-generated variants.
- [ ] **AI Interview Question Generator**
  - Generate customized technical and behavioral interview questions derived from bullet points in the generated resume.

---

## 4. ⚙️ Backend Integration & Authentication Polish

- [ ] **Full Django REST API Integration (`app/lib/api.ts`)**
  - Complete backend endpoints connection for `/api/auth/`, `/api/resumes/create/`, and `/api/resumes/analyze/`.
- [ ] **Authentication State Synchronization**
  - Ensure JWT token persistence, auto-refresh tokens, and seamless user login/signup handling between React Router frontend and Django backend.
- [ ] **Cloud File & Image Storage**
  - Migrate PDF uploads and preview images from local storage paths to cloud storage (e.g. Supabase Storage or AWS S3).
- [ ] **AI Provider Resilience**
  - Implement robust fallback logic between primary NVIDIA API endpoint, Google Gemini API, and Puter AI backend.

---

## 5. 👥 UX & Collaboration Features

- [ ] **Resume Shareable Links**
  - Enable users to generate public viewable links for hosted resumes with optional password protection.
- [ ] **Career Coach / Peer Comments**
  - Allow feedback comments and suggestions on shared resume drafts.

---

## 🗺️ Suggested Implementation Order

### Phase 1: Core Experience & Export (High Priority)
1. Native PDF Export functionality.
2. Complete `CustomizerStudio.tsx` theme & font controls.
3. Django REST API Auth & Resume store sync.

### Phase 2: AI Enhancements (Medium Priority)
1. AI Cover Letter Generator.
2. Skill Gap & Keyword Suggestions.
3. LinkedIn Profile Optimizer.

### Phase 3: Sharing & Analytics (Future Phase)
1. Version Comparison & ATS score history tracking.
2. Public shareable links and coaching notes.
