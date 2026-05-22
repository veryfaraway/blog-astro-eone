// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import rehypeMermaid from 'rehype-mermaid';

export default defineConfig({
  site: 'https://blog.eone.one',
  integrations: [
    mdx(),
    react(),
    pagefind(),
    sitemap({
      filter: (page) => !page.includes('/vault'),
    }),
  ],
  markdown: {
    rehypePlugins: [
      [rehypeMermaid, {
        strategy: 'inline-svg',
        mermaidConfig: { theme: 'neutral' },
      }],
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    routing: {
      prefixDefaultLocale: false, // 한국어: /life/slug, 영어: /en/life/slug
    },
  },
});
