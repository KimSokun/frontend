import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { FilePlus2, Loader2, Download, CheckCircle2 } from 'lucide-react';

export const JpgToPdf: React.FC = () => {
  const tool = getToolById('jpg-to-pdf') || getToolById('image-to-pdf')!;
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      files.forEach((f) => {
        formData.append('files', f);
      });

      const res = await apiClient.post('/pdf/jpg-to-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to convert images to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = 'images_combined.pdf';
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
              1. Select Images (JPG, PNG, WEBP)
            </h3>
            <FileUploader
              onFilesSelected={(newFiles) => {
                setFiles((prev) => [...prev, ...newFiles]);
                setResultBlobUrl(null);
                setErrorMsg(null);
              }}
              acceptedFormats={['.jpg', '.jpeg', '.png', '.webp']}
              maxSizeMb={50}
              multiple={true}
              selectedFiles={files}
              onRemoveFile={(idx) => {
                setFiles((prev) => prev.filter((_, i) => i !== idx));
                setResultBlobUrl(null);
              }}
              isProcessing={isProcessing}
              title="Drag & drop images to convert"
              subtitle="Combine multiple images into one clean PDF"
            />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                2. Convert & Combine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Arrange and combine multiple image files into a single standardized PDF document in sequential order.
              </p>
              
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                ✨ Selected: <strong>{files.length}</strong> image{files.length !== 1 ? 's' : ''} ready to combine.
              </div>
            </div>

            <button
              onClick={handleProcess}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Combining images into PDF...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Convert Images to PDF</span>
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
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">PDF Document Ready!</h4>
                <p className="text-[11px] text-slate-500">{files.length} images combined successfully</p>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Document</span>
            </button>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
