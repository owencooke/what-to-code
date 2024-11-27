import { db } from "@/lib/db/config";
import { cosineDistance, desc, sql } from "drizzle-orm";
import { TemplateMatch } from "@/types/templates";
import { templates } from "../schema";

/**
 * Calls the PostgreSQL function match_templates to get the top matching templates.
 *
 * @param {number[]} embedding - The query embedding.
 * @param {number} matchCount - The number of top matches to return.
 * @returns {Promise<TemplateMatch[]>} - A promise that resolves to an array of matching templates.
 */
export async function matchTemplates(
  embedding: number[],
  matchCount: number,
): Promise<TemplateMatch[]> {
  const similarity = sql<number>`1 - (${cosineDistance(templates.embedding, embedding)})`;
  const matches = await db
    .select({ url: templates.url, similarity })
    .from(templates)
    .orderBy((t) => desc(t.similarity))
    .limit(matchCount);
  return matches.map((row) => row as TemplateMatch);
}
