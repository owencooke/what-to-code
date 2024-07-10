"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { selectRandom } from "@/lib/utils";
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
import { Badge } from "@/components/ui/badge";

interface IdeaFormProps {
  onSubmit: (idea: Idea) => void;
  onClick: () => void;
}

const FormSchema = z.object({
  idea: z.string().optional(),
});

export function IdeaForm({ onSubmit, onClick }: IdeaFormProps) {
  const [showMore, setShowMore] = useState(false);
  const [topic, setTopic] = useState("");

  const handleSubmit = async () => {
    onClick();
    let newTopic = topic || selectRandom(categories);
    const response = await fetch(
      `/api/idea?topic=${encodeURIComponent(newTopic)}`,
    );
    if (!response.ok) {
      console.error("Failed to fetch new idea:", response.statusText);
      return;
    }
    const data = await response.json();
    onSubmit(data);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

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
                <ChevronRight className="mr-2 h-4 w-4" />
                any idea is great
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                use my ideas
              </>
            )}
          </Button>
          <Button type="submit" size="lg">
            generate
          </Button>
        </div>
        {!showMore && (
          <div className="flex flex-col gap-4">
            <FormInput
              className="w-full"
              form={form}
              name="idea"
              placeholder="start brainstorming here..."
            />
            <Carousel
              className="max-w-[50vw]"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent className="">
                {categories.map((category) => (
                  <CarouselItem
                    key={category}
                    className="pl-1 sm:basis-1/2 md:basis-1/4 lg:basis-1/6"
                  >
                    <div className="flex justify-center items-center h-full w-full">
                      <Badge variant="outline">{category}</Badge>
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
