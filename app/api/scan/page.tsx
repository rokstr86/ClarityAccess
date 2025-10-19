"use client";
import { useState } from "react";

export default function ScanPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    let u = url.trim();
    if (/^http:\/\//i.test(u)) u = u.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(u)) { setError("Enter a valid https:// URL"); return; }
    setError(null); setResult(null); setLoading(true);
    try {
      const res = await fetch("/api/scan?url=" + encodeURIComponent(u), { cache: "no-store" });
      const text = await res.text();
      let json: any = null; try { json = text && text.startsWith("{") ? JSON.parse(text) : null; } catch {}
      if (!res.ok) { setError(json?.error || text || `Request failed (${res.status})`); return; }
      if (!json) { setError("Server returned empty response"); return; }
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Scan a website</h1>
      <p className="text-slate-300 mt-2">Paste any public URL to get an accessibility snapshot.</p>

      <div className="mt-6 flex gap-3">
        <input
          className="flex-1 border border-slate-700 bg-[#0e131c] rounded-xl px-4 py-3 outline-none text-slate-100"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleScan}
          disabled={loading}
          className="rounded-xl px-5 py-3 bg-white text-black font-semibold disabled:opacity-50"
        >
          {loading ? "Scanning…" : "Run scan"}
        </button>
      </div>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {result && (
        <div className="mt-8 grid md:grid-cols-[180px_1fr] gap-6">
          <div className="rounded-2xl border border-slate-800 bg-[#0e131c] p-6">
            <div className="text-5xl font-extrabold">{result.score}</div>
            <div className="text-slate-300 break-all mt-2">{result.url}</div>
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
              <p className="text-green-400">No violations detected 🎉</p>
            )}
            {result.violations?.slice(0, 20).map((v: any) => (
              <div key={v.id} className="rounded-xl border border-slate-800 bg-[#0e131c] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">{v.help}</div>
                    <div className="text-slate-300 text-sm mt-1">{v.description}</div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[#0f1420] border border-slate-800">
                    {v.impact ?? "info"}
                  </span>
                </div>
                {v.helpUrl && (
                  <a className="text-sm text-blue-400 underline mt-2 inline-block" target="_blank" href={v.helpUrl}>
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
