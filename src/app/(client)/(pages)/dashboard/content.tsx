"use client";

import { useSession } from "next-auth/react";
import GitHubAvatar from "@/app/(client)/components/github/Avatar";
import { ProjectCard } from "@/app/(client)/components/cards/ProjectCard";
import { Project } from "@/types/project";

interface DashboardContentProps {
  projects: Project[];
}

export default function DashboardContent({ projects }: DashboardContentProps) {
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <GitHubAvatar className="w-16 h-16 mr-4" />
        <h1 className="text-3xl font-bold">
          Welcome, {session?.user?.username || "User"}!
        </h1>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          You don't have any projects yet.
        </p>
      )}
    </div>
  );
}
