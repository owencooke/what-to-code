import { z } from "zod";

// Create schemas for software project idea generation
const FeatureSchema = z.object({
  id: z.number(),
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

const FrameworkSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .describe(
      "category of the software, platform, infra, or device to be built",
    ),
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

const IdeaSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Project name must be at least 2 characters.",
    })
    .max(100, {
      message: "Project name must be 100 characters or less.",
    })
    .describe("Name of the software project"),
  description: z
    .string()
    .max(350, {
      message: "Description must be 350 characters or less.",
    })
    .describe("Brief overview of the software project"),
  features: z
    .array(FeatureSchema)
    .describe("List of major features to develop"),
  frameworks: z
    .array(FrameworkSchema)
    .describe(
      "List of types of platforms to build/tech stack to use for project",
    ),
});

const PartialIdeaSchema = IdeaSchema.omit({
  frameworks: true,
  features: true,
}).extend({
  features: z.array(FeatureSchema.pick({ title: true })).nullable(),
  likes: z.number(),
  id: z.number(),
});

// Define TS types from schemas
type Feature = z.infer<typeof FeatureSchema>;
type Framework = z.infer<typeof FrameworkSchema>;
type Idea = z.infer<typeof IdeaSchema>;
type PartialIdea = z.infer<typeof PartialIdeaSchema>;
type NewPartialIdea = Omit<PartialIdea, "id" | "likes">;

interface UserIdeaView {
  user_id: string;
  idea_id: number;
  viewed_at: Date;
}

export { IdeaSchema, FeatureSchema, FrameworkSchema, PartialIdeaSchema };
export type {
  Idea,
  Feature,
  Framework,
  UserIdeaView,
  PartialIdea,
  NewPartialIdea,
};
