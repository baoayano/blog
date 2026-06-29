# Ari's Blog

A personal blog built with Astro, Tailwind CSS 4, Astro Icon, Firebase, and Cloudflare Turnstile. Posts are written in Markdown under `src/blog`, with each post able to keep its own images beside the Markdown file, then rendered into the blog index, individual post pages, and a homepage that highlights recent posts.

## Features

- Homepage with an intro section and a list of recent posts.
- Blog index with pagination.
- Post detail pages with Markdown rendering and code highlighting.
- Copy button for code blocks inside posts.
- Comment section on blog posts.
- Cloudflare Turnstile verification for comment submissions.
- Firebase Admin and Firestore-backed comment storage.
- Comment listing API with initial and "View More" loading.
- Sticky header with theme toggle and a scroll progress bar.
- Light/dark theme persisted in `localStorage`.
- Open Graph and Twitter metadata for each page.
- Vercel deployment support through `@astrojs/vercel`.

## Requirements

- Node.js `>=22.12.0`
- `pnpm`
- Firebase project with Firestore enabled
- Firebase service account credentials
- Cloudflare Turnstile site key and secret key

## Environment Variables

Copy the example environment file, then fill in the values:

```sh
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID used by the client and server |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email |
| `PUBLIC_TURNSTILE_SITE_KEY` | Public Cloudflare Turnstile site key rendered on blog posts |
| `TURNSTILE_SECRET_KEY` | Secret Cloudflare Turnstile key used by the comment API |

The comment form and comment APIs require these values to be configured.

## Run the Project

```sh
pnpm install
pnpm dev
```

Then open `http://localhost:4321`.

## Build

```sh
pnpm build
pnpm preview
```

## Deployment

This project is configured with the Astro Vercel adapter in `astro.config.ts`.

When deploying to Vercel:

1. Import the repository into Vercel.
2. Add all variables from `.env.example` to the Vercel project environment variables.
3. Deploy with the default `pnpm build` build command.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development environment |
| `pnpm build` | Build the production site |
| `pnpm preview` | Preview the production build |
| `pnpm astro` | Run the Astro CLI |

## Main Structure

```text
/
├── .env.example
├── public/
│   ├── favicon.png
│   ├── homura.png
│   └── opengraph.png
├── src/
│   ├── assets/
│   ├── blog/
│   │   └── discord-widget/
│   │       ├── cover.png
│   │       ├── index.md
│   │       └── post-*.png
│   ├── components/
│   │   ├── Bar.astro
│   │   ├── Footer.astro
│   │   └── Header.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── firebase-admin.ts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── api/
│   │   │   ├── comment.ts
│   │   │   └── view.ts
│   │   └── blog/
│   │       ├── [...page].astro
│   │       └── [slug].astro
│   ├── styles/
│   │   └── global.css
│   ├── content.config.ts
│   ├── env.d.ts
│   └── utils/
│       ├── api.ts
│       ├── icon.ts
│       └── interface.ts
├── astro.config.ts
└── pnpm-workspace.yaml
```

## How to create a post

1. Create a new folder in `src/blog` for the post, then add an `index.md` file inside it.
2. Add the required frontmatter fields:

```md
---
title: Post title
description: Short description
pubDate: 2026-06-02
cover: ./cover.png
---
```

3. Keep post images in the same folder as the Markdown file and reference them with relative paths like `./post-1.png`.

The current repo already includes one post at `src/blog/discord-widget/index.md`.

## Comments

Each blog post includes a comment form and displays comments for that post.

Comment flow:

1. The post page renders a Cloudflare Turnstile widget using `PUBLIC_TURNSTILE_SITE_KEY`.
2. The browser submits the comment to `POST /api/comment`.
3. The API verifies the Turnstile token with `TURNSTILE_SECRET_KEY`.
4. The API validates the post ID, name, and comment length.
5. The API rate limits non-localhost requests by IP.
6. Valid comments are saved to Firestore.
7. The post page loads comments from `GET /api/view?postId=<post-id>`.

Comment-related files:

- `src/pages/api/comment.ts` handles comment submissions.
- `src/pages/api/view.ts` returns comments for a post.
- `src/lib/firebase-admin.ts` initializes Firebase Admin.
- `src/utils/api.ts` contains comment, validation, Turnstile, rate limiting, and Firestore helpers.
- `src/utils/interface.ts` defines the `Comment` interface.
- `src/env.d.ts` defines the Turnstile browser API types.

## License

This project is licensed under the [MIT License](LICENSE). You may use, copy, modify, distribute, sublicense, and sell copies of the software under the license terms.

## Notes

- The default layout lives in `src/layouts/Layout.astro`.
- The theme is initialized in `Layout.astro` and toggled from `Header.astro`.
- The blog content schema is defined in `src/content.config.ts`.
- The comment form is rendered in `src/pages/blog/[slug].astro`.
- The site preconnects to Cloudflare Turnstile from `Layout.astro`.