"use client";
import { useState } from "react";
import type { ScanResult, AxeViolation } from "@/lib/scan";

/**
 * API error response type
 */
interface ErrorResponse {
  error?: string;
}

/**
 * ScanPage component - allows users to scan any URL for accessibility issues
 */
export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate and sanitize the URL input
   */
  const validateUrl = (input: string): string | null => {
    let u = input.trim();
    
    // Auto-convert http to https
    if (/^http:\/\//i.test(u)) {
      u = u.replace(/^http:/i, "https:");
    }
    
    // Ensure URL has protocol
    if (!/^https?:\/\//i.test(u)) {
      return "Please enter a valid URL starting with https://";
    }
    
    // Basic URL validation
    try {
      new URL(u);
      return null; // Valid URL
    } catch {
      return "Please enter a valid URL";
    }
  };

  /**
   * Handle the scan button click
   */
  const handleScan = async () => {
    // Validate URL
    const validationError = validateUrl(url);
    if (validationError) {
      setError(validationError);
      return;
    }

    let u = url.trim();
    if (/^http:\/\//i.test(u)) u = u.replace(/^http:/i, "https:");

    // Reset state and start loading
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/scan?url=" + encodeURIComponent(u), { cache: "no-store" });
      const text = await res.text();
      
      // Try to parse JSON response
      let json: ScanResult | ErrorResponse | null = null;
      try {
        json = text && text.startsWith("{") ? JSON.parse(text) : null;
      } catch {
        // JSON parsing failed
      }

      if (!res.ok) {
        const errorMsg = (json as ErrorResponse)?.error || text || `Request failed (${res.status})`;
        setError(errorMsg);
        return;
      }

      if (!json) {
        setError("Server returned empty response");
        return;
      }

      // Check if it's an error response
      if ((json as ErrorResponse).error) {
        setError((json as ErrorResponse).error || "Unknown error");
        return;
      }

      setResult(json as ScanResult);
    } catch (e) {
      const error = e as Error;
      setError(error?.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Enter key press in the input field
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleScan();
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Scan a website</h1>
      <p className="text-slate-300 mt-2">Paste any public URL to get an accessibility snapshot.</p>

      <div className="mt-6 flex gap-3">
        <label htmlFor="url-input" className="sr-only">
          Website URL to scan
        </label>
        <input
          id="url-input"
          type="url"
          className="flex-1 border border-slate-700 bg-[#0e131c] rounded-xl px-4 py-3 outline-none text-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          aria-describedby={error ? "error-message" : undefined}
        />
        <button
          onClick={handleScan}
          disabled={loading || !url.trim()}
          className="rounded-xl px-5 py-3 bg-white text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          aria-busy={loading}
        >
          {loading ? "Scanning…" : "Run scan"}
        </button>
      </div>

      {error && (
        <div id="error-message" className="mt-4 p-4 rounded-lg bg-red-900/20 border border-red-500/30" role="alert">
          <p className="text-red-400">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 grid md:grid-cols-[180px_1fr] gap-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0e131c] p-6">
            <div className="text-5xl font-extrabold" aria-label={`Accessibility score: ${result.score} out of 100`}>
              {result.score}
            </div>
            <div className="text-slate-300 break-all mt-2" title={result.url}>
              {result.url}
            </div>
            <div className="text-slate-400 text-sm mt-2">
              Passes: {result.passes} · Incomplete: {result.incomplete}
            </div>
            <div className="text-slate-500 text-xs mt-2">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Top issues</h2>
            {result.violations?.length === 0 && (
              <p className="text-green-400" role="status">No violations detected 🎉</p>
            )}
            {result.violations?.slice(0, 20).map((v: AxeViolation) => (
              <div key={v.id} className="rounded-xl border border-slate-800 bg-[#0e131c] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{v.help}</div>
                    <div className="text-slate-300 text-sm mt-1">{v.description}</div>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded bg-[#0f1420] border border-slate-800"
                    aria-label={`Impact level: ${v.impact ?? "info"}`}
                  >
                    {v.impact ?? "info"}
                  </span>
                </div>
                {v.helpUrl && (
                  <a 
                    className="text-sm text-blue-400 underline mt-2 inline-block hover:text-blue-300" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href={v.helpUrl}
                  >
                    How to fix
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
