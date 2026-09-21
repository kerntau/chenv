import React, { useState, useEffect, useMemo } from 'react';
import { DriftWall } from '../components/ui/DriftWall';
import { getGalleryConfig } from '../content';
import { useTheme } from '../hooks/useTheme';

export const Gallery: React.FC = () => {
  const config = useMemo(() => getGalleryConfig(), []);
  const { isDark } = useTheme();

  // 视口尺寸响应式监听，动态优化 DriftWall 参数
  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layoutProps = useMemo(() => {
    // 根据当前视口宽度动态计算最佳整列数与自适应列宽，确保左右无空洞且卡片 100% 完整显示（绝不切边）
    let sidePadding = 16;
    let gap = 16;
    let targetColWidth = 220;
    let minCols = 3;

    if (windowWidth < 640) {
      sidePadding = 10;
      gap = 10;
      targetColWidth = 115;
      minCols = 3;
    } else if (windowWidth < 1024) {
      sidePadding = 14;
      gap = 12;
      targetColWidth = 175;
      minCols = 4;
    } else if (windowWidth >= 1600) {
      sidePadding = 20;
      gap = 18;
      targetColWidth = 230;
      minCols = 6;
    }

    const usableWidth = Math.max(280, windowWidth - sidePadding * 2);
    const columns = Math.max(minCols, Math.round((usableWidth + gap) / (targetColWidth + gap)));
    const tileWidth = Math.floor((usableWidth - (columns - 1) * gap) / columns);
    const tileHeight = Math.round(tileWidth * 0.65); // 优雅的黄金构图画幅比

    return {
      columns,
      tileWidth,
      tileHeight,
      gap,
      tilt: 0,
      turn: 0,
      depth: 0,
      scale: 1,
    };
  }, [windowWidth]);

  return (
    <div className="w-full h-full flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-transparent select-none">
      <DriftWall
        items={config.items}
        columns={layoutProps.columns}
        tileWidth={layoutProps.tileWidth}
        tileHeight={layoutProps.tileHeight}
        gap={layoutProps.gap}
        tilt={layoutProps.tilt}
        turn={layoutProps.turn}
        depth={layoutProps.depth}
        perspective={1200}
        scale={layoutProps.scale}
        speed={38}
        direction="up"
        variance={0.45}
        parallax={0}
        lift={0}
        fade={0.25}
        dim={isDark ? 0.78 : 0.9}
        overlayColor={isDark ? '#000000' : '#ffffff'}
        radius={14}
        roll={0}
        pauseOnHover={false}
        grayscale={false}
      />
    </div>
  );
};

export default Gallery;
