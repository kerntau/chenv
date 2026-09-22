import React from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { Link } from 'wouter';
import { Home, Feather, Map, ArrowRight } from 'lucide-react';
import { getAllDiaries } from '../content';
import { BlurText, FadeContent } from '../components/reactbits';

export const NotFound: React.FC = () => {
  const recentDiaries = getAllDiaries().slice(0, 3);

  return (
    <PageShell className="flex-1 flex flex-col justify-center">
      <Container size="narrow" className="justify-center">
        <div className="py-14 sm:py-20 text-center max-w-lg mx-auto font-sans">
          
          {/* 大气半透明等宽巨幕数字 */}
          <div className="select-none mb-2 font-mono text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-none bg-gradient-to-b from-sky-400/35 via-slate-300/25 to-transparent dark:from-sky-500/20 dark:via-slate-600/15 dark:to-transparent bg-clip-text text-transparent">
            404
          </div>

          {/* 诗意主标题 */}
          <BlurText
            text="纸页未至此处"
            className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-wide justify-center mt-1 mb-3"
            delay={30}
            animateBy="words"
            direction="top"
          />

          {/* 简洁无孤字折行的说明导语 */}
          <FadeContent delay={0.1} direction="up" distance={15} duration={0.4}>
            <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-sans leading-relaxed max-w-sm mx-auto mb-8">
              抱歉，您所寻访的篇章未曾书写，或已随风迁转。
            </p>

            {/* 统一步调的轻盈胶囊通道 */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
              <Link
                href="/"
                className="glass-card glass-card-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-slate-800 dark:text-slate-100 !border-sky-400/40 dark:!border-sky-400/30 hover:text-sky-600 dark:hover:text-sky-400 transition-all group shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                <span>返回首页</span>
              </Link>
              <Link
                href="/diaries"
                className="glass-tag inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-slate-600 dark:text-slate-300 text-xs font-normal hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <Feather className="w-3.5 h-3.5 opacity-70" />
                <span>手记随笔</span>
              </Link>
              <Link
                href="/sitemap"
                className="glass-tag inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-slate-600 dark:text-slate-300 text-xs font-normal hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <Map className="w-3.5 h-3.5 opacity-70" />
                <span>站点地图</span>
              </Link>
            </div>

            {/* 推荐篇章：彻底去盒子化，纯净流线排版 */}
            {recentDiaries.length > 0 && (
              <div className="pt-7 border-t border-slate-200/50 dark:border-white/5 max-w-sm mx-auto text-left">
                <span className="text-[10.5px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-center mb-3 select-none">
                  或许您想阅读
                </span>
                <div className="space-y-1">
                  {recentDiaries.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/diaries/${d.slug}`}
                      className="group flex items-center justify-between py-1.5 px-2.5 -mx-2.5 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="font-serif text-xs text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 truncate pr-2 transition-colors">
                        {d.title}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </FadeContent>

        </div>
      </Container>
    </PageShell>
  );
};
