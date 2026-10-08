import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { Binary, Copy, Check, ArrowRightLeft } from 'lucide-react';

export const Base64Converter: React.FC = () => {
  const tool = getToolById('base64-converter')!;
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTransform = (val: string, currentMode: 'encode' | 'decode') => {
    setInput(val);
    setErrorMsg(null);
    if (!val) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(val))));
      } else {
        setOutput(decodeURIComponent(escape(atob(val.trim()))));
      }
    } catch {
      setErrorMsg('Invalid string for decoding.');
      setOutput('');
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(nextMode);
    setInput(output);
    handleTransform(output, nextMode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="text" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => { setMode('encode'); handleTransform(input, 'encode'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  mode === 'encode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Encode to Base64
              </button>
              <button
                onClick={() => { setMode('decode'); handleTransform(input, 'decode'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  mode === 'decode' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Decode from Base64
              </button>
            </div>

            <button
              onClick={toggleMode}
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Swap Input/Output</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {mode === 'encode' ? 'Plain Text Input' : 'Base64 Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => handleTransform(e.target.value, mode)}
                rows={8}
                placeholder="Type or paste here..."
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {mode === 'encode' ? 'Base64 Output' : 'Plain Text Output'}
              </label>
              <textarea
                readOnly
                value={output}
                rows={8}
                placeholder="Result will appear automatically..."
                className="w-full text-xs font-mono bg-slate-900 text-emerald-400 border border-slate-700 rounded-xl p-3 focus:outline-none select-all"
              />
            </div>
          </div>

          {errorMsg && <div className="text-xs text-rose-600">{errorMsg}</div>}

          <div className="flex justify-end">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>
        </div>

        <ResultPanel onCopy={handleCopy} copied={copied} />
      </div>
    </div>
  );
};
