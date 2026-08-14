import React, { useState } from 'react';

interface SidebarLeftProps {
  activeSection: string;
  onSectionSelect: (section: string) => void;
  sections: string[];
  onAISuggestion: (suggestion: string) => Promise<void>;
  onBack?: () => void;
  mode?: 'create' | 'templates';
  onModeChange?: (mode: 'create' | 'templates') => void;
}

const EditorSidebarLeft = ({ 
  activeSection, 
  onSectionSelect, 
  sections, 
  onAISuggestion, 
  onBack,
  mode = 'create',
  onModeChange 
}: SidebarLeftProps) => {
  const [suggestion, setSuggestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!suggestion.trim()) return;
    setIsThinking(true);
    try {
      await onAISuggestion(suggestion);
      setSuggestion('');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="w-72 h-full bg-white border-r border-slate-100 flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-100">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 group"
          >
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xs font-black uppercase tracking-widest">Back</span>
          </button>
        )}
        <div className="flex gap-2 mb-8">
          <button 
            onClick={() => onModeChange?.('create')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
              mode === 'create'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 primary-gradient'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Create
          </button>
          <button 
            onClick={() => onModeChange?.('templates')}
            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${
              mode === 'templates'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 primary-gradient'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Templates
          </button>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => onSectionSelect(section)}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all group ${
                activeSection === section
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="font-bold text-sm tracking-tight">{section}</span>
              <span className={`text-lg transition-transform ${activeSection === section ? 'rotate-90 text-blue-500' : 'text-slate-300'}`}>+</span>
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest">AI Assistant</h4>
          </div>
          <p className="text-blue-900/70 text-[10px] font-bold leading-relaxed">
            I can help you rewrite the <span className="text-blue-600 underline">{activeSection}</span> section. Just tell me what to change!
          </p>
          <div className="relative">
            <input 
              type="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="e.g. Make it more professional"
              className="w-full pl-3 pr-10 py-3 bg-white border border-blue-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
              disabled={isThinking}
            />
            <button 
              onClick={handleSend}
              disabled={isThinking || !suggestion.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isThinking ? '...' : '→'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSidebarLeft;
