import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Minimize2, Loader2, TrendingDown } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const tool = getToolById('image-compressor')!;
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ origSize: number; newSize: number; savedPercent: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality.toString());

      const res = await apiClient.post('/image/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const origSize = Number(res.headers['x-original-size']) || file.size;
      const newSize = Number(res.headers['x-compressed-size']) || res.data.size;
      const savedPercent = Number(res.headers['x-saved-percent']) || 0;

      setStats({ origSize, newSize, savedPercent });
      setResultBlobUrl(URL.createObjectURL(new Blob([res.data])));
    } catch (err: any) {
      setErrorMsg(err.message || 'Compression failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `compressed-${file.name}`;
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="image" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">1. Select Image</h3>
            <FileUploader
              onFilesSelected={(files) => { setFile(files[0]); setResultBlobUrl(null); setStats(null); }}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => { setFile(null); setResultBlobUrl(null); setStats(null); }}
              isProcessing={isProcessing}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Compression Quality</h3>
            
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span>Compression Level</span>
                <span className="text-blue-600 font-bold">{quality}% (Balanced)</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Smaller Size</span>
                <span>Better Quality</span>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={!file || isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Minimize2 className="w-4 h-4" />}
              <span>Compress Image Now</span>
            </button>
          </div>
        </div>

        {errorMsg && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs">{errorMsg}</div>}

        {stats && resultBlobUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Compression Results</h3>

              {/* Compression Saved Badge Banner matching user requirements */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-800 font-medium">Original: {formatSize(stats.origSize)} → Result: {formatSize(stats.newSize)}</span>
                    <p className="text-base font-extrabold text-emerald-900">Saved {stats.savedPercent}% ({formatSize(stats.origSize - stats.newSize)})</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-lg">
                  -{stats.savedPercent}%
                </span>
              </div>

              <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
                <img src={resultBlobUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ResultPanel
                onDownload={handleDownload}
                downloadLabel="Download Compressed Image"
                onReset={() => { setFile(null); setResultBlobUrl(null); setStats(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
