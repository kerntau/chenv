import React, { useState, useMemo } from 'react';
import { Container } from '../components/layout/Container';
import { PageShell } from '../components/layout/PageShell';
import { PostCard } from '../components/post/PostCard';
import { getAllPosts, getAllCategories, getAllTags } from '../content';
import { BookOpen, Filter, Tag as TagIcon } from 'lucide-react';

export const Posts: React.FC = () => {
  const allPosts = useMemo(() => getAllPosts(), []);
  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchCategory =
        selectedCategory === 'all' || post.category === selectedCategory;
      const matchTag =
        !selectedTag || post.tags.includes(selectedTag);
      return matchCategory && matchTag;
    });
  }, [allPosts, selectedCategory, selectedTag]);

  // 按年份分组
  const postsByYear = useMemo(() => {
    const grouped: Record<string, typeof filteredPosts> = {};
    filteredPosts.forEach((post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    });
    return grouped;
  }, [filteredPosts]);

  const years = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <PageShell>
      <Container>
        {/* 页面顶栏 */}
        <div className="mb-10 pb-6 border-b border-stone-200/70 dark:border-stone-800/70">
          <div className="flex items-center space-x-2.5 text-xs font-mono text-stone-500 mb-2">
            <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>ARCHIVE &bull; 深度文稿</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight">
            文稿归档
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 font-sans">
            共收录 {allPosts.length} 篇技术与研究文稿，以严谨的逻辑与质感排版呈现。
          </p>

          {/* 分类过滤器 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all ${
                selectedCategory === 'all' && !selectedTag
                  ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
              }`}
            >
              全部 ({allPosts.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedTag(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 font-medium'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          {/* 标签微选择器 */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-mono text-[11px] flex items-center mr-1">
              <Filter className="w-3 h-3 mr-1" /> 标签筛选:
            </span>
            {tags.map((tag) => {
              const active = selectedTag === tag.name;
              return (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(active ? null : tag.name)}
                  className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-mono text-[11px] transition-colors ${
                    active
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                      : 'bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                  }`}
                >
                  <TagIcon className="w-2.5 h-2.5" />
                  <span>{tag.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 文章列表（按年分组） */}
        {years.length === 0 ? (
          <div className="py-16 text-center text-stone-400 dark:text-stone-500 font-mono text-sm">
            未找到符合筛选条件的文章
          </div>
        ) : (
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year} className="relative">
                <div className="sticky top-20 z-10 py-1.5 backdrop-blur-md bg-[#FAF8F5]/80 dark:bg-[#141416]/80 flex items-center space-x-3 mb-6">
                  <span className="font-serif text-2xl font-bold text-stone-400 dark:text-stone-600">
                    {year}
                  </span>
                  <div className="flex-1 h-px bg-stone-200/70 dark:border-stone-800/70" />
                </div>

                <div className="space-y-4">
                  {postsByYear[year].map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </Container>
    </PageShell>
  );
};
