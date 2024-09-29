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
import {
  StarIcon,
  GitForkIcon,
  GithubIcon,
  RocketIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { GitHubRepo } from "@/types/github";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import useIsMobile from "@/hooks/useIsMobile";

interface MatchedReposProps {
  techDescription: string;
  onRepoClick: (templateRepo: GitHubRepo) => void;
}

const MatchedRepos: React.FC<MatchedReposProps> = ({
  techDescription,
  onRepoClick,
}) => {
  const { data: session } = useSession();
  const isMobile = useIsMobile();

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
      <div className="flex justify-center items-center h-48">
        <RocketIcon className="w-12 h-12 animate-bounce text-primary" />
        <span className="ml-4">Searching for matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex justify-center items-center h-48">
        {`Failed to fetch repositories. Please try again later :(`}
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="flex justify-center items-center h-48">{`Sorry, we couldn't find any matching repositories :(`}</div>
    );
  }

  const topicsToShow = isMobile ? 4 : 8;

  return (
    <>
      {repos.map((repo) => (
        <Card key={repo.url} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{repo.name}</CardTitle>
            <CardDescription>{repo.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow items-end w-full flex">
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {repo.topics.slice(0, topicsToShow).map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
              {repo.topics.length > topicsToShow && (
                <Badge variant="secondary">
                  +{repo.topics.length - topicsToShow}
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-4">
              <Link
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({ variant: "link" })} !p-0`}
              >
                <GithubIcon className="inline" />
              </Link>
              <span className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1">
                <GitForkIcon className="w-4 h-4" />
                {repo.forks}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <RefreshCwIcon className="w-4 h-4" />{" "}
                {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default MatchedRepos;
