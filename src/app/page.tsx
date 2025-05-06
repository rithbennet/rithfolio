import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { SocialLinks } from "@/components/social-links";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto">
        <section className="flex flex-col items-center justify-center gap-4 py-6 md:flex-row md:justify-between md:gap-6 md:py-16 lg:py-24">
          <div className="w-full md:w-1/2 lg:w-3/5">
            <h1 className="mb-3 text-3xl font-bold sm:text-4xl md:mb-4 md:text-5xl lg:text-6xl">
              hi there <span className="animate-wave inline-block">👋</span>
            </h1>
            <p className="mb-2 text-base sm:text-lg md:mb-3">
              22-year-old full stack software developer from Kuala Lumpur 🇲🇾
            </p>
            <p className="text-foreground/80 mb-4 max-w-2xl text-sm sm:text-base md:mb-6">
              I like to develop full stack web apps and trying out new tech!
              <br />
              I do weightlfting and photography in my free time too!
              <br />
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="h-8 gap-1.5 text-xs sm:h-9 sm:gap-2 sm:text-sm"
              >
                <IoDocumentTextOutline className="h-3 w-3 sm:h-4 sm:w-4" />
                Resume
              </Button>
              <SocialLinks />
            </div>
          </div>
          <div className="flex justify-center pt-4 md:justify-end md:pt-0">
            <div className="relative h-48 w-48 overflow-hidden rounded-2xl sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72">
              <Image
                src="/pfp.jpg"
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <SkillsSection />

        <ProjectsSection />
      </main>
    </div>
  );
}
