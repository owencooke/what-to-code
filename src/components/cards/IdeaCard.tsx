"use client";

import { Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { CardHeader, CardContent, CardFooter, Card } from "../ui/card";
import { PartialIdea } from "@/types/idea";
import { PropsWithChildren } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

type IdeaCardProps = {
  idea: PartialIdea;
  showInterestButton?: boolean;
};

export function IdeaCard({ idea, showInterestButton = false }: IdeaCardProps) {
  return (
    <IdeaBaseCard>
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
      {showInterestButton && (
        <CardFooter className="flex justify-center">
          <Button asChild>
            <Link href={`/idea/expand/${idea.id}`}>
              {`i'm interested, tell me more`}
            </Link>
          </Button>
        </CardFooter>
      )}
    </IdeaBaseCard>
  );
}

export const IdeaBaseCard: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <Card className="w-full max-w-lg lg:max-w-xl shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl">
    {children}
  </Card>
);

export const IdeaSkeletonCard: React.FC = () => (
  <IdeaBaseCard>
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
  </IdeaBaseCard>
);
