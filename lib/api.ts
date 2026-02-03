import type {
  Product,
  Shop,
  Recommendation,
  CompetitorSearchResponse,
  ProductCostData,
  MarginCalculationResult,
  DashboardStats,
} from '@/types/models';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Session-ID Management
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  
  let sessionId = localStorage.getItem('session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}

// Helper: Füge Session-ID zu Headers hinzu
export function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const sessionId = getOrCreateSessionId();
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }
  
  return headers;
}

// Dashboard Stats
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/api/dashboard/stats`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Dashboard-Daten');
  }
  return response.json();
}

// Products
export async function fetchProducts(shopId?: number): Promise<Product[]> {
  const url = shopId 
    ? `${API_URL}/products/?shop_id=${shopId}`
    : `${API_URL}/products/`;
  const response = await fetch(url, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Produkte');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.products || [];
}

export async function syncProducts(shopId: number) {
  const response = await fetch(`${API_URL}/products/sync/${shopId}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Synchronisieren der Produkte');
  }
  return response.json();
}

// Recommendations
export async function getRecommendations(productId: number): Promise<Recommendation[]> {
  const response = await fetch(`${API_URL}/recommendations/product/${productId}`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Empfehlungen');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.recommendations || [];
}

export async function generateRecommendation(productId: number): Promise<Recommendation> {
  const response = await fetch(`${API_URL}/recommendations/generate/${productId}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Generieren der Empfehlung');
  }
  const data = await response.json();
  // Backend returns { success: true, recommendation: {...} } or direct Recommendation
  return data.recommendation || data;
}

export async function acceptRecommendation(recommendationId: number) {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}/accept`, {
    method: 'PATCH',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Akzeptieren der Empfehlung');
  }
  return response.json();
}

export async function rejectRecommendation(recommendationId: number, reason?: string) {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}/reject`, {
    method: 'PATCH',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Ablehnen der Empfehlung');
  }
  return response.json();
}

export async function getRecommendation(recommendationId: number): Promise<Recommendation> {
  const response = await fetch(`${API_URL}/recommendations/${recommendationId}`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Empfehlung');
  }
  return response.json();
}

// Shops
export async function getAvailableShops(): Promise<{ shops: Shop[] }> {
  const response = await fetch(`${API_URL}/shops`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Shops');
  }
  return response.json();
}

export async function getCurrentShop(): Promise<Shop> {
  const response = await fetch(`${API_URL}/shops/current`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden des aktuellen Shops');
  }
  return response.json();
}

export async function switchShop(shopId: number, useDemo: boolean) {
  const response = await fetch(`${API_URL}/shops/switch`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({ shop_id: shopId, use_demo: useDemo }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Wechseln des Shops');
  }
  return response.json();
}

// Competitors
export async function searchCompetitors(
  productId: number | string,
  options?: {
    maxResults?: number;
    forceRefresh?: boolean;
  }
): Promise<CompetitorSearchResponse> {
  const params = new URLSearchParams();
  if (options?.maxResults) params.set('max_results', String(options.maxResults));
  if (options?.forceRefresh) params.set('force_refresh', 'true');
  
  const response = await fetch(
    `${API_URL}/competitors/products/${productId}/competitor-search?${params}`,
    { 
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Competitor search failed');
  }
  return response.json();
}

// Margin Calculator
export async function saveProductCosts(productId: string, costData: ProductCostData) {
  const response = await fetch(`${API_URL}/margin/costs`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      product_id: productId,
      ...costData,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Speichern der Kosten');
  }
  return response.json();
}

export async function getProductCosts(productId: string): Promise<ProductCostData | null> {
  const response = await fetch(`${API_URL}/margin/costs/${productId}`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Kosten');
  }
  return response.json();
}

export async function calculateMargin(
  productId: string,
  sellingPrice: number
): Promise<MarginCalculationResult> {
  const response = await fetch(`${API_URL}/margin/calculate/${productId}`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify({
      selling_price: sellingPrice,
      save_to_history: true,
      triggered_by: 'manual',
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Berechnen der Marge');
  }
  return response.json();
}

// Waitlist
export async function addToWaitlist(email: string) {
  const response = await fetch(`${API_URL}/api/waitlist/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Hinzufügen zur Waitlist');
  }
  return response.json();
}

// Demo
export async function getDemoProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/demo-shop/products`, {
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Laden der Demo-Produkte');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.products || [];
}

export async function getDemoRecommendation(productId: number): Promise<Recommendation> {
  const response = await fetch(`${API_URL}/api/demo-shop/products/${productId}/recommendation`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Generieren der Demo-Empfehlung');
  }
  const data = await response.json();
  // Backend returns { success: true, recommendation: {...} } or direct Recommendation
  const recommendation = data.recommendation || data;
  
  // Normalize: Ensure all required fields exist with safe defaults
  if (!recommendation.recommended_price) {
    recommendation.recommended_price = recommendation.recommendation || recommendation.price || 0;
  }
  if (!recommendation.current_price) {
    recommendation.current_price = recommendation.price || 0;
  }
  if (recommendation.price_change_pct === undefined || recommendation.price_change_pct === null) {
    const current = recommendation.current_price || 0;
    const recommended = recommendation.recommended_price || 0;
    recommendation.price_change_pct = current > 0 ? ((recommended - current) / current) * 100 : 0;
  }
  if (recommendation.confidence === undefined || recommendation.confidence === null) {
    recommendation.confidence = 0.5; // Default confidence
  }
  
  return recommendation;
}
