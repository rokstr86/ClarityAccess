import Link from "next/link";

interface Feature {
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    title: "Simple",
    description: "Paste a URL. Get a prioritized list of fixes with links to documentation.",
  },
  { 
    title: "Fast", 
    description: "Actionable results in seconds. Great for pre-sales audits and QA checks." 
  },
  { 
    title: "Shareable", 
    description: "Send results to clients or stakeholders to drive upgrades and retainers." 
  },
];

/**
 * Home page component
 */
export default function Home() {
  return (
    <main className="relative">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Ship accessible websites.
            <span className="text-slate-300"> Instantly find WCAG issues.</span>
          </h1>
          <p className="mt-6 text-slate-300 text-lg">
            ClarityAccess scans any URL and surfaces actionable accessibility fixes. Perfect for agencies and SMBs who
            need fast compliance checks.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/scan"
              className="rounded-xl bg-white text-black font-semibold px-6 py-3 hover:opacity-90 transition-opacity"
            >
              Try it free
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-slate-700 px-6 py-3 text-slate-200 hover:bg-white/5 transition-colors"
            >
              See pricing
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-slate-400">
            <div>✅ WCAG 2.1 A/AA</div>
            <div>✅ Shareable reports</div>
            <div>✅ Actionable fixes</div>
            <div>✅ No install required</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <h2 className="text-2xl font-bold">Why teams choose ClarityAccess</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <article 
              key={feature.title} 
              className="rounded-2xl border border-slate-800 bg-[#0e131c] p-6"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
