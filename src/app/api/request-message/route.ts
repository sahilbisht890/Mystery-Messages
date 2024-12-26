import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const editPrompt = `Suggest alternative ways to phrase in a paragraph , just give me the paragraph: ${prompt}`
    const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(editPrompt);
    console.log(result.response.text());

    return Response.json(
      {
        success: true,
        message: "text is generated",
        generatedText : result.response.text()
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while generating the prompt", error);
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
