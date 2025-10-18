import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs"; // ensure Node runtime for Puppeteer

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
    }
    const result = await runAccessibilityScan(url);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Scan failed";
    return NextResponse.json({ error }, { status: 500 });
  }
}
