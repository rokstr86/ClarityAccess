"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan" },
  { href: "/pricing", label: "Pricing" },
];

/**
 * Navbar component - provides site navigation
 */
export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-slate-200/10 bg-[#0b0f16]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b0f16]/60">
      <nav 
        className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link 
          href="/" 
          className="font-extrabold tracking-tight text-white text-xl hover:opacity-90 transition-opacity"
          aria-label="ClarityAccess home"
        >
          ClarityAccess
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm ${
                pathname === l.href ? "text-white font-semibold" : "text-slate-300 hover:text-white"
              } transition-colors`}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/scan"
            className="rounded-lg bg-white text-black text-sm px-3 py-2 font-semibold hover:opacity-90 transition-opacity"
          >
            Try it free
          </Link>
        </div>
      </nav>
    </header>
  );
}
