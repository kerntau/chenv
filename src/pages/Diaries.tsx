import React, { useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/layout/Container';
import { PageEpigraph } from '../components/layout/PageEpigraph';
import { getAllDiaries, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import {
  Calendar,
  MapPin,
} from 'lucide-react';

export const Diaries: React.FC = () => {
  const allDiaries = useMemo(() => getAllDiaries(), []);

  const diariesPage = siteConfig.diariesPage;
  const pageTitle = diariesPage?.title || '散落的日常与手记';
  const pageSubtitle = diariesPage?.subtitle || '捕捉那些代码之外的日暮微风、深夜随笔与生活切片。';

  useEffect(() => {
    const fontUrls = [
      'https://cn-font.claude-code-best.win/packages/hlxsjt/dist/%E9%B8%BF%E9%9B%B7%E8%A1%8C%E4%B9%A6%E7%AE%80%E4%BD%93/result.css',
      'https://cn-font.claude-code-best.win/packages/ysyrxk/dist/slideyouran-Regular2_0/result.css',
      'https://cn-font.claude-code-best.win/packages/maple-mono-cn/dist/MapleMono-CN-Bold/result.css',
    ];
    fontUrls.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  return (
    <PageShell>
      <Container size="wide">
        {/* 精简居中顶栏 */}
        <div className="mb-4 pb-3 sm:mb-6 sm:pb-4 border-b border-slate-200/70 dark:border-white/5 text-center">
          <h1 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-200 tracking-tight">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 font-sans max-w-md mx-auto">
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* 手记多列卡片网格布局 (2列/3列响应式纯净卡片) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDiaries.map((diary) => (
            <Link
              key={diary.slug}
              href={`/diaries/${diary.slug}`}
              className="p-3.5 sm:p-4 rounded-md paper-card hover:-translate-y-0.5 hover:bg-white/90 dark:hover:bg-white/[0.06] hover:border-slate-300/80 dark:hover:border-white/15 transition-all duration-250 ease-out group flex flex-col justify-between block"
            >
              <div>
                {/* 顶部元数据头：天气、心情、时间与地点 */}
                <div className="flex items-center justify-between gap-2 text-xs font-sans text-slate-500 dark:text-slate-400 pb-2.5 border-b border-slate-200/50 dark:border-white/5 mb-2.5">
                  <div className="flex items-center space-x-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                    <time dateTime={diary.date}>{formatDate(diary.date)}</time>
                    {diary.time && <span className="text-[11px] opacity-75 font-sans">· {diary.time}</span>}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10.5px] shrink-0">
                    {diary.weather && (
                      <span className="px-1.5 py-0.5 rounded-xs bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400">
                        {diary.weather}
                      </span>
                    )}
                    {diary.mood && (
                      <span className="px-1.5 py-0.5 rounded-xs bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
                        {diary.mood}
                      </span>
                    )}
                    {diary.location && (
                      <span className="hidden sm:inline-flex items-center space-x-0.5 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{diary.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 标题与摘要导言 */}
                <div className="space-y-1.5">
                  <h2 className="font-serif text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-sky-200 transition-colors leading-snug line-clamp-2">
                    {diary.title}
                  </h2>
                  {diary.summary && (
                    <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-3">
                      {diary.summary}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {allDiaries.length === 0 && (
          <div className="py-16 text-center text-xs font-mono text-slate-400">
            暂无匹配手记
          </div>
        )}

        {/* 底部手札卷尾 */}
        <PageEpigraph />
      </Container>
    </PageShell>
  );
};
