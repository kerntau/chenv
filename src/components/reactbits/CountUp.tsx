/**
 * CountUp — 数字递增动画
 * 基于 react-bits (https://reactbits.dev) CountUp 组件
 * 适配 TypeScript + motion/react
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  suffix?: string;
  prefix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  suffix = '',
  prefix = '',
  onStart,
  onEnd,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number) => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatNumber = useCallback(
    (num: number) => {
      const fixed = num.toFixed(maxDecimals);
      if (!separator) return `${prefix}${fixed}${suffix}`;
      const [int, dec] = fixed.split('.');
      const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
      return `${prefix}${dec ? `${formatted}.${dec}` : formatted}${suffix}`;
    },
    [maxDecimals, separator, prefix, suffix]
  );

  useEffect(() => {
    if (!isInView || !startWhen) return;

    const timeout = setTimeout(() => {
      onStart?.();
      motionValue.set(direction === 'down' ? from : to);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, startWhen, delay, motionValue, direction, from, to, onStart]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = formatNumber(latest);
      }
    });

    const checkEnd = springValue.on('change', (latest) => {
      const target = direction === 'down' ? from : to;
      if (Math.abs(latest - target) < 0.01) {
        onEnd?.();
        checkEnd();
      }
    });

    return () => {
      unsubscribe();
      checkEnd();
    };
  }, [springValue, formatNumber, direction, from, to, onEnd]);

  return (
    <span ref={ref} className={className}>
      {formatNumber(from)}
    </span>
  );
};

export default CountUp;
