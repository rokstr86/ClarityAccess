import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const respond = (data: unknown, status = 200) =>
  NextResponse.json(
    typeof data === "object" && data !== null ? data : { message: String(data) },
    { status }
  );

export async function GET(req: NextRequest) {
  try {
    let url = (req.nextUrl.searchParams.get("url") || "").trim();
    if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(url)) return respond({ error: "Provide ?url=https://…" }, 400);

    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err: unknown) {
    console.error("SCAN GET ERROR", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return respond({ error: message }, 500);
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
  } catch (err: unknown) {
    console.error("SCAN POST ERROR", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return respond({ error: message }, 500);
  }
}
