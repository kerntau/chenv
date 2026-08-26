import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, LayoutGroup } from 'framer-motion';
import { Search, Sun, Moon, Menu, X, Feather } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { SearchModal } from '../search/SearchModal';

export const Header: React.FC = () => {
  const [location] = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/posts', label: '文稿' },
    { href: '/notes', label: '速记' },
    { href: '/projects', label: '项目' },
    { href: '/says', label: '思考' },
    { href: '/friends', label: '朋友' },
    { href: '/about', label: '关于' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 pt-3 pb-2 transition-colors duration-200 pointer-events-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Innei 标志性浮动 Glass 胶囊容器 */}
          <div className="floating-pill rounded-full px-3 sm:px-4 py-1.5 flex items-center justify-between w-full shadow-sm transition-all duration-300">
            {/* 左侧个人标识 Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2.5 group focus:outline-none pl-1 pr-2 py-1 select-none"
            >
              <div className="w-7 h-7 rounded-full bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-105 duration-200 shadow-sm">
                <Feather className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-semibold text-sm tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                Perimsx
              </span>
            </Link>

            {/* 中间桌面端导航链接 + Framer Motion 滑动胶囊指示器 */}
            <LayoutGroup id="nav-pill-group">
              <nav
                className="hidden md:flex items-center space-x-0.5 relative font-sans text-xs"
                onMouseLeave={() => setHoveredTab(null)}
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const isHovered = hoveredTab === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onMouseEnter={() => setHoveredTab(link.href)}
                      className={`relative px-3 py-1.5 rounded-full transition-colors duration-150 z-10 select-none ${
                        active
                          ? 'text-stone-950 dark:text-stone-50 font-medium'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      {/* 活动状态 / 悬停滑动背板 */}
                      {active && (
                        <motion.span
                          layoutId="active-pill"
                          className="absolute inset-0 rounded-full bg-stone-200/75 dark:bg-stone-700/60 -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}

                      {!active && isHovered && (
                        <motion.span
                          layoutId="hover-pill"
                          className="absolute inset-0 rounded-full bg-stone-200/40 dark:bg-stone-800/40 -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}

                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </LayoutGroup>

            {/* 右侧工具组：搜索、主题切换、移动端汉堡按钮 */}
            <div className="flex items-center space-x-1.5">
              {/* 搜索按钮 */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 text-xs transition-colors"
                title="全局搜索 (⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-mono text-[10px] text-stone-400 dark:text-stone-500">
                  ⌘K
                </span>
              </button>

              {/* 深浅主题切换 */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors"
                title={isDark ? '切换至浅色纸质模式' : '切换至暖炭暗色模式'}
              >
                {isDark ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform rotate-0" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-stone-700 transition-transform rotate-0" />
                )}
              </button>

              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Menu className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端展开浮层 */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 max-w-4xl mx-auto floating-pill rounded-2xl p-3 space-y-1 shadow-lg pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2 rounded-xl text-xs font-sans transition-colors ${
                    active
                      ? 'bg-stone-200/70 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/40 dark:hover:bg-stone-800/40'
                  }`}
                >
                  {link.label}
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
