"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <Giscus
        id="comments"
        repo="rithbennet/rithfolio" // TODO: Update with your repo
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
        category="General" // TODO: Update with your category
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
