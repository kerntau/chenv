import React, { useEffect } from 'react';
import { siteConfig } from '../../content';

interface PageEpigraphProps {
  /** 核心金句内容（不带引号，组件会自动添加） */
  quote?: string;
  /** 落款署名，缺省为 siteConfig.author.name */
  author?: string;
  /** 自定义最外层边距等样式 */
  className?: string;
}

const DEFAULT_QUOTE = '日记是自己写给自己最好的情书，也是时间长河里唯一的停靠桩。';

const FONT_URLS = [
  'https://cn-font.claude-code-best.win/packages/hlxsjt/dist/%E9%B8%BF%E9%9B%B7%E8%A1%8C%E4%B9%A6%E7%AE%80%E4%BD%93/result.css',
  'https://cn-font.claude-code-best.win/packages/ysyrxk/dist/slideyouran-Regular2_0/result.css',
];

export const PageEpigraph: React.FC<PageEpigraphProps> = ({
  quote = DEFAULT_QUOTE,
  author = siteConfig.author?.name,
  className = '',
}) => {
  // 确保在任何页面挂载时书法字体均已注入
  useEffect(() => {
    FONT_URLS.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  return (
    <footer
      className={`mt-5 sm:mt-8 mb-4 sm:mb-6 flex flex-col items-center select-none overflow-x-auto max-w-full ${className}`}
      aria-label="卷尾题跋"
    >
      <div className="max-w-fit mx-auto px-4 space-y-2 sm:space-y-2.5">
        {/* 核心金句：鸿雷行书简体，单行贯通舒展 */}
        <p
          className="text-base sm:text-xl md:text-2xl lg:text-[25px] text-slate-800 dark:text-slate-100 leading-normal tracking-wide font-normal whitespace-nowrap font-xingshu"
          style={{ fontFamily: '"hongleixingshu", cursive, serif' }}
        >
          &ldquo;{quote}&rdquo;
        </p>

        {/* 极简直接署名：悠然体，自然题跋落款 */}
        {author && (
          <div
            className="text-right text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 tracking-wider pr-1 sm:pr-2 font-youran"
            style={{ fontFamily: '"slideyouran", cursive, sans-serif' }}
          >
            &mdash; {author}
          </div>
        )}
      </div>
    </footer>
  );
};
