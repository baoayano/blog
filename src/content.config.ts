import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/blog'
    }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        cover: z.string(),
    })
})

export const collections = {
    blog
}