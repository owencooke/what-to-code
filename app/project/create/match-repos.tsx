"use client";

import { useState, useEffect } from "react";
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
  CalendarIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface GitHubRepo {
  url: string;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  topics: string[];
  description: string;
  name: string;
}

export default function MatchedRepos({
  techDescription,
}: {
  techDescription: string;
}) {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await ky
          .get("/api/templates", {
            searchParams: { techDescription },
            headers: {
              Authorization: "token " + session?.accessToken,
            },
          })
          .json<GitHubRepo[]>();
        setRepos(data);
      } catch (err) {
        setError("Failed to fetch repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [techDescription, session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading repositories...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <Card key={repo.url} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">{repo.name}</CardTitle>
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
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Created: {new Date(repo.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <RefreshCwIcon className="w-4 h-4" />
                Updated: {new Date(repo.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
