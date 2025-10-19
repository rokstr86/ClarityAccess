"use client";
import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    setLoading(true);
    const email = localStorage.getItem("ca_email");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, plan }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
    else alert(data?.error || "Stripe error");
    setLoading(false);
  };

  const tiers = [
    {
      name: "Free Sample",
      price: "$0",
      desc: "Try ClarityAccess with 3 free scans/day.",
      features: [
        "3 daily scans",
        "Basic accessibility report",
        "Limited support",
      ],
      cta: "Start Free",
      plan: "free",
    },
    {
      name: "Personal",
      price: "$19/mo",
      desc: "Perfect for freelancers & small businesses.",
      features: [
        "Unlimited scans",
        "Full accessibility + SEO report",
        "PDF export",
        "Priority speed",
      ],
      cta: "Upgrade to Personal",
      plan: "personal",
    },
    {
      name: "Enterprise",
      price: "$99/mo",
      desc: "For agencies & large teams needing scale.",
      features: [
        "Unlimited scans",
        "Team dashboard",
        "White-label reports",
        "Monthly analytics email",
        "API access + priority support",
      ],
      cta: "Upgrade to Enterprise",
      plan: "enterprise",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f18] text-white px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((t) => (
          <div key={t.name} className="border border-gray-800 bg-[#111827] rounded-2xl p-8 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{t.name}</h2>
              <p className="text-gray-400 mb-6">{t.desc}</p>
              <p className="text-3xl font-bold mb-6">{t.price}</p>
              <ul className="space-y-2 text-gray-300 mb-8">
                {t.features.map((f) => (
                  <li key={f}>✅ {f}</li>
                ))}
              </ul>
            </div>
            <button
              disabled={loading}
              onClick={() => handleCheckout(t.plan)}
              className={`rounded-xl py-3 mt-auto font-semibold ${
                t.plan === "free"
                  ? "bg-gray-700 text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
