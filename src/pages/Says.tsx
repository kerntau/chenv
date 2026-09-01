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
        <div className="mb-6 border-b border-slate-200/70 pb-5 dark:border-slate-800/70">
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs text-slate-500">
            <MessageSquareQuote className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            <span>THOUGHTS &bull; 动态 ({records.length})</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
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

