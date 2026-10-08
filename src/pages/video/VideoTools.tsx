import React from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowRight } from 'lucide-react';
import { getToolsByCategory } from '../../config/tools';
import { ToolMenu } from '../../components/tools/ToolMenu';

export const VideoTools: React.FC = () => {
  const tools = getToolsByCategory('video');

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="video" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Video Tools Suite</h1>
              <p className="text-xs text-slate-500">FFmpeg-powered video converter, audio extractor, and compressor.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={tool.route}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {tool.name}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Free
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{tool.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-blue-600 font-semibold pt-3 border-t border-slate-100">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
