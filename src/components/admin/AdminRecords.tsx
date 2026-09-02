import React, { useState } from 'react';
import {
  Activity,
  Send,
  Heart,
  MessageCircle,
  Pin,
  Trash2,
  Edit2,
  MapPin,
  Smile,
  Image,
  Sparkles,
  X,
  Calendar,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import { useToast } from './AdminToast';
import type { RecordItem } from '../../types';

export const AdminRecords: React.FC = () => {
  const {
    records,
    saveRecord,
    deleteRecord,
    toggleRecordPin,
    updateRecordLikes,
    addRecordComment,
    deleteRecordComment,
    siteConfig,
  } = useAdminStore();
  const { success, warning } = useToast();

  // 发布/编辑表单状态
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('灵感');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // 评论抽屉
  const [activeRecordForComments, setActiveRecordForComments] = useState<RecordItem | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | number | null>(null);

  // 提交发布或更新
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      warning('请输入说说动态内容');
      return;
    }

    const media = imageUrl.trim()
      ? [{ type: 'image' as const, url: imageUrl.trim() }]
      : [];

    if (editingId) {
      saveRecord({
        id: editingId,
        content: content.trim(),
        mood,
        location: location.trim(),
        pinned: isPinned,
        media: media.length > 0 ? media : undefined,
      });
      success('说说动态已更新');
      setEditingId(null);
    } else {
      saveRecord({
        content: content.trim(),
        mood,
        location: location.trim(),
        pinned: isPinned,
        media: media.length > 0 ? media : undefined,
        likes: 0,
      });
      success('新说说动态已发布！');
    }

    // 重置表单
    setContent('');
    setLocation('');
    setImageUrl('');
    setIsPinned(false);
    setMood('灵感');
  };

  // 开始编辑现有说说
  const handleStartEdit = (rec: RecordItem) => {
    setEditingId(rec.id);
    setContent(rec.content);
    setMood(rec.mood || '灵感');
    setLocation(rec.location || '');
    setIsPinned(Boolean(rec.pinned));
    const imgMedia = rec.media?.find((m) => m.type === 'image');
    setImageUrl(imgMedia && 'url' in imgMedia ? imgMedia.url : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingId(null);
    setContent('');
    setLocation('');
    setImageUrl('');
    setIsPinned(false);
    setMood('灵感');
  };

  // 发表博主回复
  const handleAddReply = () => {
    if (!activeRecordForComments || !replyContent.trim()) return;
    addRecordComment(activeRecordForComments.id, siteConfig.author.name || '博主', replyContent.trim());
    setReplyContent('');
    success('回复发表成功');
  };

  return (
    <div className="admin-page-body space-y-6">
      {/* 页面头部 */}
      <div className="admin-page-header">
        <div className="admin-page-title-group">
          <h1>
            <Activity className="w-6 h-6 text-amber-500" />
            <span>说说动态管理</span>
          </h1>
          <p>
            记录生活灵感与简短切片，共 {records.length} 条动态，支持置顶、图片附图与评论互动管理。
          </p>
        </div>
      </div>

      {/* 发布 / 编辑动态卡片 */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3>
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{editingId ? '编辑说说动态' : '发布新的日常说说'}</span>
          </h3>
          {editingId && (
            <button
              onClick={handleCancelEdit}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              取消编辑
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="这一刻在想什么？支持普通文本或 Markdown 格式..."
            className="admin-textarea text-xs sm:text-sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 心境选择 */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <Smile className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-300"
              >
                <option value="灵感">灵感与光芒</option>
                <option value="随笔">悠闲随笔</option>
                <option value="编码">沉浸编码</option>
                <option value="平静">平和宁静</option>
                <option value="充实">热烈充实</option>
                <option value="夜读">夜深人静</option>
              </select>
            </div>

            {/* 定位地点 */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="地点 (如: 杭州 · 书房)"
                className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-300 placeholder-slate-400"
              />
            </div>

            {/* 附图 URL */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <Image className="w-4 h-4 text-sky-500 shrink-0" />
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="图片 URL (可选)"
                className="bg-transparent outline-none w-full text-slate-700 dark:text-slate-300 placeholder-slate-400 font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span className="flex items-center gap-1 font-medium">
                <Pin className="w-3.5 h-3.5 text-amber-500" /> 置顶这条说说
              </span>
            </label>

            <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
              <Send className="w-3.5 h-3.5" />
              <span>{editingId ? '更新说说' : '立即发布'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 说说时间线列表 */}
      <div className="space-y-4">
        <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>动态时间线</span>
          <span className="text-xs font-mono text-slate-400 font-normal">
            ({records.length} 条)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map((rec) => {
            const hasImg = rec.media?.find((m) => m.type === 'image');
            return (
              <div
                key={rec.id}
                className="admin-card p-4 flex flex-col justify-between space-y-3 relative"
              >
                {/* 顶栏：发布时间 + 置顶标识 + 操作 */}
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(Number(rec.createTime)).toLocaleDateString('zh-CN')}
                    </span>
                    {rec.mood && <span>{rec.mood}</span>}
                    {rec.pinned && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full text-[10px] bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                        <Pin className="w-2.5 h-2.5" /> 置顶
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleRecordPin(rec.id)}
                      className={`admin-icon-btn !w-6 !h-6 ${rec.pinned ? '!text-amber-500' : 'text-slate-400'}`}
                      title={rec.pinned ? '取消置顶' : '设为置顶'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleStartEdit(rec)}
                      className="admin-icon-btn !w-6 !h-6 text-sky-600"
                      title="编辑"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(rec.id)}
                      className="admin-icon-btn !w-6 !h-6 text-red-500"
                      title="删除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* 正文 */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {rec.content}
                </div>

                {/* 附图 */}
                {hasImg && 'url' in hasImg && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48">
                    <img
                      src={hasImg.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 底栏：点赞调节 + 评论入口 */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {/* 点赞计数与增减 */}
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
                      <span className="font-mono">{rec.likes || 0}</span>
                      <button
                        onClick={() => updateRecordLikes(rec.id, 1)}
                        className="text-[10px] px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 text-slate-500 font-mono"
                        title="增加点赞"
                      >
                        +1
                      </button>
                    </div>

                    {/* 评论管理 */}
                    <button
                      onClick={() => setActiveRecordForComments(rec)}
                      className="flex items-center gap-1 hover:text-sky-600 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{rec.comments?.length || 0} 条评论</span>
                    </button>
                  </div>

                  {rec.location && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <MapPin className="w-3 h-3 text-emerald-500" />
                      {rec.location}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 评论管理抽屉 / 模态框 */}
      {activeRecordForComments && (
        <div className="admin-modal-overlay" onClick={() => setActiveRecordForComments(null)}>
          <div
            className="admin-modal-dialog p-5 max-w-lg space-y-4 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-sky-500" />
                <span>说说评论互动管理</span>
              </h3>
              <button
                onClick={() => setActiveRecordForComments(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 评论列表 */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-64">
              {(!activeRecordForComments.comments || activeRecordForComments.comments.length === 0) ? (
                <div className="py-8 text-center text-xs font-mono text-slate-400">
                  暂无评论互动
                </div>
              ) : (
                activeRecordForComments.comments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {cmt.author}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(cmt.createdAt).toLocaleString('zh-CN')}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                        {cmt.content}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        deleteRecordComment(activeRecordForComments.id, cmt.id);
                        success('评论已删除');
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="删除评论"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 追加博主回复输入 */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="以博主身份发表回复..."
                className="admin-input text-xs flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
              />
              <button
                onClick={handleAddReply}
                className="admin-btn admin-btn-primary admin-btn-sm text-xs"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除说说二次确认 */}
      {deleteTargetId && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTargetId(null)}>
          <div
            className="admin-modal-dialog p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                确认删除说说动态
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                你确定要删除该条说说吗？删除后将无法恢复。
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteRecord(deleteTargetId);
                  success('说说动态已删除');
                  setDeleteTargetId(null);
                }}
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
