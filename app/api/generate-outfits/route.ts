import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const client = await Client.connect("black-forest-labs/FLUX.1-dev");
    const payload = await req.json();

    const result = await client.predict("/infer", {
      prompt: payload.prompt || "Hello!!",
      seed: 42,
      randomize_seed: false,
      width: 256,
      height: 256,
      guidance_scale: 7.5,
      num_inference_steps: 30,
    });

    return NextResponse.json({ result: result.data });
  } catch (error) {
    console.error("Prediction error:", error);
    NextResponse.json({ error: error.message });
  }
}
