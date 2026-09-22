import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, BookOpen, FileCode2, ChevronRight } from 'lucide-react';
import { useSearch } from '../../hooks/useSearch';
import { useLocation } from 'wouter';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { query, setQuery, results } = useSearch();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (slug: string) => {
    setLocation(slug);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs z-50" />
        <Dialog.Content className="dialog-content glass-modal fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-xl rounded-md z-50 p-0 overflow-hidden outline-none">
          <Dialog.Title className="sr-only">搜索博客文稿与笔记</Dialog.Title>
          <Dialog.Description className="sr-only">
            通过标题、标签或摘要快速检索全站文章与安全笔记
          </Dialog.Description>

          {/* 搜索输入框 */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-200/60 dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章、安全速记、技术标签 (如 Pwn, ECC, React, CTF)..."
              className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-sans"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 搜索结果列表 */}
          <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
            {results.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-mono">
                未检索到与 &quot;{query}&quot; 相关的文稿内容
              </div>
            ) : (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.slug)}
                  className="group flex items-start justify-between p-3 rounded-md border border-transparent hover:border-white/80 dark:hover:border-white/[0.10] hover:bg-white/75 dark:hover:bg-white/[0.08] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] dark:hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] cursor-pointer transition-all"
                >
                  <div className="flex items-start space-x-3 min-w-0 pr-2">
                    <div className="mt-0.5 p-1.5 rounded-xs bg-slate-100/80 dark:bg-white/10 text-slate-600 dark:text-slate-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors shrink-0">
                      {item.type === 'post' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : (
                        <FileCode2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-serif text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-white/85 dark:bg-white/[0.10] text-slate-600 dark:text-slate-300 border border-white/90 dark:border-white/[0.15] shadow-2xs shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.summary}
                      </p>
                      <div className="flex items-center space-x-1.5 mt-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-slate-400 dark:text-slate-500 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all shrink-0 mt-2" />
                </div>
              ))
            )}
          </div>

          {/* 底部键盘快捷键提示 */}
          <div className="px-4 py-2 bg-white/55 dark:bg-black/30 backdrop-blur-md border-t border-slate-200/60 dark:border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <div className="flex items-center space-x-3">
              <span>
                <kbd className="px-1 py-0.5 rounded-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] shadow-2xs">
                  ESC
                </kbd>{' '}
                关闭
              </span>
              <span>
                <kbd className="px-1 py-0.5 rounded-xs bg-white/80 dark:bg-slate-800/80 border border-slate-200/70 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[10px] shadow-2xs">
                  ↵
                </kbd>{' '}
                跳转
              </span>
            </div>
            <span>全站静态索引</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
