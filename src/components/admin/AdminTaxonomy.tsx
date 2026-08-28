import React, { useState } from 'react';
import {
  Tag as TagIcon,
  FolderOpen,
  Edit2,
  Check,
  X,
  Search,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { useToast } from './AdminToast';

export const AdminTaxonomy: React.FC = () => {
  const { categories, tags, renameCategory, renameTag } = useAdminStore();
  const { success } = useToast();

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');

  const [searchTagQuery, setSearchTagQuery] = useState('');

  // 处理分类重命名
  const handleSaveCategory = (oldName: string) => {
    if (!newCategoryName.trim() || newCategoryName.trim() === oldName) {
      setEditingCategory(null);
      return;
    }
    const ok = renameCategory(oldName, newCategoryName.trim());
    if (ok) {
      success(`分类「${oldName}」已更新为「${newCategoryName.trim()}」`);
    }
    setEditingCategory(null);
  };

  // 处理标签重命名
  const handleSaveTag = (oldName: string) => {
    if (!newTagName.trim() || newTagName.trim() === oldName) {
      setEditingTag(null);
      return;
    }
    const ok = renameTag(oldName, newTagName.trim());
    if (ok) {
      success(`标签「${oldName}」已更新为「${newTagName.trim()}」`);
    }
    setEditingTag(null);
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(searchTagQuery.trim().toLowerCase())
  );

  return (
    <div className="admin-page-body space-y-6">
      {/* 头部 */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>
            <TagIcon className="w-6 h-6 text-sky-500" />
            <span>分类与标签管理</span>
          </h1>
          <p>
            统一管理文稿的分类体系与标签元数据，重命名将自动联动更新全站关联内容。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：文章分类管理 */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>
              <FolderOpen className="w-4 h-4 text-sky-500" />
              <span>文稿分类体系 ({categories.length})</span>
            </h3>
          </div>

          <div className="p-4 divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => {
              const isEditing = editingCategory === cat.name;
              return (
                <div
                  key={cat.name}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="admin-input !py-1 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveCategory(cat.name);
                            if (e.key === 'Escape') setEditingCategory(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveCategory(cat.name)}
                          className="admin-icon-btn !w-7 !h-7 text-emerald-600"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="admin-icon-btn !w-7 !h-7 text-slate-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {cat.name}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          收录 {cat.count} 篇文章
                        </div>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => {
                        setEditingCategory(cat.name);
                        setNewCategoryName(cat.name);
                      }}
                      className="admin-icon-btn !w-7 !h-7 text-slate-400 hover:text-sky-600"
                      title="重命名分类"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：标签元数据管理 */}
        <div className="admin-card flex flex-col">
          <div className="admin-card-header">
            <h3>
              <TagIcon className="w-4 h-4 text-violet-500" />
              <span>全站标签热度云 ({tags.length})</span>
            </h3>

            <div className="relative w-40">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTagQuery}
                onChange={(e) => setSearchTagQuery(e.target.value)}
                placeholder="搜索标签..."
                className="admin-input !pl-7 !py-1 text-xs"
              />
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => {
                const isEditing = editingTag === tag.name;
                if (isEditing) {
                  return (
                    <div key={tag.name} className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-sky-500 p-1 rounded-lg">
                      <input
                        autoFocus
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="text-xs px-1 outline-none bg-transparent w-20 font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTag(tag.name);
                          if (e.key === 'Escape') setEditingTag(null);
                        }}
                      />
                      <button onClick={() => handleSaveTag(tag.name)} className="text-emerald-500 p-0.5">
                        <Check className="w-3 h-3" />
                      </button>
                      <button onClick={() => setEditingTag(null)} className="text-slate-400 p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                }

                return (
                  <button
                    key={tag.name}
                    onClick={() => {
                      setEditingTag(tag.name);
                      setNewTagName(tag.name);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500 hover:text-sky-600 border border-slate-200 dark:border-slate-700 text-xs font-mono transition-colors group"
                    title="点击重命名标签"
                  >
                    <span>#{tag.name}</span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      ({tag.count})
                    </span>
                    <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-sky-500" />
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 leading-relaxed font-mono">
              💡 提示：点击任意标签即可直接在线修改名称，变更会自动同步到所有关联文章与手记。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
