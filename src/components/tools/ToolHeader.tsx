import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ChevronRight, 
  Share2, 
  Heart, 
  Star, 
  Check, 
  Sparkles,
  Layers,
  Video,
  Zap,
  Database,
  Type,
  Code
} from 'lucide-react';
import { ToolItem } from '../../types';

interface ToolHeaderProps {
  tool: ToolItem;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool }) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - Free Online Tool`,
        text: tool.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return Sparkles;
      case 'pdf': return Layers;
      case 'video': return Video;
      case 'generators': return Zap;
      case 'testdata': return Database;
      case 'text': return Type;
      case 'developer': return Code;
      default: return Sparkles;
    }
  };

  const CategoryIcon = getCategoryIcon(tool.category);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <nav className="flex items-center gap-1.5 font-medium">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <Link to={`/tools/${tool.category}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {tool.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {tool.name}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-all shadow-2xs"
            title="Share this tool"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied!' : 'Share'}</span>
          </button>
          
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all shadow-2xs ${
              isFavorite 
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <CategoryIcon className="w-7 h-7 stroke-[2.2]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tool.name}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50">
              Free Tool
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {tool.description}
          </p>

          <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{tool.rating || 4.9}</span>
            <span>({tool.votesCount || 245} votes)</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% Free, No Signup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
