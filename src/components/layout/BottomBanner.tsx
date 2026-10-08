import React from 'react';
import { AdSlot } from '../ads/AdSlot';

interface BottomBannerProps {
  customHtml?: string;
}

export const BottomBanner: React.FC<BottomBannerProps> = ({ customHtml }) => {
  return (
    <div className="w-full flex justify-center py-6 select-none overflow-hidden">
      <div className="max-w-full overflow-x-auto">
        <AdSlot 
          id="ad-bottom-banner"
          width={728} 
          height={90} 
          label="FOOTER BANNER"
          customHtml={customHtml}
        />
      </div>
    </div>
  );
};
