
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this environment, we assume it's always available.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });
const model = "gemini-2.5-flash";

interface ImagePart {
    mimeType: string;
    data: string;
}

export const generateAiResponse = async (
    prompt: string, 
    imagePart?: ImagePart
): Promise<string> => {
    try {
        const contents = imagePart 
            ? { parts: [{ text: prompt }, { inlineData: imagePart }] }
            : prompt;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents,
        });

        const text = response.text;
        if (text) {
            return text;
        } else {
            return "I couldn't generate a response. Please try again.";
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        return "An error occurred while contacting the AI. Please check the console for details.";
    }
};
