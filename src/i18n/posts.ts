import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../consts';

type Post = CollectionEntry<'posts'>;

export function shortSlug(post: Post): string {
  return post.slug.replace(/^(zh|en)\//, '');
}

export function postLang(post: Post): Lang {
  return post.slug.startsWith('en/') ? 'en' : 'zh';
}

export async function getPostsByLang(lang: Lang): Promise<Post[]> {
  const all = await getCollection('posts', ({ data, slug }) => {
    if (data.draft) return false;
    return lang === 'en' ? slug.startsWith('en/') : slug.startsWith('zh/');
  });
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function findTranslation(post: Post): Promise<Post | null> {
  const currentLang = postLang(post);
  const otherLang: Lang = currentLang === 'zh' ? 'en' : 'zh';
  const targetSlug = otherLang + '/' + shortSlug(post);
  const otherPosts = await getCollection('posts', ({ slug }) => slug === targetSlug);
  return otherPosts[0] ?? null;
}

export function postUrl(post: Post): string {
  const lang = postLang(post);
  const slug = shortSlug(post);
  return lang === 'zh' ? '/posts/' + slug + '/' : '/en/posts/' + slug + '/';
}
