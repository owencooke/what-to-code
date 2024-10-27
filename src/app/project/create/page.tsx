"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader } from "@/components/ui/card";
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
import { NewProjectSchema, NewProject } from "@/types/project";
import { getRepoFromProjectTitle } from "@/lib/github/string-utils";
import { Github } from "lucide-react";
import Repo from "@/components/github/Repo";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import MatchedRepos from "./match-repos";
import CardScrollArea from "@/components/cards/CardScrollArea";
import { GitHubRepo } from "@/types/github";
import ky from "ky";
import { useCreateProjectStore } from "@/store/useCreateProjectStore";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const { idea, features, frameworks } = useCreateProjectStore();

  const [submitEnabled, setSubmitEnabled] = useState(true);
  const [shouldValidate, setShouldValidate] = useState(false);

  const form = useForm<NewProject>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {},
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  // Set default form value from store
  useEffect(() => {
    if (idea && features.length > 0 && frameworks.length > 0) {
      form.reset({
        title: idea.title,
        description: idea.description,
        features: [features[0]],
        framework: frameworks[0],
      });
    }
  }, [router, form, idea, features, frameworks]);

  useEffect(() => {
    if (session?.user.username) {
      form.setValue("github_user", session.user.username);
    }
  }, [session, form]);

  const title = form.watch("title");
  const selectedFeatures = form.watch("features");
  const selectedFramework = form.watch("framework");

  const handleToggleFeature = (feature: Feature) => {
    const updatedFeatures = selectedFeatures?.some(
      (f) => f.title === feature.title,
    )
      ? selectedFeatures?.filter((f) => f.title !== feature.title)
      : [...(selectedFeatures || []), feature];

    form.setValue("features", updatedFeatures, { shouldValidate });
    form.clearErrors("features");
  };

  const handleSelectFramework = (framework: Framework) => {
    form.setValue("framework", framework);
  };

  const onSubmit = async (projectToCreate: NewProject) => {
    setShouldValidate(true);

    // Disable submit button while server processing
    setSubmitEnabled(false);
    const response = await ky.post(`/api/project`, {
      json: projectToCreate,
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem while creating your project.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={form.handleSubmit(onSubmit, onError)}
          >
            Try again
          </ToastAction>
        ),
      });
      // Re-enable submit button to try again
      setSubmitEnabled(true);
      return;
    }
    const { url, projectId } = (await response.json()) as any;
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
    router.push(`/project/${projectId}`);
  };

  // Show toast notification on form validation error
  const onError = (errors: any) => {
    // Extract the first error message
    const firstError: any = Object.values(errors)[0];
    const errorMessage =
      firstError?.message ||
      "Please correct the highlighted errors and try again.";

    toast({
      variant: "destructive",
      title: "Invalid Form",
      description: errorMessage,
    });

    console.log(errors);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col items-center justify-center">
        <h1 className="text-5xl lg:text-6xl my-6 text-center">
          kickstart your idea
        </h1>
        {idea && (
          <Card className="mt-6 w-full max-w-6xl">
            <CardHeader className="gap-4">
              {session ? (
                <Repo repoName={getRepoFromProjectTitle(title)} />
              ) : (
                <Button
                  className="w-fit"
                  type="button"
                  onClick={() => !session && signIn("github")}
                >
                  <Github className="mr-2 h-4 w-4" /> Sign in with GitHub
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
                description={`${selectedFeatures?.length || 0}/${
                  features?.length
                } features selected`}
                type={() => (
                  <CardScrollArea>
                    {features?.map((feature) => (
                      <FeatureCard
                        key={feature.id}
                        feature={feature}
                        onClick={() => handleToggleFeature(feature)}
                        selected={selectedFeatures
                          ?.map((f) => f.id)
                          .includes(feature.id)}
                      />
                    ))}
                  </CardScrollArea>
                )}
              />
              <FormInput
                form={form}
                name="framework"
                label="How to Build It"
                description="choose the type of platform to build and tech stack to use"
                type={() => (
                  <CardScrollArea>
                    {frameworks?.map((framework) => (
                      <FrameworkCard
                        key={framework.id}
                        framework={framework}
                        onClick={() => handleSelectFramework(framework)}
                        selected={selectedFramework?.id === framework.id}
                      />
                    ))}
                  </CardScrollArea>
                )}
              />
              <FormInput
                form={form}
                name="starterRepo"
                label="Recommended GitHub Repos"
                description="skip the boilerplate code and start with a template"
                type={() => (
                  <CardScrollArea>
                    <MatchedRepos />
                  </CardScrollArea>
                )}
              />
              <Modal
                title="Create project?"
                description="
                    This will create a new GitHub repository
                    using code from the kickstarter template, if selected.
                    GitHub issues will be used to track the features to be developed."
                renderTrigger={() => (
                  <Button type="button" disabled={!session}>
                    create project
                  </Button>
                )}
                // FIXME: would be better to add a LoadingButton state to Modal submit
                onSubmit={
                  submitEnabled
                    ? form.handleSubmit(onSubmit, onError)
                    : () => {}
                }
                actionText="Create"
              >
                {title && (
                  <Repo
                    className="py-4"
                    repoName={getRepoFromProjectTitle(title)}
                  />
                )}
              </Modal>
            </CardHeader>
          </Card>
        )}
      </form>
    </Form>
  );
}
