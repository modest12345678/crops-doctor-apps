import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const detections = pgTable("detections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cropType: text("crop_type").notNull(),
  imageData: text("image_data").notNull(),
  diseaseName: text("disease_name").notNull(),
  confidence: integer("confidence").notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").notNull(),
  treatment: text("treatment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const trainingData = pgTable("training_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  imageData: text("image_data").notNull(),
  diseaseName: text("disease_name").notNull(),
  userNotes: text("user_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDetectionSchema = createInsertSchema(detections).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingDataSchema = createInsertSchema(trainingData).omit({
  id: true,
  createdAt: true,
});

export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type Detection = typeof detections.$inferSelect;
export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;
export type TrainingData = typeof trainingData.$inferSelect;
