import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wrench, 
  Home, 
  Image as ImageIcon, 
  FileText, 
  Video as VideoIcon, 
  Zap, 
  MapPin, 
  ShieldAlert, 
  Search, 
  Menu, 
  X,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { TOOLS_REGISTRY } from '../../config/tools';
import { useTheme } from '../../hooks/useTheme';
import { LiveUserCounter } from '../common/LiveUserCounter';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  const filteredTools = searchQuery.trim() 
    ? TOOLS_REGISTRY.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTool = (route: string) => {
    navigate(route);
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Image Tools', path: '/tools/image', icon: ImageIcon },
    { name: 'PDF Tools', path: '/tools/pdf', icon: FileText },
    { name: 'Video Tools', path: '/tools/video', icon: VideoIcon },
    { name: 'Generators', path: '/tools/generators', icon: Zap },
    { name: 'Fake Address Generator', path: '/tools/testdata', icon: MapPin },
    { name: 'Hash Generator', path: '/tools/developer', icon: ShieldAlert },
  ];

  const getThemeIcon = () => {
    if (theme === 'dark') return Moon;
    if (theme === 'light') return Sun;
    return Laptop;
  };

  const CurrentThemeIcon = getThemeIcon();

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a] text-slate-100 shadow-md border-b border-slate-800 select-none">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 bg-slate-900 border border-slate-700/80 p-0.5 flex items-center justify-center">
              <img src="/logo.svg" alt="AllTools Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  AllTools
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Free
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden sm:block">One Place. Many Tools.</p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-inner' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Live Search Bar */}
          <div className="relative flex-1 max-w-xs md:max-w-sm" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-800/90 text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete dropdown */}
            {isSearchOpen && searchQuery.trim() && (
              <div className="absolute left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50">
                <div className="p-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Found {filteredTools.length} tools
                </div>
                {filteredTools.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {filteredTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSelectTool(tool.route)}
                        className="w-full text-left p-3 hover:bg-slate-800/80 transition-colors flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-white truncate">{tool.name}</span>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              {tool.categoryName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{tool.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No tools found matching &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Live Visitor & Activity Counter Pill */}
          <div className="hidden sm:flex items-center">
            <LiveUserCounter variant="pill" />
          </div>

          {/* Theme Selector (Light / Dark / System) */}
          <div className="relative" ref={themeRef}>
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors text-xs font-semibold"
              title="Change color theme"
              aria-label="Theme Switcher"
            >
              <CurrentThemeIcon className="w-4 h-4 text-amber-400 dark:text-blue-400" />
              <span className="capitalize hidden md:inline">{theme}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 z-50 text-xs animate-fadeIn">
                <button
                  onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    theme === 'light' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    theme === 'dark' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4 text-blue-400" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${
                    theme === 'system' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <span>System Auto</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile navigation slide-down menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-2xl animate-fadeIn">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
