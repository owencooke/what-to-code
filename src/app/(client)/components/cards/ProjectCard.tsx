"use client";

import { Project } from "@/types/project";
import { Badge } from "@/app/(client)/components/ui/badge";
import { Card, CardContent } from "@/app/(client)/components/ui/card";
import Repo from "@/app/(client)/components/github/Repo";
import { getRepoFromProjectTitle } from "@/app/(server)/integration/github/string-utils";
import { useRouter } from "next/navigation";

export function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-colors hover:bg-border"
      onClick={() => router.push(`/project/${project.id}`)}
    >
      <CardContent className="p-4 flex gap-2 flex-col">
        <h3 className="font-bold text-lg">{project.title}</h3>
        <Repo
          className="md:hidden block text-xs text-muted-foreground"
          repoName={getRepoFromProjectTitle(project.title)}
          username={project.github_user}
        />
        <span className="text-sm text-muted-foreground mb-3 line-clamp-4 md:line-clamp-3">
          {project.description}
        </span>
        <div className="flex flex-col-reverse gap-4 md:flex-row items-center justify-start md:justify-between text-xs text-muted-foreground">
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
  );
}
