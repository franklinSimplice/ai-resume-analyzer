// Resume templates and generation prompts for ATS optimization

const STANDARD_ATS_FORMAT_INSTRUCTIONS = `
WRITING & GENERATION GUIDELINES (MANDATORY):
1. COMPLETELY DYNAMIC & TAILORED AI WRITING:
   - You MUST write authentic, original, high-impact resume content tailored specifically to the candidate's background and the target job description.
   - NEVER output generic placeholder text or repeat fixed template sentences across different candidates.
   - In the CAREER SUMMARY, craft 2-3 engaging, powerful sentences summarizing the candidate's distinct expertise, technical strengths, and value proposition for the target role.
   - For every role in PROFESSIONAL EXPERIENCE, expand the user's input into strong bullet points using the STAR method (Action Verb + Technical Context + Quantified Business/Engineering Impact).
   - Categorize the SKILLS logically (e.g. Languages, Frameworks, Cloud & Tools, Methodologies).

2. REQUIRED SECTION STRUCTURE & PLAIN TEXT LAYOUT:
   Generate the resume in clean plain text matching this visual hierarchy so our layout engine can style font size, alignment, and spacing:

Name: [Candidate Full Name]
Contact: [City, State] | [Phone Number] | [Email Address] | [LinkedIn URL]

CAREER SUMMARY
[Dynamic, tailored 2-3 sentence career summary crafted by AI for this candidate and target job.]

PROFESSIONAL EXPERIENCE

[Company Name]
[City, State]
[Job Title]
[Start Date] - [End Date]
• [Dynamic AI-written achievement bullet point with action verb and quantified outcome]
• [Dynamic AI-written technical execution bullet point with tools and responsibilities]
• [Dynamic AI-written problem solved or system scaled]

EDUCATION

[University Name]
[City, State]
[Degree Name, e.g. Bachelor of Science in Computer Science]
[Graduation Date, e.g. May 2021]

SKILLS & CERTIFICATIONS
Skills: [Categorized technical and professional skills separated by category and commas]
Certifications: [Relevant certifications, or omit if none]

Formatting Rules:
1. Always put PROFESSIONAL EXPERIENCE before EDUCATION.
2. Section headers must be in ALL CAPS: CAREER SUMMARY, PROFESSIONAL EXPERIENCE, EDUCATION, SKILLS & CERTIFICATIONS.
3. Every experience bullet must start with "• ".
4. Return ONLY the resume content in plain text with no markdown asterisks (**bold**), hashtags (#), or code fences.
`;

export const RESUME_TEMPLATES = {
  professional: {
    name: "Professional",
    description: "Clean and traditional format with Professional Experience followed by Education",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are an expert ATS (Applicant Tracking System) resume writer.
Create a top-tier resume scoring 90%+ on ATS scanners based on candidate details and target job.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  },
  modern: {
    name: "Modern",
    description: "Contemporary styling with strong technical keywords and clean structure",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are an expert technical resume architect.
Create a modern, keyword-rich ATS-optimized resume.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  },
  executive: {
    name: "Executive",
    description: "Leadership-focused format highlighting strategic impact and accomplishments",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are an executive resume writer specializing in leadership, VP, and Director level positioning.
Create a high-impact ATS resume emphasizing strategic leadership, revenue/efficiency metrics, and organizational growth.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  },
  software_engineering: {
    name: "Software Engineering",
    description: "High-density technical format optimized for engineering scans and ATS filters",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are a Staff Technical Recruiter and Engineering Resume Specialist.
Create a high-impact software engineering resume highlighting technical stack, architecture, and quantified business impact.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  },
  marketing: {
    name: "Marketing & Growth",
    description: "Focused on KPIs, revenue metrics, campaigns, and user acquisition",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are a growth marketing recruiter.
Create an ATS resume emphasizing customer acquisition, ROI, conversion rates, and campaign performance.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  },
  finance: {
    name: "Finance & Analysis",
    description: "Focused on financial modeling, compliance, reporting, and audit",
    structure: ["Contact Info", "Career Summary", "Professional Experience", "Education", "Skills & Certifications"],
    prompt: `
You are a Senior Financial Recruiter.
Create an ATS resume emphasizing financial analysis, accounting rigor, budgeting, and compliance.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any introductory or concluding text.
`
  }
};

export const ATS_OPTIMIZATION_PROMPT = `
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 90% on ATS systems.

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}

Candidate Information:
Experience: {{experience}}
Skills: {{skills}}
Education: {{education}}

${STANDARD_ATS_FORMAT_INSTRUCTIONS}

Return ONLY the resume content without any additional explanations.
`;

export const RESUME_SECTIONS = {
  contactInfo: "CONTACT INFORMATION",
  summary: "CAREER SUMMARY",
  experience: "PROFESSIONAL EXPERIENCE",
  education: "EDUCATION",
  skills: "SKILLS & CERTIFICATIONS"
};

// Customizable themes
export const RESUME_THEMES = {
  default: {
    name: "Classic Academic",
    colors: {
      primary: "black",
      secondary: "zinc"
    },
    fontFamily: "serif",
    spacing: "normal"
  },
  modern: {
    name: "Modern Clean",
    colors: {
      primary: "black",
      secondary: "gray"
    },
    fontFamily: "sans",
    spacing: "compact"
  },
  classic: {
    name: "Standard Serif",
    colors: {
      primary: "black",
      secondary: "zinc"
    },
    fontFamily: "serif",
    spacing: "comfortable"
  }
};
