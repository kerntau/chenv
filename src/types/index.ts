export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  category: string;
  draft?: boolean;
  coverImage?: string;
  cover?: string;
  images?: string[];
  author?: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface Post {
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
  recommend?: number;
}

export interface FriendItem {
  id: number | string;
  name: string;
  desc?: string;
  avatar?: string;
  link: string;
  order?: number;
  tags?: string[];
  framework?: string;
  deploy?: string;
}

export interface SocialLink {
  name: string;
  icon: 'github' | 'bilibili' | 'x' | 'email';
  url: string;
}

export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  url: string;
  author: {
    name: string;
    avatar: string;
    description: string;
    email: string;
    github: string;
    socials: SocialLink[];
  };
  footer: {
    copyright: string;
    sinceYear: number;
    customText: string;
    icp?: string;
  };
}

export interface Diary {
  slug: string;
  title: string;
  date: string;
  time?: string;
  weather?: string;
  mood?: string;
  location?: string;
  tags: string[];
  summary: string;
  content: string;
  readingTime: string;
  wordCount: number;
}

export interface RecordItem {
  id: number | string;
  content: string;
  likes?: number;
  mood?: string;
  location?: string;
  createTime: number | string;
  author?: string;
}

export interface SearchItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  slug: string;
  type: 'post' | 'diary';
  date: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

