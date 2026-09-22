import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { getAllDiaries, siteConfig } from '../content';
import { formatDateShort, getYear } from '../lib/date';
import { FadeContent, CountUp, SplitText } from '../components/reactbits';

interface TimelineItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: 'diary';
  category?: string;
  readingTime?: string;
  summary?: string;
}

export const Archives: React.FC = () => {
  const allDiaries = useMemo(() => getAllDiaries(), []);

  // 聚合手记内容为统一时间轴数据源
  const timelineItems: TimelineItem[] = useMemo(() => {
    return allDiaries.map((d) => ({
      id: `diary-${d.slug}`,
      slug: `/diaries/${d.slug}`,
      title: d.title,
      date: d.date,
      type: 'diary' as const,
      category: '手记随笔',
      readingTime: '2 min',
      summary: d.summary,
    })).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allDiaries]);

  // 按年份分组
  const itemsByYear = useMemo(() => {
    const grouped: Record<string, TimelineItem[]> = {};
    timelineItems.forEach((item) => {
      const year = getYear(item.date);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(item);
    });
    return grouped;
  }, [timelineItems]);

  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));

  const archivesPage = siteConfig.archivesPage;
  const pageTitle = archivesPage?.title || '时光归档';

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题区 */}
        <div className="mb-5 sm:mb-7 font-sans text-center space-y-1 sm:space-y-1.5">
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

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {archivesPage?.subtitle || (
              <>
                共收录 <CountUp to={timelineItems.length} duration={1.2} className="font-mono text-sky-600 dark:text-sky-400 font-semibold" /> 篇随笔与手记。
              </>
            )}
          </p>
        </div>

        {/* 垂直时间轴内容流（紧凑年谱排版） */}
        <div className="space-y-6 pb-2 font-sans">
          {years.map((year, yIdx) => (
            <FadeContent
              key={year}
              delay={yIdx * 0.08}
              direction="up"
              distance={20}
              duration={0.4}
              className="relative"
            >
              {/* 年份时间锚点（精练等宽数字 + 篇数胶囊 + 向右羽化渐隐光线） */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {year}
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500 font-normal">
                    / {itemsByYear[year].length} 篇
                  </span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-200/90 via-slate-200/20 to-transparent dark:from-slate-700/60 dark:via-slate-800/10 dark:to-transparent" />
              </div>

              {/* 时间轴树状条目 (精确轴线与单行流线排版) */}
              <div className="relative pl-5 sm:pl-7 space-y-0.5 before:content-[''] before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/80 dark:before:bg-slate-800/80">
                {itemsByYear[year].map((item) => (
                  <div key={item.id} className="relative group">
                    {/* 时间轴微节点圆点 (严格垂直居中对齐轴线) */}
                    <div className="absolute -left-[15px] sm:-left-[21px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-sky-500 transition-colors" />

                    {/* 归档行卡片 (单行双端通栏对齐，消除移动端非必要折行与空白) */}
                    <Link
                      href={item.slug}
                      className="flex items-center justify-between py-2 sm:py-1.5 px-2.5 -mx-1.5 rounded-md border border-transparent hover:border-sky-400/40 dark:hover:border-sky-400/30 hover:bg-white/60 dark:hover:bg-white/[0.05] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_-2px_rgba(56,189,248,0.06)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-xs transition-all group gap-2.5"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0 pr-1 sm:pr-2">
                        {/* 发布日期 (MM-DD) */}
                        <span className="font-sans text-xs text-slate-400 dark:text-slate-500 shrink-0 select-none">
                          {formatDateShort(item.date)}
                        </span>

                        {/* 标题 */}
                        <span className="text-[13px] sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 font-medium transition-colors truncate leading-snug">
                          {item.title}
                        </span>

                        {/* 分类元数据 (桌面端展示) */}
                        {item.category && (
                          <span className="hidden sm:inline-block text-[11px] font-sans text-slate-400 dark:text-slate-500 shrink-0">
                            · {item.category}
                          </span>
                        )}
                      </div>

                      {/* 类型标 (靠右对齐) */}
                      {item.type === 'diary' && (
                        <div className="flex items-center shrink-0">
                          <span className="text-[11px] font-sans text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            手记
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </FadeContent>
          ))}

          {years.length === 0 && (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500 font-mono text-xs">
              暂无匹配的内容记录
            </div>
          )}
        </div>

      </Container>
    </PageShell>
  );
};
