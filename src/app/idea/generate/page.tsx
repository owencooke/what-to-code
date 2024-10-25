"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useState, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialIdea } from "@/types/idea";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-center md:justify-between items-center h-full gap-12 lg:gap-24 mt-4">
      <div className="flex flex-col items-center justify-start w-full">
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
      ) : (
        idea && (
          <IdeaCard>
            <h1 className="text-4xl">{idea.title}</h1>
            <p>{idea.description}</p>
            <div className="flex justify-center">
              <Link
                href={`/idea/expand/${idea.id}`}
                className={buttonVariants()}
              >
                {"i'm interested, tell me more"}
              </Link>
            </div>
          </IdeaCard>
        )
      )}
    </div>
  );
}
