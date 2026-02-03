'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShoppingBag, AlertCircle } from 'lucide-react';

export default function ShopifyLoginPage() {
  const [shopDomain, setShopDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateAndCleanDomain = (domain: string): string | null => {
    if (!domain.trim()) {
      setError('Please enter your Shopify store domain');
      return null;
    }

    // Remove http:// or https://
    let cleaned = domain.trim().toLowerCase();
    cleaned = cleaned.replace(/^https?:\/\//, '');
    cleaned = cleaned.replace(/\/$/, '');
    
    // Add .myshopify.com if not present
    if (!cleaned.includes('.')) {
      cleaned = `${cleaned}.myshopify.com`;
    }
    
    // Validate format
    if (!cleaned.includes('.') || cleaned.length < 3) {
      setError('Please enter a valid Shopify store domain');
      return null;
    }

    return cleaned;
  };

  const handleLogin = async () => {
    setError('');
    
    const cleanDomain = validateAndCleanDomain(shopDomain);
    if (!cleanDomain) return;

    setIsLoading(true);

    try {
      // Redirect to Backend OAuth
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const installUrl = `${apiUrl}/auth/shopify/install?shop=${cleanDomain}`;
      
      // Show loading toast
      toast.loading('Connecting to Shopify...', { id: 'shopify-login' });
      
      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect
      window.location.href = installUrl;
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to connect. Please try again.', { id: 'shopify-login' });
      setError('Connection failed. Please check your domain and try again.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Connect Your Shopify Store
          </CardTitle>
          <CardDescription className="text-slate-400">
            Enter your Shopify store domain to get started with AI-powered pricing optimization
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="shop-domain" className="text-sm font-medium text-slate-300">
              Store Domain
            </label>
            <Input
              id="shop-domain"
              type="text"
              placeholder="your-store.myshopify.com"
              value={shopDomain}
              onChange={(e) => {
                setShopDomain(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="w-full bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            />
            {error && (
              <div className="flex items-start gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <p className="text-xs text-slate-500">
              We'll redirect you to Shopify to authorize the connection
            </p>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={isLoading || !shopDomain.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect with Shopify'
            )}
          </Button>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-center text-slate-500">
              By connecting, you agree to our Terms of Service and Privacy Policy.
              <br />
              We'll never access your data without permission.
            </p>
          </div>

          {/* Demo Link */}
          <div className="text-center">
            <a 
              href="/demo" 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Try Demo Instead →
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
