import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from 'wouter';
import { Megaphone, ChevronRight } from 'lucide-react';
import type { SocialLink } from '../../types';
import { GithubIcon, XTwitterIcon, MailIcon, BilibiliIcon, TelegramIcon } from '../ui/Icons';
import { siteConfig, getAllDiaries } from '../../content';
import { CountUp, SplitText, BlurText } from '../reactbits';

import { Magnetic } from '../ui/Magnetic';

const SOCIAL_ICONS: Record<SocialLink['icon'], React.FC<React.SVGProps<SVGSVGElement>>> = {
  github: GithubIcon,
  bilibili: BilibiliIcon,
  x: XTwitterIcon,
  email: MailIcon,
  telegram: TelegramIcon,
};

export const HomeHero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power3.out' } });
    
    // 强制初始状态为不可见以避免闪烁，然后依次按延迟执行动画
    tl.fromTo('.gsap-hero-avatar', { opacity: 0, y: 12 }, { opacity: 1, y: 0 })
      .fromTo('.gsap-hero-title', { opacity: 0 }, { opacity: 1 }, 0.1)
      .fromTo('.gsap-hero-skills', { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.35)
      .fromTo('.gsap-hero-metrics', { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.45)
      .fromTo('.gsap-hero-socials', { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.55)
      .fromTo('.gsap-hero-announcement', { opacity: 0, y: 8 }, { opacity: 1, y: 0 }, 0.62);
  }, { scope: containerRef });
  const diaries = getAllDiaries();
  const totalDiaries = diaries.length;

  const sinceDateStr =
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
    <section ref={containerRef} className="relative flex flex-col items-center justify-center py-2 sm:py-3 lg:py-0 text-center overflow-hidden w-full">
      {/* 头像区域 */}
      <div className="gsap-hero-avatar opacity-0 mb-3 sm:mb-4 lg:mb-3 relative group">
        <Magnetic strength={2.5}>
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-[4.85rem] lg:h-[4.85rem] rounded-full p-0.5 sm:p-1 bg-gradient-to-tr from-sky-200/90 via-white/90 to-blue-300/50 dark:from-slate-800/90 dark:via-white/[0.12] dark:to-sky-900/70 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08),inset_0_1px_1px_0_rgba(255,255,255,0.7)] dark:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.15)]">
            <img
              src={siteConfig.author.avatar || '/avatar.png'}
              alt={siteConfig.author.name}
              width={78}
              height={78}
              decoding="async"
              fetchPriority="high"
              onError={(e) => {
                if (typeof window !== 'undefined' && e.currentTarget.src !== window.location.origin + '/avatar.png') {
                  e.currentTarget.src = '/avatar.png';
                }
              }}
              className="w-full h-full rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
            />
            {/* 在线状态点与 Tooltip */}
            <div className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 group/status">
              <span
                className={`block w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${statusColorClass} border-2 border-white dark:border-slate-900 shadow-sm`}
              />
              {/* Tooltip */}
              <div className="glass-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap text-slate-800 dark:text-slate-100 pointer-events-none opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20">
                状态: {onlineStatus}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-white/90 dark:border-t-slate-900/90" />
              </div>
            </div>
          </div>
        </Magnetic>
      </div>

      {/* 主标题排版 - 采用 SplitText 逐字物理级切分浮现 */}
      <div className="gsap-hero-title opacity-0 space-y-1 sm:space-y-2 mt-1">
        <h1 className="font-sans text-2xl sm:text-4xl lg:text-[2.6rem] font-medium tracking-tight text-slate-800 dark:text-slate-100 leading-tight flex items-center justify-center gap-2">
          <span className="font-light text-slate-400 dark:text-slate-400">{greeting}</span>
          <SplitText
            text={siteConfig.author.name}
            tag="span"
            className="font-bold text-sky-600 dark:text-sky-400 font-douyin inline-block"
            splitType="chars"
            delay={45}
            duration={0.75}
            from={{ opacity: 0, y: 18 }}
            to={{ opacity: 1, y: 0 }}
          />
        </h1>
        
        <div className="font-sans text-xl sm:text-3xl lg:text-[2rem] font-normal tracking-tight leading-snug flex items-center justify-center gap-2">
          <span className="font-light text-slate-400 dark:text-slate-400">I build</span>
          <SplitText
            text={highlightRole}
            tag="span"
            className="font-semibold text-sky-600 dark:text-sky-400 inline-block"
            splitType="chars"
            delay={25}
            duration={0.7}
            from={{ opacity: 0, y: 16 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        {/* 技能栈 - 纯净流线排版 */}
        {skillsPills && (
          <div className="gsap-hero-skills opacity-0 pt-2 sm:pt-2.5 flex items-center justify-center gap-2 text-xs sm:text-[13px] font-mono text-slate-400 dark:text-slate-500">
            <span>{skillsPills.split('•').map((s) => s.trim()).join('  ·  ')}</span>
          </div>
        )}
      </div>

      {/* 格言与数据指标 - 人文格言采用 BlurText 柔光模糊聚拢 */}
      <div className="gsap-hero-metrics opacity-0 mt-3 sm:mt-4 lg:mt-3 text-center">
        {quote && (
          <div className="max-w-[65ch] mx-auto font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed flex justify-center">
            <BlurText
              text={`「${quote}」`}
              animateBy="words"
              delay={80}
              stepDuration={0.28}
              direction="top"
              className="justify-center text-center"
            />
          </div>
        )}
        {showMetrics && (
          <div className="mt-1.5 sm:mt-2 flex items-center justify-center gap-3 text-[11px] font-mono text-slate-400 dark:text-slate-500">
            <span>
              <CountUp to={totalDiaries} duration={1.2} /> 篇手记
            </span>
            <span>&bull;</span>
            <span>
              运行 <CountUp to={runningDays} duration={1.8} /> 天
            </span>
          </div>
        )}
      </div>

      {/* 社交链接流 - 极简纯图标形式，引入微磁微动反馈 */}
      {showSocials && siteConfig.author.socials && siteConfig.author.socials.length > 0 && (
        <div className="gsap-hero-socials opacity-0 mt-3 sm:mt-3.5 lg:mt-3 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          {siteConfig.author.socials.map((social) => {
            const Icon = (SOCIAL_ICONS as any)[social.icon] || GithubIcon;
            return (
              <Magnetic key={social.name} strength={2}>
                <a
                  href={social.url}
                  target={social.url.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  aria-label={social.name}
                  className="group/social relative p-1.5 text-slate-400 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none"
                >
                  <Icon className="w-4 h-4 sm:w-[17px] sm:h-[17px] transition-transform duration-200 group-hover/social:scale-110" />
                  {/* 悬浮 Tooltip */}
                  <div className="glass-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap text-slate-800 dark:text-slate-100 pointer-events-none opacity-0 invisible group-hover/social:opacity-100 group-hover/social:visible transition-all z-20">
                    {social.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 border-4 border-transparent border-t-white/90 dark:border-t-slate-900/90" />
                  </div>
                </a>
              </Magnetic>
            );
          })}
        </div>
      )}

      {/* 建站初期演示公告条 */}
      {siteConfig.announcement?.enabled && (
        <div className="gsap-hero-announcement opacity-0 mt-3 sm:mt-4 lg:mt-3 max-w-lg mx-auto w-full px-2">
          <div className="glass-card !shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7),0_2px_6px_-1px_rgba(15,23,42,0.04)] dark:!shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_2px_8px_-2px_rgba(0,0,0,0.35)] flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-md text-xs font-sans text-slate-700 dark:text-slate-200 overflow-hidden">
            {/* 左侧固定徽标 */}
            <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[10.5px] font-mono font-medium bg-sky-50/80 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/50 backdrop-blur-xs shadow-2xs z-10 select-none">
              <Megaphone className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>{siteConfig.announcement.badge || '公告'}</span>
            </span>

            {/* 中间无缝滚动跑马灯视口（带左右边缘渐隐遮罩与悬停暂停） */}
            <div className="relative flex-1 overflow-hidden min-w-0 [mask-image:linear-gradient(to_right,transparent,black_14px,black_calc(100%-14px),transparent)] select-none">
              <div className="animate-marquee pause-marquee py-0.5">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-normal pr-10 shrink-0">
                  {siteConfig.announcement.content}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-normal pr-10 shrink-0" aria-hidden="true">
                  {siteConfig.announcement.content}
                </span>
              </div>
            </div>

            {/* 右侧固定跳转链接 */}
            {siteConfig.announcement.linkUrl && (
              <Link
                href={siteConfig.announcement.linkUrl}
                className="shrink-0 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 inline-flex items-center gap-0.5 group transition-colors ml-0.5 z-10 select-none"
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
