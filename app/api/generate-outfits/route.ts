import { Client } from "@gradio/client";
import { NextRequest, NextResponse } from "next/server";

interface IPredictResponse {
  data: [
    {
      url: string;
    },
  ];
}

export async function POST(req: NextRequest) {
  const hfAccessToken = process.env.HF_ACCESS_TOKEN;
  if (!hfAccessToken) {
    throw new Error("Missing HF access token");
  }

  // Check if prompt is given
  const payload = await req.json();
  if (!payload.prompt) {
    return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
  }

  try {
    // Connect to FLUX model
    const client = await Client.connect("black-forest-labs/FLUX.1-dev", {
      hf_token: hfAccessToken,
    });
    const result = await client.predict("/infer", {
      prompt: payload.prompt || "Hello!!",
      seed: 42,
      randomize_seed: false,
      width: 512,
      height: 512,
      num_inference_steps: 30,
      guidance_scale: 30,
    });

    // Return image url as response
    return NextResponse.json({
      imageURL: (result as IPredictResponse).data[0].url,
    });
  } catch (error) {
    console.error("Prediction error:", (error as Error).message);
    return NextResponse.json({ error: "Unable to generate outfit" });
  }
}
