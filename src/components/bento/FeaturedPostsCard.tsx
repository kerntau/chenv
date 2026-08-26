import React from 'react';
import { Link } from 'wouter';
import { BookOpen, ArrowUpRight, Clock } from 'lucide-react';
import { getAllPosts } from '../../content';
import { formatDateShort } from '../../lib/date';

export const FeaturedPostsCard: React.FC = () => {
  const posts = getAllPosts().slice(0, 3);

  return (
    <div className="p-6 rounded-3xl paper-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              最新文稿
            </h2>
          </div>
          <Link
            href="/posts"
            className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            全部归档 &rarr;
          </Link>
        </div>

        <div className="space-y-3.5 divide-y divide-stone-100 dark:divide-stone-800/60">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block pt-3.5 first:pt-0"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 shrink-0">
                      {post.category}
                    </span>
                    <span className="font-serif text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors truncate">
                      {post.title}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                    {post.summary}
                  </p>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
              </div>
              <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-stone-400 dark:text-stone-500 font-mono">
                <span>{formatDateShort(post.date)}</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.readingTime}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
