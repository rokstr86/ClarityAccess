import { NextRequest, NextResponse } from "next/server";
import { runAccessibilityScan } from "@/lib/scan";

export const runtime = "nodejs"; // ensure Node runtime for Puppeteer

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || !/^https?:\/\//i.test(url)) {
      return NextResponse.json({ error: "Valid URL required" }, { status: 400 });
    }
    // Quick developer helper: return a mocked result for example.com so we can
    // test the frontend and deployment without launching Puppeteer in prod.
    if (url.includes("example.com")) {
      const mock = {
        url,
        score: 92,
        violations: [
          {
            id: "button-name",
            impact: "moderate",
            description: "Buttons must have discernible text.",
            help: "Ensure interactive elements have accessible names",
            helpUrl: "https://example.com/fix-button-name",
            nodes: [{ html: "<button></button>", target: ["#btn1"] }],
          },
        ],
        passes: 12,
        incomplete: 0,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(mock, { status: 200 });
    }
    const result = await runAccessibilityScan(url);
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    const error = e instanceof Error ? e.message : "Scan failed";
    return NextResponse.json({ error }, { status: 500 });
  }
}
