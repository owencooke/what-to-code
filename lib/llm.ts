import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";

if (!process.env.LLM_MODEL || !process.env.LLM_PROVIDER) {
  throw new Error(
    "Environment variables LLM_PROVIDER and LLM_MODEL must be set",
  );
}

const providers: { [key: string]: Function } = {
  openai: () =>
    new ChatOpenAI({
      model: process.env.LLM_MODEL,
      temperature: 0.8,
    }),
  google: () =>
    new ChatGoogleGenerativeAI({
      model: process.env.LLM_MODEL,
      temperature: 1,
    }),
};

const llm = providers[process.env.LLM_PROVIDER as string]();

async function generateZodSchemaFromPrompt<T>(
  outputSchema: z.ZodSchema<T>,
  promptString: string,
  promptVars?: Record<string, any>,
): Promise<T> {
  if (!llm.withStructuredOutput) {
    throw new Error(
      `withStructuredOutput is not available for model: ${process.env.LLM_MODEL}`,
    );
  }

  // Check if the schema is an array and wrap it in an object schema if necessary
  const isArray = outputSchema instanceof z.ZodArray;
  const wrappedSchema = isArray
    ? z.object({ items: outputSchema })
    : outputSchema;

  const result = await llm
    .withStructuredOutput(wrappedSchema)
    .invoke(
      await PromptTemplate.fromTemplate(promptString).invoke(promptVars || {}),
    );

  return isArray ? result.items : result;
}

export { generateZodSchemaFromPrompt };
