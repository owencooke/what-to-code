import { z } from "zod";
import { FeatureSchema } from "./project";

const PartialIdeaSchema = z.object({
  id: z.number(),
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
  features: z.array(FeatureSchema.pick({ title: true })).nullable(),
  likes: z.number(),
});

// Define TS types from schemas
type PartialIdea = z.infer<typeof PartialIdeaSchema>;
type NewPartialIdea = Omit<PartialIdea, "id" | "likes">;

export { FeatureSchema, PartialIdeaSchema };
export type { PartialIdea, NewPartialIdea };
