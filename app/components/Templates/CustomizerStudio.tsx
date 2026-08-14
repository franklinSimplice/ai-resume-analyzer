import React, { useState } from 'react';
import { RESUME_PRESETS } from '~/constants/resumePresets';
import type { ResumePreset } from '~/constants/resumePresets';
import { RESUME_TEMPLATES } from '~/constants/resumeTemplates';
import { PRESET_SECTION_ORDERS, DEFAULT_SECTION_ORDER } from '~/lib/resumeStyler';

/** Human-readable section labels for the UI */
const SECTION_LABELS: Record<string, string> = {
  contact: '👤 Personal Info',
  summary: '📝 Professional Summary',
  experience: '💼 Work Experience',
  projects: '🚀 Projects',
  skills: '🛠️ Skills',
  education: '🎓 Education',
  leadership: '🏆 Leadership & Activities',
};

interface CustomizerStudioProps {
  layout: string;
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  lineHeight: string;
  margin: string;
  sectionOrder?: string[];
  onChange: (updates: {
    layout?: string;
    fontFamily?: string;
    fontSize?: string;
    primaryColor?: string;
    lineHeight?: string;
    margin?: string;
    sectionOrder?: string[];
  }) => void;
  onConfirm: () => void;
}

const COLOR_PALETTES = [
  { name: 'Midnight Navy', hex: '#0f172a', label: 'Navy' },
  { name: 'Tech Teal', hex: '#0d9488', label: 'Teal' },
  { name: 'Indigo Dream', hex: '#4f46e5', label: 'Indigo' },
  { name: 'Emerald Forest', hex: '#059669', label: 'Emerald' },
  { name: 'Rose Gold Accent', hex: '#d97706', label: 'Gold' },
  { name: 'Royal Classic', hex: '#2563eb', label: 'Blue' },
  { name: 'Obsidian Black', hex: '#1e293b', label: 'Obsidian' },
  { name: 'Creative Violet', hex: '#7c3aed', label: 'Violet' }
];

const FONT_PAIRINGS = [
  { 
    name: 'Modern Sans (Clean)', 
    val: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
  },
  { 
    name: 'Elegant Serif (Corporate)', 
    val: 'Georgia, Cambria, "Times New Roman", Times, serif' 
  },
  { 
    name: 'Standard Times (ATS-Proof)', 
    val: '"Times New Roman", Times, Baskerville, Georgia, serif' 
  },
  { 
    name: 'Monospace Developer (Tech)', 
    val: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace' 
  }
];

