"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";
import { Form } from "@/components/ui/form";
import { IdeaSchema, Feature, Framework } from "@/types/idea";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { ProjectSchema } from "@/types/project";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  const idea = useMemo(() => {
    const storedIdea = sessionStorage.getItem("idea");
    if (storedIdea) {
      try {
        return IdeaSchema.safeParse(JSON.parse(storedIdea)).data;
      } catch (error) {}
    }
    return null;
  }, []);

  // Redirect back to idea generation page, if no valid idea to create project from
  useEffect(() => {
    if (!idea) {
      router.push("/idea");
    }
  }, [idea, router]);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: idea?.title,
      description: idea?.description,
      features: [],
      framework: idea?.frameworks[0],
    },
  });

  const selectedFeatures = form.watch("features");

  const handleToggleFeature = (feature: Feature) => {
    const updatedFeatures = selectedFeatures?.some(
      (f) => f.title === feature.title,
    )
      ? selectedFeatures?.filter((f) => f.title !== feature.title)
      : [...(selectedFeatures || []), feature];

    form.setValue("features", updatedFeatures);
  };

  const handleSelectFramework = (framework: Framework) => {
    form.setValue("framework", framework);
  };

  const handleSubmit = async (data: z.infer<typeof ProjectSchema>) => {
    const response = await fetch(`/api/project`, {
      method: "POST",
      headers: {
        Authorization: "token " + session?.accessToken,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      // TODO: Display error message using toast? alert?
      console.error("Failed to create project", response.statusText);
      return;
    }
    // TODO:
    //  - store project in our DB
    //  - redirect to "/project/{projectId}"
    //  - load from DB instead of sessionStorage
    sessionStorage.setItem("project", JSON.stringify(data));
    router.push(`/project/`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center justify-center"
      >
        {idea && (
          <>
            <h1 className="text-7xl mt-16">finalize your idea</h1>
            <Card className="mt-8 w-4/5">
              <CardHeader className="gap-4">
                {/* TODO: AI generated unique name button */}
                <FormInput
                  form={form}
                  name="title"
                  label="Project Name"
                  placeholder="insert cool name here"
                />
                {/* TODO: Display GitHub integration / future repo name */}
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
                  type={() => (
                    <ScrollArea>
                      <div className="flex">
                        {idea.features?.map((feature, i) => (
                          <FeatureCard
                            key={i}
                            feature={feature}
                            className="scale-90"
                            onClick={() => handleToggleFeature(feature)}
                            selected={selectedFeatures
                              ?.map((f) => f.title)
                              .includes(feature.title)}
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
                            onClick={() => handleSelectFramework(framework)}
                            selected={field.value.title === framework.title}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  )}
                />
                <Button type="submit">kickstart this project</Button>
              </CardHeader>
            </Card>
          </>
        )}
      </form>
    </Form>
  );
}
