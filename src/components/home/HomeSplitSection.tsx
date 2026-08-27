import React from 'react';
import { Link } from 'wouter';
import { getAllPosts, getAllDiaries, getAllRecords } from '../../content';
import { formatDateShort } from '../../lib/date';
import { PostCard } from '../post/PostCard';
import {
  FileText,
  Feather,
  MessageSquareQuote,
} from 'lucide-react';

export const HomeSplitSection: React.FC = () => {
  const posts = getAllPosts().slice(0, 6); // 展示 6 篇精选文章 (3列x2行)
  const diaries = getAllDiaries().slice(0, 4); // 4 则手记
  const records = getAllRecords().slice(0, 3); // 3 条动态

  const formatRecordDate = (timestamp: number | string) => {
    if (!timestamp) return '';
    const d = new Date(
      typeof timestamp === 'number' ? timestamp : Number(timestamp) || timestamp
    );
    if (isNaN(d.getTime())) return String(timestamp);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hour}:${min}`;
  };

  return (
    <section className="mt-16 sm:mt-20 mb-2 sm:mb-4 w-full font-sans">
      {/* 8:4 黄金分割左右双栏栅格 (items-stretch 确保两栏高度基准一致) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* ================= 左侧专区: 封面相框文章流 (6 篇 16:9 标准卡片) ================= */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            {/* 左侧专区标题栏 */}
            <div className="h-9 flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-sm bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  最新文章
                </h2>
              </div>
              <Link
                href="/posts"
                className="text-xs text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-colors leading-none"
              >
                查看全部
              </Link>
            </div>

            {/* 文章相框卡片列表 (6 篇 3 列标准 16:9 网格) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>

        {/* ================= 右侧专区: 手记与动态上下分块 (4/12) ================= */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4 lg:space-y-0">
          
          {/* 上半部分: 近期手记 (Diaries) */}
          <div className="flex flex-col">
            <div className="h-9 flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-sm bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                  <Feather className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  近期手记
                </h2>
              </div>
              <Link
                href="/diaries"
                className="text-xs text-slate-400 hover:text-sky-600 dark:text-slate-500 dark:hover:text-sky-400 transition-colors leading-none"
              >
                查看全部
              </Link>
            </div>

            {/* 手记条目列表 (微调紧凑内边距与行高) */}
            <div className="mt-3 space-y-2">
              {diaries.length > 0 ? (
                diaries.map((diary) => (
                  <Link
                    key={diary.slug}
                    href={`/diaries/${diary.slug}`}
                    className="block p-2.5 rounded-sm paper-card transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 dark:text-slate-500 mb-0.5">
                      <span>{formatDateShort(diary.date)}</span>
                      {diary.weather && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-sky-50/80 dark:bg-sky-950/30 text-sky-700/80 dark:text-sky-400/80 text-[9.5px] font-sans">
                          {diary.weather}
                        </span>
                      )}
                    </div>
                    <h4 className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors line-clamp-1 leading-snug">
                      {diary.title}
                    </h4>
                    {diary.summary && (
                      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                        {diary.summary}
                      </p>
                    )}
                  </Link>
                ))
              ) : (
                <div className="p-4 rounded-sm bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-400">
                  暂无手记内容
                </div>
              )}
            </div>
          </div>

          {/* 下半部分: 最新动态 (Says & Thoughts) */}
          <div className="flex flex-col">
            <div className="h-9 flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <MessageSquareQuote className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  即时动态
                </h2>
              </div>
              <Link
                href="/says"
                className="text-xs text-slate-400 hover:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400 transition-colors leading-none"
              >
                查看全部
              </Link>
            </div>

            {/* 动态灵感气泡卡片列表 */}
            <div className="mt-3 space-y-2">
              {records.length > 0 ? (
                records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-2.5 rounded-sm paper-card space-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 dark:text-slate-500">
                      <span>{formatRecordDate(rec.date || rec.createdAt)}</span>
                      {rec.mood && (
                        <span className="px-1.5 py-0.2 rounded-sm bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700/80 dark:text-emerald-400/80 text-[9.5px] font-sans">
                          {rec.mood}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {rec.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-sm bg-slate-50/50 dark:bg-slate-900/50 text-center text-xs text-slate-400">
                  暂无即时动态
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
