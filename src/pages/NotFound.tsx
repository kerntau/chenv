import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Link } from 'wouter';
import { Compass, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <PageShell>
      <Container>
        <div className="py-24 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-6 h-6" />
          </div>

          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            404 NOT FOUND
          </span>

          <h1 className="font-sans text-3xl font-semibold text-slate-900 dark:text-slate-100 mt-2 mb-3">
            纸页未至此处
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed mb-6">
            您所寻访的篇章可能已被迁转或未曾书写。请确认路径，或返回序栈首页。
          </p>

          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>返回首页</span>
          </Link>
        </div>
      </Container>
    </PageShell>
  );
};
