import { FeatureSchema, Idea, IdeaSchema, NewIdea } from "@/types/idea";
import { Framework, Feature, FrameworkSchema } from "@/types/project";
import { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT } from "./prompts";
import { generateZodSchemaFromPrompt } from "@/app/(server)/integration/llm/utils";
import { z } from "zod";

// Generate Title and Description of Idea
export const generateIdea = async (
  topic: string,
  recentIdeas: Idea[],
): Promise<NewIdea> => {
  // Modify prompt to avoid using recent ideas (if any)
  // TODO: this should probably be done via ChatCompletions history, if we allow
  // for better prompt refinement by user also
  console.log({ recentIdeas });

  const recentIdeasDetails = recentIdeas
    .map((idea) => {
      const features = idea.features?.join(", ") || "";
      return `Title: ${idea.title}, Features: ${features}`;
    })
    .join("; ");

  const prompt = `${IDEA_PROMPT} ${
    recentIdeas.length > 0 &&
    `It is mandatory that you do not re-suggest titles and 
    features, such as: ${recentIdeasDetails}`
  }`;

  const outputSchema = IdeaSchema.pick({
    title: true,
  }).extend({
    description: z
      .string()
      .max(200)
      .describe("Catchy selling point of the software project"),
    features: z
      .array(FeatureSchema.pick({ title: true }))
      .describe("Key aspects of the software project"),
  });

  return generateZodSchemaFromPrompt(outputSchema, prompt, {
    topic,
  });
};

// Expand Features for a given idea
export async function expandFeatures(idea: Idea): Promise<Feature[]> {
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
export async function expandFrameworks(idea: Idea): Promise<Framework[]> {
  const frameworks = await generateZodSchemaFromPrompt(
    z.array(FrameworkSchema).length(3),
    FRAMEWORK_PROMPT,
    { title: idea.title, features: idea.features },
  );

  return frameworks;
}
