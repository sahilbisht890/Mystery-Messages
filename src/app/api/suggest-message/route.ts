import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "AI_API_KEY is not configured",
        },
        { status: 500 }
      );
    }

    const prompt = `
Create a list of three open-ended and engaging questions.
Return them as a single string separated strictly by "||".
Avoid sensitive topics. Keep it friendly and universal.
Example format:
Question one?||Question two?||Question three?
`;

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const data = text.split("||").map((q) => q.trim());

    return Response.json(
      {
        success: true,
        message: "Text generated successfully",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gemini generation error:", error);

    return Response.json(
      {
        success: false,
        message: "AI generation failed",
      },
      { status: 500 }
    );
  }
}