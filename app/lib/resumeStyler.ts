/**
 * Resume styling utility to convert basic resume content into beautifully formatted HTML
 * Following exact user-provided formatting and CSS layout
 */

interface StyledResumeOptions {
  theme?: string;
  fontFamily?: string;
  fontSize?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lineHeight?: string;
  margin?: string;
  fragmentOnly?: boolean;
  layout?: string;
  /** Dynamic section render order. e.g. ['contact','summary','experience','projects','skills','education'] */
  sectionOrder?: string[];
}

/** Default section order used when none is explicitly provided */
export const DEFAULT_SECTION_ORDER: string[] = [
  'contact',
  'summary',
  'experience',
  'projects',
  'skills',
  'education',
  'leadership',
];

/** Per-preset recommended section orders */
export const PRESET_SECTION_ORDERS: Record<string, string[]> = {
  professional: ['contact', 'summary', 'experience', 'projects', 'skills', 'education'],
  modern: ['contact', 'summary', 'skills', 'experience', 'projects', 'education'],
  executive: ['contact', 'summary', 'projects', 'experience', 'skills', 'education'],
  software_engineering: ['contact', 'summary', 'experience', 'projects', 'education', 'skills'],
};

function resolveOptions(options: StyledResumeOptions = {}): StyledResumeOptions {
  const theme = options.theme || '';
  if (theme && typeof theme === 'string' && theme.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(theme);
      if (parsed && typeof parsed === 'object') {
        const resolvedLayout = parsed.layout || 'professional';
        return {
          theme: resolvedLayout,
          fontFamily: parsed.fontFamily,
          fontSize: parsed.fontSize,
          primaryColor: parsed.primaryColor,
          lineHeight: parsed.lineHeight,
          margin: parsed.margin,
          fragmentOnly: options.fragmentOnly,
          // Prefer explicitly passed sectionOrder, fallback to preset, then default
          sectionOrder: options.sectionOrder ||
            (parsed.sectionOrder as string[] | undefined) ||
            PRESET_SECTION_ORDERS[resolvedLayout] ||
            DEFAULT_SECTION_ORDER,
        };
      }
    } catch (e) {
      // Ignore parsing errors and return options as-is
    }
  }
  // Populate sectionOrder from preset if not provided
  const layoutKey = options.theme || options.layout || 'professional';
  return {
    ...options,
    sectionOrder: options.sectionOrder ||
      PRESET_SECTION_ORDERS[layoutKey] ||
      DEFAULT_SECTION_ORDER,
  };
}

export function styleResumeContent(resumeContent: string, options: StyledResumeOptions = {}) {
  const resolved = resolveOptions(options);
  const sections = parseResumeContent(resumeContent);
  const styledHtml = generateStyledHtml(sections, resolved);
  return styledHtml;
}

export function getResumeFragment(resumeContent: string, options: StyledResumeOptions = {}) {
  const resolved = resolveOptions(options);
  const sections = parseResumeContent(resumeContent);
  const css = generateCss(resolved);
  return `
    <style>${css}</style>
    <div class="resume-container">
        ${generateLayoutSections(sections, resolved.sectionOrder)}
    </div>
  `;
}

