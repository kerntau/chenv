import React from 'react';
import { Link } from 'wouter';
import { useTheme } from '../../hooks/useTheme';
import { GithubIcon } from '../ui/Icons';
import { Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme, setTheme } = useTheme();

  return (
    <footer className="relative z-10 mt-24 border-t border-stone-200/60 dark:border-stone-800/60 bg-[#FAF8F5]/90 dark:bg-[#141416]/90 text-stone-600 dark:text-stone-400 py-12 text-xs transition-colors duration-200">
      {/* 顶部柔和渐变过渡线 */}
      <div className="absolute -top-6 inset-x-0 h-6 bg-gradient-to-b from-transparent to-[#FAF8F5]/90 dark:to-[#141416]/90 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-200/50 dark:border-stone-800/50">
          {/* 品牌与格言 */}
          <div className="md:col-span-2 space-y-3">
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
            >
              Perimsx / 序栈
            </Link>
            <div className="font-serif text-xs italic text-stone-500 dark:text-stone-400">
              Stay hungry. Stay foolish.
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed font-sans max-w-sm">
              信息安全专业学生的个人书写空间。专注于 Linux 底层机制、堆漏洞利用、密码学与全栈构建。
            </p>

            {/* 披览脉冲指示器 */}
            <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-500 pt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>正被 1 人披览 &bull; 探索进行中</span>
            </div>
          </div>

          {/* 导航列 1: 关于 */}
          <div className="space-y-2">
            <div className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              关于
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  关于我
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  文稿归档
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Innei/Shiro"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-0.5 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <span>致敬 Shiro</span>
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* 导航列 2: 更多与联系 */}
          <div className="space-y-2">
            <div className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
              更多
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  href="/projects"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  项目展台
                </Link>
              </li>
              <li>
                <Link
                  href="/says"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  一言思考
                </Link>
              </li>
              <li>
                <Link
                  href="/friends"
                  className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  朋友们
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Innei 标志性底部工具条 */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-stone-400 dark:text-stone-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; 2024&ndash;{currentYear} Perimsx</span>
            <span>&bull;</span>
            <a
              href="/feed"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              RSS 订阅
            </a>
            <span>&bull;</span>
            <span className="inline-flex items-center space-x-1">
              <Globe className="w-3 h-3" />
              <span>萌ICP备20261337号</span>
            </span>
          </div>

          {/* Innei 风格内联主题切换器: Light · System · Dark */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'light' ? 'font-bold text-amber-700 dark:text-amber-400' : ''
              }`}
            >
              Light
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setTheme('system')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'system' ? 'font-bold text-amber-700 dark:text-amber-400' : ''
              }`}
            >
              System
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setTheme('dark')}
              className={`hover:text-stone-800 dark:hover:text-stone-200 transition-colors ${
                theme === 'dark' ? 'font-bold text-amber-700 dark:text-amber-400' : ''
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
