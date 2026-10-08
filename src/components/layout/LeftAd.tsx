import React from 'react';
import { AdSlot } from '../ads/AdSlot';

interface LeftAdProps {
  customHtml?: string;
}

export const LeftAd: React.FC<LeftAdProps> = ({ customHtml }) => {
  return (
    <aside className="hidden lg:block w-[160px] shrink-0 self-start sticky top-20 select-none">
      <AdSlot 
        id="ad-left-desktop"
        width={160} 
        height={600} 
        label="LEFT AD"
        customHtml={customHtml}
      />
    </aside>
  );
};
