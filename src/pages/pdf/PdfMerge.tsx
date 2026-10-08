import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Layers, Loader2, FileText, ArrowUpDown } from 'lucide-react';

export const PdfMerge: React.FC = () => {
  const tool = getToolById('merge-pdf')!;
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setResultBlobUrl(null);
    setErrorMsg(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResultBlobUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setErrorMsg('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append('files', f));

      const res = await apiClient.post('/pdf/merge', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to merge PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = 'merged-document.pdf';
    a.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="pdf" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Select Multiple PDF Files
          </h3>

          <FileUploader
            onFilesSelected={handleFilesSelected}
            acceptedFormats={['.pdf']}
            maxSizeMb={100}
            multiple={true}
            selectedFiles={files}
            onRemoveFile={handleRemoveFile}
            isProcessing={isProcessing}
            title="Drag & drop multiple PDF files"
            subtitle="Combine 2 or more PDFs into a single file"
          />

          <div className="pt-2">
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>Merge {files.length} PDFs into One</span>
            </button>
          </div>
        </div>

        {errorMsg && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs">{errorMsg}</div>}

        {resultBlobUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs text-center space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Merged PDF Ready</h3>
              <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200 p-4">
                <FileText className="w-12 h-12 text-emerald-600 mb-2" />
                <span className="text-sm font-bold text-slate-800">Your Merged PDF is ready for download</span>
                <span className="text-xs text-slate-500 mt-1">Combined {files.length} documents seamlessly</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ResultPanel
                onDownload={handleDownload}
                downloadLabel="Download Merged PDF"
                onReset={() => { setFiles([]); setResultBlobUrl(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
