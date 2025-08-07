
import { GoogleGenAI, Type } from "@google/genai";
import type { AIShape, ShapeType } from "../types";

// Ensure the API key is available in the environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const shapeSchema = {
  type: Type.OBJECT,
  properties: {
    shape: {
      type: Type.STRING,
      description: "The geometric shape to create.",
      enum: ['cube', 'sphere', 'cone', 'torus', 'cylinder'],
    },
    color: {
      type: Type.STRING,
      description: "A CSS-compatible hex color code for the shape, like '#ff00ff'.",
    },
    scale: {
      type: Type.ARRAY,
      description: "An array of 3 numbers for X, Y, Z scale. Values should be between 0.1 and 2.",
      items: { type: Type.NUMBER },
      minItems: 3,
      maxItems: 3,
    },
    description: {
      type: Type.STRING,
      description: "A short, creative, one-sentence description of the generated object."
    }
  },
  required: ['shape', 'color', 'scale', 'description'],
};

export async function generateShapeFromPrompt(prompt: string): Promise<{ shapeData: AIShape; description: string } | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following user prompt and generate a single 3D object based on it. Adhere strictly to the provided JSON schema. Prompt: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: shapeSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Received an empty response from the AI.");
    }
    
    const parsedJson = JSON.parse(jsonText);

    // Validate the parsed data
    const shapeData: AIShape = {
        shape: parsedJson.shape as ShapeType,
        color: parsedJson.color,
        scale: parsedJson.scale as [number, number, number]
    };

    const description: string = parsedJson.description;

    if (!shapeData.shape || !shapeData.color || !shapeData.scale || !description) {
        throw new Error("AI response is missing required fields.");
    }

    return { shapeData, description };
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}
