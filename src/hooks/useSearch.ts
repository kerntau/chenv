import { useMemo, useState, useEffect, useRef } from 'react';
import type FuseType from 'fuse.js';
import { getSearchIndex } from '../content';
import type { SearchItem } from '../types';

let fusePromise: Promise<typeof FuseType> | null = null;
function loadFuse(): Promise<typeof FuseType> {
  if (!fusePromise) {
    fusePromise = import('fuse.js').then((m) => m.default || m);
  }
  return fusePromise;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [fuseInstance, setFuseInstance] = useState<FuseType<SearchItem> | null>(null);

  const items = useMemo(() => getSearchIndex(), []);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!query.trim() && !fuseInstance) return;
    if (fuseInstance || loadingRef.current) return;

    loadingRef.current = true;
    loadFuse().then((FuseClass) => {
      const instance = new FuseClass(items, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'tags', weight: 0.25 },
          { name: 'category', weight: 0.15 },
          { name: 'summary', weight: 0.1 },
        ],
        threshold: 0.35,
        includeMatches: true,
        minMatchCharLength: 1,
      });
      setFuseInstance(instance);
    }).finally(() => {
      loadingRef.current = false;
    });
  }, [query, items, fuseInstance]);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return items.slice(0, 8);
    }
    if (!fuseInstance) {
      // 在 Fuse 加载完成前使用原生极速子串过滤兜底
      const lower = q.toLowerCase();
      return items
        .filter(
          (it) =>
            it.title.toLowerCase().includes(lower) ||
            it.tags.some((t) => t.toLowerCase().includes(lower)) ||
            it.category.toLowerCase().includes(lower) ||
            it.summary.toLowerCase().includes(lower)
        )
        .slice(0, 8);
    }
    return fuseInstance.search(q).map((res) => res.item);
  }, [query, fuseInstance, items]);

  return {
    query,
    setQuery,
    results,
  };
}
