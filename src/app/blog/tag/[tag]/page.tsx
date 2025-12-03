import { allPosts } from "contentlayer/generated";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";

export const dynamicParams = true;

function getAllTagSlugs() {
  const set = new Set<string>();
  allPosts.forEach((p) =>
    (p.tagSlugs ?? []).forEach((t: string) => set.add(t))
  );
  return Array.from(set);
}

export function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `#${tag} posts`,
    description: `Articles tagged with ${tag}`,
    alternates: { canonical: `${baseUrl}/blog/tag/${tag}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = allPosts
    .filter((p) => p.published && (p.tagSlugs ?? []).includes(tag))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold">#{tag}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">No posts yet.</p>
        <p className="mt-4">
          <Link href="/blog" className="hover:text-primary underline">
            ← Back to blog
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/blog"
          className="mb-4 inline-block text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          ← Back to blog
        </Link>
        <h1 className="text-3xl font-bold">#{tag}</h1>
        <p className="mt-1 text-neutral-600 dark:text-neutral-400">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </p>
      </div>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={post.url}>
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
            </Link>
            <div className="mt-1 flex gap-2 text-sm text-neutral-500">
              <time dateTime={post.date}>
                {format(parseISO(post.date), "LLLL d, yyyy")}
              </time>
              <span>•</span>
              <span>{post.readingTime}</span>
            </div>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {post.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
