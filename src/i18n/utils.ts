import { type Lang, DEFAULT_LANG } from '../consts';

export function getLangFromPath(pathname: string): Lang {
  if (pathname.startsWith('/en/') || pathname === '/en') return 'en';
  return 'zh';
}

export function localizedPath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  if (lang === DEFAULT_LANG) {
    return clean === '' ? '/' : clean + '/';
  }
  return clean === '' ? '/en/' : '/en' + clean + '/';
}

export function getAlternatePath(pathname: string): { lang: Lang; path: string } {
  const currentLang = getLangFromPath(pathname);
  if (currentLang === 'zh') {
    const path = pathname === '/' ? '/en/' : '/en' + pathname;
    return { lang: 'en', path };
  } else {
    const stripped = pathname.replace(/^\/en/, '') || '/';
    return { lang: 'zh', path: stripped };
  }
}
