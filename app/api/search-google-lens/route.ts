import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";

export async function POST(req: NextRequest) {
  const googleLensApikey = process.env.GOOGLE_LENS_API_KEY;
  if (!googleLensApikey) {
    throw new Error(
      "Missing google lens api key, define GOOGLE_LENS_API_KEY in your .env",
    );
  }

  const payload = await req.json();
  if (!payload.imageUrl) {
    return NextResponse.json(
      { error: "Please provide an image url to search for in google lens" },
      { status: 400 },
    );
  }

  try {
    const googleLensResponse = await getJson({
      engine: "google_lens",
      url: payload.imageUrl,
      api_key: googleLensApikey,
      hl: "ur",
      country: "pk",
    });
    return NextResponse.json(googleLensResponse.visual_matches);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
