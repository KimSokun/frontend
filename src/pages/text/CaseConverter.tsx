import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { CaseUpper, Copy, Check } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const tool = getToolById('case-converter')!;
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = (mode: string) => {
    if (!text) return;
    const words = text.match(/[A-Za-z0-9]+/g) || [];
    
    if (mode === 'upper') setText(text.toUpperCase());
    else if (mode === 'lower') setText(text.toLowerCase());
    else if (mode === 'title') setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()));
    else if (mode === 'camel') {
      if (!words.length) return;
      setText(words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''));
    }
    else if (mode === 'snake') setText(words.map(w => w.toLowerCase()).join('_'));
    else if (mode === 'kebab') setText(words.map(w => w.toLowerCase()).join('-'));
    else if (mode === 'pascal') setText(words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="text" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Case Transform Buttons</h3>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => convert('upper')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              UPPERCASE
            </button>
            <button onClick={() => convert('lower')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              lowercase
            </button>
            <button onClick={() => convert('title')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              Title Case
            </button>
            <button onClick={() => convert('camel')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              camelCase
            </button>
            <button onClick={() => convert('snake')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              snake_case
            </button>
            <button onClick={() => convert('kebab')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              kebab-case
            </button>
            <button onClick={() => convert('pascal')} className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              PascalCase
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Type or paste your text here and click any case button above..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-blue-500 font-sans"
          />

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Converted Text'}</span>
            </button>
          </div>
        </div>

        <ResultPanel onCopy={handleCopy} copied={copied} />
      </div>
    </div>
  );
};
