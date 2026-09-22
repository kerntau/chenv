import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, Sun, Moon, Monitor, ChevronUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { siteConfig } from '../../content';
import { TechIcon } from '../ui/TechIcon';

const DEFAULT_NAV_COLUMNS = [
  {
    title: '关于',
    links: [
      { label: '关于此项目', href: 'https://github.com/kerntau/chenv', isExternal: true },
      { label: '知识库', href: 'https://wiki.chenv.cn', isExternal: true },
      { label: '简历', href: 'https://cv.chenv.cn', isExternal: true },
    ],
  },
  {
    title: '更多',
    links: [
      { label: '动态手记', href: '/diaries' },
      { label: '全站归档', href: '/archives' },
      { label: '志同道合', href: '/friends' },
    ],
  },
  {
    title: '联系',
    links: [
      { label: '发邮件', href: 'mailto:i@chenv.cn', isExternal: true },
      { label: 'GitHub', href: 'https://github.com/kerntau', isExternal: true },
      { label: '日常说说', href: '/says' },
    ],
  },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const footer = siteConfig.footer;
  const sinceYear = footer?.sinceYear || 2024;
  const navColumns = footer?.navColumns && footer.navColumns.length > 0 ? footer.navColumns : DEFAULT_NAV_COLUMNS;
  const showThemeToggle = footer?.showThemeToggle ?? true;
  const showRss = footer?.showRss ?? true;
  const showSitemap = footer?.showSitemap ?? true;
  const icpUrl = footer?.icpUrl || (footer?.icp ? `https://icp.gov.moe/?keyword=${footer.icp.replace(/[^0-9]/g, '')}` : '#');
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = React.useState(false);
  const themeMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isThemeMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [isThemeMenuOpen]);

  const currentThemeIcon =
    theme === 'light' ? (
      <Sun className="w-3 h-3 text-amber-500" />
    ) : theme === 'dark' ? (
      <Moon className="w-3 h-3 text-sky-400" />
    ) : (
      <Monitor className="w-3 h-3 text-slate-400" />
    );

  return (
    <footer
      className="relative z-10 mt-auto pt-6 pb-8 sm:pt-8 sm:pb-8 text-xs font-sans text-slate-600 dark:text-slate-400 select-none shrink-0 bg-transparent"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-4.5">
        {/* 顶部柔和羽化渐变细线，消除全屏硬切割感 */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/60 dark:via-white/[0.08] to-transparent mb-3 sm:mb-4" />
        
        {/* 上层: 左侧站名标语与版权，右侧多列导航 */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8 md:gap-10">
          {/* 左侧品牌与格调 */}
          <div className="space-y-2 max-w-sm">
            {/* 签名/品牌名：提升字号与字重，更具辨识度 */}
            <div
              className="font-serif italic font-medium text-xl sm:text-2xl text-sky-600 dark:text-sky-400 tracking-wider"
              style={{ fontFamily: 'Lora, "LXGW WenKai", "Newsreader", Georgia, serif' }}
            >
              {siteConfig.author.name || siteConfig.title}
            </div>
            {/* 卷尾金句：心中有景，花香满径 */}
            <p
              className="text-[13px] sm:text-sm text-slate-700 dark:text-slate-200 tracking-wide font-normal font-xingshu leading-relaxed"
              style={{ fontFamily: '"hongleixingshu", cursive, serif' }}
            >
              &ldquo;心中有景，花香满径&rdquo;
            </p>
            {/* 版权与驱动信息 */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono leading-relaxed pt-0.5">
              <span>&copy; {sinceYear}-{currentYear}</span>
              <span className="opacity-40">•</span>
              <span>Powered by</span>
              <a
                href="https://rsbuild.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group no-underline"
              >
                <TechIcon name="rsbuild" className="w-3 h-3 shrink-0 group-hover:scale-110 transition-transform" />
                <span>Rsbuild</span>
              </a>
              <span className="opacity-40">&amp;</span>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group no-underline"
              >
                <TechIcon name="react" className="w-3 h-3 shrink-0 group-hover:scale-110 transition-transform" />
                <span>React 19</span>
              </a>
            </div>
          </div>

          {/* 右侧导航列：移动端 3 列自适应舒适间距 */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 md:gap-10 pt-1">
            {navColumns.map((col, idx) => (
              <div key={col.title || idx} className="space-y-1.5 sm:space-y-2">
                <div className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {col.title}
                </div>
                <ul className="space-y-1 sm:space-y-1.5 text-xs">
                  {col.links.map((link, lIdx) => {
                    const isExt = link.isExternal || link.href.startsWith('http') || link.href.startsWith('mailto:');
                    return (
                      <li key={link.label || lIdx}>
                        {isExt ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center py-1 sm:py-0.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors no-underline"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-0.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors shrink-0" />
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="inline-flex items-center py-1 sm:py-0.5 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors no-underline"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 下层: 底部信息与操作栏 */}
        <div className="pt-3.5 sm:pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] font-mono text-slate-400 dark:text-slate-500">
          {/* 移动端专属响应式排版 (sm:hidden) */}
          <div className="flex flex-col gap-2 sm:hidden">
            {/* 上行: 左侧 RSS · 站点地图，右侧 主题切换器（两端饱满对齐，消除空白突兀感） */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2.5">
                {showRss && (
                  <a
                    href="/feed.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                    title="RSS 2.0 订阅源"
                  >
                    RSS 订阅
                  </a>
                )}
                {showRss && showSitemap && (
                  <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                )}
                {showSitemap && (
                  <Link
                    href="/sitemap"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    站点地图
                  </Link>
                )}
              </div>

              {/* 移动端主题切换器 */}
              {showThemeToggle && (
                <div ref={themeMenuRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsThemeMenuOpen((prev) => !prev)}
                    className="glass-switcher inline-flex items-center gap-1.5 py-1 px-2.5 rounded-md text-[11px] font-mono text-slate-700 dark:text-slate-200 cursor-pointer active:scale-95 transition-all select-none"
                    aria-label="切换主题模式"
                    aria-expanded={isThemeMenuOpen}
                  >
                    {currentThemeIcon}
                    <span className="capitalize">{theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}</span>
                    <ChevronUp
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                        isThemeMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* 移动端展开浮层选项：右贴齐向上弹出 */}
                  {isThemeMenuOpen && (
                    <div className="absolute bottom-full mb-2 right-0 z-30 glass-modal p-1 rounded-md shadow-xl flex items-center gap-1 text-[11px] border border-white/20 dark:border-white/10 backdrop-blur-xl whitespace-nowrap">
                      {(['light', 'system', 'dark'] as const).map((t) => {
                        const label = t === 'light' ? 'Light' : t === 'system' ? 'System' : 'Dark';
                        const isActive = theme === t;
                        const Icon = t === 'light' ? Sun : t === 'dark' ? Moon : Monitor;
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => {
                              setTheme(t);
                              setIsThemeMenuOpen(false);
                            }}
                            className={`inline-flex items-center gap-1 py-1 px-2 rounded-xs text-[11px] font-mono transition-all cursor-pointer ${
                              isActive
                                ? 'glass-nav-pill font-medium text-slate-900 dark:text-slate-100'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-white/[0.05]'
                            }`}
                          >
                            <Icon className="w-3 h-3 opacity-80" />
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 下行: 备案号与自定义文案（从容停靠于左下方） */}
            {(footer?.icp || (footer?.customText && !footer.customText.includes('心中有景'))) && (
              <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-slate-400/90 dark:text-slate-500 pt-0.5">
                {footer?.icp && (
                  <a
                    href={icpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                  >
                    {footer.icp}
                  </a>
                )}
                {footer?.icp && footer?.customText && !footer.customText.includes('心中有景') && (
                  <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                )}
                {footer?.customText && !footer.customText.includes('心中有景') && (
                  <span>{footer.customText}</span>
                )}
              </div>
            )}
          </div>

          {/* 桌面端经典单行两端对齐 (hidden sm:flex) */}
          <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {showRss && (
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                  title="RSS 2.0 订阅源"
                >
                  RSS 订阅
                </a>
              )}
              {showRss && showSitemap && (
                <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
              )}
              {showSitemap && (
                <Link
                  href="/sitemap"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  站点地图
                </Link>
              )}
              {(showRss || showSitemap) && footer?.icp && (
                <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
              )}
              {footer?.icp && (
                <a
                  href={icpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors py-0.5 inline-flex items-center no-underline"
                >
                  {footer.icp}
                </a>
              )}
              {footer?.customText && !footer.customText.includes('心中有景') && (
                <>
                  <span className="text-slate-300 dark:text-slate-700 select-none">&bull;</span>
                  <span>{footer.customText}</span>
                </>
              )}
            </div>

            {/* 大屏端：经典三选一并列药丸 */}
            {showThemeToggle && (
              <div className="glass-switcher inline-flex items-center gap-0.5 p-[2px] rounded-md text-[11px] leading-none shrink-0">
                {(['light', 'system', 'dark'] as const).map((t, idx) => {
                  const label = t === 'light' ? 'Light' : t === 'system' ? 'System' : 'Dark';
                  const isActive = theme === t;
                  return (
                    <React.Fragment key={t}>
                      {idx > 0 && (
                        <span className="text-slate-300 dark:text-slate-700 text-[8px] leading-none select-none px-0.5">&bull;</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setTheme(t)}
                        className={`transition-all cursor-pointer py-0.5 px-1.5 rounded-xs leading-none ${
                          isActive
                            ? 'glass-nav-pill font-medium text-slate-900 dark:text-slate-100'
                            : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-white/[0.05]'
                        }`}
                      >
                        {label}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
