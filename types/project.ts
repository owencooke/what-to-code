import { z } from "zod";
import { FrameworkSchema, IdeaSchema } from "./idea";

// Project not yet saved to DB
const NewProjectSchema = IdeaSchema.pick({
  title: true,
  description: true,
}).extend({
  features: IdeaSchema.shape.features.min(
    1,
    "You need to build at least one feature!",
  ),
  framework: FrameworkSchema,
  github_user: z.string(),
  starterRepo: z.string().url().optional(),
});

// Project created and stored in DB
const ProjectSchema = NewProjectSchema.omit({ starterRepo: true }).extend({
  id: z.string(),
});

type NewProject = z.infer<typeof NewProjectSchema>;
type Project = z.infer<typeof ProjectSchema>;

export { NewProjectSchema, ProjectSchema };
export type { NewProject, Project };
