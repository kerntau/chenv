import { parseMarkdownFile, parseNoteFile } from '../lib/markdown';
import type { Post, Note, SearchItem } from '../types';

// 导入文章原始 Markdown 字符串
import heapPostRaw from './posts/heap-exploitation-pwn-guide.md?raw';
import eccPostRaw from './posts/modern-cryptography-elliptic-curves.md?raw';
import musicPostRaw from './posts/algorithmic-composition-music-sheet.md?raw';
import reactPostRaw from './posts/react-19-actions-and-compiler.md?raw';

// 导入笔记原始 Markdown 字符串
import protoNoteRaw from './notes/ctf-web-prototype-pollution.md?raw';
import armNoteRaw from './notes/reverse-engineering-arm64-cheatsheet.md?raw';

const postsMap: Record<string, string> = {
  'heap-exploitation-pwn-guide': heapPostRaw,
  'modern-cryptography-elliptic-curves': eccPostRaw,
  'algorithmic-composition-music-sheet': musicPostRaw,
  'react-19-actions-and-compiler': reactPostRaw,
};

const notesMap: Record<string, string> = {
  'ctf-web-prototype-pollution': protoNoteRaw,
  'reverse-engineering-arm64-cheatsheet': armNoteRaw,
};

export function getAllPosts(): Post[] {
  const posts = Object.entries(postsMap).map(([slug, raw]) =>
    parseMarkdownFile(slug, raw)
  );
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const raw = postsMap[slug];
  if (!raw) return null;
  return parseMarkdownFile(slug, raw);
}

export function getAllNotes(): Note[] {
  const notes = Object.entries(notesMap).map(([slug, raw]) =>
    parseNoteFile(slug, raw)
  );
  return notes.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getNoteBySlug(slug: string): Note | null {
  const raw = notesMap[slug];
  if (!raw) return null;
  return parseNoteFile(slug, raw);
}

export function getAllTags(): { name: string; count: number }[] {
  const tagCounts: Record<string, number> = {};
  const posts = getAllPosts();
  const notes = getAllNotes();

  [...posts, ...notes].forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; count: number }[] {
  const catCounts: Record<string, number> = {};
  const posts = getAllPosts();

  posts.forEach((item) => {
    catCounts[item.category] = (catCounts[item.category] || 0) + 1;
  });

  return Object.entries(catCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getSearchIndex(): SearchItem[] {
  const posts = getAllPosts().map((p) => ({
    id: `post-${p.slug}`,
    title: p.title,
    summary: p.summary,
    category: p.category,
    tags: p.tags,
    slug: `/posts/${p.slug}`,
    type: 'post' as const,
    date: p.date,
  }));

  const notes = getAllNotes().map((n) => ({
    id: `note-${n.slug}`,
    title: n.title,
    summary: n.summary,
    category: n.category,
    tags: n.tags,
    slug: `/notes/${n.slug}`,
    type: 'note' as const,
    date: n.date,
  }));

  return [...posts, ...notes];
}
