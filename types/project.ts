import { z } from "zod";
import { FrameworkSchema, IdeaSchema } from "./idea";

const ProjectSchema = IdeaSchema.pick({
  title: true,
  description: true,
}).extend({
  features: IdeaSchema.shape.features.optional(),
  framework: FrameworkSchema,
  github_user: z.string(),
  github_avatar: z.string(),
});

type Project = z.infer<typeof ProjectSchema>;

export { ProjectSchema };
export type { Project };
