import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Megaphone, ChevronRight } from 'lucide-react';
import type { SocialLink } from '../../types';
import { GithubIcon, XTwitterIcon, MailIcon, BilibiliIcon } from '../ui/Icons';
import { siteConfig, getAllPosts } from '../../content';

const SOCIAL_ICONS: Record<SocialLink['icon'], React.FC<React.SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  bilibili: BilibiliIcon,
  x: XTwitterIcon,
  email: MailIcon,
};

export const InneiHero: React.FC = () => {
  const posts = getAllPosts();
  const totalPosts = posts.length;
  const totalWords = posts.reduce((acc, cur) => acc + (cur.wordCount || 0), 0);
  const totalWordsText = totalWords > 10000 ? `${(totalWords / 10000).toFixed(1)} 万字` : `${totalWords} 字`;

  const hero = siteConfig.home?.hero;
  const greeting = hero?.greeting || "Hi, I'm";
  const highlightRole = hero?.highlightRole || "Cloud Native & Systems";
  const skillsPills = hero?.skillsPills || "Go • Rust • React 19 • K8s";
  const quote = hero?.quote || siteConfig.subtitle;
  const showMetrics = hero?.showMetrics ?? true;
  const showSocials = hero?.showSocials ?? true;
  const onlineStatus = hero?.onlineStatus || 'online';

  const statusColorClass =
    onlineStatus === 'online'
      ? 'bg-emerald-500'
      : onlineStatus === 'busy'
        ? 'bg-rose-500'
        : onlineStatus === 'away'
          ? 'bg-amber-500'
          : 'bg-slate-400';

  return (
    <section className="relative flex flex-col items-center justify-center pt-8 pb-12 sm:pt-16 sm:pb-16 text-center overflow-hidden">
      {/* 放射状背景呼吸光晕 */}
      <div
        className="pointer-events-none absolute -z-10 left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-[radial-gradient(ellipse,rgba(186,230,253,0.45)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse,rgba(56,189,248,0.12)_0%,transparent_65%)] blur-3xl opacity-80 transition-opacity duration-500"
      />

      {/* 头像区域 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 relative group"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-sky-200 to-blue-300/40 dark:from-slate-800 dark:to-sky-900/60 shadow-md">
          <img
            src={siteConfig.author.avatar || '/avatar.webp'}
            alt={siteConfig.author.name}
            className="w-full h-full rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
          {/* 在线状态点 */}
          <span
            className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full ${statusColorClass} border-2 border-white dark:border-slate-900 shadow-sm`}
            title={`状态: ${onlineStatus}`}
          />
        </div>
      </motion.div>

      {/* 主标题排版 */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-sans text-2xl sm:text-4xl lg:text-[2.6rem] font-normal leading-relaxed text-slate-900 dark:text-slate-100 tracking-tight"
      >
        <span className="font-light opacity-80">{greeting} </span>
        <span className="font-bold text-sky-700 dark:text-sky-400 tracking-tight transition-colors">
          {siteConfig.author.name}
        </span>
        <br className="hidden sm:inline" />
        <span className="font-light opacity-75 sm:ml-2">I build </span>
        <span className="font-semibold text-sky-700 dark:text-sky-400">
          {highlightRole}
        </span>
        <span className="font-light opacity-75"> with </span>
        <span className="inline-block mx-1 text-sky-600 dark:text-sky-400 text-[0.8em] align-middle animate-[aiTwinkle_2.4s_ease-in-out_infinite]">
          ✦
        </span>
        {skillsPills && (
          <code className="inline-flex items-center font-sans text-[0.65em] font-semibold px-2.5 py-1 rounded-sm text-sky-800 dark:text-sky-300 border border-sky-300/50 dark:border-sky-500/30 bg-sky-50/60 dark:bg-sky-950/30 shadow-sm align-middle">
            {skillsPills}
          </code>
        )}
        <span className="inline-block w-[2px] h-[0.85em] bg-sky-600 dark:bg-sky-400 ml-1.5 align-middle rounded-full animate-[blink_1.2s_linear_infinite]" />
      </motion.h1>

      {/* 副标题 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-2xl text-xs sm:text-sm tracking-wide text-slate-500 dark:text-slate-400 font-sans"
      >
        {siteConfig.description}
      </motion.p>

      {/* 格言与数据指标 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        {quote && (
          <div className="max-w-[65ch] mx-auto font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
            「{quote}」
          </div>
        )}
        {showMetrics && (
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <span>{totalPosts} 篇文稿</span>
            <span>&bull;</span>
            <span>{totalWordsText}</span>
            <span>&bull;</span>
            <span>{siteConfig.title}</span>
          </div>
        )}
      </motion.div>

      {/* 社交链接图标胶囊 */}
      {showSocials && siteConfig.author.socials && siteConfig.author.socials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 flex flex-wrap justify-center items-center gap-2"
        >
          {siteConfig.author.socials.map((social) => {
            const Icon = (SOCIAL_ICONS as any)[social.icon] || GithubIcon;
            return (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                aria-label={social.name}
                className="flex items-center justify-center w-9 h-9 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none"
                title={social.name}
              >
                <Icon className="w-4 h-4" />
              </a>
            );
          })}
        </motion.div>
      )}

      {/* 建站初期演示公告条 */}
      {siteConfig.announcement?.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl mx-auto w-full px-2"
        >
          <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm text-xs font-sans text-slate-700 dark:text-slate-200 shadow-xs">
            <div className="flex items-center gap-2 min-w-0 text-left">
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/70">
                <Megaphone className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>{siteConfig.announcement.badge || '公告'}</span>
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-200 line-clamp-1 sm:line-clamp-none font-medium">
                {siteConfig.announcement.content}
              </span>
            </div>
            {siteConfig.announcement.linkUrl && (
              <Link
                href={siteConfig.announcement.linkUrl}
                className="shrink-0 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 inline-flex items-center gap-0.5 group transition-colors ml-1"
              >
                <span>{siteConfig.announcement.linkText || '动态'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
};
