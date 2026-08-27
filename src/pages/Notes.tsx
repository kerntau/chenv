import React, { useState } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { getAllNotes } from '../content';
import { MarkdownRenderer } from '../components/markdown/MarkdownRenderer';
import { formatDate } from '../lib/date';
import { FileCode2, Clock, Tag, ChevronRight, Hash } from 'lucide-react';
import type { Note } from '../types';

export const Notes: React.FC = () => {
  const notes = getAllNotes();
  const [selectedNote, setSelectedNote] = useState<Note>(notes[0] || null);

  return (
    <PageShell>
      <Container size="wide">
        {/* 顶部标题 */}
        <div className="mb-8 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 mb-2">
            <FileCode2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>WRITEUPS &amp; CHEATSHEETS</span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            安全与攻防速记
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
            收录 CTF 比赛解题记录、逆向备忘录、漏洞利用 Gadget 与渗透测试实践笔记。
          </p>
        </div>

        {/* 双栏布局：左侧笔记列表，右侧沉浸预览 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧列表栏 */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
              速记条目 ({notes.length})
            </div>

            {notes.map((note) => {
              const isSelected = selectedNote?.slug === note.slug;
              return (
                <div
                  key={note.slug}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border text-left ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-[#18181A]/50 border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {note.category}
                    </span>
                    <span>{formatDate(note.date)}</span>
                  </div>

                  <h3 className="font-sans text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {note.summary}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/40 dark:border-slate-800/40 text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center space-x-1">
                      <Tag className="w-2.5 h-2.5" />
                      <span>{note.tags[0] || 'Security'}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform ${
                        isSelected ? 'translate-x-1 text-sky-600 dark:text-sky-400' : ''
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 右侧速记精读卡 */}
          <div className="lg:col-span-8">
            {selectedNote ? (
              <div className="p-6 sm:p-8 rounded-3xl paper-card min-h-[500px]">
                {/* 头部 */}
                <div className="pb-6 border-b border-slate-200/70 dark:border-slate-800/70 mb-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {selectedNote.category}
                    </span>
                    <span>&bull;</span>
                    <span>{formatDate(selectedNote.date)}</span>
                    <span>&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{selectedNote.readingTime}</span>
                    </span>
                  </div>

                  <h2 className="font-sans text-xl sm:text-2xl font-semibold text-slate-950 dark:text-slate-50 tracking-tight">
                    {selectedNote.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedNote.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-0.5 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        <Hash className="w-2.5 h-2.5 opacity-50" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* 正文渲染 */}
                <div className="max-w-[65ch]">
                  <MarkdownRenderer content={selectedNote.content} />
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-400 font-mono text-xs">
                请从左侧选择一条速记进行查看
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageShell>
  );
};
