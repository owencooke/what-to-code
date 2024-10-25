"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState, useMemo, PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import FeatureCard from "@/components/cards/FeatureCard";
import { PartialIdea, Feature } from "@/types/idea";
import CardScrollArea from "@/components/cards/CardScrollArea";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaClient({ idea }: { idea: PartialIdea }) {
  const router = useRouter();
  const [expandedFeatures, setExpandedFeatures] = useState<Feature[]>([]);
  const [isExpanding, setIsExpanding] = useState(false);

  const handleCreateProject = () => {
    localStorage.setItem("idea", JSON.stringify(idea));
    router.push("/project/create");
  };

  const handleExpandFeatures = async () => {
    if (isExpanding) return;
    setIsExpanding(true);
    try {
      const response = await fetch(`/api/idea/expand/features?id=${idea.id}`);
      if (!response.ok) {
        throw new Error("Failed to expand features");
      }
      const data = await response.json();
      setExpandedFeatures(data.features);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full gap-12 lg:gap-24 mt-4">
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
              {expandedFeatures.length > 0
                ? expandedFeatures.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} />
                  ))
                : idea.features?.map((feature, i) => (
                    <Card key={i} className="p-4">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </Card>
                  ))}
            </CardScrollArea>
            {expandedFeatures.length === 0 && (
              <Button
                onClick={handleExpandFeatures}
                disabled={isExpanding}
                className="mt-4"
              >
                {isExpanding ? "Expanding..." : "Expand Features"}
              </Button>
            )}
          </div>
          <Button size="lg" onClick={handleCreateProject} className="mt-8">
            help me start this project
          </Button>
        </>
      </IdeaCard>
    </div>
  );
}
