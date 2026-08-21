import { getCollection } from "astro:content";
import type { Blog } from "./interface";

export interface LocalizedPost {
    slug: string;
    vi: Blog;
    en?: Blog;
}

function parsePostId(id: string) {
    const isEnglish = id.endsWith("/index_en");

    return {
        lang: isEnglish ? "en" : "vi",
        slug: isEnglish ? id.replace(/\/index(?:_en)?$/, "") : id,
    } as const
}

export async function getLocalizedPosts(): Promise<LocalizedPost[]> {
    const posts = await getCollection("blog");
    const groupedPosts = new Map<string, Partial<Record<"vi" | "en", Blog>>>();

    for (const post of posts) {
        const { slug, lang } = parsePostId(post.id);
        const existing = groupedPosts.get(slug) || {};

        existing[lang] = post;
        groupedPosts.set(slug, existing);
    }
    
    return [...groupedPosts.entries()]
        .filter((entry): entry is [string, {
            vi: Blog;
            en?: Blog;
        }] => Boolean(entry[1].vi)) // Ensure there's at least a Vietnamese version
        .map(([slug, versions]) => ({
            slug,
            vi: versions.vi,
            en: versions.en,
        }))
        .sort((a, b) => new Date(b.vi.data.pubDate).getTime() - new Date(a.vi.data.pubDate).getTime());
}