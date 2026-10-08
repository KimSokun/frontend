import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Minimize2, Loader2, Download, CheckCircle2, TrendingDown } from 'lucide-react';

export const VideoCompressor: React.FC = () => {
  const tool = getToolById('video-compressor')!;
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<number>(28); // CRF 28 = balanced
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{ origSize: number; compSize: number; saved: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    setStats(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('crf', compressionLevel.toString());

      const res = await apiClient.post('/video/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const orig = parseInt(res.headers['x-original-size'] || file.size.toString(), 10);
      const comp = parseInt(res.headers['x-compressed-size'] || res.data.size.toString(), 10);
      const saved = parseFloat(res.headers['x-saved-percent'] || (((orig - comp) / orig) * 100).toFixed(1));

      setStats({ origSize: orig, compSize: comp, saved: Math.max(0, saved) });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'video/mp4' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compress video.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="video" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Select Video File
            </h3>
            <FileUploader
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  setFile(files[0]);
                  setResultBlobUrl(null);
                  setStats(null);
                  setErrorMsg(null);
                }
              }}
              acceptedFormats={['.mp4', '.mkv', '.mov', '.avi', '.webm']}
              maxSizeMb={200}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
                setStats(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop video to compress"
              subtitle="Optimizes bitrate and streams for email/chat sharing"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Compression Intensity
              </h3>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCompressionLevel(23)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    compressionLevel === 23
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">Low</div>
                  <div className="text-[10px] opacity-80 mt-0.5">High Quality</div>
                </button>
                <button
                  onClick={() => setCompressionLevel(28)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    compressionLevel === 28
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">Balanced</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Recommended</div>
                </button>
                <button
                  onClick={() => setCompressionLevel(32)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    compressionLevel === 32
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">Strong</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Smallest Size</div>
                </button>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                📦 Optimized for Discord 25MB limit and WhatsApp uploads.
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Compressing video stream...</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Compress Video File</span>
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Video Compressed Successfully!</h4>
                  {stats && (
                    <p className="text-[11px] text-slate-500">
                      Reduced from {formatBytes(stats.origSize)} to <strong>{formatBytes(stats.compSize)}</strong>
                    </p>
                  )}
                </div>
              </div>

              {stats && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  <TrendingDown className="w-4 h-4" />
                  <span>Saved {stats.saved}%</span>
                </div>
              )}

              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Video</span>
              </button>
            </div>

            <div className="flex justify-center bg-black/90 p-4 rounded-xl max-h-96">
              <video src={resultBlobUrl} controls className="max-h-80 rounded-lg shadow-md" />
            </div>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
