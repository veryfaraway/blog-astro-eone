// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://blog.eone.one',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/vault'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
  },
});
