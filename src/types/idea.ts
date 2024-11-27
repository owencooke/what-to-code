import { z } from "zod";
import { FeatureSchema } from "./project";

const IdeaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  features: z.array(FeatureSchema.pick({ title: true })).nullable(),
  likes: z.number(),
});

// Define TS types from schemas
type Idea = z.infer<typeof IdeaSchema>;
type NewIdea = Omit<Idea, "id" | "likes">;

export { FeatureSchema, IdeaSchema };
export type { Idea, NewIdea };
