"use client";

import * as React from "react";
import { MDXComponents } from "./MDXComponents";

interface MDXContentProps {
  code: string;
}

type MDXComponentType = React.ComponentType<{
  components?: typeof MDXComponents;
}>;

export function MDXContent({ code }: MDXContentProps) {
  const [Component, setComponent] = React.useState<MDXComponentType | null>(
    null
  );

  React.useEffect(() => {
    // Dynamically evaluate the MDX code
    const getMDXComponent = (code: string): MDXComponentType => {
      const fn = new Function("React", code);
      return fn(React).default;
    };

    try {
      const MDXComponent = getMDXComponent(code);
      setComponent(() => MDXComponent);
    } catch (error) {
      console.error("Error loading MDX component:", error);
    }
  }, [code]);

  if (!Component) {
    return (
      <div className="prose prose-lg dark:prose-invert max-w-none animate-pulse">
        <div className="mb-4 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="mb-4 h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <Component components={MDXComponents} />
    </div>
  );
}
