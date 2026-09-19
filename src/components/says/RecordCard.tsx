import React from 'react';
import { MapPin } from 'lucide-react';
import type { RecordItem } from '../../types';
import { formatDateTime } from '../../lib/date';
import { RecordMedia } from './RecordMedia';
import { MarkdownRenderer } from '../markdown/MarkdownRenderer';
import { siteConfig } from '../../content';

export const RecordCard: React.FC<{
  record: RecordItem;
}> = ({ record }) => {
  return (
    <article className="rounded-md glass-card hover:-translate-y-1 hover:!border-sky-300/80 dark:hover:!border-sky-600/50 hover:bg-white/90 dark:hover:bg-slate-900/80 hover:shadow-[0_10px_28px_-4px_rgba(15,23,42,0.08),inset_0_1px_0_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-all duration-300 p-3.5 sm:p-4">
      <div className="flex gap-3">
        <img
          src={siteConfig.author.avatar}
          alt={`${siteConfig.author.name} 的头像`}
          className="mt-0.5 h-9 w-9 shrink-0 rounded-md border border-slate-200/70 object-cover dark:border-slate-700/70 sm:h-10 sm:w-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-400 dark:text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700 dark:text-slate-200">{record.author || siteConfig.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <time dateTime={String(record.createTime)}>{formatDateTime(record.createTime)}</time>
            </div>
          </div>
          <div className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-200 [&>article>p]:my-1.5 [&>article>p]:leading-relaxed [&>article]:max-w-none">
            <MarkdownRenderer content={record.content} />
          </div>
          <RecordMedia media={record.media} />
          {record.location && (
            <div className="mt-2.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" />
              <span className="truncate">{record.location}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
