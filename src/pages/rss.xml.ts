import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { site } from "../data/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts", ({ data }) => data.published)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return rss({
    title: `${site.name}'s diary`,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description,
      link: `/blog/${p.id.replace(/\/index$/, "")}/`,
    })),
  });
}
