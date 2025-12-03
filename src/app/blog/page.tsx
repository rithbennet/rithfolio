import { allPosts } from ".contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import LocalSearch from "./components/LocalSearch";
import { slugify } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";

export const metadata: Metadata = {
  title: "Blog",
  description: "Engineering thoughts, tutorials, and insights.",
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: "Blog | Rithfolio",
    description: "Engineering thoughts, tutorials, and insights.",
    url: `${baseUrl}/blog`,
    type: "website",
  },
};

export default function BlogPage() {
  const posts = allPosts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Derive tag cloud
  const tagCounts = new Map<string, number>();
  posts.forEach((p) =>
    (p.tags ?? []).forEach((t: string) =>
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    )
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      <LocalSearch
        posts={posts.map((p) => ({
          title: p.title,
          description: p.description,
          url: p.url,
        }))}
      />

      {tagCounts.size > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 text-sm">
          {[...tagCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([tag, count]) => (
              <Link
                key={tag}
                href={`/blog/tag/${slugify(tag)}`}
                className="rounded border border-neutral-300 px-2 py-1 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
              >
                #{tag} ({count})
              </Link>
            ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col gap-4 sm:flex-row"
            >
              {post.coverImage && (
                <Link
                  href={post.url}
                  className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:h-32 sm:w-48 dark:border-neutral-800 dark:bg-neutral-800"
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col justify-center">
                <Link href={post.url} className="block">
                  <h2 className="group-hover:text-primary dark:group-hover:text-primary-foreground text-xl font-semibold text-neutral-900 transition-colors dark:text-neutral-100">
                    {post.title}
                  </h2>
                </Link>
                <div className="mt-2 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                  <time dateTime={post.date}>
                    {format(parseISO(post.date), "LLLL d, yyyy")}
                  </time>
                  <span>•</span>
                  <span>{post.readingTime}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-neutral-600 dark:text-neutral-400">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${slugify(tag)}`}
                        className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
