import React from 'react';
import { Sparkles, Compass } from 'lucide-react';

export const InspirationCard: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl paper-card flex flex-col justify-between h-full bg-gradient-to-br from-stone-50/70 to-stone-100/40 dark:from-[#1B1B1E] dark:to-[#141416]">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            设计美学与灵感源
          </h2>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans mb-3">
          本站以“纸质书写”为隐喻，文字与留白共同构成呼吸节奏。致谢以下开源灵感先驱：
        </p>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/50 dark:border-stone-700/50 text-xs">
            <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
              astro-gyoza
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              纸张温度、低调光影与呼吸式动画的排版典范。
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-white/70 dark:bg-stone-800/70 border border-stone-200/50 dark:border-stone-700/50 text-xs">
            <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
              blog-v3
            </span>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Bento Grid 便当盒布局与模块化信息流结构设计。
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <span className="flex items-center space-x-1">
          <Compass className="w-3 h-3" />
          <span>克制 &bull; 纸质 &bull; 严谨</span>
        </span>
        <span>Aesthetic Clean</span>
      </div>
    </div>
  );
};
