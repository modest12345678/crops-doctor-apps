import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini client
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is not set in environment variables");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// Helper to get the model
function getModel(modelName: string = "gemini-1.5-flash-002") {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: modelName });
}

export interface DiseaseAnalysis {
  diseaseName: string;
  confidence: number;
  description: string;
  symptoms: string;
  treatment: string[];
}

export type CropType = "potato" | "tomato" | "corn" | "wheat" | "rice" | "jute" | "sugarcane" | "tea" | "mustard" | "mango" | "banana" | "brinjal" | "chili" | "onion" | "garlic" | "ginger" | "turmeric" | "lentil" | "watermelon" | "papaya";

const cropDiseaseInfo: Record<CropType, { diseases: string[]; specialization: string }> = {
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

export async function analyzeCropDisease(
  base64Image: string,
  cropType: CropType,
  language: "en" | "bn" = "en"
): Promise<DiseaseAnalysis> {
  try {
    const model = getModel("gemini-1.5-flash-002");

    const cropInfo = cropDiseaseInfo[cropType];
    const diseaseList = cropInfo.diseases.map(disease => `- ${disease}`).join('\n');

    const languageInstruction = language === "bn"
      ? "Provide all responses in Bengali (বাংলা) language. Use very natural, fluent, and encouraging farmer-friendly language."
      : "Provide all responses in English language. Use very natural, fluent, and encouraging farmer-friendly language.";

    const prompt = `You are an expert agricultural pathologist specializing in ${cropInfo.specialization}. 
    
${languageInstruction}

A farmer has uploaded an image of their ${cropType} plant and suspects it may have a disease.
(Note: Using image description capability currently, assuming image context is 'potentially diseased plant')

Common ${cropType} diseases include:
${diseaseList}

Based on your expertise, provide a general analysis for ${cropType} plants in JSON format:
{
  "diseaseName": "Most common disease for ${cropType} or 'Healthy'",
  "confidence": 70,
  "description": "Brief, simple description of the issue.",
  "symptoms": "Key visible symptoms to look for.",
  "treatment": [
    "Step 1: Preparation - Remove infected parts...",
    "Step 2: Medicine Selection - Use [Product Name]...",
    "Step 3: How to Apply - Mix Xg in Y liters of water. Spray thoroughly on...",
    "Step 4: Schedule - Apply every 7 days for..."
  ]
}

IMPORTANT:
- Be very descriptive, fluent, and farmer-friendly.
- EXPLICITLY explain "How to Apply" (Application Method) as a distinct step.
- Return 'treatment' as an ARRAY of strings, where each string is a detailed paragraph/step.
- Ensure the language is natural and easy for a farmer to understand.`;

    // Note: To truly use the image, we would convert base64 to a GenerativePart.
    // However, the original code commented "Groq doesn't support vision models".
    // Gemini supports vision! Let's strip the data URI prefix if present and send the image.
    // If base64Image is a pure string or data URL.

    const parts: any[] = [{ text: prompt }];

    // Simple heuristic to check if it's a data URL or raw base64
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    if (base64Data) {
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const response = result.response;
    const text = response.text();

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("Failed to parse AI response");
    }

    // Ensure treatment is an array
    const treatmentArray = Array.isArray(parsedResult.treatment)
      ? parsedResult.treatment
      : [parsedResult.treatment || "Consult an expert."];

    return {
      diseaseName: parsedResult.diseaseName || "Unknown Disease",
      confidence: Math.max(1, Math.min(100, Math.round(parsedResult.confidence || 70))),
      description: parsedResult.description || "Disease analysis completed",
      symptoms: parsedResult.symptoms || "Unable to determine specific symptoms",
      treatment: treatmentArray,
    };
  } catch (error: any) {
    console.error(`Error analyzing ${cropType} disease:`, error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzePotatoDisease(base64Image: string): Promise<DiseaseAnalysis> {
  return analyzeCropDisease(base64Image, "potato");
}

export async function chatWithAI(message: string, language: "en" | "bn" = "en"): Promise<{ response: string }> {
  try {
    const model = getModel("gemini-1.5-flash-002");

    const languageInstruction = language === "bn"
      ? "The user's interface is in Bengali. You MUST reply in Bengali (বাংলা) unless explicitly asked to speak English."
      : "The user's interface is in English. However, if the user asks a question in Bengali (or asks to speak in Bengali), you MUST switch to Bengali immediately and reply in Bengali. Do not refuse to speak Bengali.";

    const prompt = `You are 'Crop Doctor AI', an expert agricultural consultant fluent in both English and Bengali (Bangla).
${languageInstruction}

Your goal is to help farmers with their questions about crops, farming techniques, pest control, and general agricultural advice.

IMPORTANT:
- You are fully capable of speaking Bengali (Bangla). NEVER say you cannot speak Bangla.
- If the user writes in Bengali, reply in Bengali.
- If the user writes in English, reply in English.
- If the user asks if you can speak Bengali, say YES in Bengali.
- Keep responses helpful, accurate, and farmer-friendly.

User Question: ${message}

Provide a helpful, accurate, and concise response. 
- If the question is about agriculture, farming, crops, or pests, answer it.
- If the question is about your language capabilities (e.g., "Can you speak Bangla?"), answer it affirmatively in that language.
- Only decline if the question is completely unrelated to agriculture OR your capabilities (e.g., "Who is the president?", "Write code").`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return { response: text || "I apologize, but I couldn't generate a response at this time." };
  } catch (error: any) {
    console.error("Error in chatWithAI:", error);
    throw new Error(`Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export interface FertilizerRecommendation {
  cropName: string;
  area: number;
  unit: string;
  recommendations: string[];
  organicOptions: string[];
  perUnitList: string[];
}

// Helper function to convert English numbers to Bengali
function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)]);
}

// Helper function to convert Bengali numbers to English
function toEnglishNumber(text: string): string {
  const bengaliToEnglish: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  return text.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit]);
}

// Helper function to format fertilizer text (convert numbers to Bengali)
function formatFertilizerText(content: string | string[], language: "en" | "bn"): string | string[] {
  const processText = (text: string) => {
    // Match patterns like "50 kg", "৫০ কেজি", "50kg", "2000.50 kg"
    const pattern = /([\d০-৯]+(?:[.\.][\d০-৯]+)?)\s*(kg|কেজি|কিলোগ্রাম)/gi;

    return text.replace(pattern, (match, amount, unit) => {
      // Just ensure the number is in the correct language format
      const englishAmount = toEnglishNumber(amount);
      const displayAmount = language === "bn" ? toBengaliNumber(englishAmount) : englishAmount;
      return `${displayAmount} ${unit}`;
    });
  };

  if (Array.isArray(content)) {
    return content.map(processText);
  }
  return processText(content);
}

export async function calculateFertilizer(
  cropType: CropType,
  area: number,
  unit: "acre" | "bigha",
  language: "en" | "bn" = "en"
): Promise<FertilizerRecommendation> {
  try {
    const model = getModel("gemini-1.5-flash-002");

    // Convert bigha to acres for consistency (1 bigha ≈ 0.33 acres)
    const areaInAcres = unit === "bigha" ? area * 0.33 : area;

    const cropInfo = cropDiseaseInfo[cropType];
    const languageInstruction = language === "bn"
      ? "Provide all responses in Bengali (বাংলা) language. Use very natural, fluent, and encouraging farmer-friendly language."
      : "Provide all responses in English language. Use very natural, fluent, and encouraging farmer-friendly language.";

    const prompt = `You are an expert agricultural consultant specializing in ${cropInfo.specialization} in Bangladesh.

${languageInstruction}

The farmer wants to cultivate ${cropType} on ${area} ${unit} (approximately ${areaInAcres.toFixed(2)} acres).

CRITICAL INSTRUCTION: Provide TOTAL amounts for the ENTIRE ${area} ${unit} area directly. Do NOT provide per-unit amounts in the recommendations.
For example, if the recommendation is 50 kg Urea per acre for 2 acres, state "100 kg Urea", not "50 kg Urea per acre".

Provide JSON with:
{
  "cropName": "crop name in specified language",
  "area": ${area},
  "unit": "${unit}",
  "recommendations": [
    "Step 1: Land Preparation (Day 0) - Apply X kg Urea, Y kg TSP... Mix well with soil during final ploughing.",
    "Step 2: First Top Dressing (Day 15-20) - Apply X kg Urea... Apply when soil has moisture.",
    "Step 3: Second Top Dressing (Day 35-40)..."
  ],
  "organicOptions": [
    "Cow Dung: Apply X kg during land preparation...",
    "Compost: Apply Y kg..."
  ],
  "perUnitList": [
    "Urea: X kg per ${unit}",
    "TSP: Y kg per ${unit}",
    "MoP: Z kg per ${unit}"
  ]
}

IMPORTANT:
- MERGE the application schedule INTO the recommendations steps. Do not create a separate schedule section.
- Each recommendation step MUST include the TIMING (e.g., "Day 0", "Day 20").
- Be very descriptive, fluent, and helpful. Explain WHY and HOW to apply in a way a farmer would understand easily.
- All fertilizer amounts in the "recommendations" and "organicOptions" must be the TOTAL amount for the specified ${area} ${unit} area.
- "perUnitList" should contain the STANDARD rate per 1 ${unit} for reference.
- Return arrays for recommendations, organicOptions, and perUnitList.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    });

    const response = result.response;
    const text = response.text();

    let parsedResult: any;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Failed to parse content:", text);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Convert area to Bengali if language is Bengali
    const displayArea = language === "bn" ? toBengaliNumber(area) : area;

    // Format numbers in the response
    const processedRecommendations = formatFertilizerText(
      parsedResult.recommendations || [],
      language
    );

    const processedOrganicOptions = formatFertilizerText(
      parsedResult.organicOptions || [],
      language
    );

    const processedPerUnitList = formatFertilizerText(
      parsedResult.perUnitList || [],
      language
    );

    // Ensure arrays
    const toArray = (val: string | string[]) => Array.isArray(val) ? val : [val];

    return {
      cropName: parsedResult.cropName || cropType,
      area: displayArea as any,
      unit: unit,
      recommendations: toArray(processedRecommendations),
      organicOptions: toArray(processedOrganicOptions),
      perUnitList: toArray(processedPerUnitList)
    };
  } catch (error: any) {
    console.error(`Error calculating fertilizer for ${cropType}:`, error);
    throw new Error(`Failed to calculate fertilizer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
