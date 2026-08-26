import React from 'react';
import { Link } from 'wouter';
import { FileCode2, ArrowRight } from 'lucide-react';
import { getAllNotes } from '../../content';
import { formatDateShort } from '../../lib/date';

export const QuickNotesCard: React.FC = () => {
  const notes = getAllNotes().slice(0, 2);

  return (
    <div className="p-6 rounded-3xl paper-card flex flex-col justify-between h-full bg-gradient-to-b from-stone-50/50 to-white dark:from-[#1A1A1D] dark:to-[#161618]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileCode2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              安全与攻防速记
            </h2>
          </div>
          <Link
            href="/notes"
            className="text-xs font-mono text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            全部速记 &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {notes.map((note) => (
            <Link
              key={note.slug}
              href={`/notes/${note.slug}`}
              className="group block p-3 rounded-2xl bg-stone-100/60 dark:bg-stone-800/50 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-all border border-stone-200/40 dark:border-stone-700/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xs font-semibold text-stone-800 dark:text-stone-200 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors truncate">
                  {note.title}
                </span>
                <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                  {formatDateShort(note.date)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {note.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 flex items-center justify-between text-xs text-stone-400 font-mono">
        <span>实时漏洞/CTF Writeups</span>
        <Link
          href="/notes"
          className="inline-flex items-center space-x-1 text-stone-600 dark:text-stone-300 hover:underline"
        >
          <span>查看全部</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
