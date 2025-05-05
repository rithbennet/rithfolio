import { SkillsSection } from "@/components/skills-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills & Expertise | Rith's Portfolio",
  description:
    "A comprehensive showcase of my technical skills, leadership abilities, and management expertise",
};

export default function SkillsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
        Skills & Expertise
      </h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground text-lg">
          My professional toolkit combines strong technical development skills
          with proven leadership and project management abilities.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-border/50 bg-card space-y-2 rounded-lg border p-4 shadow-sm">
            <h2 className="text-xl font-medium">Technical Proficiency</h2>
            <p className="text-muted-foreground text-sm">
              From frontend frameworks like React and Next.js to backend
              technologies including Go and Java, I build scalable, maintainable
              applications with modern tools and best practices.
            </p>
          </div>

          <div className="border-border/50 bg-card space-y-2 rounded-lg border p-4 shadow-sm">
            <h2 className="text-xl font-medium">Leadership & Management</h2>
            <p className="text-muted-foreground text-sm">
              I&apos;ve led development teams using Agile methodologies,
              particularly Scrum, to deliver projects on time while maintaining
              code quality and team collaboration.
            </p>
          </div>
        </div>
      </div>

      <SkillsSection />
    </main>
  );
}
