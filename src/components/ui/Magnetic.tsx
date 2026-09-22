import React, { useRef, useState, useCallback, useEffect } from 'react';

interface MagneticProps {
  children: React.ReactNode;
  /**
   * 最大微磁偏移像素（默认 2.5px，克制在 1~3px 黄金微动区间）
   */
  strength?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * 物理微磁悬停交互组件 (Magnetic Hover)
 * 鼠标靠近时产生 1~3px 的微弱物理吸附偏移，并在移开时光滑弹簧归位
 */
export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 2.5,
  className = '',
  disabled = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || isTouchDevice || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // 归一化并乘上最大偏移量（1~3px）
      const maxDistance = Math.max(rect.width, rect.height) / 2;
      const factorX = Math.max(-1, Math.min(1, distanceX / maxDistance));
      const factorY = Math.max(-1, Math.min(1, distanceY / maxDistance));

      setPosition({
        x: Number((factorX * strength).toFixed(2)),
        y: Number((factorY * strength).toFixed(2)),
      });
      setIsHovered(true);
    },
    [disabled, isTouchDevice, strength]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  if (disabled || isTouchDevice) {
    return <div className={`inline-flex ${className}`}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center ${className}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isHovered
          ? 'transform 0.12s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isHovered ? 'transform' : 'auto',
      }}
    >
      {children}
    </div>
  );
};
