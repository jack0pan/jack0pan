import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsByLang, postUrl } from '../i18n/posts';
import { t } from '../i18n/ui';

export async function GET(context: APIContext) {
  const lang = 'en';
  const posts = await getPostsByLang(lang);
  return rss({
    title: t(lang, 'site.title'),
    description: t(lang, 'site.description'),
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description ?? '',
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  });
}
