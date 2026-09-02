import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { PageShell } from '../components/layout/PageShell';
import { Container } from '../components/layout/Container';
import { getAllPosts, getAllDiaries, getAllFriends, getAllRecords, getAllTags } from '../content';
import type { Post } from '../types';
import { formatDateShort } from '../lib/date';
import {
  ExternalLink,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export const Sitemap: React.FC = () => {
  const allPosts = useMemo(() => getAllPosts(), []);
  const allDiaries = useMemo(() => getAllDiaries(), []);
  const allFriends = useMemo(() => getAllFriends(), []);
  const allRecords = useMemo(() => getAllRecords(), []);
  const allTags = useMemo(() => getAllTags(), []);

  // 核心主册目次
  const sections = [
    { name: '首页', nameEn: 'Home', path: '/', desc: '序栈卷首、个人简介、核心技术与即时动态', count: '1 页面' },
    { name: '文稿归档', nameEn: 'Posts', path: '/posts', desc: '系统安全、底层架构、工程实践与深度专栏', count: `${allPosts.length} 篇` },
    { name: '时光归档', nameEn: 'Archives', path: '/archives', desc: '按年份逆序沉淀的全站时光时间轴脉络', count: `${allPosts.length + allDiaries.length} 条` },
    { name: '动态手记', nameEn: 'Diaries', path: '/diaries', desc: '代码之外的真实心境、日暮微风与生活切片', count: `${allDiaries.length} 篇` },
    { name: '日常说说', nameEn: 'Says', path: '/says', desc: '碎片化的即时灵感、微型日志与正在发生的事情', count: `${allRecords.length} 则` },
    { name: '志同道合', nameEn: 'Friends', path: '/friends', desc: '优秀独立博客友人链接、技术专栏与灵感共振', count: `${allFriends.length} 位` },
  ];

  // 按分类对文章进行书籍章节式编目
  const postsByCategory = useMemo(() => {
    const map: Record<string, Post[]> = {};
    allPosts.forEach((post) => {
      const cat = post.category || '未分类';
      if (!map[cat]) {
        map[cat] = [];
      }
      map[cat].push(post);
    });
    return Object.entries(map).sort((a, b) => b[1].length - a[1].length);
  }, [allPosts]);

  return (
    <PageShell>
      <Container size="wide">
        {/* 出版级温润纸板大单（宽版心大气舒展） */}
        <article className="paper-sheet-realistic p-6 sm:p-10 md:p-12 font-sans space-y-10 my-4 sm:my-8 text-slate-800 dark:text-slate-200">

          {/* 卷首题头 (Editorial Front Matter) */}
          <header className="text-center pb-8 border-b border-slate-200/70 dark:border-slate-800/70 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-xs bg-slate-100 dark:bg-slate-800 text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400">
              <BookOpen className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span>TOPOGRAPHY &amp; COLOPHON</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-slate-950 dark:text-slate-50 tracking-tight">
              全站索隐与架构导览
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-serif leading-relaxed max-w-xl mx-auto">
              篇卷有绪，目次相循。汇总全站频道大纲、技术专栏文稿、日常手记随笔与词条标签索隐。
            </p>

            {/* 出版元数据摘要条 */}
            <div className="pt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span>共收录 {allPosts.length} 篇文稿</span>
              <span>&bull;</span>
              <span>{allDiaries.length} 篇手记</span>
              <span>&bull;</span>
              <span>{allTags.length} 个词条</span>
            </div>
          </header>

          {/* 第一编：全站主目次 (Table of Sections - 双列排开) */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                第一编 · 核心卷册目次
              </h2>
              <span className="font-mono text-[11px] text-slate-400">
                01 - 0{sections.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
              {sections.map((sec, idx) => (
                <Link
                  key={sec.path}
                  href={sec.path}
                  className="group flex items-baseline justify-between py-2 px-2.5 -mx-2.5 rounded-xs hover:bg-slate-100/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-baseline gap-2 min-w-0 pr-2">
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      0{idx + 1}.
                    </span>
                    <span className="font-serif text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors shrink-0">
                      {sec.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-serif truncate hidden lg:inline">
                      — {sec.desc}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 shrink-0 font-mono text-xs">
                    <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">
                      {sec.count}
                    </span>
                    <span className="text-sky-600/80 dark:text-sky-400/80 font-medium">
                      {sec.path}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 第二编：文稿编目 (Subject Catalog - 宽屏三列排版) */}
          <section className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                第二编 · 技术专栏与文稿编目
              </h2>
              <span className="font-mono text-[11px] text-slate-400">
                {postsByCategory.length} 个分类 · {allPosts.length} 篇
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsByCategory.map(([category, posts]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-sky-500 font-bold">#</span>
                    <span>{category}</span>
                    <span className="text-[10.5px] font-normal text-slate-400">
                      ({posts.length})
                    </span>
                  </div>

                  <div className="space-y-1">
                    {posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="group flex items-baseline justify-between py-1.5 px-2 -mx-2 rounded-xs hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <span className="font-serif text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate pr-3 group-hover:underline underline-offset-2">
                          {post.title}
                        </span>
                        <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500 shrink-0">
                          {formatDateShort(post.date)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 第三编：日常手记 (Chronicles & Diaries - 宽屏三列排版) */}
          {allDiaries.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-baseline justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  第三编 · 散落日常与生活手记
                </h2>
                <span className="font-mono text-[11px] text-slate-400">
                  {allDiaries.length} 篇切片
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1.5">
                {allDiaries.map((diary) => (
                  <Link
                    key={diary.slug}
                    href={`/diaries/${diary.slug}`}
                    className="group flex items-baseline justify-between py-1.5 px-2 -mx-2 rounded-xs hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="font-serif text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate pr-3 group-hover:underline underline-offset-2">
                      {diary.title}
                    </span>
                    <span className="font-mono text-[10.5px] text-slate-400 dark:text-slate-500 shrink-0">
                      {formatDateShort(diary.date)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 第四编：全书词条索隐 (Index of Tags) */}
          {allTags.length > 0 && (
            <section className="space-y-3.5">
              <div className="flex items-baseline justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  第四编 · 词条与术语索隐
                </h2>
                <span className="font-mono text-[11px] text-slate-400">
                  {allTags.length} 个词条
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {allTags.map((tag) => (
                  <Link
                    key={tag.name}
                    href={`/posts?tag=${encodeURIComponent(tag.name)}`}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono text-[11px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[9.5px] opacity-60">({tag.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 卷末附录：机器索引与订阅声明 (Colophon & Feeds) */}
          <footer className="pt-6 border-t border-slate-200/70 dark:border-slate-800/70 space-y-3">
            <div className="p-4 rounded-xs bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>机器可读规范与数据订阅</span>
                </div>
                <p className="text-[11px] font-serif text-slate-500 dark:text-slate-400">
                  支持符合 W3C / Sitemaps 0.9 协议的搜索引擎抓取，以及标准 RSS 2.0 聚合订阅。
                </p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span>sitemap.xml</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xs bg-sky-50 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
                >
                  <span>feed.xml</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </footer>

        </article>
      </Container>
    </PageShell>
  );
};
