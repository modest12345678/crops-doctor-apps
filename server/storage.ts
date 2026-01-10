import {
  type Detection,
  type InsertDetection,
  type TrainingData,
  type InsertTrainingData,
  type UserInfo,
  type FarmingCycle,
  type InsertFarmingCycle,
  type FarmingStage,
  type InsertFarmingStage,
  type FertilizerHistory,
  type InsertFertilizerHistory,
  type SoilHistory,
  type InsertSoilHistory,
} from "../shared/schema.js";
import { randomUUID } from "crypto";

export interface IStorage {
  createDetection(detection: InsertDetection): Promise<Detection>;
  getDetections(): Promise<Detection[]>;
  getDetection(id: string): Promise<Detection | undefined>;

  createTrainingData(data: InsertTrainingData): Promise<TrainingData>;
  getTrainingData(): Promise<TrainingData[]>;

  registerUser(userInfo: UserInfo): Promise<void>;
  incrementUserAnalysisCount(ip: string): Promise<void>;
  logError(error: { message: string; stack?: string; ip?: string; context?: string }): Promise<void>;

  createFarmingCycle(cycle: InsertFarmingCycle): Promise<FarmingCycle>;
  getFarmingCycles(): Promise<FarmingCycle[]>;
  getFarmingCycle(id: string): Promise<FarmingCycle | undefined>;
  createFarmingStage(stage: InsertFarmingStage): Promise<FarmingStage>;
  createFarmingStage(stage: InsertFarmingStage): Promise<FarmingStage>;
  getFarmingStages(cycleId: string): Promise<FarmingStage[]>;

  createFertilizerHistory(data: InsertFertilizerHistory): Promise<FertilizerHistory>;
  getFertilizerHistory(): Promise<FertilizerHistory[]>;
  createSoilHistory(data: InsertSoilHistory): Promise<SoilHistory>;
  getSoilHistory(): Promise<SoilHistory[]>;

  // Admin methods
  getUsers(): Promise<Array<UserInfo & { analysisCount: number; lastSeen: string }>>;
  getErrorLogs(): Promise<any[]>;
  getAllData(): Promise<{
    users: any[];
    detections: Detection[];
    fertilizerHistory: FertilizerHistory[];
    soilHistory: SoilHistory[];
    errorLogs: any[];
    stats: {
      totalUsers: number;
      totalDetections: number;
      totalFertilizerRecords: number;
      totalSoilRecords: number;
      totalErrors: number;
    };
  }>;
}

export class MemStorage implements IStorage {
  private detections: Map<string, Detection>;
  private trainingData: Map<string, TrainingData>;
  private users: Map<string, UserInfo & { analysisCount: number; lastSeen: string; timestamp: Date }>;
  private errorLogs: any[];
  private farmingCycles: Map<string, FarmingCycle>;
  private farmingStages: Map<string, FarmingStage>;
  private fertilizerHistory: Map<string, FertilizerHistory>;
  private soilHistory: Map<string, SoilHistory>;

