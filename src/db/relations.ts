import { relations } from "drizzle-orm";
import { users, accounts, sessions, conversations, messages, memories, agentLogs } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  conversations: many(conversations),
  memories: many(memories),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  messages: many(messages),
  agentLogs: many(agentLogs),
}));

export const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  agentLogs: many(agentLogs),
}));

export const agentLogsRelations = relations(agentLogs, ({ one }) => ({
  conversation: one(conversations, {
    fields: [agentLogs.conversationId],
    references: [conversations.id],
  }),
  message: one(messages, {
    fields: [agentLogs.messageId],
    references: [messages.id],
  }),
}));
