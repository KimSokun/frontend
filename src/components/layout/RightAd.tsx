import React from 'react';
import { AdSlot } from '../ads/AdSlot';

interface RightAdProps {
  customHtml?: string;
}

export const RightAd: React.FC<RightAdProps> = ({ customHtml }) => {
  return (
    <aside className="hidden lg:block w-[160px] shrink-0 self-start sticky top-20 select-none">
      <AdSlot 
        id="ad-right-desktop"
        width={160} 
        height={600} 
        label="RIGHT AD"
        customHtml={customHtml}
      />
    </aside>
  );
};
