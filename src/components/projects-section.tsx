"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
};

const projects: Project[] = [
  {
    id: 4,
    title: "AchievTrack",
    description:
      "Achievement and goal tracking application developed with TypeScript.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["TypeScript", "Full-stack", "Next.js", "Tailwind CSS", "Prisma"],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/AchievTrack",
  },
  {
    id: 1,
    title: "PDF Converter",
    description:
      "A full-stack PDF converter application built with Go backend and React frontend.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Go", "React", "TypeScript", "Full-stack"],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/pdf-converter",
  },
  {
    id: 2,
    title: "Go Weather App",
    description:
      "Weather application with Go backend and TypeScript frontend for real-time weather data.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Go", "TypeScript", "React", "API Integration", "Full-stack"],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/go-weather-app",
  },
  {
    id: 3,
    title: "GameRent",
    description:
      "Game rental system built with Spring Boot featuring user authentication and rental management.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Java", "Spring Boot", "Full-stack"],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/GameRent",
  },
  {
    id: 5,
    title: "CalTrack",
    description:
      "Mobile application for tracking calories and nutrition built with Flutter.",
    image: "/placeholder.svg?height=400&width=600",
    tags: ["Flutter", "Dart", "Mobile App"],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/CalTrack",
  },
  {
    id: 6,
    title: "HMM-LSTM",
    description:
      "Financial backtesting model implementing Hidden Markov Model and LSTM algorithms in Python.",
    image: "/placeholder.svg?height=400&width=600",
    tags: [
      "Python",
      "Machine Learning",
      "Financial Analysis",
      "API Integration",
      "Backend",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/rithbennet/HMM-LSTM",
  },
];

const allTags = Array.from(
  new Set(projects.flatMap((project) => project.tags))
);

export function ProjectsSection() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) =>
          project.tags.some((tag) => selectedTags.includes(tag))
        )
      : projects;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <section id="projects" className="py-5 sm:py-6 md:py-8">
      <h2 className="mb-4 text-center text-xl font-bold sm:text-2xl md:text-3xl">
        Projects
      </h2>

      <div className="mb-4 flex flex-wrap justify-center gap-1 sm:gap-2 md:mb-6">
        <Button
          variant={selectedTags.length === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTags([])}
          className="h-6 rounded-full px-2 text-[10px] sm:h-7 sm:text-xs md:h-8 md:text-sm"
        >
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleTag(tag)}
            className="h-6 rounded-full px-2 text-[10px] sm:h-7 sm:text-xs md:h-8 md:text-sm"
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-32 sm:h-36 md:h-40">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-2.5 sm:p-3 md:p-4">
              <h3 className="mb-1 text-base font-bold sm:text-lg md:text-xl">
                {project.title}
              </h3>
              <p className="text-foreground/70 mb-2 text-[11px] sm:text-xs md:text-sm">
                {project.description}
              </p>
              <div className="mb-2 flex flex-wrap gap-1">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-1.5 py-0.5 text-[8px] sm:text-[10px] md:text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-2.5 pt-0 sm:p-3 md:p-4">
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 gap-1 px-2 text-[10px] sm:h-7 sm:text-xs md:h-8 md:text-sm"
                >
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                  Demo
                </Button>
              </Link>
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 gap-1 px-2 text-[10px] sm:h-7 sm:text-xs md:h-8 md:text-sm"
                >
                  <Github className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                  Code
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
