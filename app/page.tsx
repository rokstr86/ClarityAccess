"use client";
import { useState } from "react";

type Violation = {
  id: string;
  impact?: string;
  help: string;
  helpUrl: string;
  description: string;
  nodes?: { html: string; target: string[] }[];
};

type ScanResult = {
  url: string;
  score: number;
  violations?: Violation[];
  passes?: number;
  incomplete?: number;
  timestamp?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
  if (!/^https?:\/\//i.test(url)) {
    setError("Please enter a valid URL starting with http or https.");
    return;
  }
  setError(null); setLoading(true); setResult(null);
  try {
    const res = await fetch("/api/scan?url=" + encodeURIComponent(url));
    const text = await res.text();
    let json: any = null;
    try { json = text ? JSON.parse(text) : null; } catch { /* not json */ }

    if (!res.ok) {
      setError(json?.error || text || `Request failed (${res.status})`);
      return;
    }
    setResult(json);
  } catch (err: any) {
    setError(err.message || "Network error");
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
      <h1 className="text-4xl font-bold mb-4">AI Accessibility & Compliance Scanner</h1>
      <p className="text-gray-400 mb-8 text-center max-w-lg">
        Enter any website URL below to instantly scan for accessibility and WCAG compliance issues.
      </p>
      <div className="flex w-full max-w-xl mb-6">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 outline-none"
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-blue-600 px-6 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-600"
        >
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-2">Results for {result.url}</h2>
          <p className="mb-2">Score: <span className="font-bold">{result.score}</span></p>
          <p className="mb-4">
            Violations: {result.violations?.length ?? 0} · Passes: {result.passes ?? 0} · Incomplete: {result.incomplete ?? 0}
          </p>
          {result.violations && result.violations.length > 0 && (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {result.violations?.map((v, i: number) => (
                <li key={i} className="border border-gray-700 p-3 rounded-lg">
                  <h3 className="font-semibold text-red-400">{v.help}</h3>
                  <p className="text-gray-400 text-sm">{v.description}</p>
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    className="text-blue-400 underline text-sm"
                  >
                    Learn more
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
