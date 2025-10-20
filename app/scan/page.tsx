"use client";

import { useState, useEffect, useCallback } from "react";
import EmailGate from "@/components/EmailGate";
import { FREE_SCANS_PER_DAY, getRemainingScans, consumeScan } from "@/lib/quota";

export default function ScanPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(FREE_SCANS_PER_DAY);

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedEmail = localStorage.getItem("ca_email");
    if (savedEmail) setEmail(savedEmail);
    setRemaining(getRemainingScans());
  }, []);

  const onEmail = useCallback((e: string) => {
    setEmail(e);
    setRemaining(getRemainingScans());
  }, []);

  const handleScan = async () => {
    if (!email) return;
    if (remaining <= 0) {
      setError(
        `Free quota reached. You get ${FREE_SCANS_PER_DAY} scans per day. ` +
          `Upgrade on the Pricing page for more.`
      );
      return;
    }

    let u = url.trim();
    if (/^http:\/\//i.test(u)) u = u.replace(/^http:/i, "https:");
    if (!/^https?:\/\//i.test(u)) {
      setError("Enter a valid https:// URL");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scan?url=" + encodeURIComponent(u), { cache: "no-store" });
      const text = await res.text();

      let json: any = null;
      try {
        json = text && text.trim().startsWith("{") ? JSON.parse(text) : null;
      } catch {}

      if (!res.ok) {
        setError(json?.error || text || `Request failed (${res.status})`);
        return;
      }
      if (!json) {
        setError("Server returned empty response");
        return;
      }

      setResult(json);
      const left = consumeScan();
      setRemaining(left);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      {!email && <EmailGate onDone={onEmail} />}

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Scan a website</h1>
          <p className="text-slate-300 mt-2">
            Paste any public URL to get an accessibility snapshot.{" "}
            <span className="text-slate-400">
              Free: {FREE_SCANS_PER_DAY}/day · Remaining today: {remaining}
            </span>
          </p>
        </div>
        <div className="text-sm text-slate-400">
          {email ? <>Signed in as <span className="text-slate-200">{email}</span></> : null}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <input
          className="flex-1 border border-slate-700 bg-[#0e131c] rounded-xl px-4 py-3 outline-none text-slate-100"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleScan}
          disabled={loading || !email}
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
