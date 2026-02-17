import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.css';

interface EquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (equation: string, inline: boolean) => void;
}

export function EquationModal({ isOpen, onClose, onConfirm }: EquationModalProps) {
  const [equation, setEquation] = useState('');
  const [inline, setInline] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Live Preview Logic
  useEffect(() => {
    if (previewRef.current) {
      if (equation.trim() === '') {
        previewRef.current.innerHTML = '<span class="text-gray-400 italic">Preview will appear here...</span>';
      } else {
        try {
          katex.render(equation, previewRef.current, {
            displayMode: !inline,
            errorColor: '#ef4444',
            throwOnError: false,
            strict: 'ignore'
          });
        } catch (error) {
          console.error('KaTeX preview error:', error);
        }
      }
    }
  }, [equation, inline]);

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) setEquation('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}  
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-800">Insert Math Equation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">LaTeX Equation</label>
            <textarea
              autoFocus
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="e.g., f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi"
              className="w-full h-24 p-3 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Toggle Inline vs Block */}
          <label className="flex items-center gap-2 cursor-pointer group w-max">
            <input 
              type="checkbox" 
              checked={inline} 
              onChange={(e) => setInline(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              Inline Math (renders inside text)
            </span>
          </label>

          {/* Live Preview Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Preview</label>
            <div className="min-h-[80px] p-4 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-x-auto shadow-inner">
              <div ref={previewRef} className="text-gray-800 text-lg"></div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(equation, inline)}
            disabled={!equation.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
          >
            Insert Equation
          </button>
        </div>
      </div>
    </div>
  );
}