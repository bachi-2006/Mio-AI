
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

export type GeminiMode = 'chat' | 'code' | 'voice' | 'translate';

// Initialize the Google Generative AI model
const GEMINI_API_KEY = "AIzaSyBgl-L1XzFr62P4L_XYAn1qcSVPhOoV-ms";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Define the model to use
const MODEL_NAME = "gemini-1.5-flash";

export const sendMessageToGemini = async (message: string, mode: GeminiMode): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    // Prepare the prompt based on the mode
    let prompt = message;
    if (mode === 'code') {
      prompt = `As a code expert, help with: ${message}. Provide code examples and explanations.`;
    } else if (mode === 'voice') {
      prompt = `Respond conversationally: ${message}. Keep it concise and natural.`;
    } else if (mode === 'translate') {
      prompt = `Translate: ${message}. Use English for non-English text, or an appropriate language for English text.`;
    }
    
    // Generate content using the correct API format
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    toast.error("Failed to get response from the AI assistant.");
    return "I'm sorry, I couldn't process your request right now. Please try again later.";
  }
};
