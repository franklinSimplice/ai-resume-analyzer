/**
 * Resume styling utility to convert basic resume content into beautifully formatted HTML
 * Following exact user-provided formatting and CSS layout
 */

export interface StyledResumeOptions {
  theme?: string;
  fontFamily?: string;
  fontSize?: string;
  primaryColor?: string;
  secondaryColor?: string;
  lineHeight?: string;
  margin?: string;
  fragmentOnly?: boolean;
  layout?: string;
  /** Dynamic section render order */
  sectionOrder?: string[];
}

/** Default section order with PROFESSIONAL EXPERIENCE before EDUCATION */
export const DEFAULT_SECTION_ORDER: string[] = [
  'contact',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'leadership',
];

/** Per-preset recommended section orders (all placing EXPERIENCE before EDUCATION) */
export const PRESET_SECTION_ORDERS: Record<string, string[]> = {
  professional: ['contact', 'summary', 'experience', 'education', 'skills'],
  modern: ['contact', 'summary', 'experience', 'education', 'skills'],
  executive: ['contact', 'summary', 'experience', 'education', 'skills'],
  software_engineering: ['contact', 'summary', 'experience', 'education', 'skills'],
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

export function parseResumeContent(content: string) {
  const lines = (content || '').split('\n');
  const sections: Record<string, string[]> = {
    contact: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    leadership: []
  };
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine === '---' || trimmedLine === '***' || trimmedLine === '___') continue;
    
    // Strip markdown formatting symbols
    const cleanLine = trimmedLine
      .replace(/^[#\*\-_\s>]+/, '')
      .replace(/[#\*\-_]+$/, '')
      .trim();

    // Normalized heading for robust section detection
    const normalized = cleanLine
      .replace(/^\d+[\.\)]\s*/, '') // remove leading "1. ", "2) "
      .replace(/[:\-–—]+$/, '')     // remove trailing colons/dashes
      .trim()
      .toUpperCase();
    
    // Comprehensive section matching
    if (normalized.match(/^CONTACT(\s+INFO|\s+INFORMATION)?$/) || normalized === 'PERSONAL INFO' || normalized === 'CONTACT') {
      currentSection = 'contact';
    } else if (
      normalized.includes('CAREER SUMMARY') ||
      normalized.includes('PROFESSIONAL SUMMARY') ||
      normalized.includes('EXECUTIVE SUMMARY') ||
      normalized === 'SUMMARY' ||
      normalized.includes('PROFILE') ||
      normalized.includes('OBJECTIVE')
    ) {
      currentSection = 'summary';
    } else if (
      normalized.includes('PROFESSIONAL EXPERIENCE') ||
      normalized.includes('WORK EXPERIENCE') ||
      normalized.includes('EMPLOYMENT HISTORY') ||
      normalized.includes('WORK HISTORY') ||
      normalized === 'EXPERIENCE' ||
      normalized.includes('KEY EXPERIENCE')
    ) {
      currentSection = 'experience';
    } else if (
      normalized.includes('EDUCATION') ||
      normalized.includes('ACADEMIC BACKGROUND') ||
      normalized.includes('ACADEMIC QUALIFICATIONS')
    ) {
      currentSection = 'education';
    } else if (
      normalized.includes('SKILL') ||
      normalized.includes('CORE COMPETENCIES') ||
      normalized.includes('TECHNICAL EXPERTISE') ||
      normalized.includes('CERTIFICATION') ||
      normalized.includes('AREAS OF EXPERTISE')
    ) {
      currentSection = 'skills';
    } else if (
      normalized.includes('PROJECT') ||
      normalized.includes('ACCOMPLISHMENT')
    ) {
      currentSection = 'projects';
    } else if (
      normalized.includes('LEADERSHIP') ||
      normalized.includes('ACTIVITIES') ||
      normalized.includes('VOLUNTEER')
    ) {
      currentSection = 'leadership';
    } else {
      if (!currentSection) {
        currentSection = 'contact';
      }
      sections[currentSection as keyof typeof sections].push(cleanLine);
    }
  }
  
  return sections;
}

/** Section title labels matching the clean format */
const SECTION_TITLES: Record<string, string> = {
  contact: '',
  summary: 'CAREER SUMMARY',
  experience: 'PROFESSIONAL EXPERIENCE',
  education: 'EDUCATION',
  skills: 'SKILLS & CERTIFICATIONS',
  projects: 'PROJECTS',
  leadership: 'LEADERSHIP & ACTIVITIES',
};

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
        case 'education':
          return generateEducationSection(lines);
        case 'skills':
          return generateSkillsSection(lines, SECTION_TITLES.skills);
        case 'projects':
          return generateExperienceSection(lines, SECTION_TITLES.projects);
        case 'leadership':
          return generateExperienceSection(lines, SECTION_TITLES.leadership);
        default:
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
    fontFamily = '"Times New Roman", Times, Georgia, serif', 
    fontSize = '10pt', 
    primaryColor = '#000000',
    lineHeight = '1.25',
    margin = '0.5in'
  } = options;

  return `
/* Printable Clean ATS Resume Stylesheet */
@page {
    size: letter portrait;
    margin: 0.4in;
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}

body {
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
    display: flex;
    justify-content: center;
    font-family: ${fontFamily};
    color: ${primaryColor};
}

.resume-container {
    background-color: #ffffff;
    width: 8.5in;
    min-height: 11in;
    padding: ${margin};
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-align: left;
    font-family: ${fontFamily};
    line-height: ${lineHeight};
    color: ${primaryColor};
    font-size: ${fontSize};
}

.header {
    text-align: center;
    margin-bottom: 12px;
}

.header h1 {
    margin: 0 0 3px 0;
    font-size: 1.55em;
    font-weight: bold;
    text-transform: none;
    letter-spacing: 0.3px;
    color: ${primaryColor};
}

.header p {
    margin: 0;
    font-size: 0.95em;
    color: #222222;
}

.header a {
    color: inherit;
    text-decoration: none;
}

.section-title {
    font-size: 1.05em;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid ${primaryColor};
    margin: 12px 0 6px 0;
    padding-bottom: 2px;
    color: ${primaryColor};
}

.entry {
    margin-bottom: 8px;
}

.entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 1em;
    margin-top: 4px;
}

.entry-header strong {
    font-weight: bold;
}

.entry-header span {
    font-weight: normal;
    text-align: right;
}

.entry-subheader {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.95em;
    margin-top: 1px;
    margin-bottom: 3px;
}

.entry-subheader em {
    font-style: italic;
}

.entry-subheader span {
    font-style: normal;
    text-align: right;
}

ul {
    margin: 3px 0 6px 0;
    padding-left: 20px;
    list-style-type: disc;
}

li {
    font-size: 0.95em;
    line-height: 1.3;
    margin-bottom: 2px;
    color: #111111;
}

p {
    font-size: 0.95em;
    line-height: 1.3;
    margin: 3px 0;
    color: #111111;
}

a {
    color: ${primaryColor};
    text-decoration: none;
}

/* Print-specific styles for real text PDF */
@media print {
    body {
        background-color: transparent !important;
    }
    .resume-container {
        width: 100% !important;
        min-height: auto !important;
        padding: 0 !important;
        box-shadow: none !important;
        margin: 0 !important;
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
    if (!trimmed) continue;
    
    if (trimmed.startsWith('Name:')) {
      name = trimmed.replace('Name:', '').trim();
    } else if (trimmed.startsWith('Contact:')) {
      const contactStr = trimmed.replace('Contact:', '').trim();
      const parts = contactStr.split('|').map(p => p.trim()).filter(Boolean);
      for (const p of parts) {
        if (p.includes('@')) {
          meta.push(`<a href="mailto:${p}">${p}</a>`);
        } else {
          meta.push(p);
        }
      }
    } else if (trimmed.startsWith('Email:')) {
      const em = trimmed.replace('Email:', '').trim();
      meta.push(`<a href="mailto:${em}">${em}</a>`);
    } else if (trimmed.startsWith('Phone:')) {
      meta.push(trimmed.replace('Phone:', '').trim());
    } else if (trimmed.startsWith('LinkedIn:')) {
      const link = trimmed.replace('LinkedIn:', '').trim();
      meta.push(link);
    } else if (trimmed.startsWith('GitHub:') || trimmed.startsWith('Github:')) {
      const link = trimmed.replace(/Github:/i, '').trim();
      meta.push(link);
    } else if (trimmed.includes('|')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
      for (const p of parts) {
        if (p.includes('@')) {
          meta.push(`<a href="mailto:${p}">${p}</a>`);
        } else {
          meta.push(p);
        }
      }
    } else {
      if (!name) {
        name = trimmed;
      } else {
        meta.push(trimmed);
      }
    }
  }

  if (!name) name = 'Jane Doe';
  
  return `
        <header class="header">
            <h1>${name}</h1>
            <p>${meta.join(' | ')}</p>
        </header>
  `;
}

function generateSummarySection(lines: string[], title: string = 'CAREER SUMMARY'): string {
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
    
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
    
    if (!isBullet) {
      const hasBullets = currentItem.some(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*'));
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
    let company = '';
    let location = '';
    let jobTitle = '';
    let dates = '';
    
    const metaLines = item.filter(l => !l.startsWith('-') && !l.startsWith('•') && !l.startsWith('*'));
    const bullets = item
      .filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*'))
      .map(l => l.replace(/^[-•*]\s*/, '').trim());
    
    if (metaLines.length >= 1) company = metaLines[0];
    
    const usedIndices = new Set<number>([0]);
    
    for (let i = 1; i < metaLines.length; i++) {
      const line = metaLines[i];
      if (line.match(/\d{4}/) || line.includes('Present') || line.includes('Current')) {
        dates = line;
        usedIndices.add(i);
      } else if (line.includes(',') && !location) {
        location = line;
        usedIndices.add(i);
      } else if (!jobTitle) {
        jobTitle = line;
        usedIndices.add(i);
      } else if (!location) {
        location = line;
        usedIndices.add(i);
      }
    }
    
    for (let i = 1; i < metaLines.length; i++) {
      if (!usedIndices.has(i)) {
        bullets.push(metaLines[i].trim());
      }
    }

    return `
            <div class="entry">
                <div class="entry-header">
                    <strong>${company}</strong>
                    <span>${location}</span>
                </div>
                ${jobTitle || dates ? `<div class="entry-subheader">
                    <em>${jobTitle}</em>
                    <span>${dates}</span>
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
    
    const metaLines = item.filter(l => !l.startsWith('-') && !l.startsWith('•') && !l.startsWith('*'));
    const bullets = item
      .filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*'))
      .map(l => l.replace(/^[-•*]\s*/, '').trim());
    
    if (metaLines.length >= 1) school = metaLines[0];
    
    for (let i = 1; i < metaLines.length; i++) {
      const line = metaLines[i];
      if (line.match(/\d{4}/) || line.includes('Graduation') || line.includes('Expected')) {
        dates = line;
      } else if (line.includes('Bachelor') || line.includes('Master') || line.includes('B.S.') || line.includes('B.A.') || line.includes('Degree') || line.includes('Ph.D') || line.includes('Associate')) {
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

function generateSkillsSection(lines: string[], title: string = 'SKILLS & CERTIFICATIONS'): string {
  if (lines.length === 0) return '';
  
  const skillList: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.replace(/^[-•*]\s*/, '').trim();
    if (!trimmed || trimmed === '---' || trimmed.startsWith('| ---') || trimmed === '|---|---|') continue;
    
    // Handle markdown table rows: | Category | Skills |
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .map(c => c.replace(/^\*\*|\*\*$/g, '').trim())
        .filter(Boolean);
      
      if (cells.length >= 2 && cells[0].toLowerCase() !== 'category') {
        skillList.push(`<p><strong>${cells[0]}:</strong> ${cells.slice(1).join(', ')}</p>`);
        continue;
      } else if (cells.length === 1) {
        skillList.push(`<p>${cells[0]}</p>`);
        continue;
      }
    }

    if (trimmed.includes(':')) {
      const colonIndex = trimmed.indexOf(':');
      const category = trimmed.substring(0, colonIndex).replace(/^\*\*|\*\*$/g, '').trim();
      const items = trimmed.substring(colonIndex + 1).replace(/^\*\*|\*\*$/g, '').trim();
      skillList.push(`<p><strong>${category}:</strong> ${items}</p>`);
    } else {
      skillList.push(`<p>${trimmed}</p>`);
    }
  }
  
  return `
        <section>
            <h2 class="section-title">${title}</h2>
            ${skillList.join('\n')}
        </section>
  `;
}

/**
 * Native print-to-PDF utility that triggers the browser print dialog
 * Generating a 100% vector, real text-based PDF suitable for ATS scanners.
 */
export function printResumeAsPdf(htmlContent: string) {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 350);
}