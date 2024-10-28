"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialIdea } from "@/types/idea";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-full items-center justify-center gap-12 lg:gap-24 mt-4">
      <div className="flex flex-col items-center justify-center w-full ">
        <h1 className="text-5xl lg:text-6xl mb-6 text-center">
          hmm, what to code?
        </h1>
        <IdeaForm
          onClick={() => {
            setIsIdeaLoading(true);
          }}
          onSubmit={(idea) => {
            setIdea(idea);
            setIsIdeaLoading(false);
          }}
        />
      </div>
      {isIdeaLoading ? (
        <IdeaCard>
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-28 w-full" />
        </IdeaCard>
      ) : idea ? (
        <IdeaCard>
          <h1 className="text-2xl">{idea.title}</h1>
          <p>{idea.description}</p>
          <div className="flex justify-center">
            <Link
              href={`/idea/expand/${idea.id}`}
              className={buttonVariants({ size: "sm" })}
            >
              {"I'm interested, tell me more"}
            </Link>
          </div>
        </IdeaCard>
      ) : (
        <IdeaCard>
          <CardContent className="flex flex-col items-center text-center">
            <Lightbulb className="w-24 h-24 mb-4 text-yellow-400" />
            <h2 className="text-2xl font-semibold mb-2">No Idea Yet</h2>
            <p className="text-muted-foreground">
              Click the button to generate a brilliant coding idea. Who knows
              what amazing project you'll create next!
            </p>
          </CardContent>
        </IdeaCard>
      )}
    </div>
  );
}