const CustomizerStudio: React.FC<CustomizerStudioProps> = ({
  layout,
  fontFamily,
  fontSize,
  primaryColor,
  lineHeight,
  margin,
  sectionOrder,
  onChange,
  onConfirm
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'colors' | 'fonts' | 'layout' | 'sections'>('presets');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tech_startup');

  // Section order state – initialised from prop, or from preset default
  const [localSectionOrder, setLocalSectionOrder] = useState<string[]>(
    sectionOrder ||
    PRESET_SECTION_ORDERS[layout] ||
    DEFAULT_SECTION_ORDER
  );

  const handlePresetSelect = (preset: ResumePreset) => {
    setSelectedPresetId(preset.id);
    const presetSectionOrder = PRESET_SECTION_ORDERS[preset.layout] || DEFAULT_SECTION_ORDER;
    setLocalSectionOrder(presetSectionOrder);
    onChange({
      layout: preset.layout,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      primaryColor: preset.primaryColor,
      lineHeight: preset.lineHeight,
      margin: preset.margin,
      sectionOrder: presetSectionOrder,
    });
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...localSectionOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setLocalSectionOrder(newOrder);
    setSelectedPresetId(''); // Break preset lock on manual reorder
    onChange({ sectionOrder: newOrder });
  };

  const moveSectionDown = (index: number) => {
    if (index === localSectionOrder.length - 1) return;
    const newOrder = [...localSectionOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setLocalSectionOrder(newOrder);
    setSelectedPresetId('');
    onChange({ sectionOrder: newOrder });
  };

  const resetSectionOrder = () => {
    const defaultOrder = PRESET_SECTION_ORDERS[layout] || DEFAULT_SECTION_ORDER;
    setLocalSectionOrder(defaultOrder);
    onChange({ sectionOrder: defaultOrder });
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-900/60 backdrop-blur-lg rounded-3xl border border-slate-800 p-6 shadow-2xl overflow-y-auto">
      {/* Studio Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white tracking-tight">Design & Style Studio</h3>
        <p className="text-xs text-slate-400 mt-1">Configure preset inbuilt templates or fine-tune layout settings manually.</p>
      </div>

      {/* Expandable Glassmorphic Tabs Navigation */}
      <div className="flex flex-wrap bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80 mb-6 gap-1">
        {(['presets', 'colors', 'fonts', 'layout', 'sections'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition duration-300 min-w-[60px] ${
              activeTab === tab
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Expandable Sidebar Forms */}
      <div className="flex-1 min-h-0 overflow-y-auto mb-6 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        
        {/* Tab 1: Inbuilt Templates Presets */}
        {activeTab === 'presets' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {Object.values(RESUME_PRESETS).map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`group relative flex flex-col p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-500/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30'
                  }`}
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4 text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-widest group-hover:border-slate-600 transition">
                    {preset.tag}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Visual marker dot */}
                    <span 
                      className="w-3 h-3 rounded-full border border-slate-700 shadow-inner shrink-0" 
                      style={{ backgroundColor: preset.primaryColor }}
                    />
                    <h4 className="font-bold text-sm text-white group-hover:text-teal-400 transition">{preset.name}</h4>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{preset.description}</p>
                  
                  {/* ATS Rating Metric */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-[10px] font-semibold text-slate-500">
                    <span className="flex items-center gap-1">
                      Layout: <strong className="text-slate-300 capitalize">{preset.layout.replace('_', ' ')}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      ATS compatibility: <strong className="text-emerald-400">{preset.atsRating}%</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: HSL Color Customizer */}
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Theme Color</label>
              <p className="text-[11px] text-slate-500 mt-1">Select a color scheme to style major headings, dividers, and links.</p>
              
              <div className="grid grid-cols-4 gap-3 mt-4">
                {COLOR_PALETTES.map((color) => {
                  const isSelected = primaryColor.toLowerCase() === color.hex.toLowerCase();
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(''); // Break preset lock
                        onChange({ primaryColor: color.hex });
                      }}
                      className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-500/10' 
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <span 
                        className="w-6 h-6 rounded-full border border-slate-700 shadow-md transition transform hover:scale-110"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-[9px] font-semibold text-slate-400 tracking-tight text-center">{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Manual Hex Color Input */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              <label htmlFor="hex-color-input" className="text-xs font-semibold text-slate-300">Or enter manual hex code:</label>
              <div className="flex items-center gap-3 mt-2">
                <input 
                  type="color" 
                  value={primaryColor.startsWith('#') ? primaryColor : '#000000'}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ primaryColor: e.target.value });
                  }}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border-0 shrink-0"
                />
                <input 
                  type="text" 
                  id="hex-color-input"
                  value={primaryColor}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ primaryColor: e.target.value });
                  }}
                  placeholder="#0F172A"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Typography */}
        {activeTab === 'fonts' && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Typography Pairing</label>
              <p className="text-[11px] text-slate-500 mt-1">Select a matching font layout optimized for parsing reliability and scannability.</p>
              
              <div className="flex flex-col gap-3 mt-4">
                {FONT_PAIRINGS.map((font) => {
                  const isSelected = fontFamily === font.val;
                  return (
                    <button
                      key={font.val}
                      type="button"
                      onClick={() => {
                        setSelectedPresetId(''); // Break preset lock
                        onChange({ fontFamily: font.val });
                      }}
                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition duration-300 ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-500/10' 
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold text-white">{font.name}</span>
                      <span 
                        className="text-[10px] text-slate-400 mt-2 truncate w-full"
                        style={{ fontFamily: font.val }}
                      >
                        ABCabc123 - The quick brown fox jumps over the lazy dog.
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Sizing Select */}
            <div>
              <label htmlFor="font-size-select" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Font Sizing</label>
              <div className="mt-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <select
                  id="font-size-select"
                  value={fontSize}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ fontSize: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="9pt">9pt (Extremely Compact)</option>
                  <option value="9.5pt">9.5pt (Tight)</option>
                  <option value="10pt">10pt (Standard Professional)</option>
                  <option value="10.5pt">10.5pt (Readable)</option>
                  <option value="11pt">11pt (Clear Executive)</option>
                  <option value="12pt">12pt (Comfortable)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Spacings & Margins Configurator */}
        {activeTab === 'layout' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            {/* Margin Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="margin-range-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Page Margins</label>
                <span className="text-[10px] font-semibold text-teal-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{margin}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Adjust the page boundary margins. Compact margins allow more content per page.</p>
              
              <div className="mt-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <input 
                  type="range" 
                  id="margin-range-slider"
                  min="0.3" 
                  max="1.0" 
                  step="0.05"
                  value={parseFloat(margin)}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ margin: `${e.target.value}in` });
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-600 mt-2">
                  <span>0.3in (Compact)</span>
                  <span>1.0in (Wide)</span>
                </div>
              </div>
            </div>

            {/* Line Spacing Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="spacing-range-slider" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Line Spacing (Line-height)</label>
                <span className="text-[10px] font-semibold text-teal-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{lineHeight}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Configure vertical line gaps. Tight spacing is optimal for dense technical histories.</p>
              
              <div className="mt-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <input 
                  type="range" 
                  id="spacing-range-slider"
                  min="1.0" 
                  max="1.5" 
                  step="0.05"
                  value={parseFloat(lineHeight)}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ lineHeight: e.target.value });
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[9px] font-bold text-slate-600 mt-2">
                  <span>1.0 (Dense)</span>
                  <span>1.5 (Spacious)</span>
                </div>
              </div>
            </div>

            {/* Layout Blueprint Selector Override */}
            <div>
              <label htmlFor="blueprint-select-override" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Structural Wireframe</label>
              <div className="mt-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                <select
                  id="blueprint-select-override"
                  value={layout}
                  onChange={(e) => {
                    setSelectedPresetId('');
                    onChange({ layout: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {Object.entries(RESUME_TEMPLATES).map(([key, data]) => (
                    <option key={key} value={key}>
                      {data.name} Layout ({data.structure.length} Sections)
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        )}

        {/* Tab 5: Section Order */}
        {activeTab === 'sections' && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Section Order</label>
              <p className="text-[11px] text-slate-500 mt-1">Drag sections up or down to customize their order on your resume.</p>
            </div>

            <div className="flex flex-col gap-2">
              {localSectionOrder.map((sectionKey, index) => (
                <div
                  key={sectionKey}
                  className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 group hover:border-slate-700 transition"
                >
                  {/* Position badge */}
                  <span className="text-[10px] font-black text-slate-600 w-4 text-center">{index + 1}</span>

                  {/* Section label */}
                  <span className="flex-1 text-xs font-semibold text-slate-200">
                    {SECTION_LABELS[sectionKey] || sectionKey}
                  </span>

                  {/* Move controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      title="Move up"
                      className={`w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-bold transition ${
                        index === 0
                          ? 'text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 hover:text-teal-400 hover:bg-slate-800 active:scale-95'
                      }`}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === localSectionOrder.length - 1}
                      title="Move down"
                      className={`w-6 h-6 flex items-center justify-center rounded-md text-[11px] font-bold transition ${
                        index === localSectionOrder.length - 1
                          ? 'text-slate-700 cursor-not-allowed'
                          : 'text-slate-400 hover:text-teal-400 hover:bg-slate-800 active:scale-95'
                      }`}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Reset button */}
            <button
              type="button"
              onClick={resetSectionOrder}
              className="w-full py-2 mt-2 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-[10px] font-bold rounded-xl uppercase tracking-widest transition"
            >
              ↺ Reset to Preset Default
            </button>
          </div>
        )}

      </div>

      {/* Confirm Layout Button */}
      <button
        type="button"
        onClick={onConfirm}
        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold rounded-2xl shadow-xl transition-all duration-300 active:scale-[0.98] uppercase tracking-wider shrink-0"
      >
        Choose Design & Continue
      </button>
    </div>
  );
};

export default CustomizerStudio;
