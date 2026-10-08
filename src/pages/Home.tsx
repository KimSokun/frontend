import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Layers, 
  Video, 
  MapPin, 
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Tag
} from 'lucide-react';
import { TOOL_CATEGORIES, TOOLS_REGISTRY, getPopularTools } from '../config/tools';
import { LiveUserCounter } from '../components/common/LiveUserCounter';

export const Home: React.FC = () => {
  const [search, setSearch] = useState('');
  const popularTools = getPopularTools(8);

  const TRENDING_KEYWORDS = [
    { label: '🔥 Remove BG', query: 'remove background' },
    { label: '✨ Smooth Logo', query: 'logo' },
    { label: '📄 PDF to Word', query: 'pdf to word' },
    { label: '📝 Word to PDF', query: 'word to pdf' },
    { label: '📍 Fake Address', query: 'fake address' },
    { label: '🎵 Video to MP3', query: 'video to mp3' },
    { label: '🎨 Image to SVG', query: 'svg' },
    { label: '⚡ Hash Generator', query: 'hash' }
  ];

  const filteredTools = search.trim()
    ? TOOLS_REGISTRY.filter(t => 
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(search.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      )
    : TOOLS_REGISTRY;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'image': return Sparkles;
      case 'pdf': return Layers;
      case 'video': return Video;
      case 'generators': return Zap;
      case 'testdata': return MapPin;
      case 'developer': return ShieldAlert;
      default: return Sparkles;
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 border border-slate-800 p-6 sm:p-10 lg:p-12 text-center text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free &bull; No Login Required</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Simple Online Tools
          </h1>
          
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Convert, generate, compress, and edit files online with crystal clarity. No registration, no passwords, and temporary files auto-deleted.
          </p>

          {/* Search Box in Hero */}
          <div className="pt-2 max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools (e.g., remove background, pdf to word, fake address)..."
                className="w-full pl-11 pr-10 py-3.5 text-sm rounded-2xl bg-slate-800/90 text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 shadow-lg transition-all"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Trending Search Keywords Pills for Easy Discovery */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-blue-400" />
              <span>Trending:</span>
            </span>
            {TRENDING_KEYWORDS.map((kw) => (
              <button
                key={kw.query}
                onClick={() => setSearch(kw.query)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  search.toLowerCase() === kw.query.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {kw.label}
              </button>
            ))}
          </div>

          {/* Privacy Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Registration</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Auto-Deletes in 30 Min</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant High Speed</span>
            </div>
          </div>

          {/* 👥 Live Visitor & Tasks Counter Grid */}
          <LiveUserCounter variant="hero" />
        </div>
      </div>

      {/* Dynamic Keyword Match Alert Banner */}
      {search.trim() && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-between gap-3 shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Keyword Match:</strong> Found <strong>{filteredTools.length}</strong> matching tool{filteredTools.length === 1 ? '' : 's'} for query "<em>{search}</em>"
            </span>
          </div>
          <button
            onClick={() => setSearch('')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold shrink-0"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Popular Tools Section */}
      {!search.trim() && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Popular Tools</h2>
            </div>
            <span className="text-xs text-slate-400">Most used utilities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map((tool) => {
              const Icon = getCategoryIcon(tool.category);
              return (
                <Link
                  key={tool.id}
                  to={tool.route}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Popular
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Category Wise Grid or Search Results */}
      <section className="space-y-8">
        {search.trim() ? (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Search Results ({filteredTools.length})
            </h2>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTools.map((tool) => {
                  const Icon = getCategoryIcon(tool.category);
                  return (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            {tool.categoryName}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No matching tools found</h3>
                <p className="text-xs text-slate-500 mb-4">Try searching for other keywords like "pdf", "video", "word", or "address".</p>
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
                >
                  View All Tools
                </button>
              </div>
            )}
          </div>
        ) : (
          TOOL_CATEGORIES.map((cat) => {
            const catTools = TOOLS_REGISTRY.filter(t => t.category === cat.id);
            const Icon = getCategoryIcon(cat.id);

            return (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">{cat.name}</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{cat.description}</p>
                    </div>
                  </div>
                  <Link
                    to={cat.route}
                    className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Category</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catTools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {tool.name}
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Free
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span>Open Tool</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
