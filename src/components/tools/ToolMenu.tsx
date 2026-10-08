import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Image, 
  FileText, 
  Video, 
  Zap, 
  MapPin, 
  ShieldAlert, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { TOOL_CATEGORIES, getToolsByCategory } from '../../config/tools';
import { ToolCategory } from '../../types';

interface ToolMenuProps {
  currentCategory?: ToolCategory;
}

export const ToolMenu: React.FC<ToolMenuProps> = ({ currentCategory = 'image' }) => {
  const location = useLocation();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    [currentCategory]: true,
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Image': return Image;
      case 'FileText': return FileText;
      case 'Video': return Video;
      case 'Zap': return Zap;
      case 'MapPin': return MapPin;
      case 'ShieldAlert': return ShieldAlert;
      default: return Sparkles;
    }
  };

  return (
    <>
      {/* 📱 MOBILE & TABLET: Horizontal Swipeable Category Bar (< lg) */}
      <div className="lg:hidden w-full mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 px-1">
          {TOOL_CATEGORIES.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            const isActive = currentCategory === cat.id;
            return (
              <Link
                key={cat.id}
                to={cat.route}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 💻 DESKTOP: Full Vertical Tool Navigation (>= lg) */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 self-start transition-colors">
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-blue-600" />
            <span>Tools Navigation</span>
          </h3>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/50">
            All Free
          </span>
        </div>

        <div className="space-y-1.5">
          {TOOL_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            const isOpen = openCategories[category.id] ?? (category.id === currentCategory);
            const categoryTools = getToolsByCategory(category.id as ToolCategory);
            const isCurrentActiveCat = currentCategory === category.id;

            return (
              <div key={category.id} className="rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCurrentActiveCat 
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isCurrentActiveCat ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{category.name}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && categoryTools.length > 0 && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-blue-500/20 ml-4 my-1">
                    {categoryTools.map((tool) => {
                      const isCurrentTool = location.pathname === tool.route;
                      return (
                        <Link
                          key={tool.id}
                          to={tool.route}
                          className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            isCurrentTool 
                              ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/40' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{tool.name}</span>
                            {tool.isPopular && (
                              <span className="text-[9px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-semibold px-1 rounded">
                                Hot
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
