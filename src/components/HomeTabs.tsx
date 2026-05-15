import { useState } from 'react';

type Section = 'life' | 'money' | 'culture' | 'tools' | 'dev';

interface Post {
  title: string;
  description?: string;
  date: string;
  slug: string;
  section: Section;
  tags?: string[];
  thumbnail?: string;
  readingTime?: number;
}

interface Props {
  posts: Post[];
  lang?: 'ko' | 'en';
}

const sectionLabel: Record<Section, string> = {
  life: 'Life',
  money: 'Money',
  culture: 'Culture',
  tools: 'Tools',
  dev: 'Dev',
};

const sectionAccent: Record<Section, string> = {
  life:    'var(--section-accent)',
  money:   'var(--section-accent)',
  culture: 'var(--section-accent)',
  tools:   'var(--section-accent)',
  dev:     'var(--section-accent)',
};

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'life',    label: 'Life' },
  { id: 'money',   label: 'Money' },
  { id: 'culture', label: 'Culture' },
  { id: 'tools',   label: 'Tools' },
  { id: 'dev',     label: 'Dev' },
] as const;

type Tab = typeof tabs[number]['id'];

export default function HomeTabs({ posts, lang = 'ko' }: Props) {
  const [active, setActive] = useState<Tab>('all');

  const filtered = active === 'all' ? posts : posts.filter(p => p.section === active);

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-border mb-8">
        <div className="flex gap-0 overflow-x-auto scrollbar-none">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={[
                'relative shrink-0 px-4 py-3 text-base font-medium transition-colors',
                active === id
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {label}
              {active === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          아직 글이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post) => {
            const postUrl = lang === 'en'
              ? `/en/${post.section}/${post.slug}`
              : `/${post.section}/${post.slug}`;

            const formattedDate = new Date(post.date).toLocaleDateString(
              lang === 'ko' ? 'ko-KR' : 'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' }
            );

            return (
              <article
                key={post.slug}
                className="group flex flex-col"
                data-section={post.section}
              >
                {/* Thumbnail */}
                <a href={postUrl} className="block overflow-hidden rounded-lg bg-muted mb-4 aspect-video">
                  {post.thumbnail ? (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <span className="text-2xl font-bold opacity-20 text-muted-foreground">
                        {sectionLabel[post.section][0]}
                      </span>
                    </div>
                  )}
                </a>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {sectionLabel[post.section]}
                  </span>
                  <span className="text-muted-foreground/40 text-xs">·</span>
                  <time className="text-xs text-muted-foreground">
                    {formattedDate}
                  </time>
                  {post.readingTime && (
                    <>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground">{post.readingTime}분</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <a href={postUrl} className="block mb-2">
                  <h2 className="text-base font-semibold leading-snug text-foreground group-hover:text-foreground/70 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </a>

                {/* Description */}
                {post.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
