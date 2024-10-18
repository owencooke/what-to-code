import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/**
 * An object mapping each possible LLM provider to their corresponding init function.
 * Each provider function returns an instance of a language model.
 */
const providers: { [key: string]: Function } = {
  openai: () =>
    new ChatOpenAI({
      model: process.env.LLM_MODEL,
      temperature: 0.8,
    }),
  google: () =>
    new ChatGoogleGenerativeAI({
      model: process.env.LLM_MODEL,
      temperature: 0.1,
    }),
};

/**
 * Ensures that the necessary environment variables are set.
 * Throws an error if LLM_MODEL or LLM_PROVIDER is not defined.
 */
if (!process.env.LLM_MODEL || !process.env.LLM_PROVIDER) {
  throw new Error(
    "Environment variables LLM_PROVIDER and LLM_MODEL must be set",
  );
}

/**
 * Initializes the LLM based on the specified provider.
 * The provider is determined by the LLM_PROVIDER environment variable.
 */
const llm = providers[process.env.LLM_PROVIDER as string]();

export { llm };
