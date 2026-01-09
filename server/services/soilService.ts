/**
 * Soil Fertility Service
 * 
 * Handles retrieving soil data and analyzing deficiencies.
 * Strategy:
 * 1. Try to connect to Google Earth Engine (GEE).
 * 2. If connected, fetch real data (pH, Organic Carbon).
 * 3. Use heuristic/mock models for NPK (since global NPK maps are rare/protected).
 * 4. If GEE fails (e.g. invalid key), fall back to full Mock data.
 */

console.log("Soil Service Loaded: v3.1 (With Solutions)");

interface NutrientDeficiency {
    nutrient: string;
    level: "Low" | "Optimal" | "High";
    value: number;
    unit: string;
    reason: string;
    solution: string; // New: Translation key for remedy
}

interface SoilData {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    moisture: number;
    organicMatter: number;
    sulfur: number;
    zinc: number;
    fertilityIndex: number;
    locationName?: string; // New: Area Name
    deficiencies: NutrientDeficiency[]; // Replaces recommendedCrops
}

// @ts-ignore
import ee from '@google/earthengine';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KEY_PATH = path.join(__dirname, 'private-key.json');

let geeInitialized = false;

// Attempt to initialize GEE
async function initGEE() {
    if (geeInitialized) return true;

    try {
        // 1. Try Environment Variable (Vercel Production)
        if (process.env.GOOGLE_PRIVATE_KEY) {
            try {
                const keyContent = JSON.parse(process.env.GOOGLE_PRIVATE_KEY);
                console.log("GEE: Found private key in environment variables.");
                return await authenticateGEE(keyContent);
            } catch (e) {
                console.error("GEE: Failed to parse GOOGLE_PRIVATE_KEY env var", e);
            }
        }

        // 2. Try Local File (Development)
        if (!fs.existsSync(KEY_PATH)) {
            console.warn("GEE: private-key.json not found. Using Mock Data.");
            return false;
        }

        const keyContent = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

        if (!keyContent.private_key && !keyContent.private_key_id) {
            console.warn("GEE: Key file appears to be OAuth Client Secret, not Service Account Key. GEE requires Service Account for server-side auth. Using Mock Data.");
            return false;
        }

        return await authenticateGEE(keyContent);
    } catch (error) {
        console.error("GEE: Setup error:", error);
        return false;
    }
}

async function authenticateGEE(keyContent: any): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        ee.data.authenticateViaPrivateKey(keyContent, () => {
            ee.initialize(null, null,
                () => {
                    console.log("GEE: Successfully initialized.");
                    geeInitialized = true;
                    resolve(true);
                },
                (err: any) => {
                    console.error("GEE: Initialization failed:", err);
                    resolve(false);
                }
            );
        }, (err: any) => {
            console.error("GEE: Authentication failed:", err);
            resolve(false);
        });
    });
}

// Generate deterministic mock data based on location
function getMockData(lat: number, lng: number): SoilData {
    // Round coordinates to ~1.1km precision (2 decimal places) to stabilize results against GPS drift
    const stableLat = parseFloat(lat.toFixed(2));
    const stableLng = parseFloat(lng.toFixed(2));

    const seed = Math.abs(stableLat * stableLng * 1000);
    const random = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    const nitrogen = 20 + Math.floor(random(1) * 60);
    const phosphorus = 10 + Math.floor(random(2) * 40);
    const potassium = 100 + Math.floor(random(3) * 200);

    const ph = parseFloat((5.5 + (random(4) * 2.5)).toFixed(1));
    const moisture = 20 + Math.floor(random(5) * 40);
    const organicMatter = parseFloat((1 + (random(6) * 4)).toFixed(1));

    const sulfur = parseFloat((10 + Math.floor(random(7) * 40)).toFixed(1));
    const zinc = parseFloat((0.5 + (random(8) * 4.5)).toFixed(2));

    return calculateIndex({
        nitrogen, phosphorus, potassium, ph, moisture, organicMatter, sulfur, zinc,
        fertilityIndex: 0,
        deficiencies: []
    });
}

