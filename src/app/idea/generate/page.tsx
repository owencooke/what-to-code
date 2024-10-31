"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useState, PropsWithChildren } from "react";
import { IdeaForm } from "./form";
import { Skeleton } from "@/components/ui/skeleton";
import { PartialIdea } from "@/types/idea";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgrammingCodeIdeaIcon } from "@/components/landing/Icons";
import { mockIdea } from "@/app/api/idea/mock";
import { Lightbulb, ChevronRight } from "lucide-react";

export default function IdeaPage() {
  const [idea, setIdea] = useState<PartialIdea>(mockIdea);
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
        <IdeaCard>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Lightbulb className="text-yellow-500" />
              <h2 className="text-2xl font-bold !m-0 !p-0">{idea.title}</h2>
            </div>
          </CardHeader>
          <CardContent className="mt-2">
            <p className="text-muted-foreground">{idea.description}</p>
            <ul className="ml-4 mt-4 space-y-2 text-foreground/90">
              {idea.features &&
                idea.features.map((feature) => (
                  <li key={feature.title} className="flex items-center gap-2">
                    <ChevronRight className="text-primary h-4 w-4" />
                    <span>{feature.title}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href={`/idea/expand/${idea.id}`}>
                {`i'm interested, tell me more`}
              </Link>
            </Button>
          </CardFooter>
        </IdeaCard>
      ) : (
        <IdeaCard>
          <CardContent className="flex flex-col items-center text-center text-muted-foreground select-none">
            <ProgrammingCodeIdeaIcon className="lg:w-20 lg:h-20" />
            <p className="lg:max-w-sm">
              {`"Start with something simple and small, then expand over time."`}
            </p>
            <cite>— Aaron Levie</cite>
          </CardContent>
        </IdeaCard>
      )}
    </div>
  );
}

const IdeaCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full max-w-lg lg:max-w-xl shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl">
    {children}
  </Card>
);

const IdeaSkeletonCard: React.FC = () => (
  <IdeaCard>
    <CardHeader>
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </IdeaCard>
);
