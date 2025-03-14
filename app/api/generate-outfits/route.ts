import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const hfAccessToken = process.env.HF_ACCESS_TOKEN;
  if (!hfAccessToken) {
    throw new Error("Missing HF access token");
  }

  try {
    const client = await Client.connect("black-forest-labs/FLUX.1-dev", {
      hf_token: hfAccessToken,
    });
    const payload = await req.json();

    const result = await client.predict("/infer", {
      prompt: payload.prompt || "Hello!!",
      seed: 42,
      randomize_seed: false,
      width: 256,
      height: 256,
      num_inference_steps: 30,
      guidance_scale: 7.5,
    });
    return NextResponse.json({ result: result.data });
  } catch (error) {
    console.error("Prediction error:", error);
    NextResponse.json({ error: error.message });
  }
}
