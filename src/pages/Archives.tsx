import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { PageEpigraph } from '../components/layout/PageEpigraph';
import { getAllDiaries, siteConfig } from '../content';
import { formatDateShort, getYear } from '../lib/date';

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
  const pageSubtitle = archivesPage?.subtitle || `共收录 ${timelineItems.length} 篇随笔与手记。`;

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题区（去除割裂死板横线，以轻盈留白建立层次） */}
        <div className="mb-5 sm:mb-7 font-sans text-center space-y-1 sm:space-y-1.5">
          <h1 className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {pageTitle}
          </h1>

          {pageSubtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* 垂直时间轴内容流（紧凑年谱排版） */}
        <div className="space-y-6 pb-2 font-sans">
          {years.map((year) => (
            <div key={year} className="relative">
              {/* 年份时间锚点（精练等宽数字 + 篇数胶囊 + 向右羽化渐隐光线） */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {year}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-xs text-[10.5px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/60 dark:border-white/5 leading-none">
                    {itemsByYear[year].length} 篇
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
                      className="flex items-center justify-between py-2 sm:py-1.5 px-2 -mx-1.5 rounded-sm hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors group gap-2.5"
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

                        {/* 分类微标签 (桌面端展示) */}
                        {item.category && (
                          <span className="hidden sm:inline-block text-[10px] font-sans px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* 类型标 (手记标签 - 靠右对齐) */}
                      {item.type === 'diary' && (
                        <div className="flex items-center shrink-0">
                          <span className="px-1.5 py-0.5 rounded-sm bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[10.5px] font-sans font-medium leading-none border border-sky-200/50 dark:border-sky-800/40">
                            手记
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {years.length === 0 && (
            <div className="py-20 text-center text-slate-400 dark:text-slate-500 font-mono text-xs">
              暂无匹配的内容记录
            </div>
          )}
        </div>

        {/* 底部卷尾题跋 */}
        <PageEpigraph quote="用理性梳理日常，用技术温柔时光。" />
      </Container>
    </PageShell>
  );
};
