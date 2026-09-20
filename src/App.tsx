import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { siteConfig } from './content';
import { Home } from './pages/Home';
import { ClickSpark } from './components/ui/ClickSpark';

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
  { label: '画廊', paths: ['/gallery', '/photos', '/wall'], list: Gallery },
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
  <div className="flex-1 flex items-center justify-center min-h-[40vh]">
    <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse font-mono">加载中…</div>
  </div>
);

export const App: React.FC = () => {
  const [location] = useLocation();

  // 判断是否为沉浸式全屏画廊页面
  const isGallery = location === '/gallery' || location.startsWith('/gallery/') || location === '/photos' || location === '/wall';

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
          '画廊': '凝固光影与瞬息，漫游数字视觉画廊。',
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
      <div
        className={`min-h-screen flex flex-col relative selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900/60 dark:selection:text-sky-100 transition-colors duration-300 ${
          location === '/' || isGallery ? 'h-screen overflow-hidden' : ''
        }`}
      >
        {!isGallery && <AmbientBackground />}
        <Header />
        <div className={`flex-1 flex flex-col min-h-0 ${location === '/' || isGallery ? 'justify-center overflow-hidden h-full' : ''}`}>
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
