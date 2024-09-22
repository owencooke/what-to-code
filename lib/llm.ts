import { ChatOpenAI } from "@langchain/openai";
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
  return llm
    .withStructuredOutput(outputSchema)
    .invoke(
      await PromptTemplate.fromTemplate(promptString).invoke(promptVars || {}),
    );
}

export { generateZodSchemaFromPrompt };
