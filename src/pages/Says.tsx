import React, { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { PageEpigraph } from '../components/layout/PageEpigraph';
import { RecordCard } from '../components/says/RecordCard';
import { useStaticRecords } from '../hooks/useStaticRecords';
import { siteConfig } from '../content';
import { BlurText, FadeContent } from '../components/reactbits';

export const Says: React.FC = () => {
  const { records } = useStaticRecords();
  const saysPage = siteConfig.saysPage;
  const pageSize = saysPage?.pageSize || 6;
  const title = saysPage?.title || '我的动态';
  const subtitle = saysPage?.subtitle || '把灵感、日常与正在发生的事情，留在时间线上。';

  const [page, setPage] = useState(1);
  const visibleRecords = useMemo(() => records.slice(0, page * pageSize), [page, records, pageSize]);

  return (
    <PageShell>
      <Container size="narrow">
        {/* 精简居中顶栏 */}
        <div className="mb-4 pb-3 sm:mb-6 sm:pb-4 border-b border-slate-200/70 dark:border-white/5 text-center">
          <BlurText
            text={title}
            className="font-sans text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-200 tracking-tight justify-center"
            delay={40}
            animateBy="words"
            direction="top"
          />
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-1.5 font-sans max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="space-y-3.5">
          {visibleRecords.map((record, index) => (
            <FadeContent
              key={record.id}
              delay={Math.min(index * 0.05, 0.35)}
              direction="up"
              distance={20}
              duration={0.4}
            >
              <RecordCard record={record} />
            </FadeContent>
          ))}
        </div>
        {visibleRecords.length === 0 && (
          <div className="rounded-sm border border-slate-200/60 dark:border-white/5 py-12 text-center text-xs font-mono text-slate-400">
            暂时还没有动态。
          </div>
        )}
        {visibleRecords.length < records.length && (
          <button
            type="button"
            onClick={() => setPage((value) => value + 1)}
            className="glass-pill mx-auto mt-7 flex min-h-9 items-center gap-2 rounded-sm px-4 py-2 text-xs font-mono text-slate-700 hover:text-sky-600 dark:text-slate-200 dark:hover:text-white cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <RefreshCw className="h-3.5 w-3.5" /> 加载更多动态
          </button>
        )}

        {/* 底部卷尾题跋 */}
        <FadeContent delay={0.2} direction="up" distance={15}>
          <PageEpigraph quote="捕捉灵光闪烁，记录当下的真实呼吸。" />
        </FadeContent>
      </Container>
    </PageShell>
  );
};

