import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error(
      "Missing gemini api key, define GEMINI_API_KEY in your .env",
    );
  }

  try {
    const payload = await req.json();
    const { gender, age, ocassion, region, city, country } = payload;

    if (!gender || !age || !ocassion || !region || !city || !country) {
      return NextResponse.json(
        {
          error: "Missing required fields for generating outfit prompt",
        },
        { status: 400 },
      );
    }
    const prompt = `
      imagine yourself as an expert fashion designer and a prompt engineer   
      location: ${region}, ${city}, ${country}
      user's prompt: ${ocassion}
      gender: ${gender}
      age: ${age}
      generate an **outfit prompt** for flux AI based on the above features provided  
      "there should be only one person in the image with fullbody and ONLY Return the outfit prompt"
    `;
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const outfitPrompt = result.response.text();

    return NextResponse.json({ outfitPrompt });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
