'use client';

import { Eye, ArrowRight, Settings2 } from 'lucide-react';
import Link from 'next/link';

export function DemoBanner() {
  const shopifyInstallUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/shopify/install`;

  return (
    <div className="rounded-xl bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon - Elegant */}
          <div className="w-14 h-14 rounded-xl bg-slate-800/50 flex items-center justify-center">
            <Eye className="w-7 h-7 text-slate-400" strokeWidth={1.5} />
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-white">
                Demo Dashboard
              </h2>
              {/* Badge - Subtle */}
              <span className="px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-semibold text-slate-400">
                Vorschaumodus
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Erkunde alle Features mit beispielhaften Daten
            </p>
          </div>
        </div>
        
        {/* CTA Button - Elegant */}
        <Link
          href={shopifyInstallUrl}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-200 font-medium transition-all group"
        >
          <Settings2 className="w-4 h-4" strokeWidth={2} />
          <span className="text-sm">Jetzt mit eigenem Shop verbinden</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}
