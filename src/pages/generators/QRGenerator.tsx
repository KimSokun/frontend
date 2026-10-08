import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { QrCode, Download, Copy, Check, RefreshCw } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const tool = getToolById('qr-code-generator') || getToolById('qr-generator') || {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'generators',
    categoryName: 'Generators',
    description: 'Generate customizable, high-resolution QR codes for links, text, and WiFi with instant PNG download.',
    iconName: 'QrCode',
    route: '/tools/generator/qr-code',
    endpoint: '/api/generator/qr'
  } as any;

  const [data, setData] = useState('https://alltools.online');
  const [size, setSize] = useState(10);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [format, setFormat] = useState('png');
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!data.trim()) return;
    setIsGenerating(true);
    try {
      const res = await apiClient.post('/generator/qr', {
        data,
        size,
        errorCorrection,
        format
      });
      if (res.data?.qrDataUri) {
        setQrUri(res.data.qrDataUri);
      } else {
        setQrUri(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`);
      }
    } catch {
      // High reliability fallback
      setQrUri(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generate();
  }, [data, size, errorCorrection, format]);

  const handleDownload = () => {
    if (!qrUri) return;
    const a = document.createElement('a');
    a.href = qrUri;
    a.download = `qrcode_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    if (!qrUri) return;
    navigator.clipboard.writeText(qrUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="generators" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1: Config */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. QR Code Content & Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Text, Website URL, or WiFi details
              </label>
              <textarea
                value={data}
                onChange={(e) => setData(e.target.value)}
                rows={4}
                placeholder="Enter https://yourwebsite.com or text to encode..."
                className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Error Correction
                </label>
                <select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="png">PNG (Raster Image)</option>
                  <option value="svg">SVG (Vector Scalable)</option>
                </select>
              </div>
            </div>

            <button
              onClick={generate}
              disabled={isGenerating || !data.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate QR Code</span>
            </button>
          </div>

          {/* Step 2: Preview & Download */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col items-center justify-center space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider self-start">
                2. Live QR Code Preview
              </h3>
              
              <div className="p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center min-h-[220px]">
                {qrUri ? (
                  <img src={qrUri} alt="Generated QR Code" className="w-52 h-52 object-contain" />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR code...
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 w-full">
                <button
                  onClick={handleCopy}
                  disabled={!qrUri}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied URI' : 'Copy Data URI'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!qrUri}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download {format.toUpperCase()}</span>
                </button>
              </div>
            </div>

            <ResultPanel
              onDownload={handleDownload}
              downloadLabel={`Download ${format.toUpperCase()} QR Code`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
