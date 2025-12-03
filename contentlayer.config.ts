import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
import type { Options } from "rehype-pretty-code";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";

const prettyCodeOptions: Options = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
  onVisitLine(node) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  },
};

function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    coverImageSrc: { type: "string", required: false }, // Raw path from frontmatter
    tags: { type: "list", of: { type: "string" }, required: false },
    published: { type: "boolean", default: true },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, ""),
    },
    url: {
      type: "string",
      resolve: (doc) =>
        `/blog/${doc._raw.flattenedPath.replace(/^posts\//, "")}`,
    },
    readingTime: {
      type: "string",
      resolve: (doc) => readingTime(doc.body.raw).text,
    },
    coverImage: {
      type: "string",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (doc: any) => {
        if (!doc.coverImageSrc) return undefined;
        const slug = doc._raw.flattenedPath.replace(/^posts\//, "");
        // If path is relative (starts with ./ or doesn't start with /), convert to absolute
        if (
          doc.coverImageSrc.startsWith("./") ||
          !doc.coverImageSrc.startsWith("/")
        ) {
          const filename = doc.coverImageSrc.replace("./", "");
          return `/content/blogs/${slug}/${filename}`;
        }
        return doc.coverImageSrc;
      },
    },
    tagSlugs: {
      type: "list",
      of: { type: "string" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (doc: any) => {
        const tags = doc.tags?._array || doc.tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return [];
        }
        return tags.map(slugifyTag);
      },
    },
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date,
        description: doc.description,
        image: doc.coverImage
          ? `${baseUrl}${doc.coverImage}`
          : `${baseUrl}/api/og?title=${encodeURIComponent(doc.title)}`,
        url: `${baseUrl}/blog/${doc._raw.flattenedPath.replace(/^posts\//, "")}`,
        author: { "@type": "Person", name: "Harith" },
      }),
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [rehypePrettyCode as any, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        { behavior: "append", properties: { className: ["anchor"] } },
      ],
    ],
  },
});
