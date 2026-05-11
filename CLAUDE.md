# jackpan.me

Personal blog built with Astro, supporting bilingual (Chinese / English) content.

## Stack

- **Astro 5** with content collections + MDX
- **Tailwind CSS** with typography plugin
- **Shiki** for code highlighting (built-in, dual theme)
- **i18n** via native Astro support — Chinese (`/`) and English (`/en/`)

## Development

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # output to dist/
pnpm preview  # preview the build
```

## Writing posts

Posts live in `src/content/posts/` under language directories:

```
src/content/posts/
├── zh/
│   └── my-post.mdx
└── en/
    └── my-post.mdx   # same filename = linked translation
```

Use the same filename across languages to enable the "available in other language" link.

## Deploying

Cloudflare Pages — connect this repo, set build command to `pnpm build`, output directory to `dist`, and `NODE_VERSION=20`. Then bind your custom domain.

## License

MIT
