import { z } from "zod";
import { PartialIdeaSchema } from "./idea";

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

// Project not yet saved to DB
const NewProjectSchema = PartialIdeaSchema.pick({
  title: true,
  description: true,
}).extend({
  features: z
    .array(FeatureSchema)
    .describe("List of major features to develop")
    .min(1, "You need to build at least one feature!"),
  framework: FrameworkSchema,
  github_user: z.string(),
  starterRepo: z.string().url().optional(),
});

// Project created and stored in DB
const ProjectSchema = NewProjectSchema.omit({ starterRepo: true }).extend({
  id: z.string(),
  features: z.array(FeatureSchema.omit({ id: true })),
  framework: FrameworkSchema.omit({ id: true }),
});

type NewProject = z.infer<typeof NewProjectSchema>;
type Project = z.infer<typeof ProjectSchema>;
type Feature = z.infer<typeof FeatureSchema>;
type Framework = z.infer<typeof FrameworkSchema>;

export { NewProjectSchema, ProjectSchema, FeatureSchema, FrameworkSchema };
export type { NewProject, Project, Feature, Framework };
