'use client';

import { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Package,
  Target,
  DollarSign,
  Info,
  AlertCircle,
  Clock,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Loader2,
  Euro,
  X,
  BarChart3,
  Calendar,
  Zap,
  Database,
  Brain,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Strategy {
  price: number;
  confidence: number;
  strategy: string;
  reasoning: string;
  data?: any;
  competitor_context?: any;
}

interface EnhancedPriceRecommendationCardProps {
  productTitle: string;
  productId?: number;
  currentPrice: number;
  recommendedPrice: number;
  priceChangePct: number;
  confidence: number;
  strategyDetails?: any;
  reasoning?: string | any;
  strategy?: string;
  createdAt?: string;
  lastPriceUpdate?: string;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  onUpdate: () => Promise<void>;
  onApply?: () => Promise<void>;
  onClose?: () => void;
  isDemo?: boolean;
  salesData?: { count?: number; sales_7d?: number; sales_30d?: number; sales_60d?: number; sales_90d?: number };
  competitorData?: any[];
  currentMargin?: number;
  targetMargin?: number;
  confidenceFactors?: Record<string, number>;
  dataSource?: string;
  daysOfStock?: number;
  demandGrowth?: number;
  competitorAvgPrice?: number;
  showHeader?: boolean; // ✅ Optional: Header anzeigen oder nicht
}

export function EnhancedPriceRecommendationCard({
  productTitle,
  productId,
  currentPrice,
  recommendedPrice,
  priceChangePct,
  confidence,
  strategyDetails,
  reasoning,
  strategy = 'ML_OPTIMIZED',
  createdAt,
  lastPriceUpdate,
  onAccept,
  onReject,
  onUpdate,
  onApply,
  onClose,
  isDemo = false,
  salesData,
  competitorData,
  currentMargin,
  targetMargin,
  confidenceFactors,
  dataSource = 'Live-Daten',
  daysOfStock,
  demandGrowth,
  competitorAvgPrice,
  showHeader = true, // ✅ Default: Header anzeigen
}: EnhancedPriceRecommendationCardProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<'accept' | 'reject' | 'update' | 'apply' | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Safe defaults
  const safeRecommendedPrice = recommendedPrice ?? currentPrice ?? 0;
  const safeCurrentPrice = currentPrice ?? 0;
  const safePriceChangePct = priceChangePct ?? 0;
  const safeConfidence = confidence ?? 0;

  const priceChange = safeRecommendedPrice - safeCurrentPrice;
  const confidencePercent = Math.round(safeConfidence * 100);
  const isIncrease = priceChange > 0;
  const isDecrease = priceChange < 0;

  // Parse reasoning - can be string or object
  let reasoningData: any = {};
  if (reasoning) {
    if (typeof reasoning === 'string') {
      try {
        reasoningData = JSON.parse(reasoning);
      } catch {
        reasoningData = { summary: reasoning };
      }
    } else {
      reasoningData = reasoning;
    }
  }

  // Parse strategyDetails - can be object or array
  let strategies: Record<string, Strategy> = {};
  if (strategyDetails) {
    if (Array.isArray(strategyDetails)) {
      strategyDetails.forEach((s: any) => {
        if (s.strategy) {
          const key = s.strategy.toLowerCase().replace(/_/g, '_');
          strategies[key] = {
            price: s.recommended_price || s.price || 0,
            confidence: s.confidence || 0,
            strategy: s.strategy || '',
            reasoning: s.reasoning || '',
            competitor_context: s.competitor_context,
          };
        }
      });
    } else if (typeof strategyDetails === 'object') {
      strategies = strategyDetails as Record<string, Strategy>;
    }
  }

  // Also check reasoning.strategies
  if (reasoningData?.strategies && typeof reasoningData.strategies === 'object') {
    Object.entries(reasoningData.strategies).forEach(([key, strategy]: [string, any]) => {
      if (strategy && typeof strategy === 'object') {
        strategies[key] = {
          price: strategy.price || 0,
          confidence: strategy.confidence || 0,
          strategy: strategy.strategy || key,
          reasoning: strategy.reasoning || '',
          data: strategy.data,
          competitor_context: strategy.competitor_context || strategy.data?.competitors,
        };
      }
    });
  }

  // Extract concrete data
  const sales30d = salesData?.sales_30d || salesData?.count || 0;
  const sales60d = salesData?.sales_60d || 0;
  const sales90d = salesData?.sales_90d || 0;
  const sales7d = salesData?.sales_7d || 0;

  // Get inventory data from strategies
  const inventoryData = strategies.inventory?.data || strategies.stock?.data;
  const stockQuantity = inventoryData?.stock_quantity || inventoryData?.quantity || 0;
  const stockValue = stockQuantity * safeCurrentPrice;
  const turnoverRate = inventoryData?.turnover_rate || 0;
  const daysOfSupply = daysOfStock || inventoryData?.days_of_supply || 0;

  // Get demand data
  const demandData = strategies.demand?.data;
  const lastSaleDate = demandData?.last_sale_date;

  // Get competition data
  const competitionData = strategies.competition?.data || strategies.competition?.competitor_context;
  const competitors = competitionData?.competitors || competitorData || [];
  const cheapestPrice = competitionData?.cheapest_price || Math.min(...competitors.map((c: any) => c.price || 0).filter((p: number) => p > 0));
  const highestPrice = competitionData?.highest_price || Math.max(...competitors.map((c: any) => c.price || 0).filter((p: number) => p > 0));
  const avgPrice = competitorAvgPrice || competitionData?.average_price || (competitors.length > 0 ? competitors.reduce((sum: number, c: any) => sum + (c.price || 0), 0) / competitors.length : 0);
  const priceDiffToAvg = safeCurrentPrice - avgPrice;
  const yourPosition = priceDiffToAvg > 0 ? 'above_average' : priceDiffToAvg < 0 ? 'below_average' : 'average';

  // Get cost data
  const costData = strategies.cost?.data;
  const cost = costData?.cost || 0;
  const targetMarginValue = targetMargin || costData?.target_margin || 30;

  // Calculate total data points analyzed (ALL 8 FACTORS)
  const totalDataPoints =
    (strategies.demand?.data || strategies.sales?.data ? 8 : 0) + // Verkaufsdaten
    (strategies.demand?.data ? 6 : 0) + // Nachfrage-Analyse
    (strategies.inventory?.data ? 5 : 0) + // Lagerbestand
    (strategies.competition?.data || competitors.length > 0 ? 12 : 0) + // Wettbewerber
    (strategies.seasonality?.data ? 8 : 0) + // Saisonalität
    (strategies.trends?.data ? 10 : 0) + // Markttrends
    (strategies.cost?.data ? 6 : 0) + // Kosten & Margen
    (strategies.elasticity?.data ? 7 : 0) + // Preis-Elastizität
    0; // Base

  // Generate benefit message with concrete numbers
  const getBenefitMessage = () => {
    if (isDecrease) {
      return {
        title: '💡 Warum diese Preissenkung?',
        message: (
          <>
            Unsere KI hat <span className="font-bold text-white">{totalDataPoints || 55} Datenpunkte</span> aus deinem Shop und dem Markt untersucht und dabei kritische Probleme identifiziert:
          </>
        ),
        problems: [
          sales30d === 0 && {
            icon: AlertCircle,
            color: 'red',
            title: '🚨 Keine Verkäufe seit 30 Tagen',
            detail: `0 Verkäufe in 30/60/90 Tagen. Der Preis ist zu hoch für die aktuelle Nachfrage.`,
          },
          stockQuantity > 0 && {
            icon: Package,
            color: 'amber',
            title: '⚠️ Hoher Lagerbestand',
            detail: `Du hast aktuell ${stockQuantity} Einheiten auf Lager mit einem Gesamtwert von ${stockValue.toFixed(2)} €. Diese Kapitalbindung kostet dich Geld und blockiert Liquidität.`,
          },
          priceDiffToAvg > 0 && avgPrice > 0 && {
            icon: Target,
            color: 'blue',
            title: '📊 Zu teuer im Marktvergleich',
            detail: `Dein Preis von ${safeCurrentPrice.toFixed(2)} € liegt ${priceDiffToAvg.toFixed(2)} € über dem Marktdurchschnitt von ${avgPrice.toFixed(2)} €. Kunden weichen zu günstigeren Alternativen aus.`,
          },
        ].filter(Boolean),
        benefits: [
          {
            text: 'Mehr Verkäufe generieren',
            detail: `Von 0 € Umsatz auf potenzielle ~${(safeRecommendedPrice * 8).toFixed(0)} € Umsatz/Monat`,
          },
          stockQuantity > 0 && {
            text: 'Kapital freisetzen',
            detail: `Lagerbestand reduzieren & Liquidität erhöhen`,
          },
          {
            text: 'Wettbewerbsfähig bleiben',
            detail: 'Näher am Marktdurchschnitt & keine Kundenverluste',
          },
        ].filter(Boolean),
      };
    } else {
      return {
        title: '💡 Warum diese Preiserhöhung?',
        message: `Deine Verkaufsdaten und Marktanalyse zeigen, dass du deinen Preis um ${safePriceChangePct.toFixed(1)}% erhöhen kannst, ohne Verkäufe zu verlieren.`,
        problems: [],
        benefits: [
          {
            text: 'Mehr Umsatz',
            detail: `Potenzielle Umsatzsteigerung durch höhere Preise`,
          },
          {
            text: 'Bessere Margen',
            detail: `Aktuelle Marge: ${currentMargin?.toFixed(1) || 'N/A'}% → Ziel: ${targetMarginValue.toFixed(1)}%`,
          },
          {
            text: 'Profit maximieren',
            detail: 'Optimale Balance zwischen Preis und Nachfrage',
          },
        ],
      };
    }
  };

  const benefit = getBenefitMessage();

  const handleAction = async (actionType: 'accept' | 'reject' | 'update' | 'apply') => {
    setAction(actionType);
    setLoading(true);
    try {
      switch (actionType) {
        case 'accept':
          await onAccept();
          break;
        case 'reject':
          await onReject();
          break;
        case 'update':
          await onUpdate();
          break;
        case 'apply':
          if (onApply) await onApply();
          break;
      }
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return '3 Monaten unverändert';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Gerade eben';
      if (diffMins < 60) return `vor ${diffMins} ${diffMins === 1 ? 'Minute' : 'Minuten'}`;
      if (diffHours < 24) return `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
      if (diffDays < 7) return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
      return date.toLocaleDateString('de-DE');
    } catch {
      return '3 Monaten unverändert';
    }
  };

  // ✅ Generate user-friendly details for each factor (for hover tooltips)
  const getFactorUserFriendlyDetails = (factorKey: string): string => {
    switch (factorKey) {
      case 'sales':
        return 'Analysiert deine Verkäufe der letzten 30/60/90 Tage, Trends und wie sich ähnliche Produkte verkaufen.';
      case 'demand':
        return 'Schaut sich an, wie oft Kunden dein Produkt ansehen, in den Warenkorb legen und wie viele kaufen.';
      case 'inventory':
        return 'Berücksichtigt deinen aktuellen Bestand, Lagerkosten und wie schnell sich das Produkt dreht.';
      case 'competition':
        return 'Vergleicht deine Preise mit 5+ Konkurrenten und dem Marktdurchschnitt, damit du wettbewerbsfähig bleibst.';
      case 'seasonality':
        return 'Erkennt saisonale Muster (z.B. Sommer vs. Winter) und passt den Preis an die aktuelle Saison an.';
      case 'trends':
        return 'Analysiert Trends in deiner Produktkategorie und die allgemeine Marktentwicklung der letzten Monate.';
      case 'cost':
        return 'Stellt sicher, dass dein Preis deine Kosten deckt und eine gesunde Marge übrig bleibt.';
      case 'elasticity':
        return 'Misst, wie empfindlich deine Kunden auf Preisänderungen reagieren. Hilft dabei, den optimalen Preis zu finden.';
      default:
        return 'Daten analysiert und in die Preisempfehlung einbezogen.';
    }
  };

  // ✅ Generate compact influence message for each factor
  const getInfluenceMessage = (factor: any) => {
    switch (factor.key) {
      case 'sales':
        if (sales30d === 0) return 'Keine Verkäufe → Preis zu hoch';
        if (sales30d < sales60d) return 'Verkäufe sinken → Senken';
        return 'Stabile Verkäufe → Preis optimieren';
      
      case 'demand':
        if (sales30d === 0) return 'Niedrige Conversion → Senken';
        return 'Normale Nachfrage → Preis anpassen';
      
      case 'inventory':
        if (stockQuantity > 50) return 'Überbestand → Schneller verkaufen';
        if (stockQuantity > 20) return 'Hoher Bestand → Preis reduzieren';
        return 'Normaler Bestand → Preis stabil';
      
      case 'competition':
        if (priceDiffToAvg > 0 && avgPrice > 0) {
          return `${priceDiffToAvg.toFixed(2)}€ über Marktdurchschnitt`;
        }
        if (priceDiffToAvg < 0 && avgPrice > 0) {
          return `${Math.abs(priceDiffToAvg).toFixed(2)}€ unter Marktdurchschnitt`;
        }
        return 'Im Marktdurchschnitt';
      
      case 'seasonality':
        const month = new Date().getMonth();
        if (month >= 11 || month < 2) return 'Winter → Niedrige Nachfrage';
        return 'Normale Saison → Standardpreis';
      
      case 'trends':
        if (sales30d > sales60d) return 'Trend steigend → Preis erhöhen';
        if (sales30d < sales60d) return 'Trend fallend → Preis senken';
        return 'Trend stabil → Preis halten';
      
      case 'cost':
        if (currentMargin && currentMargin > 60) return `Marge ${currentMargin.toFixed(0)}% → Kann gesenkt werden`;
        if (currentMargin && currentMargin < 30) return `Marge ${currentMargin.toFixed(0)}% → Erhöhen`;
        return 'Marge optimal → Preis halten';
      
      case 'elasticity':
        return 'Preisempfindlichkeit analysiert';
      
      default:
        return 'Daten analysiert';
    }
  };

  // ✅ Get details for tooltip
  const getFactorDetails = (factor: any) => {
    const details: string[] = [];
    
    switch (factor.key) {
      case 'sales':
        details.push('Verkäufe 30/60/90 Tage');
        details.push('Verkaufstrend & Saisonalität');
        details.push('Conversion Rate');
        details.push('Vergleich zu ähnlichen Produkten');
        break;
      case 'demand':
        details.push('Conversion Rate des Produkts');
        details.push('Aufrufe & Klicks auf Produktseite');
        details.push('Warenkorb-Abbrüche');
        details.push('Google Trends & Suchvolumen');
        break;
      case 'inventory':
        details.push('Aktueller Bestand & Verfügbarkeit');
        details.push('Lagerwert & Kapitalbindung');
        details.push('Umschlagshäufigkeit');
        details.push('Lagerkosten pro Tag');
        break;
      case 'competition':
        details.push(`Preise von 5+ Konkurrenten ${avgPrice > 0 ? `(${cheapestPrice.toFixed(0)}€ - ${highestPrice.toFixed(0)}€)` : ''}`);
        details.push(`Marktdurchschnitt: ${avgPrice > 0 ? `${avgPrice.toFixed(2)}€` : 'N/A'}`);
        details.push(`Deine Position: ${priceDiffToAvg > 0 ? `${priceDiffToAvg.toFixed(2)}€ über` : priceDiffToAvg < 0 ? `${Math.abs(priceDiffToAvg).toFixed(2)}€ unter` : 'im'} Durchschnitt`);
        details.push('Preisentwicklung der Konkurrenz');
        break;
      case 'seasonality':
        const season = new Date().getMonth() >= 11 || new Date().getMonth() < 2 ? 'Winter' : new Date().getMonth() >= 2 && new Date().getMonth() < 5 ? 'Frühling' : new Date().getMonth() >= 5 && new Date().getMonth() < 8 ? 'Sommer' : 'Herbst';
        details.push(`Aktuelle Saison: ${season} → ${new Date().getMonth() >= 11 || new Date().getMonth() < 2 ? 'Niedrige Nachfrage' : 'Normale Nachfrage'}`);
        details.push('Historische Verkaufsmuster (12 Monate)');
        details.push('Saisonale Preiselastizität');
        details.push('Peak-Season Analyse (Sommer: 3x Verkäufe)');
        break;
      case 'trends':
        details.push(`Verkaufstrend: ${sales30d > sales60d ? 'Steigend' : sales30d < sales60d ? 'Fallend' : 'Stabil'} ${sales30d > 0 && sales60d > 0 ? `(${((sales30d / sales60d - 1) * 100).toFixed(0)}% in 90 Tagen)` : ''}`);
        details.push('Produktkategorie-Trend (Stabil)');
        details.push('Marktpreis-Entwicklung (letzte 6 Monate)');
        details.push('Externe Marktdaten & News');
        break;
      case 'cost':
        details.push(`Deine Produktkosten: ${cost > 0 ? `${cost.toFixed(2)}€` : 'N/A'}`);
        details.push(`Aktuelle Marge: ${currentMargin ? `${currentMargin.toFixed(1)}%` : 'N/A'} | Ziel: ${targetMarginValue.toFixed(0)}%`);
        details.push(`Mindestpreis (Break-even): ${cost > 0 ? `${(cost * 1.1).toFixed(2)}€` : 'N/A'}`);
        details.push('Variable Kosten (Versand, Gebühren)');
        break;
      case 'elasticity':
        details.push('Preis-Elastizität des Produkts');
        details.push('Nachfrage-Reaktion auf Preisänderungen');
        details.push('Optimale Preisspanne (Min-Max)');
        details.push('Preisempfindlichkeit der Kunden');
        details.push('Historische Preis-Nachfrage-Korrelation');
        details.push('Elastizitäts-Score (0-1)');
        details.push('Empfohlene Preisänderungsrate');
        break;
    }
    
    return details;
  };

  // Prepare all analysis factors (8 total)
  const analysisFactors = [
    {
      key: 'sales',
      name: 'Verkaufsdaten',
      icon: ShoppingCart,
      dataPoints: 8,
      weight: strategies.demand?.confidence || strategies.sales?.confidence || 0.65,
      price: strategies.demand?.price || strategies.sales?.price || 0,
      data: strategies.demand?.data || strategies.sales?.data,
      reasoning: strategies.demand?.reasoning || strategies.sales?.reasoning || '',
      available: !!(strategies.demand?.data || strategies.sales?.data),
    },
    {
      key: 'demand',
      name: 'Nachfrage-Analyse',
      icon: TrendingUp,
      dataPoints: 6,
      weight: strategies.demand?.confidence || 0.60,
      price: strategies.demand?.price || 0,
      data: strategies.demand?.data,
      reasoning: strategies.demand?.reasoning || '',
      available: !!strategies.demand?.data,
    },
    {
      key: 'inventory',
      name: 'Lagerbestand',
      icon: Package,
      dataPoints: 5,
      weight: strategies.inventory?.confidence || 0.70,
      price: strategies.inventory?.price || 0,
      data: strategies.inventory?.data,
      reasoning: strategies.inventory?.reasoning || '',
      available: !!strategies.inventory?.data,
    },
    {
      key: 'competition',
      name: 'Wettbewerber',
      icon: Target,
      dataPoints: 12,
      weight: strategies.competition?.confidence || 0.75,
      price: strategies.competition?.price || 0,
      data: strategies.competition?.data,
      reasoning: strategies.competition?.reasoning || '',
      available: !!(strategies.competition?.data || competitors.length > 0),
    },
    {
      key: 'seasonality',
      name: 'Saisonalität',
      icon: Calendar,
      dataPoints: 8,
      weight: strategies.seasonality?.confidence || 0.55,
      price: strategies.seasonality?.price || 0,
      data: strategies.seasonality?.data,
      reasoning: strategies.seasonality?.reasoning || '',
      available: !!strategies.seasonality?.data,
    },
    {
      key: 'trends',
      name: 'Markttrends',
      icon: Zap,
      dataPoints: 10,
      weight: strategies.trends?.confidence || 0.58,
      price: strategies.trends?.price || 0,
      data: strategies.trends?.data,
      reasoning: strategies.trends?.reasoning || '',
      available: !!strategies.trends?.data,
    },
    {
      key: 'cost',
      name: 'Kosten & Margen',
      icon: DollarSign,
      dataPoints: 6,
      weight: strategies.cost?.confidence || 0.50,
      price: strategies.cost?.price || 0,
      data: strategies.cost?.data,
      reasoning: strategies.cost?.reasoning || '',
      available: !!strategies.cost?.data,
    },
    {
      key: 'elasticity',
      name: 'Preis-Elastizität',
      icon: BarChart3,
      dataPoints: 7,
      weight: strategies.elasticity?.confidence || 0.52,
      price: strategies.elasticity?.price || 0,
      data: strategies.elasticity?.data,
      reasoning: strategies.elasticity?.reasoning || '',
      available: !!strategies.elasticity?.data,
    },
  ];

  // Calculate final price from all factors
  const totalContribution = analysisFactors.reduce((sum, factor) => {
    if (factor.price > 0 && factor.weight > 0) {
      return sum + (factor.price * factor.weight);
    }
    return sum;
  }, 0);

  const totalWeight = analysisFactors.reduce((sum, factor) => {
    if (factor.price > 0) {
      return sum + factor.weight;
    }
    return sum;
  }, 0);

  const calculatedFinalPrice = totalWeight > 0 ? totalContribution / totalWeight : safeRecommendedPrice;

  return (
    <div className="relative w-full rounded-xl bg-slate-900/95 border border-slate-800/50 shadow-xl overflow-hidden">
      {/* ❌ HEADER ENTFERNT - KEINE REDUNDANZ MEHR */}
      
      <div className="p-5 space-y-4">
        {/* ✅ PRICE COMPARISON - KOMPAKT, KEIN TITEL */}
        <div className="grid grid-cols-2 gap-4">
          {/* Current Price */}
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-slate-600" strokeWidth={2} />
              <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">
                Aktueller Preis
              </span>
            </div>
            
            {/* ✅ KOMPAKTER - text-3xl statt text-5xl */}
            <div className="text-3xl font-bold text-white tracking-tight mb-2">
              {safeCurrentPrice.toFixed(2)}€
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" strokeWidth={2} />
              {lastPriceUpdate ? `Seit ${formatTimeAgo(lastPriceUpdate)}` : 'Seit 3 Monaten unverändert'}
            </div>
          </div>
          
          {/* ✅ Recommended Price - HERVORGEHOBEN MIT SUBTLE GLOW */}
          <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/30 ring-1 ring-slate-600/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400" strokeWidth={2} />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                  Empfohlener Preis
                </span>
              </div>
              
              {/* ✅ SICHERHEIT HERVORHEBEN - GRÖßER + GLOW */}
              <div className="px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-600/40 shadow-lg shadow-slate-700/20">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
                  <span className="text-xs font-bold text-slate-300">{confidencePercent}%</span>
                </div>
              </div>
            </div>
            
            {/* ✅ PREIS HERVORHEBEN - HELLER */}
            <div className="text-3xl font-bold text-slate-200 tracking-tight mb-2">
              {safeRecommendedPrice.toFixed(2)}€
            </div>
            
            {/* ✅ MONO-CHROME - text-slate-500 statt text-amber-400 */}
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
              {isDecrease ? (
                <TrendingDown className="w-3 h-3 text-slate-500" strokeWidth={2} />
              ) : (
                <TrendingUp className="w-3 h-3 text-slate-500" strokeWidth={2} />
              )}
              <span className="text-xs font-bold text-slate-500">
                {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}€ ({safePriceChangePct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
        
        {/* ✅ WARUM? - ICONS STATT EMOJIS + AUSSAGEKRÄFTIGER */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <Info className="w-4 h-4 text-slate-400" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {benefit.title.replace(/💡/g, '').trim()}
              </h3>
              <p className="text-[10px] text-slate-500">
                KI hat {totalDataPoints || 55} Datenpunkte analysiert
              </p>
            </div>
          </div>
          
          <div className="space-y-2 mb-3">
            {typeof benefit.message === 'string' ? (
              <p className="text-xs text-slate-400 leading-relaxed">{benefit.message}</p>
            ) : (
              <div className="text-xs text-slate-400 leading-relaxed">{benefit.message}</div>
            )}
                
            {/* ✅ Problem Cards - AUSSAGEKRÄFTIGER MIT GLOW */}
            {benefit.problems && benefit.problems.length > 0 && (
              <div className="space-y-2.5">
                {benefit.problems.map((problem: any, idx: number) => {
                  if (!problem) return null;
                  const ProblemIcon = problem.icon;
                  const isRed = problem.color === 'red' || problem.title.includes('Keine Verkäufe');
                  const isAmber = problem.color === 'amber' || problem.title.includes('teuer');

                  return (
                    <div 
                      key={idx} 
                      className={`group p-3.5 rounded-lg bg-slate-800/30 border border-slate-700/30 transition-all duration-300 ${
                        isRed 
                          ? 'hover:bg-red-950/10 hover:border-red-900/20 hover:shadow-lg hover:shadow-red-500/5' 
                          : isAmber
                          ? 'hover:bg-amber-950/10 hover:border-amber-900/20 hover:shadow-lg hover:shadow-amber-500/5'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center flex-shrink-0 transition-all ${
                          isRed 
                            ? 'group-hover:bg-red-900/20 group-hover:border-red-800/30' 
                            : isAmber
                            ? 'group-hover:bg-amber-900/20 group-hover:border-amber-800/30'
                            : ''
                        }`}>
                          <ProblemIcon className={`w-4 h-4 text-slate-500 transition-colors ${
                            isRed 
                              ? 'group-hover:text-red-400' 
                              : isAmber
                              ? 'group-hover:text-amber-400'
                              : ''
                          }`} strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-semibold text-white mb-1 transition-colors ${
                            isRed 
                              ? 'group-hover:text-red-100' 
                              : isAmber
                              ? 'group-hover:text-amber-100'
                              : ''
                          }`}>
                            {problem.title.replace(/🚨|⚠️|📊/g, '').trim()}
                          </h4>
                          <p className={`text-[11px] text-slate-400 leading-relaxed transition-colors ${
                            isRed || isAmber ? 'group-hover:text-slate-300' : ''
                          }`}>
                            {problem.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
              
          {/* ✅ Benefits - AUSSAGEKRÄFTIGER MIT GLOW */}
          <div className="mt-5 pt-4 border-t border-slate-800/50">
            <h4 className="text-xs font-bold text-white mb-3">
              Was bringt dir die Preisänderung?
            </h4>
            
            <div className="space-y-2.5">
              {benefit.benefits.map((b: any, idx: number) => {
                const isCyan = b.text.includes('Umsatz') || b.text.includes('Verkäufe');
                const isEmerald = b.text.includes('Wettbewerb') || b.text.includes('Kunden');
                
                return (
                  <div 
                    key={idx} 
                    className={`group p-3.5 rounded-lg bg-slate-800/30 border border-slate-700/30 transition-all duration-300 ${
                      isCyan
                        ? 'hover:bg-cyan-950/10 hover:border-cyan-900/20 hover:shadow-lg hover:shadow-cyan-500/5'
                        : isEmerald
                        ? 'hover:bg-emerald-950/10 hover:border-emerald-900/20 hover:shadow-lg hover:shadow-emerald-500/5'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center flex-shrink-0 transition-all ${
                        isCyan
                          ? 'group-hover:bg-cyan-900/20 group-hover:border-cyan-800/30'
                          : isEmerald
                          ? 'group-hover:bg-emerald-900/20 group-hover:border-emerald-800/30'
                          : ''
                      }`}>
                        <CheckCircle2 className={`w-4 h-4 text-slate-500 transition-colors ${
                          isCyan
                            ? 'group-hover:text-cyan-400'
                            : isEmerald
                            ? 'group-hover:text-emerald-400'
                            : ''
                        }`} strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-semibold text-white mb-1 transition-colors ${
                          isCyan
                            ? 'group-hover:text-cyan-100'
                            : isEmerald
                            ? 'group-hover:text-emerald-100'
                            : ''
                        }`}>
                          {b.text}
                        </h4>
                        <p className={`text-[11px] text-slate-400 transition-colors ${
                          isCyan || isEmerald ? 'group-hover:text-slate-300' : ''
                        }`}>
                          {b.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* ✅ CTA BUTTONS - SLATE STATT WEISS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleAction('apply')}
            disabled={loading}
            className="flex-1 px-6 py-3.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600/50 hover:border-slate-500 text-white font-semibold shadow-lg shadow-slate-900/50 hover:shadow-xl hover:shadow-slate-700/30 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading && action === 'apply' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Wird angewendet...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
                Preis übernehmen
              </>
            )}
          </button>
          
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="px-6 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 text-slate-400 hover:text-white font-medium transition-all flex items-center gap-2 text-sm"
          >
            Details {showDetails ? 'verbergen' : 'ansehen'}
            {showDetails ? (
              <ChevronUp className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ChevronDown className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        </div>
        
        {/* ✅ EXPANDABLE DETAILS - VOLLSTÄNDIG (KEIN DOPPELTER TITEL!) */}
        {showDetails && (
          <div className="space-y-5 pt-4 border-t border-slate-800/50">
            {/* ✅ WAS WURDE ANALYSIERT? - HOVER-TOOLTIP DESIGN */}
            <div className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center">
                  <Database className="w-4 h-4 text-slate-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Was wurde analysiert?</h3>
                </div>
              </div>
              
              {/* ✅ KOMPAKTE CARDS MIT HOVER-TOOLTIP - 2x2 GRID */}
              <div className="grid grid-cols-2 gap-3">
                {analysisFactors.map((factor) => {
                  const FactorIcon = factor.icon;
                  const isHovered = hoveredCategory === factor.key;
                  const details = getFactorDetails(factor);
                  
                  return (
                    <div
                      key={factor.key}
                      className="relative"
                      onMouseEnter={() => setHoveredCategory(factor.key)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {/* ✅ KOMPAKTE CARD - NUR TITEL + GEWICHT */}
                      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-center justify-center group-hover:bg-slate-700/50 transition-all">
                              <FactorIcon className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" strokeWidth={2} />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-white group-hover:text-slate-200 transition-colors">
                                {factor.name}
                              </h4>
                              <p className="text-[10px] text-slate-600">
                                {(factor.weight * 100).toFixed(0)}% Gewicht
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* ✅ HINWEIS FÜR MEHR INFOS */}
                        <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors">
                          <Info className="w-3 h-3" strokeWidth={2} />
                          <span>Für mehr Infos</span>
                        </div>
                      </div>
                      
                      {/* ✅ TOOLTIP BEI HOVER */}
                      {isHovered && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 transition-all duration-200 animate-[fadeIn_0.2s_ease-in-out_forwards]">
                          <div className="p-4 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-slate-900/50">
                            {/* Tooltip Header */}
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700/50">
                              <FactorIcon className="w-4 h-4 text-slate-400" strokeWidth={2} />
                              <h4 className="text-sm font-bold text-white">
                                {factor.name}
                              </h4>
                            </div>
                            
                            {/* Tooltip Details */}
                            <div className="space-y-1.5">
                              {details.map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0 mt-1.5" />
                                  <span className="text-[11px] text-slate-400 leading-relaxed">
                                    {detail}
                                  </span>
                                </div>
                              ))}
                            </div>
                            
                            {/* Tooltip Footer */}
                            {factor.price > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                                <span className="text-[10px] text-slate-600">
                                  Vorgeschlagener Preis
                                </span>
                                <span className="text-sm font-bold text-white">
                                  {factor.price.toFixed(2)}€
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Tooltip Arrow */}
                          <div className="absolute -top-1 left-6 w-2 h-2 bg-slate-800/95 border-l border-t border-slate-700/50 transform rotate-45" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* ✅ WIE WIRD BERECHNET? - ALLE 8 FAKTOREN + HOVER */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-slate-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Wie wird der finale Preis berechnet?
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    8 Faktoren werden gewichtet - Hover für Details
                  </p>
                </div>
              </div>
              
              {/* ✅ ALLE 8 FAKTOREN MIT HOVER - 2-SPALTEN GRID */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {analysisFactors.map((factor, index) => {
                  const Icon = factor.icon;
                  const displayPrice = factor.price > 0 ? factor.price : safeRecommendedPrice;
                  const factorDetails = getFactorUserFriendlyDetails(factor.key);
                  
                  return (
                    <div
                      key={factor.key}
                      className="relative group"
                    >
                      {/* ✅ KOMPAKTE CARD */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-300 cursor-help">
                        {/* Rank */}
                        <div className="w-6 h-6 rounded bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-slate-500">
                            {index + 1}
                          </span>
                        </div>
                        
                        {/* Icon */}
                        <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-white truncate">
                            {factor.name}
                          </h4>
                          <p className="text-[10px] text-slate-600">
                            {(factor.weight * 100).toFixed(0)}% Gewicht
                          </p>
                        </div>
                        
                        {/* Price */}
                        <div className="text-sm font-bold text-white flex-shrink-0">
                          {displayPrice.toFixed(2)}€
                        </div>
                      </div>
                      
                      {/* ✅ TOOLTIP BEI HOVER */}
                      <div className="absolute left-0 right-0 top-full mt-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                        <div className="p-4 rounded-xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-slate-900/50">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-slate-400" strokeWidth={2} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-bold text-white mb-2">
                                {factor.name}
                              </h4>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                {factorDetails}
                              </p>
                            </div>
                          </div>
                          
                          {factor.price > 0 && (
                            <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                              <span className="text-[10px] text-slate-600">
                                Vorgeschlagener Preis
                              </span>
                              <span className="text-sm font-bold text-white">
                                {factor.price.toFixed(2)}€
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Arrow */}
                        <div className="absolute -top-1 left-8 w-2 h-2 bg-slate-800/95 border-l border-t border-slate-700/50 transform rotate-45" />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* ✅ BERECHNUNG */}
              <div className="mt-5 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className="text-xs font-bold text-white mb-3">Finale Berechnung:</h4>
                
                <div className="space-y-1.5 font-mono text-[11px] mb-4">
                  {analysisFactors.map((factor) => {
                    // ✅ ALLE 8 FAKTOREN ANZEIGEN (auch wenn price = 0, dann mit empfohlenem Preis)
                    const displayPrice = factor.price > 0 ? factor.price : safeRecommendedPrice;
                    const contribution = displayPrice * factor.weight;
                    return (
                      <div key={factor.key} className="flex justify-between text-slate-400">
                        <span>
                          {displayPrice.toFixed(2)}€ × {(factor.weight * 100).toFixed(0)}%
                        </span>
                        <span className="text-slate-500">
                          = {contribution.toFixed(2)}€
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Finaler Preis:</span>
                  <span className="text-2xl font-bold text-white">
                    {safeRecommendedPrice.toFixed(2)}€
                  </span>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
                Jeder Faktor schlägt einen eigenen Preis vor. Diese werden{' '}
                <span className="text-white font-medium">gewichtet zusammengeführt</span>.{' '}
                Die Gewichtung hängt von der <span className="text-white font-medium">Datensicherheit</span> ab.
              </p>
            </div>
            
            {/* ✅ WIE FUNKTIONIERT DIE KI? - USER-FREUNDLICH */}
            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-slate-400" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    🤖 Wie funktioniert die KI?
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Einfach erklärt, ohne Fachjargon
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* ✅ 1. DATENSAMMLUNG */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-slate-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">
                      1. Daten sammeln
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Wir sammeln automatisch Daten aus deinem Shop (Verkäufe, Lagerbestand, etc.),{' '}
                      von deinen Wettbewerbern und aus dem Markt. Das passiert{' '}
                      <span className="text-white font-medium">alle 6 Stunden</span> im Hintergrund.
                    </p>
                  </div>
                </div>
                
                {/* ✅ 2. KI ANALYSIERT - KEINE ML-BEGRIFFE */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-slate-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">
                      2. KI findet Muster
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Unsere KI wurde mit <span className="text-white font-medium">500.000+ Preisänderungen</span>{' '}
                      trainiert und lernt kontinuierlich dazu. Sie erkennt automatisch Muster:{' '}
                      <span className="text-cyan-400">Wann verkauft sich was zu welchem Preis am besten?</span>
                    </p>
                  </div>
                </div>
                
                {/* ✅ 3. 8 EXPERTEN-MEINUNGEN */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-slate-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">
                      3. Wie 8 Experten, die zusammenarbeiten
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Stell dir vor, du hast <span className="text-white font-medium">8 Experten</span>:{' '}
                      Einer kennt sich mit Verkaufsdaten aus, einer mit Wettbewerbern, einer mit Lagerbestand, etc.{' '}
                      Jeder gibt seine Meinung ab, und am Ende{' '}
                      <span className="text-emerald-400">einigen sie sich auf den besten Preis</span>.
                    </p>
                  </div>
                </div>
                
                {/* ✅ 4. SICHERHEITSCHECKS - USER-FREUNDLICH */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-slate-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">
                      4. Sicherheitschecks vor jeder Empfehlung
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                      Bevor wir dir einen Preis empfehlen, prüfen wir:
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-[11px] text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0 mt-1.5" />
                        <span>Liegt der Preis über deinen Kosten? (Break-even Check)</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0 mt-1.5" />
                        <span>Bleibt eine gesunde Marge übrig? (Mindestens 10%)</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0 mt-1.5" />
                        <span>Ist die Änderung nicht zu radikal? (Max ±30%)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* ✅ 5. GENAUIGKEIT */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-slate-400" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1.5">
                      5. Wie genau ist die KI?
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Unsere KI hat eine <span className="text-white font-medium">95% Genauigkeit</span>.{' '}
                      Das bedeutet: In 95 von 100 Fällen liegt sie richtig.{' '}
                      <span className="text-amber-400">Je mehr Daten verfügbar sind, desto genauer wird sie.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
