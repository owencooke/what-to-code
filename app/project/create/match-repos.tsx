"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarIcon, GitForkIcon, GithubIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { GitHubRepo } from "@/types/github";
import Link from "next/link";

export default function MatchedRepos({
  techDescription,
}: {
  techDescription: string;
}) {
  const { data: session } = useSession();

  const fetchRepos = async (): Promise<GitHubRepo[]> => {
    return ky
      .get("/api/templates", {
        searchParams: { techDescription },
        headers: {
          Authorization: `token ${session?.accessToken}`,
        },
      })
      .json();
  };

  const {
    data: repos,
    isLoading,
    error,
  } = useQuery<GitHubRepo[], Error>({
    queryKey: ["repos", techDescription, session?.accessToken],
    queryFn: fetchRepos,
    enabled: !!session?.accessToken,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading repositories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Failed to fetch repositories: {error.message}
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return <div className="text-center">No matching template repositories</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <Card key={repo.url} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">
              <Link
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-secondary"
              >
                <GithubIcon className="inline" /> {repo.name}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {repo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-4">
              {repo.topics?.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitForkIcon className="w-4 h-4" />
                {repo.forks}
              </span>
            </div>
            {/* <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Created: {new Date(repo.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCwIcon className="w-4 h-4" />
                Updated: {new Date(repo.updatedAt).toLocaleDateString()}
              </span>
            </div> */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
