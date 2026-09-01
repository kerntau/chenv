import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { getAllPosts, getAllDiaries, siteConfig } from '../content';
import { formatDateShort, getYear } from '../lib/date';
import {
  Clock,
  History,
  FileText,
  Feather,
} from 'lucide-react';

interface TimelineItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  type: 'post' | 'diary';
  category?: string;
  readingTime?: string;
  summary?: string;
}

export const Archives: React.FC = () => {
  const allPosts = useMemo(() => getAllPosts(), []);
  const allDiaries = useMemo(() => getAllDiaries(), []);

  const [activeType, setActiveType] = useState<'all' | 'post' | 'diary'>('all');

  // 聚合所有内容为统一时间轴数据源
  const timelineItems: TimelineItem[] = useMemo(() => {
    const postItems: TimelineItem[] = allPosts.map((p) => ({
      id: `post-${p.slug}`,
      slug: `/posts/${p.slug}`,
      title: p.title,
      date: p.date,
      type: 'post' as const,
      category: p.category,
      readingTime: p.readingTime,
      summary: p.summary,
    }));

    const diaryItems: TimelineItem[] = allDiaries.map((d) => ({
      id: `diary-${d.slug}`,
      slug: `/diaries/${d.slug}`,
      title: d.title,
      date: d.date,
      type: 'diary' as const,
      category: '手记随笔',
      readingTime: '2 min',
      summary: d.summary,
    }));

    return [...postItems, ...diaryItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allPosts, allDiaries]);

  // 根据类型过滤
  const filteredItems = useMemo(() => {
    if (activeType === 'post') {
      return timelineItems.filter((item) => item.type === 'post');
    }
    if (activeType === 'diary') {
      return timelineItems.filter((item) => item.type === 'diary');
    }
    return timelineItems;
  }, [timelineItems, activeType]);

  // 按年份分组
  const itemsByYear = useMemo(() => {
    const grouped: Record<string, TimelineItem[]> = {};
    filteredItems.forEach((item) => {
      const year = getYear(item.date);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const years = Object.keys(itemsByYear).sort((a, b) => Number(b) - Number(a));

  const archivesPage = siteConfig.archivesPage;
  const pageTitle = archivesPage?.title || '时光归档';
  const pageSubtitle = archivesPage?.subtitle || `共收录 ${timelineItems.length} 篇文稿与散落手记，依时间轨迹沉淀与梳理。`;

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题与分类过滤区（规范与文稿/手记页高度统一） */}
        <div className="mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70 font-sans">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <History className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>TIMELINE &bull; 时光年谱</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            {pageSubtitle}
          </p>

          {/* 一级内容类型筛选胶囊（温润天蓝微光选中态，规范统一） */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveType('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all flex items-center space-x-1.5 ${
                activeType === 'all'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300/80 dark:border-sky-700/80 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <span>全部</span>
              <span
                className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-sm ${
                  activeType === 'all'
                    ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {timelineItems.length}
              </span>
            </button>

            <button
              onClick={() => setActiveType('post')}
              className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all flex items-center space-x-1.5 ${
                activeType === 'post'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300/80 dark:border-sky-700/80 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>文稿</span>
              <span
                className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-sm ${
                  activeType === 'post'
                    ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {allPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveType('diary')}
              className={`px-3 py-1.5 rounded-sm text-xs font-sans transition-all flex items-center space-x-1.5 ${
                activeType === 'diary'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300/80 dark:border-sky-700/80 shadow-2xs'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
              }`}
            >
              <Feather className="w-3 h-3" />
              <span>手记</span>
              <span
                className={`text-[10.5px] font-mono px-1.5 py-0.2 rounded-sm ${
                  activeType === 'diary'
                    ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
              >
                {allDiaries.length}
              </span>
            </button>
          </div>
        </div>

        {/* 垂直时间轴内容流（紧凑年谱排版） */}
        <div className="space-y-8 pb-16 font-sans">
          {years.map((year) => (
            <div key={year} className="relative">
              {/* 年份标题与数量统计 */}
              <div className="flex items-center space-x-3 mb-3.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">
                  {year}
                </span>
                <div className="flex-1 h-px bg-slate-200/70 dark:border-slate-800/70" />
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                  {itemsByYear[year].length} 篇
                </span>
              </div>

              {/* 时间轴树状条目 */}
              <div className="relative pl-5 sm:pl-7 space-y-1 before:content-[''] before:absolute before:left-1.5 sm:before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200/80 dark:before:bg-slate-800/80">
                {itemsByYear[year].map((item) => (
                  <div key={item.id} className="relative group">
                    {/* 时间轴微节点圆点 */}
                    <div className="absolute -left-5 sm:-left-7 top-2.5 w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-sky-500 group-hover:scale-125 transition-all duration-200" />

                    {/* 单篇归档行卡片 */}
                    <Link
                      href={item.slug}
                      className="flex flex-col sm:flex-row sm:items-baseline justify-between py-1.5 px-2 -mx-1.5 rounded-sm hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-2xs transition-all border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60"
                    >
                      <div className="flex items-baseline space-x-2.5 min-w-0 pr-3">
                        {/* 发布日期 (MM-DD) */}
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 shrink-0 select-none">
                          {formatDateShort(item.date)}
                        </span>

                        {/* 标题 */}
                        <span className="text-[13px] sm:text-sm text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 font-medium transition-colors truncate">
                          {item.title}
                        </span>

                        {/* 分类微标签 */}
                        {item.category && (
                          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {/* 阅读时间 / 类型标 */}
                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-0 shrink-0">
                        {item.type === 'diary' ? (
                          <span className="px-1.5 py-0.2 rounded-sm bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                            手记
                          </span>
                        ) : (
                          item.readingTime && (
                            <span className="flex items-center space-x-1">
                              <Clock className="w-2.5 h-2.5 opacity-60" />
                              <span>{item.readingTime}</span>
                            </span>
                          )
                        )}
                      </div>
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
      </Container>
    </PageShell>
  );
};
