"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useEffect, useMemo, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Button, ButtonWithLoading } from "@/components/ui/button";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { SkeletonCard } from "@/components/cards/SkeletonCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Idea } from "@/types/idea";
import CardScrollArea from "@/components/cards/CardScrollArea";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const router = useRouter();

  const [idea, setIdea] = useState<Idea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  useEffect(() => {
    setIsIdeaLoading(false);
  }, [idea]);

  const handleExpandIdea = async () => {
    if (idea) {
      setIsInterested(true);
      const response = await fetch(`/api/idea/expand`, {
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
    }
  };

  const handleCreateProject = async () => {
    localStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  const skeletonCards = useMemo(
    () => Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />),
    [],
  );

  return (
    <div
      className={`flex flex-col ${
        isInterested
          ? "justify-center"
          : "lg:flex-row justify-center md:justify-between"
      } items-center h-full gap-12 lg:gap-24 mt-4`}
    >
      <div className="flex flex-col items-center justify-start w-full">
        <h1 className="text-5xl lg:text-6xl mb-6 text-center">
          hmm, what to code?
        </h1>
        <IdeaForm
          onClick={() => {
            setIsIdeaLoading(true);
            setIsInterested(false);
          }}
          onSubmit={(idea) => {
            setIsInterested(false);
            setIdea(idea);
          }}
        />
      </div>
      {isIdeaLoading ? (
        <IdeaCard>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-28 w-full" />
        </IdeaCard>
      ) : (
        idea && (
          <IdeaCard>
            <h1 className="text-4xl">{idea.title}</h1>
            <p>{idea.description}</p>
            {!isInterested ? (
              <div className="flex justify-center">
                <ButtonWithLoading
                  onClick={handleExpandIdea}
                  loadingText="expanding your idea..."
                >
                  {"i'm interested, tell me more"}
                </ButtonWithLoading>
              </div>
            ) : (
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
                <div className="flex flex-col gap-2">
                  <h2 className="pb-0">Frameworks</h2>
                  <p className="text-muted-foreground !mt-0">
                    what kind of tech stacks could you use?
                  </p>
                  <CardScrollArea>
                    {idea.frameworks?.length > 0 ? (
                      idea.frameworks.map((framework, i) => (
                        <FrameworkCard key={i} framework={framework} />
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
            )}
          </IdeaCard>
        )
      )}
    </div>
  );
}
