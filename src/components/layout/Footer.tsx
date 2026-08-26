import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { GithubIcon } from '../ui/Icons';
import { siteConfig } from '../../content';

/**
 * 纯净极简 Footer
 * - 绝无虚假备案号、无死链、无多余臆造文字
 * - 仅保留真实版权、官方源码入口与主题切换
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme, setTheme } = useTheme();

  return (
    <footer className="relative z-10 mt-20 sm:mt-24 border-t border-stone-200/60 dark:border-stone-800/60 py-6 text-xs font-mono text-stone-500 dark:text-stone-400 select-none">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        {/* 左侧: 真实版权 */}
        <div className="text-[11px] text-stone-400 dark:text-stone-500">
          <span>&copy; {currentYear} {siteConfig.title}. All rights reserved.</span>
        </div>

        {/* 右侧: 真实 GitHub 与主题切换器 */}
        <div className="flex items-center space-x-3 text-[11px]">
          {siteConfig.author.github && (
            <>
              <a
                href={siteConfig.author.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center space-x-1"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <span className="text-stone-300 dark:text-stone-700">&bull;</span>
            </>
          )}

          {/* Light · System · Dark 切换器 */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setTheme('light')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'light' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-stone-400'
              }`}
            >
              Light
            </button>
            <span className="text-stone-300 dark:text-stone-700 text-[9px]">&bull;</span>
            <button
              onClick={() => setTheme('system')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'system' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-stone-400'
              }`}
            >
              System
            </button>
            <span className="text-stone-300 dark:text-stone-700 text-[9px]">&bull;</span>
            <button
              onClick={() => setTheme('dark')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'dark' ? 'font-bold text-sky-600 dark:text-sky-400' : 'text-stone-400'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
