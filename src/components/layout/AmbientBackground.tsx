import React, { useEffect, useRef } from 'react';

interface SimpleRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  maxAlpha: number;
}

/**
 * 动态随和浅蓝背景组件
 * - Innei 余白美学背景与中心 Hero 椭圆呼吸流光
 * - 极简克制单层浅蓝纯净水波点击交互 (轻点即化、无多余粒子)
 */
export const AmbientBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<SimpleRipple[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let hasActive = false;
      const activeRipples: SimpleRipple[] = [];

      for (let i = 0; i < ripplesRef.current.length; i++) {
        const r = ripplesRef.current[i];
        // 平滑阻尼扩散
        r.radius += (r.maxRadius - r.radius) * 0.14 + 0.35;
        r.alpha *= 0.925;

        if (r.alpha > 0.008 && r.radius < r.maxRadius) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          
          // 极淡天青浅蓝水波边缘
          ctx.strokeStyle = `rgba(56, 189, 248, ${r.alpha})`;
          ctx.lineWidth = Math.max(0.4, 1.2 * (1 - r.radius / r.maxRadius));
          ctx.stroke();

          // 微弱内晕填充
          ctx.fillStyle = `rgba(56, 189, 248, ${r.alpha * 0.05})`;
          ctx.fill();
          ctx.restore();

          activeRipples.push(r);
          hasActive = true;
        }
      }

      ripplesRef.current = activeRipples;

      if (hasActive) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
      }
    };

    const startAnimation = () => {
      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // 每次点击仅生成 1 道极简纯净水晕，轻柔扩散后自然消散
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 55,
        alpha: 0.28,
        maxAlpha: 0.28,
      });

      startAnimation();
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none transition-colors duration-500"
    >
      {/* 浅蓝顶层基底微妙渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAF4FC] via-[#F2F7FC] to-[#F6F8FB] dark:from-[#0B1830] dark:via-[#070D18] dark:to-[#080D16]" />

      {/* 暗色模式星空层：静态星点避免额外渲染与随机状态 */}
      <div className="ambient-stars absolute inset-0 opacity-0 dark:opacity-50" />
      <div className="ambient-star-dust absolute inset-0 opacity-0 dark:opacity-25" />

      {/* Innei 标志性核心: 中心 Hero 大椭圆呼吸光晕 */}
      <div
        className="absolute -top-[6%] left-1/2 w-[340px] sm:w-[680px] lg:w-[860px] h-[340px] sm:h-[580px] lg:h-[680px] rounded-[100%] opacity-80 dark:opacity-40 blur-[80px] sm:blur-[120px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 205, 255, 0.55) 0%, rgba(147, 197, 253, 0.24) 45%, rgba(224, 242, 254, 0.08) 70%, transparent 80%)',
          animation: 'inneiBreathGlow 14s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />

      {/* 动态光晕光斑 2: 清透冰川青蓝 (左下随和流动) */}
      <div
        className="absolute top-[38%] -left-[12%] w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full opacity-50 dark:opacity-25 blur-[90px] sm:blur-[130px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(133, 225, 214, 0.42) 0%, rgba(191, 219, 254, 0.18) 50%, transparent 75%)',
          animation: 'ambientDriftB 28s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 动态光晕光斑 3: 浅天青雾蓝 (右下柔和浮动) */}
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[460px] sm:w-[650px] h-[460px] sm:h-[650px] rounded-full opacity-45 dark:opacity-20 blur-[90px] sm:blur-[130px] transition-all duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(148, 181, 255, 0.34) 0%, rgba(224, 231, 255, 0.14) 50%, transparent 75%)',
          animation: 'inneiSubtleDrift 22s ease-in-out infinite',
          willChange: 'transform',
        }}
      />

      {/* 动态光晕光斑 4: 暗色模式极光深青深蓝补充 */}
      <div
        className="hidden dark:block absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-[100%] opacity-25 blur-[120px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.45) 0%, rgba(59, 130, 246, 0.2) 55%, transparent 75%)',
          animation: 'inneiBreathGlow 16s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* 细腻微点网格遮罩，增添纸质与余白层次 */}
      <div className="absolute inset-0 bg-paper-texture opacity-65 dark:opacity-45" />

      {/* 极简克制单层水波 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
};
