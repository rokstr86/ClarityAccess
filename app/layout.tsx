import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "ClarityAccess — AI Accessibility & WCAG Scanner",
  description: "Scan any website for accessibility issues in seconds. WCAG-focused reports you can act on today.",
  metadataBase: new URL("https://clarity-access1.vercel.app"),
=======
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClarityAccess - ADA Compliance Scanner",
  description: "Instantly find WCAG issues on any website. Fast, actionable accessibility scanning for agencies and SMBs.",
  keywords: ["accessibility", "WCAG", "ADA compliance", "web accessibility", "a11y"],
>>>>>>> 889cb984341664f928c8f109b9ec8323a9aa4346
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
<<<<<<< HEAD
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-[#0c0f14] text-slate-100">
        <Navbar />
        {children}
=======
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
>>>>>>> 889cb984341664f928c8f109b9ec8323a9aa4346
        <Footer />
      </body>
    </html>
  );
}
