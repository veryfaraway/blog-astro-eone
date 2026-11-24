// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SECTIONS = ['life', 'money', 'culture', 'tools', 'dev'];
const LOCALES = ['ko', 'en'];

/** @type {Map<string, string> | null} */
let cachedMap = null;

/**
 * Recursively collects .md / .mdx file paths under dir.
 * @param {string} dir
 * @returns {string[]}
 */
function walkMarkdownFiles(dir) {
  /** @type {string[]} */
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(fullPath));
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extracts a scalar field value from a YAML frontmatter block.
 * @param {string} frontmatter
 * @param {string} key
 * @returns {string | undefined}
 */
function extractFrontmatterField(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*['"]?([^\\r\\n'"#]+)['"]?`, 'm'));
  return match?.[1]?.trim();
}

/**
 * Parses a frontmatter date value into a valid Date, or undefined.
 * @param {string | undefined} raw
 * @returns {Date | undefined}
 */
function parseDateValue(raw) {
  if (!raw) return undefined;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Builds a Map from normalized URL pathname (e.g. '/dev/my-post', '/en/dev/my-post')
 * to ISO lastmod timestamp (updatedDate if > date, otherwise date).
 * @param {string} [rootDir]
 * @returns {Map<string, string>}
 */
export function getPostLastmodMap(rootDir = process.cwd()) {
  if (cachedMap) return cachedMap;

  const map = new Map();
  const contentRoot = join(rootDir, 'src', 'content');

  for (const section of SECTIONS) {
    for (const locale of LOCALES) {
      const localeDir = join(contentRoot, section, locale);
      for (const filePath of walkMarkdownFiles(localeDir)) {
        let source;
        try {
          source = readFileSync(filePath, 'utf-8');
        } catch {
          continue;
        }

        const fmMatch = source.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
        if (!fmMatch) continue;
        const fm = fmMatch[1];

        if (extractFrontmatterField(fm, 'draft') === 'true') continue;

        const published = parseDateValue(extractFrontmatterField(fm, 'date'));
        if (!published) continue;

        const updated = parseDateValue(extractFrontmatterField(fm, 'updatedDate'));
        const effective =
          updated && updated.getTime() > published.getTime() ? updated : published;

        const fileName = filePath.split(/[/\\]/).pop() ?? '';
        const slug = fileName.replace(/\.(md|mdx)$/i, '').toLowerCase();
        if (!slug) continue;

        const pathname = locale === 'en' ? `/en/${section}/${slug}` : `/${section}/${slug}`;
        map.set(pathname, effective.toISOString());
      }
    }
  }

  cachedMap = map;
  return map;
}
