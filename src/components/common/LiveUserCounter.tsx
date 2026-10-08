import React, { useState, useEffect } from 'react';
import { Users, Activity, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

interface LiveStatsProps {
  variant?: 'hero' | 'header' | 'footer' | 'pill';
}

export const LiveUserCounter: React.FC<LiveStatsProps> = ({ variant = 'hero' }) => {
  // Base counter starting with persistent value (customizable via /kadmin or local storage)
  const [totalUsers, setTotalUsers] = useState<number>(() => {
    const saved = localStorage.getItem('site_total_visitors_count') || localStorage.getItem('site_base_visitor_count');
    return saved ? parseInt(saved, 10) : 1000000;
  });

  const [onlineNow, setOnlineNow] = useState<number>(() => {
    const saved = localStorage.getItem('site_online_users_count');
    return saved ? parseInt(saved, 10) : 842;
  });

  const [toolsProcessed, setToolsProcessed] = useState<number>(() => {
    const saved = localStorage.getItem('site_tools_processed_count');
    return saved ? parseInt(saved, 10) : 48920410;
  });

  useEffect(() => {
    // 1. Smooth Visitor & Tool Counter Live Increment
    const visitorInterval = setInterval(() => {
      setTotalUsers(prev => {
        const next = prev + Math.floor(Math.random() * 2) + 1;
        localStorage.setItem('site_total_visitors_count', next.toString());
        return next;
      });

      setToolsProcessed(prev => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        localStorage.setItem('site_tools_processed_count', next.toString());
        return next;
      });
    }, 3000);

    // 2. Realistic Live Online Users Fluctuations
    const onlineInterval = setInterval(() => {
      setOnlineNow(prev => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const next = prev + delta;
        return Math.max(10, next);
      });
    }, 4500);

    return () => {
      clearInterval(visitorInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  const formatNum = (num: number) => {
    return num.toLocaleString();
  };

  // Header / Pill variant (Compact)
  if (variant === 'pill' || variant === 'header') {
    return (
      <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 shadow-md backdrop-blur-md select-none">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono font-bold text-emerald-400">{formatNum(onlineNow)}</span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">Online</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3 text-blue-400" />
          <span className="font-mono font-bold text-slate-200">{formatNum(totalUsers)}</span>
          <span className="text-[11px] text-slate-400 hidden md:inline">Users</span>
        </div>
      </div>
    );
  }

  // Footer variant
  if (variant === 'footer') {
    return (
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-4 text-slate-400 select-none">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span>Live Online Users: <strong className="text-emerald-400 font-mono">{formatNum(onlineNow)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>Total Platform Access: <strong className="text-slate-200 font-mono">{formatNum(totalUsers)}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>Files Processed: <strong className="text-indigo-300 font-mono">{formatNum(toolsProcessed)}</strong></span>
        </div>
      </div>
    );
  }

  // Hero Section Variant (Full Interactive Grid)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 select-none">
      {/* Stat 1: Live Online */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[10px]">Live Online</span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
          {formatNum(onlineNow)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Active users now</span>
      </div>

      {/* Stat 2: Total Users Served */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Total Visitors</span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-blue-400 tracking-tight">
          {formatNum(totalUsers)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Global accesses</span>
      </div>

      {/* Stat 3: Total Files Processed */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
          <Activity className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">Tasks Processed</span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-indigo-300 tracking-tight">
          {formatNum(toolsProcessed)}
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">Files & conversions</span>
      </div>

      {/* Stat 4: Privacy & Uptime */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px]">System Uptime</span>
        </div>
        <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300 tracking-tight">
          99.98%
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">24/7 Shield active</span>
      </div>
    </div>
  );
};
