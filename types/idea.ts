import { z } from "zod";

const Feature = z.object({
  title: z.string().describe("Short title of the single feature to make"),
  userStory: z
    .string()
    .describe(
      "User story for the feature in format: As a < type of user >, I want < some goal > so that < some reason >.",
    ),
  acceptanceCriteria: z
    .array(z.string())
    .describe("List of acceptance criteria for the feature"),
});

const Framework = z.object({
  title: z.string().describe("category of software to be built"),
  description: z
    .string()
    .describe(
      "Description of programming languages, frameworks and/or tools used to build. Each tool should only be mentioned once.",
    ),
  tools: z
    .array(z.string())
    .describe(
      "Names of programming languages, frameworks and/or tools mentioned in description. Names should be lowercase alphabetic or numeric characters only: no spaces or punctuation (like css3, html5, react, nodejs).",
    ),
});

const Idea = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .describe("Name of the software project"),
  description: z
    .string()
    .max(350, {
      message: "Description must be 350 characters or less.",
    })
    .describe("Brief overview of the software project"),
  features: z.array(Feature).describe("List of major features to develop"),
  frameworks: z
    .array(Framework)
    .describe(
      "List of types of platforms to build/tech stack to use for project",
    ),
});

export { Idea, Feature, Framework };
