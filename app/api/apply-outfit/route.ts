import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const rapidApiKey = process.env.RAPID_API_KEY;
  const rapidApiHost = process.env.RAPID_API_HOST;

  if (!rapidApiKey || !rapidApiHost) {
    throw new Error("Rapid API credentials are missing");
  }

  // Check content type
  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return Response.json({ error: "Invalid Content-Type" }, { status: 400 });
  }

  // Parse formdata
  const formData = await req.formData();
  const avatarFile = formData.get("avatar_image");
  const outfitFile = formData.get("clothing_image");
  if (!avatarFile || !outfitFile) {
    return Response.json({ error: "Missing files" }, { status: 400 });
  }

  // Call try-on api
  const url = "https://try-on-diffusion.p.rapidapi.com/try-on-file";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": rapidApiKey,
      "x-rapidapi-host": rapidApiHost,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  };

  try {
    const response = await fetch(url, options);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    return NextResponse.json(
      { image: `data:image/png;base64,${base64}` },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message });
  }
}
