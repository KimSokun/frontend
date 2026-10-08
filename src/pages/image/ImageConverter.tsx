import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { RefreshCw, Loader2, Download, ArrowRightLeft } from 'lucide-react';

export const ImageConverter: React.FC = () => {
  const tool = getToolById('image-converter')!;
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatOptions = [
    { id: 'png', name: 'PNG', desc: 'Lossless & Transparent' },
    { id: 'jpg', name: 'JPG', desc: 'High Compatibility' },
    { id: 'webp', name: 'WEBP', desc: 'Compact Modern Web' },
    { id: 'ico', name: 'ICO', desc: 'Favicon & App Icon' },
    { id: 'svg', name: 'SVG', desc: 'Scalable Vector' },
    { id: 'bmp', name: 'BMP', desc: 'Uncompressed Bitmap' }
  ];

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_format', targetFormat);
      formData.append('quality', quality.toString());

      const res = await apiClient.post('/image/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const mimeMap: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        webp: 'image/webp',
        ico: 'image/x-icon',
        svg: 'image/svg+xml',
        bmp: 'image/bmp'
      };

      const url = URL.createObjectURL(new Blob([res.data], { type: mimeMap[targetFormat] || 'application/octet-stream' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Conversion failed. Please try another format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${targetFormat}`;
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="image" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">1. Select Source Image</h3>
            <FileUploader
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  setFile(files[0]);
                  setResultBlobUrl(null);
                  setErrorMsg(null);
                }
              }}
              acceptedFormats={['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.ico', '.svg']}
              maxSizeMb={50}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop any image file"
              subtitle="Supports JPG, PNG, WEBP, ICO, SVG, BMP"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>2. Select Target Output Format</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {formatOptions.map((fmt) => (
                  <button
                    key={fmt.id}
                    onClick={() => setTargetFormat(fmt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      targetFormat === fmt.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold ring-1 ring-blue-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold">{fmt.name}</span>
                    <span className="text-[10px] text-slate-400 block font-normal">{fmt.desc}</span>
                  </button>
                ))}
              </div>

              {['jpg', 'webp'].includes(targetFormat) && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Quality: {quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting Image...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Convert to {targetFormat.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {resultBlobUrl && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Conversion Ready!</h4>
              <p className="text-[11px] text-slate-500">Target format: {targetFormat.toUpperCase()}</p>
            </div>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download {targetFormat.toUpperCase()}</span>
            </button>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
