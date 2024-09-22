import { IdeaSchema } from "@/types/idea";
import { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT } from "./prompts";
import { generateZodSchemaFromPrompt } from "@/lib/llm";

// Generate Title and Description of Idea
export const generateIdea = async (topic: string) =>
  generateZodSchemaFromPrompt(
    IdeaSchema.pick({ title: true, description: true }),
    IDEA_PROMPT,
    { topic },
  );

// Expand Initial IdeaSchema with Features and Frameworks
export async function expandIdea(title: string, description: string) {
  // Major features to develop for project
  const features = await generateZodSchemaFromPrompt(
    IdeaSchema.shape.features.length(3),
    FEATURES_PROMPT,
    { title, description },
  );
  // Ways they could possibly build project
  const frameworks = await generateZodSchemaFromPrompt(
    IdeaSchema.shape.frameworks.length(3),
    FEATURES_PROMPT,
    { title, description, features },
  );
  return { features, frameworks };
}
