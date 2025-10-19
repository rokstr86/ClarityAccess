// lib/scan.ts — PSI (no puppeteer)
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
  score: number;                 // 0–100
  violations: AxeViolation[];    // mapped from Lighthouse audits
  passes: number;
  incomplete: number;
  timestamp: string;
};

function toImpact(score: number | null | undefined): AxeViolation["impact"] {
  if (score === 1) return undefined;
  if (score == null) return "moderate";
  if (score >= 0.9) return "minor";
  if (score >= 0.6) return "moderate";
  if (score >= 0.3) return "serious";
  return "critical";
}

export async function runAccessibilityScan(url: string): Promise<ScanResult> {
  const key = process.env.PSI_API_KEY;
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("category", "ACCESSIBILITY");
  endpoint.searchParams.set("strategy", "desktop");
  if (key) endpoint.searchParams.set("key", key);

  const res = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PSI error ${res.status}: ${txt}`);
  }
  const data = await res.json();

  const lr = data.lighthouseResult;
  const cat = lr?.categories?.accessibility;
  const audits = lr?.audits || {};
  const overall = Math.round((cat?.score ?? 0) * 100);

  // Build “violations” list from failing accessibility audits
  const violations: AxeViolation[] = Object.entries(audits)
    .filter(([_, a]: any) => (a?.score ?? 1) < 1 && a?.id && a?.title)
    .map(([id, a]: any) => ({
      id,
      impact: toImpact(a?.score),
      description: a?.description || a?.title || id,
      help: a?.title || id,
      helpUrl: a?.details?.help || a?.documentation?.link || a?.url || a?.details?.url || "",
      nodes: (a?.details?.nodes || []).slice(0, 10).map((n: any) => ({
        html: n?.node?.snippet || n?.snippet || "",
        target: [n?.path || n?.selector || ""].filter(Boolean),
      })),
    }));

  return {
    url,
    score: overall,
    violations,
    passes: Object.values(audits).filter((a: any) => (a?.score ?? 0) === 1).length,
    incomplete: 0,
    timestamp: new Date().toISOString(),
  };
}
