// app/api/scan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const respond = (data: any, status = 200) =>
  NextResponse.json(
    typeof data === "object" ? data : { message: String(data) },
    { status }
  );

export async function GET(req: NextRequest) {
  try {
    let url = (req.nextUrl.searchParams.get("url") || "").trim();
    if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(url)) return respond({ error: "Provide ?url=https://…" }, 400);

    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err: any) {
    console.error("SCAN GET ERROR", err);
    return respond({ error: err?.message || "Internal error" }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { url?: string };
    let url = (body.url || "").trim();
    if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(url)) return respond({ error: "Body must be { url: 'https://…' }" }, 400);

    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err: any) {
    console.error("SCAN POST ERROR", err);
    return respond({ error: err?.message || "Internal error" }, 500);
  }
}
