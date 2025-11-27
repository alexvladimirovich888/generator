import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a pixel art asset based on the provided prompt using gemini-2.5-flash-image.
 */
export const generatePixelAsset = async (prompt: string): Promise<string> => {
  try {
    // We append specific style instructions to ensure the pixel art look
    const enhancedPrompt = `${prompt}. 
    Style: High-quality 16-bit or 32-bit pixel art game asset. 
    View: Front facing. 
    Background: Solid white background (easy to remove). 
    Details: Crisp edges, vibrant colors.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: enhancedPrompt,
          },
        ],
      },
      // Note: responseMimeType and responseSchema are NOT supported for image models.
      // We rely on the default output which includes the image blob.
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated from Gemini.");
    }

    let imageUrl = '';

    for (const part of parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        // MimeType is usually image/png or image/jpeg from the API
        const mimeType = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
        break; // Found the image, stop looking
      }
    }

    if (!imageUrl) {
      throw new Error("No image data found in the response.");
    }

    return imageUrl;

  } catch (error) {
    console.error("Error generating asset:", error);
    throw error;
  }
};