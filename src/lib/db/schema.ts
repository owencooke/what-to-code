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
  title: varchar("title", { length: 100 }).notNull(),
  id: serial("id").primaryKey(),
  features: jsonb("features"),
  likes: integer("likes"),
  description: varchar("description", { length: 350 }).notNull(),
});

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
    .references(() => users.id),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Define the "subscribers" table
export const subscribers = pgTable(`subscribers`, {
  created_at: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  email: varchar("email").notNull(),
});

// Define the "templates" table
export const templates = pgTable(`templates`, {
  url: text("url"),
  id: serial("id").primaryKey(),
  embedding: vector("embedding", { dimensions: 1536 }),
});

// Define the "user_idea_views" table
export const userIdeaViews = pgTable("user_idea_views", {
  viewed_at: timestamp("viewed_at", { withTimezone: true }).defaultNow(),
  idea_id: integer("idea_id")
    .notNull()
    .references(() => ideas.id),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id),
});

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
