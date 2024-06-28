"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Idea } from "@/app/idea/types";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/FeatureCard";
import FrameworkCard from "@/components/FrameworkCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";
import { Form } from "@/components/ui/form";

const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().max(350, {
    message: "Description must be less than 350 characters.",
  }),
});

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redirect back to generate idea page if no valid idea
  let idea: Idea | undefined;
  try {
    idea = JSON.parse(searchParams.get("idea") || "");
  } catch (error) {
    router.push("/idea");
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: idea,
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center"
      >
        <h1 className="text-7xl mt-16">kickstart your project</h1>
        {idea && (
          <Card className="mt-8 w-4/5">
            <CardHeader className="gap-4">
              <FormInput
                form={form}
                name="title"
                label="Project Title"
                placeholder="name your project!"
              />
              <FormInput
                className="max-h-32"
                type="area"
                form={form}
                name="description"
                label="Project Description"
                placeholder="describe your project!"
              />
              <div>
                <h1>what to make</h1>
                <ScrollArea className="mt-8">
                  <div className="flex gap-12">
                    {idea.features?.map((feature, i) => (
                      <FeatureCard key={i} feature={feature} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div>
                <h1>how to build it</h1>
                <ScrollArea className="mt-8">
                  <div className="flex gap-12">
                    {idea.frameworks?.map((framework, i) => (
                      <FrameworkCard key={i} framework={framework} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <Button type="submit">Submit</Button>
            </CardHeader>
          </Card>
        )}
      </form>
    </Form>
  );
}
