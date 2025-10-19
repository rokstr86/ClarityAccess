// components/EmailGate.tsx
"use client";
import { useEffect, useState } from "react";

type Props = {
  onDone(email: string): void;
  title?: string;
  blurb?: string;
};

export default function EmailGate({ onDone, title, blurb }: Props) {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ca_email");
    if (saved) onDone(saved);
  }, [onDone]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErr(null); setOk(null); setLoading(true);
    try {
      // Send to your backend (stores the email) — see /api/subscribe below
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to subscribe");
      localStorage.setItem("ca_email", email);
      setOk("You're in! You can run free scans now.");
      onDone(email);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-[#0e131c] p-6">
        <h3 className="text-xl font-semibold">{title ?? "Try ClarityAccess free"}</h3>
        <p className="text-slate-300 mt-2">
          {blurb ?? "Enter your email to unlock 3 free scans per day. We'll send occasional product updates."}
        </p>
        <form onSubmit={submit} className="mt-4 flex gap-3">
          <input
            required
            type="email"
            placeholder="you@company.com"
            className="flex-1 rounded-xl border border-slate-700 bg-[#0b1018] px-4 py-3 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="rounded-xl bg-white text-black font-semibold px-5 py-3 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Continue"}
          </button>
        </form>
        {ok && <p className="text-green-400 mt-3">{ok}</p>}
        {err && <p className="text-red-400 mt-3">{err}</p>}
        <p className="mt-4 text-xs text-slate-500">
          By continuing you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy</a>.
        </p>
      </div>
    </div>
  );
}
