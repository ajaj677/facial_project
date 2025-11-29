import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    skinTone: { type: Type.STRING, description: "Description of the skin tone (e.g., Fair, Medium, Deep)" },
    undertone: { type: Type.STRING, description: "The undertone (Cool, Warm, Neutral, Olive)" },
    skinTexture: { type: Type.STRING, description: "Brief analysis of skin texture or type" },
    foundations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          productName: { type: Type.STRING },
          shade: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    concealers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          productName: { type: Type.STRING },
          shade: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    blushes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          productName: { type: Type.STRING },
          shade: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    },
    lipsticks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          brand: { type: Type.STRING },
          productName: { type: Type.STRING },
          shade: { type: Type.STRING },
          reason: { type: Type.STRING }
        }
      }
    }
  },
  required: ["skinTone", "undertone", "foundations", "blushes"]
};

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Analyze this selfie for makeup recommendations. Identify the skin tone, undertone, and texture. Recommend 3 foundations (mix of high-end and drugstore), 2 concealers, 2 blushes, and 2 lipsticks that would perfectly match this specific skin tone and undertone. Focus on realistic, popular products."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Keep it relatively deterministic but creative enough for descriptions
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
