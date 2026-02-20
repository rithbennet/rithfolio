import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
    theme: {
        dark: "github-dark",
        light: "github-light",
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
    },
};

export default defineConfig({
    site: process.env.SITE_URL || "https://rith.dev",
    output: "static",
    adapter: vercel(),
    integrations: [react(), mdx(), sitemap(), icon()],
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [rehypePrettyCode, prettyCodeOptions],
            [
                rehypeAutolinkHeadings,
                { behavior: "append", properties: { className: ["anchor"] } },
            ],
        ],
    },
});
