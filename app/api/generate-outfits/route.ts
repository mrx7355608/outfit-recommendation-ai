import { Runware } from "@runware/sdk-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const runwareApiKey = process.env.RUNWARE_API_KEY;
  if (!runwareApiKey) {
    throw new Error(
      "Missing runware api key, define RUNWARE_API_KEY in your .env",
    );
  }

  // Check if prompt is given
  const payload = await req.json();
  if (!payload.prompt) {
    return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
  }

  try {
    const runware = new Runware({ apiKey: runwareApiKey });
    const result = await runware.requestImages({
      positivePrompt: payload.prompt,
      width: 512,
      height: 512,
      model: "runware:100@1", // AIR id
      seed: Math.floor(Math.random() * 4294967295),
    });
    console.log(result);

    // Return image url as response
    return NextResponse.json({ imageURL: result });
  } catch (error) {
    console.error("Prediction error:", (error as Error).message);
    return NextResponse.json({ error: "Unable to generate outfit" });
  }
}
