import React, { useMemo, useState } from 'react';
import { MessageSquareQuote, RefreshCw } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { RecordCard } from '../components/says/RecordCard';
import { useStaticRecords } from '../hooks/useStaticRecords';
import { siteConfig } from '../content';

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
        {/* 顶部标题区 */}
        <div className="mb-4 pb-3 sm:mb-10 sm:pb-6 border-b border-slate-200/70 dark:border-slate-800/70 text-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-[11px] font-mono tracking-wider text-slate-600 dark:text-slate-400 mb-2">
            <MessageSquareQuote className="w-3 h-3 text-sky-600 dark:text-sky-400" />
            <span>THOUGHTS</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 sm:mt-2 font-sans max-w-md mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        <div className="space-y-3.5">
          {visibleRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
        {visibleRecords.length === 0 && (
          <div className="rounded-sm border border-slate-200/60 dark:border-slate-800/60 py-12 text-center text-xs font-mono text-slate-400">
            暂时还没有动态。
          </div>
        )}
        {visibleRecords.length < records.length && (
          <button
            onClick={() => setPage((value) => value + 1)}
            className="mx-auto mt-6 flex min-h-9 items-center gap-2 rounded-sm border border-slate-200/80 px-4 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-400"
          >
            <RefreshCw className="h-3.5 w-3.5" /> 加载更多
          </button>
        )}
      </Container>
    </PageShell>
  );
};

