"use client";

import Repo from "@/components/github/Repo";
import { Card, CardContent } from "@/components/ui/card";
import { getRepoFromProjectTitle } from "@/lib/github/string-utils";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import router from "next/router";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {projects.map((project, idx) => (
        // Explore Page project card
        <Card
          key={idx}
          className="overflow-hidden cursor-pointer transition-colors hover:bg-border"
          onClick={() => router.push(`/project/${project.id}`)}
        >
          <CardContent className="p-4 flex gap-2 flex-col">
            <h3 className="font-bold text-lg">{project.title}</h3>
            {/* RepoDisplay for smaller screens */}
            <Repo
              className="md:hidden block text-xs text-muted-foreground"
              repoName={getRepoFromProjectTitle(project.title)}
              username={project.github_user}
            />
            <span className="text-sm text-muted-foreground mb-3 line-clamp-4 md:line-clamp-3">
              {project.description}
            </span>
            <div className="flex flex-col-reverse gap-4 md:flex-row items-center justify-start md:justify-between text-xs text-muted-foreground">
              {/* RepoDisplay for larger screens */}
              <Repo
                className="w-fit hidden md:block"
                repoName={getRepoFromProjectTitle(project.title)}
                username={project.github_user}
              />
              <div className="flex md:justify-end flex-wrap gap-1">
                {project.framework.tools.slice(0, 3).map((tech, idx) => (
                  <Badge key={idx} variant="secondary">
                    {tech}
                  </Badge>
                ))}
                {project.framework.tools.length > 3 && (
                  <Badge variant="secondary">
                    +{project.framework.tools.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
