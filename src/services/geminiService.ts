import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateDailyAffirmation = async (mood?: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a powerful, uplifting daily affirmation for a woman seeking personal growth. ${mood ? `The current mood is ${mood}.` : ""} Keep it concise, empowering, and focused on inner strength.`,
  });
  return response.text;
};

export const getPersonalizedCoaching = async (goal: string, challenge: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `As a supportive personal growth coach for women, provide a short, actionable piece of advice for someone whose goal is "${goal}" but is currently facing the challenge: "${challenge}". Be encouraging and professional.`,
  });
  return response.text;
};

export const getSelfDiscoveryQuiz = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a 3-question personality quiz to help a woman discover her core strengths. Return as JSON.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      trait: { type: Type.STRING }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
