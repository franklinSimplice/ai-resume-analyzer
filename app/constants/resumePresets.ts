export interface ResumePreset {
  id: string;
  name: string;
  description: string;
  layout: 'professional' | 'modern' | 'executive' | 'software_engineering';
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  margin: string;
  tag: string;
  atsRating: number;
}

export const RESUME_PRESETS: Record<string, ResumePreset> = {
  tech_startup: {
    id: "tech_startup",
    name: "Tech Startup",
    description: "Tailored for software engineering and technical roles, maximizing screen-scannability and bullet density.",
    layout: "software_engineering",
    primaryColor: "#0d9488", // Tech Teal
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: "10pt",
    lineHeight: "1.15",
    margin: "0.5in",
    tag: "RECOMMENDED FOR TECH",
    atsRating: 99
  },
  corporate_executive: {
    id: "corporate_executive",
    name: "Corporate Executive",
    description: "Designed for leadership and management roles, emphasizing accomplishments with elegant spacing.",
    layout: "executive",
    primaryColor: "#0f172a", // Deep Navy Slate
    fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
    fontSize: "10.5pt",
    lineHeight: "1.3",
    margin: "0.75in",
    tag: "RECOMMENDED FOR LEADERSHIP",
    atsRating: 96
  },
  minimalist_scholar: {
    id: "minimalist_scholar",
    name: "Minimalist Scholar",
    description: "A traditional, academic layout utilizing highly standardized and time-tested typography.",
    layout: "professional",
    primaryColor: "#1e293b", // Charcoal Black
    fontFamily: '"Times New Roman", Times, Baskerville, Georgia, serif',
    fontSize: "11pt",
    lineHeight: "1.2",
    margin: "0.6in",
    tag: "CLASSIC & TRADITIONAL",
    atsRating: 98
  },
  modern_creative: {
    id: "modern_creative",
    name: "Modern Creative",
    description: "A clean, eye-catching layout featuring indigo accents and minimalist modern geometry.",
    layout: "modern",
    primaryColor: "#4f46e5", // Indigo Accent
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: "10pt",
    lineHeight: "1.25",
    margin: "0.5in",
    tag: "BEST FOR CREATIVES",
    atsRating: 95
  }
};
