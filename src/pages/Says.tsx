import React, { useMemo, useState } from 'react';
import { MessageSquareQuote, Plus, RefreshCw } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { RecordCard } from '../components/says/RecordCard';
import { RecordComposer } from '../components/says/RecordComposer';
import { useStaticRecords } from '../hooks/useStaticRecords';
import type { RecordItem } from '../types';

const PAGE_SIZE = 6;

export const Says: React.FC = () => {
  const { records, saveRecord, removeRecord } = useStaticRecords();
  const [composerOpen, setComposerOpen] = useState(false);
  const [editing, setEditing] = useState<RecordItem>();
  const [page, setPage] = useState(1);
  const visibleRecords = useMemo(() => records.slice(0, page * PAGE_SIZE), [page, records]);
  const startEdit = (record: RecordItem) => { setEditing(record); setComposerOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const save = (record: RecordItem) => { saveRecord(record); setEditing(undefined); setComposerOpen(false); };
  return <PageShell><Container size="narrow"><div className="mb-7 border-b border-slate-200/70 pb-6 dark:border-slate-800/70"><div className="mb-2 flex items-center gap-2 font-mono text-xs text-slate-500"><MessageSquareQuote className="h-4 w-4 text-sky-600 dark:text-sky-400" /><span>THOUGHTS · 动态 ({records.length})</span></div><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">我的动态</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">把灵感、日常与正在发生的事情，留在时间线上。</p></div><button onClick={() => { setEditing(undefined); setComposerOpen((value) => !value); }} className="inline-flex min-h-10 items-center gap-1.5 rounded-sm bg-sky-600 px-3 text-xs font-medium text-white transition hover:bg-sky-700"><Plus className="h-4 w-4" /> 发布动态</button></div></div>{composerOpen && <RecordComposer editing={editing} onSave={save} onCancel={() => { setEditing(undefined); setComposerOpen(false); }} />}<div className="space-y-4">{visibleRecords.map((record) => <RecordCard key={record.id} record={record} onEdit={startEdit} onRemove={removeRecord} />)}</div>{visibleRecords.length === 0 && <div className="paper-card py-14 text-center text-sm text-slate-500">还没有动态，发布第一条记录吧。</div>}{visibleRecords.length < records.length && <button onClick={() => setPage((value) => value + 1)} className="mx-auto mt-6 flex min-h-10 items-center gap-2 rounded-sm border border-slate-200/80 px-4 text-xs text-slate-600 transition hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300"><RefreshCw className="h-3.5 w-3.5" /> 加载更多</button>}</Container></PageShell>;
};
