export interface Product {
  id: number;
  title: string;
  price: number;
  cost?: number;
  inventory_quantity: number;
  shopify_product_id: string;
  is_demo: boolean;
  image?: string;
  sku?: string;
  category?: string;
  recommendation?: number;
  status?: 'optimal' | 'recommended' | 'applied' | 'low';
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Shop {
  id: number;
  name: string;
  type: 'demo' | 'shopify';
  shop_url: string | null;
  product_count: number;
  is_active: boolean;
}

export interface Recommendation {
  id: number;
  product_id: number;
  product_name?: string;
  shop_id: number;
  current_price: number;
  recommended_price: number;
  price_change_pct: number;
  confidence: number;
  strategy: string;
  reasoning: string;
  demand_growth?: number;
  days_of_stock?: number;
  sales_7d?: number;
  sales_30d?: number;
  competitor_avg_price?: number;
  base_confidence?: number;
  ml_confidence?: number;
  ml_detector_confidence?: number;
  meta_labeler_confidence?: number;
  meta_labeler_approved?: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  applied_at?: string;
  applied_price?: number;
  created_at: string;
  updated_at: string;
  feature_confidence?: Record<string, number>;
  strategy_details?: any[] | any;
}

export interface CompetitorPrice {
  id?: number;
  source: string;
  title: string;
  price: number;
  url: string;
  rating?: number;
  reviews?: number;
  scraped_at: string;
  in_stock?: boolean;
}

export interface CompetitorSearchResponse {
  product_id: number;
  product_title: string;
  competitors: CompetitorPrice[];
  summary: {
    found: number;
    avg_price: number;
    min_price: number;
    max_price: number;
    your_position: 'cheapest' | 'below_average' | 'average' | 'above_average' | 'most_expensive' | 'unknown';
  };
  your_price: number;
}

export interface ProductCostData {
  purchase_cost: number;
  shipping_cost: number;
  packaging_cost: number;
  payment_provider: string;
  country_code: string;
  category?: string;
}

export interface MarginCalculationResult {
  has_cost_data: boolean;
  selling_price: number;
  net_revenue: number;
  costs: {
    purchase: number;
    shipping: number;
    packaging: number;
    payment_fee: number;
    total_variable: number;
  };
  margin: {
    euro: number;
    percent: number;
  };
  break_even_price: number;
  recommended_min_price: number;
  is_above_break_even: boolean;
  is_above_min_margin: boolean;
}

export interface DashboardStats {
  products_count: number;
  recommendations_pending: number;
  recommendations_applied: number;
  missed_revenue: {
    total: number;
    product_count: number;
    avg_per_product: number;
  };
  progress: {
    level: string;
    points: number;
    steps: string[];
  };
  next_steps: string[];
}

export interface User {
  id: number;
  email: string | null;
  name?: string | null;
  shop_id?: number;
}
