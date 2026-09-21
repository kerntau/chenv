/**
 * GlitchText — 故障风文字效果
 * 基于 react-bits (https://reactbits.dev) GlitchText 组件
 * 纯 CSS 动画实现
 */
import React from 'react';

interface GlitchTextProps {
  children: string;
  className?: string;
  speed?: number;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  children,
  className = '',
  speed = 0.7,
}) => {
  return (
    <>
      <style>{`
        .glitch-wrapper { position: relative; display: inline-block; }
        .glitch-text { position: relative; }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        .glitch-text::before {
          color: #ff00ff;
          animation: glitch-shift-1 ${speed}s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
        }
        .glitch-text::after {
          color: #00ffff;
          animation: glitch-shift-2 ${speed * 0.8}s infinite linear alternate-reverse;
          clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
        }
        @keyframes glitch-shift-1 {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -2px); }
          80% { transform: translate(2px, 1px); }
          100% { transform: translate(0); }
        }
        @keyframes glitch-shift-2 {
          0% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(-2px, 1px); }
          60% { transform: translate(1px, 2px); }
          80% { transform: translate(-2px, -1px); }
          100% { transform: translate(0); }
        }
      `}</style>
      <span className={`glitch-wrapper ${className}`}>
        <span className="glitch-text" data-text={children}>
          {children}
        </span>
      </span>
    </>
  );
};

export default GlitchText;
