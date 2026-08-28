import React, { useState, useEffect } from 'react';
import EditorSidebarLeft from './EditorSidebarLeft';
import EditorCanvas from './EditorCanvas';
import EditorSidebarRight from './EditorSidebarRight';
import CustomizerStudio from '~/components/Templates/CustomizerStudio';
import { styleResumeContent, getResumeFragment, parseResumeContent, PRESET_SECTION_ORDERS, DEFAULT_SECTION_ORDER } from '~/lib/resumeStyler';
import { useApiStore } from '~/lib/api';

interface ResumeEditorProps {
  initialContent: string;
  template: string;
  onSave?: (content: string, templateOverride?: string) => void;
  onDownload: (content: string) => void;
  onBack?: () => void;
}

const ResumeEditor = ({ initialContent, template, onSave, onDownload, onBack }: ResumeEditorProps) => {
  const { ai } = useApiStore();
  const [sections, setSections] = useState<Record<string, string[]>>({
    contact: [],
    summary: [],
    experience: [],
    education: [],
    skills: []
  });
  
  const [activeSection, setActiveSection] = useState('Personal Info');
  const [zoom, setZoom] = useState(0.85);
  const [styledHtml, setStyledHtml] = useState('');
  const [mode, setMode] = useState<'create' | 'templates'>('create');
  const [localTemplate, setLocalTemplate] = useState('professional');
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    PRESET_SECTION_ORDERS['professional'] || DEFAULT_SECTION_ORDER
  );
  const [styling, setStyling] = useState({
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '10pt',
    primaryColor: '#000000',
    lineHeight: '1.2',
    margin: '0.5in'
  });

  // Sync state with incoming template prop
  useEffect(() => {
    if (template) {
      try {
        const parsed = JSON.parse(template);
        if (parsed && typeof parsed === 'object') {
          const newLayout = parsed.layout || 'professional';
          setLocalTemplate(newLayout);
          setStyling({
            fontFamily: parsed.fontFamily || '"Times New Roman", Times, serif',
            fontSize: parsed.fontSize || '10pt',
            primaryColor: parsed.primaryColor || '#000000',
            lineHeight: parsed.lineHeight || '1.2',
            margin: parsed.margin || '0.5in'
          });
          // Restore saved sectionOrder or use preset default
          setSectionOrder(
            (parsed.sectionOrder as string[] | undefined) ||
            PRESET_SECTION_ORDERS[newLayout] ||
            DEFAULT_SECTION_ORDER
          );
        } else {
          setLocalTemplate(template);
          setSectionOrder(PRESET_SECTION_ORDERS[template] || DEFAULT_SECTION_ORDER);
        }
      } catch (e) {
        setLocalTemplate(template);
        setSectionOrder(PRESET_SECTION_ORDERS[template] || DEFAULT_SECTION_ORDER);
      }
    }
  }, [template]);

  // Initial parse of the AI content using the unified robust parser
  useEffect(() => {
    if (initialContent) {
      const parsedSections = parseResumeContent(initialContent);
      setSections(parsedSections);
    }
  }, [initialContent]);

  // Re-generate HTML when sections, styling or sectionOrder change
  useEffect(() => {
    const contentString = Object.entries(sections)
      .map(([key, lines]) => `${key.toUpperCase()}\n${lines.join('\n')}`)
      .join('\n\n');
    
    const html = getResumeFragment(contentString, { 
      theme: localTemplate,
      sectionOrder,
      ...styling
    });
    setStyledHtml(html);
  }, [sections, localTemplate, styling, sectionOrder]);

  const SECTION_MAP: Record<string, string> = {
    'Personal Info': 'contact',
    'Contact Information': 'contact',
    'Career Summary': 'summary',
    'Professional Summary/Objective': 'summary',
    'Professional Experience': 'experience',
    'Work Experience': 'experience',
    'Education': 'education',
    'Skills & Certifications': 'skills',
    'Skills': 'skills',
    'Projects': 'projects',
    'Leadership & Activities': 'leadership'
  };

  const handleUpdateSection = (displayName: string, value: string) => {
    const key = SECTION_MAP[displayName];
    if (key) {
      setSections(prev => ({
        ...prev,
        [key]: value.split('\n')
      }));
    }
  };

  const currentSectionKey = SECTION_MAP[activeSection] || 'contact';

  const handleAISuggestion = async (suggestion: string) => {
    const currentText = sections[currentSectionKey]?.join('\n') || '';

    try {
      const updatedText = await ai.suggest(activeSection, currentText, suggestion);
      
      if (updatedText) {
        setSections(prev => ({
          ...prev,
          [currentSectionKey]: updatedText.split('\n')
        }));
      }
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      alert("Failed to get AI suggestion. Please try again.");
    }
  };

  /** Maps internal section keys → sidebar-friendly display names */
  const SECTION_DISPLAY_NAMES: Record<string, string> = {
    contact: 'Personal Info',
    summary: 'Career Summary',
    experience: 'Professional Experience',
    education: 'Education',
    skills: 'Skills & Certifications',
    projects: 'Projects',
    leadership: 'Leadership & Activities',
  };

  /** Derive ordered sidebar labels from current sectionOrder */
  const orderedSidebarSections = sectionOrder
    .map((key) => SECTION_DISPLAY_NAMES[key])
    .filter(Boolean);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f8f9fc] overflow-hidden">
      <EditorSidebarLeft 
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
        onAISuggestion={handleAISuggestion}
        onBack={onBack}
        mode={mode}
        onModeChange={setMode}
        sections={orderedSidebarSections.length > 0 ? orderedSidebarSections : [
          'Personal Info',
          'Career Summary',
          'Professional Experience',
          'Education',
          'Skills & Certifications',
        ]}
      />
      
      <EditorCanvas 
        htmlContent={styledHtml} 
        zoom={zoom} 
        onZoomChange={setZoom}
      />
      
      {mode === 'create' ? (
        <EditorSidebarRight 
          activeSection={activeSection}
          sectionContent={sections[currentSectionKey]?.join('\n') || ''}
          onUpdateSection={handleUpdateSection}
          styling={styling}
          onUpdateStyling={(newStyling) => setStyling(prev => ({ ...prev, ...newStyling }))}
          onDownload={() => onDownload(styledHtml)}
          onSave={() => {
            const contentString = Object.entries(sections)
              .map(([key, lines]) => `${key.toUpperCase()}\n${lines.join('\n')}`)
              .join('\n\n');
            
            const serializedTemplate = JSON.stringify({
              layout: localTemplate,
              sectionOrder,
              ...styling
            });
            onSave?.(contentString, serializedTemplate);
          }}
        />
      ) : (
        <div className="w-96 h-full bg-slate-950 p-4 flex flex-col border-l border-slate-800 shrink-0">
          <CustomizerStudio 
            layout={localTemplate}
            fontFamily={styling.fontFamily}
            fontSize={styling.fontSize}
            primaryColor={styling.primaryColor}
            lineHeight={styling.lineHeight}
            margin={styling.margin}
            sectionOrder={sectionOrder}
            onChange={(updates) => {
              if (updates.layout) {
                setLocalTemplate(updates.layout);
              }
              if (updates.sectionOrder) {
                setSectionOrder(updates.sectionOrder);
              }
              // Filter out non-styling keys before merging into styling state
              const { layout: _l, sectionOrder: _s, ...stylingUpdates } = updates;
              if (Object.keys(stylingUpdates).length > 0) {
                setStyling(prev => ({
                  ...prev,
                  ...stylingUpdates
                }));
              }
            }}
            onConfirm={() => setMode('create')}
          />
        </div>
      )}
    </div>
  );
};

export default ResumeEditor;
