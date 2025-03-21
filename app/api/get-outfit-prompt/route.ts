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
      You are an expert fashion designer and prompt engineer. Based on the following user details, generate a Flux AI full-body image prompt for an outfit.

      ### User Details:
      - Gender: ${gender}
      - Age: ${age}
      - Occasion / User's Input: ${ocassion}
      - Location: ${region}, ${city}, ${country}

      ### Instructions:
      - If the user's prompt mentions **traditional attire**, create an outfit that reflects that culture, incorporating regional designs, textiles, and accessories.
      - If the user's prompt does **not** specify traditional attire, design a **unique and creative modern outfit**. Avoid repetitive generic designs (no navy blazer + charcoal pants unless contextually appropriate).
      - The outfit should include **unique color palettes**, **varied fabrics**, **interesting cuts**, and **modern or culturally significant accessories**.
      - Use descriptive adjectives to enhance style and mood (e.g., minimalist, luxurious, bohemian, futuristic, casual chic).
      - Describe the **full look**, including clothing items, fabrics, colors, patterns, accessories, footwear, hairstyle, and the vibe.
      - The result must be a **full-body outfit image prompt** for Flux AI.
      - Do **NOT** include any extra explanation or description. Only return the Flux AI prompt in the specified format.

      ### Output Format (Flux AI Prompt Only):
      "Full-body portrait of a [AGE]-year-old [GENDER], wearing an outfit designed for [OCCASION/USER INPUT]. The style is influenced by [REGION, CITY, COUNTRY]. The outfit includes [DETAILED DESCRIPTION OF CLOTHING ITEMS], made of [FABRICS], in [COLORS AND PATTERNS]. Accessories include [ACCESSORIES], and they are wearing [FOOTWEAR]. The person has [HAIRSTYLE]. The overall vibe is [STYLE VIBE]. The background is [OPTIONAL SCENE TO COMPLEMENT THE OUTFIT]."

      ### Examples of Vibe / Style Directions You Can Include:
      - Modern: minimalist, avant-garde, high fashion, streetwear, futuristic, casual chic, boho
      - Traditional: ceremonial, royal, festive, cultural fusion
      - Fabrics: linen, brocade, velvet, silk, denim, leather, organza
      - Color Palette: jewel tones, earthy tones, monochrome, pastel gradients, bold contrasts

      ### Important:
      - Be creative with fashion choices—combine modern cuts with regional flair or unexpected materials.
      - Only suggest traditional clothing if explicitly mentioned in the user input.
      - Do **not** repeat the same clothing types (avoid defaulting to navy suits/charcoal pants).
      - Return **ONLY** the Flux AI prompt.
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
