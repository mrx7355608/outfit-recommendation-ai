import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const FALLBACK_REGION = "Sindh,Karachi,Pakistan";
  let ip: string | undefined = "";

  // Get IP
  if (process.env.NODE_ENV === "development") {
    ip = "103.21.244.0";
  } else {
    // Extract ip from x-forwarded-for header
    const forwarded = req.headers.get("x-forwarded-for");
    ip = forwarded ? forwarded.split(",")[0] : undefined;
    if (ip?.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }

    // If no ip is found, then return the fallback region
    if (!ip) {
      return NextResponse.json({ region: FALLBACK_REGION });
    }
  }

  // Get Region from the extracted IP
  const token = process.env.IP_INFO_TOKEN;
  const url = `https://ipinfo.io/${ip}?token=${token}`;
  const response = await fetch(url);
  const result = await response.json();

  return NextResponse.json({
    region: `${result.region},${result.city},${result.country}`,
  });
}
