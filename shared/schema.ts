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

export const farmingCycles = pgTable("farming_cycles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  farmerName: text("farmer_name").notNull(),
  crop: text("crop").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  status: text("status").notNull().default("active"), // active, harvested
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const farmingStages = pgTable("farming_stages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cycleId: varchar("cycle_id").notNull(),
  stageName: text("stage_name").notNull(), // Sowing, Irrigation, etc.
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const fertilizerHistory = pgTable("fertilizer_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  crop: text("crop").notNull(),
  area: text("area").notNull(),
  unit: text("unit").notNull(),
  result: text("result").notNull(), // Stored as JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const soilHistory = pgTable("soil_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  result: text("result").notNull(), // Stored as JSON string
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

export const insertFarmingCycleSchema = createInsertSchema(farmingCycles, {
  startDate: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertFarmingStageSchema = createInsertSchema(farmingStages, {
  date: z.coerce.date(),
}).omit({
  id: true,
  createdAt: true,
});

export const userInfoSchema = z.object({
  ip: z.string().optional(),
  deviceInfo: z.any().optional(),
  userAgent: z.string().optional(),
});

export type InsertDetection = z.infer<typeof insertDetectionSchema>;
export type Detection = typeof detections.$inferSelect;
export type InsertTrainingData = z.infer<typeof insertTrainingDataSchema>;
export type TrainingData = typeof trainingData.$inferSelect;
export type InsertFarmingCycle = z.infer<typeof insertFarmingCycleSchema>;
export type FarmingCycle = typeof farmingCycles.$inferSelect;
export type InsertFarmingStage = z.infer<typeof insertFarmingStageSchema>;
export type FarmingStage = typeof farmingStages.$inferSelect;
export type UserInfo = z.infer<typeof userInfoSchema>;

export const insertFertilizerHistorySchema = createInsertSchema(fertilizerHistory).omit({
  id: true,
  createdAt: true,
});
export const insertSoilHistorySchema = createInsertSchema(soilHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertFertilizerHistory = z.infer<typeof insertFertilizerHistorySchema>;
export type FertilizerHistory = typeof fertilizerHistory.$inferSelect;
export type InsertSoilHistory = z.infer<typeof insertSoilHistorySchema>;
export type SoilHistory = typeof soilHistory.$inferSelect;
