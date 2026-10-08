import React, { useState, useRef, useCallback } from 'react';
import { Columns, SplitSquareVertical } from 'lucide-react';

interface ComparisonSliderProps {
  originalImage: string;
  processedImage: string;
  originalLabel?: string;
  processedLabel?: string;
  heightClass?: string;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  originalImage,
  processedImage,
  originalLabel = 'Original Image',
  processedLabel = 'Processed Result',
  heightClass = 'h-64 sm:h-80 md:h-96'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isSideBySide, setIsSideBySide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-200">Mode:</span>
          <span>{isSideBySide ? 'Side-by-Side View' : 'Interactive Split Slider'}</span>
        </div>
        <button
          type="button"
          onClick={() => setIsSideBySide(!isSideBySide)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors shadow-2xs"
        >
          {isSideBySide ? <SplitSquareVertical className="w-3.5 h-3.5" /> : <Columns className="w-3.5 h-3.5" />}
          <span>{isSideBySide ? 'Switch to Slider' : 'Side-by-Side'}</span>
        </button>
      </div>

      {isSideBySide ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 overflow-hidden text-center shadow-xs">
            <span className="inline-block text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg mb-2">
              {originalLabel}
            </span>
            <div className={`relative ${heightClass} flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden`}>
              <img src={originalImage} alt={originalLabel} className="max-h-full max-w-full object-contain p-2" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 overflow-hidden text-center shadow-xs">
            <span className="inline-block text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg mb-2">
              {processedLabel}
            </span>
            <div className={`relative ${heightClass} flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-xl overflow-hidden`}>
              <img src={processedImage} alt={processedLabel} className="max-h-full max-w-full object-contain p-2" />
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative ${heightClass} w-full rounded-2xl overflow-hidden select-none cursor-ew-resize border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950`}
        >
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <img src={processedImage} alt={processedLabel} className="max-h-full max-w-full object-contain" />
            <span className="absolute bottom-3 right-3 text-[11px] font-bold bg-emerald-600/90 text-white px-2.5 py-1 rounded-lg shadow-sm">
              {processedLabel}
            </span>
          </div>

          <div
            className="absolute inset-0 overflow-hidden bg-slate-900"
            style={{ width: `${sliderPosition}%` }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-2" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
              <img src={originalImage} alt={originalLabel} className="max-h-full max-w-full object-contain" />
            </div>
            <span className="absolute bottom-3 left-3 text-[11px] font-bold bg-slate-900/90 text-white px-2.5 py-1 rounded-lg shadow-sm">
              {originalLabel}
            </span>
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-xl border-2 border-blue-500 flex items-center justify-center text-slate-700 dark:text-white font-bold text-xs -ml-0.5">
              ↔
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
