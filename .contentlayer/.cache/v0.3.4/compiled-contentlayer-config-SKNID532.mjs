// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
var baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";
var prettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light"
  },
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className?.push("highlighted");
  },
  onVisitHighlightedChars(node) {
    node.properties.className = ["word"];
  }
};
function slugifyTag(tag) {
  return tag.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true },
    description: { type: "string", required: true },
    coverImage: { type: "string", required: false },
    tags: { type: "list", of: { type: "string" }, required: false },
    published: { type: "boolean", default: true }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^posts\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace(/^posts\//, "")}`
    },
    readingTime: {
      type: "string",
      resolve: (doc) => readingTime(doc.body.raw).text
    },
    tagSlugs: {
      type: "list",
      of: { type: "string" },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve: (doc) => {
        const tags = doc.tags?._array || doc.tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return [];
        }
        return tags.map(slugifyTag);
      }
    },
    structuredData: {
      type: "json",
      resolve: (doc) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: doc.title,
        datePublished: doc.date,
        description: doc.description,
        image: doc.coverImage ? `${baseUrl}${doc.coverImage}` : `${baseUrl}/api/og?title=${encodeURIComponent(doc.title)}`,
        url: `${baseUrl}/blog/${doc._raw.flattenedPath.replace(/^posts\//, "")}`,
        author: { "@type": "Person", name: "Harith" }
      })
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        { behavior: "append", properties: { className: ["anchor"] } }
      ]
    ]
  }
});
export {
  Post,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-SKNID532.mjs.map
