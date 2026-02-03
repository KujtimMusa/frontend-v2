'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { addToWaitlist } from '@/lib/api';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }

    try {
      setLoading(true);
      await addToWaitlist(email);
      setSuccess(true);
      setEmail('');
      toast.success('Du bist auf der Waitlist!');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Hinzufügen zur Waitlist');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Du bist auf der Waitlist!</h3>
          <p className="text-sm text-muted-foreground">
            Wir melden uns bald bei dir.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="deine@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-600"
      />
      <Button 
        type="submit" 
        className="w-full px-6 py-3 rounded-lg bg-slate-100 hover:bg-white text-slate-900 font-bold transition-colors" 
        disabled={loading}
      >
        {loading ? 'Wird hinzugefügt...' : 'Get Early Access'}
      </Button>
      <p className="text-sm text-center text-slate-500">
        No credit card required. No spam.
      </p>
    </form>
  );
}
