import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { format, parseISO } from "date-fns";

const contentDirectory = path.join(process.cwd(), "content", "blogs");

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  readTime: number;
  tags: string[];
  content: string;
  featured?: boolean;
  publishedAt: string;
};

export function getBlogPosts(): BlogPost[] {
  // Get all file names in the content directory
  const fileNames = fs.readdirSync(contentDirectory);

  // Parse each file and get metadata + content
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" to get id
      const id = fileName.replace(/\.md$/, "");
      const slug = id;

      // Read file as string
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);

      // Calculate read time (rough estimate - 200 words per minute)
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const readTime = Math.ceil(wordCount / 200);

      return {
        id,
        slug,
        title: data.title,
        date: format(parseISO(data.date), "MMMM dd, yyyy"),
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || null,
        author: data.author || "Anonymous",
        readTime,
        tags: data.tags || [],
        content,
        featured: data.featured || false,
        publishedAt: data.date,
      };
    });

  // Sort posts by date
  return posts.sort((a, b) => {
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

export function getFeaturedPosts(): BlogPost[] {
  return getBlogPosts().filter((post) => post.featured);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug);
}

export async function getPostContent(slug: string): Promise<string> {
  const post = getBlogPost(slug);
  if (!post) return "";

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(post.content);

  return processedContent.toString();
}

export function getRelatedPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  return getBlogPosts()
    .filter(
      (post) =>
        post.id !== currentPost.id &&
        post.tags.some((tag) => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getBlogPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
