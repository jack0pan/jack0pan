import type { Lang } from '../consts';

export const ui = {
  zh: {
    'site.title': 'Jack Pan',
    'site.description': '潘杰的技术博客 — 记录数据平台、计算机视觉、工程化实践',
    'site.locale': 'zh-CN',

    'nav.posts': '文章',
    'nav.tags': '标签',
    'nav.about': '关于',

    'home.latest': '最近文章',
    'home.viewAll': '查看全部文章 →',

    'posts.all': '所有文章',
    'posts.empty': '还没有文章。',

    'tags.title': '标签',
    'tags.count': '篇文章',

    'post.readingTime': '约 {min} 分钟阅读',
    'post.updatedAt': '更新于',
    'post.translation': '本文也有英文版本',
    'post.translationLink': '阅读英文版 →',

    'theme.toggle': '切换主题',
    'lang.switch': 'English',

    'footer.rss': 'RSS',
    'about.title': '关于',
  },
  en: {
    'site.title': 'Jack Pan',
    'site.description': "Jack Pan's blog — notes on data platforms, computer vision, and engineering",
    'site.locale': 'en-US',

    'nav.posts': 'Posts',
    'nav.tags': 'Tags',
    'nav.about': 'About',

    'home.latest': 'Latest Posts',
    'home.viewAll': 'View all posts →',

    'posts.all': 'All Posts',
    'posts.empty': 'No posts yet.',

    'tags.title': 'Tags',
    'tags.count': 'posts',

    'post.readingTime': '{min} min read',
    'post.updatedAt': 'Updated on',
    'post.translation': 'This post is also available in Chinese',
    'post.translationLink': 'Read in Chinese →',

    'theme.toggle': 'Toggle theme',
    'lang.switch': '中文',

    'footer.rss': 'RSS',
    'about.title': 'About',
  },
} as const;

export type UIKey = keyof typeof ui['zh'];

export function t(lang: Lang, key: UIKey, vars?: Record<string, string | number>): string {
  let s: string = ui[lang][key] ?? ui.en[key];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace('{' + k + '}', String(v));
    }
  }
  return s;
}
