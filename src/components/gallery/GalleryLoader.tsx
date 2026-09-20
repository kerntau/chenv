import React, { useEffect, useState } from 'react';
import { CometDial } from '../ui/CometDial';
import { useTheme } from '../../hooks/useTheme';
import { siteConfig } from '../../content';

interface GalleryLoaderProps {
  onLoaded?: () => void;
  minDuration?: number;
  maxWait?: number;
  previewImages?: string[];
}

export const GalleryLoader: React.FC<GalleryLoaderProps> = ({
  onLoaded,
  minDuration = 900,
  maxWait = 2400,
  previewImages = [],
}) => {
  const { isDark } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  const authorAvatar =
    siteConfig.author?.avatar || 'https://q1.qlogo.cn/g?b=qq&nk=1722288011&s=640';

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // 起步平滑起量
    const startTimer = setTimeout(() => {
      setProgress(24);
    }, 50);

    // 渐进式彗星冲刺模拟
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const jump = Math.floor(Math.random() * 16 + 10);
        return Math.min(88, prev + jump);
      });
    }, 160);

    // 预加载首屏核心大图
    const preloadPromises = previewImages.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    const minDelayPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, minDuration);
    });

    const maxTimeoutPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, maxWait);
    });

    // 满足首屏资源就绪与最短视觉呈现后，冲刺至 100% 并优雅揭幕
    Promise.race([
      Promise.all([...preloadPromises, minDelayPromise]),
      maxTimeoutPromise,
    ]).then(() => {
      clearInterval(progressInterval);
      setProgress(100);

      // 展示 100% 达成与流光闭合，随即平滑淡出揭幕
      timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onLoaded?.();
        }, 650);
      }, 340);
    });

    return () => {
      clearTimeout(startTimer);
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [minDuration, maxWait, previewImages, onLoaded]);

  // 动态阶段文案
  const statusNote =
    progress >= 100
      ? '展厅已就绪 · 即刻呈现'
      : progress >= 75
      ? '采撷胜境色彩 · 即将揭幕'
      : '凝固瞬息光影 · 正在展开画卷';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]/88 dark:bg-[#080D1A]/92 backdrop-blur-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isExiting
          ? 'opacity-0 scale-[1.04] blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 居中彗星流光加载仪表盘与中心头像 */}
      <div className="relative flex flex-col items-center justify-center">
        {/* 背景柔和引力微光晕 */}
        <div className="absolute -inset-10 rounded-full bg-sky-400/15 dark:bg-sky-500/20 blur-3xl pointer-events-none animate-pulse" />

        <CometDial
          value={progress}
          size={208}
          sweep={310}
          thickness={5}
          speed={48}
          momentum={1.1}
          cometReach={185}
          cometWidth={13}
          tapBounce={0.25}
          flickBounce={0.15}
          accent={isDark ? '#38bdf8' : '#0284c7'}
          ink={isDark ? '#475569' : '#cbd5e1'}
          unit="%"
          disabled={true}
          avatar={authorAvatar}
          avatarAlt={siteConfig.author?.name || '站长头像'}
          avatarFallback="/avatar.jpg"
          showFigure={true}
          className="filter drop-shadow-[0_4px_24px_rgba(56,189,248,0.22)]"
        />

        {/* 展厅仪式感文案 */}
        <div className="text-center mt-7">
          <h3 className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-slate-800 dark:text-slate-100">
            {siteConfig.author?.name || '数字'} 画廊展厅
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 tracking-widest font-mono opacity-80 transition-all duration-300">
            {statusNote}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GalleryLoader;
