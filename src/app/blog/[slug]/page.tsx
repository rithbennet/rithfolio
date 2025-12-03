import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Comments from "../components/Comments";
import { format, parseISO } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXContent } from "../components/MDXContent";
import { slugify } from "@/lib/utils";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rith.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const ogImage = post.coverImage
    ? `${baseUrl}${post.coverImage}`
    : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogImage],
    },
  };
}

import Image from "next/image";

// ... existing imports

// ... existing code

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(post.structuredData),
        }}
      />

      <header className="mb-10">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">
          {post.title}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <time dateTime={post.date}>
              {format(parseISO(post.date), "MMMM d, yyyy")}
            </time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>

          {post.tags && post.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${slugify(tag)}`}
                  className="rounded-md bg-neutral-100 px-2 py-0.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        {post.coverImage && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDXContent code={post.body.code} />
      </div>

      <hr className="my-12 border-neutral-200 dark:border-neutral-800" />

      <Comments />
    </article>
  );
}
