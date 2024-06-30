import { z } from "zod";
import { FrameworkSchema, IdeaSchema } from "./idea";

const ProjectSchema = IdeaSchema.pick({
  title: true,
  description: true,
}).extend({
  features: IdeaSchema.shape.features.optional(),
  framework: FrameworkSchema,
});

type Project = z.infer<typeof ProjectSchema>;

export { ProjectSchema };
export type { Project };
