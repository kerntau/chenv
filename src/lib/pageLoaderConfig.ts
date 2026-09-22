import { siteConfig, getGalleryConfig } from '../content';

export interface PageLoaderMeta {
  title: string;
  startMsg: string;
  middleMsg: string;
  readyMsg: string;
  minDuration: number;
  maxWait?: number;
  previewImages?: string[];
}

/**
 * 根据当前访问的 pathname 返回页面对应的流光加载器专属文案与元数据
 * 规则：画廊保持沉浸仪式感（1000ms），其他页面保持适中自然（400ms~460ms）
 */
export function getPageLoaderConfig(pathname: string): PageLoaderMeta {
  const authorName = siteConfig.author?.name || '站长';
  const siteTitle = siteConfig.title || '序栈';

  // 1. 首页 (适中 420ms)
  if (pathname === '/' || pathname === '') {
    return {
      title: `${siteTitle} · 个人主页`,
      startMsg: '连接赛博时空 · 正在加载全景与核心图谱',
      middleMsg: '节点就绪 · 灵感与思考即将展开',
      readyMsg: `链路已通 · 欢迎访问 ${siteTitle}`,
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 2. 归档时间轴 (适中 420ms)
  if (
    pathname === '/archives' ||
    pathname.startsWith('/archives/') ||
    pathname === '/timeline' ||
    pathname === '/archive'
  ) {
    return {
      title: '时光归档 · 岁月脉络',
      startMsg: '回溯时光河流 · 正在织造年轮索引',
      middleMsg: '整理岁月印记 · 即将呈现光阴篇章',
      readyMsg: '卷轴已展 · 慢溯时光轨迹',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 3. 手记详情 (适中 460ms，兼顾排版文字渲染就绪)
  const isDiaryDetail =
    (pathname.startsWith('/diaries/') && pathname !== '/diaries/') ||
    (pathname.startsWith('/journal/') && pathname !== '/journal/') ||
    (pathname.startsWith('/shouji/') && pathname !== '/shouji/');

  if (isDiaryDetail) {
    return {
      title: '手记篇章 · 深度阅读',
      startMsg: '舒展排版纸墨 · 正在装订文字篇章',
      middleMsg: '凝练思考脉络 · 即将呈献正文',
      readyMsg: '篇章就绪 · 开启沉浸阅读',
      minDuration: 460,
      maxWait: 1300,
    };
  }

  // 4. 手记列表 (适中 420ms)
  if (
    pathname === '/diaries' ||
    pathname === '/journal' ||
    pathname === '/shouji'
  ) {
    return {
      title: '随想手记 · 文字花园',
      startMsg: '拾取吉光片羽 · 正在载入思考手稿',
      middleMsg: '墨韵流动漫延 · 即将揭示心绪切片',
      readyMsg: '手稿已就绪 · 静心阅读',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 5. 日常说说 (适中 420ms)
  if (
    pathname === '/says' ||
    pathname.startsWith('/says/') ||
    pathname === '/record' ||
    pathname.startsWith('/record/')
  ) {
    return {
      title: '日常说说 · 微语浮光',
      startMsg: '漫游思绪碎片 · 正在捕获瞬息灵感',
      middleMsg: '灵光闪现共鸣 · 即将连接当下记录',
      readyMsg: '思绪已锚定 · 欢迎浏览',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 6. 在追国漫 (仪式感 650ms，预加载国漫海报)
  if (
    pathname === '/gallery' ||
    pathname.startsWith('/gallery/') ||
    pathname === '/bangumi' ||
    pathname.startsWith('/bangumi/') ||
    pathname === '/anime' ||
    pathname.startsWith('/anime/') ||
    pathname === '/photos' ||
    pathname === '/wall'
  ) {
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
      title: `${authorName} · 在追国漫`,
      startMsg: '漫游修仙幻境 · 正在展开画卷',
      middleMsg: '采撷热血国创 · 即将揭幕',
      readyMsg: '漫界已就绪 · 即刻呈现',
      minDuration: 650,
      maxWait: 2000,
      previewImages,
    };
  }

  // 7. 友人链接 (适中 420ms)
  if (
    pathname === '/friends' ||
    pathname.startsWith('/friends/') ||
    pathname === '/friend' ||
    pathname.startsWith('/friend/')
  ) {
    return {
      title: '志同道合 · 友人林苑',
      startMsg: '穿梭数字星海 · 正在寻觅知己航标',
      middleMsg: '山海相逢互鸣 · 即将开启灵感共振',
      readyMsg: '星标已连接 · 欢迎造访朋友们',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 8. 关于作者 (适中 420ms)
  if (
    pathname === '/about' ||
    pathname.startsWith('/about/') ||
    pathname === '/me' ||
    pathname.startsWith('/me/')
  ) {
    return {
      title: `关于作者 · 赛博筑基`,
      startMsg: '调取档案数据 · 正在解析技术栈与筑基哲学',
      middleMsg: '梳理工程师图谱 · 即将展示完整画卷',
      readyMsg: '档案已解锁 · 很高兴认识你',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 9. 站点地图 (适中 420ms)
  if (pathname === '/sitemap' || pathname.startsWith('/sitemap/')) {
    return {
      title: '全站索隐 · 架构导览',
      startMsg: '测绘全域脉络 · 正在绘制全站拓扑图',
      middleMsg: '梳理航道索引 · 即将展现星罗棋布',
      readyMsg: '罗盘已标定 · 自由漫游全站',
      minDuration: 420,
      maxWait: 1200,
    };
  }

  // 10. 404 / 默认兜底 (适中 380ms)
  return {
    title: '虚空深处 · 探索坐标',
    startMsg: '扫描迷雾时空 · 正在校准未明航向',
    middleMsg: '探测终点边界 · 正在回传坐标信标',
    readyMsg: '探测完成 · 纸页未至此处',
    minDuration: 380,
    maxWait: 1000,
  };
}
