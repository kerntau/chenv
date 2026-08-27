import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { getAllDiaries, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import {
  BookMarked,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Heart,
  Sparkles,
} from 'lucide-react';

export const Diaries: React.FC = () => {
  const allDiaries = useMemo(() => getAllDiaries(), []);
  const [expandedSlugs, setExpandedSlugs] = useState<Record<string, boolean>>(() => {
    // 默认展开最新的第一篇手记
    if (allDiaries.length > 0) {
      return { [allDiaries[0].slug]: true };
    }
    return {};
  });

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});

  const tags = useMemo(() => {
    const set = new Set<string>();
    allDiaries.forEach((d) => d.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [allDiaries]);

  const filteredDiaries = useMemo(() => {
    if (!selectedTag) return allDiaries;
    return allDiaries.filter((d) => d.tags.includes(selectedTag));
  }, [allDiaries, selectedTag]);

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const handleLike = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesMap((prev) => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1,
    }));
  };

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题区 */}
        <div className="mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 mb-3">
            <BookMarked className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>DIARIES &bull; 纸上温度 &bull; 心境手记</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            散落的日常与手记
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans max-w-md mx-auto">
            捕捉那些代码之外的日暮微风、深夜随笔与生活切片。
          </p>

          {/* 标签微筛选器 */}
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors ${
                  !selectedTag
                    ? 'bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 font-medium'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                全部 ({allDiaries.length})
              </button>
              {tags.map((tag) => {
                const active = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(active ? null : tag)}
                    className={`px-2.5 py-1 rounded-full font-mono text-[11px] transition-colors ${
                      active
                        ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-700'
                        : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 手记列表时间轴 */}
        <div className="relative space-y-8">
          {/* 时间轴装饰中线 */}
          <div className="hidden sm:block absolute top-4 bottom-4 left-6 w-px bg-slate-200/80 dark:bg-slate-800/80 -z-10" />

          {filteredDiaries.map((diary) => {
            const isExpanded = Boolean(expandedSlugs[diary.slug]);

            return (
              <article
                key={diary.slug}
                id={diary.slug}
                className="p-6 sm:p-7 rounded-3xl paper-card space-y-4 transition-all duration-300 scroll-mt-24"
              >
                {/* 顶部元数据头：天气、心情、时间与地点 */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center space-x-1 font-semibold text-slate-800 dark:text-slate-200 font-serif">
                      <Calendar className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      <time dateTime={diary.date}>{formatDate(diary.date)}</time>
                      {diary.time && <span className="font-mono text-xs opacity-75">{diary.time}</span>}
                    </span>

                    {diary.weather && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]">
                        {diary.weather}
                      </span>
                    )}

                    {diary.mood && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 text-[11px] border border-sky-200/40 dark:border-sky-800/30">
                        {diary.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-[11px]">
                    {diary.location && (
                      <span className="flex items-center space-x-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-slate-400" />
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

                {/* 标题与导言 */}
                <div
                  onClick={() => toggleExpand(diary.slug)}
                  className="cursor-pointer group flex items-start justify-between gap-4"
                >
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
                      {diary.title}
                    </h2>
                    {!isExpanded && diary.summary && (
                      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans line-clamp-2">
                        {diary.summary}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(diary.slug);
                    }}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 mt-0.5"
                    title={isExpanded ? '收起全文' : '展开阅读'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* 展开的 Markdown 正文 */}
                {isExpanded && (
                  <div className="pt-2 animate-in fade-in zoom-in-[0.99] duration-200">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                      <MarkdownRenderer content={diary.content} />
                    </div>
                  </div>
                )}

                {/* 底部信息条：标签、点赞与收放 */}
                <div className="pt-3 flex items-center justify-between text-xs font-mono border-t border-slate-200/40 dark:border-slate-800/40">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {diary.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center space-x-0.5 text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                      >
                        <Tag className="w-2.5 h-2.5 opacity-50" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => handleLike(diary.slug, e)}
                      className="flex items-center space-x-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                      title="共鸣留痕"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current opacity-70 hover:opacity-100" />
                      <span>{likesMap[diary.slug] || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(diary.slug)}
                      className="text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 text-xs font-sans transition-colors"
                    >
                      {isExpanded ? '收起' : '全文'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredDiaries.length === 0 && (
            <div className="py-16 text-center text-xs font-mono text-slate-400">
              暂无匹配手记
            </div>
          )}
        </div>

        {/* 底部作者感言 */}
        <div className="mt-16 p-6 rounded-3xl paper-card text-center space-y-2 bg-slate-50/50 dark:bg-[#18181A]/50">
          <div className="flex items-center justify-center space-x-1.5 text-xs font-mono text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>落纸为念</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
            &ldquo;日记是自己写给自己最好的情书，也是时间长河里唯一的停靠桩。&rdquo;
          </p>
          <div className="text-[11px] font-mono text-slate-400 pt-1">
            &mdash; {siteConfig.author.name}
          </div>
        </div>
      </Container>
    </PageShell>
  );
};
