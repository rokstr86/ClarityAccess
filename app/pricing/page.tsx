import Link from "next/link";

/**
 * Pricing page component
 * 
 * TODO: Stripe Integration
 * To enable paid subscriptions:
 * 1. Set up a Stripe account at https://stripe.com
 * 2. Create products and pricing plans in the Stripe Dashboard
 * 3. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to .env.local
 * 4. Install stripe package: npm install stripe @stripe/stripe-js
 * 5. Create /app/api/checkout/route.ts to handle Stripe Checkout sessions
 * 6. Replace the disabled "Subscribe" button with a working Stripe Checkout link
 * 
 * Example implementation: https://stripe.com/docs/checkout/quickstart
 */
export default function Pricing() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold">Simple pricing</h1>
      <p className="text-slate-300 mt-2">Start free. Upgrade when you need more scans.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {/* Free Tier */}
        <div className="rounded-2xl border border-slate-800 bg-[#0e131c] p-6">
          <h2 className="text-xl font-semibold">Free</h2>
          <div className="text-4xl font-extrabold mt-2">
            $0
          </div>
          <ul className="mt-4 text-slate-300 space-y-2 text-sm" role="list">
            <li>• 10 scans / month</li>
            <li>• WCAG A/AA checks</li>
            <li>• Shareable report</li>
          </ul>
          <Link 
            href="/scan" 
            className="inline-block mt-6 rounded-lg bg-white text-black px-5 py-2 font-semibold hover:opacity-90 transition-opacity"
          >
            Get started
          </Link>
        </div>

        {/* Pro Tier */}
        <div className="rounded-2xl border border-blue-400/30 bg-[#0e131c] p-6">
          <div className="inline-block text-xs font-semibold px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300">
            Most popular
          </div>
          <h2 className="text-xl font-semibold mt-3">Pro</h2>
          <div className="text-4xl font-extrabold mt-2">
            $19
            <span className="text-xl text-slate-400">/mo</span>
          </div>
          <ul className="mt-4 text-slate-300 space-y-2 text-sm" role="list">
            <li>• 300 scans / month</li>
            <li>• Priority API</li>
            <li>• Email export (CSV)</li>
          </ul>
          
          {/* 
            TODO: Replace with Stripe Checkout
            When Stripe is configured, replace this button with:
            <a
              href="/api/checkout?plan=pro"
              className="inline-block mt-6 rounded-lg bg-white text-black px-5 py-2 font-semibold hover:opacity-90 transition-opacity"
            >
              Subscribe
            </a>
          */}
          <button
            disabled
            className="inline-block mt-6 rounded-lg bg-white text-black px-5 py-2 font-semibold opacity-60 cursor-not-allowed"
            title="Payment integration coming soon"
            aria-describedby="stripe-notice"
          >
            Subscribe
          </button>
          <p id="stripe-notice" className="text-xs text-slate-400 mt-2">
            Payment integration coming soon. Connect Stripe to enable checkout.
          </p>
        </div>
      </div>
    </main>
  );
}
