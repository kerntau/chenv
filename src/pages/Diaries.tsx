import React, { useMemo, useEffect } from 'react';
import { Link } from 'wouter';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/layout/Container';
import { getAllDiaries, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import {
  Calendar,
  MapPin,
} from 'lucide-react';
import { BlurText, FadeContent, SplitText } from '../components/reactbits';

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
        <div className="mb-4 pb-3 sm:mb-6 sm:pb-4 border-b border-slate-200/70 dark:border-white/5 text-center space-y-1 sm:space-y-1.5">
          <SplitText
            text={pageTitle}
            tag="h1"
            className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight justify-center"
            splitType="chars"
            delay={35}
            duration={0.65}
            from={{ opacity: 0, y: 14 }}
            to={{ opacity: 1, y: 0 }}
          />
          {pageSubtitle && (
            <div className="flex justify-center">
              <BlurText
                text={pageSubtitle}
                className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-md mx-auto tracking-wide justify-center text-center"
                delay={60}
                animateBy="words"
                direction="top"
              />
            </div>
          )}
        </div>

        {/* 手记多列卡片网格布局 (2列/3列响应式纯净卡片，增大呼吸留白) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {allDiaries.map((diary, index) => (
            <FadeContent
              key={diary.slug}
              delay={Math.min(index * 0.06, 0.42)}
              direction="up"
              distance={16}
              duration={0.45}
            >
              <Link
                href={`/diaries/${diary.slug}`}
                className="glass-card glass-card-interactive p-5 sm:p-6 group flex flex-col justify-between block h-full"
              >
                <div>
                  {/* 顶部元数据头：天气、心情、时间与地点 */}
                  <div className="flex items-center justify-between gap-2 text-xs font-sans text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200/50 dark:border-white/5 mb-3.5">
                    <div className="flex items-center space-x-1.5 font-medium text-slate-800 dark:text-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                      <time dateTime={diary.date} className="tracking-wide">{formatDate(diary.date)}</time>
                      {diary.time && <span className="text-[11px] opacity-75 font-sans">· {diary.time}</span>}
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] font-sans text-slate-400 dark:text-slate-500 shrink-0">
                      {diary.weather && (
                        <span>{diary.weather}</span>
                      )}
                      {diary.weather && diary.mood && <span>·</span>}
                      {diary.mood && (
                        <span className="text-sky-600/90 dark:text-sky-400/90">{diary.mood}</span>
                      )}
                      {diary.location && (
                        <>
                          <span className="hidden sm:inline">·</span>
                          <span className="hidden sm:inline-flex items-center space-x-0.5 text-slate-400 tracking-wide">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{diary.location}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 标题与摘要导言 */}
                  <div className="space-y-2.5">
                    <h2 className="font-serif text-base sm:text-[17px] font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-sky-200 transition-colors leading-snug line-clamp-2 tracking-tight">
                      {diary.title}
                    </h2>
                    {diary.summary && (
                      <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed font-humanist tracking-wide line-clamp-3">
                        {diary.summary}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </FadeContent>
          ))}
        </div>

        {allDiaries.length === 0 && (
          <div className="py-16 text-center text-xs font-mono text-slate-400">
            暂无匹配手记
          </div>
        )}

      </Container>
    </PageShell>
  );
};
