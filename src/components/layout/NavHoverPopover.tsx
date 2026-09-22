import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  getAllDiaries,
  getAllRecords,
  getAllFriends,
  getGalleryConfig,
  siteConfig,
} from '../../content';
import { formatRelativeTime, formatDateShort } from '../../lib/date';
import { LazyImage } from '../ui/LazyImage';

export interface NavPositionData {
  centerX: number;
  viewportCenterX: number;
  itemWidth: number;
  navWidth: number;
  navLeft: number;
}

interface NavHoverPopoverProps {
  activeKey: string | null;
  position: NavPositionData | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onItemClick: () => void;
}

const PANEL_WIDTHS: Record<string, number> = {
  '/archives': 460,
  '/diaries': 490,
  '/says': 390,
  '/gallery': 480,
  '/friends': 450,
  '/about': 380,
};

export const NavHoverPopover: React.FC<NavHoverPopoverProps> = ({
  activeKey,
  position,
  onMouseEnter,
  onMouseLeave,
  onItemClick,
}) => {
  const allDiaries = useMemo(() => getAllDiaries(), []);
  const allRecords = useMemo(() => getAllRecords(), []);
  const allFriends = useMemo(() => getAllFriends(), []);
  const galleryConfig = useMemo(() => getGalleryConfig(), []);

  // 提取去重后的 4 部精选国漫封面展示
  const previewAnimeList = useMemo(() => {
    const seen = new Set<string>();
    const list = [];
    for (const item of galleryConfig.items || []) {
      if (!item.title) continue;
      const baseTitle = item.title.replace(/\s*(第[一二三四五六七八九十\d]+季|年番|完结季|剧场版.*)/g, '').trim();
      if (!seen.has(baseTitle)) {
        seen.add(baseTitle);
        list.push(item);
      }
      if (list.length >= 4) break;
    }
    return list.length >= 4 ? list : (galleryConfig.items || []).slice(0, 4);
  }, [galleryConfig.items]);

  const isValidTab = Boolean(
    activeKey &&
      ['/archives', '/diaries', '/says', '/gallery', '/friends', '/about'].includes(
        activeKey
      )
  );
  const panelWidth = (activeKey && PANEL_WIDTHS[activeKey]) || 480;

  // 动态计算 Popover 相对于导航栏容器的 X 坐标偏移（带视口边界溢出防护）
  const targetLeft = useMemo(() => {
    if (!position) return 0;

    // 默认让 Popover 中心对准当前悬浮的导航项中心
    const rawLeft = position.centerX - panelWidth / 2;

    if (typeof window === 'undefined') return rawLeft;

    const safeMargin = 16;
    const viewportWidth = window.innerWidth;
    const popoverVpLeft = position.navLeft + rawLeft;
    const popoverVpRight = popoverVpLeft + panelWidth;

    let adjustment = 0;
    if (popoverVpLeft < safeMargin) {
      adjustment = safeMargin - popoverVpLeft;
    } else if (popoverVpRight > viewportWidth - safeMargin) {
      adjustment = viewportWidth - safeMargin - popoverVpRight;
    }

    return rawLeft + adjustment;
  }, [position, panelWidth]);

  // 计算顶部小指示箭头在 Popover 内部的相对 X 偏移量
  const arrowOffset = useMemo(() => {
    if (!position) return panelWidth / 2;
    const rawArrowX = position.centerX - targetLeft;
    return Math.max(28, Math.min(panelWidth - 28, rawArrowX));
  }, [position, targetLeft, panelWidth]);

  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isValidTab) {
      setIsRendered(true);
    }
  }, [isValidTab]);

  useGSAP(() => {
    if (isValidTab && isRendered) {
      // 物理弹簧有机缓动展开与位移
      gsap.to(containerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        x: targetLeft,
        width: panelWidth,
        duration: 0.28,
        ease: 'back.out(1.12)'
      });
      gsap.to(arrowRef.current, {
        left: arrowOffset,
        duration: 0.28,
        ease: 'back.out(1.12)'
      });
    } else if (!isValidTab && isRendered) {
      // 柔和退场
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 5,
        scale: 0.96,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => setIsRendered(false)
      });
    }
  }, [isValidTab, isRendered, targetLeft, panelWidth, arrowOffset]);

  return (
    <>
      {isRendered && (
        <div
          ref={containerRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-full mt-2.5 left-0 pointer-events-auto z-50 select-none font-sans before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:bg-transparent"
          style={{ opacity: 0, transform: 'translateY(8px) scale(0.96)' }}
        >
          {/* 顶部指示微型三角箭头 (跟随激活项平滑物理滑动，弱化高光切线) */}
          <div
            ref={arrowRef}
            className="absolute -top-1.5 w-3 h-3 rotate-45 bg-white/86 dark:bg-[#0F172A]/90 border-t border-l border-white/70 dark:border-white/[0.10] backdrop-blur-xl -translate-x-1/2 z-10 pointer-events-none shadow-[-2px_-2px_4px_rgba(0,0,0,0.02)]"
          />

          {/* 弹窗核心卡片容器 */}
          <div className="glass-popover w-full rounded-md overflow-hidden text-slate-800 dark:text-slate-200">
            
            {/* 1. 归档 (Archives) 悬浮面板 */}
            {activeKey === '/archives' && (
              <div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>手记时光 &bull; 聚合归档</span>
                    <span>共 {allDiaries.length} 篇</span>
                  </div>

                  {/* 最近 3 篇手记时光速览 */}
                  <div className="space-y-2">
                    {allDiaries.slice(0, 3).map((diary) => (
                      <Link
                        key={diary.slug}
                        href={`/diaries/${diary.slug}`}
                        onClick={onItemClick}
                        className="glass-popover-item group flex items-center justify-between p-3 rounded-sm"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                          <span className="text-[10px] font-sans text-slate-400 shrink-0">
                            {formatDateShort(diary.date)}
                          </span>
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                            {diary.title}
                          </span>
                        </div>
                        <span className="text-[11px] font-sans text-slate-400 shrink-0">
                          手记
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/archives"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span>进入完整时间轴年谱</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    随笔与手记年谱
                  </span>
                </div>
              </div>
            )}

            {/* 2. 手记 (Diaries) 悬浮面板 */}
            {activeKey === '/diaries' && (
              <div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>手记随笔 &bull; 最新灵感</span>
                    <span>{allDiaries.length} 则</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {allDiaries.slice(0, 4).map((diary) => (
                      <Link
                        key={diary.slug}
                        href={`/diaries/${diary.slug}`}
                        onClick={onItemClick}
                        className="glass-popover-item block p-3 rounded-sm group"
                      >
                        <div className="flex items-center justify-between text-[10px] font-sans text-slate-400 mb-1">
                          <span>{formatDateShort(diary.date)}</span>
                          {diary.weather && (
                            <span className="text-slate-400 dark:text-slate-500">
                              {diary.weather}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                          {diary.title}
                        </h4>
                        {diary.summary && (
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-humanist">
                            {diary.summary}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/diaries"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium"
                  >
                    <span>查看全部手记</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    共 {allDiaries.length} 则手记
                  </span>
                </div>
              </div>
            )}

            {/* 3. 动态 (Says) 悬浮面板 */}
            {activeKey === '/says' && (
              <div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>日常碎片 &bull; 最新动态</span>
                    <span>{allRecords.length} 条</span>
                  </div>
                  <div className="space-y-2">
                    {allRecords.slice(0, 3).map((record) => (
                      <Link
                        key={record.id}
                        href="/says"
                        onClick={onItemClick}
                        className="glass-popover-item block p-3 rounded-sm group"
                      >
                        <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed font-humanist">
                          {record.content}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{formatRelativeTime(String(record.createTime))}</span>
                          {record.mood && (
                            <span className="text-sky-600 dark:text-sky-400 font-sans">
                              # {record.mood}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/says"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium"
                  >
                    <span>查看全部动态</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    共 {allRecords.length} 条动态
                  </span>
                </div>
              </div>
            )}

            {/* 4. 朋友 (Friends) 悬浮面板 */}
            {activeKey === '/friends' && (
              <div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>志同道合 &bull; 朋友们</span>
                    <span>{allFriends.length} 位好友</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {allFriends.slice(0, 4).map((friend) => (
                      <a
                        key={friend.id}
                        href={friend.link}
                        target="_blank"
                        rel="noreferrer"
                        className="glass-popover-item p-2.5 rounded-sm group flex items-start space-x-2.5"
                      >
                        <div className="w-7 h-7 rounded-sm bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-200/50 dark:border-white/[0.08]">
                          {friend.avatar ? (
                            <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{friend.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                              {friend.name}
                            </span>
                            <ArrowUpRight className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors shrink-0" />
                          </div>
                          {friend.desc && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {friend.desc}
                            </p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/friends"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium"
                  >
                    <span>前往友链大厅</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    欢迎交换友链
                  </span>
                </div>
              </div>
            )}

            {/* 5. 追漫 (Gallery) 悬浮面板 */}
            {activeKey === '/gallery' && (
              <div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>光影流转 &bull; 在追国漫</span>
                    <span>共 {galleryConfig.items?.length || 0} 部</span>
                  </div>

                  {/* 4 部精选国漫竖版封面展示 */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {previewAnimeList.map((anime) => (
                      <Link
                        key={anime.title}
                        href="/gallery"
                        onClick={onItemClick}
                        className="group relative rounded-sm overflow-hidden bg-slate-100 dark:bg-slate-800/60 aspect-[1/1.38] border border-slate-200/50 dark:border-white/[0.08] hover:border-sky-400/50 dark:hover:border-sky-400/40 hover:shadow-[0_4px_12px_-2px_rgba(0,191,255,0.25)] transition-all duration-200 flex flex-col justify-end p-1.5"
                      >
                        {/* 竖版海报（带全站标准骨架屏与渐显动效） */}
                        <LazyImage
                          src={anime.image || ''}
                          alt={anime.title || ''}
                          aspectRatio="1/1.38"
                          containerClassName="absolute inset-0 w-full h-full"
                          className="group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* 下层柔和暗部渐变与光晕，保证文字清晰可辨 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

                        {/* 顶部微型高光标 */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#00BFFF] block" />
                        </div>

                        {/* 底部剧名 */}
                        <span className="relative z-10 w-full text-center text-[10.5px] font-medium text-white/95 leading-tight line-clamp-1 drop-shadow-xs group-hover:text-sky-200 transition-colors">
                          {anime.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/gallery"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span>进入沉浸式追漫流光画廊</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    玄幻修仙 &bull; 热血记忆
                  </span>
                </div>
              </div>
            )}

            {/* 6. 关于 (About) 悬浮面板 */}
            {activeKey === '/about' && (
              <div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono font-medium text-slate-400 dark:text-slate-500 px-1">
                    <span>数字花园 &bull; 个人档案</span>
                    <span className="text-emerald-500 flex items-center gap-1 font-mono text-[10.5px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      在席中
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5 p-3 rounded-sm bg-slate-100/60 dark:bg-white/[0.03] border border-slate-200/40 dark:border-white/[0.05]">
                    <img
                      src={siteConfig.author.avatar || '/avatar.png'}
                      alt={siteConfig.author.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-2xs shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 font-douyin">
                        {siteConfig.author.name}
                      </div>
                      <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
                        {siteConfig.home?.hero?.highlightRole || 'Cloud Native & Systems'}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                        {siteConfig.home?.hero?.skillsPills || 'Go • Rust • React 19 • K8s'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-white/55 dark:bg-white/[0.04] backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/about"
                    onClick={onItemClick}
                    className="group hover:text-slate-900 dark:hover:text-slate-100 transition-colors inline-flex items-center space-x-1 font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span>查阅履历与建站哲学</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono">
                    关于作者 &bull; 架构栈
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
