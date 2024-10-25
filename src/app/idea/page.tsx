"use server";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { searchIdeas } from "@/lib/db/query/idea";
import IdeasGrid from "./IdeasGrid";

// Dynamically import client side SearchInput component
const SearchInput = dynamic(() => import("@/components/SearchInput"), {
  ssr: false,
});

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const ideas = await searchIdeas(searchParams.q);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">
        Brainstorm Ideas
      </h1>
      <div className="mb-8">
        <SearchInput route="idea" />
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
