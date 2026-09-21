/**
 * DecryptedText — 文字解密揭示动画
 * 基于 react-bits (https://reactbits.dev) DecryptedText 组件
 * 适配 TypeScript + motion/react
 */
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'click';
  style?: React.CSSProperties;
}

const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  style,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);

  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iterationsRef = useRef(0);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter((c) => c !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const getShuffled = useCallback(
    (originalText: string, revealed: Set<number>) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (revealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const getRevealOrder = useCallback(
    (len: number) => {
      const order: number[] = [];
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
      } else if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
      } else {
        const mid = Math.floor(len / 2);
        let offset = 0;
        while (order.length < len) {
          const right = mid + Math.floor((offset + 1) / 2);
          const left = mid - Math.ceil(offset / 2);
          if (offset % 2 === 0 && right < len) order.push(right);
          else if (left >= 0) order.push(left);
          offset++;
        }
      }
      return order;
    },
    [revealDirection]
  );

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    iterationsRef.current = 0;
    const revealed = new Set<number>();
    const order = getRevealOrder(text.length);
    let pointer = 0;

    intervalRef.current = setInterval(() => {
      iterationsRef.current++;

      if (sequential) {
        if (pointer < order.length) {
          const idx = order[pointer];
          if (text[idx] !== ' ') {
            revealed.add(idx);
            pointer++;
          } else {
            pointer++;
          }
        }
      }

      if (
        iterationsRef.current >= maxIterations ||
        (sequential && pointer >= order.length)
      ) {
        // 全部揭示
        const allRevealed = new Set<number>();
        for (let i = 0; i < text.length; i++) allRevealed.add(i);
        setRevealedIndices(allRevealed);
        setDisplayText(text);
        setIsAnimating(false);
        setHasAnimated(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      setDisplayText(getShuffled(text, revealed));
      setRevealedIndices(new Set(revealed));
    }, speed);
  }, [isAnimating, text, speed, maxIterations, sequential, getShuffled, getRevealOrder]);

  // 视口进入自动触发
  useEffect(() => {
    if (animateOn !== 'view') return;
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          startAnimation();
          observer.unobserve(containerRef.current!);
        }
      },
      { threshold: 0.1, rootMargin: '0px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, startAnimation]);

  const handleHover = () => {
    if (animateOn === 'hover' && !isAnimating) startAnimation();
  };

  const handleClick = () => {
    if (animateOn === 'click' && !isAnimating) startAnimation();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.span
      ref={containerRef}
      className={parentClassName}
      onMouseEnter={handleHover}
      onClick={handleClick}
      aria-label={text}
      style={{ display: 'inline-block', whiteSpace: 'pre-wrap', ...style }}
    >
      {displayText.split('').map((char, i) => {
        const isRevealed = revealedIndices.has(i);
        return (
          <span
            key={i}
            className={isRevealed ? className : `${className} ${encryptedClassName}`}
          >
            {char}
          </span>
        );
      })}
    </motion.span>
  );
};

export default DecryptedText;
