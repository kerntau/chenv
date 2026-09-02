import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

export const HomeHero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.out' } });
    
    // 强制初始状态为不可见以避免闪烁，然后依次按延迟执行动画
    tl.fromTo('.gsap-hero-avatar', { opacity: 0, y: 12 }, { opacity: 1, y: 0 })
      .fromTo('.gsap-hero-title', { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.1)
      .fromTo('.gsap-hero-metrics', { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.3)
      .fromTo('.gsap-hero-socials', { opacity: 0, y: 10 }, { opacity: 1, y: 0 }, 0.4)
      .fromTo('.gsap-hero-announcement', { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.45);
  }, { scope: containerRef });
  const posts = getAllPosts();
  const totalPosts = posts.length;
  const totalWords = posts.reduce((acc, cur) => acc + (cur.wordCount || 0), 0);
  const totalWordsText = totalWords > 10000 ? `${(totalWords / 10000).toFixed(1)} 万字` : `${totalWords} 字`;

  const sinceDateStr =
    siteConfig.sinceDate ||
    siteConfig.footer?.sinceDate ||
    (siteConfig.footer?.sinceYear ? `${siteConfig.footer.sinceYear}-01-01` : '2024-01-01');

  const runningDays = React.useMemo(() => {
    const start = new Date(sinceDateStr).getTime();
    const now = Date.now();
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [sinceDateStr]);

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
    <section ref={containerRef} className="relative flex flex-col items-center justify-center pt-2 pb-6 sm:pt-4 sm:pb-8 text-center overflow-hidden w-full">
      {/* 头像区域 */}
      <div className="gsap-hero-avatar opacity-0 mb-6 relative group">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-sky-200 to-blue-300/40 dark:from-slate-800 dark:to-sky-900/60 shadow-md">
          <img
            src={siteConfig.author.avatar || '/avatar.webp'}
            alt={siteConfig.author.name}
            className="w-full h-full rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
          />
          {/* 在线状态点与 Tooltip */}
          <div className="absolute bottom-1 right-1 group/status">
            <span
              className={`block w-3.5 h-3.5 rounded-full ${statusColorClass} border-2 border-white dark:border-slate-900 shadow-sm`}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap bg-slate-900/90 text-white dark:bg-slate-100/95 dark:text-slate-900 shadow-md backdrop-blur-sm pointer-events-none opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20">
              状态: {onlineStatus}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-900/90 dark:border-t-slate-100/95" />
            </div>
          </div>
        </div>
      </div>

      {/* 主标题排版 */}
      <h1 className="gsap-hero-title opacity-0 font-sans text-2xl sm:text-4xl lg:text-[2.6rem] font-normal leading-tight text-slate-900 dark:text-slate-100 tracking-tight">
        <div className="font-light opacity-85">
          {greeting}{' '}
          <span className="font-bold text-sky-700 dark:text-sky-400 tracking-tight">
            {siteConfig.author.name}
          </span>
        </div>
        
        <div className="mt-1 sm:mt-1.5 font-light opacity-80">
          <span>I build </span>
          <span className="font-semibold text-sky-700 dark:text-sky-400">
            {highlightRole}
          </span>
        </div>

        {skillsPills && (
          <div className="mt-2.5 sm:mt-3 flex items-center justify-center gap-1.5 flex-wrap">
            <span className="font-light opacity-75 text-sm sm:text-base">with</span>
            <code className="inline-flex items-center font-sans text-xs sm:text-[13px] font-medium px-2.5 py-0.5 rounded-sm text-slate-700 dark:text-slate-200 border border-sky-200/60 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/25">
              {skillsPills}
            </code>
            <span className="inline-block w-[2px] h-3.5 bg-sky-500/80 dark:bg-sky-400/80 rounded-full animate-[blink_1.2s_linear_infinite]" />
          </div>
        )}
      </h1>

      {/* 格言与数据指标 */}
      <div className="gsap-hero-metrics opacity-0 mt-8 text-center">
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
            <span>运行 {runningDays} 天</span>
          </div>
        )}
      </div>

      {/* 社交链接图标胶囊 */}
      {showSocials && siteConfig.author.socials && siteConfig.author.socials.length > 0 && (
        <div className="gsap-hero-socials opacity-0 mt-6 flex flex-wrap justify-center items-center gap-2">
          {siteConfig.author.socials.map((social) => {
            const Icon = (SOCIAL_ICONS as any)[social.icon] || GithubIcon;
            return (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('http') ? '_blank' : '_self'}
                rel="noreferrer"
                aria-label={social.name}
                className="group/social relative flex items-center justify-center w-9 h-9 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all duration-200 focus-visible:outline-none"
              >
                <Icon className="w-4 h-4" />
                {/* 悬浮 Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap bg-slate-900/90 text-white dark:bg-slate-100/95 dark:text-slate-900 shadow-md backdrop-blur-sm pointer-events-none opacity-0 invisible group-hover/social:opacity-100 group-hover/social:visible transition-all z-20">
                  {social.name}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-slate-900/90 dark:border-t-slate-100/95" />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* 建站初期演示公告条（严格契合全站 rounded-sm 极简微框风格） */}
      {siteConfig.announcement?.enabled && (
        <div className="gsap-hero-announcement opacity-0 mt-7 max-w-xl mx-auto w-full px-2">
          <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-sm bg-white/70 dark:bg-slate-900/50 border border-sky-100/60 dark:border-slate-800/60 text-xs font-sans text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-2 min-w-0 text-left">
              <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm text-[10.5px] font-mono font-medium bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/40">
                <Megaphone className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>{siteConfig.announcement.badge || '公告'}</span>
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 sm:line-clamp-none font-normal">
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
        </div>
      )}
    </section>
  );
};
