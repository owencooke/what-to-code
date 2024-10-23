"use server";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { getIdeas } from "@/lib/db/query/idea";
import IdeasGrid from "./IdeasGrid";

// Dynamically import client side SearchInput component
const SearchInput = dynamic(() => import("./SearchInput"), {
  ssr: false,
});

export default async function IdeasPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const ideas = await getIdeas(searchParams.query);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl mb-8 text-center">Explore Ideas</h1>

      <div className="mb-8">
        <SearchInput />
      </div>

      <Suspense fallback={<IdeasGridSkeleton />}>
        <IdeasGrid initialIdeas={ideas} />
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
