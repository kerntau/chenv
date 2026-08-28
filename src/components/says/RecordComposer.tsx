import React, { useRef, useState } from 'react';
import { ImagePlus, RotateCcw, Send, X } from 'lucide-react';
import type { RecordContentBlock, RecordItem } from '../../types';

interface Props { editing?: RecordItem; onSave: (record: RecordItem) => void; onCancel: () => void; }

export const RecordComposer: React.FC<Props> = ({ editing, onSave, onCancel }) => {
  const [content, setContent] = useState(editing?.content || '');
  const [mood, setMood] = useState(editing?.mood || '');
  const [location, setLocation] = useState(editing?.location || '');
  const [media, setMedia] = useState<RecordContentBlock[]>(editing?.media || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const addImages = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 9 - media.filter((item) => item.type === 'image').length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setMedia((current) => [...current, { type: 'image', url: String(reader.result), alt: file.name }]);
      reader.readAsDataURL(file);
    });
  };

  const submit = () => {
    if (!content.trim() && media.length === 0) return;
    onSave({
      id: editing?.id || `local-${Date.now()}`,
      content: content.trim(), likes: editing?.likes || 0, mood: mood.trim(), location: location.trim(),
      createTime: editing?.createTime || Date.now(), author: editing?.author || 'kerntau', media,
      comments: editing?.comments || [], contentType: 'markdown',
    });
  };

  return <div className="paper-card mb-5 rounded-sm p-4 sm:p-5">
    <div className="mb-3 flex items-center justify-between">
      <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">{editing ? 'EDIT MOMENT' : 'NEW MOMENT'}</span><h2 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{editing ? '修改这条动态' : '记录此刻'}</h2></div>
      {editing && <button onClick={onCancel} className="rounded-sm p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="取消编辑"><X className="h-4 w-4" /></button>}
    </div>
    <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="分享你的此刻想法，支持 Markdown..." className="w-full resize-y rounded-sm border border-slate-200/80 bg-white/70 p-3 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100" />
    {media.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{media.map((item, index) => item.type === 'image' && <div key={item.url + index} className="group relative aspect-square overflow-hidden rounded-sm"><img src={item.url} alt={item.alt || ''} className="h-full w-full object-cover" /><button onClick={() => setMedia((current) => current.filter((_, i) => i !== index))} className="absolute right-1 top-1 rounded-full bg-slate-950/70 p-1 text-white opacity-0 transition group-hover:opacity-100" aria-label="移除图片"><X className="h-3 w-3" /></button></div>)}</div>}
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="心情" className="h-9 w-24 rounded-sm border border-slate-200/80 bg-white/60 px-2 text-xs dark:border-slate-700 dark:bg-slate-900/50" />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="所在位置" className="h-9 w-32 rounded-sm border border-slate-200/80 bg-white/60 px-2 text-xs dark:border-slate-700 dark:bg-slate-900/50" />
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.target.files)} />
      <button onClick={() => fileRef.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-slate-200/80 px-2.5 text-xs text-slate-600 hover:border-sky-400 hover:text-sky-600 dark:border-slate-700 dark:text-slate-300" aria-label="添加图片"><ImagePlus className="h-4 w-4" /> 图片</button>
      <button onClick={() => { setContent(''); setMood(''); setLocation(''); setMedia([]); }} className="ml-auto inline-flex h-9 items-center gap-1.5 px-2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><RotateCcw className="h-3.5 w-3.5" /> 清空</button>
      <button onClick={submit} className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-sky-600 px-3 text-xs font-medium text-white transition hover:bg-sky-700"><Send className="h-3.5 w-3.5" /> {editing ? '保存修改' : '发表动态'}</button>
    </div>
  </div>;
};
