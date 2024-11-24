"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { CardHeader, CardContent, CardFooter, Card } from "../ui/card";
import { NewPartialIdea, PartialIdea } from "@/types/idea";
import { PropsWithChildren } from "react";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { cn } from "@/components/ui/utils";
import ky from "ky";
import { ProgrammingCodeIdeaIcon } from "../landing/Icons";

type IdeaCardProps = {
  idea: PartialIdea | NewPartialIdea;
  showInterestButton?: boolean;
  bare?: boolean;
};

export function IdeaCard({
  idea,
  showInterestButton = false,
  bare = false,
}: IdeaCardProps) {
  const router = useRouter();

  const handleExpandClick = async () => {
    if ("id" in idea) {
      router.push(`/idea/expand/${idea.id}`);
    } else {
      try {
        const response = await ky
          .post("/api/idea", { json: idea })
          .json<{ message: string; idea: PartialIdea }>();
        const newIdeaId = response.idea.id;
        router.push(`/idea/expand/${newIdeaId}`);
      } catch (error) {
        console.error("Failed to create new idea:", error);
      }
    }
  };

  return (
    <IdeaBaseCard bare={bare}>
      <CardHeader className={cn("relative pb-4", bare && "p-0")}>
        {!bare && (
          <ProgrammingCodeIdeaIcon className="absolute top-6 right-6 fill-yellow-500 w-8 h-8" />
        )}
        <h2 className="text-2xl font-bold pr-8">{idea.title}</h2>
      </CardHeader>
      <CardContent className={cn("", bare && "p-0 mt-4")}>
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
          <Button onClick={handleExpandClick}>{`Expand this idea`}</Button>
        </CardFooter>
      )}
    </IdeaBaseCard>
  );
}

type IdeaBaseCardProps = PropsWithChildren<{
  bare?: boolean;
}>;

const IdeaBaseCard: React.FC<IdeaBaseCardProps> = ({
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

type EmptyIdeaCardProps = {
  bare?: boolean;
};

export const EmptyIdeaCard: React.FC<EmptyIdeaCardProps> = ({
  bare = false,
}) => (
  <div
    className={cn(
      "w-full max-w-lg lg:max-w-xl transition-all duration-300",
      !bare && "hover:shadow-xl rounded-2xl",
    )}
  >
    {bare ? (
      <EmptyIdeaCardContent />
    ) : (
      <Card>
        <EmptyIdeaCardContent />
      </Card>
    )}
  </div>
);

const EmptyIdeaCardContent: React.FC = () => (
  <CardHeader className="flex flex-col lg:flex-row items-center text-center lg:text-left text-muted-foreground select-none my-4 p-6 gap-4 lg:gap-8">
    <ProgrammingCodeIdeaIcon
      className="w-16 h-16 lg:w-20 lg:h-20 fill-yellow-500 animate-pulse shrink-0"
      aria-hidden="true"
    />
    <div>
      <p className="text-sm lg:text-base">
        {`"Start with something simple and small, then expand over time."`}
      </p>
      <cite className="mt-2 text-xs lg:text-sm font-medium block">
        — Aaron Levie
      </cite>
    </div>
  </CardHeader>
);
