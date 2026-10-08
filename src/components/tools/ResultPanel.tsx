import React from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { triggerDownloadAd } from '../../services/adManager';

interface ResultPanelProps {
  onDownload?: () => void;
  downloadLabel?: string;
  secondaryDownloadLabel?: string;
  onSecondaryDownload?: () => void;
  onCopy?: () => void;
  copied?: boolean;
  onReset?: () => void;
  resetLabel?: string;
  faqs?: { question: string; answer: string }[];
  infoItems?: string[];
  isProcessing?: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  onDownload,
  downloadLabel = 'Download Result',
  secondaryDownloadLabel,
  onSecondaryDownload,
  onCopy,
  copied = false,
  onReset,
  resetLabel = 'Process Another File',
  faqs = [],
  infoItems = [
    '100% Free & Unlimited',
    'No Login Required',
    'Your files are auto deleted after 30m',
    'High Quality Output',
    'No watermarks added'
  ],
  isProcessing = false
}) => {
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const handleMainDownload = () => {
    if (onDownload) {
      triggerDownloadAd(onDownload);
    }
  };

  const handleSecondaryDownload = () => {
    if (onSecondaryDownload) {
      triggerDownloadAd(onSecondaryDownload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Actions
        </h4>

        <div className="space-y-2.5">
          {onDownload && (
            <button
              type="button"
              onClick={handleMainDownload}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{downloadLabel}</span>
            </button>
          )}

          {secondaryDownloadLabel && onSecondaryDownload && (
            <button
              type="button"
              onClick={handleSecondaryDownload}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{secondaryDownloadLabel}</span>
            </button>
          )}

          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs transition-colors border border-blue-200 dark:border-blue-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-blue-700 dark:text-blue-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{resetLabel}</span>
            </button>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Tool Information
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            {infoItems.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Frequently Asked Questions</span>
          </h4>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {faqs.map((faq, index) => (
              <div key={index} className="py-2.5">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 gap-2"
                >
                  <span>{faq.question}</span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-4">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
