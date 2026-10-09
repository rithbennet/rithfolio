import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

// wrap Markdown tables so wide ones scroll instead of overflowing (and match the AI reports' markup)
function rehypeWrapTables() {
    const wrap = (node) => {
        if (!node.children) return;
        node.children = node.children.map((child) => {
            if (child.type === "element" && child.tagName === "table") {
                return { type: "element", tagName: "div", properties: { className: ["tw"] }, children: [child] };
            }
            wrap(child);
            return child;
        });
    };
    return wrap;
}

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
    theme: {
        dark: "dracula-soft",
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
    // one address per page: /about, never /about/. Vercel redirects the slashed form, and the
    // sitemap, canonical tags and links all agree, so Google doesn't see duplicates
    trailingSlash: "never",
    adapter: vercel(),
    integrations: [react(), mdx(), sitemap()],
    // old routes from the previous site
    redirects: {
        "/projects": "/work",
        "/skills": "/about",
        "/contact": "/#contact",
        "/reports": "/blog#reports",
    },
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        syntaxHighlight: false,
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            rehypeWrapTables,
            [rehypePrettyCode, prettyCodeOptions],
            [
                rehypeAutolinkHeadings,
                { behavior: "append", properties: { className: ["anchor"] } },
            ],
        ],
    },
});
