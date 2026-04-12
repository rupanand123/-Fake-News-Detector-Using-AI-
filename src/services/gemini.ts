import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Verdict } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeNews(input: { text?: string; url?: string; imageBase64?: string }): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are Truth Lens, a world-class AI Fact Checker. 
    Your goal is to analyze news content and determine its authenticity.
    
    Analyze the provided content (text, URL, or image) and return a structured JSON response.
    Use Google Search grounding to verify facts against reliable sources.
    
    The response MUST follow this schema:
    {
      "title": "A concise title for the news item",
      "verdict": "REAL" | "FAKE" | "PARTIALLY TRUE",
      "confidence": number (0-100),
      "explanation": "Detailed explanation of why this verdict was reached, highlighting suspicious parts",
      "factSummary": "A brief summary of the actual facts",
      "sourceScore": number (0-100, reliability of the source)
    }
  `;

  const prompt = `
    Analyze the following news content:
    ${input.text ? `Text: ${input.text}` : ""}
    ${input.url ? `URL: ${input.url}` : ""}
    ${input.imageBase64 ? "Image provided as base64." : ""}
  `;

  const contents: any[] = [{ text: prompt }];
  if (input.imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: input.imageBase64,
      },
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents.map(c => typeof c === 'string' ? { text: c } : c) },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            verdict: { type: Type.STRING, enum: ["REAL", "FAKE", "PARTIALLY TRUE"] },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            factSummary: { type: Type.STRING },
            sourceScore: { type: Type.NUMBER },
          },
          required: ["title", "verdict", "confidence", "explanation", "factSummary", "sourceScore"],
        },
        tools: [{ googleSearch: {} }],
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      ...result,
      ...input,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze news. Please try again.");
  }
}
