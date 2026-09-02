import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CloudSun,
  Smile,
  MapPin,
  Calendar,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { useToast } from './AdminToast';
import type { Diary } from '../../types';

interface AdminDiariesProps {
  onOpenEditor: (type: 'post' | 'diary', slug?: string) => void;
}

export const AdminDiaries: React.FC<AdminDiariesProps> = ({ onOpenEditor }) => {
  const { diaries, deleteDiary } = useAdminStore();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('all');
  const [selectedMood, setSelectedMood] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Diary | null>(null);

  const filteredDiaries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return diaries.filter((d) => {
      if (selectedWeather !== 'all' && d.weather !== selectedWeather) return false;
      if (selectedMood !== 'all' && d.mood !== selectedMood) return false;

      if (!q) return true;

      return (
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [diaries, searchQuery, selectedWeather, selectedMood]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteDiary(deleteTarget.slug);
    success(`手记《${deleteTarget.title}》已删除`);
    setDeleteTarget(null);
  };

  return (
    <div className="admin-page-body space-y-5">
      {/* 头部 */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>
            <BookOpen className="w-6 h-6 text-violet-500" />
            <span>手记随笔管理</span>
          </h1>
          <p>
            共记录 {diaries.length} 篇心境与生活片段，支持按天气、心情与关键词筛选。
          </p>
        </div>

        <button
          onClick={() => onOpenEditor('diary')}
          className="admin-btn admin-btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>写手记</span>
        </button>
      </div>

      {/* 搜索与过滤 */}
      <div className="admin-card">
        <div className="p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索手记标题、心境或正文摘要..."
                className="admin-input pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value)}
                className="admin-select !w-auto !py-1 !text-xs"
              >
                <option value="all">所有天气</option>
                <option value="晴">晴</option>
                <option value="多云">多云</option>
                <option value="阴">阴</option>
                <option value="雨">雨</option>
              </select>

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="admin-select !w-auto !py-1 !text-xs"
              >
                <option value="all">所有心境</option>
                <option value="平静">平静</option>
                <option value="喜悦">喜悦</option>
                <option value="思考">思考</option>
                <option value="专注">专注</option>
              </select>
            </div>
          </div>
        </div>

        {/* 手记列表 */}
        {filteredDiaries.length === 0 ? (
          <div className="py-16 text-center text-xs font-mono text-slate-400 space-y-2">
            <div>暂无匹配的手记随笔</div>
            <button
              onClick={() => onOpenEditor('diary')}
              className="text-sky-600 hover:underline font-sans"
            >
              写一篇新手记
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDiaries.map((diary) => (
              <div
                key={diary.slug}
                className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-850/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-sky-600 cursor-pointer" onClick={() => onOpenEditor('diary', diary.slug)}>
                      {diary.title}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                      <CloudSun className="w-3 h-3" /> {diary.weather}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
                      <Smile className="w-3 h-3" /> {diary.mood}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {diary.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {diary.date} {diary.time}
                    </span>
                    {diary.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-500" /> {diary.location}
                      </span>
                    )}
                    <span>{diary.wordCount} 字</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onOpenEditor('diary', diary.slug)}
                    className="admin-icon-btn !w-8 !h-8 text-sky-600 hover:bg-sky-50"
                    title="编辑手记"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => window.open(`/diaries/${diary.slug}`, '_blank')}
                    className="admin-icon-btn !w-8 !h-8 text-slate-500"
                    title="前台查看"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(diary)}
                    className="admin-icon-btn !w-8 !h-8 text-red-500 hover:bg-red-50"
                    title="删除手记"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 删除二次确认模态框 */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="admin-modal-dialog p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                确认删除手记
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                你确定要删除《<strong>{deleteTarget.title}</strong>》吗？此操作将从本地存储中移除该手记。
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
