import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Diary entries (the blog). `reports` lists report ids this entry discusses.
const posts = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      description: z.string(),
      // the image head: a file next to index.mdx, e.g. `cover: ./cover.jpg`
      cover: image().optional(),
      coverAlt: z.string().default(""),
      coverCaption: z.string().optional(),
      tags: z.array(z.string()).optional().default([]),
      published: z.boolean().default(true),
      location: z.string().optional(),
      reports: z.array(z.string()).optional().default([]),
    }),
});

// AI reports: metadata here; the /report skill's HTML sits next to it as <id>.html and its images and videos in public/reports/<id>/.
const reports = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/reports" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.string().default("Report"),
    model: z.string(),
    readingTime: z.string().optional(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
  }),
});

// Work: ventures, roles, community work and side projects.
const work = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/work" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["venture", "role", "community", "project"]),
    role: z.string().optional(),
    period: z.string().optional(),
    category: z.string(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    // the company's own mark, with an optional variant for dark mode
    logo: z.string().optional(),
    logoDark: z.string().optional(),
    link: z.string().url().optional(),
    repo: z.string().url().optional(),
    featured: z.boolean().default(false),
    // projects no longer being worked on sit in a collapsed archive
    archived: z.boolean().default(false),
    order: z.number().default(100),
    published: z.boolean().default(true),
  }),
});

// Gallery: photo stories. `photos` stays empty until real photographs are added.
const gallery = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/gallery" }),
  schema: z.object({
    title: z.string(),
    place: z.string(),
    period: z.string(),
    summary: z.string(),
    order: z.number().default(100),
    photos: z
      .array(z.object({ src: z.string(), alt: z.string(), caption: z.string().optional(), ratio: z.string().optional() }))
      .default([]),
    standIn: z.array(z.enum(["dusk", "hills", "night", "studio", "sea"])).default([]),
  }),
});

// Series: diary entries and AI reports that read in order. `parts` lists them first to last,
// e.g. [{ diary: night-shift }, { report: puck-orchestration }, { diary: what-i-changed }].
const series = defineCollection({
  loader: glob({ pattern: "*.md", base: "./content/series" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    parts: z.array(z.union([z.object({ diary: z.string() }), z.object({ report: z.string() })])).min(1),
  }),
});

export const collections = { posts, reports, work, gallery, series };
