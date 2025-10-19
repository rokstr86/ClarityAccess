// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/10 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} ClarityAccess. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <a href="mailto:support@clarityaccess.co" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
