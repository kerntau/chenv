import React, { lazy } from 'react';
import { siteConfig } from '../content';
import type { NavLinkItem, FooterNavColumn } from '../types';
import rawSections from '../content/config/sections.json';

export interface PageLoaderMeta {
  title: string;
  startMsg: string;
  middleMsg: string;
  readyMsg: string;
  minDuration: number;
  maxWait?: number;
  previewImages?: string[];
}

export interface SectionRawItem {
  id: string;
  label: string;
  nameEn: string;
  path: string;
  aliases?: string[];
  icon: string;
  inHeader?: boolean;
  collapsedInMobile?: boolean;
  inFooter?: boolean;
  footerGroup?: '更多' | '联系';
  inSitemap?: boolean;
  isImmersive?: boolean;
  hasDetail?: boolean;
  popoverWidth?: number;
  desc?: string;
  sitemapCountKey?: 'diaries' | 'says' | 'friends';
  sitemapUnit?: string;
  priority?: string;
  changefreq?: string;
}

export interface SiteSection extends SectionRawItem {
  loader?: {
    title: string;
    startMsg: string;
    middleMsg: string;
    readyMsg: string;
    minDuration: number;
    maxWait?: number;
  };
  component: React.ComponentType<any>;
  detailComponent?: React.ComponentType<any>;
}

// 统一路由级组件懒加载映射表
const COMPONENT_MAP: Record<string, { component: React.ComponentType<any>; detailComponent?: React.ComponentType<any> }> = {
  home: {
    component: lazy(() => import('../pages/Home').then((m) => ({ default: m.Home }))),
  },
  diaries: {
    component: lazy(() => import('../pages/Diaries').then((m) => ({ default: m.Diaries }))),
    detailComponent: lazy(() => import('../pages/DiaryDetail').then((m) => ({ default: m.DiaryDetail }))),
  },
  says: {
    component: lazy(() => import('../pages/Says').then((m) => ({ default: m.Says }))),
  },
  gallery: {
    component: lazy(() => import('../pages/Gallery').then((m) => ({ default: m.Gallery }))),
  },
  friends: {
    component: lazy(() => import('../pages/Friends').then((m) => ({ default: m.Friends }))),
  },
  about: {
    component: lazy(() => import('../pages/About').then((m) => ({ default: m.About }))),
  },
  sitemap: {
    component: lazy(() => import('../pages/Sitemap').then((m) => ({ default: m.Sitemap }))),
  },
};

const LOADER_MAP: Record<string, SiteSection['loader']> = {
  home: {
    title: `${siteConfig.title || '序栈'} · 个人主页`,
    startMsg: '连接赛博时空 · 正在加载全景与核心图谱',
    middleMsg: '节点就绪 · 灵感与思考即将展开',
    readyMsg: `链路已通 · 欢迎访问 ${siteConfig.title || '序栈'}`,
    minDuration: 500,
    maxWait: 1200,
  },
  diaries: {
    title: '随想手记 · 文字花园',
    startMsg: '拾取吉光片羽 · 正在载入思考手稿',
    middleMsg: '墨韵流动漫延 · 即将揭示心绪切片',
    readyMsg: '手稿已就绪 · 静心阅读',
    minDuration: 500,
    maxWait: 1200,
  },
  says: {
    title: '日常说说 · 微语浮光',
    startMsg: '漫游思绪碎片 · 正在捕获瞬息灵感',
    middleMsg: '灵光闪现共鸣 · 即将连接当下记录',
    readyMsg: '思绪已锚定 · 欢迎浏览',
    minDuration: 500,
    maxWait: 1200,
  },
  gallery: {
    title: `${siteConfig.author?.name || '站长'} · 在追国漫`,
    startMsg: '漫游修仙幻境 · 正在展开画卷',
    middleMsg: '采撷热血国创 · 即将揭幕',
    readyMsg: '漫界已就绪 · 即刻呈现',
    minDuration: 650,
    maxWait: 2000,
  },
  friends: {
    title: '志同道合 · 友人林苑',
    startMsg: '穿梭数字星海 · 正在寻觅知己航标',
    middleMsg: '山海相逢互鸣 · 即将开启灵感共振',
    readyMsg: '星标已连接 · 欢迎造访朋友们',
    minDuration: 500,
    maxWait: 1200,
  },
  about: {
    title: '关于作者 · 赛博筑基',
    startMsg: '调取档案数据 · 正在解析技术栈与筑基哲学',
    middleMsg: '梳理工程师图谱 · 即将展示完整画卷',
    readyMsg: '档案已解锁 · 很高兴认识你',
    minDuration: 500,
    maxWait: 1200,
  },
  sitemap: {
    title: '全站索隐 · 架构导览',
    startMsg: '测绘全域脉络 · 正在绘制全站拓扑图',
    middleMsg: '梳理航道索引 · 即将展现星罗棋布',
    readyMsg: '罗盘已标定 · 自由漫游全站',
    minDuration: 420,
    maxWait: 1200,
  },
};

/**
 * 全站核心频道唯一定义注册表 (Single Source of Truth)
 */
export const SITE_SECTIONS: SiteSection[] = (rawSections as SectionRawItem[]).map((raw) => {
  const compDef = COMPONENT_MAP[raw.id];
  return {
    ...raw,
    loader: LOADER_MAP[raw.id],
    component: compDef?.component || COMPONENT_MAP.home.component,
    detailComponent: compDef?.detailComponent,
  };
});

