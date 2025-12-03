"use client";

import React from "react";
import Image from "next/image";
import { CodeBlock } from "./CodeBlock";

export const MDXComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      {...props}
      className="mt-10 scroll-m-20 text-3xl font-bold tracking-tight first:mt-0"
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      className="mt-10 scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
    />
  ),
  h4: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 {...props} className="mt-6 scroll-m-20 text-lg font-semibold" />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      className="hover:text-primary font-medium underline underline-offset-4"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} className="leading-7" />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-neutral-300 pl-6 italic dark:border-neutral-700"
    />
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr
      {...props}
      className="my-8 border-neutral-200 dark:border-neutral-800"
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    // Inline code (not inside pre)
    return (
      <code
        {...props}
        className="relative rounded border border-neutral-200 bg-neutral-50 px-[0.3rem] py-[0.2rem] font-mono text-sm text-neutral-800 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
      />
    );
  },
  figure: (props: React.HTMLAttributes<HTMLElement>) => {
    // Check if this is a code block figure from rehype-pretty-code
    if ("data-rehype-pretty-code-figure" in props) {
      return <CodeBlock {...props}>{props.children}</CodeBlock>;
    }
    // Regular figure element
    return <figure {...props} />;
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
    // Pre elements from rehype-pretty-code, pass through with proper styling
    return <pre {...props} />;
  },
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table {...props} className="w-full" />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      className="border border-neutral-200 px-4 py-2 text-left font-bold dark:border-neutral-700"
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      {...props}
      className="border border-neutral-200 px-4 py-2 dark:border-neutral-700"
    />
  ),
  Image: (props: React.ComponentProps<typeof Image>) => (
    <Image
      {...props}
      alt={props.alt || ""}
      className="my-6 rounded-md border"
    />
  ),
};
