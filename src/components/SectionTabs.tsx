import { useState } from 'react';

type Section = 'life' | 'money' | 'culture' | 'tools' | 'dev';

interface Post {
  title: string;
  description?: string;
  date: Date | string;
  slug: string;
  section: Section;
  tags?: string[];
  thumbnail?: string;
  category?: string;
}

interface Props {
  posts: Post[];
  section: Section;
}

const sectionLabel: Record<Section, string> = {
  life: 'Life',
  money: 'Money',
  culture: 'Culture',
  tools: 'Tools',
  dev: 'Dev',
};

const sectionAccentColor: Record<Section, string> = {
  life:    'oklch(0.72 0.18 145)',
  money:   'oklch(0.80 0.18 86)',
  culture: 'oklch(0.63 0.27 303)',
  tools:   'oklch(0.56 0.024 265)',
  dev:     'oklch(0.72 0.14 215)',
};

const sectionAccentLight: Record<Section, string> = {
  life:    'oklch(0.96 0.044 156)',
  money:   'oklch(0.97 0.063 96)',
  culture: 'oklch(0.94 0.069 303)',
  tools:   'oklch(0.97 0.007 247)',
  dev:     'oklch(0.95 0.051 203)',
};

const PAGE_SIZE = 12;

export default function SectionTabs({ posts, section }: Props) {
  const accent = sectionAccentColor[section];
  const accentLight = sectionAccentLight[section];

  // 카테고리 목록 추출
  const categories = ['전체', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean) as string[]))];

  const [activeCategory, setActiveCategory] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = activeCategory === '전체'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagePosts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleCategoryClick(cat: string) {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="flex gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="relative shrink-0 px-4 py-3 text-base font-medium transition-colors"
              style={{
                color: activeCategory === cat ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              {cat}
              {activeCategory === cat && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Post grid */}
      <div className="py-10">
        {pagePosts.length === 0 ? (
          <p className="text-sm py-12 text-center" style={{ color: 'var(--muted-foreground)' }}>
            아직 글이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {pagePosts.map((post) => {
              const postUrl = `/${section}/${post.slug}`;
              return (
                <article key={post.slug} className="group flex flex-col">
                  {/* Thumbnail */}
                  <a
                    href={postUrl}
                    className="block overflow-hidden rounded-lg mb-4"
                    style={{ aspectRatio: '16/9', backgroundColor: 'var(--muted)' }}
                  >
                    {post.thumbnail ? (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: accentLight }}
                      >
                        <span
                          className="text-3xl font-bold opacity-20"
                          style={{ color: accent }}
                        >
                          {sectionLabel[section][0]}
                        </span>
                      </div>
                    )}
                  </a>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[11px] font-semibold uppercase tracking-wide"
                      style={{ color: accent }}
                    >
                      {sectionLabel[section]}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>·</span>
                    <time className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {formatDate(post.date)}
                    </time>
                  </div>

                  {/* Title */}
                  <a href={postUrl} className="block mb-2">
                    <h2
                      className="text-base font-semibold leading-snug line-clamp-2 transition-colors group-hover:opacity-70"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {post.title}
                    </h2>
                  </a>

                  {/* Description */}
                  {post.description && (
                    <p
                      className="text-sm line-clamp-2 mb-3 leading-relaxed"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      {post.description}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <a
                          key={tag}
                          href={`/tags/${tag}`}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-colors"
                          style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-1 pb-16">
          {/* 이전 */}
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: currentPage === 1 ? 'var(--muted-foreground)' : 'var(--muted-foreground)',
              opacity: currentPage === 1 ? 0.4 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← 이전
          </button>

          {/* 페이지 번호 */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className="px-3 py-1.5 rounded-md text-sm transition-colors"
              style={{
                backgroundColor: n === currentPage ? 'var(--foreground)' : 'transparent',
                color: n === currentPage ? 'var(--background)' : 'var(--muted-foreground)',
                fontWeight: n === currentPage ? 600 : 400,
              }}
            >
              {n}
            </button>
          ))}

          {/* 다음 */}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md text-sm transition-colors"
            style={{
              color: 'var(--muted-foreground)',
              opacity: currentPage === totalPages ? 0.4 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            다음 →
          </button>
        </nav>
      )}
    </div>
  );
}
