"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { selectRandom, shuffleArray } from "@/lib/utils";
import categories from "./data/categories";
import { Idea } from "@/types/idea";
import { ChevronDown, ChevronRight } from "lucide-react";
import FormInput from "@/components/FormInput";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";

interface IdeaFormProps {
  onSubmit: (idea: Idea) => void;
  onClick: () => void;
}

const FormSchema = z.object({
  idea: z
    .string()
    .max(60, { message: "oops, please try a shorter idea" })
    .optional(),
});

export function IdeaForm({ onSubmit, onClick }: IdeaFormProps) {
  const [showMore, setShowMore] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { idea: "" },
  });

  useEffect(() => {
    setTopics(shuffleArray([...categories]));
  }, []);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    onClick();
    let newTopic = data.idea || selectRandom(topics);
    const response = await fetch(
      `/api/idea?topic=${encodeURIComponent(newTopic)}`,
    );
    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }
    onSubmit(await response.json());
  };

  const handleBadgeClick = (topic: string) =>
    form.setValue("idea", `${form.getValues("idea")} ${topic}`);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8 items-center"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-8">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                use my ideas
              </>
            ) : (
              <>
                <ChevronRight className="mr-2 h-4 w-4" />
                any idea is great
              </>
            )}
          </Button>
          <Button type="submit" size="lg">
            generate
          </Button>
        </div>
        {showMore && (
          <div className="flex flex-col gap-4 w-[50vw]">
            <FormInput
              className="w-full"
              form={form}
              name="idea"
              placeholder="start brainstorming here..."
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
              <CarouselContent className="">
                {topics.map((topic) => (
                  <CarouselItem
                    key={topic}
                    className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
                  >
                    <div className="flex justify-center items-center h-full w-full">
                      <Badge
                        variant="outline"
                        className="text-center cursor-pointer"
                        onClick={() => handleBadgeClick(topic)}
                      >
                        {topic}
                      </Badge>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious type="button" />
              <CarouselNext type="button" />
            </Carousel>
          </div>
        )}
      </form>
    </Form>
  );
}
