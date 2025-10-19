import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ClarityAccess — AI Accessibility & WCAG Scanner",
  description: "Scan any website for accessibility issues in seconds. WCAG-focused reports you can act on today.",
  metadataBase: new URL("https://clarity-access1.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#0c0f14] text-slate-100">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
