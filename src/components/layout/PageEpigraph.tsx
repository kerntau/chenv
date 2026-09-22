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
  'https://cn-font.claude-code-best.win/packages/dymh/dist/DouyinSansBold/result.css',
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
      className={`mt-auto pt-8 pb-3 sm:pt-10 sm:pb-4 w-full flex flex-col items-center justify-center select-none ${className}`}
      aria-label="卷尾题跋"
    >
      <div className="inline-flex flex-col items-end max-w-full px-4 space-y-2 sm:space-y-2.5">
        {/* 核心金句：桌面端单行通贯不折行，移动端自然换行 */}
        <p
          className="text-base sm:text-lg md:text-xl lg:text-[21px] text-slate-800 dark:text-slate-100 leading-relaxed sm:leading-normal tracking-wide font-normal whitespace-normal sm:whitespace-nowrap break-words text-center sm:text-left font-xingshu"
          style={{ fontFamily: '"hongleixingshu", cursive, serif' }}
        >
          &ldquo;{quote}&rdquo;
        </p>

        {/* 极简署名：严格对齐于金句整行的右下角，无生硬短横线 */}
        {author && (
          <div
            className="text-right text-base sm:text-lg md:text-xl text-sky-500 dark:text-sky-400 tracking-wider font-xingshu pr-1 sm:pr-1.5"
            style={{ fontFamily: '"hongleixingshu", cursive, serif' }}
          >
            {author}
          </div>
        )}
      </div>
    </footer>
  );
};