  constructor() {
    this.detections = new Map();
    this.trainingData = new Map();
    this.users = new Map();
    this.errorLogs = [];
    this.farmingCycles = new Map();
    this.farmingStages = new Map();
    this.fertilizerHistory = new Map();
    this.soilHistory = new Map();
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
    return Array.from(this.detections.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getDetection(id: string): Promise<Detection | undefined> {
    return this.detections.get(id);
  }

  async createTrainingData(insertData: InsertTrainingData): Promise<TrainingData> {
    const id = randomUUID();
    const data: TrainingData = {
      ...insertData,
      userNotes: insertData.userNotes ?? null,
      id,
      createdAt: new Date(),
    };

    this.trainingData.set(id, data);
    return data;
  }

  async getTrainingData(): Promise<TrainingData[]> {
    return Array.from(this.trainingData.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async registerUser(userInfo: UserInfo): Promise<void> {
    if (!userInfo.ip) return;

    const existing = this.users.get(userInfo.ip);
    if (existing) {
      this.users.set(userInfo.ip, {
        ...existing,
        ...userInfo,
        lastSeen: new Date().toISOString(),
        timestamp: new Date()
      });
    } else {
      this.users.set(userInfo.ip, {
        ...userInfo,
        analysisCount: 0,
        lastSeen: new Date().toISOString(),
        timestamp: new Date()
      });
    }
  }

  async incrementUserAnalysisCount(ip: string): Promise<void> {
    if (!ip) return;

    const existing = this.users.get(ip);
    if (existing) {
      this.users.set(ip, {
        ...existing,
        analysisCount: existing.analysisCount + 1,
        lastSeen: new Date().toISOString()
      });
    } else {
      this.users.set(ip, {
        ip,
        analysisCount: 1,
        lastSeen: new Date().toISOString(),
        timestamp: new Date()
      });
    }
  }

  async logError(error: { message: string; stack?: string; ip?: string; context?: string }): Promise<void> {
    this.errorLogs.push({
      ...error,
      timestamp: new Date()
    });
  }

  async createFarmingCycle(insertCycle: InsertFarmingCycle): Promise<FarmingCycle> {
    const id = randomUUID();
    const cycle: FarmingCycle = {
      ...insertCycle,
      id,
      status: "active",
      createdAt: new Date(),
    };
    this.farmingCycles.set(id, cycle);
    return cycle;
  }

  async getFarmingCycles(): Promise<FarmingCycle[]> {
    return Array.from(this.farmingCycles.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getFarmingCycle(id: string): Promise<FarmingCycle | undefined> {
    return this.farmingCycles.get(id);
  }

  async createFarmingStage(insertStage: InsertFarmingStage): Promise<FarmingStage> {
    const id = randomUUID();
    const stage: FarmingStage = {
      ...insertStage,
      id,
      imageUrl: insertStage.imageUrl ?? null,
      videoUrl: insertStage.videoUrl ?? null,
      createdAt: new Date(),
    };
    this.farmingStages.set(id, stage);
    return stage;
  }

  async getFarmingStages(cycleId: string): Promise<FarmingStage[]> {
    return Array.from(this.farmingStages.values())
      .filter(stage => stage.cycleId === cycleId)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async createFertilizerHistory(insertData: InsertFertilizerHistory): Promise<FertilizerHistory> {
    const id = randomUUID();
    const history: FertilizerHistory = {
      ...insertData,
      id,
      createdAt: new Date(),
    };
    this.fertilizerHistory.set(id, history);
    return history;
  }

  async getFertilizerHistory(): Promise<FertilizerHistory[]> {
    return Array.from(this.fertilizerHistory.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async createSoilHistory(insertData: InsertSoilHistory): Promise<SoilHistory> {
    const id = randomUUID();
    const history: SoilHistory = {
      ...insertData,
      id,
      createdAt: new Date(),
    };
    this.soilHistory.set(id, history);
    return history;
  }

  async getSoilHistory(): Promise<SoilHistory[]> {
    return Array.from(this.soilHistory.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  // Admin methods
  async getUsers() {
    return Array.from(this.users.values());
  }

  async getErrorLogs() {
    return this.errorLogs;
  }

  async getAllData() {
    const users = await this.getUsers();
    const detections = await this.getDetections();
    const fertilizerHistory = await this.getFertilizerHistory();
    const soilHistory = await this.getSoilHistory();

    return {
      users,
      detections,
      fertilizerHistory,
      soilHistory,
      errorLogs: this.errorLogs,
      stats: {
        totalUsers: users.length,
        totalDetections: detections.length,
        totalFertilizerRecords: fertilizerHistory.length,
        totalSoilRecords: soilHistory.length,
        totalErrors: this.errorLogs.length
      }
    };
  }
}

// Reverting to MemStorage to ensure application stability while debugging DB connection
export const storage: IStorage = new MemStorage();

