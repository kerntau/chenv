import '../lib/buffer-polyfill';
import type { Diary, FriendItem, Post, RecordItem, SearchItem, SiteConfig, GalleryConfig } from '../types';
import siteConfigJson from './config/site.config.json';
import galleryConfigJson from './config/gallery.config.json';
import friendsJson from './pages/friends.json';
import recordsJson from './records/records.json';
import contentIndex from './generated/content-index.json';
import { postLoaders, diaryLoaders } from './generated/content-loaders';
import { stripFrontmatter } from '../lib/markdown';

export const siteConfig: SiteConfig = siteConfigJson as SiteConfig;
export const galleryConfig: GalleryConfig = galleryConfigJson as GalleryConfig;

export function getGalleryConfig(): GalleryConfig {
  return galleryConfig;
}

export function getAllPosts(includeDrafts = false): Post[] {
  const posts = (contentIndex.posts as Post[]) || [];
  return includeDrafts ? posts : posts.filter((p) => !p.draft);
}

export function getFeaturedPosts(limit = 4): Post[] {
  return getAllPosts(false)
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
  const post = (contentIndex.posts as Post[]).find((p) => p.slug === slug);
  return post || null;
}

export async function loadPostContent(slug: string): Promise<Post | null> {
  const post = getPostBySlug(slug);
  if (!post) return null;
  const loader = postLoaders[slug];
  if (!loader) return post;
  try {
    const raw = await loader();
    return { ...post, content: stripFrontmatter(raw) };
  } catch (err) {
    console.error(`[loadPostContent] Failed to load markdown for ${slug}:`, err);
    return post;
  }
}

export function getAllDiaries(): Diary[] {
  return (contentIndex.diaries as Diary[]) || [];
}

export function getDiaryBySlug(slug: string): Diary | null {
  const diary = (contentIndex.diaries as Diary[]).find((d) => d.slug === slug);
  return diary || null;
}

export async function loadDiaryContent(slug: string): Promise<Diary | null> {
  const diary = getDiaryBySlug(slug);
  if (!diary) return null;
  const loader = diaryLoaders[slug];
  if (!loader) return diary;
  try {
    const raw = await loader();
    return { ...diary, content: stripFrontmatter(raw) };
  } catch (err) {
    console.error(`[loadDiaryContent] Failed to load markdown for ${slug}:`, err);
    return diary;
  }
}

export function getAllFriends(): FriendItem[] {
  return (friendsJson as FriendItem[]) || [];
}

export function getAllRecords(): RecordItem[] {
  return (recordsJson as RecordItem[]) || [];
}

export function getAllTags(): { name: string; count: number }[] {
  const tagsMap: Record<string, number> = {};
  getAllDiaries().forEach((d) => {
    (d.tags || []).forEach((t) => {
      tagsMap[t] = (tagsMap[t] || 0) + 1;
    });
  });
  return Object.entries(tagsMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { name: string; count: number }[] {
  return [
    { name: '手记随笔', count: getAllDiaries().length },
  ];
}

export function getSearchIndex(): SearchItem[] {
  return getAllDiaries().map((d: Diary) => ({
    id: `diary-${d.slug}`,
    title: d.title,
    summary: d.summary,
    category: '手记随笔',
    tags: d.tags,
    slug: `/diaries/${d.slug}`,
    type: 'diary' as const,
    date: d.date,
  }));
}
