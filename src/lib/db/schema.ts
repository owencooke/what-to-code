import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  integer,
  varchar,
  vector,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

// Define the "users" table
export const users = pgTable(`users`, {
  email: text("email"),
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  id: text("id").primaryKey(),
  username: text("username").notNull(),
});

// Define the "ideas" table
export const ideas = pgTable(`ideas`, {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 350 }).notNull(),
  features: jsonb("features"),
  likes: integer("likes").default(0).notNull(),
});

// Define the "topics" table
export const topics = pgTable(`topics`, {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

// Define the "idea_topics" join table
export const ideaTopics = pgTable(
  `idea_topics`,
  {
    idea_id: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    topic_id: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.idea_id, table.topic_id] }),
  }),
);

// Define the "projects" table
export const projects = pgTable(`projects`, {
  id: varchar("id", { length: 21 })
    .primaryKey()
    .default(sql`generate_url_friendly_id()`),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 350 }).notNull(),
  features: jsonb("features"),
  framework: jsonb("framework"),
  owner_id: varchar("owner_id", { length: 21 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Define the "templates" table
export const templates = pgTable(
  `templates`,
  {
    url: text("url"),
    id: serial("id").primaryKey(),
    embedding: vector("embedding", { dimensions: 1536 }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

// Define the "user_idea_views" table
export const userIdeaViews = pgTable(
  "user_idea_views",
  {
    viewed_at: timestamp("viewed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    idea_id: integer("idea_id")
      .notNull()
      .references(() => ideas.id, { onDelete: "cascade" }),
    user_id: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.idea_id, table.user_id] }),
  }),
);

// Define the relations
export const projectRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.owner_id],
    references: [users.id],
  }),
}));

export const userIdeaViewsRelations = relations(userIdeaViews, ({ one }) => ({
  user: one(users, {
    fields: [userIdeaViews.user_id],
    references: [users.id],
  }),
  idea: one(ideas, {
    fields: [userIdeaViews.idea_id],
    references: [ideas.id],
  }),
}));

export const ideaRelations = relations(ideas, ({ many }) => ({
  topics: many(topics),
}));
