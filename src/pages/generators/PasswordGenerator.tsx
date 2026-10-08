import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, Zap } from 'lucide-react';

export const PasswordGenerator: React.FC = () => {
  const tool = getToolById('password-generator')!;
  const [length, setLength] = useState(20);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async () => {
    setIsGenerating(true);
    try {
      const res = await apiClient.get('/generator/password', {
        params: { length, uppercase, lowercase, numbers, symbols }
      });
      if (res.data?.password) {
        setPassword(res.data.password);
      }
    } catch {
      // Fallback secure client-side generation using Web Crypto
      const chars = (uppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '') +
                    (lowercase ? 'abcdefghijklmnopqrstuvwxyz' : '') +
                    (numbers ? '0123456789' : '') +
                    (symbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '');
      const pool = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      let pass = '';
      for (let i = 0; i < length; i++) {
        pass += pool[array[i] % pool.length];
      }
      setPassword(pass);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generate();
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 16) score += 2;
    else if (length >= 12) score += 1;
    if (uppercase) score += 1;
    if (lowercase) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;

    if (score >= 6) return { label: 'Very Strong', color: 'bg-emerald-500', text: 'text-emerald-600', width: '100%' };
    if (score >= 4) return { label: 'Strong', color: 'bg-blue-500', text: 'text-blue-600', width: '75%' };
    if (score >= 3) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600', width: '50%' };
    return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600', width: '25%' };
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="generators" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Options Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Password Configuration
            </h3>

            {/* Length slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Password Length</span>
                <span className="text-sm font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-lg border border-blue-100">
                  {length} characters
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="64"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>6 min</span>
                <span>64 max</span>
              </div>
            </div>

            {/* Character switches */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Character Types</label>
              
              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <span>Uppercase Letters (A-Z)</span>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <span>Lowercase Letters (a-z)</span>
                <input
                  type="checkbox"
                  checked={lowercase}
                  onChange={(e) => setLowercase(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <span>Numbers (0-9)</span>
                <input
                  type="checkbox"
                  checked={numbers}
                  onChange={(e) => setNumbers(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800">
                <span>Special Symbols (!@#$%)</span>
                <input
                  type="checkbox"
                  checked={symbols}
                  onChange={(e) => setSymbols(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={generate}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Generate New Password</span>
            </button>
          </div>

          {/* Generated Result Card matching mockup */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                2. Generated Password
              </h3>

              {/* Password display box */}
              <div className="relative p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-base sm:text-lg break-all select-all flex items-center justify-between gap-3 shadow-inner">
                <span className="tracking-wider">{password || 'Generating...'}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors shrink-0"
                  title="Copy password"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600">Security Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Password'}</span>
                </button>

                <button
                  type="button"
                  onClick={generate}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Again</span>
                </button>
              </div>
            </div>

            <ResultPanel
              onCopy={handleCopy}
              copied={copied}
              infoItems={[
                'Cryptographically secure Python secrets module',
                'Never logged or saved on server',
                'No user account required',
                '100% Free & Unlimited'
              ]}
              faqs={[
                { question: 'Is this password generator secure?', answer: 'Yes. We use cryptographically secure random number generators (Python secrets & Web Crypto API) designed specifically for security tokens.' },
                { question: 'Do you store generated passwords?', answer: 'No. Passwords are generated on the fly and never stored in any database or server log.' }
              ]}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
