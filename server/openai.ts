import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert agricultural pathologist specializing in potato diseases. Analyze potato plant images and identify diseases with high accuracy. 
          
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

Be thorough and accurate. If the image doesn't show a potato plant, indicate that clearly.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this potato plant image and identify any diseases present. Provide detailed information about symptoms and treatment recommendations.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

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
