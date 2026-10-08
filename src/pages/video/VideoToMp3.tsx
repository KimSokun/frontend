import React, { useState } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { FileUploader } from '../../components/tools/FileUploader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { Music, Loader2, Play } from 'lucide-react';

export const VideoToMp3: React.FC = () => {
  const tool = getToolById('video-to-mp3')!;
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState('192k');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bitrate', bitrate);

      const res = await apiClient.post('/video/to-mp3', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob'
      });

      const url = URL.createObjectURL(new Blob([res.data], { type: 'audio/mpeg' }));
      setResultBlobUrl(url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBlobUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultBlobUrl;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.mp3`;
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
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">1. Select Video File</h3>
            <FileUploader
              onFilesSelected={(files) => { setFile(files[0]); setResultBlobUrl(null); }}
              acceptedFormats={['.mp4', '.mov', '.mkv', '.webm', '.avi']}
              maxSizeMb={200}
              selectedFiles={file ? [file] : []}
              onRemoveFile={() => { setFile(null); setResultBlobUrl(null); }}
              isProcessing={isProcessing}
              title="Drag & drop video clip"
              subtitle="MP4, MOV, MKV, WebM up to 200MB"
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">2. Audio Settings</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">MP3 Audio Bitrate</label>
              <select
                value={bitrate}
                onChange={(e) => setBitrate(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="128k">128 kbps (Standard Audio)</option>
                <option value="192k">192 kbps (High Quality - Recommended)</option>
                <option value="256k">256 kbps (Very High Quality)</option>
                <option value="320k">320 kbps (Maximum Crystal Clarity)</option>
              </select>
            </div>

            <button
              onClick={handleConvert}
              disabled={!file || isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
              <span>Extract Audio to MP3</span>
            </button>
          </div>
        </div>

        {errorMsg && <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs">{errorMsg}</div>}

        {resultBlobUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Audio Player Preview</h3>
              <div className="p-6 bg-slate-900 rounded-xl text-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
                <audio controls src={resultBlobUrl} className="w-full" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ResultPanel
                onDownload={handleDownload}
                downloadLabel="Download MP3 Audio"
                onReset={() => { setFile(null); setResultBlobUrl(null); }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
