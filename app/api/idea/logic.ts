import { z } from "zod";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// TODO: add {list_of_idea_types} to the template
const IDEA_PROMPT_TEMPLATE = `
    {format_instructions}
    Generate a random idea for a software project.
`;

const idea = z.object({
  title: z.string().describe("name of the software project"),
  description: z.string().describe("brief overview of the software project"),
});

const FEATURE_PROMPT_TEMPLATE = `
    {format_instructions}
    Based on the following software project, generate three major features to be developed.
    Project Title: {title}
    Project Description: {description}
`;

const features = z
  .array(
    z.object({
      title: z.string().describe("title of the feature"),
      description: z.string().describe("description of the feature"),
    }),
  )
  .length(3)
  .describe("list of three major features");

/**
 * Initializes and calls a simple chain for generating a software project idea and its major features.
 */
export async function getNewIdea() {
  // 1. Generating initial project idea
  const ideaParser = StructuredOutputParser.fromZodSchema(idea);
  const ideaChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(IDEA_PROMPT_TEMPLATE),
    new OpenAI({ model: "gpt-3.5-turbo", temperature: 0.8 }),
    ideaParser,
  ]);
  const { title, description } = await ideaChain.invoke({
    format_instructions: ideaParser.getFormatInstructions(),
  });

  // 2. Major features to develop for project
  const featureParser = StructuredOutputParser.fromZodSchema(features);
  const featureChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(FEATURE_PROMPT_TEMPLATE),
    new OpenAI({ model: "gpt-3.5-turbo", temperature: 0.8 }),
    featureParser,
  ]);
  const featureResponse = await featureChain.invoke({
    format_instructions: featureParser.getFormatInstructions(),
    title,
    description,
  });

  // Combine all results into final project idea
  return {
    title,
    description,
    features: featureResponse,
  };
}
