import { RESUME_TEMPLATES, ATS_OPTIMIZATION_PROMPT } from '~/constants';

interface ResumeData {
  jobTitle: string;
  jobDescription: string;
  experience: string;
  skills: string;
  education: string;
  template: string;
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  citizenship?: string;
}

/**
 * Generates an ATS-optimized resume using AI
 * @param resumeData Object containing job and candidate information
 * @returns Promise resolving to the generated resume text
 */
export async function generateResume(resumeData: ResumeData): Promise<string> {
  // Get the template-specific prompt or fall back to default
  const template = RESUME_TEMPLATES[resumeData.template as keyof typeof RESUME_TEMPLATES] || RESUME_TEMPLATES.professional;
  let prompt = template.prompt || ATS_OPTIMIZATION_PROMPT;
  
  // Replace placeholders in the prompt template
  prompt = prompt
    .replace('{{jobTitle}}', resumeData.jobTitle)
    .replace('{{jobDescription}}', resumeData.jobDescription)
    .replace('{{experience}}', resumeData.experience)
    .replace('{{skills}}', resumeData.skills)
    .replace('{{education}}', resumeData.education);

  // If personal details are provided, append them to the prompt so the AI uses them instead of placeholders
  const personalInfo = [
    resumeData.name ? `Name: ${resumeData.name}` : '',
    resumeData.email ? `Email: ${resumeData.email}` : '',
    resumeData.phone ? `Phone: ${resumeData.phone}` : '',
    resumeData.linkedin ? `LinkedIn: ${resumeData.linkedin}` : '',
    resumeData.github ? `GitHub: ${resumeData.github}` : '',
    resumeData.citizenship ? `Citizenship: ${resumeData.citizenship}` : ''
  ].filter(Boolean).join('\n');

  if (personalInfo) {
    prompt += `\n\nCRITICAL: You MUST use the following EXACT candidate information for the Contact Information section. Do not use placeholders like John Doe:\n${personalInfo}`;
  }

  return prompt;
}

/**
 * Formats resume data into a structured object for storage
 * @param resumeData Object containing job and candidate information
 * @param resumeContent The generated resume text
 * @returns Formatted object for storage
 */
export function formatResumeForStorage(resumeData: ResumeData, resumeContent: string) {
  return {
    id: Math.random().toString(36).substring(2, 15),
    jobTitle: resumeData.jobTitle,
    jobDescription: resumeData.jobDescription,
    experience: resumeData.experience,
    skills: resumeData.skills,
    education: resumeData.education,
    template: resumeData.template,
    resumeContent: resumeContent,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates a downloadable blob from resume text
 * @param resumeText The resume content
 * @param filename Desired filename
 * @returns Blob object and download function
 */
export function createResumeBlob(resumeText: string, filename: string) {
  if (filename.toLowerCase().endsWith('.pdf')) {
    console.error('Error: createResumeBlob cannot generate valid PDF files. Use the print-to-pdf method instead.');
    throw new Error('PDF creation not supported via blob fallback');
  }
  const blob = new Blob([resumeText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const download = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return { blob, download };
}