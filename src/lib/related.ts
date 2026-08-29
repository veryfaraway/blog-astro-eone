export type Section = 'life' | 'money' | 'culture' | 'tools' | 'dev';

export interface RelatedCandidate {
  slug: string;
  section: Section;
  title: string;
  description?: string;
  date: Date;
  category: string;
  tags: string[];
  thumbnail?: string;
  series?: string;
}

const TAG_WEIGHT = 3;
const CATEGORY_WEIGHT = 2;
const SECTION_WEIGHT = 1;

/**
 * A candidate has to share a tag or a category to qualify. Same-section alone
 * is only a tiebreak: the chronological prev/next links already cover "more
 * from this section", and filling the block with loosely related posts trains
 * readers to skip it.
 */
const MIN_SCORE = TAG_WEIGHT;

/**
 * Tag vocabulary drifted over the years — macos/macOS, raycast/Raycast,
 * apple-silicon/Apple Silicon all exist. Matching on the normalized form keeps
 * those clusters together without rewriting tags in frontmatter, which would
 * change the /tags/ URLs that are already indexed.
 */
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[\s-]/g, '');
}

function score(current: RelatedCandidate, candidate: RelatedCandidate): number {
  const tags = new Set(current.tags.map(normalizeTag));
  const sharedTags = candidate.tags.filter((tag) => tags.has(normalizeTag(tag))).length;

  return (
    sharedTags * TAG_WEIGHT +
    (candidate.category === current.category ? CATEGORY_WEIGHT : 0) +
    (candidate.section === current.section ? SECTION_WEIGHT : 0)
  );
}

/**
 * Ranks posts by topical overlap with the current one. Candidates should be
 * every published post in the same language across all sections — tag clusters
 * such as Raycast or IMAX span sections, and those cross-links are the ones
 * worth surfacing.
 */
export function getRelatedPosts(
  current: RelatedCandidate,
  candidates: RelatedCandidate[],
  limit = 3
): RelatedCandidate[] {
  return candidates
    .filter((candidate) => {
      if (candidate.section === current.section && candidate.slug === current.slug) return false;
      // Series members are already listed in SeriesTOC and SeriesNav.
      if (current.series && candidate.series === current.series) return false;
      return true;
    })
    .map((candidate) => ({ candidate, value: score(current, candidate) }))
    .filter(({ value }) => value >= MIN_SCORE)
    .sort((a, b) => b.value - a.value || b.candidate.date.getTime() - a.candidate.date.getTime())
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

interface CollectionLike {
  id: string;
  data: {
    title: string;
    description: string;
    date: Date;
    category: string;
    tags: string[];
    thumbnail?: string;
    series?: string;
  };
}

/** Flattens a content collection entry into the shape the ranking works on. */
export function toRelatedCandidate(entry: CollectionLike, section: Section): RelatedCandidate {
  return {
    slug: entry.id.replace(/\.(md|mdx)$/, '').split('/').pop()!,
    section,
    title: entry.data.title,
    description: entry.data.description,
    date: entry.data.date,
    category: entry.data.category,
    tags: entry.data.tags,
    thumbnail: entry.data.thumbnail,
    series: entry.data.series,
  };
}
