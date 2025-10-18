import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function respond(data: any, status = 200) {
  return NextResponse.json(
    typeof data === "object" ? data : { message: String(data) },
    { status }
  );
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get("url");
    if (!url || !/^https?:\/\//i.test(url)) {
      return respond({ error: "Provide ?url=https://…" }, 400);
    }
    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err: any) {
    console.error("SCAN GET ERROR", err);
    return respond({ error: err?.message || "Internal error" }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = (await req.json().catch(() => ({}))) as { url?: string };
    if (!url || !/^https?:\/\//i.test(url)) {
      return respond({ error: "Body must be { url: 'https://…' }" }, 400);
    }
    const result = await runAccessibilityScan(url);
    return respond(result);
  } catch (err: any) {
    console.error("SCAN POST ERROR", err);
    return respond({ error: err?.message || "Internal error" }, 500);
  }
}
