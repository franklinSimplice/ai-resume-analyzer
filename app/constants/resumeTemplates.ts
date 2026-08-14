// Resume templates and generation prompts for ATS optimization

export const RESUME_TEMPLATES = {
  professional: {
    name: "Professional",
    description: "Clean and traditional format optimized for ATS systems",
    structure: ["Contact Info", "Professional Summary", "Work Experience", "Skills", "Education"],
    prompt: `
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 80% on ATS systems using the Professional format.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

Please create a resume with this structure:
1. CONTACT INFORMATION
2. PROFESSIONAL SUMMARY
3. WORK EXPERIENCE
4. SKILLS
5. EDUCATION

Guidelines:
- Use clear section headings in uppercase
- No columns, tables, or complex formatting
- Include relevant keywords from the job description
- Highlight achievements with metrics when possible
- Use reverse chronological order for work experience
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.
`
  },
  modern: {
    name: "Modern",
    description: "Contemporary styling with ATS-friendly formatting",
    structure: ["Contact Info", "Professional Summary", "Core Competencies", "Work Experience", "Skills", "Education"],
    prompt: `
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 80% on ATS systems using the Modern format.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

Please create a resume with this structure:
1. CONTACT INFORMATION
2. PROFESSIONAL SUMMARY
3. CORE COMPETENCIES
4. WORK EXPERIENCE
5. SKILLS
6. EDUCATION

Guidelines:
- Use clear section headings in uppercase
- No columns, tables, or complex formatting
- Include relevant keywords from the job description
- Highlight technical skills prominently
- Use bullet points for achievements
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.
`
  },
  executive: {
    name: "Executive",
    description: "Senior-level presentation optimized for leadership roles",
    structure: ["Contact Info", "Executive Summary", "Key Accomplishments", "Professional Experience", "Leadership Skills", "Education"],
    prompt: `
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 80% on ATS systems using the Executive format.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

Please create a resume with this structure:
1. CONTACT INFORMATION
2. EXECUTIVE SUMMARY
3. KEY ACCOMPLISHMENTS
4. PROFESSIONAL EXPERIENCE
5. LEADERSHIP SKILLS
6. EDUCATION

Guidelines:
- Use clear section headings in uppercase
- No columns, tables, or complex formatting
- Focus on leadership achievements and strategic impact
- Include quantifiable results wherever possible
- Emphasize management and executive experience
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.
`
  },
  software_engineering: {
    name: "Software Engineering",
    description: "Specialized format for software engineers with technical focus",
    structure: ["Contact Info", "Professional Summary", "Work Experience", "Education", "Skills"],
    prompt: `
You are an expert technical recruiter and resume writer specializing in Software Engineering resumes. 
Your task is to create a minimalist, high-impact resume optimized for 7-second recruiter scans and ATS compatibility.

Follow this EXACT visual structure with the specified alignments:

CONTACT INFORMATION
Name: [Full Name]
Location: [City, State]
Phone: [Phone Number]
Email: [Email Address]
LinkedIn: [LinkedIn Profile URL]
GitHub: [GitHub Profile URL]

PROFESSIONAL SUMMARY
[Write a concise 3-4 sentence summary highlighting technical expertise, key achievements, and career objectives. Focus on measurable skills and experiences relevant to software engineering roles.]

WORK EXPERIENCE

[Job Title]
[Company Name], [City, State]
[Start Date] – [End Date]
- [Achievement-focused bullet point using the X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z]]
- [Another achievement with quantifiable results]
- [Technical skills and tools used in this role]

[Previous Job Title]
[Previous Company Name], [City, State]
[Start Date] – [End Date]
- [Achievement-focused bullet point]
- [Another achievement with metrics]

EDUCATION

[University Name] | [City, State]
[Bachelor/Master] of Science in [Major] | [Expected Graduation Date]
[Relevant concentrations or honors if applicable]
Relevant Coursework: [List of relevant courses separated by commas]
[Optional: Technical Honors or achievements]

SKILLS

Languages: [Programming languages separated by commas]

Frameworks & Libraries: [Frameworks and libraries separated by commas]

Cloud & DevOps: [Cloud platforms, DevOps tools separated by commas]

Databases: [Database technologies separated by commas]

Tools & Platforms: [Development tools, IDEs, platforms separated by commas]

Foundational: [Foundational computer science concepts separated by commas]

JOB TITLE: {{jobTitle}}
JOB DESCRIPTION: {{jobDescription}}

CANDIDATE BACKGROUND:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

Important Guidelines:
1. Follow the EXACT structure and alignment shown above
2. Use left-aligned text throughout
3. Use bullet points with hyphens for experience items
4. Include quantifiable metrics in every experience bullet point
5. Focus on technical achievements and skills
6. Keep the resume concise (1 page preferred)
7. Use clear, professional language without subjective descriptors
8. Prioritize technical skills and project outcomes
9. Remove any non-technical "fluff" sections
10. Ensure ATS compatibility by avoiding graphics, tables, or columns

RETURN ONLY THE RESUME CONTENT IN THE EXACT FORMAT SHOWN ABOVE WITHOUT ANY ADDITIONAL EXPLANATIONS.
`
  },
  marketing: {
    name: "Marketing & Growth",
    description: "Focused on KPIs, campaigns, and growth metrics",
    structure: ["Contact Info", "Professional Summary", "Key Marketing Metrics", "Work Experience", "Education", "Skills"],
    prompt: `
You are an expert Marketing recruiter and growth strategist.
Create a high-impact, results-driven resume optimized for Marketing and Growth roles.

Structure:
1. CONTACT INFORMATION
2. PROFESSIONAL SUMMARY (Focus on growth, branding, and ROI)
3. KEY MARKETING METRICS (Highlight top-line results with numbers: e.g., "Increased organic traffic by 45%")
4. WORK EXPERIENCE (Focus on campaigns, platforms used, and team leadership)
5. EDUCATION
6. SKILLS (Tools like Google Analytics, HubSpot, Salesforce, SEO/SEM tools)

Guidelines:
- Emphasize quantifiable achievements (e.g., increased conversion rates, ROI, revenue growth)
- Use strong action verbs (e.g., Spearheaded, Orchestrated, Optimized, Drove)
- Focus on both high-level strategy and tactical execution
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.
`
  },
  finance: {
    name: "Finance & Analysis",
    description: "Focused on financial modeling, compliance, and analysis",
    structure: ["Contact Info", "Professional Summary", "Key Financial Skills", "Professional Experience", "Education", "Certifications"],
    prompt: `
You are an expert Financial recruiter.
Create a professional, analytical resume optimized for Finance, Banking, or Accounting roles.

Structure:
1. CONTACT INFORMATION
2. PROFESSIONAL SUMMARY (Focus on analytical rigor, financial oversight, and compliance)
3. KEY FINANCIAL SKILLS (Financial modeling, audit, risk assessment, valuation)
4. PROFESSIONAL EXPERIENCE (Focus on reporting, budget management, and financial analysis)
5. EDUCATION
6. CERTIFICATIONS (CFA, CPA, etc.)

Guidelines:
- Emphasize accuracy, compliance, and strategic financial impact
- Use technical terminology relevant to finance (e.g., P&L, EBITDA, risk management)
- Highlight proficiency in tools like Excel, Bloomberg, SAP, SQL
- Maintain a highly formal and professional tone
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.
`
  }
};

