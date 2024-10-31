"use client";

import { CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { IdeaForm } from "./form";
import { PartialIdea } from "@/types/idea";
import { ProgrammingCodeIdeaIcon } from "@/components/landing/Icons";
import {
  IdeaBaseCard,
  IdeaCard,
  IdeaSkeletonCard,
} from "@/components/cards/IdeaCard";

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>();
  const [isIdeaLoading, setIsIdeaLoading] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-12 lg:gap-24 mt-4">
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
        <IdeaSkeletonCard />
      ) : idea ? (
        <IdeaCard idea={idea} showInterestButton></IdeaCard>
      ) : (
        <IdeaBaseCard>
          <CardHeader className="flex flex-col items-center text-center text-muted-foreground select-none my-4">
            <ProgrammingCodeIdeaIcon className="lg:w-20 lg:h-20" />
            <p className="lg:max-w-sm">
              {`"Start with something simple and small, then expand over time."`}
            </p>
            <cite>— Aaron Levie</cite>
          </CardHeader>
        </IdeaBaseCard>
      )}
    </div>
  );
}
