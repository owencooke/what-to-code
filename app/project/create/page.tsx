"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FeatureCard from "@/components/cards/FeatureCard";
import FrameworkCard from "@/components/cards/FrameworkCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput";
import { Form } from "@/components/ui/form";
import { Idea, Feature, Framework, IdeaSchema } from "@/types/idea";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { ProjectSchema, Project } from "@/types/project";
import { getRepoFromTitle } from "@/app/api/project/github";
import { Github } from "lucide-react";
import RepoDisplay from "@/components/github/Repo";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [idea, setIdea] = useState<Idea>();

  const form = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {},
  });

  // Redirect back to idea generation page, if no valid idea to create project from
  useEffect(() => {
    const redirect = () => router.push("/");
    try {
      const parsedIdea = IdeaSchema.safeParse(
        JSON.parse(sessionStorage.getItem("idea") || ""),
      );
      setIdea(parsedIdea.data);
      if (parsedIdea.success) {
        form.reset({
          title: parsedIdea.data?.title,
          description: parsedIdea.data?.description,
          features: [],
          framework: parsedIdea.data?.frameworks[0],
        });
      } else {
        redirect();
      }
    } catch (error) {
      redirect();
    }
  }, [router, form]);

  const title = form.watch("title");
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

  const handleSubmit = async (data: Project) => {
    const response = await fetch(`/api/project`, {
      method: "POST",
      headers: {
        Authorization: "token " + session?.accessToken,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with creating your project.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={form.handleSubmit(handleSubmit)}
          >
            Try again
          </ToastAction>
        ),
      });
      return;
    }
    const { url } = await response.json();

    // TODO:
    //  - store project in our DB
    //  - redirect to "/project/{projectId}"
    //  - load from DB instead of sessionStorage
    sessionStorage.setItem("project", JSON.stringify(data));
    toast({
      title: "Congrats, you're ready to go 🚀",
      description: "Your project's GitHub repository is looking great!",
      action: (
        <ToastAction altText="View on GitHub">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </ToastAction>
      ),
    });
    router.push(`/project/`);
  };

  console.log(session);

  return (
    <Form {...form}>
      <form className="flex flex-col items-center justify-center">
        {idea && (
          <>
            <h1 className="text-7xl mt-12">kickstart your idea</h1>
            <Card className="mt-8 w-4/5">
              <CardHeader className="gap-4">
                {session ? (
                  <RepoDisplay name={getRepoFromTitle(title)} />
                ) : (
                  <Button
                    className="w-fit"
                    type="button"
                    onClick={() => !session && signIn("github")}
                  >
                    <Github className="mr-2 h-4 w-4" /> Sign in with GitHub to
                    Create a Repository
                  </Button>
                )}
                {/* TODO: AI generated unique name button */}
                <FormInput
                  className="flex-grow"
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
                            selected={field.value?.title === framework.title}
                          />
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  )}
                />

                <Modal
                  title="Are you sure you want to create this project?"
                  description={`
                    A new GitHub repository will be created with your selected features 
                    as GitHub Issues. We'll also try to kickstart your project 
                    using a template based on your chosen framework (if one can be found)!
                  `}
                  renderTrigger={() => (
                    <Button
                      type="button"
                      // disabled={!session}
                    >
                      create project
                    </Button>
                  )}
                  onSubmit={form.handleSubmit(handleSubmit)}
                  actionText="Create"
                >
                  <RepoDisplay
                    className="pt-4"
                    name={getRepoFromTitle(title)}
                  />
                </Modal>
              </CardHeader>
            </Card>
          </>
        )}
      </form>
    </Form>
  );
}
