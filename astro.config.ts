// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: "https://blog.shizuku.tech",
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [icon(), sitemap({
        namespaces: {
            news: false,
            video: false,
            xhtml: false
        },
    }), mdx()],
    markdown: {
        shikiConfig: {
            theme: "dracula",
            themes: {
                light: "github-light",
                dark: "github-dark",
            }
        }
    },
    fonts: [
        {
            provider: fontProviders.google(),
            cssVariable: '--font-primary',
            name: 'IBM Plex Sans',
            weights: [400, 500, 600, 700],
            styles: ["normal", "italic"],
            subsets: ['latin', 'vietnamese'],
            fallbacks: ["sans-serif"],
            display: "swap",
        },
        {
            provider: fontProviders.google(),
            cssVariable: '--font-code',
            name: 'Google Sans Code',
            styles: ["normal"],
            weights: [400, 500, 600, 700],
            subsets: ['latin', 'vietnamese'],
            fallbacks: ["monospace"],
            display: "swap",
        }
    ],
    adapter: vercel(),
    image: {
        layout: "constrained",
        responsiveStyles: true
    },
    build: {
        inlineStylesheets: "always",
    }
});