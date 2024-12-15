"use client";

import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { GitHubRepo } from "@/types/github";
import { RefreshCw, GitBranchIcon, StarIcon } from "lucide-react";
import Repo from "@/app/(client)/components/github/Repo";
import { format } from "timeago.js";

export default function GitHubWidget({
  repoInfo,
}: {
  repoInfo: GitHubRepo | null;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">GitHub Stats</h2>
      </CardHeader>
      <CardContent>
        {repoInfo ? (
          <div className="space-y-4">
            <Repo
              repoName={repoInfo.url.split("/")[4]}
              username={repoInfo.url.split("/")[3]}
              isClickable={true}
            />
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <StarIcon className="mr-1 h-4 w-4" />
                <span>{repoInfo.stars}</span>
              </div>
              <div className="flex items-center">
                <GitBranchIcon className="mr-1 h-4 w-4" />
                <span>{repoInfo.forks}</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="mr-1 h-4 w-4" />
                <span>{format(repoInfo.updatedAt)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 text-muted-foreground">
            <p>Repository not found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
