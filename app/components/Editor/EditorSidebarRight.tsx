import React from 'react';

interface SidebarRightProps {
  activeSection: string;
  onUpdateSection: (section: string, value: string) => void;
  sectionContent: string;
  styling: {
    fontFamily: string;
    fontSize: string;
    primaryColor: string;
  };
  onUpdateStyling: (styling: any) => void;
  onDownload: () => void;
  onSave?: () => void;
}

const EditorSidebarRight = ({ activeSection, onUpdateSection, sectionContent, styling, onUpdateStyling, onDownload, onSave }: SidebarRightProps) => {
  return (
    <div className="w-80 h-full bg-white border-l border-slate-100 flex flex-col p-6 overflow-y-auto custom-scrollbar">
      {/* Position Section */}
      <section className="mb-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Position</h3>
        <div className="flex gap-1 justify-between p-1 bg-slate-50 rounded-xl">
          {['⬅️', '⬆️', '⬇️', '➡️', '↔️', '↕️'].map((icon, i) => (
            <button key={i} className="bg-white p-2 text-sm rounded-lg shadow-sm border border-slate-100 hover:bg-blue-50 transition">{icon}</button>
          ))}
        </div>
      </section>

      {/* Typography Section */}
      <section className="mb-10">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Typography</h3>
        <div className="space-y-4">
            <select 
              value={styling.fontFamily}
              onChange={(e) => onUpdateStyling({ fontFamily: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700"
            >
                <option value='"Times New Roman", Times, serif'>Times New Roman</option>
                <option value='"Inter", sans-serif'>Inter</option>
                <option value='"Outfit", sans-serif'>Outfit</option>
                <option value='"Roboto", sans-serif'>Roboto</option>
            </select>
            <div className="flex items-center gap-3">
                <select className="flex-1 p-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                    <option>SemiBold</option>
                    <option>Bold</option>
                    <option>Regular</option>
                </select>
                <div className="flex-1 flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-[10px] uppercase font-black text-slate-400">Aa</span>
                    <select 
                      value={styling.fontSize}
                      onChange={(e) => onUpdateStyling({ fontSize: e.target.value })}
                      className="bg-transparent text-sm font-bold w-full focus:outline-none"
                    >
                        <option value="9pt">9px</option>
                        <option value="10pt">10px</option>
                        <option value="11pt">11px</option>
                        <option value="12pt">12px</option>
                        <option value="14pt">14px</option>
                    </select>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <input 
                      type="color" 
                      value={styling.primaryColor}
                      onChange={(e) => onUpdateStyling({ primaryColor: e.target.value })}
                      className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">{styling.primaryColor}</span>
                </div>
                <div className="flex-1 flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-lg">🔅</span>
                    <span className="text-xs font-bold text-slate-500">100%</span>
                </div>
            </div>
        </div>
      </section>

      {/* Edit Text Area */}
      <section className="mb-10 flex-col flex grow">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Edit {activeSection}</h3>
        <textarea 
          value={sectionContent}
          onChange={(e) => onUpdateSection(activeSection, e.target.value)}
          className="w-full flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner min-h-[300px]"
          placeholder={`Add details to ${activeSection}...`}
        />
      </section>

      {/* Bottom Actions */}
      <div className="mt-auto pt-6 border-t border-slate-100 space-y-3">
        <button 
          onClick={onDownload}
          className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-100 transition tracking-tighter"
        >
          📄 Download
        </button>
        <button 
          onClick={onSave}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-100 tracking-tighter primary-gradient"
        >
          💾 Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditorSidebarRight;
