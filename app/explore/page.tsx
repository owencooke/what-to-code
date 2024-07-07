"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import defaultIdea from "@/app/idea/data/defaultIdea";
import { Button, ButtonWithLoading } from "@/components/ui/button";
import FeatureCard from "@/components/cards/FeatureCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const router = useRouter();

  const [idea, setIdea] = useState(defaultIdea);
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    setIsIdeaLoading(false);
  }, [idea]);

  const handleExpandIdea = async () => {
    setIsInterested(true);
    const response = await fetch(`/api/idea`, {
      method: "POST",
      body: JSON.stringify({
        title: idea.title,
        description: idea.description,
      }),
    });
    if (!response.ok) {
      console.error("Failed to expand on idea:", response.statusText);
      return;
    }
    const data = await response.json();
    setIdea({ ...idea, ...data });
  };

  const handleCreateProject = async () => {
    sessionStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  const skeletonCards = useMemo(
    () => Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />),
    [],
  );

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-7xl mt-12 mb-6">hmm, what to code?</h1>
      <Card className="mt-8 w-4/5">
        <CardHeader className="gap-8">
          <>
            {isIdeaLoading ? (
              <>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-28 w-full" />
              </>
            ) : (
              <>
                <h1>{idea.title}</h1>
                <p>{idea.description}</p>
                {!isInterested ? (
                  <div className="flex justify-center">
                    <ButtonWithLoading
                      onClick={handleExpandIdea}
                      loadingText="expanding your idea..."
                    >
                      {"i'm interested"}
                    </ButtonWithLoading>
                  </div>
                ) : (
                  <>
                    <>
                      <h2>what to build</h2>
                      <ScrollArea className="mt-4">
                        <div className="flex gap-12">
                          {idea.features?.length > 0 ? (
                            idea.features.map((feature, i) => (
                              <FeatureCard key={i} feature={feature} />
                            ))
                          ) : (
                            <>{skeletonCards}</>
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </>
                    <>
                      <h2>how to build it</h2>
                      <ScrollArea className="mt-4">
                        <div className="flex gap-12">
                          {idea.frameworks?.length > 0 ? (
                            idea.frameworks.map((framework, i) => (
                              <FrameworkCard key={i} framework={framework} />
                            ))
                          ) : (
                            <>{skeletonCards}</>
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </>
                    <Button
                      size="lg"
                      disabled={!idea.features}
                      onClick={handleCreateProject}
                    >
                      help me get started
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        </CardHeader>
      </Card>
    </div>
  );
}
