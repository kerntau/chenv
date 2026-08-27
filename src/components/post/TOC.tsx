import React from 'react';
import { AlignLeft } from 'lucide-react';
import type { TOCItem } from '../../types';
import { useTOC } from '../../hooks/useTOC';

interface TOCProps {
  toc: TOCItem[];
}

export const TOC: React.FC<TOCProps> = ({ toc }) => {
  const activeId = useTOC(toc);

  if (!toc || toc.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/70 bg-slate-50/50 dark:bg-[#18181A]/50 text-xs font-sans">
      <div className="flex items-center space-x-1.5 font-serif font-semibold text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
        <AlignLeft className="w-3.5 h-3.5 text-slate-500" />
        <span>目录导航</span>
      </div>

      <ul className="space-y-1.5 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
        {toc.map((item) => {
          const isActive = activeId === item.id;
          const indentClass =
            item.level === 1
              ? 'pl-0 font-medium'
              : item.level === 2
              ? 'pl-3'
              : 'pl-6 text-[11px] opacity-90';

          return (
            <li key={item.id} className={indentClass}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block py-1 px-1.5 rounded transition-all duration-150 truncate ${
                  isActive
                    ? 'text-slate-950 dark:text-slate-50 font-medium bg-slate-200/60 dark:bg-slate-800 border-l-2 border-sky-600 dark:border-sky-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/30 dark:hover:bg-slate-800/30'
                }`}
                title={item.text}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