export const ATS_OPTIMIZATION_PROMPT = `
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 80% on ATS systems.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

Please create a resume that:
1. Is optimized for ATS systems (no columns, tables, or complex formatting)
2. Includes relevant keywords from the job description
3. Uses a clean, professional structure
4. Highlights relevant experience and skills
5. Is formatted as plain text with clear section headings

Return ONLY the resume content without any additional explanations.
`;

export const RESUME_SECTIONS = {
  contactInfo: "CONTACT INFORMATION",
  summary: "PROFESSIONAL SUMMARY",
  experience: "WORK EXPERIENCE",
  skills: "SKILLS",
  education: "EDUCATION",
  accomplishments: "KEY ACCOMPLISHMENTS"
};

// Customizable themes
export const RESUME_THEMES = {
  default: {
    name: "Default",
    colors: {
      primary: "blue",
      secondary: "slate"
    },
    fontFamily: "sans",
    spacing: "normal"
  },
  modern: {
    name: "Modern",
    colors: {
      primary: "indigo",
      secondary: "gray"
    },
    fontFamily: "sans",
    spacing: "compact"
  },
  classic: {
    name: "Classic",
    colors: {
      primary: "gray",
      secondary: "zinc"
    },
    fontFamily: "serif",
    spacing: "comfortable"
  },
  creative: {
    name: "Creative",
    colors: {
      primary: "purple",
      secondary: "stone"
    },
    fontFamily: "sans",
    spacing: "spacious"
  }
};
