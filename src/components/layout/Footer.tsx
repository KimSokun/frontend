import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Heart, ShieldCheck, Zap } from 'lucide-react';
import { TOOL_CATEGORIES } from '../../config/tools';
import { LiveUserCounter } from '../common/LiveUserCounter';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 mt-12 transition-colors">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                AllTools
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Free, fast, and anonymous online utilities. Convert media, generate cryptographic passwords, create fake address profiles, and compute hash checksums with zero signup required.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Temporary files auto deleted after 30 mins</span>
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Tool Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOL_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link to={cat.route} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Featured Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools/image/remove-background" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Remove Background
                </Link>
              </li>
              <li>
                <Link to="/tools/pdf/merge" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/tools/video/to-mp3" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Video to MP3
                </Link>
              </li>
              <li>
                <Link to="/tools/testdata" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-blue-600 dark:text-blue-400">
                  Fake Address Generator (Hot)
                </Link>
              </li>
              <li>
                <Link to="/tools/developer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Hash Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  DMCA & Mock Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Live Visitor & Platform Stats Bar in Footer */}
        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <LiveUserCounter variant="footer" />
        </div>

        <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AllTools. All rights reserved. Free Online Utilities Platform.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for everyone</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
