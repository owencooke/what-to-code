import { Suspense } from "react";
import { Project } from "@/types/project";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import ProjectsGrid from "./ProjectsGrid";

// Dynamically import client side SearchInput component
const SearchInput = dynamic(() => import("@/components/SearchInput"), {
  ssr: false,
});

async function fetchProjects(searchTerm: string): Promise<Project[]> {
  const url = new URL(
    "/api/project",
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  );
  if (searchTerm) {
    url.searchParams.append("query", searchTerm);
  }
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchTerm = searchParams.q || "";
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
        Explore Projects
      </h1>

      <div className="mb-8">
        <SearchInput route="explore" />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsGrid projects={projects} />
      </Suspense>
    </div>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="h-40 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
