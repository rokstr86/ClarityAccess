// lib/scan.ts
import { chromium } from "playwright-chromium";

export type AxeNode = { html: string; target: string[] };
export type AxeViolation = {
  id: string;
  impact?: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
};
export type ScanResult = {
  url: string;
  score: number;
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  timestamp: string;
};

export async function runAccessibilityScan(url: string): Promise<ScanResult> {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });

  // Inject axe-core from a CDN (avoids bundling headaches)
  await page.addScriptTag({ url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js" });

  const results = await page.evaluate(async () => {
    interface AxeRunOptions {
      runOnly?: string[];
      resultTypes?: string[];
      reporter?: string;
    }
    type AxeResult = {
      violations: any[];
      passes?: any[];
      incomplete?: any[];
    };
    interface AxeWindow extends Window {
      axe: { run: (doc: Document, opts?: AxeRunOptions) => Promise<AxeResult> };
    }
    const w = window as unknown as AxeWindow;
    const r = await w.axe.run(document, {
      runOnly: ["wcag2a", "wcag2aa"],
      resultTypes: ["violations", "incomplete", "passes"],
      reporter: "v2",
    });
    return r;
  });

  await browser.close();

  // Simple score: 100 minus a penalty for each violating node (capped)
  const vCount = results.violations.reduce(
    (sum: number, v: AxeViolation) => sum + (v.nodes?.length ?? 0),
    0
  );
  const penalty = Math.min(80, vCount * 2);
  const score = Math.max(0, 100 - penalty);

  return {
    url,
    score,
    violations: results.violations as AxeViolation[],
    passes: results.passes?.length ?? 0,
    incomplete: results.incomplete?.length ?? 0,
    timestamp: new Date().toISOString(),
  };
}
