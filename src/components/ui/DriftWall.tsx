import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { DriftWallItem } from '../../types';

export type { DriftWallItem };

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  onItemClick?: (item: DriftWallItem, e: React.MouseEvent) => void;
}

interface ColumnMeta {
  copyHeight: number;
  copies: number;
}

const DEFAULT_ITEMS: DriftWallItem[] = [
  { image: 'https://cn.bing.com/th?id=OHR.WinnatsPassPeak_ZH-CN4443458412_1920x1080.jpg&rf=LaDigue_1920x1080.jpg', title: '温纳茨山口', href: 'https://cn.bing.com/th?id=OHR.WinnatsPassPeak_ZH-CN4443458412_1920x1080.jpg' },
  { image: 'https://cn.bing.com/th?id=OHR.MisurinaPeak_ZH-CN3877105161_1920x1080.jpg&rf=LaDigue_1920x1080.jpg', title: '米苏里纳群峰', href: 'https://cn.bing.com/th?id=OHR.MisurinaPeak_ZH-CN3877105161_1920x1080.jpg' },
  { image: 'https://cn.bing.com/th?id=OHR.BeechEngland_ZH-CN1807343872_1920x1080.jpg&rf=LaDigue_1920x1080.jpg', title: '南唐斯国家公园', href: 'https://cn.bing.com/th?id=OHR.BeechEngland_ZH-CN1807343872_1920x1080.jpg' },
  { image: 'https://cn.bing.com/th?id=OHR.Santenay_ZH-CN5676942384_1920x1080.jpg&rf=LaDigue_1920x1080.jpg', title: '索林风车', href: 'https://cn.bing.com/th?id=OHR.Santenay_ZH-CN5676942384_1920x1080.jpg' },
  { image: 'https://cn.bing.com/th?id=OHR.FrenchRivieraVillage_ZH-CN2888811422_1920x1080.jpg&rf=LaDigue_1920x1080.jpg', title: '滨海自由城', href: 'https://cn.bing.com/th?id=OHR.FrenchRivieraVillage_ZH-CN2888811422_1920x1080.jpg' },
];

const cx = (...parts: (string | false | undefined | null)[]) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

interface DriftTileProps {
  item: DriftWallItem;
  id: string;
  colIndex: number;
  isActive: boolean;
  onFocus: () => void;
  onBlur: () => void;
  innerClass: string;
  imgClass: string;
  overlayClass: string;
  titleBadgeClass: string;
  tileClass: string;
  onItemClick?: (item: DriftWallItem, e: React.MouseEvent) => void;
}

const DriftTile: React.FC<DriftTileProps> = React.memo(({
  item,
  id,
  colIndex,
  isActive,
  onFocus,
  onBlur,
  innerClass,
  imgClass,
  overlayClass,
  titleBadgeClass,
  tileClass,
  onItemClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const domRef = useRef<HTMLElement | null>(null);

  // 可靠国漫兜底封面
  const fallbackImage = 'https://lain.bgm.tv/pic/cover/l/4c/12/345802_d9vBf.jpg';

  const inner = (
    <span className={innerClass}>
      {/* 渐进式骨架微光层（未完成完全加载时平滑过渡） */}
      {!isLoaded && (
        <span className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/60 animate-pulse overflow-hidden">
          <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </span>
      )}

      <img
        src={item.image || fallbackImage}
        alt={item.title ?? ''}
        loading="lazy"
        decoding="async"
        draggable={false}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          if (e.currentTarget.src !== fallbackImage) {
            e.currentTarget.src = fallbackImage;
          }
          setIsLoaded(true);
        }}
        className={cx(
          imgClass,
          'transition-[filter,transform] duration-500 ease-out'
        )}
      />

      <span className={overlayClass} aria-hidden="true" />
      {item.title && <span className={titleBadgeClass}>{item.title}</span>}
    </span>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (onItemClick) {
      e.preventDefault();
      onItemClick(item, e);
    }
  };

  const commonProps = {
    className: cx(tileClass, isActive && 'is-active'),
    'data-tile-id': id,
    'data-col': colIndex,
    onFocus,
    onBlur,
    onClick: handleClick,
  };

  if (item.href) {
    return (
      <a
        ref={(el) => { domRef.current = el; }}
        key={id}
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        {...commonProps}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      ref={(el) => { domRef.current = el; }}
      key={id}
      tabIndex={0}
      role="button"
      aria-label={item.title ?? 'tile'}
      {...commonProps}
    >
      {inner}
    </div>
  );
});

