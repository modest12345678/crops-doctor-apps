import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Using Gemini API for crop disease detection
// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DiseaseAnalysis {
  diseaseName: string;
  confidence: number;
  description: string;
  symptoms: string;
  treatment: string;
}

export type CropType = "potato" | "tomato" | "corn" | "wheat" | "rice";

const cropDiseaseInfo: Record<CropType, { diseases: string[]; specialization: string }> = {
  potato: {
    specialization: "potato diseases",
    diseases: [
      "Late Blight (Phytophthora infestans)",
      "Early Blight (Alternaria solani)",
      "Potato Virus Y (PVY)",
      "Blackleg (Erwinia)",
      "Common Scab (Streptomyces scabies)",
      "Potato Leafroll Virus (PLRV)",
      "Fusarium Dry Rot",
      "Healthy Plant"
    ]
  },
  tomato: {
    specialization: "tomato diseases",
    diseases: [
      "Early Blight (Alternaria solani)",
      "Late Blight (Phytophthora infestans)",
      "Tomato Mosaic Virus (ToMV)",
      "Bacterial Spot (Xanthomonas)",
      "Fusarium Wilt (Fusarium oxysporum)",
      "Verticillium Wilt",
      "Septoria Leaf Spot",
      "Powdery Mildew",
      "Blossom End Rot",
      "Healthy Plant"
    ]
  },
  corn: {
    specialization: "corn/maize diseases",
    diseases: [
      "Northern Corn Leaf Blight (Exserohilum turcicum)",
      "Gray Leaf Spot (Cercospora zeae-maydis)",
      "Common Rust (Puccinia sorghi)",
      "Southern Rust (Puccinia polysora)",
      "Corn Smut (Ustilago maydis)",
      "Stewart's Wilt (Pantoea stewartii)",
      "Anthracnose (Colletotrichum graminicola)",
      "Healthy Plant"
    ]
  },
  wheat: {
    specialization: "wheat diseases",
    diseases: [
      "Leaf Rust (Puccinia triticina)",
      "Stem Rust (Puccinia graminis)",
      "Stripe Rust (Puccinia striiformis)",
      "Powdery Mildew (Blumeria graminis)",
      "Fusarium Head Blight (Fusarium graminearum)",
      "Septoria Leaf Blotch (Zymoseptoria tritici)",
      "Tan Spot (Pyrenophora tritici-repentis)",
      "Healthy Plant"
    ]
  },
  rice: {
    specialization: "rice diseases",
    diseases: [
      "Rice Blast (Magnaporthe oryzae)",
      "Bacterial Leaf Blight (Xanthomonas oryzae)",
      "Sheath Blight (Rhizoctonia solani)",
      "Brown Spot (Bipolaris oryzae)",
      "Bacterial Leaf Streak (Xanthomonas oryzae)",
      "False Smut (Ustilaginoidea virens)",
      "Tungro Virus",
      "Healthy Plant"
    ]
  }
};

export async function analyzeCropDisease(base64Image: string, cropType: CropType): Promise<DiseaseAnalysis> {
  try {
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const cropInfo = cropDiseaseInfo[cropType];
    const diseaseList = cropInfo.diseases.map(disease => `- ${disease}`).join('\n');

    const systemPrompt = `You are an expert agricultural pathologist specializing in ${cropInfo.specialization}. Analyze ${cropType} plant images and identify diseases with high accuracy. 

Common ${cropType} diseases include:
${diseaseList}

Provide analysis in JSON format with these fields:
- diseaseName: The specific disease identified or "Healthy Plant"
- confidence: Confidence level 1-100
- description: Brief description of the disease
- symptoms: Observable symptoms in the image
- treatment: Recommended treatment or management practices

Be thorough and accurate. If the image doesn't show a ${cropType} plant, indicate that clearly.`;

    const contents = [
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg",
        },
      },
      `Analyze this ${cropType} plant image and identify any diseases present. Provide detailed information about symptoms and treatment recommendations.`,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            diseaseName: { type: "string" },
            confidence: { type: "number" },
            description: { type: "string" },
            symptoms: { type: "string" },
            treatment: { type: "string" },
          },
          required: ["diseaseName", "confidence", "description", "symptoms", "treatment"],
        },
      },
      contents: contents,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const result: DiseaseAnalysis = JSON.parse(rawJson);

    return {
      diseaseName: result.diseaseName || "Unknown Disease",
      confidence: Math.max(1, Math.min(100, Math.round(result.confidence || 75))),
      description: result.description || "Disease analysis completed",
      symptoms: result.symptoms || "Unable to determine specific symptoms",
      treatment: result.treatment || "Consult with a local agricultural expert for specific treatment recommendations",
    };
  } catch (error) {
    console.error(`Error analyzing ${cropType} disease:`, error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzePotatoDisease(base64Image: string): Promise<DiseaseAnalysis> {
  return analyzeCropDisease(base64Image, "potato");
}
