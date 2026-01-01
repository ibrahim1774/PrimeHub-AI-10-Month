
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "../constants";
import { GeneratedSiteData, GeneratorInputs } from "../types";

/**
 * Utility to strip markdown code blocks from AI response text
 */
const cleanJsonResponse = (text: string): string => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const generateSiteContent = async (inputs: GeneratorInputs): Promise<GeneratedSiteData> => {
  // Always create a new instance right before usage to get the latest environment state
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textPrompt = SYSTEM_PROMPT
    .replace("{industry}", inputs.industry)
    .replace("{companyName}", inputs.companyName)
    .replace("{location}", inputs.location)
    .replace("{phone}", inputs.phone);

  try {
    // 1. Generate Text Content
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA as any,
      },
    });

    const rawText = textResponse.text || "{}";
    const cleanedText = cleanJsonResponse(rawText);
    const siteData: Partial<GeneratedSiteData> = JSON.parse(cleanedText);

    // 2. Prepare Image Prompts
    const imagePromptHero = `Candid high-end professional photography of ${inputs.industry} technicians working at a job site in ${inputs.location}. Cinematic lighting, natural environment, 8k resolution. No text.`;
    const imagePromptValue = `Authentic photo showing the high quality results of professional ${inputs.industry} work in a residential setting in ${inputs.location}. Natural lighting. No text.`;
    const imagePromptAbout = `A professional ${inputs.industry} contractor or a clean service vehicle in a ${inputs.location} residential area. Friendly and local vibe. No text.`;
    const imagePromptRepair = `A realistic photo of a professional technician performing detailed ${inputs.industry} repairs. Authentic work environment, high quality focus. No text.`;

    // 3. Generate Images in Parallel
    const [heroImgRes, valueImgRes, aboutImgRes, repairImgRes] = await Promise.all([
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePromptHero }] },
      }),
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePromptValue }] },
      }),
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePromptAbout }] },
      }),
      ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePromptRepair }] },
      })
    ]);

    const extractImage = (response: any) => {
      try {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      } catch (e) {
        console.warn("Failed to extract image, using fallback", e);
      }
      return `https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1200`;
    };

    // 4. Combine and Sanitize
    if (!siteData.hero) siteData.hero = {} as any;
    if (!siteData.contact) siteData.contact = {} as any;
    if (!siteData.aboutUs) siteData.aboutUs = {} as any;
    if (!siteData.repairBenefits) siteData.repairBenefits = {} as any;

    siteData.hero.heroImage = extractImage(heroImgRes);
    siteData.aboutUs.image = extractImage(aboutImgRes);
    siteData.repairBenefits.image = extractImage(repairImgRes);
    
    if (siteData.industryValue) {
      siteData.industryValue.valueImage = extractImage(valueImgRes);
    }

    siteData.contact.phone = inputs.phone;
    siteData.contact.location = inputs.location;
    siteData.contact.companyName = inputs.companyName;

    return siteData as GeneratedSiteData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Propagate a clean error message if it's a model issue
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("Model not found or API key restricted. Please ensure your API key is correctly configured.");
    }
    throw error;
  }
};
