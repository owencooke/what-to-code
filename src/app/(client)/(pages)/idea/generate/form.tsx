"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/(client)/components/ui/button";
import { shuffleArray } from "@/lib/utils";
import { CATEGORIES } from "../../../../../lib/constants/categories";
import { NewIdea, Idea, IdeaSchema } from "@/types/idea";
import { ChevronDown, ChevronUp, LogIn } from "lucide-react";
import FormInput from "@/app/(client)/components/FormInput";
import { Form } from "@/app/(client)/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/(client)/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/app/(client)/components/ui/card";
import { Alert, AlertDescription } from "@/app/(client)/components/ui/alert";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import useScreenSize from "@/app/(client)/hooks/useScreenSize";
import ky from "ky";
import { signIn, useSession } from "next-auth/react";
import SignInAlert from "@/app/(client)/components/SignInAlert";

interface IdeaFormProps {
  onSubmit: (idea: Idea | NewIdea) => void;
  onClick: () => void;
}

const FormSchema = z.object({
  customIdeaPrompt: z
    .string()
    .max(60, { message: "oops, please try a shorter idea" })
    .optional(),
});

export function IdeaForm({ onSubmit, onClick }: IdeaFormProps) {
  const { data: session } = useSession();
  const [showMore, setShowMore] = useState(false);
  const { isSmall } = useScreenSize();
  const [topics, setTopics] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { customIdeaPrompt: "" },
  });

  useEffect(() => {
    setTopics(shuffleArray([...CATEGORIES]));
  }, []);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    onClick();

    const params = new URLSearchParams();
    if (showMore && data.customIdeaPrompt) {
      params.append("topic", data.customIdeaPrompt);
    }

    const response = await ky.get(`/api/idea?${params.toString()}`);
    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }

    const idea = await response.json<Idea | NewIdea>();
    onSubmit(idea);
  };

  const handleTopicClick = (topic: string) =>
    form.setValue(
      "customIdeaPrompt",
      `${form.getValues("customIdeaPrompt")} ${topic}`,
    );

  return (
    <Form {...form}>
      <form
        className="flex flex-col items-center w-full max-w-xl"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Button type="submit" className="w-full mb-4">
          {session?.user ? "generate a new idea" : "get a random idea"}
        </Button>

        {session?.user ? (
          <Collapsible
            open={showMore}
            onOpenChange={setShowMore}
            className="space-y-4 w-full"
          >
            <CollapsibleTrigger asChild>
              <Button variant="secondary" className="w-full">
                {showMore ? "hide" : "show"} custom topics
                {showMore ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-4 items-center w-full">
                <FormInput
                  form={form}
                  type={!isSmall ? "area" : "input"}
                  name="customIdeaPrompt"
                  label={null}
                  placeholder="start brainstorming here..."
                  maxLength={50}
                  className="!w-[92vw] sm:w-full max-w-xl bg-card/75"
                />
                <Carousel
                  className="w-[50vw] max-w-xl"
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }) as any,
                  ]}
                >
                  <CarouselContent>
                    {topics.map((topic) => (
                      <CarouselItem
                        key={topic}
                        className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <Card
                          className="h-full cursor-pointer transition-colors hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleTopicClick(topic)}
                        >
                          <CardContent className="flex items-center justify-center p-2 h-full">
                            <p className="text-center font-medium">{topic}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious type="button" />
                  <CarouselNext type="button" />
                </Carousel>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <SignInAlert
            className="w-full"
            description="Want to use custom topics and innovate completely new ideas using AI?"
          />
        )}
      </form>
    </Form>
  );
}
