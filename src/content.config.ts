import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "**/index.mdx",
    base: "./content/posts",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    coverImageSrc: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    published: z.boolean().default(true),
  }),
});

export const collections = { posts };
