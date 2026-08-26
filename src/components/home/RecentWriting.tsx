import React from 'react';
import { Link } from 'wouter';
import { getAllPosts, getAllNotes } from '../../content';
import { formatDateShort } from '../../lib/date';
import { ArrowRight, Feather } from 'lucide-react';

export const RecentWriting: React.FC = () => {
  const posts = getAllPosts();
  const notes = getAllNotes();

  // 融合文稿与速记按时间排序生成近期列表
  const combined = [
    ...posts.map((p) => ({
      id: `post-${p.slug}`,
      slug: `/posts/${p.slug}`,
      title: p.title,
      date: p.date,
      category: `文章 · ${p.category}`,
      summary: p.summary,
      readingTime: p.readingTime,
      isPrimary: true,
    })),
    ...notes.map((n) => ({
      id: `note-${n.slug}`,
      slug: `/notes/${n.slug}`,
      title: n.title,
      date: n.date,
      category: `速记 · ${n.category}`,
      summary: n.summary,
      readingTime: n.readingTime,
      isPrimary: false,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

  return (
    <section className="mt-8 mb-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* 标题栏 */}
      <div className="mb-8 flex items-center justify-between pb-3 border-b border-stone-200/70 dark:border-stone-800/70">
        <div>
          <div className="text-[11px] uppercase font-mono tracking-[1.8px] text-stone-400 dark:text-stone-500">
            RECENT WRITING
          </div>
          <h2 className="mt-1 font-serif text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight flex items-center space-x-2">
            <Feather className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <span>近期笔墨</span>
          </h2>
        </div>
        <Link
          href="/posts"
          className="inline-flex items-center space-x-1 text-xs font-mono text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <span>查看全部文稿</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Innei 经典垂直时间轴刻度列表 */}
      <div className="relative pl-6 sm:pl-8">
        {/* 时间轴中线 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-2 left-[11px] sm:left-[15px] w-0.5 bg-stone-200/80 dark:bg-stone-800/80"
        />
        {/* 时间轴顶部高光渐变指示线 */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[11px] sm:left-[15px] top-2 h-36 w-0.5 bg-gradient-to-b from-amber-600 dark:from-amber-400 to-transparent"
        />

        <div className="space-y-6">
          {combined.map((item, index) => {
            const indexStr = String(index + 1).padStart(2, '0');
            const isFirst = index === 0;

            return (
              <div key={item.id} className="relative py-2 pl-4 sm:pl-6 group">
                {/* 序号徽标 */}
                <span
                  className={`absolute -left-[14px] sm:-left-[18px] top-3 -translate-x-1/2 px-1 rounded text-xs font-mono font-medium tabular-nums ${
                    isFirst
                      ? 'text-amber-800 dark:text-amber-400 bg-amber-100/80 dark:bg-amber-950/80'
                      : 'text-stone-400 dark:text-stone-500 bg-[#FAF8F5] dark:bg-[#141416]'
                  }`}
                >
                  {indexStr}
                </span>

                {/* 列表内容 */}
                <Link href={item.slug} className="block group">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                        {item.category}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">&bull;</span>
                      <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
                        {formatDateShort(item.date)}
                      </span>
                    </div>
                  </div>

                  <h3
                    className={`mt-1 font-serif text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug ${
                      isFirst ? 'text-lg sm:text-xl font-semibold' : 'text-base font-medium'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed font-sans">
                      {item.summary}
                    </p>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 底部印记与订阅互动模块 (Innei 风格) */}
      <div className="mt-16 pt-12 pb-6 border-t border-stone-200/60 dark:border-stone-800/60 text-center">
        <div className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200 mb-1">
          初秋微凉 &bull; 欢迎来信
        </div>
        <p className="text-xs font-serif italic text-stone-500 dark:text-stone-400 mb-8">
          不错过每一纸书，于二进制的世界里保留一缕温度。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-serif">
          <Link
            href="/friends"
            className="px-3.5 py-1.5 rounded-full border border-stone-200/80 dark:border-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 hover:border-amber-500/50 transition-all"
          >
            朋友们
          </Link>
          <Link
            href="/projects"
            className="px-3.5 py-1.5 rounded-full border border-stone-200/80 dark:border-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 hover:border-amber-500/50 transition-all"
          >
            项目
          </Link>
          <Link
            href="/says"
            className="px-3.5 py-1.5 rounded-full border border-stone-200/80 dark:border-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 hover:border-amber-500/50 transition-all"
          >
            一言思考
          </Link>
          <Link
            href="/about"
            className="px-3.5 py-1.5 rounded-full border border-stone-200/80 dark:border-stone-800/80 text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 hover:border-amber-500/50 transition-all"
          >
            关于我
          </Link>
        </div>
      </div>
    </section>
  );
};
