"use server";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { searchIdeas } from "@/lib/db/query/idea";
import IdeasGrid from "./IdeasGrid";
import categories from "@/app/idea/data/categories";

// Dynamically import client side SearchInput component
const SearchInput = dynamic(() => import("@/components/SearchInput"), {
  ssr: false,
});

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: { search?: string; topics?: string[] | string };
}) {
  const { search, topics } = searchParams;
  const normalizedTopics = topics
    ? Array.isArray(topics)
      ? topics
      : [topics]
    : undefined;

  const ideas = await searchIdeas(search, normalizedTopics);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">
        Brainstorm Ideas
      </h1>
      <div className="mb-8 flex justify-center">
        <SearchInput route="idea" topics={categories} className="w-4/5" />
      </div>
      <Suspense fallback={<IdeasGridSkeleton />}>
        <IdeasGrid ideas={ideas} />
      </Suspense>
    </div>
  );
}

function IdeasGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="h-40 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}
