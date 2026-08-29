// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import pagefind from 'astro-pagefind';
import { unified } from '@astrojs/markdown-remark';
import rehypeAdInject from './src/lib/rehype-ad-inject.mjs';

// import.meta.env is not available in the config, and vite is not a direct
// dependency, so its loadEnv is out of reach. Netlify supplies the AdSense
// values as real environment variables; locally they come from .env, which is
// absent on the build server — hence the catch.
try {
  process.loadEnvFile();
} catch {
  // No .env file: process.env is already the source of truth.
}

export default defineConfig({
  site: 'https://blog.eone.one',
  integrations: [
    mdx(),
    react(),
    pagefind(),
    sitemap({
      filter: (page) => !page.includes('/vault'),
      i18n: {
        defaultLocale: 'ko',
        locales: { ko: 'ko', en: 'en' },
      },
    }),
  ],
  markdown: {
    // @astrojs/mdx extends this config by default, so MDX posts get it too.
    processor: unified({
      rehypePlugins: [
        [
          rehypeAdInject,
          {
            client: process.env.PUBLIC_ADSENSE_CLIENT,
            slot: process.env.PUBLIC_ADSENSE_SLOT_INARTICLE,
          },
        ],
      ],
    }),
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
