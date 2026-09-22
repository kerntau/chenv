import React, { useEffect, useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X,
  Star,
  ExternalLink,
  Flame,
  CheckCircle2,
  RotateCw,
  Calendar,
  Film,
  User,
  Building,
  BookOpen,
  Sparkles,
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
        {/* 全屏电影级沉浸景深遮罩 */}
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-xl z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />

        {/* 旗舰级流光暗曜水晶容器：精密内倒角高光、深邃通透的琉璃质感 */}
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden font-sans outline-none bg-slate-900/90 dark:bg-[#0B101B]/90 backdrop-blur-3xl border border-white/[0.12] shadow-[0_32px_84px_-16px_rgba(0,0,0,0.85),inset_0_1px_1px_0_rgba(255,255,255,0.18)] duration-250 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] flex flex-col max-h-[88vh] text-slate-200">
          
          {/* 电影幕布级全幅环境漫反射（源自海报的柔化氛围光晕） */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
            <img
              src={coverImage}
              alt=""
              aria-hidden="true"
              className="absolute -top-1/3 -left-1/4 w-[160%] h-[160%] object-cover blur-[80px] opacity-25 saturate-200 scale-110 transform-gpu"
            />
            {/* 顶层柔和暗场渐变，赋予层次纵深 */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/75 to-slate-950/95" />
          </div>

          {/* 右上角精致流光关闭按钮 */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.14] text-slate-400 hover:text-white backdrop-blur-md transition-all active:scale-95 border border-white/[0.1] shadow-2xs"
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
          <div className="relative z-10 overflow-y-auto px-6 pt-7 pb-5 sm:px-8 sm:pt-8 sm:pb-6 space-y-6">
            {/* 头部核心展映区：悬浮立体海报 + 高级电影信息流 */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-7 items-start">
              {/* 海报封面：双层光晕悬浮展位 */}
              <div className="relative shrink-0 w-32 sm:w-44 aspect-[1/1.42] self-center sm:self-start group">
                {/* 海报环境背光 */}
                <div
                  className="absolute -inset-1 rounded-xl opacity-40 blur-xl transition-opacity duration-300 group-hover:opacity-65"
                  style={{ backgroundImage: `url(${coverImage})`, backgroundSize: 'cover' }}
                  aria-hidden="true"
                />
                {/* 海报实体卡 */}
                <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20 bg-slate-800">
                  <img
                    src={coverImage}
                    alt={displayName}
                    className="w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* 精致水晶内高光 */}
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-xl pointer-events-none" />
                </div>
              </div>

              {/* 右侧流线信息架构 */}
              <div className="flex-1 min-w-0 space-y-4 w-full text-left">
                {/* 标题与原名 */}
                <div className="space-y-1 pr-8">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white/95 to-slate-300 bg-clip-text text-transparent leading-tight font-douyin">
                      {displayName}
                    </h2>
                    {loading && <RotateCw className="w-4 h-4 text-sky-400 animate-spin" />}
                  </div>
                  {originalName && (
                    <div className="text-xs font-mono text-slate-400/90 truncate tracking-wide">
                      {originalName}
                    </div>
                  )}
                </div>

                {/* 评分与专业指标带（告别红绿灯杂色，统一为极度舒适的黑金流光质感） */}
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <div className="flex items-baseline gap-1.5 text-amber-400">
                    <Star className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] translate-y-0.5 self-center" />
                    <span className="font-mono text-3xl font-black tracking-tight leading-none text-amber-400">
                      {typeof score === 'number' && score > 0 ? score.toFixed(1) : '-.-'}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-normal">
                      / 10
                    </span>
                  </div>

                  {typeof rank === 'number' && rank > 0 && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25 shadow-[0_0_12px_rgba(251,191,36,0.12)]">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Rank #{rank}
                    </span>
                  )}

                  {typeof totalVotes === 'number' && totalVotes > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      {totalVotes.toLocaleString()} 人评分
                    </span>
                  )}
                </div>

                {/* 追更热度（优雅的半透明磨砂徽标，克制高级） */}
                {(doingCount !== undefined || collectCount !== undefined) && (
                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs font-mono">
                    {doingCount !== undefined && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] backdrop-blur-md transition-colors">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-semibold text-white">{doingCount.toLocaleString()}</span>
                        <span className="text-slate-400">人在追</span>
                      </span>
                    )}
                    {collectCount !== undefined && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] backdrop-blur-md transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold text-white">{collectCount.toLocaleString()}</span>
                        <span className="text-slate-400">人看过</span>
                      </span>
                    )}
                  </div>
                )}

                {/* 极简电影元数据流（彻底移除生硬灰大方块，呼吸通透） */}
                <div className="pt-2 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  {detail?.date && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" /> 首播
                      </span>
                      <span className="font-mono text-slate-200 font-medium truncate">{detail.date}</span>
                    </div>
                  )}
                  {detail?.eps ? (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
                        <Film className="w-3.5 h-3.5 text-slate-500" /> 规格
                      </span>
                      <span className="font-mono text-slate-200 font-medium">全 {detail.eps} 话</span>
                    </div>
                  ) : null}
                  {animeOriginal && (
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 truncate">
                      <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
                        <User className="w-3.5 h-3.5 text-slate-500" /> 原作
                      </span>
                      <span className="text-slate-200 font-medium truncate">{animeOriginal}</span>
                    </div>
                  )}
                  {animeStudio && (
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2 truncate">
                      <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-[11px] shrink-0">
                        <Building className="w-3.5 h-3.5 text-slate-500" /> 制作
                      </span>
                      <span className="text-slate-200 font-medium truncate">{animeStudio}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 剧情概要（极简典雅出版级排版） */}
            {detail?.summary && (
              <div className="pt-3 border-t border-white/[0.08] space-y-2 text-left">
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                  <span>剧情概要</span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-300/90 font-sans whitespace-pre-line tracking-normal select-text pl-3 border-l-2 border-white/[0.12]">
                  {detail.summary}
                </p>
              </div>
            )}

            {/* 热门品类微标签（素雅黑晶微胶囊，彻底去除塑料感） */}
            {detail?.tags && detail.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {detail.tags.slice(0, 10).map((t) => (
                  <span
                    key={t.name}
                    className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] hover:border-white/[0.14] text-[11px] font-mono backdrop-blur-sm transition-all cursor-default"
                  >
                    #{t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 底部行动栏（深邃通透，精密微型 ESC 键与高质感冰蓝琉璃按钮） */}
          <div className="relative z-10 px-6 py-3.5 sm:px-8 border-t border-white/[0.08] bg-slate-950/60 backdrop-blur-2xl flex items-center justify-between shrink-0">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.08] text-slate-300 border border-white/[0.12] shadow-2xs">ESC</kbd>
              <span className="hidden sm:inline">或点击背景关闭</span>
            </span>

            {item.href && (
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-[0_4px_16px_rgba(14,165,233,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] border border-sky-400/40 active:scale-[0.98] transition-all"
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
