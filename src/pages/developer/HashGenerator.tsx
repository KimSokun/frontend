import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { ShieldAlert, Copy, Check, Sparkles } from 'lucide-react';

export const HashGenerator: React.FC = () => {
  const tool = getToolById('hash-generator') || {
    id: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer',
    categoryName: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums instantly with 1-click copy.',
    iconName: 'ShieldAlert',
    route: '/tools/developer',
    endpoint: '/api/dev/hash'
  } as any;

  const [text, setText] = useState('AllTools Secure Platform 2026');
  const [hashes, setHashes] = useState<Record<string, string>>({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function computeClientHashes(val: string) {
    if (!val) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(val);

      const [sha1Buf, sha256Buf, sha512Buf] = await Promise.all([
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-512', data)
      ]);

      const toHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      setHashes((prev) => ({
        ...prev,
        sha1: toHex(sha1Buf),
        sha256: toHex(sha256Buf),
        sha512: toHex(sha512Buf)
      }));
    } catch {
      // Ignore webcrypto fallback
    }

    // Call server endpoint for MD5 and full validation
    try {
      const res = await apiClient.post('/dev/hash', { text: val });
      if (res.data?.hashes) {
        setHashes(res.data.hashes);
      }
    } catch {
      // Server fallback
    }
  }

  useEffect(() => {
    computeClientHashes(text);
  }, [text]);

  const copyHash = (hash: string, key: string) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="developer" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Input String / Text
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">{text.length} chars</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type or paste any text to compute cryptographic hashes in real-time..."
            className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            2. Real-Time Cryptographic Checksums
          </h3>

          <div className="space-y-3">
            {Object.entries(hashes).map(([algo, hashVal]) => (
              <div
                key={algo}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 w-24 shrink-0">
                  <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    {algo}:
                  </span>
                </div>
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 break-all flex-1 select-all">
                  {hashVal || <span className="text-slate-400">Computing...</span>}
                </span>
                <button
                  onClick={() => copyHash(hashVal, algo)}
                  disabled={!hashVal}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 hover:text-blue-600 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 self-end sm:self-center transition-all shadow-2xs"
                >
                  {copiedKey === algo ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === algo ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <ResultPanel />
      </div>
    </div>
  );
};
