"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "ky";
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
import CustomizableCard from "@/components/cards/CustomizableCard";
import { useState } from "react";
import { NewProject } from "@/types/project";

interface MatchedReposProps {
  project: NewProject;
  onRepoClick: (templateRepo?: GitHubRepo) => void;
}

const MatchedRepos: React.FC<MatchedReposProps> = ({
  project,
  onRepoClick,
}) => {
  const { framework } = project;

  // The content used in vector search for matching project --> template
  const techDescription = `${framework.title} using ${framework.tools.join()}`;

  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo>();

  const fetchRepos = async (): Promise<GitHubRepo[]> =>
    ky
      .get("/api/templates", {
        searchParams: { techDescription },
        headers: {
          Authorization: `token ${session?.accessToken}`,
        },
      })
      .json();

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
      <div className="flex justify-center items-center h-48 w-full">
        <RocketIcon className="w-12 h-12 animate-bounce text-primary" />
        <span className="ml-4">Searching for matches...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex justify-center items-center h-48 w-full">
        {`Failed to fetch repositories. Please try again later :(`}
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="flex justify-center items-center h-48 w-full">{`Sorry, we couldn't find any matching repositories :(`}</div>
    );
  }

  const topicsToShow = isMobile ? 4 : 8;

  const handleSelectRepo = (repo: GitHubRepo) => {
    const newSelectedRepo = repo !== selectedRepo ? repo : undefined;
    setSelectedRepo(newSelectedRepo);
    onRepoClick(newSelectedRepo);
  };

  return (
    <>
      {repos.map((repo) => (
        <CustomizableCard
          key={repo.url}
          title={repo.name}
          description={repo.description}
          selected={repo.name === selectedRepo?.name}
          onSelect={() => handleSelectRepo(repo)}
          renderContent={() => (
            <div className="flex items-center gap-4">
              <Link
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  variant: "outline",
                  size: "icon",
                  className: "rounded-full w-8 h-8 p-0",
                })}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon className="h-4 w-4" />
                <span className="sr-only">View on GitHub</span>
              </Link>
              <span className="flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                {repo.stars}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <RefreshCwIcon className="w-4 h-4" />{" "}
                {new Date(repo.updatedAt).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </span>
            </div>
          )}
          renderFooter={() => (
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
          )}
        />
      ))}
    </>
  );
};

export default MatchedRepos;
