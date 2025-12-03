"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type PostPreview = {
  title: string;
  description: string;
  url: string;
};

export default function LocalSearch({ posts }: { posts: PostPreview[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s)
    );
  }, [q, posts]);

  return (
    <div className="mb-6">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search posts..."
        className="w-full rounded border border-neutral-300 bg-transparent px-3 py-2 focus:ring-2 focus:ring-neutral-400 focus:outline-none dark:border-neutral-700 dark:focus:ring-neutral-600"
      />
      {q && (
        <ul className="mt-3 space-y-2 text-sm">
          {filtered.length === 0 ? (
            <li className="text-neutral-500">No posts found.</li>
          ) : (
            filtered.map((p) => (
              <li key={p.url}>
                <Link href={p.url} className="hover:text-primary underline">
                  {p.title}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
