import React, { useEffect, useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Star,
  ExternalLink,
  Flame,
  CheckCircle2,
  RotateCw,
} from 'lucide-react';
import type { DriftWallItem } from '../../types';

interface BangumiSubjectDetail {
  id: number;
  name: string;
  name_cn: string;
  summary: string;
  date?: string;
  platform?: string;
  eps?: number;
  rating?: {
    rank?: number;
    total?: number;
    score?: number;
  };
  collection?: {
    doing?: number;
    collect?: number;
    wish?: number;
  };
  tags?: { name: string; count: number }[];
  infobox?: { key: string; value: any }[];
  images?: {
    large?: string;
    common?: string;
    medium?: string;
  };
}

interface AnimeDetailModalProps {
  item: DriftWallItem | null;
  onClose: () => void;
}

const CACHE_PREFIX = 'bgm_detail_cache_';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 缓存 24 小时

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ item, onClose }) => {
  const [detail, setDetail] = useState<BangumiSubjectDetail | null>(null);
  const [loading, setLoading] = useState(false);

  // 从 URL 中解析 subject ID
  const subjectId = useMemo(() => {
    if (!item?.href) return null;
    const m = item.href.match(/subject\/(\d+)/);
    return m ? m[1] : null;
  }, [item?.href]);

  // 异步获取 Bangumi 详细条目
  useEffect(() => {
    if (!item || !subjectId) {
      setDetail(null);
      return;
    }

    const cacheKey = `${CACHE_PREFIX}${subjectId}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL) {
          setDetail(parsed.data);
          return;
        }
      }
    } catch {
      // 忽略缓存读取错误
    }

    let mounted = true;
    setLoading(true);

    fetch(`https://api.bgm.tv/v0/subjects/${subjectId}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Chent/1.0',
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: BangumiSubjectDetail) => {
        if (!mounted) return;
        setDetail(data);
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data }));
        } catch {
          // 忽略存储超限错误
        }
      })
      .catch((err) => {
        if (!mounted) return;
        console.warn('[AnimeDetailModal] 异步拉取详情降级:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [item, subjectId]);

  if (!item) return null;

  const getInfoboxValue = (targetKey: string): string | null => {
    if (!detail?.infobox) return null;
    const found = detail.infobox.find((info) => info.key === targetKey);
    if (!found) return null;
    if (typeof found.value === 'string') return found.value;
    if (Array.isArray(found.value)) {
      return found.value.map((v) => (typeof v === 'string' ? v : v.v || '')).join('、');
    }
    return null;
  };

  const animeStudio = getInfoboxValue('动画制作') || getInfoboxValue('制作');
  const animeOriginal = getInfoboxValue('原作');

  const displayName = detail?.name_cn || item.title || detail?.name || '国漫条目';
  const originalName = detail?.name && detail.name !== displayName ? detail.name : null;
  const coverImage =
    detail?.images?.large?.replace(/^http:\/\//, 'https://') ||
    detail?.images?.common?.replace(/^http:\/\//, 'https://') ||
    item.image;

  const score = detail?.rating?.score;
  const rank = detail?.rating?.rank;
  const totalVotes = detail?.rating?.total;
  const doingCount = detail?.collection?.doing;
  const collectCount = detail?.collection?.collect;

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* 现代沉浸式全屏磨砂遮罩 */}
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/50 dark:bg-black/75 backdrop-blur-md z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* 弹窗核心容器：大圆角、流体玻璃、弥散氛围底色 */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-[100] w-[92%] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-2xl overflow-hidden font-sans outline-none bg-white/92 dark:bg-[#0e1626]/92 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.2)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.06)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex flex-col max-h-[88vh]">
          
          {/* 顶层氛围模糊光晕（提取当前封面大图的高斯色散） */}
          <div className="absolute -top-20 -left-20 -right-20 h-64 pointer-events-none overflow-hidden opacity-35 dark:opacity-25 select-none">
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover blur-3xl scale-125 saturate-150"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-[#0e1626]/60 to-white dark:to-[#0e1626]" />
          </div>

          {/* 右上角极简毛玻璃圆形关闭按钮 */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-black/[0.06] hover:bg-black/[0.12] dark:bg-white/[0.08] dark:hover:bg-white/[0.16] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 backdrop-blur-md transition-all active:scale-95"
              aria-label="关闭详情"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>

          <Dialog.Title className="sr-only">
            {displayName}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {displayName} 的动漫评分与详细资料
          </Dialog.Description>

          {/* 滚动内容区 */}
          <div className="relative z-10 overflow-y-auto px-5 pt-6 pb-4 sm:px-7 sm:pt-7 sm:pb-5 space-y-6">
            {/* 上部主要信息：大画幅海报 + 标题、评分看板与元数据 */}
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
              {/* 海报封面 */}
              <div className="relative w-32 sm:w-40 shrink-0 aspect-[1/1.38] rounded-xl overflow-hidden shadow-lg shadow-black/15 ring-1 ring-black/5 dark:ring-white/15 bg-slate-100 dark:bg-slate-800 self-center sm:self-start group">
                <img
                  src={coverImage}
                  alt={displayName}
                  className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl pointer-events-none" />
              </div>

              {/* 右侧流线信息区 */}
              <div className="flex-1 min-w-0 space-y-3.5 w-full text-left">
                {/* 标题与原名 */}
                <div className="space-y-1 pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
                      {displayName}
                    </h2>
                    {loading && <RotateCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />}
                  </div>
                  {originalName && (
                    <div className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                      {originalName}
                    </div>
                  )}
                </div>

                {/* 评分与排名看板（极简大气无厚重灰框） */}
                <div className="flex flex-wrap items-baseline gap-3 pt-0.5">
                  <div className="flex items-baseline gap-1.5 text-amber-500 dark:text-amber-400">
                    <Star className="w-5 h-5 fill-current translate-y-0.5 self-center" />
                    <span className="font-mono text-2xl font-black tracking-tight leading-none">
                      {typeof score === 'number' && score > 0 ? score.toFixed(1) : '-.-'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                      / 10
                    </span>
                  </div>

                  {typeof rank === 'number' && rank > 0 && (
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      Rank #{rank}
                    </span>
                  )}

                  {typeof totalVotes === 'number' && totalVotes > 0 && (
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                      {totalVotes.toLocaleString()} 人评价
                    </span>
                  )}
                </div>

                {/* 追更热度数据 */}
                {(doingCount !== undefined || collectCount !== undefined) && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                    {doingCount !== undefined && (
                      <span className="inline-flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-500" />
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                          {doingCount.toLocaleString()}
                        </span>
                        <span>人在追</span>
                      </span>
                    )}
                    {collectCount !== undefined && (
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                          {collectCount.toLocaleString()}
                        </span>
                        <span>人看过</span>
                      </span>
                    )}
                  </div>
                )}

                {/* 属性元数据一览（轻巧流线排版，去除生硬方块） */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1">
                  {detail?.date && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">首播</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{detail.date}</span>
                    </div>
                  )}
                  {detail?.eps ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">集数</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">全 {detail.eps} 话</span>
                    </div>
                  ) : null}
                  {animeOriginal && (
                    <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2">
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">原作</span>
                      <span className="truncate text-slate-800 dark:text-slate-200">{animeOriginal}</span>
                    </div>
                  )}
                  {animeStudio && (
                    <div className="flex items-center gap-2 truncate col-span-1 sm:col-span-2">
                      <span className="text-slate-400 dark:text-slate-500 shrink-0">制作</span>
                      <span className="truncate text-slate-800 dark:text-slate-200">{animeStudio}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 剧情概要（纯净出版级排版，彻底消除丑陋灰底框） */}
            {detail?.summary && (
              <div className="space-y-2 pt-2 border-t border-slate-200/50 dark:border-white/5">
                <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  剧情概要
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300 font-humanist whitespace-pre-line tracking-wide">
                  {detail.summary}
                </p>
              </div>
            )}

            {/* 热门标签云（精致微胶囊） */}
            {detail?.tags && detail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {detail.tags.slice(0, 10).map((t) => (
                  <span
                    key={t.name}
                    className="px-2.5 py-1 rounded-full bg-slate-100/80 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 text-[11px] font-sans hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 底部行动栏（通透轻盈，精致圆角胶囊按钮） */}
          <div className="relative z-10 px-5 py-3.5 sm:px-7 border-t border-slate-200/60 dark:border-white/[0.08] bg-white/50 dark:bg-black/20 backdrop-blur-md flex items-center justify-between shrink-0">
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              按 ESC 或点击背景关闭
            </span>

            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 hover:shadow-sky-500/35 transition-all duration-200 active:scale-95"
              >
                <span>在 Bangumi 查看</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AnimeDetailModal;
