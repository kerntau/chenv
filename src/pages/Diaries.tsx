import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { PageShell } from '../components/layout/PageShell';
import { getAllDiaries, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import {
  Feather,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const Diaries: React.FC = () => {
  const allDiaries = useMemo(() => getAllDiaries(), []);

  const diariesPage = siteConfig.diariesPage;
  const pageTitle = diariesPage?.title || '散落的日常与手记';
  const pageSubtitle = diariesPage?.subtitle || '捕捉那些代码之外的日暮微风、深夜随笔与生活切片。';

  return (
    <PageShell>
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部标题区 */}
        <div className="mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70 text-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 mb-3">
            <Feather className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>DIARIES &bull; 纸上温度 &bull; 心境手记</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans max-w-md mx-auto">
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
              className="p-3.5 sm:p-4 rounded-sm paper-card transition-colors duration-200 group flex flex-col justify-between block hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                {/* 顶部元数据头：天气、心情、时间与地点 */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 pb-2.5 border-b border-slate-200/50 dark:border-slate-800/50 mb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-slate-200 font-serif">
                      <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <time dateTime={diary.date}>{formatDate(diary.date)}</time>
                      {diary.time && <span className="font-mono text-xs opacity-75">{diary.time}</span>}
                    </span>

                    {diary.weather && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[10.5px] font-sans">
                        {diary.weather}
                      </span>
                    )}

                    {diary.mood && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 text-[10.5px] font-sans border border-sky-200/40 dark:border-sky-800/30">
                        {diary.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10.5px]">
                    {diary.location && (
                      <span className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3 w-3.5 text-slate-400" />
                        <span>{diary.location}</span>
                      </span>
                    )}
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{diary.readingTime}</span>
                    </span>
                  </div>
                </div>

                {/* 标题与摘要导言 */}
                <div className="space-y-1.5">
                  <h2 className="font-serif text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug line-clamp-2">
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

        {/* 底部手札卷尾 · 纸上印记与感言 */}
        <div className="mt-14 relative overflow-hidden p-5 sm:p-6 rounded-sm border border-slate-200/70 dark:border-slate-800/70 bg-gradient-to-b from-white/90 via-slate-50/70 to-slate-100/40 dark:from-[#18181A]/95 dark:via-[#151518]/90 dark:to-[#101012]/80 shadow-xs">
          {/* 背景轻柔艺术双引号水印 */}
          <div className="absolute right-4 -bottom-4 text-slate-200/40 dark:text-slate-800/30 select-none pointer-events-none font-serif text-8xl leading-none">
            &rdquo;
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 max-w-xl mx-auto">
            {/* 顶栏徽标 */}
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-sm bg-sky-50 dark:bg-sky-950/40 text-[11px] font-mono text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
              <Sparkles className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>落纸为念 &bull; 纸上温度</span>
            </div>

            {/* 核心金句排版 */}
            <blockquote className="font-serif text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal italic">
              &ldquo;日记是自己写给自己最好的情书，也是时间长河里唯一的停靠桩。&rdquo;
            </blockquote>

            {/* 底部签名与手记统计 */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200/50 dark:border-slate-800/50 w-full">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                &mdash; {siteConfig.author.name}
              </span>
              <span>&bull;</span>
              <span>共收录 {allDiaries.length} 篇心境篇章</span>
              <span>&bull;</span>
              <span className="px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-[10px]">
                随笔手札
              </span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
