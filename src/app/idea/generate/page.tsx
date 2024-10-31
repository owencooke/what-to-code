"use client";

import { useState } from "react";
import { IdeaForm } from "./form";
import { PartialIdea } from "@/types/idea";
import {
  EmptyIdeaCard,
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
        <EmptyIdeaCard />
      )}
    </div>
  );
}
