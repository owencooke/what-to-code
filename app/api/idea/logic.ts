import { z } from "zod";
import { OpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

// TODO: add {list_of_idea_types} to the template
const IDEA_PROMPT = `
    {format_instructions}
    You are a creative entrepreneur looking to generate a new, innovative product idea.
    The product will be built using software, not a service or physical good. 
    The ideas are just ideas. The product need not yet exist, nor may it necessarily be clearly feasible. 

    An example of what the output should look like is provided below:

    title: VR Medical Training
    description: An immersive software platform designed to provide realistic scenarios for medical students and professionals to practice complex procedures and decision-making. Users will be able to enhance their skills and knowledge in a safe virtual environment. This innovative tool aims to revolutionize medical training by offering a cost-effective and accessible solution for hands-on learning.

    It is your job as the creative entrepreneur to generate the unique software project idea.
    It is CRITICAL that the description not discuss specific software or application features. 
    It should only describe the high level benefits of the project for potential users.
    `;

const ideaParser = StructuredOutputParser.fromZodSchema(
  z.object({
    title: z.string().describe("name of the software project"),
    description: z.string().describe("brief overview of the software project"),
  }),
);

const FEATURES_PROMPT = `
    {format_instructions}
    Based on the following software project, generate three major features to be developed.
    Project Title: {title}
    Project Description: {description}
`;

const featureParser = StructuredOutputParser.fromZodSchema(
  z
    .array(
      z.object({
        title: z.string().describe("title of the feature"),
        description: z.string().describe("description of the feature"),
      }),
    )
    .length(3)
    .describe("list of three major features"),
);

const FRAMEWORK_PROMPT = `
    {format_instructions}
    Based on the following project and major features to be developed, generate three possible 
    types of software to be built. Each of the three suggested solutions should be unique categories
    (e.g. web, mobile, desktop, CLI, tool, etc.) and their respective description should 
    specify the programming languages, frameworks, and tools necessary to build it.
    
    Project Title: {title}
    Project Description: {description}
    Project Features: {features}
`;

const frameworkParser = StructuredOutputParser.fromZodSchema(
  z
    .array(
      z.object({
        title: z.string().describe("category of software to be built"),
        description: z
          .string()
          .describe(
            "description of programming languages, frameworks and/or tools used to build",
          ),
        tools: z
          .array(z.string())
          .describe(
            "names of programming languages, frameworks and/or tools mentioned in description",
          ),
      }),
    )
    .length(3)
    .describe("list of three types of software platforms to build project on"),
);

/**
 * Initializes and calls a simple chain for generating a software project idea and its major features.
 */
export async function getNewIdea() {
  const model = new OpenAI({ model: "gpt-3.5-turbo-0125", temperature: 0.8 });

  // 1. Generating initial project idea
  const ideaChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(IDEA_PROMPT),
    model,
    ideaParser,
  ]);
  const { title, description } = await ideaChain.invoke({
    format_instructions: ideaParser.getFormatInstructions(),
  });

  // 2. Major features to develop for project
  const featureChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(FEATURES_PROMPT),
    model,
    featureParser,
  ]);
  const featureResponse = await featureChain.invoke({
    format_instructions: featureParser.getFormatInstructions(),
    title,
    description,
  });

  // 3. Major features to develop for project
  const frameworkChain = RunnableSequence.from([
    PromptTemplate.fromTemplate(FRAMEWORK_PROMPT),
    model,
    frameworkParser,
  ]);
  const frameworkResponse = await frameworkChain.invoke({
    format_instructions: frameworkParser.getFormatInstructions(),
    title,
    description,
    features: JSON.stringify(featureResponse),
  });

  // Combine all results into final project idea
  return {
    title,
    description,
    features: featureResponse,
    frameworks: frameworkResponse,
  };
}
