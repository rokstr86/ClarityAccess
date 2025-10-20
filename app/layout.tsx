import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "ClarityAccess — AI Accessibility & WCAG Scanner",
    template: "%s | ClarityAccess",
  },
  description:
    "Scan any website for accessibility issues in seconds. Get instant, WCAG-focused insights to ensure ADA compliance with ease.",
  keywords: [
    "ADA compliance",
    "accessibility scanner",
    "WCAG testing",
    "AI website audit",
    "web accessibility",
    "a11y tool",
    "ClarityAccess",
  ],
  authors: [{ name: "ClarityAccess Team", url: "https://clarity-access1.vercel.app" }],
  creator: "ClarityAccess",
  publisher: "ClarityAccess",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN ?? "https://clarity-access1.vercel.app"
  ),
  openGraph: {
    title: "ClarityAccess — AI Accessibility & WCAG Scanner",
    description:
      "Automated ADA & WCAG compliance audits powered by AI. Scan any site in seconds and get actionable reports.",
    url: "https://clarity-access1.vercel.app",
    siteName: "ClarityAccess",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "ClarityAccess Accessibility Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClarityAccess — AI Accessibility & WCAG Scanner",
    description:
      "Instant accessibility audits powered by AI. Scan your site for ADA & WCAG compliance in seconds.",
    creator: "@clarityaccess",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://clarity-access1.vercel.app",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "Software as a Service (SaaS)",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
