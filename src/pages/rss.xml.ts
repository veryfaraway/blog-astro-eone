import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPosts, getPostSlug } from '../lib/content';

export async function GET(context: APIContext) {
  const posts = await getAllPosts({ lang: 'ko' });

  return rss({
    title: '일취월장',
    description: '일상, 경제, 문화, 개발, 도구에 관한 이야기',
    site: context.site ?? 'https://blog.eone.one',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.collection}/${getPostSlug(post.id)}`,
      categories: post.data.tags,
    })),
    customData: `<language>ko-KR</language>`,
  });
}
