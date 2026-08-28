import React from 'react';
import { Link } from 'wouter';
import { Calendar, Folder, Tag, ImageIcon } from 'lucide-react';
import type { Post } from '../../types';
import { formatDateShort } from '../../lib/date';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const coverImg = post.coverImage;

  return (
    <article className="group rounded-sm overflow-hidden paper-card transition-all duration-200 flex flex-col h-full">
      <Link href={`/posts/${post.slug}`} className="flex flex-col h-full">
        {/* 顶部标准 16:9 无缝相框封面 */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
          {coverImg ? (
            <img
              src={coverImg}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center select-none relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50/50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900">
              <div className="w-8 h-8 rounded-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 shadow-2xs flex items-center justify-center text-blue-500 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-4 h-4 opacity-80" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {post.category || 'ARTICLE'}
              </span>
            </div>
          )}
        </div>

        {/* 下半部分白底内容区 */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            {/* 标题 */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors line-clamp-1 leading-snug tracking-tight font-sans">
              {post.title}
            </h3>

            {/* 摘要 */}
            {post.summary && (
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
                {post.summary}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-1">
            {/* 标签列表 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
                <Tag className="w-2.5 h-2.5 opacity-70 flex-shrink-0" />
                <div className="flex flex-wrap items-center gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 底部元信息行 */}
            <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3 opacity-70" />
                <span>{formatDateShort(post.date)}</span>
              </div>
              {post.category && (
                <div className="flex items-center space-x-1">
                  <Folder className="w-3 h-3 opacity-70" />
                  <span className="truncate max-w-[110px]">{post.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};
