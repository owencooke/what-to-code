"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { Badge } from "@/app/(client)/components/ui/badge";
import { StarIcon, GithubIcon, RocketIcon, RefreshCwIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { GitHubRepo } from "@/types/github";
import Link from "next/link";
import { buttonVariants } from "@/app/(client)/components/ui/button";
import useScreenSize from "@/app/(client)/hooks/useScreenSize";
import CustomizableCard from "@/app/(client)/components/cards/CustomizableCard";
import { UseFormReturn } from "react-hook-form";

interface MatchedReposProps {
  form: UseFormReturn<any>;
}

const MatchedRepos: React.FC<MatchedReposProps> = ({ form }) => {
  const framework = form.watch("framework");
  const starterRepo = form.watch("starterRepo");

  const { status } = useSession();
  const { isSmall } = useScreenSize();

  const fetchRepos = async (): Promise<GitHubRepo[]> => {
    if (!framework) {
      return [];
    }
    // The content used in vector search for matching project --> template
    const techDescription = `${framework.title} using ${framework.tools.join()}`;
    return ky
      .get("/api/templates", {
        searchParams: { techDescription },
      })
      .json();
  };

  const {
    data: repos,
    isLoading,
    error,
  } = useQuery<GitHubRepo[], Error>({
    queryKey: ["repos", framework],
    queryFn: fetchRepos,
    enabled: status === "authenticated",
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
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
      <div className="flex justify-center items-center h-48 w-full text-sm">
        {status === "authenticated"
          ? `Sorry, we couldn't find any matching repositories :(`
          : `Sign in with GitHub to see recommended templates :)`}
      </div>
    );
  }

  const topicsToShow = isSmall ? 4 : 8;

  const handleSelectRepo = (repo: GitHubRepo) => {
    const url = repo.url !== starterRepo ? repo.url : null;
    form.setValue("starterRepo", url);
  };

  return (
    <>
      {repos.map((repo) => (
        <CustomizableCard
          key={repo.url}
          title={repo.name}
          description={repo.description}
          selected={repo.url === starterRepo}
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
