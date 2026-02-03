'use client';

import { ArrowRight, Sparkles, TrendingUp, Users, DollarSign, ShoppingCart, CheckCircle2, Zap, Euro, Percent, BarChart3, ArrowUp, Lightbulb, Package, Eye } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Hero() {
  const [animatedRevenue, setAnimatedRevenue] = useState(0);
  const [animatedShops, setAnimatedShops] = useState(0);
  
  // Animate numbers
  useEffect(() => {
    const revenueTarget = 24;
    const shopsTarget = 500;
    const duration = 2000;
    const steps = 60;
    
    let currentRevenue = 0;
    let currentShops = 0;
    
    const timer = setInterval(() => {
      currentRevenue += revenueTarget / steps;
      currentShops += shopsTarget / steps;
      
      if (currentRevenue >= revenueTarget) {
        setAnimatedRevenue(revenueTarget);
        setAnimatedShops(shopsTarget);
        clearInterval(timer);
      } else {
        setAnimatedRevenue(Math.floor(currentRevenue));
        setAnimatedShops(Math.floor(currentShops));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);
  
  // Bar chart heights (percentage)
  const chartHeights = [45, 62, 38, 71, 55, 68, 52];
  
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* ✅ Background Effects - KEIN GRID! */}
      <div className="absolute inset-0">
        {/* Gradient Orbs - SUBTIL */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-slate-800/10 rounded-full blur-3xl animate-pulse [animation-delay:1.5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-700/5 rounded-full blur-3xl" />
        
        {/* ❌ GRID WEG! */}
      </div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: Content */}
          <div className="max-w-2xl space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 group hover:border-slate-700/50 transition-all">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-sm font-medium text-slate-300">
                KI-powered Pricing Automation
              </span>
              <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" strokeWidth={2} />
            </div>
            
            {/* ✅ Headline mit GRADIENT - MEHR SPACING */}
            <h1 className="space-y-2">
              <div className="text-6xl font-bold text-white leading-tight tracking-tight">
                Maximiere
              </div>
              <div className="text-6xl font-bold text-white leading-tight tracking-tight">
                deinen
              </div>
              
              {/* ✅ GRADIENT AUF "SHOPIFY UMSATZ" */}
              <div className="text-6xl font-bold leading-tight tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Shopify Umsatz
              </div>
            </h1>
            
            {/* ✅ Subheadline - MEHR SPACING */}
            <div className="space-y-4">
              <p className="text-lg text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">vlerafy</span> analysiert{' '}
                <span className="font-semibold text-white">80+ Marktfaktoren</span>{' '}
                in Echtzeit und gibt dir KI-gestützte Preisempfehlungen.
              </p>
              <p className="text-base text-slate-400">
                Mehr Umsatz, bessere Margen – vollautomatisch.
              </p>
            </div>
            
            {/* ✅ CTA Buttons - MEHR SPACING */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <Link
                href="/auth/shopify/login"
                className="group relative flex items-center gap-2 px-6 py-4 rounded-xl bg-white text-slate-950 font-semibold hover:bg-slate-100 transition-all shadow-xl shadow-white/10 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  <Sparkles className="w-5 h-5" strokeWidth={2.5} />
                  Login mit Shopify
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                </span>
              </Link>
              
              <Link
                href="/demo"
                className="group flex items-center gap-2 px-6 py-4 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-900 hover:border-slate-600/50 text-slate-200 font-semibold transition-all"
              >
                Try Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
              </Link>
            </div>
            
            {/* ✅ Trust Badges - MEHR SPACING */}
            <div className="flex flex-wrap items-center gap-6 pt-6">
              {[
                'Keine Kreditkarte nötig',
                '14 Tage kostenlos',
                'Jederzeit kündbar'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-400 group">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                  {text}
                </div>
              ))}
            </div>
          </div>
          
          {/* RIGHT: ECHTES DASHBOARD PREVIEW */}
          <div className="relative">
            {/* Main Dashboard Card */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-br from-slate-800/30 to-slate-700/20 blur-3xl rounded-3xl" />
              
              {/* Card Container */}
              <div className="relative rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/50 p-1.5 shadow-2xl">
                {/* Dashboard Content */}
                <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 p-6 overflow-hidden">
                  {/* ✅ DASHBOARD HEADER */}
                  <div className="mb-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-slate-400" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">Demo Dashboard</h3>
                        <p className="text-xs text-slate-500">Live-Vorschau mit echten Daten</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ TOP METRICS - GENAU WIE IM ECHTEN DASHBOARD */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Umsatz */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        <span className="text-xs text-slate-600 uppercase tracking-wider font-medium">
                          Umsatz
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        €5,234.56
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <TrendingUp className="w-3 h-3" strokeWidth={2} />
                        +12.5%
                      </div>
                    </div>
                    
                    {/* Produkte */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        <span className="text-xs text-slate-600 uppercase tracking-wider font-medium">
                          Produkte
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        24
                      </div>
                      <div className="text-xs text-slate-500">
                        Analysiert
                      </div>
                    </div>
                    
                    {/* Preisempfehlungen */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        <span className="text-xs text-slate-600 uppercase tracking-wider font-medium">
                          Empfehlungen
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        8
                      </div>
                      <div className="text-xs text-amber-400">
                        Offen
                      </div>
                    </div>
                    
                    {/* Durchschnittliche Marge */}
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="w-4 h-4 text-slate-600" strokeWidth={2} />
                        <span className="text-xs text-slate-600 uppercase tracking-wider font-medium">
                          Ø Marge
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        23.4%
                      </div>
                      <div className="flex items-center gap-1 text-xs text-emerald-400">
                        <TrendingUp className="w-3 h-3" strokeWidth={2} />
                        +2.1%
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ UNGENUTZTES POTENZIAL - WIE IM ECHTEN DASHBOARD */}
                  <div className="mb-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-400" strokeWidth={2} />
                        <h4 className="text-sm font-semibold text-white">Ungenutztes Potenzial</h4>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <TrendingUp className="w-3 h-3 text-emerald-400" strokeWidth={2} />
                        <span className="text-xs font-semibold text-emerald-400">+12.5%</span>
                      </div>
                    </div>
                    
                    <div className="text-3xl font-bold text-white mb-2">
                      €5,234.56
                    </div>
                    
                    <div className="text-xs text-slate-500 mb-4">
                      Potenzielle Umsatzsteigerung bei Umsetzung aller Empfehlungen
                    </div>
                    
                    {/* Breakdown */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="text-slate-400">Wettbewerb</span>
                        </div>
                        <span className="font-mono text-slate-300">85%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="text-slate-400">Nachfrage</span>
                        </div>
                        <span className="font-mono text-slate-300">72%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500" />
                          <span className="text-slate-400">Marge</span>
                        </div>
                        <span className="font-mono text-slate-300">65%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* ✅ CTA BUTTON */}
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:bg-slate-900 text-slate-300 hover:text-white font-medium transition-all">
                    Alle Empfehlungen ansehen
                    <ArrowRight className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
