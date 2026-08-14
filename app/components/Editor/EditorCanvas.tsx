import React from 'react';

interface EditorCanvasProps {
  htmlContent: string;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
}

const EditorCanvas = ({ htmlContent, zoom, onZoomChange }: EditorCanvasProps) => {
  return (
    <div className="flex-1 bg-[#f0f2f5] overflow-auto flex flex-col items-center py-12 px-6 custom-scrollbar pb-24">
      {/* Canvas Header Tools */}
      <div className="w-full max-w-[850px] mb-8 flex items-center justify-between bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex gap-4 items-center">
            <select className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
                <option>Page 1</option>
            </select>
            <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{Math.round(zoom * 100)}%</span>
            </div>
        </div>
        
        <div className="flex gap-2 items-center">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition transform hover:scale-110">↩</button>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition transform hover:scale-110">↪</button>
            <div className="w-px h-4 bg-slate-100 mx-2"></div>
            <button 
              onClick={() => onZoomChange?.(Math.max(0.5, zoom - 0.05))}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg text-slate-600 transition font-bold text-sm"
              title="Zoom Out"
            >
              -
            </button>
            <button 
              onClick={() => onZoomChange?.(Math.min(1.5, zoom + 0.05))}
              className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-lg text-slate-600 transition font-bold text-sm"
              title="Zoom In"
            >
              +
            </button>
            <button 
              onClick={() => onZoomChange?.(0.85)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition transform hover:scale-110"
              title="Reset Zoom"
            >
              📄
            </button>
            <button className="p-2 hover:bg-slate-50 text-rose-500 rounded-lg transition transform hover:scale-110">🗑️</button>
        </div>
      </div>

      {/* The Actual "Paper" Container */}
      <div 
        className="bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] origin-top transition-transform duration-300"
        style={{ 
          width: '8.5in', 
          minHeight: '11in',
          transform: `scale(${zoom})`,
          marginBottom: `calc(11in * ${zoom - 1})` // Adjust margin to prevent overlap when scaled
        }}
      >
        <div 
          className="w-full h-full p-0"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default EditorCanvas;
