import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  draft: z.boolean().default(false),
  lang: z.enum(['ko', 'en']).default('ko'),
});

const moneySchema = postSchema.extend({
  affiliate: z.boolean().default(false),
});

export const collections = {
  life: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/life' }),
    schema: postSchema,
  }),
  money: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/money' }),
    schema: moneySchema,
  }),
  culture: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/culture' }),
    schema: postSchema,
  }),
  tools: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
    schema: postSchema,
  }),
  dev: defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/dev' }),
    schema: postSchema,
  }),
};
