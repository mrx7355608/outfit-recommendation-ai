import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Get IP
  let ip: string | undefined = "";
  if (process.env.NODE_ENV === "production") {
    const forwarded = req.headers.get("x-forwarded-for");
    ip = forwarded ? forwarded.split(",")[0] : undefined;
    if (ip?.startsWith("::ffff:")) {
      ip = ip.substring(7);
    }
  } else {
    ip = "103.21.244.0";
  }

  // Get Region
  const token = process.env.IP_INFO_TOKEN;
  const url = `https://ipinfo.io/${ip}?token=${token}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log(result);

  return NextResponse.json({
    region: `${result.region},${result.city},${result.country}`,
  });
}
