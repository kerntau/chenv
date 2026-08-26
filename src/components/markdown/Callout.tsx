import React from 'react';
import { Info, AlertTriangle, Lightbulb, Quote } from 'lucide-react';

interface CalloutProps {
  type?: 'note' | 'tip' | 'warning' | 'quote';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  children,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />;
      case 'quote':
        return <Quote className="w-4 h-4 text-stone-500 dark:text-stone-400 shrink-0 mt-0.5" />;
      case 'note':
      default:
        return <Info className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'tip':
        return 'border-l-sky-500/70 bg-sky-50/40 dark:bg-sky-950/20';
      case 'warning':
        return 'border-l-rose-500/80 bg-rose-50/50 dark:bg-rose-950/20';
      case 'quote':
        return 'border-l-stone-400/80 bg-stone-100/40 dark:bg-stone-900/40';
      case 'note':
      default:
        return 'border-l-stone-400/70 bg-stone-50/60 dark:bg-[#18181B]/60';
    }
  };

  return (
    <div
      className={`my-6 pl-4 pr-4 py-3.5 border-l-2 rounded-r-xl border-y border-r border-y-stone-200/50 border-r-stone-200/50 dark:border-y-stone-800/40 dark:border-r-stone-800/40 text-stone-700 dark:text-stone-300 ${getBorderColor()}`}
    >
      <div className="flex items-start space-x-2.5">
        {getIcon()}
        <div className="flex-1 min-w-0">
          {title && (
            <div className="font-sans text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
              {title}
            </div>
          )}
          <div className="text-sm font-sans leading-relaxed text-stone-600 dark:text-stone-300 font-normal">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
