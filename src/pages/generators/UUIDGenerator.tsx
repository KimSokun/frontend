import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Fingerprint, Copy, Check, RefreshCw, Download } from 'lucide-react';

export const UUIDGenerator: React.FC = () => {
  const tool = getToolById('uuid-generator')!;
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState('v4');
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await apiClient.get('/generator/uuid', { params: { count, version } });
      if (res.data?.uuids) {
        setUuids(res.data.uuids);
      }
    } catch {
      // Fallback
      const generated = Array.from({ length: count }, () => crypto.randomUUID());
      setUuids(generated);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generate();
  }, [count, version]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${count}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="generators" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Configuration</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">UUID Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="v4">UUID v4 (Cryptographically Random)</option>
                <option value="v7">UUID v7 (Time-Ordered Unique)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Quantity</span>
                <span className="text-blue-600 font-bold">{count} UUIDs</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              onClick={generate}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Generate UUIDs</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Generated UUID List</h3>
                <span className="text-xs text-slate-400 font-mono">{uuids.length} total</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-emerald-400 space-y-1.5 max-h-60 overflow-y-auto select-all">
                {uuids.map((id, idx) => (
                  <div key={idx} className="hover:text-white transition-colors cursor-pointer" onClick={() => navigator.clipboard.writeText(id)}>
                    {id}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCopyAll}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied All!' : 'Copy All'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            <ResultPanel
              onCopy={handleCopyAll}
              copied={copied}
              infoItems={[
                'RFC 4122 Standard Compliant',
                'Cryptographically Unique',
                'Zero Tracking or Logging'
              ]}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
