/**
 * GradientText — 动态渐变文字
 * 基于 react-bits (https://reactbits.dev) GradientText 组件
 * 适配 TypeScript + motion/react，内联样式替代 CSS 文件
 */
import React, { useState, useRef } from 'react';
import { useMotionValue, useAnimationFrame } from 'motion/react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: 'horizontal' | 'diagonal';
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#38bdf8', '#818cf8', '#a78bfa', '#38bdf8'],
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
}) => {
  const [isPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += dt;

    const fullCycle = animationDuration * 2;
    const cycleTime = elapsedRef.current % fullCycle;
    if (cycleTime < animationDuration) {
      progress.set(cycleTime / animationDuration);
    } else {
      progress.set(1 - (cycleTime - animationDuration) / animationDuration);
    }
  });

  const gradientStops = colors
    .map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`)
    .join(', ');

  const angle = direction === 'diagonal' ? '135deg' : '90deg';
  const bgSize = direction === 'diagonal' ? '300% 300%' : '300% 100%';

  return (
    <span
      className={`relative inline-block ${className}`}
      style={{
        background: `linear-gradient(${angle}, ${gradientStops})`,
        backgroundSize: bgSize,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `gradientShift ${animationSpeed}s ease-in-out infinite alternate`,
        ...(showBorder
          ? {
              borderRadius: '0.5em',
              padding: '0 0.3em',
              border: '1px solid transparent',
              borderImage: `linear-gradient(${angle}, ${gradientStops}) 1`,
            }
          : {}),
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
      {children}
    </span>
  );
};

export default GradientText;
