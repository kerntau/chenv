import React, { Suspense, lazy, useEffect, useState, useRef, useMemo } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { siteConfig } from './content';
import { Home } from './pages/Home';
import { ClickSpark } from './components/ui/ClickSpark';
import { PageLoader } from './components/ui/PageLoader';
import { getPageLoaderConfig } from './lib/pageLoaderConfig';
import { FluidGlassDefs } from './components/ui/glass/FluidGlassDefs';
import { useTheme } from './hooks/useTheme';

// 路由级代码分割：非首屏页面不进入主包
const Archives = lazy(() => import('./pages/Archives').then((m) => ({ default: m.Archives })));
const Diaries = lazy(() => import('./pages/Diaries').then((m) => ({ default: m.Diaries })));
const DiaryDetail = lazy(() => import('./pages/DiaryDetail').then((m) => ({ default: m.DiaryDetail })));
const Says = lazy(() => import('./pages/Says').then((m) => ({ default: m.Says })));
const Friends = lazy(() => import('./pages/Friends').then((m) => ({ default: m.Friends })));
const Gallery = lazy(() => import('./pages/Gallery').then((m) => ({ default: m.Gallery })));
const Sitemap = lazy(() => import('./pages/Sitemap').then((m) => ({ default: m.Sitemap })));
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// 栏目路由定义（含旧路径别名），同时驱动 <Switch> 与浏览器标签标题
interface Section {
  label: string;
  paths: string[];
  list: React.LazyExoticComponent<React.FC>;
  detail?: React.LazyExoticComponent<React.FC>;
}

const SECTIONS: Section[] = [
  { label: '归档', paths: ['/archives', '/timeline', '/archive'], list: Archives },
  { label: '手记', paths: ['/diaries', '/journal', '/shouji'], list: Diaries, detail: DiaryDetail },
  { label: '说说', paths: ['/says', '/record'], list: Says },
  { label: '追漫', paths: ['/gallery', '/bangumi', '/anime', '/photos', '/wall'], list: Gallery },
  { label: '友链', paths: ['/friends', '/friend'], list: Friends },
  { label: '关于', paths: ['/about', '/me'], list: About },
  { label: '站点地图', paths: ['/sitemap'], list: Sitemap },
];

function findSection(pathname: string) {
  return SECTIONS.find((s) =>
    s.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

const RouteFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[40vh]" />
);

export const App: React.FC = () => {
  useTheme();
  const [location] = useLocation();

  // 判断是否为沉浸式全屏追漫/画廊页面
  const isGallery =
    location === '/gallery' ||
    location.startsWith('/gallery/') ||
    location === '/bangumi' ||
    location.startsWith('/bangumi/') ||
    location === '/anime' ||
    location.startsWith('/anime/') ||
    location === '/photos' ||
    location === '/wall';

  // 全站页面流光加载与路由过渡状态
  const [isPageLoading, setIsPageLoading] = useState(true);
  const prevLocationRef = useRef(location);
  const pageMeta = useMemo(() => getPageLoaderConfig(location), [location]);
  const handleLoaded = React.useCallback(() => {
    setIsPageLoading(false);
    if (typeof window !== 'undefined') {
      (window as any).__PAGE_LOADED__ = true;
      window.dispatchEvent(new CustomEvent('page-ready'));
    }
  }, []);

  useEffect(() => {
    if (prevLocationRef.current !== location) {
      prevLocationRef.current = location;
      setIsPageLoading(true);
      if (typeof window !== 'undefined') {
        (window as any).__PAGE_LOADED__ = false;
      }
    }
  }, [location]);

  // 全局确保抖音美好体 CDN 样式表挂载
  useEffect(() => {
    const fontUrl = 'https://cn-font.claude-code-best.win/packages/dymh/dist/DouyinSansBold/result.css';
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }, []);

  // 路由跳转时平滑回滚至顶部并动态更新浏览器标签标题
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const section = findSection(location);
    if (section) {
      document.title = `${section.label} · ${siteConfig.title}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        const sectionDescMap: Record<string, string> = {
          '归档': siteConfig.archivesPage?.subtitle || `${siteConfig.title} 全站随笔与手记的时间脉络与足迹索引。`,
          '手记': siteConfig.diariesPage?.subtitle || siteConfig.description,
          '说说': siteConfig.saysPage?.subtitle || '把灵感、日常与正在发生的事情，留在时间线上。',
          '追番': '记录每一帧光影带来的悸动，用二次元的温度温暖日常。',
          '友链': siteConfig.friendsPage?.subtitle || '山海相逢，灵感共振。',
          '关于': '关于作者 kerntau、全栈工程技术栈、本站设计哲学与数字花园。',
          '站点地图': '聚合全站核心频道结构、生活随笔手记与全局标签图谱。',
        };
        metaDesc.setAttribute('content', sectionDescMap[section.label] || siteConfig.description);
      }
    } else {
      document.title = siteConfig.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', siteConfig.description);
      }
    }
  }, [location]);

  // 前台博客浏览体系
  return (
    <ClickSpark>
      <FluidGlassDefs />
      <div
        className={`min-h-screen flex flex-col relative selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900/60 dark:selection:text-sky-100 transition-colors duration-300 ${
          isGallery ? 'h-screen overflow-hidden' : ''
        }`}
      >
        {isPageLoading && (
          <PageLoader
            key={location}
            title={pageMeta.title}
            startMsg={pageMeta.startMsg}
            middleMsg={pageMeta.middleMsg}
            readyMsg={pageMeta.readyMsg}
            minDuration={pageMeta.minDuration}
            maxWait={pageMeta.maxWait}
            previewImages={pageMeta.previewImages}
            onLoaded={handleLoaded}
          />
        )}
        {!isGallery && <AmbientBackground />}
        <Header />
        <div className={`flex-1 flex flex-col min-h-0 ${isGallery ? 'justify-center overflow-hidden h-full' : ''}`}>
          <Suspense fallback={<RouteFallback />}>
            <Switch>
              <Route path="/" component={Home} />
              {SECTIONS.map((section) => (
                <React.Fragment key={section.label}>
                  {section.paths.map((path) => (
                    <React.Fragment key={path}>
                      <Route path={path} component={section.list} />
                      {section.detail && (
                        <Route path={`${path}/:slug`} component={section.detail} />
                      )}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </div>
        {!isGallery && <Footer />}
      </div>
    </ClickSpark>
  );
};
