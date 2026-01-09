"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/firebase.ts
var firebase_exports = {};
__export(firebase_exports, {
  api: () => api,
  db: () => db
});
module.exports = __toCommonJS(firebase_exports);
var import_firebase_functions = require("firebase-functions");
var admin = __toESM(require("firebase-admin"), 1);

// server/index.ts
var dotenv2 = __toESM(require("dotenv"), 1);
var import_express2 = __toESM(require("express"), 1);

// server/routes.ts
var import_http = require("http");

// server/openai.ts
var import_vertexai = require("@google-cloud/vertexai");
var dotenv = __toESM(require("dotenv"), 1);
dotenv.config();
var vertex_ai = new import_vertexai.VertexAI({
  project: "crop-doctor-56c07",
  location: "us-central1"
});
var model = "gemini-1.5-flash";
var generativeModel = vertex_ai.getGenerativeModel({
  model,
  generationConfig: {
    "maxOutputTokens": 8192,
    "temperature": 1,
    "topP": 0.95
  }
});
var cropDiseaseInfo = {
  potato: {
    diseases: ["Early Blight", "Late Blight", "Black Scurf", "Common Scab", "Healthy"],
    specialization: "potato pathology"
  },
  tomato: {
    diseases: ["Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot", "Spider Mites", "Target Spot", "Yellow Leaf Curl Virus", "Mosaic Virus", "Healthy"],
    specialization: "tomato diseases"
  },
  corn: {
    diseases: ["Common Rust", "Gray Leaf Spot", "Northern Leaf Blight", "Healthy"],
    specialization: "corn pathology"
  },
  wheat: {
    diseases: ["Leaf Rust", "Powdery Mildew", "Septoria", "Stripe Rust", "Healthy"],
    specialization: "cereal crop diseases"
  },
  rice: {
    diseases: ["Bacterial Leaf Blight", "Brown Spot", "Leaf Smut", "Blast", "Tungro", "Healthy"],
    specialization: "rice pathology"
  },
  jute: {
    diseases: ["Stem Rot", "Anthracnose", "Black Band", "Mosaic", "Healthy"],
    specialization: "fiber crop diseases"
  },
  sugarcane: {
    diseases: ["Red Rot", "Smut", "Wilt", "Grassy Shoot", "Healthy"],
    specialization: "sugarcane pathology"
  },
  tea: {
    diseases: ["Blister Blight", "Red Rust", "Grey Blight", "Black Rot", "Healthy"],
    specialization: "tea plantation diseases"
  },
  mustard: {
    diseases: ["Alternaria Blight", "White Rust", "Downy Mildew", "Powdery Mildew", "Healthy"],
    specialization: "oilseed crop diseases"
  },
  mango: {
    diseases: ["Anthracnose", "Powdery Mildew", "Die Back", "Phoma Blight", "Healthy"],
    specialization: "fruit tree pathology"
  },
  banana: {
    diseases: ["Panama Wilt", "Sigatoka", "Bunchy Top", "Anthracnose", "Healthy"],
    specialization: "banana diseases"
  },
  brinjal: {
    diseases: ["Phomopsis Blight", "Little Leaf", "Fruit Rot", "Wilt", "Healthy"],
    specialization: "vegetable pathology"
  },
  chili: {
    diseases: ["Anthracnose", "Leaf Curl", "Powdery Mildew", "Wilt", "Healthy"],
    specialization: "spice crop diseases"
  },
  onion: {
    diseases: ["Purple Blotch", "Downy Mildew", "Smut", "Neck Rot", "Healthy"],
    specialization: "bulb crop diseases"
  },
  garlic: {
    diseases: ["Purple Blotch", "Downy Mildew", "White Rot", "Rust", "Healthy"],
    specialization: "bulb crop diseases"
  },
  ginger: {
    diseases: ["Soft Rot", "Leaf Spot", "Bacterial Wilt", "Yellows", "Healthy"],
    specialization: "rhizome diseases"
  },
  turmeric: {
    diseases: ["Leaf Spot", "Leaf Blotch", "Rhizome Rot", "Taphrina Leaf Spot", "Healthy"],
    specialization: "rhizome diseases"
  },
  lentil: {
    diseases: ["Wilt", "Rust", "Blight", "Root Rot", "Healthy"],
    specialization: "pulse crop diseases"
  },
  watermelon: {
    diseases: ["Anthracnose", "Downy Mildew", "Powdery Mildew", "Fusarium Wilt", "Healthy"],
    specialization: "cucurbit diseases"
  },
  papaya: {
    diseases: ["Leaf Curl", "Ring Spot", "Anthracnose", "Powdery Mildew", "Healthy"],
    specialization: "fruit pathology"
  }
};
async function analyzeCropDisease(base64Image, cropType, language = "en") {
  try {
    const imageData = base64Image.includes("base64,") ? base64Image.split("base64,")[1] : base64Image;
    const cropInfo = cropDiseaseInfo[cropType];
    const diseaseList = cropInfo.diseases.map((disease) => `- ${disease}`).join("\n");
    const languageInstruction = language === "bn" ? "Provide all responses in Bengali (\u09AC\u09BE\u0982\u09B2\u09BE) language. All text fields including diseaseName, description, symptoms, and treatment must be in Bengali." : "Provide all responses in English language.";
    const prompt = `You are an expert agricultural pathologist specializing in ${cropInfo.specialization}. Analyze this ${cropType} plant image and identify diseases with high accuracy.

${languageInstruction}

Common ${cropType} diseases include:
${diseaseList}

Analyze the image and return a JSON object with the following structure:
{
  "diseaseName": "Name of the disease or 'Healthy'",
  "confidence": 0-100,
  "description": "Brief description of the condition",
  "symptoms": "Key visible symptoms",
  "treatment": "CURATIVE TREATMENT ONLY (how to treat AFTER disease appears): Provide detailed step-by-step instructions: Step 1) Remove infected parts. Step 2) Apply specific fungicides/pesticides (list product names with active ingredients like 'Mancozeb 75% WP at 2g/L' or 'Chlorothalonil'). Step 3) Spray schedule (how often, for how many weeks). Step 4) Dosage and application method. Step 5) Additional care during recovery. Focus ONLY on curing existing disease, NOT prevention."
}

Be specific and actionable. Provide exact product names, concentrations, and application schedules that farmers can use RIGHT NOW to cure this disease. If the image doesn't show a ${cropType} plant, indicate that clearly in ${language === "bn" ? "Bengali" : "English"}.`;
    const request = {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData
              }
            },
            {
              text: prompt
            }
          ]
        }
      ]
    };
    const result = await generativeModel.generateContent(request);
    const response = result.response;
    const content = response.candidates?.[0].content.parts[0].text || "{}";
    const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsedResult = JSON.parse(cleanContent);
    return {
      diseaseName: parsedResult.diseaseName || "Unknown Disease",
      confidence: Math.max(1, Math.min(100, Math.round(parsedResult.confidence || 75))),
      description: parsedResult.description || "Disease analysis completed",
      symptoms: parsedResult.symptoms || "Unable to determine specific symptoms",
      treatment: parsedResult.treatment || "Consult with a local agricultural expert for specific treatment recommendations"
    };
  } catch (error) {
    console.error(`Error analyzing ${cropType} disease:`, error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// shared/schema.ts
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_zod = require("drizzle-zod");
var import_zod = require("zod");
var detections = (0, import_pg_core.pgTable)("detections", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  cropType: (0, import_pg_core.text)("crop_type").notNull(),
  imageData: (0, import_pg_core.text)("image_data").notNull(),
  diseaseName: (0, import_pg_core.text)("disease_name").notNull(),
  confidence: (0, import_pg_core.integer)("confidence").notNull(),
  description: (0, import_pg_core.text)("description").notNull(),
  symptoms: (0, import_pg_core.text)("symptoms").notNull(),
  treatment: (0, import_pg_core.text)("treatment").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
});
var trainingData = (0, import_pg_core.pgTable)("training_data", {
  id: (0, import_pg_core.varchar)("id").primaryKey().default(import_drizzle_orm.sql`gen_random_uuid()`),
  imageData: (0, import_pg_core.text)("image_data").notNull(),
  diseaseName: (0, import_pg_core.text)("disease_name").notNull(),
  userNotes: (0, import_pg_core.text)("user_notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").notNull().defaultNow()
});
var insertDetectionSchema = (0, import_drizzle_zod.createInsertSchema)(detections).omit({
  id: true,
  createdAt: true
});
var insertTrainingDataSchema = (0, import_drizzle_zod.createInsertSchema)(trainingData).omit({
  id: true,
  createdAt: true
});
var userInfoSchema = import_zod.z.object({
  ip: import_zod.z.string().optional(),
  deviceInfo: import_zod.z.any().optional(),
  userAgent: import_zod.z.string().optional()
});

// server/routes.ts
var import_zod2 = require("zod");
var detectRequestSchema = import_zod2.z.object({
  imageData: import_zod2.z.string().min(1, "Image data is required"),
  cropType: import_zod2.z.enum(["potato", "tomato", "corn", "wheat", "rice", "jute", "sugarcane", "tea", "mustard", "mango", "banana", "brinjal", "chili", "onion", "garlic", "ginger", "turmeric", "lentil", "watermelon", "papaya"]).default("potato"),
  language: import_zod2.z.enum(["en", "bn"]).default("en")
});
async function registerRoutes(app2) {
  app2.post("/api/detect", async (req, res) => {
    try {
      const validatedRequest = detectRequestSchema.parse(req.body);
      const analysis = await analyzeCropDisease(
        validatedRequest.imageData,
        validatedRequest.cropType,
        validatedRequest.language
      );
      const detection = { ...analysis, id: "debug", createdAt: /* @__PURE__ */ new Date() };
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userIp = Array.isArray(ip) ? ip[0] : ip;
      res.json(detection);
    } catch (error) {
      if (error instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      const userIp = Array.isArray(ip) ? ip[0] : ip;
      console.error("Detection error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to analyze image"
      });
    }
  });
  app2.get("/api/detections", async (req, res) => {
    try {
      const detections2 = [];
      res.json(detections2);
    } catch (error) {
      console.error("Error fetching detections:", error);
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      res.status(500).json({ message: "Failed to fetch detections" });
    }
  });
  app2.post("/api/training", async (req, res) => {
    try {
      const validatedData = insertTrainingDataSchema.parse(req.body);
      const trainingData2 = {};
      res.json(trainingData2);
    } catch (error) {
      if (error instanceof import_zod2.z.ZodError) {
        return res.status(400).json({ message: "Invalid training data", errors: error.errors });
      }
      console.error("Training data submission error:", error);
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      res.status(500).json({ message: "Failed to submit training data" });
    }
  });
  app2.get("/api/training", async (req, res) => {
    try {
      const trainingData2 = [];
      res.json(trainingData2);
    } catch (error) {
      console.error("Error fetching training data:", error);
      res.status(500).json({ message: "Failed to fetch training data" });
    }
  });
  app2.post("/api/register", async (req, res) => {
    try {
      const userInfo = req.body;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      res.json({ success: true });
    } catch (error) {
      console.error("Registration error:", error);
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  const httpServer = (0, import_http.createServer)(app2);
  return httpServer;
}

// server/vite.ts
var import_express = __toESM(require("express"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_url2 = require("url");
var import_vite2 = require("vite");

// vite.config.ts
var import_vite = require("vite");
var import_plugin_react = __toESM(require("@vitejs/plugin-react"), 1);
var import_vite_plugin_pwa = require("vite-plugin-pwa");
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = (0, import_path.dirname)(__filename);
var vite_config_default = (0, import_vite.defineConfig)({
  plugins: [
    (0, import_plugin_react.default)(),
    (0, import_vite_plugin_pwa.VitePWA)({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "robots.txt"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
                // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: "Crop Doctor - AI Disease Identification",
        short_name: "CropDoctor",
        description: "AI-Powered Crop Disease Identification for farmers. Upload plant photos to detect diseases and get treatment recommendations.",
        theme_color: "#16a34a",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        categories: ["productivity", "agriculture", "utilities"],
        screenshots: []
      }
    })
  ],
  resolve: {
    alias: {
      "@": import_path.default.resolve(__dirname, "client", "src"),
      "@shared": import_path.default.resolve(__dirname, "shared")
    }
  },
  root: import_path.default.resolve(__dirname, "client"),
  build: {
    outDir: import_path.default.resolve(__dirname, "dist/client"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
var import_nanoid = require("nanoid");
var import_meta2 = {};
var __filename2 = (0, import_url2.fileURLToPath)(import_meta2.url);
var __dirname2 = (0, import_path2.dirname)(__filename2);
var viteLogger = (0, import_vite2.createLogger)();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await (0, import_vite2.createServer)({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = import_path2.default.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await import_fs.default.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${(0, import_nanoid.nanoid)()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = import_path2.default.resolve(__dirname2, "public");
  if (!import_fs.default.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(import_express.default.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(import_path2.default.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv2.config();
var app = (0, import_express2.default)();
app.use(import_express2.default.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(import_express2.default.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var setupApp = async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  return server;
};
var startServer = async () => {
  const server = await setupApp();
  const port = parseInt(process.env.PORT || "3000", 10);
  app.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
};
if (require.main === module) {
  startServer();
}

// server/firebase.ts
admin.initializeApp();
var db = admin.firestore();
setupApp();
var api = import_firebase_functions.https.onRequest(app);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  api,
  db
});