function parseResumeContent(content: string) {
  const lines = (content || '').split('\n');
  const sections: Record<string, string[]> = {
    contact: [],
    summary: [],
    experience: [],
    education: [],
    projects: [],
    leadership: [],
    skills: []
  };
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;
    
    const upperContent = trimmedLine.toUpperCase();
    
    // Improved detection with more variants
    if (upperContent.match(/CONTACT|PERSONAL INFO/)) {
      currentSection = 'contact';
    } else if (upperContent.match(/SUMMARY|PROFILE|OBJECTIVE/)) {
      currentSection = 'summary';
    } else if (upperContent.match(/EXPERIENCE|WORK HISTORY|EMPLOYMENT/)) {
      currentSection = 'experience';
    } else if (upperContent.match(/PROJECTS/)) {
      currentSection = 'projects';
    } else if (upperContent.match(/LEADERSHIP|ACTIVITIES|VOLUNTEER/)) {
      currentSection = 'leadership';
    } else if (upperContent.match(/EDUCATION/)) {
      currentSection = 'education';
    } else if (upperContent.match(/SKILLS|COMPETENCIES|TECHNOLOGIES/)) {
      currentSection = 'skills';
    } else {
      // If we haven't found a section yet, default to summary or the previous one
      if (!currentSection) {
          // If it looks like a name/contact info but no header was found
          if (trimmedLine.includes('@') || trimmedLine.match(/\d{3}/)) {
              currentSection = 'contact';
          } else {
              currentSection = 'summary';
          }
      }
      sections[currentSection as keyof typeof sections].push(line);
    }
  }
  
  return sections;
}

/** Section title labels shown in the rendered resume */
const SECTION_TITLES: Record<string, string> = {
  contact: '',
  summary: 'PROFESSIONAL SUMMARY',
  experience: 'WORK EXPERIENCE',
  projects: 'PROJECTS',
  skills: 'SKILLS',
  education: 'EDUCATION',
  leadership: 'LEADERSHIP & ACTIVITIES',
};

/**
 * Dynamically renders resume sections in the order specified by `sectionOrder`.
 * Falls back to DEFAULT_SECTION_ORDER if none is provided.
 */
function generateLayoutSections(
  sections: Record<string, string[]>,
  sectionOrder?: string[]
): string {
  const order = sectionOrder || DEFAULT_SECTION_ORDER;

  return order
    .map((key) => {
      const lines = sections[key as keyof typeof sections] || [];
      if (!lines || lines.length === 0) return '';

      switch (key) {
        case 'contact':
          return generateContactSection(lines);
        case 'summary':
          return generateSummarySection(lines, SECTION_TITLES.summary);
        case 'experience':
          return generateExperienceSection(lines, SECTION_TITLES.experience);
        case 'projects':
          return generateExperienceSection(lines, SECTION_TITLES.projects);
        case 'skills':
          return generateSkillsSection(lines, SECTION_TITLES.skills);
        case 'education':
          return generateEducationSection(lines);
        case 'leadership':
          return generateExperienceSection(lines, SECTION_TITLES.leadership);
        default:
          // Unknown section: render as a generic experience block
          return generateExperienceSection(lines, (SECTION_TITLES[key] || key).toUpperCase());
      }
    })
    .join('\n');
}

