import React, { useEffect, useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Star,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import type { DriftWallItem } from '../../types';
import offlineAnimeDetails from '../../content/data/anime-details.json';

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
  // 从 URL 中解析 subject ID
  const subjectId = useMemo(() => {
    if (!item?.href) return null;
    const m = item.href.match(/subject\/(\d+)/);
    return m ? m[1] : null;
  }, [item?.href]);

  // 本地预烘焙离线数据（毫秒级秒开）
  const offlineDetail = useMemo(() => {
    if (!subjectId) return null;
    return ((offlineAnimeDetails as Record<string, any>)[subjectId] as BangumiSubjectDetail) || null;
  }, [subjectId]);

  const [detail, setDetail] = useState<BangumiSubjectDetail | null>(offlineDetail);
  const [loading, setLoading] = useState(false);

  // 当切换条目时，立即同步本地数据
  useEffect(() => {
    if (offlineDetail) {
      setDetail(offlineDetail);
      setLoading(false);
      return;
    }

    if (!item || !subjectId) {
      setDetail(null);
      return;
    }

    // 缓存回退
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
    } catch {}

    let mounted = true;
    setLoading(true);

    fetch(`https://api.bgm.tv/v0/subjects/${subjectId}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Chent/1.0 (https://chenv.cn)',
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
        } catch {}
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
  }, [item, subjectId, offlineDetail]);

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

  // 封面图优先读取本地持久化海报
  const coverImage =
    item.image ||
    detail?.images?.large?.replace(/^http:\/\//, 'https://') ||
    detail?.images?.common?.replace(/^http:\/\//, 'https://') ||
    '';

  const score = detail?.rating?.score;
  const rank = detail?.rating?.rank;

  return (
    <Dialog.Root open={!!item} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* 全站标准景深遮罩 */}
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200" />

        {/* 模态窗容器：接入全站顶奢 fluid glass-modal，消除塑料质感与暗色白底，优雅圆角 */}
        <Dialog.Content className="glass-modal fixed left-1/2 top-1/2 z-[100] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-md overflow-hidden font-sans outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex flex-col max-h-[88vh]">
          
          {/* 右上角极简关闭按钮 */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="关闭详情"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>

          <Dialog.Title className="sr-only">
            {displayName}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            {displayName} 的详细资料与简介
          </Dialog.Description>

          {/* 内容主滚动区 */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin">
            
            {/* 上半部分：左图右文基本信息（海报居中，与右侧信息自然呼应） */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* 左栏：封面海报（在左边垂直居中，比例协调） */}
              <div className="shrink-0 w-28 xs:w-32 sm:w-36 self-center">
                <div className="relative aspect-[2/3] rounded-xs overflow-hidden ring-1 ring-black/10 dark:ring-white/15 shadow-md dark:shadow-2xl bg-slate-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-[1.02]">
                  <img
                    src={coverImage}
                    alt={displayName}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* 右栏：基本信息（标题、评分、基础规格、词条外链） */}
              <div className="flex-1 min-w-0 space-y-2.5 self-center">
                {/* 标题 */}
                <div className="space-y-0.5 pr-6 sm:pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-douyin leading-snug">
                      {displayName}
                    </h2>
                    {loading && <RotateCw className="w-3.5 h-3.5 text-sky-500 animate-spin shrink-0" />}
                  </div>
                  {originalName && (
                    <div className="text-[11px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                      {originalName}
                    </div>
                  )}
                </div>

                {/* 评分与排名 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-baseline gap-1 text-amber-500 dark:text-amber-400">
                    <Star className="w-4 h-4 fill-current translate-y-0.5 self-center shrink-0" />
                    <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight leading-none text-slate-900 dark:text-slate-100">
                      {typeof score === 'number' && score > 0 ? score.toFixed(1) : '-.-'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 dark:text-slate-500">
                      / 10
                    </span>
                  </div>

                  {typeof rank === 'number' && rank > 0 && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-xs font-mono text-[10px] sm:text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shrink-0">
                      Rank #{rank}
                    </span>
                  )}
                </div>

                {/* 规格元数据列表：无廉价框线，极简清爽排版 */}
                <div className="space-y-1 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
                  {detail?.date && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] sm:text-xs shrink-0">首播</span>
                      <span className="font-mono text-slate-700 dark:text-slate-200">{detail.date}</span>
                    </div>
                  )}
                  {detail?.eps ? (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] sm:text-xs shrink-0">集数</span>
                      <span className="font-mono text-slate-700 dark:text-slate-200">全 {detail.eps} 话</span>
                    </div>
                  ) : null}
                  {animeOriginal && (
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] sm:text-xs shrink-0">原作</span>
                      <span className="truncate text-slate-700 dark:text-slate-200">{animeOriginal}</span>
                    </div>
                  )}
                  {animeStudio && (
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] sm:text-xs shrink-0">制作</span>
                      <span className="truncate text-slate-700 dark:text-slate-200">{animeStudio}</span>
                    </div>
                  )}
                  {/* 条目外链：无圆圈无胶囊，极简文本链接 */}
                  {item.href && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] sm:text-xs shrink-0">条目</span>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-xs text-slate-400 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                      >
                        <span>Bangumi 词条</span>
                        <ExternalLink className="w-3 h-3 opacity-70" />
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 下半部分：剧情简介与纯净标签（通栏全景展开，阅读呼吸感充足） */}
            {detail?.summary && (
              <div className="border-t border-slate-200/60 dark:border-white/[0.08] pt-4 space-y-3">
                <p className="text-xs sm:text-[13.5px] leading-relaxed text-slate-600 dark:text-slate-300 font-sans whitespace-pre-line select-text text-justify max-h-56 sm:max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                  {detail.summary}
                </p>

                {/* 纯净标签流：彻底去除廉价圆圈泡泡背景与外边框 */}
                {detail?.tags && detail.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-[11px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 select-none">
                    {detail.tags.slice(0, 8).map((t) => (
                      <span
                        key={t.name}
                        className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-default"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AnimeDetailModal;
