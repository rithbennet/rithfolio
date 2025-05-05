import { ProjectsSection } from "@/components/projects-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects & Leadership | Rith's Portfolio",
  description:
    "Showcase of my technical and management projects, highlighting Scrum and Agile methodologies",
};

export default function ProjectsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
        Projects & Leadership
      </h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground text-lg">
          My portfolio showcases both technical expertise and leadership
          capabilities across diverse projects.
        </p>

        <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
          <h2 className="mb-2 text-xl font-medium">Management Highlights</h2>
          <ul className="text-muted-foreground ml-5 list-disc space-y-2 text-sm">
            <li>
              <strong>AchievTrack:</strong> Led a team of 5 developers as Scrum
              Master, implementing daily stand-ups, sprint planning, and
              retrospectives that improved team velocity by 30%.
            </li>
            <li>
              <strong>GameRent:</strong> Managed project timelines and resource
              allocation using Agile methodologies, resulting in on-time
              delivery despite shifting requirements.
            </li>
            <li>
              <strong>CalTrack:</strong> Leading a team of 4 developers in
              developing a mobile application to track calories for users acting
              as Scrum Master and Product Owner. Implemented Agile practices to
              ensure effective communication and collaboration within the team.
            </li>
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Technical Projects</h3>
            <p className="text-muted-foreground text-sm">
              Full-stack applications showcasing expertise in multiple
              programming languages and frameworks.
            </p>
          </div>

          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Leadership Experience</h3>
            <p className="text-muted-foreground text-sm">
              Team management and coordination using industry-standard
              approaches like Scrum and Agile.
            </p>
          </div>

          <div className="border-border/50 bg-card rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-medium">Measurable Outcomes</h3>
            <p className="text-muted-foreground text-sm">
              Projects delivered on time with documented improvements in
              quality, performance, and user satisfaction.
            </p>
          </div>
        </div>
      </div>

      <ProjectsSection />
    </main>
  );
}
