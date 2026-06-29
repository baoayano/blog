// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
    site: "https://blog.shizuku.tech",
    vite: {
        plugins: [tailwindcss()],
    },
    integrations: [icon()],
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
            weights: [400, 500, 600, 700, 800],
            subsets: ['latin', 'latin-ext', 'vietnamese'],
        },
        {
            provider: fontProviders.google(),
            cssVariable: '--font-code',
            name: 'Google Sans Code',
            weights: [400, 500, 600, 700, 800],
            subsets: ['latin', 'latin-ext', 'vietnamese'],
        }
    ],
    adapter: vercel(),
});
