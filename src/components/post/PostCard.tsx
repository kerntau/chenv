import React from 'react';
import { Link } from 'wouter';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import type { Post } from '../../types';
import { formatDate } from '../../lib/date';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <article className="group relative p-6 sm:p-7 rounded-3xl paper-card transition-all duration-200">
      <Link href={`/posts/${post.slug}`} className="block focus:outline-none">
        {/* 元信息条 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {post.category}
            </span>
            <span>&bull;</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* 标题 */}
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors tracking-tight leading-snug">
          {post.title}
        </h2>

        {/* 摘要 */}
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed font-sans">
          {post.summary}
        </p>

        {/* 标签与阅读链接 */}
        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-0.5 text-[11px] font-mono text-slate-500 dark:text-slate-400"
              >
                <Tag className="w-2.5 h-2.5 opacity-60 mr-0.5" />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          <span className="inline-flex items-center space-x-1 text-xs font-sans font-medium text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all">
            <span>精读文稿</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </article>
  );
};