function analyzeDeficiencies(data: SoilData): NutrientDeficiency[] {
    const analysis: NutrientDeficiency[] = [];

    // Helper to add findings
    const check = (name: string, val: number, low: number, high: number, unit: string, reasonTranslationKey: string, solutionPrefix: string) => {
        let level: "Low" | "Optimal" | "High" = "Optimal";
        let solution = "sol_Optimal";

        if (val < low) {
            level = "Low";
            solution = `${solutionPrefix}_Low`;
        }
        else if (val > high) {
            level = "High";
            solution = `${solutionPrefix}_High`;
        }

        analysis.push({
            nutrient: name,
            level: level,
            value: val,
            unit: unit,
            reason: reasonTranslationKey,
            solution: solution
        });
    };

    // Thresholds (Generic Agricultural Standards)
    check("Nitrogen (N)", data.nitrogen, 30, 60, "mg/kg", "reason_Nitrogen", "sol_Nitrogen");
    check("Phosphorus (P)", data.phosphorus, 15, 30, "mg/kg", "reason_Phosphorus", "sol_Phosphorus");
    check("Potassium (K)", data.potassium, 120, 200, "mg/kg", "reason_Potassium", "sol_Potassium");
    check("Sulfur (S)", data.sulfur, 15, 30, "ppm", "reason_Sulfur", "sol_Sulfur");
    check("Zinc (Zn)", data.zinc, 1.0, 3.0, "ppm", "reason_Zinc", "sol_Zinc");
    check("Organic Matter", data.organicMatter, 2, 4, "%", "reason_OrganicMatter", "sol_OrganicMatter");

    // pH is special
    let phLevel: "Low" | "Optimal" | "High" = "Optimal";
    let phSolution = "sol_Optimal";
    if (data.ph < 6.0) {
        phLevel = "Low";
        phSolution = "sol_pH_Low";
    }
    else if (data.ph > 7.5) {
        phLevel = "High";
        phSolution = "sol_pH_High";
    }

    analysis.push({
        nutrient: "pH Level",
        level: phLevel,
        value: data.ph,
        unit: "",
        reason: "reason_pH",
        solution: phSolution
    });

    return analysis;
}

function calculateIndex(data: SoilData): SoilData {
    let score = 0;
    // Simple Index Calculation
    if (data.nitrogen > 40) score += 20; else score += 10;
    if (data.phosphorus > 20) score += 20; else score += 10;
    if (data.potassium > 150) score += 20; else score += 10;
    if (data.ph >= 6.0 && data.ph <= 7.5) score += 20; else score += 10;
    if (data.organicMatter > 2) score += 20; else score += 10;

    data.fertilityIndex = score;
    data.deficiencies = analyzeDeficiencies(data); // Run analysis
    return data;
}

// Helper to get location name using OpenStreetMap Nominatim
async function getLocationName(lat: number, lng: number): Promise<string> {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`;
        console.log(`Geocoding URL: ${url}`); // Debug Log

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'CropDoctorAI/1.0 (contact@example.com)' // Required by Nominatim
            }
        });

        if (!response.ok) {
            console.error(`Geocoding Failed: ${response.status} ${response.statusText}`);
            return "Unknown Location";
        }

        const data = await response.json();
        console.log("Geocoding Raw Data:", JSON.stringify(data.address)); // Debug Log

        const addr = data.address || {};

        // Priority for "Upazila Only":
        let name = addr.county || addr.suburb || addr.town || addr.city || addr.village || data.name;

        if (name) {
            console.log(`Geocoding Resolved Name: ${name}`);
            return name;
        }

        return "Unknown Location";
    } catch (error) {
        console.error("Geocoding error details:", error);
        return "Unknown Location";
    }
}

export async function getSoilData(lat: number, lng: number): Promise<SoilData> {
    const useGee = await initGEE();

    if (useGee) {
        try {
            const point = ee.Geometry.Point([lng, lat]);

            const phImage = ee.Image("OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1a2a_M/v02").select('b0');
            const omImage = ee.Image("OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02").select('b0');
            const clayImage = ee.Image("OpenLandMap/SOL/SOL_CLAY-WF_USDA-3A1a1a_M/v02").select('b0');

            const result = await new Promise<any>((resolve, reject) => {
                const combined = phImage.addBands(omImage).addBands(clayImage);
                combined.reduceRegion({
                    reducer: ee.Reducer.mean(),
                    geometry: point,
                    scale: 250,
                    maxPixels: 1e9
                }).evaluate((data: any, error: any) => {
                    if (error) reject(error);
                    else resolve(data);
                });
            });

            if (result) {
                const phVal = (result.b0 || 60) / 10.0;
                const omVal = (result.b0_1 || 15) / 10.0;
                const clayVal = result.b0_2 || 20;
                const moistureVal = clayVal * 0.8 + 10;

                const mock = getMockData(lat, lng);

                return calculateIndex({
                    nitrogen: mock.nitrogen,
                    phosphorus: mock.phosphorus,
                    potassium: mock.potassium,
                    sulfur: mock.sulfur,
                    zinc: mock.zinc,
                    ph: parseFloat(phVal.toFixed(1)),
                    moisture: parseFloat(moistureVal.toFixed(1)),
                    organicMatter: parseFloat(omVal.toFixed(1)),
                    fertilityIndex: 0,
                    locationName: await getLocationName(lat, lng),
                    deficiencies: []
                });
            }

        } catch (err) {
            console.error("GEE: Data fetch error, falling back to mock", err);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockData = getMockData(lat, lng);

    // Add location name
    mockData.locationName = await getLocationName(lat, lng);

    return mockData;
}
