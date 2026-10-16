import { getGalleryConfig } from '../content';
import { findSectionByPath } from '../config/sections';
import type { PageLoaderMeta } from '../config/sections';

export type { PageLoaderMeta };

/**
 * 根据当前访问的 pathname 返回页面对应的流光加载器专属文案与元数据
 * 规则：基于中央频道注册表匹配，画廊保持沉浸仪式感（预加载国漫海报），手记详情保持深度阅读文案，其他频道使用统一注册配置。
 */
export function getPageLoaderConfig(pathname: string): PageLoaderMeta {
  const section = findSectionByPath(pathname);

  // 1. 手记详情页专属判断
  if (section?.hasDetail && pathname !== section.path && !section.aliases?.includes(pathname)) {
    return {
      title: '手记篇章 · 深度阅读',
      startMsg: '舒展排版纸墨 · 正在装订文字篇章',
      middleMsg: '凝练思考脉络 · 即将呈献正文',
      readyMsg: '篇章就绪 · 开启沉浸阅读',
      minDuration: 520,
      maxWait: 1300,
    };
  }

  // 2. 追漫沉浸画廊（预加载封面）
  if (section?.id === 'gallery') {
    let previewImages: string[] = [];
    try {
      const gConfig = getGalleryConfig();
      if (gConfig?.items && Array.isArray(gConfig.items)) {
        previewImages = gConfig.items.slice(0, 6).map((item) => item.image);
      }
    } catch {
      previewImages = [];
    }
    return {
      ...section.loader!,
      previewImages,
    };
  }

  // 3. 注册表中配置了 loader 的常规页面
  if (section?.loader) {
    return section.loader;
  }

  // 4. 404 / 默认兜底
  return {
    title: '虚空深处 · 探索坐标',
    startMsg: '扫描迷雾时空 · 正在校准未明航向',
    middleMsg: '探测终点边界 · 正在回传坐标信标',
    readyMsg: '探测完成 · 纸页未至此处',
    minDuration: 380,
    maxWait: 1000,
  };
}
