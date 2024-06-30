"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
import { Idea, Feature, Framework } from "@/types/idea";
import { useEffect, useMemo } from "react";

const ProjectSchema = Idea.pick({
  title: true,
  description: true,
}).extend({
  features: Idea.shape.features.optional(),
  framework: Framework,
});

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const idea = useMemo(() => {
    return Idea.safeParse(JSON.parse(searchParams.get("idea") || ""));
  }, [searchParams]);

  // Redirect back to idea generation page, if no valid idea to create project from
  useEffect(() => {
    if (!idea.success) {
      console.log(idea.error);
      router.push("/idea");
    }
  }, [idea, router]);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: idea.success ? idea.data.title : "",
      description: idea.success ? idea.data.description : "",
      features: [],
      framework: idea.success ? idea.data.frameworks[0] : undefined,
    },
  });

  function onSubmit(data: z.infer<typeof ProjectSchema>) {
    console.log(data);
  }

  const selectedFeatures = form.watch("features");

  const handleToggleFeature = (feature: z.infer<typeof Feature>) => {
    const updatedFeatures = selectedFeatures?.some(
      (f) => f.title === feature.title,
    )
      ? selectedFeatures?.filter((f) => f.title !== feature.title)
      : [...(selectedFeatures || []), feature];

    form.setValue("features", updatedFeatures);
  };

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
              {/* TODO: AI generated unique name button */}
              <FormInput
                form={form}
                name="title"
                label="Project Name"
                placeholder="insert cool name here"
              />
              <FormInput
                className="max-h-32"
                type="area"
                form={form}
                name="description"
                label="Description"
                placeholder="what is your project and what does it do"
              />
              <FormInput
                form={form}
                name="features"
                label="What To Develop"
                description={`${selectedFeatures?.length || 0}/${idea.features
                  ?.length} features selected`}
                type={(field) => (
                  <ScrollArea>
                    <div className="flex">
                      {idea.features?.map((feature, i) => (
                        <FeatureCard
                          key={i}
                          feature={feature}
                          className="scale-90"
                          onClick={() => handleToggleFeature(feature)}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}
              />
              <FormInput
                form={form}
                name="framework"
                label="How to Build It"
                description="choose the type of platform to build and tech stack to use"
                type={(field) => (
                  <ScrollArea>
                    <div className="flex">
                      {idea.frameworks?.map((framework, i) => (
                        <FrameworkCard
                          key={i}
                          framework={framework}
                          className="scale-90"
                          selected={field.value === framework.title}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}
              />
              <Button type="submit">Submit</Button>
            </CardHeader>
          </Card>
        )}
      </form>
    </Form>
  );
}
