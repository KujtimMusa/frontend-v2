'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { calculateMargin, saveProductCosts, getProductCosts } from '@/lib/api';
import type { ProductCostData, MarginCalculationResult } from '@/types/models';

interface MarginCalculatorProps {
  productId: string;
  currentPrice: number;
  onCostsSave: (costs: ProductCostData) => Promise<void>;
  onCalculate: (price: number) => Promise<MarginCalculationResult>;
}

export function MarginCalculator({
  productId,
  currentPrice,
  onCostsSave,
  onCalculate,
}: MarginCalculatorProps) {
  const [costs, setCosts] = useState({
    purchase: 0,
    shipping: 0,
    packaging: 0,
  });
  const [price, setPrice] = useState(currentPrice);
  const [marginResult, setMarginResult] = useState<MarginCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing costs
    getProductCosts(productId).then((data) => {
      if (data) {
        setCosts({
          purchase: data.purchase_cost,
          shipping: data.shipping_cost,
          packaging: data.packaging_cost,
        });
      }
    });
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (price > 0 && costs.purchase > 0) {
        calculateMargin();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [price, costs]);

  const calculateMargin = async () => {
    try {
      setLoading(true);
      const result = await onCalculate(price);
      setMarginResult(result);
    } catch (error) {
      // Silent fail for live calculation
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const costData: ProductCostData = {
        purchase_cost: costs.purchase,
        shipping_cost: costs.shipping,
        packaging_cost: costs.packaging,
        payment_provider: 'stripe',
        country_code: 'DE',
      };
      await onCostsSave(costData);
      toast.success('Kosten gespeichert');
    } catch (error: any) {
      toast.error(error.message || 'Fehler beim Speichern');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Margin Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Einkaufspreis (netto)</Label>
          <Input
            type="number"
            value={costs.purchase || ''}
            onChange={(e) =>
              setCosts({ ...costs, purchase: parseFloat(e.target.value) || 0 })
            }
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>Versandkosten</Label>
          <Input
            type="number"
            value={costs.shipping || ''}
            onChange={(e) =>
              setCosts({ ...costs, shipping: parseFloat(e.target.value) || 0 })
            }
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>Verkaufspreis (brutto)</Label>
          <Input
            type="number"
            value={price || ''}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <Separator />

        {marginResult && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Profit:</span>
              <span className="font-bold text-success">
                €{marginResult.margin.euro.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Margin:</span>
              <span className="font-bold text-success">
                {marginResult.margin.percent.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Break-Even:</span>
              <span>€{marginResult.break_even_price.toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button className="w-full" onClick={handleSave} disabled={loading}>
          {loading ? 'Speichere...' : 'Kosten speichern'}
        </Button>
      </CardContent>
    </Card>
  );
}
