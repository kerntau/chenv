import React, { useMemo } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { TOC } from '../components/post/TOC';
import { ReadingProgressBar } from '../components/post/ReadingProgressBar';
import { getPostBySlug, getAllPosts, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import {
  Clock,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const PostDetail: React.FC = () => {
  const [, params] = useRoute('/posts/:slug');
  const [, setLocation] = useLocation();
  const slug = params?.slug;
  const [copied, setCopied] = React.useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);
  const post = useMemo(() => (slug ? getPostBySlug(slug) : null), [slug]);

  // 上一篇与下一篇导航计算
  const { prevPost, nextPost } = useMemo(() => {
    if (!slug) return { prevPost: null, nextPost: null };
    const currentIndex = allPosts.findIndex((p) => p.slug === slug);
    if (currentIndex === -1) return { prevPost: null, nextPost: null };
    return {
      prevPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
      nextPost: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
    };
  }, [allPosts, slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (!post) {
    return (
      <PageShell>
        <Container>
          <div className="py-24 text-center">
            <h2 className="font-serif text-2xl font-semibold text-slate-800 dark:text-slate-200">
              文稿未找到
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-mono">
              请求的文章路径不存在或已归档下线
            </p>
            <button
              onClick={() => setLocation('/posts')}
              className="mt-6 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 text-xs font-medium"
            >
              返回文章列表
            </button>
          </div>
        </Container>
      </PageShell>
    );
  }

  return (
    <>
      <ReadingProgressBar />

      <PageShell>
        <Container size="wide">
          {/* 返回按钮与面包屑 */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/posts"
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>返回文稿归档</span>
            </Link>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    链接已复制
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>分享文章</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* 文章主阅读区：单行文本宽度严格控制在 65ch 左右，最大化留白与纸质呼吸感 */}
            <main className="lg:col-span-8 xl:col-span-8 min-w-0 max-w-[65ch] mx-auto lg:mx-0">
              {/* 头部元信息 */}
              <header className="mb-10 pb-8 border-b border-slate-200/70 dark:border-slate-800/70">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    {post.category}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime}</span>
                  </span>
                  <span>&bull;</span>
                  <span>约 {post.wordCount} 字</span>
                </div>

                {/* 大标题 */}
                <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-950 dark:text-slate-50 tracking-tight leading-snug">
                  {post.title}
                </h1>

                {/* 摘要导言 */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 border-l-2 border-slate-400 dark:border-slate-600">
                  <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {post.summary}
                  </p>
                </div>

                {/* 标签 */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                    >
                      <Tag className="w-2.5 h-2.5 opacity-60" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </header>

              {/* Markdown 正文渲染 */}
              <div className="min-h-[400px]">
                <MarkdownRenderer content={post.content} />
              </div>

              {/* 底部声明与署名 */}
              <footer className="mt-14 pt-8 border-t border-slate-200/70 dark:border-slate-800/70 space-y-6">
                <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-sans">
                    <strong>版权与原创声明：</strong>
                    本篇文章由 <strong>{siteConfig.author.name}</strong> 原创撰写，遵循{' '}
                    <span className="font-mono">CC BY-NC-SA 4.0</span>{' '}
                    知识共享协议。商业转载请联系作者获得授权。
                  </div>
                </div>

                {/* 上一篇 / 下一篇跳转导航 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {prevPost ? (
                    <Link
                      href={`/posts/${prevPost.slug}`}
                      className="group p-4 rounded-2xl paper-card block text-left"
                    >
                      <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 mb-1">
                        <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        <span>上一篇</span>
                      </span>
                      <div className="font-serif text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {prevPost.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextPost ? (
                    <Link
                      href={`/posts/${nextPost.slug}`}
                      className="group p-4 rounded-2xl paper-card block text-right sm:ml-auto w-full"
                    >
                      <span className="text-[11px] font-mono text-slate-400 flex items-center justify-end space-x-1 mb-1">
                        <span>下一篇</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <div className="font-serif text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {nextPost.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </footer>
            </main>

            {/* 侧边栏 TOC 目录 */}
            <aside className="hidden lg:block lg:col-span-4 xl:col-span-4 pl-6">
              <div className="sticky top-24 space-y-6">
                <TOC toc={post.toc} />

                {/* 文章信息简卡 */}
                <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/40 dark:bg-[#18181A]/40 text-xs font-mono text-slate-500 space-y-2">
                  <div className="flex justify-between">
                    <span>字数统计</span>
                    <span className="text-slate-800 dark:text-slate-200 font-sans">
                      {post.wordCount} 字
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>预计耗时</span>
                    <span className="text-slate-800 dark:text-slate-200 font-sans">
                      {post.readingTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>发布日期</span>
                    <span className="text-slate-800 dark:text-slate-200 font-sans">
                      {post.date}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </PageShell>
    </>
  );
};
