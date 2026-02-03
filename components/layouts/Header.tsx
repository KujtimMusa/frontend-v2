'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-100">Vlerafy</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-slate-300 hover:text-slate-100 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800" asChild>
            <Link href="/demo">Try Demo</Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-slate-100 hover:bg-white text-slate-900 font-bold"
            asChild
          >
            <Link href="/auth/shopify/login">Login mit Shopify</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