/**
 * 获取所有支持的有效路径（包含主路径与别名）
 */
export function getSectionPaths(section: SiteSection): string[] {
  return [section.path, ...(section.aliases || [])];
}

/**
 * 校验指定路径是否属于某频道
 */
export function matchSectionPath(section: SiteSection, pathname: string): boolean {
  return getSectionPaths(section).some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/**
 * 根据路径查找匹配的频道
 */
export function findSectionByPath(pathname: string): SiteSection | undefined {
  if (pathname === '/' || pathname === '') {
    return SITE_SECTIONS.find((s) => s.path === '/');
  }
  return SITE_SECTIONS.find((s) => {
    if (s.path === '/') return false;
    return matchSectionPath(s, pathname);
  });
}

/**
 * 获取顶部导航栏统一链接项列表
 */
export function getHeaderNavLinks(): NavLinkItem[] {
  return SITE_SECTIONS.filter((s) => s.inHeader).map((s) => ({
    id: `nav-${s.id}`,
    href: s.path,
    label: s.label,
    icon: s.icon,
    enabled: true,
  }));
}

/**
 * 判断指定链接在移动端是否应折叠入“更多”
 */
export function isSectionCollapsedInMobile(href: string): boolean {
  const section = SITE_SECTIONS.find((s) => s.path === href || s.aliases?.includes(href));
  return Boolean(section?.collapsedInMobile);
}

/**
 * 判断当前路径是否属于沉浸式视图（例如追漫）
 */
export function isImmersiveRoute(pathname: string): boolean {
  const section = findSectionByPath(pathname);
  return Boolean(section?.isImmersive);
}

/**
 * 获取指定栏目的悬浮面板宽度（未配置则返回 0）
 */
export function getPopoverWidth(pathOrKey: string): number {
  const section = SITE_SECTIONS.find((s) => s.path === pathOrKey || s.aliases?.includes(pathOrKey));
  return section?.popoverWidth || 0;
}

/**
 * 判断指定路径是否配置了悬浮面板
 */
export function hasHoverPopover(pathOrKey: string): boolean {
  return getPopoverWidth(pathOrKey) > 0;
}

/**
 * 派生用于页脚的统一导航分栏（外部链接与站内各频道）
 */
export function getFooterNavColumns(): FooterNavColumn[] {
  const baseColumns: FooterNavColumn[] = [
    {
      title: '关于',
      links: [
        { label: '关于此项目', href: 'https://github.com/kerntau/chenv', isExternal: true },
        { label: '知识库', href: 'https://wiki.chenv.cn', isExternal: true },
        { label: '简历', href: 'https://cv.chenv.cn', isExternal: true },
      ],
    },
    {
      title: '更多',
      links: [],
    },
    {
      title: '联系',
      links: [
        { label: '发邮件', href: 'mailto:i@chenv.cn', isExternal: true },
        { label: 'GitHub', href: 'https://github.com/kerntau', isExternal: true },
      ],
    },
  ];

  // 动态将声明了 inFooter 的频道注入到对应分组
  SITE_SECTIONS.filter((s) => s.inFooter).forEach((s) => {
    const groupName = s.footerGroup || '更多';
    const targetCol = baseColumns.find((c) => c.title === groupName);
    if (targetCol) {
      targetCol.links.push({
        label: s.label === '手记' ? '动态手记' : s.label === '朋友' ? '志同道合' : `日常${s.label}`,
        href: s.path,
      });
    }
  });

  return baseColumns;
}

/**
 * 派生站点地图所需主册目次
 */
export function getSitemapSections(counts: { diaries: number; says: number; friends: number }) {
  return SITE_SECTIONS.filter((s) => s.inSitemap).map((s) => {
    let countStr = '1 页面';
    if (s.sitemapCountKey && s.sitemapUnit) {
      const count = counts[s.sitemapCountKey] ?? 0;
      countStr = `${count} ${s.sitemapUnit}`;
    }
    return {
      name: s.label === '手记' ? '动态手记' : s.label === '说说' || s.label === '动态' ? '日常说说' : s.label === '朋友' ? '志同道合' : s.label,
      nameEn: s.nameEn,
      path: s.path,
      desc: s.desc || '',
      count: countStr,
    };
  });
}

/**
 * 获取指定栏目的浏览器与元数据描述
 */
export function getSectionDescription(label: string): string {
  const sectionDescMap: Record<string, string | undefined> = {
    '手记': siteConfig.diariesPage?.subtitle || siteConfig.description,
    '说说': siteConfig.saysPage?.subtitle || '把灵感、日常与正在发生的事情，留在时间线上。',
    '动态': siteConfig.saysPage?.subtitle || '把灵感、日常与正在发生的事情，留在时间线上。',
    '追漫': '记录每一帧光影带来的悸动，用二次元的温度温暖日常。',
    '朋友': siteConfig.friendsPage?.subtitle || '山海相逢，灵感共振。',
    '关于': '关于作者 kerntau、全栈工程技术栈、本站设计哲学与数字花园。',
    '站点地图': '聚合全站核心频道结构、生活随笔手记与全局标签图谱。',
  };
  return sectionDescMap[label] || siteConfig.description;
}
