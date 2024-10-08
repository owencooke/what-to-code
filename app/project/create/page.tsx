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
import { getRepoFromTitle } from "@/app/api/project/github";
import { AlertCircle, Github } from "lucide-react";
import RepoDisplay from "@/components/github/Repo";
import { Modal } from "@/components/Modal";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { AlertTitle, Alert, AlertDescription } from "@/components/ui/alert";
import MatchedRepos from "./match-repos";
import CardScrollArea from "@/components/cards/CardScrollArea";
import { GitHubRepo } from "@/types/github";
import ky from "ky";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();

  const [idea, setIdea] = useState<Idea>();
  const [username, setUsername] = useState("");
  const [shouldValidate, setShouldValidate] = useState(false);

  const form = useForm<NewProject>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {},
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  useEffect(() => {
    const fetchUsername = async () => {
      if (session?.user.username) {
        setUsername(session?.user.username);
      }
    };

    fetchUsername();
  }, [session]);

  useEffect(() => {
    form.setValue("github_user", username);
  }, [username, form]);

  // Redirect back to idea generation page, if no valid idea to create project from
  useEffect(() => {
    const redirect = () => router.push("/");
    try {
      const parsedIdea = IdeaSchema.safeParse(
        JSON.parse(localStorage.getItem("idea") || ""),
      );
      setIdea(parsedIdea.data);
      if (parsedIdea.success) {
        form.reset({
          title: parsedIdea.data?.title,
          description: parsedIdea.data?.description,
          features: [parsedIdea.data?.features[0]],
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

  const handleUpdateFeature = (oldFeature: Feature, newFeature: Feature) => {
    setIdea((prevIdea) => {
      if (!prevIdea) return prevIdea;
      return {
        ...prevIdea,
        features: prevIdea.features.map((f) =>
          f.title === oldFeature.title ? newFeature : f,
        ),
      };
    });
    form.setValue(
      "features",
      form
        .getValues()
        .features.map((f) => (f.title === oldFeature.title ? newFeature : f)),
    );
  };

  const handleSelectFramework = (framework: Framework) => {
    form.setValue("framework", framework);
  };

  const handleUpdateFramework = (
    oldFramework: Framework,
    newFramework: Framework,
  ) => {
    setIdea((prevIdea) => {
      if (!prevIdea) return prevIdea;
      return {
        ...prevIdea,
        frameworks: prevIdea.frameworks.map((f) =>
          f.title === oldFramework.title ? newFramework : f,
        ),
      };
    });
    form.setValue("framework", newFramework);
  };

  const handleSelectStarterRepo = (starterRepo?: GitHubRepo) => {
    form.setValue("starterRepo", starterRepo?.url);
  };

  const onSubmit = async (projectToCreate: NewProject) => {
    setShouldValidate(true);

    const response = await ky.post(`/api/project`, {
      headers: {
        Authorization: "token " + session?.accessToken,
      },
      json: projectToCreate,
    });

    if (!response.ok) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with creating your project.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={form.handleSubmit(onSubmit, onError)}
          >
            Try again
          </ToastAction>
        ),
      });
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
        {idea && (
          <>
            <h1 className="text-5xl lg:text-6xl my-6 text-center">
              kickstart your idea
            </h1>
            <Card className="mt-6 w-full max-w-6xl">
              <CardHeader className="gap-4">
                {session ? (
                  <RepoDisplay
                    repoName={getRepoFromTitle(title)}
                    username={username}
                  />
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
                    idea.features?.length
                  } features selected`}
                  type={() => (
                    <CardScrollArea>
                      {idea.features?.map((feature, i) => (
                        <FeatureCard
                          key={i}
                          feature={feature}
                          onClick={() => handleToggleFeature(feature)}
                          selected={selectedFeatures
                            ?.map((f) => f.title)
                            .includes(feature.title)}
                          onSubmit={(newFeature: Feature) =>
                            handleUpdateFeature(feature, newFeature)
                          }
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
                      {idea.frameworks?.map((framework, i) => (
                        <FrameworkCard
                          key={i}
                          framework={framework}
                          onClick={() => handleSelectFramework(framework)}
                          onSubmit={(newFramework: Framework) =>
                            handleUpdateFramework(framework, newFramework)
                          }
                          selected={selectedFramework.title === framework.title}
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
                      <MatchedRepos
                        project={form.getValues()}
                        onRepoClick={handleSelectStarterRepo}
                      />
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
                  onSubmit={form.handleSubmit(onSubmit, onError)}
                  actionText="Create"
                >
                  <RepoDisplay
                    className="py-4"
                    repoName={getRepoFromTitle(title)}
                    username={username}
                  />
                  {/* <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                      {`Matching GitHub template repos to your selected project is
                      still under development and clicking this will generate a repo for the MERN stack.
                    Sign up for our email updates if you'd like to know when this feature is live!`}
                    </AlertDescription>
                  </Alert> */}
                </Modal>
              </CardHeader>
            </Card>
          </>
        )}
      </form>
    </Form>
  );
}
