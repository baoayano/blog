import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/blog'
    }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updateDate: z.coerce.date().optional(),
        cover: image(),
        opengraph: z.string().optional()
    })
})

export const collections = {
    blog
}