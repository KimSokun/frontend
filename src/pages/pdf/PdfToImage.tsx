import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Image as ImageIcon, Loader2, Download, CheckCircle2, Sliders } from 'lucide-react';

interface Props {
  defaultFormat?: 'jpg' | 'png' | 'webp';
  toolId?: string;
}

export const PdfToImage: React.FC<Props> = ({ defaultFormat = 'jpg', toolId = 'pdf-to-jpg' }) => {
  const tool = getToolById(toolId) || getToolById('pdf-to-jpg')!;
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'jpg' | 'png' | 'webp'>(defaultFormat);
  const [dpi, setDpi] = useState<number>(150);
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
      formData.append('dpi', dpi.toString());

      const endpoint = `/pdf/pdf-to-${format}`;
      const res = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
      const url = URL.createObjectURL(new Blob([res.data], { type: mimeType }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || `Failed to convert PDF to ${format.toUpperCase()} image.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_page_1.${format}`;
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
          {/* Step 1: Upload PDF */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Select PDF Document
            </h3>
            <FileUploader
              onFilesSelected={(files) => {
                if (files.length > 0) {
                  setFile(files[0]);
                  setResultBlobUrl(null);
                  setErrorMsg(null);
                }
              }}
              acceptedFormats={['.pdf']}
              maxSizeMb={50}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => {
                setFile(null);
                setResultBlobUrl(null);
              }}
              isProcessing={isProcessing}
              title={`Drag & drop PDF to convert to ${format.toUpperCase()}`}
              subtitle="Renders pages into crisp, high-resolution images"
            />
          </div>

          {/* Step 2: Options & Convert */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Image Quality & Output Format
              </h3>

              {/* Format Switcher */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Image Format:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['jpg', 'png', 'webp'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFormat(f)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs uppercase transition-all ${
                        format === f
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution / DPI */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  <span>Resolution Quality (DPI):</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDpi(150)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      dpi === 150
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    150 DPI (Standard)
                  </button>
                  <button
                    onClick={() => setDpi(300)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      dpi === 300
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    300 DPI (Ultra HD)
                  </button>
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
                  <span>Converting PDF pages to {format.toUpperCase()}...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Convert PDF to {format.toUpperCase()} Image</span>
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

        {/* Result Preview & Download */}
        {resultBlobUrl && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {format.toUpperCase()} Image Generated Successfully!
                  </h4>
                  <p className="text-[11px] text-slate-500">Output format: .{format} • {dpi} DPI</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download {format.toUpperCase()} Image</span>
              </button>
            </div>

            {/* Visual Image Preview */}
            <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-auto">
              <img
                src={resultBlobUrl}
                alt="Converted PDF page preview"
                className="max-h-80 object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
