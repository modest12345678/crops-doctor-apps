import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { analyzeCropDisease, type CropType } from "./openai.js";
import { insertDetectionSchema, insertTrainingDataSchema, insertFarmingCycleSchema, insertFarmingStageSchema } from "../shared/schema.js";
import { z } from "zod";

const detectRequestSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
  cropType: z.enum(["potato", "tomato", "corn", "wheat", "rice", "jute", "sugarcane", "tea", "mustard", "mango", "banana", "brinjal", "chili", "onion", "garlic", "ginger", "turmeric", "lentil", "watermelon", "papaya"]).default("potato"),
  language: z.enum(["en", "bn"]).default("en"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for debugging
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      env: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        GROQ_API_KEY: !!process.env.GROQ_API_KEY,
        GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
        NODE_ENV: process.env.NODE_ENV
      }
    });
  });

  // Disease detection endpoint
  app.post("/api/detect", async (req, res) => {
    try {
      const validatedRequest = detectRequestSchema.parse(req.body);

      // Analyze image using Gemini Vision API
      const analysis = await analyzeCropDisease(
        validatedRequest.imageData,
        validatedRequest.cropType as CropType,
        validatedRequest.language as "en" | "bn"
      );

      // Store detection result
      const detection = await storage.createDetection({
        cropType: validatedRequest.cropType,
        imageData: validatedRequest.imageData,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        description: analysis.description,
        symptoms: analysis.symptoms,
        treatment: JSON.stringify(analysis.treatment), // Store as JSON string
      });

      // Track usage
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userIp = Array.isArray(ip) ? ip[0] : ip;
      if (userIp) {
        await storage.incrementUserAnalysisCount(userIp);
      }

      // Return with treatment as array for frontend
      res.json({
        ...detection,
        treatment: analysis.treatment
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userIp = Array.isArray(ip) ? ip[0] : ip;

      console.error("Detection error:", error);
      await storage.logError({
        message: error instanceof Error ? error.message : "Unknown detection error",
        stack: error instanceof Error ? error.stack : undefined,
        ip: userIp,
        context: "POST /api/detect"
      });

      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to analyze image"
      });
    }
  });

  // Get all detections
  app.get("/api/detections", async (req, res) => {
    try {
      const detections = await storage.getDetections();
      res.json(detections);
    } catch (error) {
      console.error("Error fetching detections:", error);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await storage.logError({
        message: error instanceof Error ? error.message : "Unknown error fetching detections",
        stack: error instanceof Error ? error.stack : undefined,
        ip: Array.isArray(ip) ? ip[0] : ip,
        context: "GET /api/detections"
      });
      res.status(500).json({ message: "Failed to fetch detections" });
    }
  });

  // Submit training data
  app.post("/api/training", async (req, res) => {
    try {
      const validatedData = insertTrainingDataSchema.parse(req.body);
      const trainingData = await storage.createTrainingData(validatedData);
      res.json(trainingData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid training data", errors: error.errors });
      }
      console.error("Training data submission error:", error);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await storage.logError({
        message: error instanceof Error ? error.message : "Unknown training data error",
        stack: error instanceof Error ? error.stack : undefined,
        ip: Array.isArray(ip) ? ip[0] : ip,
        context: "POST /api/training"
      });
      res.status(500).json({ message: "Failed to submit training data" });
    }
  });

  // Get all training data
  app.get("/api/training", async (req, res) => {
    try {
      const trainingData = await storage.getTrainingData();
      res.json(trainingData);
    } catch (error) {
      console.error("Error fetching training data:", error);
      res.status(500).json({ message: "Failed to fetch training data" });
    }
  });

  // Register user/device
  app.post("/api/register", async (req, res) => {
    try {
      const userInfo = req.body;
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      await storage.registerUser({
        ...userInfo,
        ip: Array.isArray(ip) ? ip[0] : ip,
        userAgent: req.headers['user-agent']
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Registration error:", error);
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      await storage.logError({
        message: error instanceof Error ? error.message : "Unknown registration error",
        stack: error instanceof Error ? error.stack : undefined,
        ip: Array.isArray(ip) ? ip[0] : ip,
        context: "POST /api/register"
      });
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  // Chat with AI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, language } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Import dynamically to avoid circular dependency issues if any, though here it's fine
      const { chatWithAI } = await import("./openai.js");
      const response = await chatWithAI(message, language);


      res.json(response);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });

  // Fertilizer calculator
  app.post("/api/fertilizer", async (req, res) => {
    try {
      const { cropType, area, unit, language } = req.body;

      if (!cropType || !area || !unit) {
        return res.status(400).json({ message: "cropType, area, and unit are required" });
      }

      if (unit !== "acre" && unit !== "bigha") {
        return res.status(400).json({ message: "Unit must be 'acre' or 'bigha'" });
      }

      const { calculateFertilizer } = await import("./openai.js");
      const recommendations = await calculateFertilizer(cropType, area, unit, language);

      // Save to history
      await storage.createFertilizerHistory({
        crop: cropType,
        area,
        unit,
        result: JSON.stringify(recommendations),
      });

      res.json(recommendations);
    } catch (error) {
      console.error("Fertilizer calculation error:", error);
      res.status(500).json({ message: "Failed to calculate fertilizer recommendations" });
    }
  });

  // Farming Cycles & Stages
  app.post("/api/farming-cycles", async (req, res) => {
    try {
      const validatedData = insertFarmingCycleSchema.parse(req.body);
      const cycle = await storage.createFarmingCycle(validatedData);
      res.json(cycle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cycle data", errors: error.errors });
      }
      console.error("Create cycle error:", error);
      res.status(500).json({ message: "Failed to create farming cycle" });
    }
  });

  app.get("/api/farming-cycles", async (req, res) => {
    try {
      const cycles = await storage.getFarmingCycles();
      res.json(cycles);
    } catch (error) {
      console.error("Get cycles error:", error);
      res.status(500).json({ message: "Failed to fetch farming cycles" });
    }
  });

  app.get("/api/farming-cycles/:id", async (req, res) => {
    try {
      const cycle = await storage.getFarmingCycle(req.params.id);
      if (!cycle) return res.status(404).json({ message: "Cycle not found" });

      const stages = await storage.getFarmingStages(req.params.id);
      res.json({ ...cycle, stages });
    } catch (error) {
      console.error("Get cycle error:", error);
      res.status(500).json({ message: "Failed to fetch farming cycle" });
    }
  });

  app.post("/api/farming-stages", async (req, res) => {
    try {
      const validatedData = insertFarmingStageSchema.parse(req.body);
      const stage = await storage.createFarmingStage(validatedData);
      res.json(stage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stage data", errors: error.errors });
      }
      console.error("Create stage error:", error);
      res.status(500).json({ message: "Failed to create farming stage" });
    }
  });

  // Soil Fertility Data
  app.post("/api/soil-data", async (req, res) => {
    try {
      const { lat, lng } = req.body;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ message: "Valid latitude and longitude are required" });
      }

      const { getSoilData } = await import("./services/soilService.js");
      const data = await getSoilData(lat, lng);

      // Save to history
      await storage.createSoilHistory({
        location: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        result: JSON.stringify(data),
      });

      res.json(data);
    } catch (error: any) {
      console.error("Soil data request error:", error);
      if (error.code === 'ERR_MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
        return res.status(503).json({ message: "System update pending. Please restart the implementation server (npm run dev)." });
      }
      res.status(500).json({ message: error.message || "Failed to fetch soil data" });
    }
  });



  // History Endpoints
  app.get("/api/history/fertilizer", async (req, res) => {
    try {
      const history = await storage.getFertilizerHistory();
      res.json(history);
    } catch (error) {
      console.error("Fetch fertilizer history error:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.get("/api/history/soil", async (req, res) => {
    try {
      const history = await storage.getSoilHistory();
      res.json(history);
    } catch (error) {
      console.error("Fetch soil history error:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Weather API
  app.post("/api/weather", async (req, res) => {
    try {
      const { lat, lng } = req.body;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ message: "Valid latitude and longitude are required" });
      }

      // Dynamic import 
      const { getWeatherData } = await import("./services/weatherService.js");
      const data = await getWeatherData(lat, lng);

      if (!data) {
        return res.status(503).json({ message: "Weather service unavailable" });
      }
      res.json(data);
    } catch (error) {
      console.error("Weather API Error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

