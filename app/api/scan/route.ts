// app/api/scan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Type-safe response helper
 */
const respond = (data: object | string, status = 200) =>
  NextResponse.json(
    typeof data === "object" ? data : { message: String(data) },
    { status }
  );

/**
 * GET /api/scan?url=https://example.com
 * Runs an accessibility scan on the provided URL
 */
export async function GET(req: NextRequest) {
  try {
    let url = (req.nextUrl.searchParams.get("url") || "").trim();
    if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(url)) return respond({ error: "Provide ?url=https://…" }, 400);

    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err) {
    const error = err as Error;
    console.error("SCAN GET ERROR", error);
    return respond({ error: error?.message || "Internal error" }, 500);
  }
}

/**
 * POST /api/scan with body { url: "https://example.com" }
 * Runs an accessibility scan on the provided URL
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { url?: string };
    let url = (body.url || "").trim();
    if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(url)) return respond({ error: "Body must be { url: 'https://…' }" }, 400);

    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err) {
    const error = err as Error;
    console.error("SCAN POST ERROR", error);
    return respond({ error: error?.message || "Internal error" }, 500);
  }
}
