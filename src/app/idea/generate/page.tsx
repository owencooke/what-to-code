"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialIdea } from "@/types/idea";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ProgrammingCodeIdeaIcon } from "@/components/landing/Icons";
import useScreenSize from "@/hooks/useScreenSize";

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="max-w-lg lg:max-w-2xl">
    <CardHeader className="gap-8">{children}</CardHeader>
  </Card>
);

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);
  const { isLarge } = useScreenSize();

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
          <CardContent className="flex flex-col items-center text-center text-muted-foreground">
            <ProgrammingCodeIdeaIcon size={isLarge ? 24 : 12} />
            <p>
              {`"Start with something simple and small, then expand over time."`}
            </p>
            <cite>— Aaron Levie</cite>
          </CardContent>
        </IdeaCard>
      )}
    </div>
  );
}
