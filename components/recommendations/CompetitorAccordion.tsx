'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CompetitorPrice } from '@/types/models';

interface CompetitorAccordionProps {
  productId: number;
  competitors: CompetitorPrice[];
  onRefresh?: () => Promise<void>;
}

export function CompetitorAccordion({
  productId,
  competitors,
  onRefresh,
}: CompetitorAccordionProps) {
  const [loading, setLoading] = useState(false);

  const avgPrice =
    competitors.length > 0
      ? competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length
      : 0;

  const handleRefresh = async () => {
    if (!onRefresh) return;
    try {
      setLoading(true);
      await onRefresh();
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="competitors">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span>Wettbewerber-Preise ({competitors.length})</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            {competitors.map((comp, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{comp.title || comp.source}</p>
                  <p className="text-sm text-muted-foreground">
                    €{comp.price.toFixed(2)} · Stand:{' '}
                    {new Date(comp.scraped_at).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href={comp.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            ))}

            {competitors.length > 0 && (
              <>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Durchschnitt:</span>
                  <span>€{avgPrice.toFixed(2)}</span>
                </div>
              </>
            )}

            {onRefresh && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw
                  className={cn('w-4 h-4 mr-2', loading && 'animate-spin')}
                />
                Aktualisieren
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
