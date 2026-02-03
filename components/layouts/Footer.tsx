'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-bold text-slate-100 mb-4">Vlerafy</div>
            <p className="text-sm text-slate-400">
              KI-Preisoptimierung für Shopify
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/imprint" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Imprint
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-100 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@vlerafy.com" className="text-slate-400 hover:text-slate-100 transition-colors">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          © 2026 Vlerafy · Made with <span className="text-slate-100">❤️</span>
        </div>
      </div>
    </footer>
  );
}
