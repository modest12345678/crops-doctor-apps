import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzePotatoDisease } from "./openai";
import { insertDetectionSchema, insertTrainingDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Disease detection endpoint
  app.post("/api/detect", async (req, res) => {
    try {
      const { imageData } = req.body;

      if (!imageData) {
        return res.status(400).json({ message: "Image data is required" });
      }

      // Analyze image using OpenAI Vision API
      const analysis = await analyzePotatoDisease(imageData);

      // Store detection result
      const detection = await storage.createDetection({
        imageData,
        diseaseName: analysis.diseaseName,
        confidence: analysis.confidence,
        description: analysis.description,
        symptoms: analysis.symptoms,
        treatment: analysis.treatment,
      });

      res.json(detection);
    } catch (error) {
      console.error("Detection error:", error);
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

  const httpServer = createServer(app);
  return httpServer;
}
