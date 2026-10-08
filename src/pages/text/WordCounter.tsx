import React, { useState, useEffect } from 'react';
import { ToolMenu } from '../../components/tools/ToolMenu';
import { ToolHeader } from '../../components/tools/ToolHeader';
import { ResultPanel } from '../../components/tools/ResultPanel';
import { getToolById } from '../../config/tools';
import { apiClient } from '../../services/api';
import { AlignLeft, Copy, Check, RotateCcw, Clock } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const tool = getToolById('word-counter')!;
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    readingTimeMinutes: 0
  });

  useEffect(() => {
    if (!text.trim()) {
      setStats({ words: 0, characters: 0, charactersNoSpaces: 0, lines: 0, sentences: 0, paragraphs: 0, readingTimeMinutes: 0 });
      return;
    }

    const words = text.match(/\b\w+\b/g) || [];
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    const lines = text.split('\n').length;
    const sentences = text.match(/[^.!?]+[.!?]/g)?.length || (words.length > 0 ? 1 : 0);
    const paragraphs = text.split('\n\n').filter(p => p.trim()).length || (words.length > 0 ? 1 : 0);
    const readingTime = Number((words.length / 200).toFixed(1));

    setStats({
      words: words.length,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      paragraphs,
      readingTimeMinutes: readingTime
    });
  }, [text]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <ToolMenu currentCategory="text" />
      <div className="flex-1 min-w-0 w-full space-y-6">
        <ToolHeader tool={tool} />

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Words</span>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats.words}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Characters</span>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.characters}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sentences</span>
            <p className="text-2xl font-extrabold text-slate-800 mt-1">{stats.sentences}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reading Time</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.readingTimeMinutes}m</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Input Text</h3>
            <button
              onClick={() => setText('')}
              className="text-xs text-slate-400 hover:text-rose-600 font-medium"
            >
              Clear Text
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Type or paste your text here for real-time word counting..."
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:outline-none focus:border-blue-500 font-sans"
          />

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Characters without spaces: <strong>{stats.charactersNoSpaces}</strong></span>
            <span>Lines: <strong>{stats.lines}</strong> • Paragraphs: <strong>{stats.paragraphs}</strong></span>
          </div>
        </div>

        <ResultPanel
          onCopy={() => navigator.clipboard.writeText(text)}
          onReset={() => setText('')}
          resetLabel="Clear Text"
        />
      </div>
    </div>
  );
};
