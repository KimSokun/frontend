import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ComparisonSlider } from '../../components/tools/ComparisonSlider';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Loader2, Wand2, Sliders, RefreshCw, Download, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export const RemoveLogoBg: React.FC = () => {
  const tool = getToolById('remove-logo-bg')!;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [smoothness, setSmoothness] = useState(2);
  const [tolerance, setTolerance] = useState(20);
  const [protectInner, setProtectInner] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setErrorMsg(null);
      
      const url = URL.createObjectURL(file);
      setOriginalPreviewUrl(url);
      setResultBlobUrl(null);
    }
  };

  const handleProcessLogo = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('smoothness', smoothness.toString());
      formData.append('tolerance', tolerance.toString());
      formData.append('protect_inner', protectInner.toString());

      const response = await apiClient.post('/image/remove-logo-bg', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const processedUrl = URL.createObjectURL(blob);
      setResultBlobUrl(processedUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to clean logo background.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `color-true-logo-${selectedFile?.name.replace(/\.[^/.]+$/, "") || 'logo'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalPreviewUrl(null);
    setResultBlobUrl(null);
    setErrorMsg(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="image" />

      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        {/* 100% Color True Quality Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Original Colors Preserved:</strong> We do NOT alter, wash out, or shift any color pixels inside your logo. Only the outer background is made transparent.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1: Upload */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Upload Logo or Graphic</span>
            </h3>
            
            <FileUploader
              onFilesSelected={handleFileSelected}
              acceptedFormats={['.jpg', '.jpeg', '.png', '.webp', '.bmp']}
              maxSizeMb={25}
              selectedFiles={selectedFile ? [selectedFile] : []}
              onRemoveFile={handleReset}
              isProcessing={isProcessing}
              title="Drag & drop logo image"
              subtitle="Supports JPG, PNG, WEBP with solid or gradient background"
            />
          </div>

          {/* Step 2: Smoothing & Anti-Aliasing Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>2. Clean Cutout & Color Settings</span>
              </h3>

              <div className="space-y-4">
                {/* Protect Inner Colors Checkbox */}
                <button
                  type="button"
                  onClick={() => setProtectInner(!protectInner)}
                  className="w-full flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-left transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {protectInner ? (
                    <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Protect Inner Colors & White Text
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Guarantees white lettering and details inside your logo remain 100% untouched.
                    </span>
                  </div>
                </button>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Edge Anti-Aliasing (Smoothness)</span>
                    <span className="font-bold text-blue-600">{smoothness} px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="2"
                    value={smoothness}
                    onChange={(e) => setSmoothness(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Blends the alpha border softly without touching logo RGB colors.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Background Color Tolerance</span>
                    <span className="font-bold text-blue-600">{tolerance}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-[11px] text-slate-400">Increases sensitivity for slightly non-uniform backgrounds.</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleProcessLogo}
              disabled={!selectedFile || isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Removing Background (Keeping 100% True Colors)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Remove Background (Keep True Colors)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Step 3: Interactive Results Comparison */}
        {resultBlobUrl && originalPreviewUrl && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                3. Clean Transparent Logo Result (Original Colors 100% Intact)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>New Logo</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Transparent Logo</span>
                </button>
              </div>
            </div>

            <ComparisonSlider originalImage={originalPreviewUrl} processedImage={resultBlobUrl} />
          </div>
        )}

        <ResultPanel />
      </div>
    </div>
  );
};
