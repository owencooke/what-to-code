import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// TODO: add {list_of_idea_types} to the template
const IDEA_PROMPT_TEMPLATE = `
    {format_instructions}
    Generate a random idea for a software project.
`;

const IDEA_PROMPT_OUTPUT = {
  title: "name of the software project",
  description: "brief overview of the software project",
};

export interface Idea {
  title: string;
  description: string;
}

/**
 * Initializes and calls a simple chain for generating a software project idea.
 */
export async function getNewIdea(): Promise<Idea> {
  const parser =
    StructuredOutputParser.fromNamesAndDescriptions(IDEA_PROMPT_OUTPUT);

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(IDEA_PROMPT_TEMPLATE),
    new OpenAI({ model: "gpt-3.5-turbo", temperature: 0.8 }),
    parser,
  ]);

  // TODO: pass {list_of_idea_types} to the template here, from function arguments
  const response = await chain.invoke({
    format_instructions: parser.getFormatInstructions(),
  });

  return {
    title: response.title,
    description: response.description,
  } as Idea;
}
