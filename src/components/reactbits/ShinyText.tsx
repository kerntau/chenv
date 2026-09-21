/**
 * ShinyText — 闪光文字动画
 * 基于 react-bits (https://reactbits.dev) ShinyText 组件
 * 纯 CSS 动画，零依赖
 */
import React from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className = '',
  speed = 3,
  disabled = false,
}) => {
  return (
    <>
      <style>{`
        @keyframes shinyTextShine {
          0% { background-position: 100% 50%; }
          100% { background-position: -100% 50%; }
        }
      `}</style>
      <span
        className={className}
        style={{
          display: 'inline-block',
          background: disabled
            ? 'inherit'
            : 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 60%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: disabled ? undefined : 'text',
          backgroundClip: disabled ? undefined : 'text',
          color: 'inherit',
          animation: disabled ? 'none' : `shinyTextShine ${speed}s linear infinite`,
        }}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
