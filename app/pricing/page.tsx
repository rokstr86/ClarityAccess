import Link from "next/link";

export default function Pricing() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Simple pricing</h1>
      <p className="text-slate-300 mt-2">Start free. Upgrade when you need more scans.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="rounded-2xl border border-slate-800 bg-[#0e131c] p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <div className="text-4xl font-extrabold mt-2">$0</div>
          <ul className="mt-4 text-slate-300 space-y-2 text-sm">
            <li>• 10 scans / month</li>
            <li>• WCAG A/AA checks</li>
            <li>• Shareable report</li>
          </ul>
          <Link href="/scan" className="inline-block mt-6 rounded-lg bg-white text-black px-5 py-2 font-semibold">
            Get started
          </Link>
        </div>

        <div className="rounded-2xl border border-blue-400/30 bg-[#0e131c] p-6">
          <div className="inline-block text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">Most popular</div>
          <h2 className="text-xl font-semibold mt-3">Pro</h2>
          <div className="text-4xl font-extrabold mt-2">$19<span className="text-xl text-slate-400">/mo</span></div>
          <ul className="mt-4 text-slate-300 space-y-2 text-sm">
            <li>• 300 scans / month</li>
            <li>• Priority API</li>
            <li>• Email export (CSV)</li>
          </ul>
          {/* Replace href with your Stripe Checkout link, or implement /api/checkout */}
          <a
            href="#"
            className="inline-block mt-6 rounded-lg bg-white text-black px-5 py-2 font-semibold opacity-60 cursor-not-allowed"
            title="Connect Stripe to enable"
          >
            Subscribe
          </a>
          <p className="text-xs text-slate-400 mt-2">Connect Stripe to enable checkout.</p>
        </div>
      </div>
    </main>
  );
}
