
import { toast } from "sonner";

// API key for Runware (should be moved to environment variables in production)
const API_KEY = 'tHFg5w2lpN03QhV6mIgbVWL29fvStLF3';
const API_ENDPOINT = "https://api.runware.ai/v1";

export interface GenerateImageParams {
  positivePrompt: string;
  model?: string;
  numberResults?: number;
  outputFormat?: string;
  CFGScale?: number;
}

export interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed: number;
  NSFWContent: boolean;
}

export const generateImage = async (params: GenerateImageParams): Promise<GeneratedImage | null> => {
  try {
    const payload = [
      {
        taskType: "authentication",
        apiKey: API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: params.positivePrompt,
        model: params.model || "runware:100@1",
        width: 1024,
        height: 1024,
        numberResults: params.numberResults || 1,
        outputFormat: params.outputFormat || "WEBP",
        CFGScale: params.CFGScale || 1,
        scheduler: "FlowMatchEulerDiscreteScheduler",
        strength: 0.8,
      }
    ];

    console.log("Sending request to Runware API:", JSON.stringify(payload));

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Error response from Runware: ${response.status}`, errorData);
      throw new Error(`Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log("Received response from Runware:", data);
    
    if (data.data && data.data.length > 0) {
      const imageData = data.data.find(
        (item: any) => item.taskType === "imageInference"
      );
      
      if (imageData && imageData.imageURL) {
        return {
          imageURL: imageData.imageURL,
          positivePrompt: imageData.positivePrompt || params.positivePrompt,
          seed: imageData.seed || 0,
          NSFWContent: imageData.NSFWContent || false
        };
      } else {
        console.error("No image URL found in response:", imageData);
        throw new Error('No image URL received from Runware API');
      }
    }
    
    throw new Error('No image data received from Runware API');
  } catch (error) {
    console.error('Error generating image:', error);
    toast.error('Error generating image. Please try again.');
    return null;
  }
};
