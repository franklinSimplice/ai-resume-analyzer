import React from 'react';

interface AnalysisSidebarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
  scores: {
    impact: number;
    brevity: number;
    style: number;
    softSkills: number;
  };
}

const AnalysisSidebar = ({ activeSection, onSectionClick, scores }: AnalysisSidebarProps) => {
  const sections = [
    { id: 'impact', label: 'Impact', score: scores.impact, icon: '🚀' },
    { id: 'brevity', label: 'Brevity', score: scores.brevity, icon: '✂️' },
    { id: 'style', label: 'Style', score: scores.style, icon: '🎨' },
    { id: 'soft-skills', label: 'Soft Skills', score: scores.softSkills, icon: '🤝' },
  ];

  return (
    <div className="w-64 shrink-0 sticky top-24 hidden lg:block h-fit">
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 px-4">Sections</h3>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'hover:bg-white/60 text-slate-600 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{section.icon}</span>
                <span className="font-semibold">{section.label}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                activeSection === section.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
              }`}>
                {section.score}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default AnalysisSidebar;
