import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const homeworkChecks = pgTable("homework_checks", {
  id: serial("id").primaryKey(),
  originalText: text("original_text").notNull(),
  feedback: text("feedback").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHomeworkCheckSchema = createInsertSchema(homeworkChecks).omit({
  id: true,
  createdAt: true,
});

export type HomeworkCheck = typeof homeworkChecks.$inferSelect;
export type InsertHomeworkCheck = z.infer<typeof insertHomeworkCheckSchema>;