export const DriftWall: React.FC<DriftWallProps> = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 6,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = '#060010',
  scale = 1,
  className = '',
  style,
  onItemClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    const sourceItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
    sourceItems.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : sourceItems.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const targetCoverage = Math.max(containerHeight * 3.2, 2800);
      const copies = Math.max(3, Math.ceil(targetCoverage / copyHeight) + 2);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      if (entry?.contentRect?.height) {
        setContainerHeight(entry.contentRect.height);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(${scale}) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [scale, tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] = (velocitiesRef.current[c] ?? 0) + (target - (velocitiesRef.current[c] ?? 0)) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number): void => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback((): void => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      if (!tile) return;
      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const maskStyle =
    fade > 0
      ? `radial-gradient(ellipse 92% 92% at 50% 50%, #000 ${Math.max(20, (1 - fade) * 100)}%, transparent 100%)`
      : undefined;

  const cssVars = useMemo<CSSProperties>(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        ...(maskStyle ? { WebkitMaskImage: maskStyle, maskImage: maskStyle } : {}),
        ...style,
      }) as CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, perspective, maskStyle, style]
  );

  const tileClass = cx(
    'group/tile relative block flex-none cursor-pointer outline-none',
    'w-full h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]'
  );

  const innerClass = cx(
    'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden',
    'bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/40 dark:border-white/10',
    'rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] [transform:translateZ(0)]',
    'transition-[transform,opacity,box-shadow] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:translateZ(var(--dw-lift))]',
    'group-[.is-active]/tile:shadow-[0_4px_16px_rgba(0,0,0,0.14)] dark:group-[.is-active]/tile:shadow-[0_4px_16px_rgba(0,0,0,0.45)]',
    'group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:translateZ(var(--dw-lift))]',
    'group-focus-visible/tile:shadow-[0_4px_16px_rgba(0,0,0,0.14),0_0_0_2px_rgba(56,189,248,0.8)] dark:group-focus-visible/tile:shadow-[0_4px_16px_rgba(0,0,0,0.45),0_0_0_2px_rgba(255,255,255,0.9)]'
  );

  const imgClass = cx(
    'block h-full w-full select-none object-cover',
    '[filter:grayscale(var(--dw-gray))_saturate(0.92)]',
    'transition-[filter] duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.05)] group-focus-visible/tile:[filter:grayscale(0)_saturate(1.05)]'
  );

  const overlayClass = cx(
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.25]',
    'transition-opacity duration-[420ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0'
  );

  const titleBadgeClass = cx(
    'pointer-events-none absolute bottom-2 left-2 right-2 px-2 py-1 rounded text-xs text-white/90',
    'bg-black/60 backdrop-blur-md opacity-0 transition-opacity duration-300 truncate',
    'group-[.is-active]/tile:opacity-100 group-focus-visible/tile:opacity-100 font-sans'
  );



  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    return (
      <DriftTile
        key={id}
        item={item}
        id={id}
        colIndex={colIndex}
        isActive={activeId === id}
        onFocus={() => activate(id, colIndex)}
        onBlur={release}
        innerClass={innerClass}
        imgClass={imgClass}
        overlayClass={overlayClass}
        titleBadgeClass={titleBadgeClass}
        tileClass={tileClass}
        onItemClick={onItemClick}
      />
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden flex items-center justify-center', className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div
        ref={planeRef}
        style={{
          transform: `translate(-50%, -50%) scale(${scale}) rotateX(${tilt}deg) rotateY(${turn}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`,
        }}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          if (!meta) return null;
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
