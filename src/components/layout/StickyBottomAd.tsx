import React, { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

interface StickyBottomAdProps {
  customHtml?: string;
  enabled?: boolean;
}

export const StickyBottomAd: React.FC<StickyBottomAdProps> = ({ 
  customHtml, 
  enabled = true 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!enabled || isDismissed) {
    return null;
  }

  // Only render if customHtml is provided or default placeholder
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex flex-col items-center justify-center pointer-events-auto transition-transform duration-300 animate-slideUp">
      {/* Top Bar with Dismiss Button & Label */}
      <div className="w-full max-w-[760px] flex items-center justify-between px-3 py-1 bg-slate-900/90 backdrop-blur-md border-t border-x border-slate-700/80 rounded-t-xl text-[10px] text-slate-400 select-none shadow-2xl">
        <div className="flex items-center gap-1.5 font-medium">
          <Megaphone className="w-3 h-3 text-blue-400" />
          <span className="uppercase tracking-wider text-slate-300 font-semibold">Sponsored</span>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Close Ad"
        >
          <span>Close</span>
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Main Sticky Banner Area */}
      <div className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-center p-2 shadow-2xl overflow-hidden">
        {/* Desktop 728x90 */}
        <div className="hidden sm:flex items-center justify-center w-full max-w-[728px] h-[90px]">
          <AdSlot 
            id="ad-sticky-desktop"
            width={728} 
            height={90} 
            label="STICKY BOTTOM BANNER"
            customHtml={customHtml}
          />
        </div>

        {/* Mobile 320x50 */}
        <div className="flex sm:hidden items-center justify-center w-full max-w-[320px] h-[50px]">
          <AdSlot 
            id="ad-sticky-mobile"
            width={320} 
            height={50} 
            label="MOBILE STICKY AD"
            customHtml={customHtml}
          />
        </div>
      </div>
    </div>
  );
};
