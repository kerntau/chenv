import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { siteConfig } from '../../content';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const sinceYear = siteConfig.footer?.sinceYear || 2024;
  const { theme, setTheme } = useTheme();

  return (
    <footer className="relative z-10 mt-4 sm:mt-6 border-t border-slate-200/70 dark:border-slate-800/70 pt-6 pb-6 text-xs font-sans text-slate-600 dark:text-slate-400 select-none bg-slate-50/40 dark:bg-slate-900/20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 上层: 左侧站名标语与版权，右侧多列导航 */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 sm:gap-12">
          {/* 左侧区域 */}
          <div className="space-y-2.5 max-w-sm">
            <h3 className="font-sans font-bold text-xl sm:text-2xl text-slate-900 dark:text-slate-100 tracking-tight">
              {siteConfig.author?.name || siteConfig.title}
            </h3>
            <p className="italic text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-serif leading-relaxed">
              Stay hungry. Stay foolish.
            </p>
            <div className="text-[11.5px] text-slate-500 dark:text-slate-400 font-mono leading-relaxed pt-0.5">
              <span>&copy; {sinceYear}-{currentYear} Powered by </span>
              <a
                href="https://rsbuild.dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-slate-100 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors"
              >
                Rsbuild
              </a>
              <span> &amp; </span>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 dark:hover:text-slate-100 underline decoration-slate-300 dark:decoration-slate-700 underline-offset-2 transition-colors"
              >
                React 19
              </a>
              <span>.</span>
            </div>
          </div>

          {/* 右侧导航列 (3 列) */}
          <div className="grid grid-cols-3 gap-8 sm:gap-14 md:gap-16 pt-1">
            {/* 1. 关于 */}
            <div className="space-y-2.5">
              <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                关于
              </div>
              <ul className="space-y-2 text-[12px]">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    关于本站
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    关于我
                  </Link>
                </li>
                <li>
                  <a
                    href={siteConfig.author?.github || 'https://github.com/kerntau'}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <span>关于此项目</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                  </a>
                </li>
              </ul>
            </div>

            {/* 2. 更多 */}
            <div className="space-y-2.5">
              <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                更多
              </div>
              <ul className="space-y-2 text-[12px]">
                <li>
                  <Link
                    href="/diaries"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    动态手记
                  </Link>
                </li>
                <li>
                  <Link
                    href="/archives"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    全站归档
                  </Link>
                </li>
                <li>
                  <Link
                    href="/friends"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    志同道合
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. 联系 */}
            <div className="space-y-2.5">
              <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-200">
                联系
              </div>
              <ul className="space-y-2 text-[12px]">
                <li>
                  <a
                    href={`mailto:${siteConfig.author?.email || 'hi@keru.in'}`}
                    className="group inline-flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <span>发邮件</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.author?.github || 'https://github.com/kerntau'}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                  </a>
                </li>
                <li>
                  <Link
                    href="/says"
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    日常说说
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 下层: 底部单行底栏 */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11.5px] font-mono text-slate-500 dark:text-slate-400">
          {/* 左侧: RSS 订阅 · 站点地图 · 主题切换器 · 语言 */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1.5">
            <Link
              href="/posts"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              RSS 订阅
            </Link>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <Link
              href="/archives"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              站点地图
            </Link>
            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
            <Link
              href="/friends"
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              订阅
            </Link>

            <span className="text-slate-300 dark:text-slate-700 px-1">|</span>

            {/* 主题切换器 */}
            <div className="inline-flex items-center space-x-1.5">
              <button
                onClick={() => setTheme('light')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors ${
                  theme === 'light'
                    ? 'font-bold text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-sky-500'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                Light
              </button>
              <span className="text-slate-300 dark:text-slate-700 text-[9px]">&bull;</span>
              <button
                onClick={() => setTheme('system')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors ${
                  theme === 'system'
                    ? 'font-bold text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-sky-500'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                System
              </button>
              <span className="text-slate-300 dark:text-slate-700 text-[9px]">&bull;</span>
              <button
                onClick={() => setTheme('dark')}
                className={`hover:text-slate-900 dark:hover:text-slate-100 transition-colors ${
                  theme === 'dark'
                    ? 'font-bold text-slate-900 dark:text-slate-100 underline underline-offset-4 decoration-sky-500'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                Dark
              </button>
            </div>

            <span className="text-slate-300 dark:text-slate-700 px-1">|</span>

            {/* 语言提示 */}
            <span className="text-slate-500 dark:text-slate-400">
              简体中文
            </span>
          </div>

          {/* 右侧: 备案号 */}
          <div className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <a
              href="https://icp.gov.moe/?keyword=20268811"
              target="_blank"
              rel="noreferrer"
              className="hover:underline underline-offset-2"
            >
              {siteConfig.footer?.icp || '萌ICP备20268811号'}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
