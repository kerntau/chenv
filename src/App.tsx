import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AmbientBackground } from './components/layout/AmbientBackground';
import { Home } from './pages/Home';
import { Posts } from './pages/Posts';
import { PostDetail } from './pages/PostDetail';
import { Notes } from './pages/Notes';
import { Diaries } from './pages/Diaries';
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
    <div className="min-h-screen flex flex-col relative selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900/60 dark:selection:text-sky-100 transition-colors duration-300">
      <AmbientBackground />
      <Header />
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/posts" component={Posts} />
          <Route path="/posts/:slug" component={PostDetail} />
          <Route path="/article" component={Posts} />
          <Route path="/article/:slug" component={PostDetail} />
          <Route path="/diaries" component={Diaries} />
          <Route path="/journal" component={Diaries} />
          <Route path="/shouji" component={Diaries} />
          <Route path="/notes" component={Notes} />
          <Route path="/notes/:slug" component={Notes} />
          <Route path="/projects" component={Projects} />
          <Route path="/says" component={Says} />
          <Route path="/record" component={Says} />
          <Route path="/friends" component={Friends} />
          <Route path="/friend" component={Friends} />
          <Route path="/about" component={About} />
          <Route path="/my" component={About} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};
