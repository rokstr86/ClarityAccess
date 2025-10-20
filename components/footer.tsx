import Link from "next/link";

/**
 * Footer component - provides site footer with links
 * 
 * TODO: Implement these pages:
 * - /privacy - Privacy policy page
 * - /terms - Terms of service page
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/10 py-10 text-slate-400">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>© {currentYear} ClarityAccess. All rights reserved.</p>
        <nav aria-label="Footer navigation">
          <div className="flex gap-6">
            <Link 
              href="/privacy" 
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
            <a 
              href="mailto:support@clarityaccess.co" 
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}
