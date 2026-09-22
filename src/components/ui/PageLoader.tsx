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
  minDuration = 480,
  maxWait = 1400,
  previewImages = [],
  className = '',
}) => {
  const { isDark } = useTheme();
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(12);

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
    siteConfig.author?.avatar || '/avatar.png';

  const displayTitle = useMemo(() => {
    if (title) return title;
    return `${siteConfig.author?.name || '序栈'} · 空间漫游`;
  }, [title]);

  useEffect(() => {
    let isDisposed = false;
    let rafId: number;
    let readyToComplete = false;
    let exitTimer: NodeJS.Timeout;
    let finishTimer: NodeJS.Timeout;

    const startTime = performance.now();
    let currentVal = 12;

    // 高帧率连续有机插值动力学循环，彻底告别 setInterval 离散跳步与残影
    const tick = (now: number) => {
      if (isDisposed) return;
      const elapsed = now - startTime;

      if (!readyToComplete) {
        // 巡航期：平滑流体三次幂阻尼曲线推进至 86%，随时间自然减速
        const normalized = Math.min(1, elapsed / (minDurationRef.current * 1.35));
        const targetCruise = 12 + 74 * (1 - Math.pow(1 - normalized, 2.2));

        // 丝滑微插值，高刷屏下每帧平滑位移
        currentVal += (targetCruise - currentVal) * 0.12;
        setProgress(Math.round(currentVal));

        rafId = requestAnimationFrame(tick);
      } else {
        // 冲刺与收束期：收到就绪信号后，从当前点平滑冲向 100%，绝不突变跳满
        const remaining = 100 - currentVal;
        if (remaining > 0.4) {
          const step = Math.max(1.2, remaining * 0.18);
          currentVal = Math.min(100, currentVal + step);
          setProgress(Math.round(currentVal));
          rafId = requestAnimationFrame(tick);
        } else {
          currentVal = 100;
          setProgress(100);

          // 100% 满月微闭环驻留 140ms，随之优雅揭幕
          finishTimer = setTimeout(() => {
            if (isDisposed) return;
            setIsExiting(true);
            exitTimer = setTimeout(() => {
              if (!isDisposed) {
                onLoadedRef.current?.();
              }
            }, 450);
          }, 140);
        }
      }
    };

    rafId = requestAnimationFrame(tick);

    // 预加载首屏静态图片与最低时长竞态
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

    const markReady = () => {
      if (!isDisposed) {
        readyToComplete = true;
      }
    };

    Promise.race([
      Promise.all([...imagePromises, minDelayPromise]),
      maxTimeoutPromise,
    ])
      .then(markReady)
      .catch(markReady);

    // 硬超时强制收束
    const forceTimer = setTimeout(markReady, maxWaitRef.current);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      clearTimeout(forceTimer);
    };
  }, []);

  // 动态阶段文案
  const statusNote =
    progress >= 100
      ? readyMsg
      : progress >= 75
      ? middleMsg
      : startMsg;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]/96 dark:bg-[#080D1A]/96 backdrop-blur-3xl backdrop-saturate-125 transition-all duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isExiting
          ? 'opacity-0 scale-[1.025] blur-xs pointer-events-none'
          : 'opacity-100 scale-100'
      } ${className}`}
      aria-busy={!isExiting}
      aria-label={displayTitle}
    >
      {/* 居中彗星流光加载仪表盘与中心头像 */}
      <div className="relative flex flex-col items-center justify-center">
        {/* 背景柔和引力微光晕 - 统一对齐 #00BFFF 品牌高亮色 */}
        <div className="absolute -inset-14 rounded-full bg-[#00BFFF]/20 dark:bg-[#00BFFF]/30 blur-3xl pointer-events-none animate-pulse" />

        <CometDial
          value={progress}
          size={208}
          sweep={310}
          thickness={5}
          speed={55}
          momentum={0.8}
          cometReach={170}
          cometWidth={11}
          tapBounce={0.04}
          flickBounce={0.05}
          accent={isDark ? '#00BFFF' : '#009FD6'}
          ink={isDark ? '#1e293b' : '#cbd5e1'}
          unit="%"
          disabled={true}
          statusText={statusNote ? (statusNote.includes('·') ? statusNote.split('·')[0].trim() : statusNote) : undefined}
          avatar={authorAvatar}
          avatarAlt={siteConfig.author?.name || '站长头像'}
          avatarFallback="/avatar.png"
          showFigure={true}
          className="filter drop-shadow-[0_4px_24px_rgba(0,191,255,0.28)] dark:drop-shadow-[0_4px_30px_rgba(0,191,255,0.40)]"
        />
      </div>
    </div>
  );
};

export default PageLoader;
