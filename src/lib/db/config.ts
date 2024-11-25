import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";

// Construct the connection string
// const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
// export const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?workaround=supabase-pooler.vercel`;
export const connectionString = process.env.POSTGRES_URL!;

export const db = drizzle(sql);
