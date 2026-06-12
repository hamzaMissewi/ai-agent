import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  hashedPassword: text("hashedPassword"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user', 'assistant', 'system', 'tool'
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const memories = pgTable("memories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: text("value").notNull(),
  category: text("category"), // e.g. 'preference', 'fact', 'goal'
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  messageId: uuid("messageId").references(() => messages.id, { onDelete: "set null" }),
  event: text("event").notNull(), // 'tool_call', 'tool_result', 'error', 'reasoning'
  data: jsonb("data"),
  durationMs: integer("durationMs"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
