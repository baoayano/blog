# Ari's Blog

A personal blog built with Astro, Tailwind CSS 4, and Astro Icon. Posts are written in Markdown under `src/blog`, with each post able to keep its own images beside the Markdown file, then rendered into the blog index, individual post pages, and a homepage that highlights recent posts.

## Features

- Homepage with an intro section and a list of recent posts.
- Blog index with pagination.
- Post detail pages with Markdown rendering and code highlighting.
- Copy button for code blocks inside posts.
- Sticky header with theme toggle and a scroll progress bar.
- Light/dark theme persisted in `localStorage`.
- Open Graph and Twitter metadata for each page.

## Requirements

- Node.js `>=22.12.0`
- `pnpm`

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

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development environment |
| `pnpm build` | Build the production site into `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm astro` | Run the Astro CLI |

## Main Structure

```text
/
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
│   ├── pages/
│   │   ├── index.astro
│   │   └── blog/
│   │       ├── [...page].astro
│   │       └── [slug].astro
│   ├── styles/
│   │   └── global.css
│   ├── content.config.ts
│   └── utils/
│       └── icon.ts
└── astro.config.ts
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

## Notes

- The default layout lives in `src/layouts/Layout.astro`.
- The theme is initialized in `Layout.astro` and toggled from `Header.astro`.
- The blog content schema is defined in `src/content.config.ts`.
