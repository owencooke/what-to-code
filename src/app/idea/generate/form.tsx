"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/lib/utils";
import categories from "../data/categories";
import { Idea, PartialIdea, PartialIdeaSchema } from "@/types/idea";
import { ChevronDown, ChevronUp } from "lucide-react";
import FormInput from "@/components/FormInput";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import useIsMobile from "@/hooks/useIsMobile";
import ky from "ky";

interface IdeaFormProps {
  onSubmit: (idea: PartialIdea) => void;
  onClick: () => void;
}

const FormSchema = z.object({
  customIdeaPrompt: z
    .string()
    .max(60, { message: "oops, please try a shorter idea" })
    .optional(),
});

export function IdeaForm({ onSubmit, onClick }: IdeaFormProps) {
  const [showMore, setShowMore] = useState(false);
  const isMobile = useIsMobile();
  const [topics, setTopics] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { customIdeaPrompt: "" },
  });

  useEffect(() => {
    setTopics(shuffleArray([...categories]));
  }, []);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    onClick();
    const response = await ky.get(
      `/api/idea?topic=${encodeURIComponent(data.customIdeaPrompt as string)}`,
    );

    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }
    const idea = PartialIdeaSchema.parse(await response.json());
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
        className="flex flex-col items-center w-[50vw] max-w-xl"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Button type="submit" className="w-full mb-4">
          generate a new idea
        </Button>

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
            <div className="flex flex-col gap-4 w-[50vw] max-w-xl">
              <FormInput
                form={form}
                type={isMobile ? "area" : "input"}
                name="customIdeaPrompt"
                placeholder="start brainstorming here..."
                maxLength={50}
              />
              <Carousel
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
      </form>
    </Form>
  );
}
