import {
  Card,
  CardHeader,
  CardContent,
} from "@/app/(client)/components/ui/card";
import { GitHubRepo } from "@/types/github";
import { GitBranchIcon, StarIcon, LockIcon } from "lucide-react";

export default function GitHubWidget({
  repoInfo,
}: {
  repoInfo: GitHubRepo | null;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-xl font-semibold">GitHub Repository</h2>
      </CardHeader>
      <CardContent>
        {repoInfo ? (
          <>
            <a
              href={repoInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {repoInfo.name}
            </a>
            <div className="flex items-center mt-2">
              <StarIcon className="mr-1" />
              <span>{repoInfo.stars}</span>
              <GitBranchIcon className="ml-4 mr-1" />
              <span>{repoInfo.forks}</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <LockIcon className="mb-2 h-5 w-5" />
            <p>Sign in to view repository details</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
