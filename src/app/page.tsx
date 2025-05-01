import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-black transition-all duration-300 dark:bg-black dark:text-white">
      <div className="max-w-3xl space-y-10 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">
          Welcome to the Next.js 13.4 App!
        </h1>
        <p className="text-lg md:text-xl">
          This is a simple example of a Next.js app with dark mode support.
        </p>

        <div>
          <Button> Button 1</Button>
          <Button variant="secondary"> Button 2</Button>
        </div>
      </div>
    </div>
  );
}