function generateStyledHtml(sections: Record<string, string[]>, options: StyledResumeOptions) {
  const css = generateCss(options);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Resume</title>
    <style>
        ${css}
    </style>
</head>
<body>
    <div class="resume-container">
        ${generateLayoutSections(sections, options.sectionOrder)}
    </div>
</body>
</html>`;

  return htmlContent;
}

function generateCss(options: StyledResumeOptions) {
  const { 
    fontFamily = '"Times New Roman", Times, serif', 
    fontSize = '10pt', 
    primaryColor = 'black',
    lineHeight = '1.2',
    margin = '0.5in'
  } = options;
  return `
/* style.css */
.resume-container {
    background-color: white;
    width: 8.5in; /* Standard Letter Size */
    min-height: 11in;
    padding: ${margin};
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    text-align: left;
    font-family: ${fontFamily};
    line-height: ${lineHeight};
    color: ${primaryColor};
    font-size: ${fontSize};
}

.header {
    text-align: center;
    margin-bottom: 15px;
}

.header h1 {
    margin: 0;
    font-size: 1.8em;
    text-transform: none;
}

.header p {
    margin: 5px 0;
    font-size: 1em;
}

.section-title {
    font-size: 1.1em;
    font-weight: bold;
    border-bottom: 1px solid ${primaryColor};
    margin: 15px 0 5px 0;
    padding-bottom: 2px;
    color: ${primaryColor};
}

.entry-subheader span,
.entry-header span {
    font-weight: bold;
}

.entry {
    margin-bottom: 10px;
}

.entry-header, .entry-subheader {
    display: flex;
    justify-content: space-between;
    font-size: 1.05em;
}

.entry-header {
    margin-top: 5px;
}

ul {
    margin: 5px 0;
    padding-left: 25px;
}

li {
    font-size: 1em;
    margin-bottom: 2px;
}

p {
    font-size: 1em;
    margin: 5px 0;
}

a {
    color: ${primaryColor};
    text-decoration: none;
}

/* Print-specific styles */
@media print {
    .resume-container {
        width: 100%;
        min-height: auto;
        padding: 0;
        box-shadow: none;
        margin: 0;
    }
}
`;
}

function generateContactSection(lines: string[]): string {
  if (lines.length === 0) return '';
  
  let name = '';
  const meta: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('Name:')) {
      name = trimmed.replace('Name:', '').trim();
    } else if (trimmed.startsWith('Email:')) {
      const em = trimmed.replace('Email:', '').trim();
      meta.push(`<a href="mailto:${em}">${em}</a>`);
    } else if (trimmed.startsWith('Phone:')) {
      meta.push(trimmed.replace('Phone:', '').trim());
    } else if (trimmed.startsWith('LinkedIn:')) {
      const link = trimmed.replace('LinkedIn:', '').trim();
      meta.push(`<a href="${link}">LinkedIn: ${link.split('/').pop() || 'Profile'}</a>`);
    } else if (trimmed.startsWith('Github:')) {
      const link = trimmed.replace('Github:', '').trim();
      meta.push(`<a href="${link}">GitHub: ${link.split('/').pop() || 'Profile'}</a>`);
    } else if (trimmed !== '') {
      meta.push(trimmed);
    }
  }

  // Fallback for name if it wasn't named explicitly
  if (!name && lines.length > 0 && !lines[0].includes(':')) {
    name = lines[0];
  }
  
  if (!name) name = 'FirstName M. LastName';
  
  return `
        <header class="header">
            <h1>${name}</h1>
            <p>
                ${meta.join(' | ')}
            </p>
        </header>
  `;
}

function generateSummarySection(lines: string[], title: string = 'PROFESSIONAL SUMMARY'): string {
  if (lines.length === 0) return '';
  const summaryText = lines.map(l => l.trim()).filter(Boolean).join(' ');
  
  return `
        <section>
            <h2 class="section-title">${title}</h2>
            <p>${summaryText}</p>
        </section>
  `;
}

function parseEntryBlock(lines: string[]) {
  const items: string[][] = [];
  let currentItem: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const isBullet = line.startsWith('-') || line.startsWith('•');
    
    if (!isBullet) {
        const hasBullets = currentItem.some(l => l.startsWith('-') || l.startsWith('•'));
        if (hasBullets) {
            items.push(currentItem);
            currentItem = [line];
        } else {
            currentItem.push(line);
        }
    } else {
        currentItem.push(line);
    }
  }
  
  if (currentItem.length > 0) {
    items.push(currentItem);
  }
  return items;
}

function generateExperienceSection(lines: string[], title: string): string {
  if (lines.length === 0) return '';
  
  const items = parseEntryBlock(lines);
  if (items.length === 0) return '';
  
  const itemsHtml = items.map(item => {
    let leftHeader = '';
    let rightHeader = '';
    let leftSub = '';
    let rightSub = '';
    
    const metaLines = item.filter(l => !l.startsWith('-') && !l.startsWith('•'));
    const bullets = item.filter(l => l.startsWith('-') || l.startsWith('•')).map(l => l.replace(/^[-•]\s*/, ''));
    
    if (metaLines.length >= 1) leftHeader = metaLines[0];
    
    // Track which meta lines are used as headers
    const usedIndices = new Set<number>([0]); // index 0 is leftHeader
    
    for (let i = 1; i < metaLines.length; i++) {
        const line = metaLines[i];
        if (line.match(/\d{4}/) || line.includes('Present') || line.includes('Current')) {
            rightSub = line;
            usedIndices.add(i);
        } else if (line.includes(',') && !leftSub) {
            rightHeader = line;
            usedIndices.add(i);
        } else if (!leftSub) {
            leftSub = line;
            usedIndices.add(i);
        } else if (!rightHeader) {
            rightHeader = line;
            usedIndices.add(i);
        }
    }
    
    // Any remaining meta lines that weren't used as headers are accomplishments — add as bullets
    for (let i = 1; i < metaLines.length; i++) {
        if (!usedIndices.has(i)) {
            bullets.push(metaLines[i].trim());
        }
    }

    return `
            <div class="entry">
                <div class="entry-header">
                    <strong>${leftHeader}</strong>
                    <span>${rightHeader}</span>
                </div>
                ${leftSub || rightSub ? `<div class="entry-subheader">
                    <em>${leftSub}</em>
                    <span>${rightSub}</span>
                </div>` : ''}
                ${bullets.length > 0 ? `<ul>
                    ${bullets.map(b => `<li>${b}</li>`).join('\n')}
                </ul>` : ''}
            </div>`;
  }).join('\n');
  
  return `
        <section>
            <h2 class="section-title">${title}</h2>
            ${itemsHtml}
        </section>
  `;
}

function generateEducationSection(lines: string[]): string {
  if (lines.length === 0) return '';
  
  const items = parseEntryBlock(lines);
  const itemsHtml = items.map(item => {
    let school = '';
    let location = '';
    let degree = '';
    let dates = '';
    
    const metaLines = item.filter(l => !l.startsWith('-') && !l.startsWith('•'));
    const bullets = item.filter(l => l.startsWith('-') || l.startsWith('•')).map(l => l.replace(/^[-•]\s*/, ''));
    
    if (metaLines.length >= 1) school = metaLines[0];
    
    for (let i = 1; i < metaLines.length; i++) {
      const line = metaLines[i];
      if (line.match(/\d{4}/) || line.includes('Graduation')) {
          dates = line;
      } else if (line.includes('B.S.') || line.includes('Degree') || line.includes('Master') || line.includes('Bachelor') || line.includes('B.A.')) {
          degree = line;
      } else if (line.includes(',')) {
          location = line;
      } else if (!degree) {
          degree = line;
      }
    }
    
    return `
            <div class="entry">
                <div class="entry-header">
                    <strong>${school}</strong>
                    <span>${location}</span>
                </div>
                ${degree || dates ? `<div class="entry-subheader">
                    <em>${degree}</em>
                    <span>${dates}</span>
                </div>` : ''}
                ${bullets.length > 0 ? `<ul>
                    ${bullets.map(b => `<li>${b}</li>`).join('\n')}
                </ul>` : ''}
            </div>`;
  }).join('\n');
  
  return `
        <section>
            <h2 class="section-title">EDUCATION</h2>
            ${itemsHtml}
        </section>
  `;
}

function generateSkillsSection(lines: string[], title: string = 'SKILLS'): string {
  if (lines.length === 0) return '';
  
  const skillList: string[] = [];
  
  for (const line of lines) {
    if (line.includes(':')) {
       const parts = line.split(':');
       const category = parts[0];
       const items = parts.slice(1).join(':');
       skillList.push(`<p><strong>${category.trim().replace(/^-/, '').trim()}:</strong> ${(items || '').trim()}</p>`);
    } else {
       skillList.push(`<p>${line.replace(/^-/, '').trim()}</p>`);
    }
  }
  
  return `
        <section>
            <h2 class="section-title">${title}</h2>
            ${skillList.join('\n')}
        </section>
  `;
}

export function convertHtmlToPdf(htmlContent: string): Promise<Blob> {
  return new Promise((resolve) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    resolve(blob);
  });
}