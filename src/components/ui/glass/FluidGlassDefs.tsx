import React from 'react';

/**
 * 全局流体玻璃光学滤镜系统 (Fluid Glass Optical System)
 * - 注入标准 SVG 滤镜链：模拟真实 IOR 折射、微距厚度色散 (Chromatic Aberration) 与透射流体扰动
 * - 零 DOM 占位，纯 GPU 矢量计算
 * - 提供标准版 (fluid-glass-disp) 与极微版 (fluid-glass-subtle) 供各级玻璃材质与文字容器按需使用
 */
export const FluidGlassDefs: React.FC = () => {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <defs>
        {/* 标准流体玻璃折射与微色散滤镜 */}
        <filter
          id="fluid-glass-disp"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          {/* 低频有机流体噪声生成基底 */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.012"
            numOctaves={2}
            seed={42}
            result="noise"
          />

          {/* 红色通道轻微正向位移 */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={2.2}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispR"
          />
          <feColorMatrix
            in="dispR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />

          {/* 绿色通道基准位移 */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={1.3}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispG"
          />
          <feColorMatrix
            in="dispG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />

          {/* 蓝色通道轻微负向位移 */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={0.5}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispB"
          />
          <feColorMatrix
            in="dispB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />

          {/* Screen 模式无损混色还原 */}
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="final" />
        </filter>

        {/* 极微流体折射滤镜（针对密集正文与小尺寸按钮，保障 100% 锐利可读性） */}
        <filter
          id="fluid-glass-subtle"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.015"
            numOctaves={1}
            seed={7}
            result="subtleNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="subtleNoise"
            scale={1.0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};
