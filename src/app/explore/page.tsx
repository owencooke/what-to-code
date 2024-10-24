import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Repo from "@/components/github/Repo";
import Link from "next/link";
import { getRepoFromProjectTitle } from "@/lib/github/string-utils";

async function fetchProjects(searchTerm: string): Promise<Project[]> {
  const res = await fetch(
    `/api/project?query=${encodeURIComponent(searchTerm)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const searchTerm = searchParams.query || "";
  let projects: Project[] = [];
  let error: Error | null = null;

  try {
    projects = await fetchProjects(searchTerm);
  } catch (e) {
    error = e instanceof Error ? e : new Error("An unknown error occurred");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">
        {`what's being built?`}
      </h1>

      <div className="mb-8">
        <form>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="query"
              placeholder="Search projects..."
              className="pl-10 w-full"
              defaultValue={searchTerm}
            />
          </div>
        </form>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, idx) => (
            <Link href={`/project/${project.id}`} key={idx}>
              <Card className="overflow-hidden cursor-pointer transition-colors hover:bg-border">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
