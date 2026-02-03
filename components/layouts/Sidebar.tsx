'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Lightbulb,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const isDemo = pathname.startsWith('/demo');
  
  const navItems = [
    {
      label: 'Dashboard',
      href: isDemo ? '/demo' : '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Produkte',
      href: isDemo ? '/demo/products' : '/dashboard/products',
      icon: Package,
    },
    {
      label: 'Empfehlungen',
      href: isDemo ? '/demo/recommendations' : '/dashboard/recommendations',
      icon: Lightbulb,
    },
  ];
  
  const handleLogout = () => {
    // Clear auth
    logout();
    // Redirect to landing
    router.push('/landing');
  };
  
  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Shop Selector */}
      <div className="p-6 border-b border-slate-800">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Aktiver Shop
        </div>
        <button
          onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-200">Demo Shop</span>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-slate-400 transition-transform",
            shopDropdownOpen && "rotate-180"
          )} />
        </button>
        
        {/* Shop Dropdown */}
        {shopDropdownOpen && (
          <div className="mt-2 p-2 rounded-lg bg-slate-800 border border-slate-700">
            <button className="w-full px-3 py-2 rounded-lg hover:bg-slate-700 text-left text-sm text-slate-300 transition-colors">
              Demo Shop
            </button>
            <Link
              href="/shops/connect"
              className="block px-3 py-2 rounded-lg hover:bg-slate-700 text-sm text-slate-300 transition-colors"
            >
              + Neuen Shop verbinden
            </Link>
          </div>
        )}
      </div>
      
      {/* Navigation - ELEGANT ACTIVE STATE */}
      <nav className="flex-1 p-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                  isActive
                    ? "bg-slate-800/50 text-slate-200"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                )}
              >
                {/* Subtle Left Border Accent (nur wenn active) */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-600 rounded-r-full" />
                )}
                
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      {/* User Profile */}
      <div className="p-6 border-t border-slate-800">
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-slate-300 font-bold text-sm">
                U
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
            </div>
            
            {/* Info */}
            <div className="flex-1 text-left">
              <div className="text-sm font-semibold text-slate-200">
                Demo User
              </div>
              <div className="text-xs text-slate-500">
                demo@vlerafy.com
              </div>
            </div>
            
            <ChevronDown className={cn(
              "w-4 h-4 text-slate-400 transition-transform",
              userDropdownOpen && "rotate-180"
            )} />
          </button>
          
          {/* Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-50">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                <User className="w-4 h-4" />
                Profil
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                <Settings className="w-4 h-4" />
                Einstellungen
              </Link>
              <div className="my-1 h-px bg-slate-700" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-900/20 text-red-400 text-sm w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Ausloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
