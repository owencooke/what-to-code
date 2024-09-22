import { PromptTemplate } from "@langchain/core/prompts";

export const createPromptTemplateWithFormatting = (
  prompt: string,
): PromptTemplate =>
  PromptTemplate.fromTemplate(`{format_instructions} ${prompt}`);
