"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import defaultIdea from "@/app/idea/data/defaultIdea";
import { IdeaForm } from "./form";
import { Button, ButtonWithLoading } from "@/components/ui/button";
import FeatureCard from "@/components/cards/FeatureCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FrameworkCard from "@/components/cards/FrameworkCard";

export default function Home() {
  const router = useRouter();
  const [idea, setIdea] = useState(defaultIdea);

  const handleExpandIdea = async () => {
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

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-7xl mt-16 mb-6">hmm, what to code?</h1>
      <IdeaForm onSubmit={setIdea} />
      <Card className="mt-8 w-4/5">
        <CardHeader className="gap-8">
          <div>
            <h1>{idea.title}</h1>
            <p>{idea.description}</p>
          </div>
          {!idea.features ? (
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
              <div>
                <h1>what to make</h1>
                <ScrollArea className="mt-8">
                  <div className="flex gap-12">
                    {idea.features?.map((feature, i) => (
                      <FeatureCard key={i} feature={feature} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div>
                <h1>how to build it</h1>
                <ScrollArea className="mt-8">
                  <div className="flex gap-12">
                    {idea.frameworks?.map((framework, i) => (
                      <FrameworkCard key={i} framework={framework} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <Button size="lg" onClick={handleCreateProject}>
                create project
              </Button>
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
