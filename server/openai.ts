import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Using Gemini API for potato disease detection
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

export async function analyzePotatoDisease(base64Image: string): Promise<DiseaseAnalysis> {
  try {
    // Remove data URL prefix if present
    const imageData = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    const systemPrompt = `You are an expert agricultural pathologist specializing in potato diseases. Analyze potato plant images and identify diseases with high accuracy. 

Common potato diseases include:
- Late Blight (Phytophthora infestans)
- Early Blight (Alternaria solani)
- Potato Virus Y (PVY)
- Blackleg (Erwinia)
- Common Scab (Streptomyces scabies)
- Potato Leafroll Virus (PLRV)
- Fusarium Dry Rot
- Healthy Plant

Provide analysis in JSON format with these fields:
- diseaseName: The specific disease identified or "Healthy Plant"
- confidence: Confidence level 1-100
- description: Brief description of the disease
- symptoms: Observable symptoms in the image
- treatment: Recommended treatment or management practices

Be thorough and accurate. If the image doesn't show a potato plant, indicate that clearly.`;

    const contents = [
      {
        inlineData: {
          data: imageData,
          mimeType: "image/jpeg",
        },
      },
      "Analyze this potato plant image and identify any diseases present. Provide detailed information about symptoms and treatment recommendations.",
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
    console.error("Error analyzing potato disease:", error);
    throw new Error(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
