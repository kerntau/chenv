import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Home as HomeIcon,
  FileText,
  History,
  Feather,
  MessageSquareQuote,
  Users,
  User,
  Sparkles,
  Link2,
  Globe,
  ArrowUpRight,
  Images,
  Tv,
  Film,
  Clapperboard,
  MonitorPlay,
  CirclePlay,
  MoreHorizontal,
} from 'lucide-react';
import { SearchModal } from '../search/SearchModal';
import { NavHoverPopover } from './NavHoverPopover';
import { siteConfig } from '../../content';
import type { NavLinkItem } from '../../types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  HomeIcon,
  FileText,
  History,
  Feather,
  MessageSquareQuote,
  Users,
  User,
  Sparkles,
  Link2,
  Globe,
  Images,
  Tv,
  Film,
  Clapperboard,
  MonitorPlay,
  CirclePlay,
};

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
  { id: 'nav-home', href: '/', label: '首页', icon: 'HomeIcon', enabled: true },
  { id: 'nav-archives', href: '/archives', label: '归档', icon: 'History', enabled: true },
  { id: 'nav-diaries', href: '/diaries', label: '手记', icon: 'Feather', enabled: true },
  { id: 'nav-says', href: '/says', label: '动态', icon: 'MessageSquareQuote', enabled: true },
  { id: 'nav-gallery', href: '/gallery', label: '追漫', icon: 'Film', enabled: true },
  { id: 'nav-friends', href: '/friends', label: '朋友', icon: 'Users', enabled: true },
  { id: 'nav-about', href: '/about', label: '关于', icon: 'User', enabled: true },
];

