import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { FaGitAlt, FaJava, FaPython, FaReact } from "react-icons/fa";
import {
  SiGin,
  SiGo,
  SiNextdotjs,
  SiPostgresql,
  SiPrisma,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const skills = [
  {
    name: "React",
    icon: <FaReact className="h-10 w-10" />,
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="h-10 w-10" />,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="h-10 w-10" />,
  },
  {
    name: "Typescript",
    icon: <SiTypescript className="h-10 w-10" />,
  },
  {
    name: "Spring Boot",
    icon: <SiSpringboot className="h-10 w-10" />,
  },
  {
    name: "Go",
    icon: <SiGo className="h-10 w-10" />,
  },
  {
    name: "Python",
    icon: <FaPython className="h-10 w-10" />,
  },
  {
    name: "Java",
    icon: <FaJava className="h-10 w-10" />,
  },
  {
    name: "Gin",
    icon: <SiGin className="h-10 w-10" />,
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql className="h-10 w-10" />,
  },
  {
    name: "prisma",
    icon: <SiPrisma className="h-10 w-10" />,
  },
  {
    name: "Git",
    icon: <FaGitAlt className="h-10 w-10" />,
  },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-5 sm:py-6 md:py-8">
      <h2 className="mb-5 text-center text-xl font-bold sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl">
        Technical Skills
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
        {skills.map((skill) => (
          <Card
            key={skill.name}
            className="border-border/50 hover:border-primary/50 border transition-colors"
          >
            <CardContent className="flex flex-col items-center justify-center p-2 sm:p-3 md:p-4">
              <div className="text-foreground mb-1.5 sm:mb-2 md:mb-3">
                {React.cloneElement(skill.icon, {
                  className: "h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8",
                })}
              </div>
              <h3 className="text-center text-xs font-medium sm:text-sm md:text-base">
                {skill.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
