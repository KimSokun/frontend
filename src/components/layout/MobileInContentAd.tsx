import React from 'react';
import { AdSlot } from '../ads/AdSlot';

interface MobileInContentAdProps {
  customHtml?: string;
  enabled?: boolean;
}

export const MobileInContentAd: React.FC<MobileInContentAdProps> = ({ 
  customHtml, 
  enabled = true 
}) => {
  if (!enabled) return null;

  return (
    <div className="block lg:hidden w-full my-6 flex justify-center items-center select-none overflow-hidden">
      <div className="w-full max-w-[320px] sm:max-w-[468px] flex justify-center">
        <AdSlot
          id="ad-mobile-incontent"
          width={320}
          height={100}
          label="MOBILE SPONSORED"
          customHtml={customHtml}
        />
      </div>
    </div>
  );
};