export const Header: React.FC = () => {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // 判断当前页面是否属于手记详情页
  const isDetailPage = useMemo(() => {
    return /^\/(diaries|journal|shouji)\/[^/]+$/.test(location);
  }, [location]);

  // 判断当前页面是否属于追漫沉浸式全屏路由
  const isGalleryPage = useMemo(() => {
    return /^\/(gallery|bangumi|anime|photos|wall)(\/.*)?$/.test(location);
  }, [location]);

  // 控制详情页向下滚动时导航栏收起，向上滚动时呼出
  const [isNavVisible, setIsNavVisible] = useState(true);

  useEffect(() => {
    if (!isDetailPage) {
      setIsNavVisible(true);
      return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY <= 60) {
            setIsNavVisible(true);
          } else if (currentScrollY > lastScrollY + 8) {
            setIsNavVisible(false);
            setHoveredNav(null);
          } else if (currentScrollY < lastScrollY - 8) {
            setIsNavVisible(true);
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDetailPage]);

  const headerConfig = siteConfig.header;
  const enableMegaMenu = headerConfig?.enableMegaMenu ?? true;
  const enableSearch = headerConfig?.enableSearch ?? true;

  // 过滤出启用的导航项
  const navLinks = (headerConfig?.navLinks || DEFAULT_NAV_LINKS).filter((l) => l.enabled !== false);

  // 全局快捷键 ⌘K / Ctrl+K 唤起搜索
  useEffect(() => {
    if (!enableSearch) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableSearch]);

  // 导航项 Hover 悬浮联动状态
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [navPosition, setNavPosition] = useState<{
    centerX: number;
    viewportCenterX: number;
    itemWidth: number;
    navWidth: number;
    navLeft: number;
  } | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const handleNavMouseEnter = (href: string, e: React.MouseEvent<HTMLElement>) => {
    if (!enableMegaMenu || href === '/' || href.startsWith('http')) {
      setHoveredNav(null);
      return;
    }
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (navRef.current) {
      const containerRect = navRef.current.getBoundingClientRect();
      const targetRect = e.currentTarget.getBoundingClientRect();
      const relativeCenter = targetRect.left + targetRect.width / 2 - containerRect.left;
      const viewportCenter = targetRect.left + targetRect.width / 2;

      setNavPosition({
        centerX: relativeCenter,
        viewportCenterX: viewportCenter,
        itemWidth: targetRect.width,
        navWidth: containerRect.width,
        navLeft: containerRect.left,
      });
    }
    setHoveredNav(href);
  };

  const handleNavMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 180);
  };

  const handlePopoverMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 180);
  };

  const handleItemClick = () => {
    setHoveredNav(null);
  };

  // 移动端“更多”菜单收缩与展开状态
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  useEffect(() => {
    setMobileMoreOpen(false);
  }, [location]);

  // 移动端收缩项：归档 与 关于
  const COLLAPSED_IN_MOBILE_HREFS = ['/archives', '/about'];
  const isCollapsedInMobile = (href: string) => COLLAPSED_IN_MOBILE_HREFS.includes(href);
  const collapsedMobileLinks = useMemo(
    () => navLinks.filter((l) => isCollapsedInMobile(l.href)),
    [navLinks]
  );
  const isMoreActive = useMemo(
    () => collapsedMobileLinks.some((l) => isActive(l.href)),
    [collapsedMobileLinks, location]
  );

  return (
    <>
      <header
        className={`${
          isGalleryPage ? 'absolute top-0 inset-x-0' : 'sticky top-0'
        } z-40 w-full px-4 sm:px-6 pt-2 pb-1 sm:pt-3 sm:pb-1.5 lg:pt-2.5 lg:pb-1 pointer-events-none font-sans transition-all duration-300 ease-in-out ${
          !isNavVisible && isDetailPage
            ? '-translate-y-full opacity-0'
            : 'translate-y-0 opacity-100'
        }`}
      >
        {/* 正中心纯粹居中导航栏 */}
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[2.4rem]">
          <div
            className="pointer-events-auto flex items-center justify-center relative"
            onMouseLeave={handleNavMouseLeave}
          >
              <nav
                ref={navRef}
                className="glass-nav flex items-center p-1 rounded-md gap-0.5 text-xs max-w-full overflow-visible sm:overflow-x-auto transition-all"
              >
                {navLinks.map((link) => {
                  const isExt = link.isExternal || link.href.startsWith('http');
                  const active = !isExt && isActive(link.href);
                  const IconComponent = ICON_MAP[link.icon] || FileText;
                  const isCollapsed = isCollapsedInMobile(link.href);
                  const displayClass = isCollapsed ? 'hidden sm:flex' : 'flex';

                  if (isExt) {
                    return (
                      <a
                        key={link.id || link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`relative px-2.5 py-1 rounded-sm transition-all duration-150 select-none items-center justify-center gap-1.5 shrink-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-white/[0.09] hover:shadow-2xs ${displayClass}`}
                      >
                        <span className="leading-none">{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-60 ml-[-2px]" />
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={link.id || link.href}
                      href={link.href}
                      onMouseEnter={(e) => handleNavMouseEnter(link.href, e)}
                      onClick={handleItemClick}
                      className={`relative px-2.5 py-1 rounded-sm transition-all duration-150 select-none items-center justify-center gap-1.5 shrink-0 ${displayClass} ${
                        active
                          ? 'text-slate-950 dark:text-slate-100 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-white/[0.09]'
                      }`}
                    >
                      {/* 静态的选中项水晶胶囊薄片 */}
                      {active && (
                        <span
                          className="glass-nav-pill absolute inset-0 rounded-sm pointer-events-none -z-10 transition-all duration-300"
                        />
                      )}
                      {/* 选中项专属图标 */}
                      {active && (
                        <IconComponent className="w-3.5 h-3.5 opacity-90 text-slate-800 dark:text-slate-100 flex-shrink-0" />
                      )}
                      <span className="leading-none">{link.label}</span>
                    </Link>
                  );
                })}

                {/* 移动端收缩项：更多 */}
                {collapsedMobileLinks.length > 0 && (
                  <div className="relative sm:hidden flex items-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setMobileMoreOpen((prev) => !prev)}
                      className={`relative px-2 py-1 rounded-sm transition-all duration-150 select-none flex items-center justify-center gap-1 shrink-0 ${
                        isMoreActive
                          ? 'text-slate-950 dark:text-slate-100 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/70 dark:hover:bg-white/[0.09]'
                      }`}
                      aria-expanded={mobileMoreOpen}
                      aria-label="更多导航项"
                    >
                      {isMoreActive && (
                        <span className="glass-nav-pill absolute inset-0 rounded-sm pointer-events-none -z-10 transition-all duration-300" />
                      )}
                      <MoreHorizontal className="w-3.5 h-3.5 opacity-80" />
                      <span className="leading-none">更多</span>
                    </button>

                    {mobileMoreOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40 bg-transparent"
                          onClick={() => setMobileMoreOpen(false)}
                          aria-hidden="true"
                        />
                        <div
                          className="glass-popover absolute top-full right-0 mt-2 p-1.5 rounded-md min-w-[125px] shadow-xl z-50 flex flex-col gap-1 text-xs animate-in fade-in zoom-in-95 duration-150"
                          role="menu"
                        >
                          {collapsedMobileLinks.map((link) => {
                            const active = isActive(link.href);
                            const IconComponent = ICON_MAP[link.icon] || FileText;
                            return (
                              <Link
                                key={link.id || link.href}
                                href={link.href}
                                onClick={() => {
                                  setMobileMoreOpen(false);
                                  handleItemClick();
                                }}
                                className={`glass-popover-item relative flex items-center gap-2 px-2.5 py-1.5 rounded-sm transition-all duration-150 ${
                                  active
                                    ? 'text-sky-600 dark:text-sky-400 font-medium bg-white/90 dark:bg-white/10 shadow-2xs'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}
                                role="menuitem"
                              >
                                <IconComponent className="w-3.5 h-3.5 opacity-85 shrink-0" />
                                <span className="flex-1 text-left">{link.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </nav>

            {/* 导航悬浮预览卡片 MegaMenu Popover */}
            {enableMegaMenu && (
              <NavHoverPopover
                activeKey={hoveredNav}
                position={navPosition}
                onMouseEnter={handlePopoverMouseEnter}
                onMouseLeave={handlePopoverMouseLeave}
                onItemClick={handleItemClick}
              />
            )}
          </div>
        </div>
      </header>

      {/* 搜索弹窗 */}
      {enableSearch && (
        <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
      )}
    </>
  );
};
