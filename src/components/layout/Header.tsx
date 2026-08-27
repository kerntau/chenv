import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, LayoutGroup } from 'framer-motion';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Home as HomeIcon,
  BookOpen,
  PenTool,
  Sparkles,
  Users,
  MoreHorizontal,
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { SearchModal } from '../search/SearchModal';
import { NavHoverPopover } from './NavHoverPopover';
import { siteConfig } from '../../content';

export const Header: React.FC = () => {
  const [location] = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { href: '/posts', label: '文稿', icon: BookOpen },
    { href: '/diaries', label: '手记', icon: PenTool },
    { href: '/says', label: '动态', icon: Sparkles },
    { href: '/friends', label: '朋友', icon: Users },
    { href: '/about', label: '更多', icon: MoreHorizontal },
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
        {/* 桌面端绝对对称居中容器 */}
        <div className="max-w-4xl mx-auto relative flex items-center justify-between md:justify-center min-h-[2.4rem]">
          
          {/* 左侧: 方圆头像 (小圆角 rounded-lg) */}
          <div className="md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2 pointer-events-auto flex items-center">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200/75 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-2xs flex-shrink-0 group focus:outline-none transition-transform active:scale-95 flex items-center justify-center"
              title={siteConfig.title}
            >
              <img
                src={siteConfig.author.avatar || '/avatar.webp'}
                alt={siteConfig.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
              />
            </Link>
          </div>

          {/* 中间: 100% 正中心居中导航栏 (小圆角矩形底框 rounded-lg) */}
          <div
            className="pointer-events-auto hidden md:flex items-center justify-center relative"
            onMouseLeave={handleNavMouseLeave}
          >
            <LayoutGroup id="nav-rectangular-group">
              <nav
                ref={navRef}
                className="flex items-center p-1 rounded-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/65 dark:border-slate-800/65 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] gap-0.5 text-xs"
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
                      className={`relative px-2.5 py-1 rounded-md transition-colors duration-150 select-none flex items-center justify-center gap-1.5 ${
                        active
                          ? 'text-slate-950 dark:text-slate-50 font-medium'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* 选中项的独立小矩形卡片 (小圆角 rounded-md) */}
                      {active && (
                        <motion.span
                          layoutId="active-nav-block"
                          className="absolute inset-0 rounded-md bg-white/95 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.4)] pointer-events-none -z-10"
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

          {/* 右侧: 操作按钮组 (小圆角矩形 rounded-lg) */}
          <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 pointer-events-auto flex items-center p-1 rounded-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/65 dark:border-slate-800/65 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.03)] gap-0.5">
            {/* 搜索按钮 */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center"
              title="全局搜索 (⌘K)"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* 深浅主题切换 */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center"
              title={isDark ? '切换至浅色模式' : '切换至深色模式'}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </button>

            {/* 移动端汉堡菜单 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 移动端展开浮层 */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-4xl mx-auto rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 p-2 space-y-1 shadow-lg pointer-events-auto animate-in fade-in zoom-in-95 duration-150 font-sans">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs transition-colors ${
                    active
                      ? 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-medium shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* 搜索弹窗 */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
