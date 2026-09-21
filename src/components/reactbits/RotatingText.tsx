/**
 * RotatingText — 旋转切换文字
 * 基于 react-bits (https://reactbits.dev) RotatingText 组件
 * 适配 TypeScript + motion/react
 */
import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface RotatingTextProps {
  texts: string[];
  className?: string;
  interval?: number;
  direction?: 'up' | 'down';
}

const RotatingText: React.FC<RotatingTextProps> = ({
  texts,
  className = '',
  interval = 3000,
  direction = 'up',
}) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  const yOffset = direction === 'up' ? 20 : -20;

  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={texts[index]}
          initial={{ y: yOffset, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -yOffset, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'inline-block' }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default RotatingText;
