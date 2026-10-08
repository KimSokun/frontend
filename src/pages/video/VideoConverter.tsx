import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Video, Loader2, Download, CheckCircle2 } from 'lucide-react';

export const VideoConverter: React.FC = () => {
  const tool = getToolById('video-converter')!;
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'mp4' | 'webm' | 'mkv' | 'mov' | 'avi'>('mp4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('output_format', targetFormat);

      const res = await apiClient.post('/video/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const mimeMap: Record<string, string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mkv: 'video/x-matroska',
        mov: 'video/quicktime',
        avi: 'video/x-msvideo'
      };

      const url = URL.createObjectURL(new Blob([res.data], { type: mimeMap[targetFormat] || 'video/mp4' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to convert video to ${targetFormat.toUpperCase()}.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${targetFormat}`;
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
                  setErrorMsg(null);
                }
              }}
              acceptedFormats={['.mp4', '.mkv', '.mov', '.avi', '.webm', '.flv', '.wmv']}
              maxSizeMb={200}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop video to convert"
              subtitle="Supports MP4, MKV, MOV, AVI, WEBM"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Target Output Format
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['mp4', 'webm', 'mkv', 'mov', 'avi'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setTargetFormat(fmt)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs uppercase transition-all ${
                      targetFormat === fmt
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                ⚡ Hardware accelerated encoding with H.264 & VP9 codecs.
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
                  <span>Converting video to {targetFormat.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {targetFormat.toUpperCase()} Video Ready!
                  </h4>
                  <p className="text-[11px] text-slate-500">Output: {file?.name.replace(/\.[^/.]+$/, "")}.{targetFormat}</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download {targetFormat.toUpperCase()} Video</span>
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
