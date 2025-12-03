"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export default function Comments() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <Giscus
        id="comments"
        repo="rithbennet/rithfolio"
        repoId="R_kgDOOiS53g"
        category="General"
        categoryId="DIC_kwDOOiS53s4CzWsj"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
        data-input-position="top"
      />
    </div>
  );
}
