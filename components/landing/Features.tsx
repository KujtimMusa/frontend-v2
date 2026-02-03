'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, DollarSign } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'ML-Preisempfehlungen',
    description:
      'Automatische Preisoptimierung basierend auf Machine Learning und Marktdaten.',
  },
  {
    icon: TrendingUp,
    title: 'Wettbewerber-Tracking',
    description:
      'Echtzeit-Tracking der Preise deiner Konkurrenten für optimale Positionierung.',
  },
  {
    icon: DollarSign,
    title: 'Margen-Optimierung',
    description:
      'Intelligente Berechnung der optimalen Marge für maximale Profitabilität.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Alles was du brauchst für optimale Preise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
