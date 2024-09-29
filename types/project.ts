import { z } from "zod";
import { FrameworkSchema, IdeaSchema } from "./idea";

// Project not yet saved to DB
const NewProjectSchema = IdeaSchema.pick({
  title: true,
  description: true,
}).extend({
  features: IdeaSchema.shape.features.optional(),
  framework: FrameworkSchema,
  github_user: z.string(),
  starterRepo: z.object({ url: z.string().url(), isTemplate: z.boolean() }),
});

// Project created and stored in DB
const ProjectSchema = NewProjectSchema.omit({ starterRepo: true }).extend({
  id: z.string(),
});

type NewProject = z.infer<typeof NewProjectSchema>;
type Project = z.infer<typeof ProjectSchema>;

export { NewProjectSchema, ProjectSchema };
export type { NewProject, Project };
