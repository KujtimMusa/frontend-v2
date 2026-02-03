'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProductCostData } from '@/types/models';

interface CostInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  currentPrice: number;
  existingCosts?: ProductCostData | null;
  onSave: (costs: ProductCostData) => Promise<void>;
}

export function CostInputModal({
  isOpen,
  onClose,
  productId,
  productTitle,
  currentPrice,
  existingCosts,
  onSave,
}: CostInputModalProps) {
  const [costs, setCosts] = useState({
    purchase_cost: existingCosts?.purchase_cost || 0,
    shipping_cost: existingCosts?.shipping_cost || 0,
    packaging_cost: existingCosts?.packaging_cost || 0,
    payment_provider: existingCosts?.payment_provider || 'stripe',
    country_code: existingCosts?.country_code || 'DE',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingCosts) {
      setCosts({
        purchase_cost: existingCosts.purchase_cost,
        shipping_cost: existingCosts.shipping_cost,
        packaging_cost: existingCosts.packaging_cost,
        payment_provider: existingCosts.payment_provider,
        country_code: existingCosts.country_code,
      });
    }
  }, [existingCosts]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(costs);
      onClose();
    } catch (error) {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kosten für {productTitle}</DialogTitle>
          <DialogDescription>
            Trage die Kosten für dieses Produkt ein, um präzise Margen-Berechnungen zu erhalten.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Einkaufspreis (netto) *</Label>
              <Input
                type="number"
                step="0.01"
                value={costs.purchase_cost || ''}
                onChange={(e) =>
                  setCosts({ ...costs, purchase_cost: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Versandkosten</Label>
              <Input
                type="number"
                step="0.01"
                value={costs.shipping_cost || ''}
                onChange={(e) =>
                  setCosts({ ...costs, shipping_cost: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Verpackungskosten</Label>
              <Input
                type="number"
                step="0.01"
                value={costs.packaging_cost || ''}
                onChange={(e) =>
                  setCosts({ ...costs, packaging_cost: parseFloat(e.target.value) || 0 })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Provider</Label>
              <Select
                value={costs.payment_provider}
                onValueChange={(value) => setCosts({ ...costs, payment_provider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="shopify_payments">Shopify Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Land</Label>
              <Select
                value={costs.country_code}
                onValueChange={(value) => setCosts({ ...costs, country_code: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DE">Deutschland (19% MwSt)</SelectItem>
                  <SelectItem value="AT">Österreich (20% MwSt)</SelectItem>
                  <SelectItem value="CH">Schweiz (7.7% MwSt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Speichere...' : 'Speichern'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
