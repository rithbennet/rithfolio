// Series: resolves a content/series/<id>.md file into its parts (diary entries and AI reports, in order),
// and finds the series a given entry or report belongs to.
import { type CollectionEntry, getCollection } from "astro:content";

export interface SeriesPart {
  key: string;
  kind: "Diary" | "AI report";
  title: string;
  href: string;
  date: Date;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  href: string;
  parts: SeriesPart[];
}

const postSlug = (id: string) => id.replace(/\/index$/, "");

async function resolve(entry: CollectionEntry<"series">): Promise<Series> {
  const posts = await getCollection("posts");
  const reports = await getCollection("reports");
  const parts: SeriesPart[] = [];
  for (const part of entry.data.parts) {
    if ("diary" in part) {
      const post = posts.find((p) => postSlug(p.id) === part.diary);
      if (!post) throw new Error(`Series "${entry.id}": no diary entry "${part.diary}" in content/posts`);
      // drafts drop out of the series until they're published
      if (!post.data.published) continue;
      parts.push({
        key: `diary:${part.diary}`,
        kind: "Diary",
        title: post.data.title,
        href: `/blog/${part.diary}`,
        date: post.data.date,
      });
    } else {
      const report = reports.find((r) => r.id === part.report);
      if (!report) throw new Error(`Series "${entry.id}": no report "${part.report}" in content/reports`);
      if (!report.data.published) continue;
      parts.push({
        key: `report:${part.report}`,
        kind: "AI report",
        title: report.data.title,
        href: `/reports/${part.report}`,
        date: report.data.date,
      });
    }
  }
  return {
    id: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    href: `/blog/series/${entry.id}`,
    parts,
  };
}

export async function getAllSeries(): Promise<Series[]> {
  return Promise.all((await getCollection("series")).map(resolve));
}

/** the series a diary entry ("diary:<slug>") or report ("report:<id>") is part of, with its position */
export async function getSeriesFor(key: string) {
  for (const series of await getAllSeries()) {
    const index = series.parts.findIndex((p) => p.key === key);
    if (index >= 0) return { ...series, index };
  }
  return undefined;
}

export type SeriesPosition = NonNullable<Awaited<ReturnType<typeof getSeriesFor>>>;
