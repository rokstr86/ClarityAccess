"use client";
import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>("");

  const handleScan = async () => {
    let u = url.trim();
    if (/^http:\/\//i.test(u)) u = u.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(u)) {
      setError("Please enter a valid URL starting with http(s)://");
      return;
    }

    setError(null);
    setResult(null);
    setDebug("");
    setLoading(true);

    try {
      const res = await fetch("/api/scan?url=" + encodeURIComponent(u));
      const text = await res.text(); // ← always read raw body first
      setDebug(`status=${res.status}\n${text}`);

      // Try JSON parse *only* if there is a body
      let json: any = null;
      try {
        json = text && text.trim().startsWith("{") ? JSON.parse(text) : null;
      } catch {
        /* not JSON; will be handled below */
      }

      if (!res.ok) {
        setError(json?.error || text || `Request failed (${res.status})`);
        return;
      }

      if (!json) {
        setError("Server returned empty body");
        return;
      }

      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0c0f14] text-white px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          AI Accessibility & Compliance Scanner
        </h1>
        <p className="text-slate-300 mt-4">
          Enter any website URL below to instantly scan for accessibility and
          WCAG compliance issues.
        </p>

        <div className="mt-8 flex gap-3 max-w-2xl mx-auto">
          <input
            className="flex-1 px-4 py-3 rounded-lg text-slate-900 outline-none"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Scanning…" : "Scan"}
          </button>
        </div>

        {error && <p className="text-red-400 mt-6">{error}</p>}

        {result && (
          <div className="text-left bg-[#121720] border border-[#1e2736] rounded-xl p-6 mt-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-extrabold">{result.score}</div>
              <div className="text-slate-300">
                <div className="font-semibold break-all">{result.url}</div>
                <div className="text-sm">
                  Passes: {result.passes} · Incomplete: {result.incomplete}
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-6">Top issues</h2>
            {result.violations?.length === 0 && (
              <p className="text-green-400 mt-2">No violations detected 🎉</p>
            )}
            <ul className="mt-3 space-y-4">
              {result.violations?.slice(0, 12).map((v: any) => (
                <li key={v.id} className="border border-[#1e2736] rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{v.help}</div>
                      <div className="text-sm text-slate-400">{v.description}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[#0f1420] border border-[#1e2736]">
                      {v.impact ?? "info"}
                    </span>
                  </div>
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    className="text-sm text-blue-400 underline mt-2 inline-block"
                  >
                    How to fix
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {debug && (
          <pre className="mt-8 text-left text-xs text-slate-400 whitespace-pre-wrap bg-black/30 p-4 rounded-lg">
            {debug}
          </pre>
        )}
      </div>
    </main>
  );
}
