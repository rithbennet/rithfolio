import type { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rithfolio.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .filter((p) => p.published)
    .map((post) => ({
      url: `${baseUrl}${post.url}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/skills`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  return [...staticRoutes, ...posts];
}
