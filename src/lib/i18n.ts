import { getRelativeLocaleUrl, getAbsoluteLocaleUrl } from 'astro:i18n';

export type Locale = 'ko' | 'en';

/**
 * Locale-aware relative path. Respects astro.config's prefixDefaultLocale/trailingSlash,
 * so ko/en URLs stay symmetric without manual string templates.
 */
export function getLocalizedPath(locale: Locale, path: string): string {
  return getRelativeLocaleUrl(locale, path);
}

/** Same as getLocalizedPath but returns an absolute URL (for canonical/hreflang). */
export function getAbsoluteLocalizedUrl(locale: Locale, path: string): string {
  return getAbsoluteLocaleUrl(locale, path);
}
