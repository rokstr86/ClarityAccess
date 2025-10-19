// lib/scan.ts — PSI (no puppeteer)

/**
 * Represents a single DOM node where an accessibility issue was found
 */
export type AxeNode = { html: string; target: string[] };

/**
 * Represents an accessibility violation found during the scan
 */
export type AxeViolation = {
  id: string;
  impact?: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
};

/**
 * The result of an accessibility scan
 */
export type ScanResult = {
  url: string;
  score: number;                 // 0–100
  violations: AxeViolation[];    // mapped from Lighthouse audits
  passes: number;
  incomplete: number;
  timestamp: string;
};

/**
 * Internal types for PageSpeed Insights API responses
 */
interface PSIAuditDetails {
  help?: string;
  url?: string;
  nodes?: Array<{
    node?: { snippet?: string };
    snippet?: string;
    path?: string;
    selector?: string;
  }>;
}

interface PSIAudit {
  score?: number | null;
  id?: string;
  title?: string;
  description?: string;
  details?: PSIAuditDetails;
  documentation?: { link?: string };
  url?: string;
}

interface PSICategory {
  score?: number;
}

interface PSILighthouseResult {
  categories?: {
    accessibility?: PSICategory;
  };
  audits?: Record<string, PSIAudit>;
}

interface PSIResponse {
  lighthouseResult?: PSILighthouseResult;
}

/**
 * Convert a PSI audit score to an impact level
 */
function toImpact(score: number | null | undefined): AxeViolation["impact"] {
  if (score === 1) return undefined;
  if (score == null) return "moderate";
  if (score >= 0.9) return "minor";
  if (score >= 0.6) return "moderate";
  if (score >= 0.3) return "serious";
  return "critical";
}

/**
 * Run an accessibility scan using Google PageSpeed Insights API
 * @param url The URL to scan (must be publicly accessible)
 * @throws Error if PSI_API_KEY is not set or if the API call fails
 */
export async function runAccessibilityScan(url: string): Promise<ScanResult> {
  const key = process.env.PSI_API_KEY;
  
  // Check for API key and provide helpful error message
  if (!key) {
    throw new Error(
      "PSI_API_KEY environment variable is not set. " +
      "Please obtain an API key from Google Cloud Console and set it in your .env.local file. " +
      "See: https://developers.google.com/speed/docs/insights/v5/get-started"
    );
  }

  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("category", "ACCESSIBILITY");
  endpoint.searchParams.set("strategy", "desktop");
  endpoint.searchParams.set("key", key);

  const res = await fetch(endpoint.toString(), { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text();
    let errorMessage = `PageSpeed Insights API error (${res.status})`;
    
    // Try to extract a more specific error message
    try {
      const errorData = JSON.parse(txt);
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // If parsing fails, use the raw text if it's reasonably short
      if (txt.length < 200) {
        errorMessage = `${errorMessage}: ${txt}`;
      }
    }
    
    throw new Error(errorMessage);
  }

  const data: PSIResponse = await res.json();

  const lr = data.lighthouseResult;
  const cat = lr?.categories?.accessibility;
  const audits = lr?.audits || {};
  const overall = Math.round((cat?.score ?? 0) * 100);

  // Build "violations" list from failing accessibility audits
  const violations: AxeViolation[] = Object.entries(audits)
    .filter(([, audit]) => {
      const a = audit as PSIAudit;
      return (a?.score ?? 1) < 1 && a?.id && a?.title;
    })
    .map(([id, audit]) => {
      const a = audit as PSIAudit;
      return {
        id,
        impact: toImpact(a?.score),
        description: a?.description || a?.title || id,
        help: a?.title || id,
        helpUrl: a?.details?.help || a?.documentation?.link || a?.url || a?.details?.url || "",
        nodes: (a?.details?.nodes || []).slice(0, 10).map((n) => ({
          html: n?.node?.snippet || n?.snippet || "",
          target: [n?.path || n?.selector || ""].filter(Boolean),
        })),
      };
    });

  return {
    url,
    score: overall,
    violations,
    passes: Object.values(audits).filter((audit) => {
      const a = audit as PSIAudit;
      return (a?.score ?? 0) === 1;
    }).length,
    incomplete: 0,
    timestamp: new Date().toISOString(),
  };
}
