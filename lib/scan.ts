import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export type AxeNode = { html: string; target: string[] };
export type AxeViolation = {
  id: string; impact?: "minor"|"moderate"|"serious"|"critical";
  description: string; help: string; helpUrl: string; nodes: AxeNode[];
};
export type ScanResult = {
  url: string; score: number; violations: AxeViolation[];
  passes: number; incomplete: number; timestamp: string;
};

export async function runAccessibilityScan(url: string): Promise<ScanResult> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  // Pretend to be a normal Chrome
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118 Safari/537.36"
  );

  // Some sites block 'networkidle2' on serverless; use domcontentloaded + timeout
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });

  // Inject axe
  await page.addScriptTag({
    url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js",
  });

  const results: any = await page.evaluate(async () => {
    // @ts-expect-error axe injected on window
    return await axe.run(document, {
      runOnly: ["wcag2a","wcag2aa"],
      resultTypes: ["violations","incomplete","passes"],
      reporter: "v2",
    });
  });

  await browser.close();

  const vCount = (results.violations as AxeViolation[]).reduce(
    (sum, v) => sum + (v.nodes?.length ?? 0), 0
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
