import Giscus from "@giscus/react";
import { useEffect, useState } from "react";

export default function Comments() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const update = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

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
        theme={theme === "dark" ? "dark" : "light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
