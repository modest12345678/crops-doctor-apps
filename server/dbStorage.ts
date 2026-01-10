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
import { db } from "./db.js";
import { detections, trainingData, farmingCycles, farmingStages, fertilizerHistory, soilHistory, users } from "../shared/schema.js";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "./storage.js";

export class DbStorage implements IStorage {
    async createDetection(insertDetection: InsertDetection): Promise<Detection> {
        const [detection] = await db.insert(detections).values(insertDetection).returning();
        return detection;
    }

    async getDetections(): Promise<Detection[]> {
        return await db.select().from(detections).orderBy(desc(detections.createdAt));
    }

    async getDetection(id: string): Promise<Detection | undefined> {
        const [detection] = await db.select().from(detections).where(eq(detections.id, id));
        return detection;
    }

    async createTrainingData(insertData: InsertTrainingData): Promise<TrainingData> {
        const [data] = await db.insert(trainingData).values(insertData).returning();
        return data;
    }

    async getTrainingData(): Promise<TrainingData[]> {
        return await db.select().from(trainingData).orderBy(desc(trainingData.createdAt));
    }

    async registerUser(userInfo: UserInfo): Promise<void> {
        if (!userInfo.ip) return;

        const deviceInfoStr = userInfo.deviceInfo ? JSON.stringify(userInfo.deviceInfo) : null;

        await db.insert(users).values({
            ip: userInfo.ip,
            deviceInfo: deviceInfoStr,
            userAgent: userInfo.userAgent,
            analysisCount: 0,
            lastSeen: new Date(),
            createdAt: new Date(),
        }).onConflictDoUpdate({
            target: users.ip,
            set: {
                deviceInfo: deviceInfoStr,
                userAgent: userInfo.userAgent,
                lastSeen: new Date(),
            }
        });
    }

    async incrementUserAnalysisCount(ip: string): Promise<void> {
        if (!ip) return;

        const [existingUser] = await db.select().from(users).where(eq(users.ip, ip));

        if (existingUser) {
            await db.update(users)
                .set({
                    analysisCount: existingUser.analysisCount + 1,
                    lastSeen: new Date(),
                })
                .where(eq(users.ip, ip));
        } else {
            await db.insert(users).values({
                ip,
                analysisCount: 1,
                lastSeen: new Date(),
                createdAt: new Date(),
            });
        }
    }

    async logError(error: { message: string; stack?: string; ip?: string; context?: string }): Promise<void> {
        // For now, just log to console. You could create an errors table if needed
        console.error("Error logged:", error);
    }

    async createFarmingCycle(insertCycle: InsertFarmingCycle): Promise<FarmingCycle> {
        const [cycle] = await db.insert(farmingCycles).values(insertCycle).returning();
        return cycle;
    }

    async getFarmingCycles(): Promise<FarmingCycle[]> {
        return await db.select().from(farmingCycles).orderBy(desc(farmingCycles.createdAt));
    }

    async getFarmingCycle(id: string): Promise<FarmingCycle | undefined> {
        const [cycle] = await db.select().from(farmingCycles).where(eq(farmingCycles.id, id));
        return cycle;
    }

    async createFarmingStage(insertStage: InsertFarmingStage): Promise<FarmingStage> {
        const [stage] = await db.insert(farmingStages).values(insertStage).returning();
        return stage;
    }

    async getFarmingStages(cycleId: string): Promise<FarmingStage[]> {
        return await db.select().from(farmingStages)
            .where(eq(farmingStages.cycleId, cycleId))
            .orderBy(farmingStages.date);
    }

    async createFertilizerHistory(insertData: InsertFertilizerHistory): Promise<FertilizerHistory> {
        const [history] = await db.insert(fertilizerHistory).values(insertData).returning();
        return history;
    }

    async getFertilizerHistory(): Promise<FertilizerHistory[]> {
        return await db.select().from(fertilizerHistory).orderBy(desc(fertilizerHistory.createdAt));
    }

    async createSoilHistory(insertData: InsertSoilHistory): Promise<SoilHistory> {
        const [history] = await db.insert(soilHistory).values(insertData).returning();
        return history;
    }

    async getSoilHistory(): Promise<SoilHistory[]> {
        return await db.select().from(soilHistory).orderBy(desc(soilHistory.createdAt));
    }

    // Admin methods
    async getUsers() {
        const allUsers = await db.select().from(users);
        return allUsers.map(user => ({
            ip: user.ip,
            deviceInfo: user.deviceInfo ? JSON.parse(user.deviceInfo) : null,
            userAgent: user.userAgent || undefined,
            analysisCount: user.analysisCount,
            lastSeen: user.lastSeen.toISOString(),
        }));
    }

    async getErrorLogs() {
        // Return empty array for now - implement errors table if needed
        return [];
    }

    async getAllData() {
        const [usersData, detectionsData, fertilizerData, soilData] = await Promise.all([
            this.getUsers(),
            this.getDetections(),
            this.getFertilizerHistory(),
            this.getSoilHistory(),
        ]);

        return {
            users: usersData,
            detections: detectionsData,
            fertilizerHistory: fertilizerData,
            soilHistory: soilData,
            errorLogs: [],
            stats: {
                totalUsers: usersData.length,
                totalDetections: detectionsData.length,
                totalFertilizerRecords: fertilizerData.length,
                totalSoilRecords: soilData.length,
                totalErrors: 0,
            }
        };
    }
}
