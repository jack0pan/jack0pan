import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'PingFang SC',
               'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            color: 'rgb(55 65 81)',
            'h1, h2, h3, h4': {
              fontWeight: '600',
              letterSpacing: '-0.01em',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            code: {
              backgroundColor: 'rgb(243 244 246)',
              padding: '0.15rem 0.35rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
              fontSize: '0.9em',
            },
            pre: {
              backgroundColor: 'rgb(24 24 27)',
              padding: '1rem 1.25rem',
              borderRadius: '0.5rem',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-invert-body': '#f4f4f5',
            '--tw-prose-invert-bold': '#fafafa',
            '--tw-prose-invert-headings': '#fafafa',
            code: {
              backgroundColor: '#27272a',
              color: '#f4f4f5',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
