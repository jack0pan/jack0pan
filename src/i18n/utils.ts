import { type Lang, DEFAULT_LANG } from '../consts';

export function getLangFromPath(pathname: string): Lang {
  if (pathname.startsWith('/zh/') || pathname === '/zh') return 'zh';
  return 'en';
}

export function localizedPath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  if (lang === DEFAULT_LANG) {
    return clean === '' ? '/' : clean + '/';
  }
  return clean === '' ? '/zh/' : '/zh' + clean + '/';
}

export function getAlternatePath(pathname: string): { lang: Lang; path: string } {
  const currentLang = getLangFromPath(pathname);
  if (currentLang === 'en') {
    const path = pathname === '/' ? '/zh/' : '/zh' + pathname;
    return { lang: 'zh', path };
  } else {
    const stripped = pathname.replace(/^\/zh/, '') || '/';
    return { lang: 'en', path: stripped };
  }
}
