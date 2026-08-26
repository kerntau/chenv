import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Posts } from './pages/Posts';
import { PostDetail } from './pages/PostDetail';
import { Notes } from './pages/Notes';
import { Projects } from './pages/Projects';
import { Says } from './pages/Says';
import { Friends } from './pages/Friends';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const [location] = useLocation();

  // 路由跳转时平滑回滚至顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-paper-texture selection:bg-stone-200 dark:selection:bg-stone-800 transition-colors duration-200">
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/posts/:slug" component={PostDetail} />
          <Route path="/notes" component={Notes} />
          <Route path="/notes/:slug" component={Notes} />
          <Route path="/projects" component={Projects} />
          <Route path="/says" component={Says} />
          <Route path="/friends" component={Friends} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};
