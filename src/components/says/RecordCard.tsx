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
    <article className="glass-card glass-card-interactive rounded-md p-4 sm:p-5">
      <div className="flex gap-3.5">
        <img
          src={siteConfig.author.avatar}
          alt={`${siteConfig.author.name} 的头像`}
          className="mt-0.5 h-9 w-9 shrink-0 rounded-md border border-white/80 object-cover dark:border-white/15 shadow-[0_2px_6px_rgba(15,23,42,0.04),inset_0_1px_1px_0_rgba(255,255,255,0.7)] sm:h-10 sm:w-10"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4 text-xs font-sans text-slate-400 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span
                className="font-medium text-sky-600 dark:text-sky-400 font-douyin tracking-tight"
                style={{ fontFamily: '"Douyin Sans", "抖音美好体", sans-serif' }}
              >
                {record.author || siteConfig.author.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <time dateTime={String(record.createTime)} className="tracking-wide">{formatDateTime(record.createTime)}</time>
            </div>
          </div>
          <div className="mt-2.5 text-[0.9375rem] sm:text-[1rem] leading-[1.8] font-humanist text-slate-800 dark:text-slate-200 tracking-wide [&>article>p]:my-1.5 [&>article>p]:leading-[1.8] [&>article]:max-w-none">
            <MarkdownRenderer content={record.content} />
          </div>
          <RecordMedia media={record.media} />
          {record.location && (
            <div className="mt-3 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-sans tracking-wide">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" />
              <span className="truncate">{record.location}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
