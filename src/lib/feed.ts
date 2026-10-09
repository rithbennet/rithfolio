// Diary entries and AI reports as one list, for pages that show both (tag pages).
import { getCollection } from "astro:content";

export interface FeedItem {
  title: string;
  date: Date;
  tags: string[];
  kind: "Diary" | "AI report";
  href: string;
}

export async function getFeed(): Promise<FeedItem[]> {
  const posts = await getCollection("posts", ({ data }) => data.published);
  const reports = await getCollection("reports", ({ data }) => data.published);
  return [
    ...posts.map((p) => ({
      title: p.data.title,
      date: p.data.date,
      tags: p.data.tags,
      kind: "Diary" as const,
      href: `/blog/${p.id.replace(/\/index$/, "")}`,
    })),
    ...reports.map((r) => ({
      title: r.data.title,
      date: r.data.date,
      tags: r.data.tags,
      kind: "AI report" as const,
      href: `/reports/${r.id}/`,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());
}
