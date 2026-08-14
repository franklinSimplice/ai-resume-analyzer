import React, { useState } from 'react';
import { styleResumeContent } from '~/lib/resumeStyler';
import { MOCK_RESUME_TEXT } from '~/constants/mockResumeData';

interface LiveCanvasProps {
  layout: string;
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  lineHeight: string;
  margin: string;
  customText?: string;
}

const LiveCanvas: React.FC<LiveCanvasProps> = ({
  layout,
  fontFamily,
  fontSize,
  primaryColor,
  lineHeight,
  margin,
  customText
}) => {
  const [zoom, setZoom] = useState<number>(0.75); // Default comfortable zoom
  
  // Use user content if provided, otherwise default to high-fidelity mock resume
  const contentToRender = customText || MOCK_RESUME_TEXT;
  
  const renderedHtml = styleResumeContent(contentToRender, {
    theme: layout,
    fontFamily,
    fontSize,
    primaryColor,
    lineHeight,
    margin
  });

  return (
    <div className="flex flex-col items-center w-full h-full bg-slate-950/40 backdrop-blur-md rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
      {/* Zoom Control Header */}
      <div className="flex flex-wrap items-center justify-between w-full gap-4 mb-6 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="text-sm font-semibold text-slate-300 tracking-wide uppercase">Real-Time A4 Preview</span>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800/80">
          <button 
            type="button"
            onClick={() => setZoom(Math.max(0.4, zoom - 0.05))}
            className="text-slate-400 hover:text-white transition text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800"
          >
            －
          </button>
          <span className="text-xs font-mono font-semibold text-teal-400 min-w-[40px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button 
            type="button"
            onClick={() => setZoom(Math.min(1.2, zoom + 0.05))}
            className="text-slate-400 hover:text-white transition text-xs font-bold w-5 h-5 flex items-center justify-center rounded hover:bg-slate-800"
          >
            ＋
          </button>
        </div>
      </div>

      {/* Visual Canvas Sandbox */}
      <div className="flex-1 w-full overflow-auto flex justify-center items-start rounded-2xl bg-slate-900/30 border border-slate-900/50 p-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div 
          className="transition-transform duration-300 origin-top shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          style={{ transform: `scale(${zoom})`, minWidth: '8.5in' }}
        >
          {/* standard A4-sized container */}
          <div 
            className="bg-white rounded-sm overflow-hidden"
            style={{ width: '8.5in', minHeight: '11in' }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </div>
      </div>
      
      {/* Visual Canvas Footer */}
      <div className="w-full text-center mt-4 text-[10px] font-medium text-slate-500 tracking-wider uppercase">
        * Display matches 1:1 exported PDF print output dimensions *
      </div>
    </div>
  );
};

export default LiveCanvas;
