import { useCallback, useState } from 'react';
import type { RecordComment } from '../types';

const storageKey = (id: string | number, name: string) => 'cot-record-' + name + '-' + id;

export function useRecordInteractions(id: string | number, initialLikes = 0, initialComments: RecordComment[] = []) {
  const [liked, setLiked] = useState(() => localStorage.getItem(storageKey(id, 'liked')) === '1');
  const [likes, setLikes] = useState(() => initialLikes + (localStorage.getItem(storageKey(id, 'liked')) === '1' ? 1 : 0));
  const [comments, setComments] = useState<RecordComment[]>(() => {
    try { return [...initialComments, ...JSON.parse(localStorage.getItem(storageKey(id, 'comments')) || '[]')]; } catch { return initialComments; }
  });
  const toggleLike = useCallback(() => { if (liked) return; localStorage.setItem(storageKey(id, 'liked'), '1'); setLiked(true); setLikes((value) => value + 1); }, [id, liked]);
  const addComment = useCallback((content: string, author: string) => { const comment: RecordComment = { id: String(Date.now()), content: content.trim(), author: author.trim() || '访客', createdAt: Date.now(), local: true }; if (!comment.content) return; const next = [...comments, comment]; localStorage.setItem(storageKey(id, 'comments'), JSON.stringify(next.filter((item) => item.local))); setComments(next); }, [comments, id]);
  const removeComment = useCallback((commentId: string) => { const next = comments.filter((item) => item.id !== commentId); localStorage.setItem(storageKey(id, 'comments'), JSON.stringify(next.filter((item) => item.local))); setComments(next); }, [comments, id]);
  return { liked, likes, comments, toggleLike, addComment, removeComment };
}
