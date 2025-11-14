import {
  type Detection,
  type InsertDetection,
  type TrainingData,
  type InsertTrainingData,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createDetection(detection: InsertDetection): Promise<Detection>;
  getDetections(): Promise<Detection[]>;
  getDetection(id: string): Promise<Detection | undefined>;
  
  createTrainingData(data: InsertTrainingData): Promise<TrainingData>;
  getTrainingData(): Promise<TrainingData[]>;
}

export class MemStorage implements IStorage {
  private detections: Map<string, Detection>;
  private trainingData: Map<string, TrainingData>;

  constructor() {
    this.detections = new Map();
    this.trainingData = new Map();
  }

  async createDetection(insertDetection: InsertDetection): Promise<Detection> {
    const id = randomUUID();
    const detection: Detection = {
      ...insertDetection,
      id,
      createdAt: new Date(),
    };
    this.detections.set(id, detection);
    return detection;
  }

  async getDetections(): Promise<Detection[]> {
    return Array.from(this.detections.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDetection(id: string): Promise<Detection | undefined> {
    return this.detections.get(id);
  }

  async createTrainingData(insertData: InsertTrainingData): Promise<TrainingData> {
    const id = randomUUID();
    const data: TrainingData = {
      ...insertData,
      id,
      createdAt: new Date(),
    };
    this.trainingData.set(id, data);
    return data;
  }

  async getTrainingData(): Promise<TrainingData[]> {
    return Array.from(this.trainingData.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
