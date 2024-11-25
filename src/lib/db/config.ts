import { drizzle } from "drizzle-orm/neon-serverless";

// Construct the connection string
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
export const connectionString = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// Create the drizzle database instance with the SQL client
export const db = drizzle(connectionString);
