import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  maxSizeMb?: number;
  multiple?: boolean;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  title?: string;
  subtitle?: string;
  isProcessing?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedFormats = ['.jpg', '.jpeg', '.png', '.webp'],
  maxSizeMb = 25,
  multiple = false,
  selectedFiles = [],
  onRemoveFile,
  title = 'Drag & drop your file here',
  subtitle = 'or click to browse from your device',
  isProcessing = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFiles = (files: FileList | File[]): File[] => {
    setErrorMessage(null);
    const valid: File[] = [];
    const maxSizeBytes = maxSizeMb * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxSizeBytes) {
        setErrorMessage(`"${file.name}" exceeds the maximum size of ${maxSizeMb}MB.`);
        continue;
      }

      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (acceptedFormats.length > 0 && !acceptedFormats.includes(extension) && !acceptedFormats.includes(file.type)) {
        setErrorMessage(`"${file.name}" format is not supported. Allowed: ${acceptedFormats.join(', ')}`);
        continue;
      }

      valid.push(file);
      if (!multiple) break;
    }

    return valid;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = validateFiles(e.dataTransfer.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        onFilesSelected(valid);
      }
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-white dark:bg-slate-900 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
        } ${isProcessing ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-colors ${
            isDragOver ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400'
          }`}>
            <UploadCloud className="w-7 h-7 stroke-[2]" />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {subtitle}
          </p>

          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors pointer-events-none"
          >
            Choose File{multiple ? 's' : ''}
          </button>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>Supported: <strong className="text-slate-600 dark:text-slate-300">{acceptedFormats.join(', ').toUpperCase()}</strong></span>
            <span>•</span>
            <span>Max file size: <strong className="text-slate-600 dark:text-slate-300">{maxSizeMb}MB</strong></span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Selected {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}:
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{formatBytes(file.size)}</p>
                  </div>
                </div>

                {onRemoveFile && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(idx);
                    }}
                    disabled={isProcessing}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
