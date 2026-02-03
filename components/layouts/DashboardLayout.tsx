'use client';

import { Sidebar } from './Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';

export function DashboardLayout({
  children,
  requireAuth = true,
}: {
  children: React.ReactNode;
  requireAuth?: boolean;
}) {
  return (
    <AuthGuard requireAuth={requireAuth}>
      <div className="min-h-screen flex bg-slate-950">
        <Sidebar />
        <main className="flex-1 bg-slate-950">{children}</main>
      </div>
    </AuthGuard>
  );
}
