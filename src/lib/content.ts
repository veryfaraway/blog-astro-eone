import { getCollection, type CollectionEntry } from 'astro:content';
import { isVisiblePost } from './utils';

export const SECTIONS = ['life', 'money', 'culture', 'tools', 'dev'] as const;
export type Section = (typeof SECTIONS)[number];

export type PostEntry<S extends Section = Section> = CollectionEntry<S>;

/**
 * Extracts URL slug from entry id (e.g., 'ko/2026/my-post.mdx' -> 'my-post')
 */
export function getPostSlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '').split('/').pop()!;
}

interface PostQueryOptions {
  lang?: 'ko' | 'en';
}

/**
 * Validates that there are no duplicate slugs within the same section and language.
 */
function validateSlugUniqueness<S extends Section>(posts: CollectionEntry<S>[], section: S, lang?: string) {
  const seen = new Map<string, string>();
  for (const post of posts) {
    const slug = getPostSlug(post.id);
    if (seen.has(slug)) {
      console.warn(
        `[Content Warning] Duplicate slug "${slug}" detected in section "${section}" (${lang ?? 'all'}):\n` +
        `  - First: ${seen.get(slug)}\n` +
        `  - Conflicting: ${post.id}`
      );
    } else {
      seen.set(slug, post.id);
    }
  }
}

/**
 * Fetches and filters posts for a given section, sorted by date descending.
 */
export async function getSectionPosts<S extends Section>(
  section: S,
  options?: PostQueryOptions
): Promise<CollectionEntry<S>[]> {
  const lang = options?.lang;
  const posts = await getCollection(section, (entry) => {
    if (lang && !entry.id.startsWith(`${lang}/`)) return false;
    return isVisiblePost(entry);
  });

  validateSlugUniqueness(posts, section, lang);

  return (posts as CollectionEntry<S>[]).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}

/**
 * Fetches all posts across all sections, sorted by date descending.
 */
export async function getAllPosts(
  options?: PostQueryOptions
): Promise<CollectionEntry<Section>[]> {
  const lists = await Promise.all(
    SECTIONS.map((section) => getSectionPosts(section, options))
  );

  return lists.flat().sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
}
