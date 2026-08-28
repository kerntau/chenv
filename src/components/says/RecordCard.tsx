import React from 'react';
import { Heart, MapPin } from 'lucide-react';
import type { RecordItem } from '../../types';
import { formatDateTime } from '../../lib/date';
import { useRecordInteractions } from '../../hooks/useRecordInteractions';
import { RecordMedia } from './RecordMedia';
import { MarkdownRenderer } from '../markdown/MarkdownRenderer';
import { siteConfig } from '../../content';

export const RecordCard: React.FC<{
  record: RecordItem;
}> = ({ record }) => {
  const { liked, likes, toggleLike } = useRecordInteractions(record.id, record.likes);

  return (
    <article className="paper-card rounded-sm p-4 sm:p-5">
      <div className="flex gap-3">
        <img
          src={siteConfig.author.avatar}
          alt={`${siteConfig.author.name} 的头像`}
          className="mt-0.5 h-10 w-10 shrink-0 rounded-sm border border-slate-200/70 object-cover dark:border-slate-700/70"
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
          <div className="mt-3 text-sm leading-relaxed text-slate-800 dark:text-slate-200 sm:text-base"><MarkdownRenderer content={record.content} /></div>
          <RecordMedia media={record.media} />
          <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-3 text-[11px] text-slate-400 dark:border-slate-800/70">
            <div className="flex min-w-0 items-center gap-1.5">{record.location && <><MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" /><span className="truncate">{record.location}</span></>}</div>
            <button onClick={toggleLike} disabled={liked} className={'flex min-h-10 items-center gap-1 rounded-sm px-2 ' + (liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500')} aria-label="点赞"><Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} /> {likes}</button>
          </div>
        </div>
      </div>
    </article>
  );
};
