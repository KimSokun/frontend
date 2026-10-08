import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Film, Loader2, Download, CheckCircle2 } from 'lucide-react';

export const VideoToGif: React.FC = () => {
  const tool = getToolById('video-to-gif')!;
  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState<number>(12);
  const [width, setWidth] = useState<number>(480);
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
      formData.append('fps', fps.toString());
      formData.append('width', width.toString());

      const res = await apiClient.post('/video/to-gif', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'image/gif' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to convert video to animated GIF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.gif`;
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
              1. Select Video Clip
            </h3>
            <FileUploader
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  setFile(files[0]);
                  setResultBlobUrl(null);
                  setErrorMsg(null);
                }
              }}
              acceptedFormats={['.mp4', '.mkv', '.mov', '.avi', '.webm']}
              maxSizeMb={200}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop video clip to convert to GIF"
              subtitle="Creates high-framerate animated GIFs"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. GIF Smoothness & Dimension
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Framerate (FPS):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 15, 24].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFps(f)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                        fps === f
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f} FPS {f === 15 ? '(Standard)' : f === 24 ? '(Ultra)' : '(Compact)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  GIF Width Resolution:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[320, 480, 640].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWidth(w)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                        width === w
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
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
                  <span>Generating 2-pass Palette Animated GIF...</span>
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  <span>Generate Animated GIF</span>
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
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Animated GIF Generated!</h4>
                  <p className="text-[11px] text-slate-500">{fps} FPS • {width}px width</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Animated GIF</span>
              </button>
            </div>

            <div className="flex justify-center bg-slate-950 p-4 rounded-xl">
              <img src={resultBlobUrl} alt="Animated GIF result" className="max-h-80 rounded-lg shadow-md" />
            </div>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
