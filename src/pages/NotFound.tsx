import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Link } from 'wouter';
import { Compass, Home, FileText, Map, ArrowRight } from 'lucide-react';
import { getAllPosts } from '../content';

export const NotFound: React.FC = () => {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <PageShell>
      <Container size="narrow">
        <div className="py-12 sm:py-20 text-center max-w-lg mx-auto font-sans">
          <div className="w-12 h-12 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto mb-4 border border-slate-300/40 dark:border-slate-700/50 shadow-2xs">
            <Compass className="w-6 h-6 text-sky-600 dark:text-sky-400" />
          </div>

          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            404 NOT FOUND
          </span>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3 tracking-tight">
            纸页未至此处
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed mb-6">
            您所寻访的篇章可能已被迁转或未曾书写。请核对路径，或通过以下通道继续探索：
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-2xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>返回首页</span>
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-sky-500" />
              <span>文稿库</span>
            </Link>
            <Link
              href="/sitemap"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Map className="w-3.5 h-3.5 text-sky-500" />
              <span>站点地图</span>
            </Link>
          </div>

          {/* 推荐最新文稿 */}
          {recentPosts.length > 0 && (
            <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-left space-y-2">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider block text-center mb-3">
                或许您想阅读这些篇章：
              </span>
              <div className="space-y-1.5">
                {recentPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/posts/${p.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-md border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-850/60 transition-colors group"
                  >
                    <span className="font-serif text-xs text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate pr-2">
                      {p.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </PageShell>
  );
};
