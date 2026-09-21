import React, { useEffect, useState, useMemo, useRef } from 'react';
import { CometDial } from './CometDial';
import { useTheme } from '../../hooks/useTheme';
import { siteConfig } from '../../content';

export interface PageLoaderProps {
  /** 仪表盘下方展示的主标题 */
  title?: string;
  /** 初始阶段文案 (progress < 75) */
  startMsg?: string;
  /** 中期冲刺阶段文案 (75 <= progress < 100) */
  middleMsg?: string;
  /** 完成阶段文案 (progress >= 100) */
  readyMsg?: string;
  /** 动画与揭幕完毕后的回调 */
  onLoaded?: () => void;
  /** 最短视觉展示时间（毫秒），画廊页面约 1000ms，其他页面适中 400~460ms */
  minDuration?: number;
  /** 最大保底等待超时时间（毫秒），超时强制冲刺 100% 揭幕，杜绝转圈卡死 */
  maxWait?: number;
  /** 需预加载的首屏关键大图 */
  previewImages?: string[];
  /** 自定义外层样式 */
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  title,
  startMsg = '调取全站数据 · 正在加载核心脉络',
  middleMsg = '汇聚灵感思绪 · 即将为您揭幕',
  readyMsg = '界面已就绪 · 即刻呈现',
  onLoaded,
  minDuration = 420,
  maxWait = 1400,
  previewImages = [],
  className = '',
}) => {
  const { isDark } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(16);

  // 使用 Ref 固化回调与数组引用，严防因父级 re-render 产生的引用变动导致 effect 被异常取消
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const previewImagesRef = useRef(previewImages);
  previewImagesRef.current = previewImages;

  const minDurationRef = useRef(minDuration);
  minDurationRef.current = minDuration;

  const maxWaitRef = useRef(maxWait);
  maxWaitRef.current = maxWait;

  const authorAvatar =
    siteConfig.author?.avatar || 'https://q1.qlogo.cn/g?b=qq&nk=1722288011&s=640';

  const displayTitle = useMemo(() => {
    if (title) return title;
    return `${siteConfig.author?.name || '序栈'} · 空间漫游`;
  }, [title]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let exitTimer: NodeJS.Timeout;
    let forceDoneTimer: NodeJS.Timeout;
    let isDisposed = false;

    // 1. 起步迅捷推进到 28%
    const startTimer = setTimeout(() => {
      if (!isDisposed) setProgress(28);
    }, 30);

    // 2. 持续步进冲刺至 88%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) return prev;
        const jump = Math.floor(Math.random() * 14 + 10);
        return Math.min(88, prev + jump);
      });
    }, 80);

    // 3. 预加载图片增加单图超时兜底（画廊 1200ms，普通页面 400ms，绝不挂起）
    const isGalleryPreview = (previewImagesRef.current || []).length > 0;
    const perImageTimeout = isGalleryPreview ? 1200 : 400;

    const imagePromises = (previewImagesRef.current || []).map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        const fallbackTimer = setTimeout(resolve, perImageTimeout);
        img.onload = () => {
          clearTimeout(fallbackTimer);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(fallbackTimer);
          resolve();
        };
        img.src = src;
      });
    });

    const minDelayPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, minDurationRef.current);
    });

    const maxTimeoutPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, maxWaitRef.current);
    });

    const completeAndReveal = () => {
      if (isDisposed) return;
      clearInterval(progressInterval);
      setProgress(100);

      // 展示 100% 闭环流光，随后优雅淡出揭幕
      timer = setTimeout(() => {
        if (isDisposed) return;
        setIsExiting(true);
        exitTimer = setTimeout(() => {
          if (!isDisposed) {
            onLoadedRef.current?.();
          }
        }, 500);
      }, 180);
    };

    // 资源就绪与最短延时竞态
    Promise.race([
      Promise.all([...imagePromises, minDelayPromise]),
      maxTimeoutPromise,
    ])
      .then(completeAndReveal)
      .catch(completeAndReveal);

    // 极端异常硬保底：超过最大时间强制完成
    forceDoneTimer = setTimeout(completeAndReveal, maxWaitRef.current + 250);

    return () => {
      isDisposed = true;
      clearTimeout(startTimer);
      clearInterval(progressInterval);
      clearTimeout(timer);
      clearTimeout(exitTimer);
      clearTimeout(forceDoneTimer);
    };
  }, []); // 仅在挂载时启动一次确定的加载流，绝不受外部 props 重新生成的引用打扰

  // 动态阶段文案
  const statusNote =
    progress >= 100
      ? readyMsg
      : progress >= 75
      ? middleMsg
      : startMsg;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]/96 dark:bg-[#080D1A]/96 backdrop-blur-3xl backdrop-saturate-150 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isExiting
          ? 'opacity-0 scale-[1.03] blur-sm pointer-events-none'
          : 'opacity-100 scale-100'
      } ${className}`}
      aria-busy={!isExiting}
      aria-label={displayTitle}
    >
      {/* 居中彗星流光加载仪表盘与中心头像 */}
      <div className="relative flex flex-col items-center justify-center">
        {/* 背景柔和引力微光晕 */}
        <div className="absolute -inset-14 rounded-full bg-sky-400/20 dark:bg-sky-500/35 blur-3xl pointer-events-none animate-pulse" />

        <CometDial
          value={progress}
          size={208}
          sweep={310}
          thickness={5}
          speed={52}
          momentum={1.1}
          cometReach={185}
          cometWidth={13}
          tapBounce={0.25}
          flickBounce={0.15}
          accent={isDark ? '#38bdf8' : '#0284c7'}
          ink={isDark ? '#1e293b' : '#cbd5e1'}
          unit="%"
          disabled={true}
          statusText={statusNote ? (statusNote.includes('·') ? statusNote.split('·')[0].trim() : statusNote) : undefined}
          avatar={authorAvatar}
          avatarAlt={siteConfig.author?.name || '站长头像'}
          avatarFallback="/avatar.jpg"
          showFigure={true}
          className="filter drop-shadow-[0_4px_24px_rgba(56,189,248,0.25)] dark:drop-shadow-[0_4px_30px_rgba(56,189,248,0.35)]"
        />
      </div>
    </div>
  );
};

export default PageLoader;
