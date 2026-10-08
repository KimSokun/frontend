import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { Braces, Copy, Check, Minimize, Maximize2, AlertCircle } from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const tool = getToolById('json-formatter')!;
  const [input, setInput] = useState('{"name":"AllTools","version":1.0,"features":["Fast","No Account","Auto-Cleanup"]}');
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (indent: number = 2) => {
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e: any) {
      setErrorMsg(`JSON Parse Error: ${e.message}`);
      setOutput('');
    }
  };

  const minifyJson = () => {
    formatJson(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="developer" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">JSON Formatter & Validator</h3>
            <div className="flex gap-2">
              <button
                onClick={() => formatJson(2)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Format (2 spaces)</span>
              </button>
              <button
                onClick={() => formatJson(4)}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <span>Format (4 spaces)</span>
              </button>
              <button
                onClick={minifyJson}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Minimize className="w-3.5 h-3.5" />
                <span>Minify JSON</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Raw JSON Input</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={12}
                placeholder="Paste unformatted JSON here..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Formatted Output</label>
              <textarea
                readOnly
                value={output || input}
                rows={12}
                placeholder="Formatted JSON will appear here..."
                className="w-full text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl p-3 focus:outline-none select-all"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted JSON'}</span>
            </button>
          </div>
        </div>

        <ResultPanel onCopy={handleCopy} copied={copied} />
      </div>
    </div>
  );
};
