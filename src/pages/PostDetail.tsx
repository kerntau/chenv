import React, { useMemo, useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { TOC } from '../components/post/TOC';
import { ReadingProgressBar } from '../components/post/ReadingProgressBar';
import { getPostBySlug, getAllPosts, siteConfig } from '../content';
import { formatDate } from '../lib/date';
import { stripDuplicateHeading } from '../lib/markdown';
import {
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  ShieldAlert,
  ListOrdered,
  X,
  AlignLeft,
  ArrowUp,
} from 'lucide-react';

export const PostDetail: React.FC = () => {
  const [, params] = useRoute('/posts/:slug');
  const [, setLocation] = useLocation();
  const slug = params?.slug;
  const [copied, setCopied] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const allPosts = useMemo(() => getAllPosts(), []);
  const post = useMemo(() => (slug ? getPostBySlug(slug) : null), [slug]);

  useEffect(() => {
    if (post?.title) {
      document.title = `${post.title} · 序栈`;
    }
  }, [post?.title]);

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

  // 过滤掉 Markdown 正文开头与文章大标题重复的首行 # 标题
  const cleanContent = useMemo(() => {
    return stripDuplicateHeading(post?.content || '', post?.title);
  }, [post?.content, post?.title]);

  const [coverError, setCoverError] = useState(false);
  const coverUrl = useMemo(() => {
    if (!post) return null;
    if (coverError) return `/covers/${post.slug}.svg`;
    if (post.coverImage) return post.coverImage;
    return `/covers/${post.slug}.svg`;
  }, [post, coverError]);

  if (!post) {
    return (
      <PageShell>
        <Container>
          <div className="py-24 text-center">
            <h2 className="font-sans text-2xl font-semibold text-slate-800 dark:text-slate-200">
              文稿未找到
            </h2>
            <p className="text-sm text-slate-500 mt-2 font-mono">
              请求的文章路径不存在或已归档下线
            </p>
            <button
              onClick={() => setLocation('/posts')}
              className="mt-6 px-4 py-2 rounded-sm bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 text-xs font-medium"
            >
              返回文章列表
            </button>
          </div>
        </Container>
      </PageShell>
    );
  }

  const hasToc = post.toc && post.toc.length > 0;

  return (
    <>
      <ReadingProgressBar />

      <PageShell>
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-10 sm:pb-16">
          
          {/* 核心布局：正文纸张大板 (flex-1 max-w-[960px]) + 宽屏右侧侧栏目录 (w-72 xl:w-80)，紧凑收拢右侧边缘留白 */}
          <div className="flex items-start justify-center gap-6 lg:gap-8 xl:gap-10">
            
            {/* 1. 高端出版级自然温润纸质大板容器（一体化通顶无缝封面大图） */}
            <main className="w-full flex-1 max-w-[960px] min-w-0 font-sans paper-sheet-realistic overflow-hidden text-slate-800 dark:text-slate-200">
              
              {/* 顶部全宽一体化通顶大画幅背景图 (Full-Bleed Cover Hero) - 移动端紧凑高度 */}
              {coverUrl ? (
                <div className="relative w-full h-44 sm:h-64 lg:h-72 overflow-hidden bg-slate-950">
                  <img
                    src={coverUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={() => {
                      if (!coverError) setCoverError(true);
                    }}
                  />
                  {/* 自然的多阶环境光渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/35 pointer-events-none" />

                  {/* 浮于大图底部的文章头衔：分类、日期、主标题 */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-10 text-white space-y-1.5 sm:space-y-2 pointer-events-none">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-mono text-white/90">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-sm bg-sky-500/85 backdrop-blur-md text-white font-medium shadow-sm text-[10.5px] sm:text-xs">
                        {post.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1 text-white/90">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </span>
                      <span>&bull;</span>
                      <span className="text-white/90">约 {post.wordCount} 字</span>
                    </div>

                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug drop-shadow-md line-clamp-2 sm:line-clamp-none">
                      {post.title}
                    </h1>
                  </div>
                </div>
              ) : (
                /* 无图片时的纯净头部工具栏 */
                <div className="p-3 sm:p-6 pb-0">
                  <div className="mb-3 sm:mb-4 flex items-center justify-between pb-2.5 sm:pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                    <Link
                      href="/posts"
                      className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>返回文稿归档</span>
                    </Link>

                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center space-x-1 text-[11px] sm:text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-sm border border-slate-200/70 dark:border-slate-800/70 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">
                            已复制
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

                  <header className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-200/70 dark:border-slate-800/70">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10.5px] sm:text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 sm:mb-2.5">
                      <span className="px-1.5 sm:px-2 py-0.5 rounded-sm bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium border border-sky-200/50 dark:border-sky-800/50">
                        {post.category}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                      </span>
                      <span>&bull;</span>
                      <span>约 {post.wordCount} 字</span>
                    </div>

                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-slate-950 dark:text-slate-50 tracking-tight leading-snug">
                      {post.title}
                    </h1>
                  </header>
                </div>
              )}

              {/* 纸张正文核心内容区（统一自然内边距） */}
              <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4 md:pt-4">
                
                {/* 摘要导言 */}
                {post.summary && (
                  <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-sm bg-slate-100/70 dark:bg-slate-900/50 border-l-2 border-sky-500 text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {post.summary}
                  </div>
                )}

                {/* 标签微选 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4 sm:mb-6 flex flex-wrap gap-1 sm:gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 rounded-sm text-[11px] sm:text-xs font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                      >
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Markdown 正文渲染 (自动去重首行同名大标题) */}
                <div className="min-h-[300px] sm:min-h-[400px] leading-relaxed">
                  <MarkdownRenderer content={cleanContent} />
                </div>

              {/* 底部声明与署名 */}
              <footer className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-slate-200/70 dark:border-slate-800/70 space-y-3 sm:space-y-4">
                <div className="p-2.5 sm:p-3.5 rounded-sm bg-sky-50/30 dark:bg-sky-950/20 border border-sky-100/70 dark:border-slate-800/60 flex items-start space-x-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400">
                  <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-sans">
                    <strong>版权与原创声明：</strong>
                    本篇文章由 <strong>{siteConfig.author.name}</strong> 原创撰写，遵循{' '}
                    <span className="font-mono">CC BY-NC-SA 4.0</span>{' '}
                    知识共享协议。商业转载请联系作者获得授权。
                  </div>
                </div>

                {/* 上一篇 / 下一篇跳转导航 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  {prevPost ? (
                    <Link
                      href={`/posts/${prevPost.slug}`}
                      className="group p-2.5 sm:p-3 rounded-sm border border-sky-100/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 block text-left transition-colors hover:bg-white/95 dark:hover:bg-slate-900/80"
                    >
                      <span className="text-[10px] sm:text-[10.5px] font-mono text-slate-400 flex items-center space-x-1 mb-0.5 sm:mb-1">
                        <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        <span>上一篇</span>
                      </span>
                      <div className="text-[11.5px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {prevPost.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextPost ? (
                    <Link
                      href={`/posts/${nextPost.slug}`}
                      className="group p-2.5 sm:p-3 rounded-sm border border-sky-100/70 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 block text-right sm:ml-auto w-full transition-colors hover:bg-white/95 dark:hover:bg-slate-900/80"
                    >
                      <span className="text-[10px] sm:text-[10.5px] font-mono text-slate-400 flex items-center justify-end space-x-1 mb-0.5 sm:mb-1">
                        <span>下一篇</span>
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <div className="text-[11.5px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                        {nextPost.title}
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              </footer>
            </div>
          </main>

            {/* 2. 宽屏右侧 Sticky 目录 (≥1280px / xl:block) - self-stretch 撑满正文高度，全程吸顶浮动跟随 */}
            {hasToc && (
              <aside className="hidden xl:block w-72 xl:w-80 shrink-0 self-stretch">
                <div className="sticky top-24 pt-2">
                  <TOC toc={post.toc} />
                </div>
              </aside>
            )}
          </div>
        </div>

        {/* 3. 中小屏 (<1280px) 右下角浮动目录按钮 */}
        {hasToc && (
          <div className="xl:hidden">
            <button
              onClick={() => setMobileTocOpen(true)}
              className="fixed right-4 bottom-6 sm:right-5 sm:bottom-8 z-40 p-2 sm:p-2.5 rounded-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-transform active:scale-95 flex items-center justify-center"
              title="打开文章目录"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            {/* 移动端侧滑抽屉 */}
            <AnimatePresence>
              {mobileTocOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileTocOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
                  />
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    className="fixed top-0 right-0 bottom-0 w-[84vw] max-w-[320px] bg-white dark:bg-[#0c121e] border-l border-slate-200 dark:border-slate-800 z-50 p-4 flex flex-col shadow-2xl"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60 mb-2.5">
                      <div className="flex items-center space-x-1.5 font-semibold text-xs text-slate-800 dark:text-slate-200">
                        <AlignLeft className="w-3.5 h-3.5 text-sky-500" />
                        <span>文章目录</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            setMobileTocOpen(false);
                          }}
                          className="text-[11px] font-mono text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center space-x-0.5 transition-colors cursor-pointer"
                          title="回到文章顶部"
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span>顶部</span>
                        </button>
                        <button
                          onClick={() => setMobileTocOpen(false)}
                          className="p-1 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                          title="关闭目录"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-1">
                      <TOC toc={post.toc} hideHeader onItemClick={() => setMobileTocOpen(false)} />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </PageShell>
    </>
  );
};

