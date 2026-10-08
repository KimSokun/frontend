import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ComparisonSlider } from '../../components/tools/ComparisonSlider';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Loader2, Sparkles, RefreshCw, Sliders } from 'lucide-react';

export const RemoveBackground: React.FC = () => {
  const tool = getToolById('remove-background')!;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpg'>('png');
  const [quality, setQuality] = useState(100);
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      setErrorMsg(null);
      
      const url = URL.createObjectURL(file);
      setOriginalPreviewUrl(url);
      setResultBlobUrl(null); // reset previous result
    }
  };

  const handleProcessRemoveBg = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await apiClient.post('/image/remove-background', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'image/png' });
      const processedUrl = URL.createObjectURL(blob);
      setResultBlobUrl(processedUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to remove background. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (format: 'png' | 'jpg' = 'png') => {
    if (!resultBlobUrl) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `removed-bg-${selectedFile?.name.replace(/\.[^/.]+$/, "") || 'image'}.${format}`;
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
      {/* 1. Left Sidebar Tool Menu */}
      <ToolMenu currentCategory="image" />

      {/* 2. Main Tool Workspace Area matching user's mockup */}
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        {/* 2-Column Grid for Upload & Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Step 1: Upload Image */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Upload Image</span>
            </h3>
            
            <FileUploader
              onFilesSelected={handleFileSelected}
              acceptedFormats={['.jpg', '.jpeg', '.png', '.webp']}
              maxSizeMb={25}
              selectedFiles={selectedFile ? [selectedFile] : []}
              onRemoveFile={handleReset}
              isProcessing={isProcessing}
              title="Drag & drop your image here"
              subtitle="JPG, PNG, WEBP up to 25MB"
            />
          </div>

          {/* Step 2: Options */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Options</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as 'png' | 'jpg')}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="png">PNG (Transparent Background)</option>
                  <option value="jpg">JPG (White Background)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                  <span>Image Quality</span>
                  <span className="text-blue-600">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProcessRemoveBg}
                  disabled={!selectedFile || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Removing Background...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Remove Background Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Step 3: Result & Preview Panel with Actions Box */}
        {(originalPreviewUrl || resultBlobUrl) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            
            {/* Split Comparison / Result Viewer */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Result Preview
              </h3>

              {originalPreviewUrl && (
                <ComparisonSlider
                  originalImage={originalPreviewUrl}
                  processedImage={resultBlobUrl || originalPreviewUrl}
                  originalLabel="Original Image"
                  processedLabel={resultBlobUrl ? "Background Removed" : "Original"}
                />
              )}
            </div>

            {/* Actions & Checklist Column */}
            <div className="lg:col-span-1">
              <ResultPanel
                onDownload={resultBlobUrl ? () => handleDownload('png') : undefined}
                downloadLabel="Download PNG"
                secondaryDownloadLabel="Download JPG"
                onSecondaryDownload={resultBlobUrl ? () => handleDownload('jpg') : undefined}
                onReset={handleReset}
                resetLabel="Process Another Image"
                faqs={tool.faq}
                isProcessing={isProcessing}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
