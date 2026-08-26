import matter from 'gray-matter';
import type { Post, TOCItem, Note, PostFrontmatter } from '../types';

export function calculateReadingTime(content: string): { readingTime: string; wordCount: number } {
  const cleanContent = content.replace(/[#*`_\[\]()]/g, '').trim();
  const cjkCount = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonCjkCount = (cleanContent.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || []).length;
  const totalWords = cjkCount + nonCjkCount;
  const minutes = Math.max(1, Math.ceil(totalWords / 300));
  return {
    readingTime: `${minutes} 分钟`,
    wordCount: totalWords,
  };
}

export function extractTOC(content: string): TOCItem[] {
  const lines = content.split('\n');
  const toc: TOCItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim();
      const cleanText = rawText.replace(/[*_`]/g, '');
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      toc.push({
        id: id || `heading-${toc.length}`,
        text: cleanText,
        level,
      });
    }
  }

  return toc;
}

export function parseMarkdownFile(slug: string, rawContent: string): Post {
  const { data, content } = matter(rawContent);
  const frontmatter = data as Partial<PostFrontmatter>;
  const { readingTime, wordCount } = calculateReadingTime(content);
  const toc = extractTOC(content);

  return {
    id: slug,
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    summary: frontmatter.summary || content.slice(0, 150).replace(/[#*`_\n]/g, ' ') + '...',
    tags: frontmatter.tags || [],
    category: frontmatter.category || '技术随笔',
    readingTime,
    wordCount,
    content,
    toc,
    draft: frontmatter.draft || false,
    coverImage: frontmatter.coverImage,
  };
}

export function parseNoteFile(slug: string, rawContent: string): Note {
  const { data, content } = matter(rawContent);
  const frontmatter = data as Partial<PostFrontmatter>;
  const { readingTime } = calculateReadingTime(content);

  return {
    id: slug,
    slug,
    title: frontmatter.title || slug,
    date: frontmatter.date || new Date().toISOString().split('T')[0],
    category: frontmatter.category || '攻防速记',
    tags: frontmatter.tags || [],
    summary: frontmatter.summary || content.slice(0, 100).replace(/[#*`_\n]/g, ' ') + '...',
    content,
    readingTime,
  };
}
