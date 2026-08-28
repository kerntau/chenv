import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { siteConfig } from './content';
import { Home } from './pages/Home';
import { Posts } from './pages/Posts';
import { PostDetail } from './pages/PostDetail';
import { Archives } from './pages/Archives';
import { Diaries } from './pages/Diaries';
import { DiaryDetail } from './pages/DiaryDetail';
import { Says } from './pages/Says';
import { Friends } from './pages/Friends';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/Admin';

// 栏目路由定义（含旧路径别名），同时驱动 <Switch> 与浏览器标签标题
interface Section {
  label: string;
  paths: string[];
  list: React.FC;
  detail?: React.FC;
}

const SECTIONS: Section[] = [
  { label: '文章', paths: ['/posts', '/article'], list: Posts, detail: PostDetail },
  { label: '归档', paths: ['/archives', '/timeline', '/archive'], list: Archives },
  { label: '手记', paths: ['/diaries', '/journal', '/shouji'], list: Diaries, detail: DiaryDetail },
  { label: '说说', paths: ['/says', '/record'], list: Says },
  { label: '友链', paths: ['/friends', '/friend'], list: Friends },
  { label: '关于', paths: ['/about', '/my'], list: About },
];


function findSection(pathname: string) {
  return SECTIONS.find((s) =>
    s.paths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export const App: React.FC = () => {
  const [location] = useLocation();

  const isAdminRoute = location === '/admin' || location.startsWith('/admin/');

  // 路由跳转时平滑回滚至顶部并动态更新浏览器标签标题
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (isAdminRoute) {
      document.title = `管理控制台 · ${siteConfig.title}`;
    } else {
      const section = findSection(location);
      document.title = section
        ? `${section.label} · ${siteConfig.title}`
        : siteConfig.title;
    }
  }, [location, isAdminRoute]);

  // 后台独立路由体系：完全脱离前台 Header、Footer 与背景特效
  if (isAdminRoute) {
    return (
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/admin/:rest*" component={Admin} />
      </Switch>
    );
  }

  // 前台博客浏览体系
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900/60 dark:selection:text-sky-100 transition-colors duration-300">
      <AmbientBackground />
      <Header />
      <div className="flex-1">
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
      </div>
      <Footer />
    </div>
  );
};
