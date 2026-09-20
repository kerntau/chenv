import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';

export interface ClickSparkProps {
  /** 自定义火花颜色，缺省根据深浅色模式自动使用主题色 */
  sparkColor?: string;
  /** 火花线段长度 */
  sparkSize?: number;
  /** 火花扩散半径 */
  sparkRadius?: number;
  /** 单次点击散射火花数量 */
  sparkCount?: number;
  /** 动效持续时间（毫秒） */
  duration?: number;
  /** 缓动函数曲线 */
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  /** 额外缩放比率 */
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

export const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor,
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  easing = 'ease-out',
  extraScale = 1.0,
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const { isDark } = useTheme();

  // 主题色动态计算：深色模式冰蓝 Sky-400，浅色模式天蓝 Sky-600
  const activeThemeColor = sparkColor || (isDark ? '#38bdf8' : '#0284c7');
  const activeColorRef = useRef(activeThemeColor);
  activeColorRef.current = activeThemeColor;

  // 自适应视口尺寸与高分屏 DPR 处理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        case 'ease-out':
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  // 按需驱动渲染循环（无火花时自动停转，零空闲功耗）
  const startAnimation = useCallback(() => {
    if (animFrameIdRef.current !== null) return;

    const draw = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameIdRef.current = null;
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animFrameIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = spark.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      if (sparksRef.current.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(draw);
  }, [duration, easeFunc, extraScale, sparkRadius, sparkSize]);

  // 清理未完成的动画帧
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, []);

  const triggerSparks = useCallback(
    (clientX: number, clientY: number) => {
      const now = performance.now();
      const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        x: clientX,
        y: clientY,
        angle: (2 * Math.PI * i) / sparkCount,
        startTime: now,
        color: activeColorRef.current,
      }));

      sparksRef.current.push(...newSparks);
      startAnimation();
    },
    [sparkCount, startAnimation]
  );

  // 全局指针点击捕获，兼容长网页滚动与任意层级元素
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // 忽略次要按键（只响应鼠标左键或触控点击）
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      triggerSparks(e.clientX, e.clientY);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [triggerSparks]);

  return (
    <div className="relative w-full min-h-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[9999]"
      />
      {children}
    </div>
  );
};

export default ClickSpark;
