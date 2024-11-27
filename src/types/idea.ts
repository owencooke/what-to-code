import { z } from "zod";
import { FeatureSchema } from "./project";

const PartialIdeaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  features: z.array(FeatureSchema.pick({ title: true })).nullable(),
  likes: z.number(),
});

// Define TS types from schemas
type PartialIdea = z.infer<typeof PartialIdeaSchema>;
type NewPartialIdea = Omit<PartialIdea, "id" | "likes">;

export { FeatureSchema, PartialIdeaSchema };
export type { PartialIdea, NewPartialIdea };
