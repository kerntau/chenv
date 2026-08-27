import matter from 'gray-matter';
import type { Post, TOCItem, Diary } from '../types';

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
  const frontmatter = data as Record<string, any>;
  const { readingTime, wordCount } = calculateReadingTime(content);
  const toc = extractTOC(content);

  const finalCategory =
    frontmatter.category ||
    (Array.isArray(frontmatter.categories) && frontmatter.categories[0]) ||
    '技术文章';

  const finalCoverImage =
    frontmatter.coverImage ||
    frontmatter.cover ||
    (Array.isArray(frontmatter.images) && frontmatter.images[0]) ||
    undefined;

  const finalSlug = frontmatter.url || slug;

  return {
    id: finalSlug,
    slug: finalSlug,
    title: frontmatter.title || finalSlug,
    date: frontmatter.date ? String(frontmatter.date) : new Date().toISOString().split('T')[0],
    summary: frontmatter.summary || content.slice(0, 150).replace(/[#*`_\n]/g, ' ') + '...',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    category: finalCategory,
    readingTime,
    wordCount,
    content,
    toc,
    draft: Boolean(frontmatter.draft),
    coverImage: finalCoverImage,
    cover: finalCoverImage,
    images: Array.isArray(frontmatter.images)
      ? frontmatter.images
      : finalCoverImage
      ? [finalCoverImage]
      : [],
    recommend: typeof frontmatter.recommend === 'number' ? frontmatter.recommend : 0,
  };
}

export function parseDiaryFile(slug: string, rawContent: string): Diary {
  const { data, content } = matter(rawContent);
  const frontmatter = data as Record<string, any>;
  const { readingTime, wordCount } = calculateReadingTime(content);

  return {
    id: slug,
    slug: frontmatter.slug || slug,
    title: frontmatter.title || slug,
    date: frontmatter.date ? String(frontmatter.date) : new Date().toISOString().split('T')[0],
    time: frontmatter.time || '',
    weather: frontmatter.weather || '晴',
    mood: frontmatter.mood || '平静',
    location: frontmatter.location || '书房',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : ['手记'],
    summary: frontmatter.summary || content.slice(0, 120).replace(/[#*`_\n]/g, ' ') + '...',
    content,
    readingTime,
    wordCount,
  };
}
