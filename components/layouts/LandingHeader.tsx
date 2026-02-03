'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - vlerafy in lowercase */}
          <Link href="/" className="flex items-center gap-2 group">
            {/* Icon mit Glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* Brand Name - alles klein! */}
            <span className="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              vlerafy
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/landing#features" 
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              Features
            </Link>
            <Link 
              href="/landing#pricing" 
              className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
            >
              Pricing
            </Link>
          </nav>
          
          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
            >
              Try Demo
            </Link>
            <Link
              href="/auth/shopify/login"
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Login mit Shopify
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
