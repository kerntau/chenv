import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Props { images: { url: string; alt?: string }[]; index: number; onClose: () => void; onChange: (index: number) => void; }

export const MediaLightbox: React.FC<Props> = ({ images, index, onClose, onChange }) => {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); if (event.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length); if (event.key === 'ArrowRight') onChange((index + 1) % images.length); };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; };
  }, [images.length, index, onChange, onClose]);
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4" role="dialog" aria-label="图片预览" onClick={onClose}>
    <button className="absolute right-4 top-4 rounded-full p-3 text-white/80 hover:bg-white/10" onClick={onClose} aria-label="关闭预览"><X /></button>
    {images.length > 1 && <button className="absolute left-3 rounded-full p-3 text-white/80 hover:bg-white/10" onClick={(event) => { event.stopPropagation(); onChange((index - 1 + images.length) % images.length); }} aria-label="上一张"><ChevronLeft /></button>}
    <img src={images[index].url} alt={images[index].alt || ''} className="max-h-[88vh] max-w-[92vw] object-contain" onClick={(event) => event.stopPropagation()} />
    {images.length > 1 && <button className="absolute right-3 rounded-full p-3 text-white/80 hover:bg-white/10" onClick={(event) => { event.stopPropagation(); onChange((index + 1) % images.length); }} aria-label="下一张"><ChevronRight /></button>}
    <span className="absolute bottom-5 rounded-full bg-black/40 px-3 py-1 text-xs text-white">{index + 1} / {images.length}</span>
  </div>;
};
