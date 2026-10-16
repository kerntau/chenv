import React, { Suspense, lazy, useEffect, useState, useRef, useMemo } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { siteConfig } from './content';
import { ClickSpark } from './components/ui/ClickSpark';
import { PageLoader } from './components/ui/PageLoader';
import { getPageLoaderConfig } from './lib/pageLoaderConfig';
import { FluidGlassDefs } from './components/ui/glass/FluidGlassDefs';
import { useTheme } from './hooks/useTheme';
import {
  SITE_SECTIONS,
  getSectionPaths,
  findSectionByPath,
  isImmersiveRoute,
  getSectionDescription,
} from './config/sections';

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

const RouteFallback: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-[40vh]" />
);

export const App: React.FC = () => {
  useTheme();
  const [location] = useLocation();

  // 判断是否为沉浸式全屏视图（由统一注册表 isImmersive 驱动）
  const isImmersive = isImmersiveRoute(location);

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

  // 路由跳转时平滑回滚至顶部并动态更新浏览器标签标题与元描述
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const section = findSectionByPath(location);
    if (section && section.path !== '/') {
      document.title = `${section.label} · ${siteConfig.title}`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', getSectionDescription(section.label));
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
          isImmersive ? 'h-screen overflow-hidden' : ''
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
        {!isImmersive && <AmbientBackground />}
        <Header />
        <div className={`flex-1 flex flex-col min-h-0 ${isImmersive ? 'justify-center overflow-hidden h-full' : ''}`}>
          <Suspense fallback={<RouteFallback />}>
            <Switch>
              {SITE_SECTIONS.map((section) => {
                const paths = getSectionPaths(section);
                return (
                  <React.Fragment key={section.id}>
                    {paths.map((p) => (
                      <Route key={p} path={p} component={section.component} />
                    ))}
                    {section.hasDetail && section.detailComponent && (
                      paths.map((p) => (
                        <Route key={`${p}/:slug`} path={`${p}/:slug`} component={section.detailComponent!} />
                      ))
                    )}
                  </React.Fragment>
                );
              })}
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </div>
        {!isImmersive && <Footer />}
      </div>
    </ClickSpark>
  );
};
