import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdSlotProps {
  id?: string;
  width: number;
  height: number;
  label?: string;
  className?: string;
  customHtml?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  id,
  width,
  height,
  label = 'ADVERTISEMENT',
  className = '',
  customHtml
}) => {
  if (customHtml && customHtml.trim().length > 0) {
    // Wrap inside an isolated HTML document so each Adsterra/AdSense banner has its own independent window.atOptions
    const isolatedDoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base target="_blank">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: transparent;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${customHtml}
</body>
</html>`;

    return (
      <div 
        id={id}
        style={{ width: `${width}px`, minHeight: `${height}px` }}
        className={`flex items-center justify-center overflow-hidden rounded-xl bg-transparent ${className}`}
      >
        <iframe
          title={label}
          srcDoc={isolatedDoc}
          width={width}
          height={height}
          style={{ 
            border: 'none', 
            overflow: 'hidden', 
            width: `${width}px`, 
            height: `${height}px`,
            maxWidth: '100%'
          }}
          scrolling="no"
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: `${width}px`, minHeight: `${height}px` }}
      className={`border-2 border-dashed border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 to-slate-100/60 dark:from-slate-900/60 dark:to-slate-900/90 rounded-2xl flex flex-col items-center justify-center p-4 text-center select-none shadow-xs transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
        <Megaphone className="w-6 h-6 stroke-[1.75]" />
      </div>
      <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
        {label}
      </span>
      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
        [{width} × {height}]
      </span>
      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 w-full flex items-center justify-center gap-1 text-[11px] text-blue-500 dark:text-blue-400 font-medium hover:underline cursor-pointer">
        <span>Advertise Here</span>
        <ExternalLink className="w-3 h-3" />
      </div>
    </div>
  );
};
