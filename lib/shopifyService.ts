import { API_URL } from './api';
import { getHeaders } from './api';

export interface ApplyPriceRequest {
  product_id: number;
  recommended_price: number;
  recommendation_id?: number;
  variant_id?: string;
}

export interface ApplyPriceResponse {
  success: boolean;
  message: string;
  new_price: number;
  variant_id: string;
  product_id: number;
}

/**
 * Wendet empfohlenen Preis auf Shopify an (via GraphQL)
 */
export async function applyRecommendedPrice(
  request: ApplyPriceRequest
): Promise<ApplyPriceResponse> {
  const response = await fetch(`${API_URL}/api/shopify/apply-price`, {
    method: 'POST',
    headers: getHeaders(),
    credentials: 'include',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Fehler beim Anwenden des Preises');
  }

  return response.json();
}
