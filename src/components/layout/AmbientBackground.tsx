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
      // 每次点击生成 1 道极轻淡天青纯净水晕，轻柔扩散后自然消散
      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 48,
        alpha: 0.22,
        maxAlpha: 0.22,
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
      {/* 柔和淡天蓝纯净基底渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EDF5FD] via-[#F4F8FC] to-[#F7F9FC] dark:from-[#0B121D] dark:via-[#080D15] dark:to-[#070B12]" />

      {/* 顶部微蓝柔光穹顶：居中大尺寸高斯漫射微光，超舒缓 22s 呼吸阻尼 */}
      <div
        className="absolute -top-[10%] left-1/2 w-[420px] sm:w-[780px] lg:w-[980px] h-[360px] sm:h-[520px] lg:h-[620px] rounded-[100%] opacity-70 dark:opacity-30 blur-[100px] sm:blur-[140px] transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(160, 215, 255, 0.38) 0%, rgba(186, 230, 253, 0.16) 45%, rgba(224, 242, 254, 0.05) 70%, transparent 80%)',
          animation: 'inneiBreathGlow 22s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />

      {/* 暗色模式专属深海柔蓝微光漫射（极低对比度，消除刺眼光感） */}
      <div
        className="hidden dark:block absolute -top-[8%] left-1/2 w-[700px] lg:w-[900px] h-[480px] rounded-[100%] opacity-25 blur-[130px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56, 130, 210, 0.28) 0%, rgba(30, 64, 115, 0.14) 50%, transparent 75%)',
          animation: 'inneiBreathGlow 24s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      {/* 极细腻微点网格遮罩，赋予纸张触感 */}
      <div className="absolute inset-0 bg-paper-texture opacity-40 dark:opacity-20" />

      {/* 极简克制单层水波 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
    </div>
  );
};
