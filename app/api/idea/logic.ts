import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createPromptTemplateWithFormatting } from "@/lib/langchain";
import { IdeaSchema } from "@/types/idea";
import { IDEA_PROMPT, FEATURES_PROMPT, FRAMEWORK_PROMPT } from "./prompts";

const MODEL = "gpt-4o-mini";

const parsers = {
  idea: StructuredOutputParser.fromZodSchema(
    IdeaSchema.pick({ title: true, description: true }),
  ),
  feature: StructuredOutputParser.fromZodSchema(
    IdeaSchema.shape.features.length(3),
  ),
  framework: StructuredOutputParser.fromZodSchema(
    IdeaSchema.shape.frameworks.length(3),
  ),
};

// Generate IdeaSchema Title and Description
export async function generateIdea(topic: string) {
  const model = new OpenAI({ model: MODEL, temperature: 0.8 });

  // Generating initial project idea
  const ideaChain = RunnableSequence.from([
    createPromptTemplateWithFormatting(IDEA_PROMPT),
    model,
    parsers.idea,
  ]);

  const { title, description } = await ideaChain.invoke({
    format_instructions: parsers.idea.getFormatInstructions(),
    topic,
  });

  return { title, description };
}

// Expand Initial IdeaSchema with Features and Frameworks
export async function expandIdea(title: string, description: string) {
  const model = new OpenAI({ model: MODEL, temperature: 0.8 });

  // Major features to develop for project
  const featureChain = RunnableSequence.from([
    createPromptTemplateWithFormatting(FEATURES_PROMPT),
    model,
    parsers.feature,
  ]);
  const features = await featureChain.invoke({
    format_instructions: parsers.feature.getFormatInstructions(),
    title,
    description,
  });

  // Frameworks to build project on
  const frameworkChain = RunnableSequence.from([
    createPromptTemplateWithFormatting(FRAMEWORK_PROMPT),
    model,
    parsers.framework,
  ]);

  const frameworks = await frameworkChain.invoke({
    format_instructions: parsers.framework.getFormatInstructions(),
    title,
    description,
    features: JSON.stringify(features),
  });

  return { features, frameworks };
}
