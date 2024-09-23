import { IdeaSchema, FeatureSchema } from "@/types/idea";
import { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT } from "./prompts";
import { generateZodSchemaFromPrompt } from "@/lib/llm";
import { z } from "zod";

// Generate Title and Description of Idea
export const generateIdea = async (topic: string, recentIdeas: string[]) => {
  // Modify prompt to avoid using recent ideas (if any)
  const prompt = `${IDEA_PROMPT} ${
    recentIdeas.length > 0 &&
    `Do not suggest already taken ideas: ${recentIdeas.join()}`
  }`;

  return generateZodSchemaFromPrompt(
    IdeaSchema.pick({ title: true, description: true }),
    prompt,
    { topic, recentIdeas },
  );
};

// Expand Initial IdeaSchema with Features and Frameworks
export async function expandIdea(title: string, description: string) {
  // Major features to develop for project
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
    { title, description },
  );

  // Ways they could possibly build project
  const frameworks = await generateZodSchemaFromPrompt(
    IdeaSchema.shape.frameworks.length(3),
    FRAMEWORK_PROMPT,
    { title, features },
  );

  return { features, frameworks };
}
