import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { LeftAd } from './LeftAd';
import { RightAd } from './RightAd';
import { BottomBanner } from './BottomBanner';
import { StickyBottomAd } from './StickyBottomAd';
import { MobileInContentAd } from './MobileInContentAd';
import { apiClient, adminClient } from '../../services/api';
import { setDirectLinkConfig } from '../../services/adManager';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [ads, setAds] = useState<{
    leftAd?: { enabled: boolean; customHtml: string };
    rightAd?: { enabled: boolean; customHtml: string };
    bottomBanner?: { enabled: boolean; customHtml: string };
    stickyBottomAd?: { enabled: boolean; customHtml: string };
    mobileAd?: { enabled: boolean; customHtml: string };
    directLinkUrl?: string;
    downloadAd?: { enabled: boolean; url: string };
  }>(() => {
    try {
      const cached = localStorage.getItem('cached_ads_config') || localStorage.getItem('admin_ads_config');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchAds = async () => {
      // 1. Try public API endpoint (FastAPI Engine)
      try {
        const res = await apiClient.get('/ads');
        if (res.data?.ads) {
          const adData = res.data.ads;
          setAds(adData);
          localStorage.setItem('cached_ads_config', JSON.stringify(adData));
          if (adData.directLinkUrl || adData.downloadAd?.url) {
            setDirectLinkConfig(adData.directLinkUrl || adData.downloadAd?.url, adData.downloadAd?.enabled ?? true);
          }
          return;
        }
      } catch (_) {}

      // 2. Fallback to Admin API endpoint
      try {
        const res = await adminClient.get('/ads');
        if (res.data) {
          const adData = res.data.ads || res.data;
          setAds(adData);
          localStorage.setItem('cached_ads_config', JSON.stringify(adData));
          if (adData.directLinkUrl || adData.downloadAd?.url) {
            setDirectLinkConfig(adData.directLinkUrl || adData.downloadAd?.url, adData.downloadAd?.enabled ?? true);
          }
        }
      } catch (err) {
        console.error('Failed to load ad configurations', err);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] text-slate-800 dark:text-slate-100 transition-colors duration-200 pb-24">
      {/* 1. Header */}
      <Header />

      {/* 2. Three-Column Desktop Structure */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="flex justify-center items-start gap-4 lg:gap-6">
          
          {/* Left Column Ad (160x600) */}
          {(ads.leftAd?.enabled !== false) && (
            <LeftAd customHtml={ads.leftAd?.customHtml} />
          )}

          {/* Middle Column (Tool workspace + Tool menu) */}
          <div className="flex-1 min-w-0 max-w-5xl w-full">
            {children || <Outlet />}

            {/* Mobile In-Content Ad */}
            {(ads.mobileAd?.enabled !== false) && (
              <MobileInContentAd 
                customHtml={ads.mobileAd?.customHtml || ads.bottomBanner?.customHtml} 
                enabled={ads.mobileAd?.enabled ?? true}
              />
            )}
          </div>

          {/* Right Column Ad (160x600) */}
          {(ads.rightAd?.enabled !== false) && (
            <RightAd customHtml={ads.rightAd?.customHtml} />
          )}

        </div>

        {/* Bottom Banner Ad (728x90) */}
        {(ads.bottomBanner?.enabled !== false) && (
          <BottomBanner customHtml={ads.bottomBanner?.customHtml} />
        )}
      </main>

      {/* 3. Sticky Floating Anchor Ad (Desktop 728x90 / Mobile 320x50 - Stays Fixed on Scroll) */}
      {(ads.stickyBottomAd?.enabled !== false) && (
        <StickyBottomAd 
          customHtml={ads.stickyBottomAd?.customHtml || ads.bottomBanner?.customHtml} 
          enabled={ads.stickyBottomAd?.enabled ?? true}
        />
      )}

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};
