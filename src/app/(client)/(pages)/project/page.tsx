"use server";

import { Suspense } from "react";
import { Project } from "@/types/project";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/app/(client)/components/ui/alert";
import dynamic from "next/dynamic";
import ProjectsGrid from "./ProjectsGrid";
import { searchProjects } from "@/app/(server)/db/query/project";
import { CATEGORIES } from "@/lib/constants/categories";

// Dynamically import client side SearchInput component
const SearchInput = dynamic(
  () => import("@/app/(client)/components/SearchInput"),
  {
    ssr: false,
  },
);

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { search?: string; tags?: string[] | string };
}) {
  const { search, tags } = searchParams;
  let projects: Project[] = [];
  let error: Error | null = null;

  try {
    projects = await searchProjects(search, tags);
  } catch (e) {
    error = e instanceof Error ? e : new Error("An unknown error occurred");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">
        Explore Projects
      </h1>

      <div className="mb-8 flex justify-center">
        <SearchInput
          className="max-w-3xl w-full"
          route="project"
          tags={CATEGORIES}
          initialTags={tags}
          initialSearchQuery={search}
        />
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
