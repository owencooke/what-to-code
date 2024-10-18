"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ky from "ky";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import Repo from "@/components/github/Repo";
import { useRouter } from "next/navigation";
import { getRepoFromProjectTitle } from "@/lib/github/string-utils";

const fetchProjects = async (searchTerm: string): Promise<Project[]> =>
  ky.get("/api/project", { searchParams: { query: searchTerm } }).json();

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const setDebouncedSearchTerm = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 500),
    [],
  );

  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", searchTerm],
    queryFn: () => fetchProjects(searchTerm),
    refetchOnWindowFocus: false,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">
        {`what's being built?`}
      </h1>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 w-full"
            onChange={(e) => setDebouncedSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : (
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
      )}
    </div>
  );
}
