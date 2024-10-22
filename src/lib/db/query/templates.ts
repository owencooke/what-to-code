import { db } from "@/lib/db/config";
import { sql } from "drizzle-orm";
import { TemplateMatch } from "@/types/templates";

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
  //FIXME: this is wrong, it should call postgres function match_templates
  const result = await db.execute(
    sql`SELECT * FROM match_templates(${embedding}, ${matchCount})`,
  );
  return result.rows.map((row) => row as TemplateMatch);
}
