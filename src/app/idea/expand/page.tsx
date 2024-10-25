"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useMemo, PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { PartialIdea, PartialIdeaSchema } from "@/types/idea";
import CardScrollArea from "@/components/cards/CardScrollArea";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = searchParams.get("id");

  const [idea, setIdea] = useState<PartialIdea | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      if (!ideaId) return;
      try {
        const response = await fetch(`/api/idea?id=${ideaId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch idea");
        }
        const data = await response.json();
        setIdea(PartialIdeaSchema.parse(data));
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchIdea();
  }, [ideaId, router]);

  const handleCreateProject = async () => {
    if (idea) {
      localStorage.setItem("idea", JSON.stringify(idea));
      router.push("/project/create");
    }
  };

  const skeletonCards = useMemo(
    () => Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />),
    [],
  );

  return (
    <div className="flex flex-col justify-center items-center h-full gap-12 lg:gap-24 mt-4">
      {idea === null ? (
        <SkeletonCard />
      ) : (
        <IdeaCard>
          <h1 className="text-4xl">{idea.title}</h1>
          <p>{idea.description}</p>
          <>
            <div className="flex flex-col gap-2">
              <h2 className="pb-0">Features</h2>
              <p className="text-muted-foreground !mt-0">
                what kind of things could you build?
              </p>
              <CardScrollArea>
                {idea.features?.length > 0 ? (
                  idea.features.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} />
                  ))
                ) : (
                  <>{skeletonCards}</>
                )}
              </CardScrollArea>
            </div>
            <Button
              size="lg"
              disabled={!idea.features}
              onClick={handleCreateProject}
            >
              help me start this project
            </Button>
          </>
        </IdeaCard>
      )}
    </div>
  );
}
