import React from 'react';
import { useReadingProgress } from '../../hooks/useReadingProgress';

export const ReadingProgressBar: React.FC = () => {
  const progress = useReadingProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-stone-400 via-amber-600 to-stone-800 dark:from-stone-600 dark:via-amber-400 dark:to-stone-200 transition-all duration-75 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};
