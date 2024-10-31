"use client";

import { Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { CardHeader, CardContent, CardFooter, Card } from "../ui/card";
import { PartialIdea } from "@/types/idea";
import { PropsWithChildren } from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { cn } from "@/components/ui/utils";

type IdeaCardProps = {
  idea: PartialIdea;
  showInterestButton?: boolean;
  bare?: boolean;
};

export function IdeaCard({
  idea,
  showInterestButton = false,
  bare = false,
}: IdeaCardProps) {
  return (
    <IdeaBaseCard bare={bare}>
      <CardHeader className={cn(bare && "p-0")}>
        <div className="flex items-center gap-4">
          {!bare && <Lightbulb className="text-yellow-500" />}
          <h2 className="text-2xl font-bold !m-0 !p-0">{idea.title}</h2>
        </div>
      </CardHeader>
      <CardContent className={cn("mt-4", bare && "p-0")}>
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
        <CardFooter className={cn("flex justify-center", bare && "p-0 mt-4")}>
          <Button asChild>
            <Link href={`/idea/expand/${idea.id}`}>{`Expand this idea`}</Link>
          </Button>
        </CardFooter>
      )}
    </IdeaBaseCard>
  );
}

type IdeaBaseCardProps = PropsWithChildren<{
  bare?: boolean;
}>;

export const IdeaBaseCard: React.FC<IdeaBaseCardProps> = ({
  children,
  bare = false,
}) => (
  <div
    className={cn(
      "w-full max-w-lg lg:max-w-xl",
      !bare &&
        "shadow-lg transition-all duration-300 hover:shadow-xl rounded-2xl",
    )}
  >
    {bare ? children : <Card>{children}</Card>}
  </div>
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
