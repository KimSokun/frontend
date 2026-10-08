import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { FileArchive, Loader2, Download, CheckCircle2, TrendingDown } from 'lucide-react';

export const PdfCompress: React.FC = () => {
  const tool = getToolById('compress-pdf')!;
  const [file, setFile] = useState<File | null>(null);
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

      const res = await apiClient.post('/pdf/compress', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const orig = parseInt(res.headers['x-original-size'] || file.size.toString(), 10);
      const comp = parseInt(res.headers['x-compressed-size'] || res.data.size.toString(), 10);
      const saved = parseFloat(res.headers['x-saved-percent'] || (((orig - comp) / orig) * 100).toFixed(1));

      setStats({ origSize: orig, compSize: comp, saved: Math.max(0, saved) });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to compress PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="pdf" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Select Large PDF
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
              acceptedFormats={['.pdf']}
              maxSizeMb={100}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
                setStats(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop PDF to compress"
              subtitle="Optimizes streams and fonts for smallest filesize"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                2. Compress & Shrink
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Our smart compression engine strips redundant metadata, deduplicates font subsets, and compresses raster graphics to make your PDF super light for email attachments.
              </p>
              
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                ⚡ 100% Vector clarity & text sharpness preserved.
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
                  <span>Optimizing and compressing PDF...</span>
                </>
              ) : (
                <>
                  <FileArchive className="w-4 h-4" />
                  <span>Compress PDF File</span>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">PDF Compressed Successfully!</h4>
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
                <span>Download Compressed PDF</span>
              </button>
            </div>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
