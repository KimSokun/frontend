import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';

export const TimestampConverter: React.FC = () => {
  const tool = getToolById('timestamp-converter')!;
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState(Math.floor(Date.now() / 1000).toString());
  const [converted, setConverted] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convert = (val: string) => {
    setInputTs(val);
    const num = Number(val);
    if (isNaN(num) || num === 0) {
      setConverted(null);
      return;
    }
    const ms = num > 1e11 ? num : num * 1000;
    const dt = new Date(ms);
    setConverted({
      epochSeconds: Math.floor(ms / 1000),
      epochMillis: ms,
      utcString: dt.toUTCString(),
      isoString: dt.toISOString(),
      localString: dt.toLocaleString(),
      relative: dt.toLocaleDateString()
    });
  };

  useEffect(() => {
    convert(inputTs);
  }, []);

  const handleCopy = () => {
    if (!converted) return;
    navigator.clipboard.writeText(converted.isoString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="developer" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        {/* Live Clock Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Current Unix Epoch Timestamp</span>
              <p className="text-xl font-mono font-bold text-emerald-400 mt-0.5">{currentEpoch}</p>
            </div>
          </div>
          <button
            onClick={() => convert(currentEpoch.toString())}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200"
          >
            Use Current
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Enter Timestamp</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Epoch Seconds or Milliseconds</label>
              <input
                type="text"
                value={inputTs}
                onChange={(e) => convert(e.target.value)}
                placeholder="e.g. 1770000000"
                className="w-full text-sm font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Converted Formats</h3>

            {converted ? (
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span className="font-semibold text-slate-500">ISO 8601:</span>
                  <span className="font-mono text-slate-900">{converted.isoString}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span className="font-semibold text-slate-500">UTC Date:</span>
                  <span className="font-mono text-slate-900">{converted.utcString}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between">
                  <span className="font-semibold text-slate-500">Local Time:</span>
                  <span className="font-mono text-slate-900">{converted.localString}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">Enter a valid timestamp</div>
            )}
          </div>
        </div>

        <ResultPanel onCopy={handleCopy} copied={copied} />
      </div>
    </div>
  );
};
