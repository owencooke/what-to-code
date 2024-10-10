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

export type { GitHubRepo };
