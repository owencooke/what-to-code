import {
  IdeaSchema,
  FeatureSchema,
  PartialIdea,
  Feature,
  Framework,
  PartialIdeaSchema,
} from "@/types/idea";
import { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT } from "./prompts";
import { generateZodSchemaFromPrompt } from "@/lib/llm/utils";
import { z } from "zod";

// Generate Title and Description of Idea
export const generateIdea = async (
  topic: string,
  recentIdeaTitles: string[],
): Promise<PartialIdea> => {
  // Modify prompt to avoid using recent ideas (if any)
  const prompt = `${IDEA_PROMPT} ${
    recentIdeaTitles.length > 0 &&
    `Do not suggest already taken ideas: ${recentIdeaTitles.join()}`
  }`;

  const data = await generateZodSchemaFromPrompt(
    PartialIdeaSchema.pick({ title: true, description: true, features: true }),
    prompt,
    { topic, recentIdeaTitles },
  );

  return {
    ...data,
    likes: 0,
  };
};

// Expand Features for a given idea
export async function expandFeatures(idea: PartialIdea): Promise<Feature[]> {
  const featuresWithTwoBullets = z
    .array(
      FeatureSchema.extend({
        acceptanceCriteria: FeatureSchema.shape.acceptanceCriteria.length(2),
      }),
    )
    .length(3);

  const features = await generateZodSchemaFromPrompt(
    featuresWithTwoBullets,
    FEATURES_PROMPT,
    { title: idea.title, description: idea.description },
  );

  return features;
}

// Expand Frameworks for a given idea
export async function expandFrameworks(
  idea: PartialIdea,
): Promise<Framework[]> {
  const frameworks = await generateZodSchemaFromPrompt(
    IdeaSchema.shape.frameworks.length(3),
    FRAMEWORK_PROMPT,
    { title: idea.title, features: idea.features },
  );

  return frameworks;
}
