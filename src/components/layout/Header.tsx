import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, LayoutGroup } from 'framer-motion';
import {
  Home as HomeIcon,
  FileText,
  History,
  Feather,
  MessageSquareQuote,
  Users,
  User,
} from 'lucide-react';
import { SearchModal } from '../search/SearchModal';
import { NavHoverPopover } from './NavHoverPopover';

export const Header: React.FC = () => {
  const [location] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // 全局快捷键 ⌘K / Ctrl+K 唤起搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const navLinks = [
    { href: '/', label: '首页', icon: HomeIcon },
    { href: '/posts', label: '文稿', icon: FileText },
    { href: '/archives', label: '归档', icon: History },
    { href: '/diaries', label: '手记', icon: Feather },
    { href: '/says', label: '动态', icon: MessageSquareQuote },
    { href: '/friends', label: '朋友', icon: Users },
    { href: '/about', label: '关于', icon: User },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const handleNavMouseEnter = (href: string, e: React.MouseEvent<HTMLAnchorElement>) => {
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-3.5 pb-2 pointer-events-none font-sans">
        {/* 正中心纯粹居中导航栏 */}
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[2.4rem]">
          <div
            className="pointer-events-auto flex items-center justify-center relative"
            onMouseLeave={handleNavMouseLeave}
          >
            <LayoutGroup id="nav-rectangular-group">
              <nav
                ref={navRef}
                className="flex items-center p-1 rounded-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/65 dark:border-slate-800/65 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] gap-0.5 text-xs max-w-full overflow-x-auto"
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const IconComponent = link.icon;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onMouseEnter={(e) => handleNavMouseEnter(link.href, e)}
                      onClick={handleItemClick}
                      className={`relative px-2.5 py-1 rounded-sm transition-colors duration-150 select-none flex items-center justify-center gap-1.5 shrink-0 ${
                        active
                          ? 'text-slate-950 dark:text-slate-50 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* 选中项的独立小矩形卡片 */}
                      {active && (
                        <motion.span
                          layoutId="active-nav-block"
                          className="absolute inset-0 rounded-sm bg-white/95 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none -z-10"
                          transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                        />
                      )}

                      {/* 选中项专属图标 */}
                      {active && (
                        <IconComponent className="w-3.5 h-3.5 opacity-90 text-slate-800 dark:text-slate-200 flex-shrink-0" />
                      )}
                      <span className="leading-none translate-y-[0.5px]">{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </LayoutGroup>

            {/* Innei 风格导航悬浮 MegaMenu Popover (动态精准位置感知) */}
            <NavHoverPopover
              activeKey={hoveredNav}
              position={navPosition}
              onMouseEnter={handlePopoverMouseEnter}
              onMouseLeave={handlePopoverMouseLeave}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </header>

      {/* 搜索弹窗 (支持全局快捷键 ⌘K / Ctrl+K 调起) */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
