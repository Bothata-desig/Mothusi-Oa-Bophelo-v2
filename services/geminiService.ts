import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MedicalAnalysis, SeverityLevel } from "../types";

// Helper to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g. "data:audio/wav;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcription: {
      type: Type.STRING,
      description: "The verbatim transcription of the user's Sesotho speech.",
    },
    possible_condition: {
      type: Type.STRING,
      description: "The potential medical condition based on symptoms, written in Sesotho.",
    },
    severity: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High", "Critical"],
      description: "The estimated severity of the condition.",
    },
    self_care_advice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: " actionable self-care steps the patient can take, written in Sesotho.",
    },
    red_flags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Critical symptoms that indicate the patient needs immediate help, in Sesotho.",
    },
    doctor_recommendation: {
      type: Type.STRING,
      description: "Advice on when or if to see a doctor, written in Sesotho.",
    },
  },
  required: ["transcription", "possible_condition", "severity", "self_care_advice", "red_flags", "doctor_recommendation"],
};

export const analyzeSymptoms = async (audioBlob: Blob): Promise<MedicalAnalysis> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Convert audio blob to base64
  const base64Audio = await blobToBase64(audioBlob);

  const model = "gemini-2.5-flash"; // Efficient for audio processing

  const systemInstruction = `
    You are a helpful, empathetic medical assistant for Sesotho-speaking communities.
    Your goal is to listen to the patient's symptoms in Sesotho, transcribe them, and provide safety guidance.
    
    IMPORTANT GUIDELINES:
    1. DO NOT provide a definitive diagnosis. Use language like "Possible condition" or "It might be".
    2. The input will be an audio file of a person speaking Sesotho.
    3. The OUTPUT fields (transcription, advice, etc.) MUST be in SESOTHO.
    4. Severity level is an English enum key, but all descriptive text must be Sesotho.
    5. Be culturally sensitive and clear. Use simple medical terms.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: audioBlob.type || "audio/webm",
              data: base64Audio,
            },
          },
          {
            text: "Please analyze these symptoms spoken in Sesotho.",
          },
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more consistent medical advice
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from AI.");
    }

    return JSON.parse(resultText) as MedicalAnalysis;

  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw error;
  }
};