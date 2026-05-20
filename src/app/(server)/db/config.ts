import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME, POSTGRES_URL } = process.env;

function normalizePostgresUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (!parsed.searchParams.has("sslmode")) {
      parsed.searchParams.set("sslmode", "require");
    }

    if (!parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }

    // if (parsed.searchParams.has("workaround")) {
    //   parsed.searchParams.delete("workaround");
    // }

    return parsed.toString();
  } catch (error) {
    return url;
  }
}

export const connectionString = POSTGRES_URL
  ? normalizePostgresUrl(POSTGRES_URL)
  : `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require&pgbouncer=true`;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = connectionString;
}

export const db = drizzle(sql);
