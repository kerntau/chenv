import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Activity,
  Link2,
  Tag,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Plus,
  ExternalLink,
  Sun,
  Moon,
  Database,
  FileCode2,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { AdminCommandPalette } from './AdminCommandPalette';

export type AdminViewType =
  | 'overview'
  | 'posts'
  | 'diaries'
  | 'records'
  | 'friends'
  | 'taxonomy'
  | 'settings'
  | 'fileEditor'
  | 'editor';

interface AdminLayoutProps {
  currentView: AdminViewType;
  onNavigate: (view: AdminViewType) => void;
  onOpenEditor: (type: 'post' | 'diary', slug?: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  onNavigate,
  onOpenEditor,
  children,
}) => {
  const { posts, diaries, records, friends, categories, siteConfig, preferences, savePreferences, storageUsage } = useAdminStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(preferences.sidebarCollapsed || false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // 主题与暗黑模式同步
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      savePreferences({ theme: 'dark' });
    } else {
      document.documentElement.classList.remove('dark');
      savePreferences({ theme: 'light' });
    }
  };

  // 全局快捷键 Ctrl+K / Cmd+K 唤起命令面板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navGroups = [
    {
      title: '工作台',
      items: [
        { id: 'overview' as const, label: '控制台总览', icon: LayoutDashboard, badge: null },
      ],
    },
    {
      title: '内容创作',
      items: [
        { id: 'posts' as const, label: '文章文稿', icon: FileText, badge: posts.length },
        { id: 'diaries' as const, label: '手记随笔', icon: BookOpen, badge: diaries.length },
        { id: 'records' as const, label: '说说动态', icon: Activity, badge: records.length },
      ],
    },
    {
      title: '分类与网络',
      items: [
        { id: 'taxonomy' as const, label: '分类与标签', icon: Tag, badge: categories.length },
        { id: 'friends' as const, label: '友链伙伴', icon: Link2, badge: friends.length },
      ],
    },
    {
      title: '全页面与文件定制',
      items: [
        { id: 'settings' as const, label: '全页面定制中心', icon: Settings2, badge: null },
        { id: 'fileEditor' as const, label: '直接动文件中心', icon: FileCode2, badge: null },
      ],
    },
  ];

  const viewTitles: Record<AdminViewType, string> = {
    overview: '仪表盘总览',
    posts: '文章管理',
    diaries: '手记随笔',
    records: '说说动态',
    friends: '友链伙伴',
    taxonomy: '分类与标签',
    settings: '全页面高度定制中心',
    fileEditor: '直接动文件源码中心',
    editor: '内容编辑器',
  };

  const handleSidebarToggle = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    savePreferences({ sidebarCollapsed: next });
  };

  return (
    <div
      className={`admin-app ${isDark ? 'admin-dark dark' : ''}`}
      data-accent={preferences.accentColor || 'blue'}
    >
      {/* 移动端侧边栏遮罩 */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 独立后台侧边栏 */}
      <aside
        className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${
          mobileMenuOpen ? 'translate-x-0 !fixed inset-y-0 left-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* 顶部 Brand */}
        <div className="admin-brand">
          <div className="admin-brand-icon">C</div>
          {!sidebarCollapsed && (
            <div className="admin-brand-text">
              <strong>COT Console</strong>
              <span>Local Content OS</span>
            </div>
          )}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 导航菜单列表 */}
        <div className="admin-sidebar-nav">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="admin-nav-section-title">{group.title}</div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge !== null && (
                          <span className="admin-nav-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* 侧边栏底部状态与工具 */}
        <div className="admin-sidebar-footer">
          {!sidebarCollapsed && (
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5 font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-sky-500" /> 本地存储
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {storageUsage.usedKb} KB
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(5, (storageUsage.usedKb / 5120) * 100))}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => window.open('/', '_blank')}
              title="打开前台博客页面"
              className="flex-1 flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {!sidebarCollapsed && <span>前台预览</span>}
            </button>

            <button
              onClick={handleSidebarToggle}
              title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
              className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* 主工作区 */}
      <div className="admin-main">
        {/* 专属管理后台顶部栏 */}
        <header className="admin-topbar">
          {/* 左侧：手机汉堡菜单 + 面包屑 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="admin-breadcrumb">
              <span>控制台</span>
              <span>/</span>
              <strong>{viewTitles[currentView] || '管理中心'}</strong>
            </div>
          </div>

          {/* 右侧：全局搜索、新建操作、前台预览、主题切换 */}
          <div className="admin-topbar-actions">
            {/* Ctrl+K 搜索按钮 */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="admin-search-btn"
              title="唤起全局命令面板 (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">快捷搜索...</span>
              <kbd className="admin-search-kbd">⌘K</kbd>
            </button>

            {/* 快速新建下拉按钮 */}
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">新建</span>
              </button>

              {quickCreateOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setQuickCreateOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        onOpenEditor('post');
                        setQuickCreateOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-500" />
                      <span>写文章</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenEditor('diary');
                        setQuickCreateOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                      <span>写手记</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('records');
                        setQuickCreateOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                      <span>发说说动态</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('friends');
                        setQuickCreateOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 flex items-center gap-2"
                    >
                      <Link2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>添加友链</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 暗黑/明亮主题切换 */}
            <button
              onClick={toggleTheme}
              className="admin-icon-btn"
              title={isDark ? '切换至浅色模式' : '切换至深色模式'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* 站长头像与信息 */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={siteConfig.author.avatar}
                alt={siteConfig.author.name}
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                {siteConfig.author.name}
              </span>
            </div>
          </div>
        </header>

        {/* 主视口视图 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Command Palette 弹窗 */}
      <AdminCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={onNavigate}
        onOpenEditor={onOpenEditor}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
};
