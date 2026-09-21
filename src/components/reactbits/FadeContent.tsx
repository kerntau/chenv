/**
 * FadeContent — 通用滚动渐入动画包装器
 * 基于 react-bits (https://reactbits.dev) FadeContent / AnimatedContent
 * 适配 TypeScript + motion/react
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface FadeContentProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  delay?: number;
  threshold?: number;
  rootMargin?: string;
  blur?: boolean;
  blurAmount?: number;
  easing?: [number, number, number, number] | string;
  once?: boolean;
  scale?: number;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  className = '',
  direction = 'up',
  distance = 30,
  duration = 0.6,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  blur = false,
  blurAmount = 6,
  easing = [0.25, 0.1, 0.25, 1],
  once = true,
  scale = 1,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(ref.current!);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale,
        ...(blur ? { filter: `blur(${blurAmount}px)` } : {}),
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              ...(blur ? { filter: 'blur(0px)' } : {}),
            }
          : {
              opacity: 0,
              x: offset.x,
              y: offset.y,
              scale,
              ...(blur ? { filter: `blur(${blurAmount}px)` } : {}),
            }
      }
      transition={{
        duration,
        delay,
        ease: easing as any,
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
