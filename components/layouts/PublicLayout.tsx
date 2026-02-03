'use client';

import { Header } from './Header';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1 bg-slate-950">{children}</main>
    </div>
  );
}
