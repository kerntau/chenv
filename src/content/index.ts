import '../lib/buffer-polyfill';
import { parseMarkdownFile, parseDiaryFile } from '../lib/markdown';
import type { Diary, FriendItem, FriendRecord, Post, RecordItem, SearchItem, SiteConfig } from '../types';
import siteConfigJson from './config/site.config.json';
import friendsJson from './pages/friends.json';
import recordsJson from './records/records.json';

const postsContext = require.context('./posts', false, /\.md$/);

const postsMap: Record<string, string> = {};
postsContext.keys().forEach((key: string) => {
  const slug = key.replace(/^\.\//, '').replace(/\.md$/, '');
  const mod = postsContext(key);
  postsMap[slug] = typeof mod === 'string'
    ? mod
    : typeof mod === 'object' && mod !== null && 'default' in mod && typeof mod.default === 'string'
      ? mod.default
      : '';
});

const diariesContext = require.context('./diaries', false, /\.md$/);

const diariesMap: Record<string, string> = {};
diariesContext.keys().forEach((key: string) => {
  const slug = key.replace(/^\.\//, '').replace(/\.md$/, '');
  const mod = diariesContext(key);
  diariesMap[slug] = typeof mod === 'string'
    ? mod
    : typeof mod === 'object' && mod !== null && 'default' in mod && typeof mod.default === 'string'
      ? mod.default
      : '';
});

export const siteConfig: SiteConfig = siteConfigJson as SiteConfig;

const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const parsedPosts = sortByDateDesc(
  Object.entries(postsMap).map(([slug, raw]) => parseMarkdownFile(slug, raw))
);

const allPosts = parsedPosts.filter((post) => !post.draft);

const allDiaries = sortByDateDesc(
  Object.entries(diariesMap).map(([slug, raw]) => parseDiaryFile(slug, raw))
);

export function getAllPosts(): Post[] {
  return allPosts;
}

export function getFeaturedPosts(limit = 4): Post[] {
  // 优先按 recommend 权重排序，其次按日期
  return allPosts
    .slice()
    .sort((a, b) => {
      const recA = a.recommend || 0;
      const recB = b.recommend || 0;
      if (recB !== recA) return recB - recA;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

export function getPostBySlug(slug: string): Post | null {
  const raw = postsMap[slug];
  return raw ? parsedPosts.find((post) => post.slug === slug) ?? null : null;
}

export function getAllDiaries(): Diary[] {
  return allDiaries;
}

export function getDiaryBySlug(slug: string): Diary | null {
  const raw = diariesMap[slug];
  return raw ? allDiaries.find((diary) => diary.slug === slug) ?? null : null;
}

export function getAllFriends(): FriendItem[] {
  return (friendsJson as FriendRecord[]).map((item) => ({
    id: item.id,
    name: item.name,
    desc: item.desc || '',
    avatar: item.avatar || '',
    link: item.link,
    order: item.order || 999,
    framework: item.framework || '',
    deploy: item.deploy || '',
  }));
}

export function getAllRecords(): RecordItem[] {
  return recordsJson as RecordItem[];
}

export function getAllTags(): { name: string; count: number }[] {
  const tagCounts: Record<string, number> = {};
  const posts = getAllPosts();

  posts.forEach((item) => {
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

  const diaries = getAllDiaries().map((d) => ({
    id: `diary-${d.slug}`,
    title: d.title,
    summary: d.summary,
    category: '手记随笔',
    tags: d.tags,
    slug: `/diaries/${d.slug}`,
    type: 'diary' as const,
    date: d.date,
  }));

  return [...posts, ...diaries];
}
