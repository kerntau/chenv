export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  draft?: boolean;
  coverImage?: string;
  author?: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  readingTime: string;
  wordCount: number;
  content: string;
  toc: TOCItem[];
  draft?: boolean;
  coverImage?: string;
}

export interface Note {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  readingTime: string;
}

export interface SearchItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  slug: string;
  type: 'post' | 'note';
  date: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';
