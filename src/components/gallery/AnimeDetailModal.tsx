import React, { useEffect, useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Star,
  ExternalLink,
  Flame,
  CheckCircle2,
  Calendar,
  Film,
  Building,
  User,
  Tv,
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
        {/* 统一磨砂全屏遮罩 */}
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* 统一 glass-modal 弹窗容器 */}
        <Dialog.Content className="glass-modal fixed left-[50%] top-[50%] z-[100] w-[92%] max-w-2xl translate-x-[-50%] translate-y-[-50%] rounded-md overflow-hidden font-sans outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex flex-col max-h-[85vh]">
          {/* 顶栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-xs bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                <Tv className="w-3.5 h-3.5" />
              </span>
              <Dialog.Title className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                {displayName}
              </Dialog.Title>
              {loading && <RotateCw className="w-3 h-3 text-sky-500 animate-spin" />}
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xs transition-colors"
                aria-label="关闭详情"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            {displayName} 的动漫评分与详细资料
          </Dialog.Description>

          {/* 滚动内容区 */}
          <div className="overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
            {/* 上半部分：海报 + 评分与元数据 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* 海报 */}
              <div className="relative w-28 sm:w-36 shrink-0 aspect-[3/4] rounded-sm overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xs bg-slate-100 dark:bg-slate-800">
                <img
                  src={coverImage}
                  alt={displayName}
                  className="w-full h-full object-cover select-none"
                  loading="lazy"
                />
              </div>

              {/* 右侧核心信息 */}
              <div className="flex-1 min-w-0 space-y-2.5 w-full">
                {originalName && (
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
                    原名: {originalName}
                  </div>
                )}

                {/* 评分看板：与站内 glass-popover-item 统一 */}
                <div className="glass-popover-item rounded-sm p-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-mono text-base font-bold">
                        {typeof score === 'number' && score > 0 ? score.toFixed(1) : '-.-'}
                      </span>
                    </div>

                    {typeof rank === 'number' && rank > 0 && (
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-xs bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        Rank #{rank}
                      </span>
                    )}
                  </div>

                  {typeof totalVotes === 'number' && totalVotes > 0 && (
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {totalVotes.toLocaleString()} 人评价
                    </span>
                  )}
                </div>

                {/* 热度统计 */}
                {(doingCount !== undefined || collectCount !== undefined) && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    {doingCount !== undefined && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-500" />
                        <strong className="text-slate-700 dark:text-slate-200 font-mono font-medium">
                          {doingCount.toLocaleString()}
                        </strong>
                        人在追
                      </span>
                    )}
                    {collectCount !== undefined && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <strong className="text-slate-700 dark:text-slate-200 font-mono font-medium">
                          {collectCount.toLocaleString()}
                        </strong>
                        人看过
                      </span>
                    )}
                  </div>
                )}

                {/* 元数据属性 */}
                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                  {detail?.date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>首播日期: <strong className="font-mono font-medium text-slate-700 dark:text-slate-300">{detail.date}</strong></span>
                    </div>
                  )}
                  {detail?.eps ? (
                    <div className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>总集数: <strong className="font-mono font-medium text-slate-700 dark:text-slate-300">全 {detail.eps} 话</strong></span>
                    </div>
                  ) : null}
                  {animeStudio && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">制作公司: {animeStudio}</span>
                    </div>
                  )}
                  {animeOriginal && (
                    <div className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">原作: {animeOriginal}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 剧情概要 */}
            {detail?.summary && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  剧情概要
                </span>
                <p className="glass-popover-item p-3 rounded-sm text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {detail.summary}
                </p>
              </div>
            )}

            {/* 热门标签云 */}
            {detail?.tags && detail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {detail.tags.slice(0, 8).map((t) => (
                  <span
                    key={t.name}
                    className="px-2 py-0.5 rounded-xs bg-white/70 dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-white/[0.08] text-[10.5px] font-mono shadow-2xs"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 底栏 */}
          <div className="px-4 py-3 border-t border-slate-200/60 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              按 ESC 或点击遮罩关闭
            </span>

            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white shadow-2xs transition-colors"
              >
                <span>在 Bangumi 查看</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AnimeDetailModal;
