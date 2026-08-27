import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { MessageSquareQuote, Heart, MapPin } from 'lucide-react';
import { getAllRecords } from '../content';
import { formatDateTime } from '../lib/date';

export const Says: React.FC = () => {
  const records = getAllRecords();
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    records.forEach((r) => {
      map[String(r.id)] = r.likes || 0;
    });
    return map;
  });

  const handleLike = (id: string) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <PageShell>
      <Container size="narrow">
        {/* 顶部标题 */}
        <div className="mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70 text-center">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-sm bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>THOUGHTS &bull; 说说动态</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            碎语与日常
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans max-w-md mx-auto">
            捕捉那些稍纵即逝的灵感火花、深夜随想与日常心得。
          </p>
        </div>

        {/* 动态时间轴卡片流 */}
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="p-3.5 sm:p-4 rounded-sm paper-card space-y-2.5 transition-all duration-200"
            >
              {/* 时间、作者与心情 */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 dark:text-slate-500">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {record.author || 'kerntau'}
                  </span>
                  {record.mood && (
                    <span className="px-1.5 py-0.5 rounded-sm bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 text-[10px] font-sans">
                      {record.mood}
                    </span>
                  )}
                </div>
                <span>{formatDateTime(record.createTime)}</span>
              </div>

              {/* 内容 */}
              <p className="font-sans text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {record.content}
              </p>

              {/* 地理位置与点赞互动 */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 text-xs font-mono">
                <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500 text-[11px]">
                  {record.location && (
                    <>
                      <MapPin className="w-3 h-3 text-sky-600/60" />
                      <span>{record.location}</span>
                    </>
                  )}
                </div>

                <button
                  onClick={() => handleLike(String(record.id))}
                  className="flex items-center space-x-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                  title="留下印记"
                >
                  <Heart className="w-3.5 h-3.5 fill-current opacity-70 hover:opacity-100" />
                  <span>{likesMap[String(record.id)] || 0}</span>
                </button>
              </div>
            </div>
          ))}

          {records.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-slate-400">
              暂无动态记录
            </div>
          )}
        </div>
      </Container>
    </PageShell>
  );
};
