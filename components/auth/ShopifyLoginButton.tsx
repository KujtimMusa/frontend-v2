'use client';

import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/api';
import { ShoppingBag } from 'lucide-react';

interface ShopifyLoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ShopifyLoginButton({
  variant = 'default',
  size = 'default',
  className,
}: ShopifyLoginButtonProps) {
  const handleLogin = () => {
    // Redirect zu Shopify OAuth
    const shopifyAuthUrl = `${API_URL}/auth/shopify/install`;
    window.location.href = shopifyAuthUrl;
  };

  return (
    <Button variant={variant} size={size} onClick={handleLogin} className={className}>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Mit Shopify verbinden
    </Button>
  );
}
