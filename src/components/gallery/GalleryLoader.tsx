import React from 'react';
import { PageLoader } from '../ui/PageLoader';
import { siteConfig } from '../../content';

export interface GalleryLoaderProps {
  onLoaded?: () => void;
  minDuration?: number;
  maxWait?: number;
  previewImages?: string[];
  className?: string;
}

export const GalleryLoader: React.FC<GalleryLoaderProps> = ({
  onLoaded,
  minDuration = 850,
  maxWait = 2400,
  previewImages = [],
  className,
}) => {
  const authorName = siteConfig.author?.name || '数字';

  return (
    <PageLoader
      title={`${authorName} 画廊展厅`}
      startMsg="凝固瞬息光影 · 正在展开画卷"
      middleMsg="采撷胜境色彩 · 即将揭幕"
      readyMsg="展厅已就绪 · 即刻呈现"
      onLoaded={onLoaded}
      minDuration={minDuration}
      maxWait={maxWait}
      previewImages={previewImages}
      className={className}
    />
  );
};

export default GalleryLoader;
