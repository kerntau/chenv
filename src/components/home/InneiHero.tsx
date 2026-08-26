import React from 'react';
import { motion } from 'framer-motion';
import {
  GithubIcon,
  XTwitterIcon,
  RssIcon,
  MailIcon,
  TelegramIcon,
  NetEaseMusicIcon,
  BilibiliIcon,
} from '../ui/Icons';

export const InneiHero: React.FC = () => {
  const socials = [
    { name: 'X / Twitter', icon: XTwitterIcon, href: 'https://x.com' },
    { name: 'RSS 订阅', icon: RssIcon, href: '/feed' },
    { name: 'Email 联系', icon: MailIcon, href: 'mailto:contact@perimsx.me' },
    { name: 'GitHub', icon: GithubIcon, href: 'https://github.com' },
    { name: '网易云音乐', icon: NetEaseMusicIcon, href: 'https://music.163.com' },
    { name: '哔哩哔哩', icon: BilibiliIcon, href: 'https://bilibili.com' },
    { name: 'Telegram', icon: TelegramIcon, href: 'https://t.me' },
  ];

  return (
    <section className="relative flex flex-col items-center justify-center pt-8 pb-16 sm:py-20 text-center overflow-hidden">
      {/* Innei 经典中心放射状背景呼吸光晕 */}
      <div
        className="pointer-events-none absolute -z-10 left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full w-[280px] sm:w-[480px] h-[280px] sm:h-[480px] bg-[radial-gradient(ellipse,rgba(255,235,190,0.25)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,rgba(180,200,255,0.08)_0%,transparent_60%)] blur-2xl opacity-80 transition-opacity duration-500"
      />

      {/* 头像区域 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 relative group"
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-stone-200 to-amber-200/50 dark:from-stone-800 dark:to-stone-700 shadow-md">
          <div className="w-full h-full rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center font-serif text-2xl font-bold select-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <span>P</span>
          </div>
          {/* 在线状态绿点 */}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900 shadow-sm" />
        </div>
      </motion.div>

      {/* Innei 标志性主标题排版 */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-2xl sm:text-4xl lg:text-[2.6rem] font-normal leading-relaxed text-stone-900 dark:text-stone-100 tracking-tight"
      >
        <span className="font-light opacity-80">Hi, I&apos;m </span>
        <span className="font-semibold text-amber-800 dark:text-amber-400 tracking-tight transition-colors">
          Perimsx
        </span>
        <span className="inline-block transform -rotate-6 translate-y-[-2px] ml-1">
          👋
        </span>
        <br className="hidden sm:inline" />
        <span className="font-light opacity-75 sm:ml-2">I explore </span>
        <span className="font-medium italic text-amber-800 dark:text-amber-400">
          binary security
        </span>
        <span className="font-light opacity-75"> &amp; systems with </span>
        <span className="inline-block mx-1 text-amber-700 dark:text-amber-400 text-[0.8em] align-middle animate-[aiTwinkle_2.4s_ease-in-out_infinite]">
          ✦
        </span>
        <code className="inline-flex items-center font-mono text-[0.65em] font-semibold px-2.5 py-1 rounded-full text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm align-middle">
          C &bull; Python &bull; React 19
        </code>
        <span className="inline-block w-[2px] h-[0.85em] bg-amber-700 dark:bg-amber-400 ml-1.5 align-middle rounded-full animate-[blink_1.2s_linear_infinite]" />
      </motion.h1>

      {/* 副标题 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-2xl text-xs sm:text-sm uppercase tracking-[1.5px] text-stone-500 dark:text-stone-400 font-sans"
      >
        An info-sec student exploring memory safety, reverse engineering &amp; craft interfaces.
      </motion.p>

      {/* 哲思引用与数据指标 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <div className="max-w-[65ch] mx-auto font-serif text-xs sm:text-sm italic text-stone-500 dark:text-stone-400">
          「当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。」
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-mono text-stone-400 dark:text-stone-500">
          <span>4 篇文稿</span>
          <span>&bull;</span>
          <span>1.8 万字</span>
          <span>&bull;</span>
          <span>2026 序栈</span>
        </div>
      </motion.div>

      {/* 社交链接图标胶囊 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 flex flex-wrap justify-center items-center gap-2"
      >
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <a
              key={social.name}
              href={social.href}
              target={social.href.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              aria-label={social.name}
              className="flex items-center justify-center w-9 h-9 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-all duration-200 focus-visible:outline-none"
              title={social.name}
            >
              <Icon className="w-4 h-4" />
            </a>
          );
        })}
      </motion.div>
    </section>
  );
};
