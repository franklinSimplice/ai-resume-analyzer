// Resume templates and generation prompts for ATS optimization

const STANDARD_ATS_FORMAT_INSTRUCTIONS = `
Follow this EXACT visual structure:

Name: [Candidate Full Name]
Contact: [City, State] | [Phone Number] | [Email Address] | [LinkedIn URL]

CAREER SUMMARY
[Concise 2-3 sentence career summary highlighting core expertise, background, domain experience, and key value proposition.]

PROFESSIONAL EXPERIENCE

[Company Name]
[City, State]
[Job Title]
[Start Date] - [End Date]
• [Action verb + achievement with quantified impact and metrics]
• [Action verb + technical responsibility and tools used]
• [Action verb + problem solved, system scaled, or project delivered]

[Previous Company Name]
[City, State]
[Previous Job Title]
[Start Date] - [End Date]
• [Action verb + achievement with quantified metrics]
• [Action verb + key responsibility and outcomes]

EDUCATION

[University Name]
[City, State]
[Degree Name, e.g. Bachelor of Science in Computer Information Technology]
[Graduation Date, e.g. August 2019]

SKILLS & CERTIFICATIONS
Skills: [Categorized skills, e.g. Core Skills, Languages, Frameworks, Tools, Soft Skills separated by commas]
Certifications: [Relevant certifications separated by commas, or omit if none]

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
