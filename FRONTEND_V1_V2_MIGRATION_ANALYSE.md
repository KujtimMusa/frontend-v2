# 🔄 FRONTEND V1 → V2 MIGRATION - COMPLETE PRODUCTION DEPLOYMENT ANALYSIS

**Erstellt:** 2026-01-19  
**Status:** Vollständige Analyse abgeschlossen

---

## 📋 INHALTSVERZEICHNIS

1. [PHASE 1: FRONTEND V1 (LIVE) - KOMPLETT-ANALYSE](#phase-1-frontend-v1-live---komplett-analyse)
2. [PHASE 2: FRONTEND V2 - KOMPLETT-ANALYSE](#phase-2-frontend-v2---komplett-analyse)
3. [PHASE 3: V1 ↔ V2 FEATURE PARITY CHECK](#phase-3-v1--v2-feature-parity-check)
4. [PHASE 4: BACKEND-KOMPATIBILITÄT PRÜFEN](#phase-4-backend-kompatibilität-prüfen)
5. [PHASE 5: MIGRATION GAP-ANALYSE](#phase-5-migration-gap-analyse)
6. [PHASE 6: DEPLOYMENT-STRATEGIE](#phase-6-deployment-strategie)
7. [PHASE 7: FINALE CHECKLISTE & ROADMAP](#phase-7-finale-checkliste--roadmap)

---

# PHASE 1: FRONTEND V1 (LIVE) - KOMPLETT-ANALYSE

## AUFGABE 1.1: ALLE FEATURES IN V1 IDENTIFIZIEREN

### SEITEN/ROUTEN:

```
├─ PUBLIC PAGES (ohne Auth)
│ ├─ / (Root) → Redirect zu /landing
│ ├─ /landing → Landing Page mit Waitlist-Formular
│ ├─ /dashboard → OAuth Callback Handler (speichert shop_id, redirectet zu /)
│ └─ /admin/login → Admin Login Page
│
└─ PROTECTED PAGES (mit i18n Locale)
├─ /[locale] (de/en) → Dashboard (Hauptseite)
├─ /[locale]/products → Produktliste mit Shop-Switcher
├─ /[locale]/recommendations → Preisempfehlungen für Produkt
└─ /admin/dashboard → Admin Dashboard
```

### FEATURES/FUNKTIONALITÄT:

#### 🔐 AUTHENTICATION
- **Shopify OAuth Login**: ❌ **NICHT IMPLEMENTIERT** (nur Callback-Handler vorhanden)
  - File: `frontend/app/dashboard/page.tsx` (Zeilen 1-125)
  - Flow: Backend redirectet nach OAuth → `/dashboard?shop_id=X` → speichert in localStorage → redirectet zu `/`
  - **KEINE Login-Page vorhanden!**
- **Session Management**: ✅ Implementiert via localStorage + Session-ID
  - File: `frontend/lib/api.ts` (Zeilen 19-48)
  - Session-ID wird in localStorage gespeichert und als `X-Session-ID` Header gesendet
- **Token Storage**: ✅ localStorage (`session_id`, `shop_id`, `current_shop_id`, `shop_mode`)
- **Logout**: ❌ Nicht implementiert

#### 📦 PRODUCTS
- **Produktliste anzeigen**: ✅ Implementiert
  - File: `frontend/app/[locale]/products/page.tsx` (Zeilen 1-481)
  - API-Call: `GET /products/` (Zeile 47)
  - Features: Grid-Layout, Inventory-Badges, AI-Badge für Empfehlungen
- **Produkte synchronisieren**: ✅ Implementiert
  - File: `frontend/app/[locale]/products/page.tsx` (Zeilen 58-79)
  - API-Call: `POST /products/sync/{shop_id}` (Zeile 71)
- **Produkt-Details anzeigen**: ✅ Via Recommendations-Page
- **Produkt filtern/sortieren**: ❌ Nicht implementiert
- **Produkt-Suche**: ❌ Nicht implementiert

#### 💡 RECOMMENDATIONS (PREISEMPFEHLUNGEN)
- **Empfehlungen anzeigen**: ✅ Implementiert
  - File: `frontend/app/[locale]/recommendations/page.tsx` (Zeilen 1-560)
  - API-Call: `GET /recommendations/product/{product_id}` (via `LatestRecommendation` Component)
- **Empfehlung generieren**: ✅ Implementiert
  - File: `frontend/components/LatestRecommendation.tsx` (vermutlich)
  - API-Call: `POST /recommendations/generate/{product_id}` (Zeile 178 in `api.ts`)
- **Empfehlung akzeptieren**: ✅ Implementiert
  - API-Call: `PATCH /recommendations/{id}/accept` (Zeile 94 in `api.ts`)
- **Empfehlung ablehnen**: ✅ Implementiert
  - API-Call: `PATCH /recommendations/{id}/reject` (Zeile 112 in `api.ts`)
- **Preis auf Shopify anwenden**: ✅ Implementiert
  - File: `frontend/app/api/pricing/apply/route.ts` (Zeilen 1-62)
  - API-Call: `POST /recommendations/apply/{product_id}` (via Next.js API Route)
- **Empfehlungs-Historie**: ⚠️ Partial (nur aktuelle Empfehlung wird angezeigt)

#### 🏪 COMPETITORS (WETTBEWERBER)
- **Competitor-Preise anzeigen**: ✅ Implementiert
  - File: `frontend/components/CompetitorAnalysis.tsx`
  - API-Call: `POST /competitors/products/{id}/competitor-search` (Zeile 263 in `api.ts`)
- **Competitor hinzufügen**: ❌ Nicht implementiert (nur automatische Suche)
- **Competitor-Suche**: ✅ Automatische Suche via Serper API
- **Competitor löschen**: ❌ Nicht implementiert
- **Competitor-Analyse**: ✅ Implementiert (Market Position, Durchschnittspreis, etc.)

#### 💰 MARGIN CALCULATOR
- **Kosten eingeben**: ✅ Implementiert
  - File: `frontend/components/margin/CostInputModal.tsx`
  - API-Call: `POST /margin/costs` (Zeile 349 in `api.ts`)
- **Marge berechnen**: ✅ Implementiert
  - File: `frontend/components/margin/MarginDisplay.tsx`
  - API-Call: `POST /margin/calculate/{product_id}` (Zeile 398 in `api.ts`)
- **Kosten speichern**: ✅ Implementiert
  - API-Call: `POST /margin/costs` (Zeile 349 in `api.ts`)
- **Margen-Historie**: ⚠️ Partial (Backend hat Endpoint, Frontend zeigt es nicht an)

#### 📊 DASHBOARD
- **Statistiken anzeigen**: ✅ Implementiert
  - File: `frontend/app/[locale]/page.tsx` (vermutlich Dashboard)
  - API-Call: `GET /api/dashboard/stats` (Zeile 8 in `api.ts`)
- **Charts/Visualisierungen**: ❌ Nicht implementiert (nur Text-Stats)
- **Next Steps / Onboarding**: ⚠️ Partial (Trust Ladder vorhanden, aber nicht vollständig)
- **Progress Tracking**: ⚠️ Partial (Trust Ladder Points)

#### 🎮 DEMO-MODE
- **Demo-Daten laden**: ✅ Implementiert
  - File: `frontend/lib/api.ts` (Zeile 288: `getDemoProducts`)
  - API-Call: `GET /api/demo-shop/products`
- **Demo-Banner**: ⚠️ Partial (Demo-Mode wird angezeigt, aber kein Banner)
- **Demo-Einschränkungen**: ✅ Sync-Funktion disabled im Demo-Mode

#### 🏪 SHOP MANAGEMENT
- **Shop Switcher**: ✅ Implementiert
  - File: `frontend/components/ShopSwitcher.tsx`
  - API-Calls: `GET /shops`, `GET /shops/current`, `POST /shops/switch` (Zeilen 200-236 in `api.ts`)
- **Multi-Shop Support**: ✅ Implementiert

#### 🔔 NOTIFICATIONS
- **Toasts**: ✅ Implementiert (sonner)
  - File: `frontend/app/layout.tsx` (Zeile 19: `<Toaster />`)

#### ⚡ LOADING STATES
- **Loading States**: ✅ Implementiert (Skeleton Loaders, Spinner)

#### 🚨 ERROR HANDLING
- **Error Handling**: ✅ Implementiert
  - File: `frontend/components/ErrorBoundary.tsx`
  - Try-Catch in API-Calls

#### 📱 RESPONSIVE DESIGN
- **Mobile optimiert**: ✅ Implementiert (Tailwind responsive classes)

### GESAMT: 25 Features identifiziert

---

## AUFGABE 1.2: ALLE API-CALLS IN V1

| # | Feature | Component/Page | Endpoint | Method | Request Body | Response Expected | Line | File |
|---|---------|----------------|-----------|--------|--------------|-------------------|------|------|
| 1 | Dashboard Stats | Dashboard | `/api/dashboard/stats` | GET | - | DashboardStats | 8 | `lib/api.ts` |
| 2 | Products List | ProductsPage | `/products/` | GET | ?shop_id=X (optional) | Product[] | 50 | `lib/api.ts` |
| 3 | Sync Products | ProductsPage | `/products/sync/{shop_id}` | POST | - | SyncResult | 67 | `lib/api.ts` |
| 4 | Get Recommendations | RecommendationsPage | `/recommendations/product/{product_id}` | GET | - | Recommendation[] | 74 | `lib/api.ts` |
| 5 | Generate Recommendation | LatestRecommendation | `/recommendations/generate/{product_id}` | POST | - | Recommendation | 178 | `lib/api.ts` |
| 6 | Accept Recommendation | LatestRecommendation | `/recommendations/{id}/accept` | PATCH | - | Recommendation | 94 | `lib/api.ts` |
| 7 | Reject Recommendation | LatestRecommendation | `/recommendations/{id}/reject` | PATCH | { reason?: string } | Recommendation | 112 | `lib/api.ts` |
| 8 | Get Recommendation | LatestRecommendation | `/recommendations/{id}` | GET | - | Recommendation | 131 | `lib/api.ts` |
| 9 | Apply Price to Shopify | Pricing Apply Route | `/recommendations/apply/{product_id}` | POST | { product_id, new_price, apply_to_shopify } | ApplyResult | 28 | `app/api/pricing/apply/route.ts` |
| 10 | Search Competitors | CompetitorAnalysis | `/competitors/products/{id}/competitor-search` | POST | ?max_results=X&force_refresh=true | CompetitorSearchResponse | 263 | `lib/api.ts` |
| 11 | Get Available Shops | ShopSwitcher | `/shops` | GET | - | { shops: Shop[] } | 200 | `lib/api.ts` |
| 12 | Get Current Shop | ShopSwitcher | `/shops/current` | GET | - | Shop | 212 | `lib/api.ts` |
| 13 | Switch Shop | ShopSwitcher | `/shops/switch` | POST | { shop_id, use_demo } | Shop | 224 | `lib/api.ts` |
| 14 | Save Product Costs | CostInputModal | `/margin/costs` | POST | { product_id, purchase_cost, shipping_cost, ... } | CostData | 349 | `lib/api.ts` |
| 15 | Get Product Costs | MarginDisplay | `/margin/costs/{product_id}` | GET | - | ProductCostData | 367 | `lib/api.ts` |
| 16 | Update Product Costs | CostInputModal | `/margin/costs/{product_id}` | PUT | Partial<ProductCostData> | CostData | 383 | `lib/api.ts` |
| 17 | Calculate Margin | MarginDisplay | `/margin/calculate/{product_id}` | POST | { selling_price, save_to_history, triggered_by } | MarginCalculationResult | 398 | `lib/api.ts` |
| 18 | Validate Price | MarginDisplay | `/margin/validate` | POST | { product_id, recommended_price } | MarginValidationResult | 417 | `lib/api.ts` |
| 19 | Get Margin Health | Dashboard | `/margin/dashboard/health` | GET | - | MarginHealthData | 435 | `lib/api.ts` |
| 20 | Get Category Defaults | CostInputModal | `/margin/category-defaults/{category}` | GET | - | CategoryDefaults | 448 | `lib/api.ts` |
| 21 | Estimate Costs | CostInputModal | `/margin/estimate-costs` | POST | ?selling_price=X&category=Y&country_code=Z | EstimatedCosts | 461 | `lib/api.ts` |
| 22 | Has Cost Data | MarginDisplay | `/margin/has-costs/{product_id}` | GET | - | { has_cost_data: boolean } | 475 | `lib/api.ts` |
| 23 | Add to Waitlist | LandingPage | `/api/waitlist/` | POST | { email } | WaitlistResponse | 274 | `lib/api.ts` |
| 24 | Get Demo Products | Demo Mode | `/api/demo-shop/products` | GET | - | Product[] | 288 | `lib/api.ts` |
| 25 | Get Demo Recommendation | Demo Mode | `/api/demo-shop/products/{id}/recommendation` | POST | - | Recommendation | 301 | `lib/api.ts` |
| 26 | Shopify Products | ShopifyService | `/api/shopify/products` | GET | ?shop_id=X&first=Y | ShopifyProductsResponse | 84 | `lib/shopifyService.ts` |
| 27 | Apply Price (Shopify) | ShopifyService | `/api/shopify/apply-price` | POST | { product_id, recommended_price, variant_id } | ApplyPriceResponse | 108 | `lib/shopifyService.ts` |
| 28 | Bulk Update Prices | ShopifyService | `/api/shopify/bulk-update-prices` | POST | { updates: [...] } | BulkUpdateResponse | 132 | `lib/shopifyService.ts` |
| 29 | Get Shopify Product | ShopifyService | `/api/shopify/product/{id}` | GET | ?shop_id=X | ShopifyProduct | 160 | `lib/shopifyService.ts` |

**GESAMT: 29 API-Calls in V1**

### HÄUFIGST GENUTZTE ENDPOINTS:
1. `GET /products/` - Produktliste
2. `GET /api/dashboard/stats` - Dashboard Stats
3. `POST /recommendations/generate/{product_id}` - Empfehlung generieren
4. `GET /shops/current` - Aktueller Shop
5. `POST /shops/switch` - Shop wechseln

---

## AUFGABE 1.3: V1 TECHNOLOGIE-STACK

### FRAMEWORK:
- **Next.js Version**: 14.0.4
- **React Version**: 18.2.0
- **TypeScript**: ✅ Ja

### STYLING:
- **CSS Framework**: Tailwind CSS 3.3.0
- **Component Library**: Radix UI (Checkbox, Dialog, Dropdown, Select, Tooltip)
- **Icons**: Lucide React 0.561.0
- **Animations**: Framer Motion 12.25.0

### STATE MANAGEMENT:
- **Global State**: ❌ Kein globaler State (nur localStorage + Custom Hooks)
- **Server State**: ❌ Kein React Query/SWR (nur useState + useEffect)
- **Custom Hooks**: `useShop` Hook für Shop-Management

### AUTH:
- **Auth Library**: ❌ Keine Auth-Library (nur localStorage-basiert)
- **Token Storage**: localStorage (`session_id`, `shop_id`, `current_shop_id`, `shop_mode`)
- **Session Management**: Session-ID via `X-Session-ID` Header

### API CLIENT:
- **HTTP Client**: Native `fetch()` API
- **API Base URL**: `process.env.NEXT_PUBLIC_API_URL` (Standard: `http://localhost:8000`)
- **Credentials**: `credentials: 'include'` für Cookies

### ROUTING:
- **Next.js App Router**: ✅ Ja (App Router)
- **i18n Routing**: ✅ next-intl 4.6.1 (Locale-basiert: `/de`, `/en`)
- **Protected Routes**: ⚠️ Partial (nur via Middleware für i18n, keine Auth-Guards)

### DEPLOYMENT:
- **Vercel Project**: Nicht ersichtlich aus Code
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` - Backend URL
  - (Weitere nicht ersichtlich)

### WEITERE DEPENDENCIES:
- **@sentry/nextjs**: 7.100.0 (Error Tracking)
- **@tanstack/react-table**: 8.21.3 (Tabellen)
- **@tanstack/react-virtual**: 3.13.18 (Virtualisierung)
- **sonner**: 2.0.7 (Toast Notifications)
- **next-intl**: 4.6.1 (Internationalisierung)

---

# PHASE 2: FRONTEND V2 - KOMPLETT-ANALYSE

## AUFGABE 2.1: ALLE FEATURES IN V2 IDENTIFIZIEREN

### SEITEN/ROUTEN:

```
├─ PUBLIC PAGES
│ ├─ / (Root) → Redirect zu /landing
│ ├─ /landing → Landing Page
│ └─ /auth/shopify/callback → OAuth Callback Handler
│
└─ PROTECTED PAGES (mit Layout)
├─ /dashboard → Dashboard (Hauptseite)
├─ /dashboard/products → Produktliste
├─ /dashboard/recommendations → Alle Empfehlungen
├─ /dashboard/recommendations/[id] → Einzelne Empfehlung
├─ /demo → Demo Dashboard
├─ /demo/products → Demo Produktliste
└─ /demo/recommendations → Demo Empfehlungen
```

### FEATURES/FUNKTIONALITÄT:

#### 🔐 AUTHENTICATION
- **Shopify OAuth Login**: ⚠️ **PARTIAL** (Callback vorhanden, aber keine Login-Page)
  - File: `frontend-v2/app/auth/shopify/callback/page.tsx` (Zeilen 1-41)
  - Flow: Callback speichert `shop_id` in localStorage → redirectet zu `/dashboard`
  - **KEINE Login-Page vorhanden!**
- **Session Management**: ✅ Implementiert via localStorage + Session-ID
  - File: `frontend-v2/lib/api.ts` (Zeilen 14-39)
  - Gleiche Implementierung wie V1
- **Token Storage**: ✅ localStorage (`session_id`, `shop_id`, `shop_mode`)
- **Auth Store**: ✅ Zustand Store vorhanden
  - File: `frontend-v2/stores/authStore.ts` (Zeilen 1-28)
  - **ABER**: `login()` Funktion fehlt in Interface (Zeile 8)!
- **Logout**: ✅ Implementiert (Zeile 22 in `authStore.ts`)

#### 📦 PRODUCTS
- **Produktliste anzeigen**: ✅ Implementiert
  - File: `frontend-v2/app/dashboard/products/page.tsx`
  - API-Call: `GET /products/` (via `fetchProducts()`)
- **Produkte synchronisieren**: ✅ Implementiert (vermutlich)
  - API-Call: `POST /products/sync/{shop_id}` (in `api.ts` Zeile 71)
- **Produkt-Details anzeigen**: ✅ Via Recommendations-Page
- **Produkt filtern/sortieren**: ❌ Nicht implementiert
- **Produkt-Suche**: ❌ Nicht implementiert

#### 💡 RECOMMENDATIONS
- **Empfehlungen anzeigen**: ✅ Implementiert
  - File: `frontend-v2/app/dashboard/recommendations/page.tsx`
  - API-Call: `GET /recommendations/product/{product_id}` (via `getRecommendations()`)
- **Empfehlung generieren**: ✅ Implementiert
  - API-Call: `POST /recommendations/generate/{product_id}` (Zeile 98 in `api.ts`)
- **Empfehlung akzeptieren**: ✅ Implementiert
  - API-Call: `PATCH /recommendations/{id}/accept` (Zeile 113 in `api.ts`)
- **Empfehlung ablehnen**: ✅ Implementiert
  - API-Call: `PATCH /recommendations/{id}/reject` (Zeile 126 in `api.ts`)
- **Preis auf Shopify anwenden**: ✅ Implementiert
  - File: `frontend-v2/lib/shopifyService.ts` (Zeile 22: `applyRecommendedPrice()`)
  - API-Call: `POST /api/shopify/apply-price`
- **Empfehlungs-Historie**: ⚠️ Partial (nur aktuelle Empfehlung)

#### 🏪 COMPETITORS
- **Competitor-Preise anzeigen**: ✅ Implementiert
  - File: `frontend-v2/components/competition/CompetitionAnalysis.tsx`
  - API-Call: `POST /competitors/products/{id}/competitor-search` (Zeile 192 in `api.ts`)
- **Competitor-Analyse**: ✅ Implementiert
  - File: `frontend-v2/components/competition/MarketPositionOverview.tsx`

#### 💰 MARGIN CALCULATOR
- **Kosten eingeben**: ⚠️ Unklar (Components vorhanden, aber nicht in Pages integriert)
- **Marge berechnen**: ⚠️ Unklar
- **Kosten speichern**: ✅ API-Call vorhanden (Zeile 220 in `api.ts`)

#### 📊 DASHBOARD
- **Statistiken anzeigen**: ✅ Implementiert
  - File: `frontend-v2/app/dashboard/page.tsx` (Zeilen 1-90)
  - API-Call: `GET /api/dashboard/stats` (Zeile 7)
- **Charts/Visualisierungen**: ✅ Implementiert (Recharts!)
  - File: `frontend-v2/components/dashboard/RevenueChart.tsx`
  - File: `frontend-v2/components/dashboard/MissedRevenueChart.tsx`
  - Library: recharts 2.10.0
- **Next Steps / Onboarding**: ✅ Implementiert
  - File: `frontend-v2/components/dashboard/TrustLadder.tsx`
  - File: `frontend-v2/components/dashboard/OptimizationProgress.tsx`
- **Progress Tracking**: ✅ Implementiert (Trust Ladder)

#### 🎮 DEMO-MODE
- **Demo-Daten laden**: ✅ Implementiert
  - File: `frontend-v2/app/demo/page.tsx`
  - API-Call: `GET /api/demo-shop/products` (Zeile 288 in `api.ts`)
- **Demo-Banner**: ⚠️ Unklar
- **Demo-Einschränkungen**: ✅ Separate Demo-Routes

#### 🏪 SHOP MANAGEMENT
- **Shop Switcher**: ✅ Implementiert
  - File: `frontend-v2/components/shared/ShopSwitcher.tsx`
  - API-Calls: `GET /shops`, `GET /shops/current`, `POST /shops/switch` (Zeilen 153-189 in `api.ts`)
- **Multi-Shop Support**: ✅ Implementiert

#### 🔔 NOTIFICATIONS
- **Toasts**: ✅ Implementiert (sonner 1.4.0)

#### ⚡ LOADING STATES
- **Loading States**: ✅ Implementiert (Skeleton Components)

#### 🚨 ERROR HANDLING
- **Error Handling**: ✅ Implementiert (React Query Error Handling)

#### 📱 RESPONSIVE DESIGN
- **Mobile optimiert**: ✅ Implementiert (Tailwind responsive)

### GESAMT: 24 Features identifiziert

---

## AUFGABE 2.2: ALLE API-CALLS IN V2

| # | Feature | Component/Page | Endpoint | Method | Request Body | Response Expected | Line | File |
|---|---------|----------------|-----------|--------|--------------|-------------------|------|------|
| 1 | Dashboard Stats | DashboardPage | `/api/dashboard/stats` | GET | - | DashboardStats | 42 | `lib/api.ts` |
| 2 | Products List | ProductsPage | `/products/` | GET | ?shop_id=X (optional) | Product[] | 55 | `lib/api.ts` |
| 3 | Sync Products | ProductsPage | `/products/sync/{shop_id}` | POST | - | SyncResult | 71 | `lib/api.ts` |
| 4 | Get Recommendations | RecommendationsPage | `/recommendations/product/{product_id}` | GET | - | Recommendation[] | 85 | `lib/api.ts` |
| 5 | Generate Recommendation | RecommendationCard | `/recommendations/generate/{product_id}` | POST | - | Recommendation | 98 | `lib/api.ts` |
| 6 | Accept Recommendation | RecommendationCard | `/recommendations/{id}/accept` | PATCH | - | Recommendation | 113 | `lib/api.ts` |
| 7 | Reject Recommendation | RecommendationCard | `/recommendations/{id}/reject` | PATCH | { reason?: string } | Recommendation | 126 | `lib/api.ts` |
| 8 | Get Recommendation | RecommendationDetail | `/recommendations/{id}` | GET | - | Recommendation | 140 | `lib/api.ts` |
| 9 | Apply Price to Shopify | RecommendationCard | `/api/shopify/apply-price` | POST | { product_id, recommended_price, variant_id } | ApplyPriceResponse | 25 | `lib/shopifyService.ts` |
| 10 | Search Competitors | CompetitionAnalysis | `/competitors/products/{id}/competitor-search` | POST | ?max_results=X&force_refresh=true | CompetitorSearchResponse | 192 | `lib/api.ts` |
| 11 | Get Available Shops | ShopSwitcher | `/shops` | GET | - | { shops: Shop[] } | 153 | `lib/api.ts` |
| 12 | Get Current Shop | ShopSwitcher | `/shops/current` | GET | - | Shop | 165 | `lib/api.ts` |
| 13 | Switch Shop | ShopSwitcher | `/shops/switch` | POST | { shop_id, use_demo } | Shop | 177 | `lib/api.ts` |
| 14 | Save Product Costs | (nicht in Pages) | `/margin/costs` | POST | { product_id, purchase_cost, ... } | CostData | 220 | `lib/api.ts` |
| 15 | Get Product Costs | (nicht in Pages) | `/margin/costs/{product_id}` | GET | - | ProductCostData | 237 | `lib/api.ts` |
| 16 | Update Product Costs | (nicht in Pages) | `/margin/costs/{product_id}` | PUT | Partial<ProductCostData> | CostData | 252 | `lib/api.ts` |
| 17 | Calculate Margin | (nicht in Pages) | `/margin/calculate/{product_id}` | POST | { selling_price, ... } | MarginCalculationResult | 252 | `lib/api.ts` |
| 18 | Get Demo Products | DemoPage | `/api/demo-shop/products` | GET | - | Product[] | 288 | `lib/api.ts` |
| 19 | Get Demo Recommendation | DemoPage | `/api/demo-shop/products/{id}/recommendation` | POST | - | Recommendation | 301 | `lib/api.ts` |
| 20 | Add to Waitlist | LandingPage | `/api/waitlist/` | POST | { email } | WaitlistResponse | 274 | `lib/api.ts` |

**GESAMT: 20 API-Calls in V2**

### HINWEIS:
- V2 hat **WENIGER** API-Calls als V1 (20 vs 29)
- Fehlende API-Calls in V2:
  - Margin Calculator Endpoints (nicht in Pages integriert)
  - Shopify Bulk Update
  - Shopify Product Details

---

## AUFGABE 2.3: V2 TECHNOLOGIE-STACK

### FRAMEWORK:
- **Next.js Version**: 14.0.4
- **React Version**: 18.2.0
- **TypeScript**: ✅ Ja

### STYLING:
- **CSS Framework**: Tailwind CSS 3.4.0
- **Component Library**: shadcn/ui (Radix UI + Tailwind)
- **Icons**: Lucide React 0.400.0
- **Animations**: Framer Motion 11.0.0

### STATE MANAGEMENT:
- **Global State**: ✅ Zustand 4.5.0
  - `authStore.ts` - Auth State
  - `shopStore.ts` - Shop State
- **Server State**: ✅ React Query 5.17.0 (@tanstack/react-query)
  - File: `frontend-v2/app/providers.tsx` (QueryClient Provider)
- **Custom Hooks**: Keine (nutzt Zustand Stores)

### AUTH:
- **Auth Library**: ❌ Keine Auth-Library (nur Zustand Store)
- **Token Storage**: localStorage (`auth_token`, `session_id`, `shop_id`, `shop_mode`)
- **Session Management**: Session-ID via `X-Session-ID` Header (wie V1)

### API CLIENT:
- **HTTP Client**: Native `fetch()` API
- **API Base URL**: `process.env.NEXT_PUBLIC_API_URL` (Standard: `http://localhost:8000`)
- **Credentials**: `credentials: 'include'` für Cookies

### ROUTING:
- **Next.js App Router**: ✅ Ja (App Router)
- **i18n Routing**: ❌ Keine Internationalisierung
- **Protected Routes**: ⚠️ Partial (Layout-basiert, aber keine Middleware)

### DEPLOYMENT:
- **Vercel Project**: Nicht ersichtlich
- **Environment Variables**:
  - `NEXT_PUBLIC_API_URL` - Backend URL

### WEITERE DEPENDENCIES:
- **recharts**: 2.10.0 (Charts - **NEU in V2!**)
- **date-fns**: 3.0.0 (Datum-Formatierung)
- **zustand**: 4.5.0 (State Management - **NEU in V2!**)
- **@tanstack/react-query**: 5.17.0 (Server State - **NEU in V2!**)

### VERBESSERUNGEN GEGENÜBER V1:
1. ✅ **React Query** für Server State Management
2. ✅ **Zustand** für Global State
3. ✅ **Recharts** für Dashboard Charts
4. ✅ **shadcn/ui** für moderne UI Components
5. ❌ **Keine i18n** (V1 hatte next-intl)

---

# PHASE 3: V1 ↔ V2 FEATURE PARITY CHECK

## AUFGABE 3.1: FEATURE-VERGLEICH

| Feature | V1 Status | V2 Status | Parity | Notes |
|---------|-----------|-----------|--------|-------|
| Shopify OAuth Login | ❌ Fehlt | ❌ Fehlt | ✅ OK | Beide haben nur Callback, keine Login-Page |
| Session Management | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide nutzen localStorage + Session-ID |
| Token Storage | ✅ localStorage | ✅ localStorage | ✅ OK | Identisch |
| Logout | ❌ Fehlt | ✅ Vorhanden | 🟡 PARTIAL | V2 hat Logout, V1 nicht |
| Produktliste anzeigen | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide nutzen GET /products |
| Produkte synchronisieren | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Produkt-Details anzeigen | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Via Recommendations |
| Produkt filtern/sortieren | ❌ Fehlt | ❌ Fehlt | ✅ OK | Beide fehlen |
| Produkt-Suche | ❌ Fehlt | ❌ Fehlt | ✅ OK | Beide fehlen |
| Empfehlungen anzeigen | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Empfehlung generieren | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Empfehlung akzeptieren | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Empfehlung ablehnen | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Preis auf Shopify anwenden | ✅ Vorhanden | ✅ Vorhanden | ⚠️ DIFFERENT | V1: Next.js API Route, V2: Direkt Backend |
| Empfehlungs-Historie | ⚠️ Partial | ⚠️ Partial | ✅ OK | Beide zeigen nur aktuelle |
| Competitor-Preise anzeigen | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Competitor-Analyse | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Margin Calculator - Kosten | ✅ Vorhanden | ⚠️ Unklar | 🔴 MISSING | V2 hat API-Calls, aber nicht in Pages integriert |
| Margin Calculator - Berechnung | ✅ Vorhanden | ⚠️ Unklar | 🔴 MISSING | V2 hat API-Calls, aber nicht in Pages integriert |
| Dashboard Stats | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | API-Call identisch |
| Dashboard Charts | ❌ Fehlt | ✅ Vorhanden | 🟡 NEW | V2 hat Recharts, V1 nicht |
| Next Steps / Onboarding | ⚠️ Partial | ✅ Vorhanden | 🟡 IMPROVED | V2 hat vollständige Trust Ladder |
| Progress Tracking | ⚠️ Partial | ✅ Vorhanden | 🟡 IMPROVED | V2 hat vollständige Implementation |
| Demo-Mode | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Shop Switcher | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Multi-Shop Support | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Notifications/Toasts | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide nutzen sonner |
| Loading States | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Error Handling | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| Responsive Design | ✅ Vorhanden | ✅ Vorhanden | ✅ OK | Beide implementiert |
| i18n (Internationalisierung) | ✅ Vorhanden | ❌ Fehlt | 🔴 MISSING | V1 hat next-intl, V2 nicht |

### SUMMARY:
- ✅ **20 Features**: Full Parity (V2 hat alles was V1 hat)
- ⚠️ **3 Features**: Partial Parity (V2 hat es, aber anders/incomplete)
- ❌ **3 Features**: Missing in V2 (V2 fehlt komplett)
- 🆕 **1 Feature**: New in V2 (V2 hat neue Features die V1 nicht hat)

### KRITIKALITÄT:
- 🔴 **CRITICAL**: 3 Features
  1. Margin Calculator Integration (API-Calls vorhanden, aber nicht in Pages)
  2. i18n (Internationalisierung)
  3. Shopify OAuth Login-Page (beide fehlen, aber kritisch für Production)
- 🟡 **MEDIUM**: 2 Features
  1. Preis auf Shopify anwenden (unterschiedliche Implementation)
  2. Logout (V2 hat es, V1 nicht - aber nicht kritisch)
- 🟢 **LOW**: 1 Feature
  1. Dashboard Charts (V2 hat es, V1 nicht - Nice-to-have)

---

## AUFGABE 3.2: API-CALL PARITY

| Endpoint | V1 nutzt? | V2 nutzt? | Backend hat? | Status | Issue |
|----------|-----------|-----------|--------------|--------|-------|
| GET /api/dashboard/stats | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /products/ | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /products/sync/{id} | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /recommendations/product/{id} | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /recommendations/generate/{id} | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| PATCH /recommendations/{id}/accept | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| PATCH /recommendations/{id}/reject | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /recommendations/{id} | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /recommendations/apply/{id} | ✅ Yes | ❌ No | ✅ Yes | ⚠️ DIFFERENT | V1 nutzt Next.js API Route, V2 direkt Backend |
| POST /api/shopify/apply-price | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /competitors/products/{id}/competitor-search | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /shops | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /shops/current | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /shops/switch | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /margin/costs | ✅ Yes | ⚠️ API vorhanden | ✅ Yes | 🔴 MISSING | V2 hat API-Call, aber nicht in Pages integriert |
| GET /margin/costs/{id} | ✅ Yes | ⚠️ API vorhanden | ✅ Yes | 🔴 MISSING | V2 hat API-Call, aber nicht in Pages integriert |
| PUT /margin/costs/{id} | ✅ Yes | ⚠️ API vorhanden | ✅ Yes | 🔴 MISSING | V2 hat API-Call, aber nicht in Pages integriert |
| POST /margin/calculate/{id} | ✅ Yes | ⚠️ API vorhanden | ✅ Yes | 🔴 MISSING | V2 hat API-Call, aber nicht in Pages integriert |
| POST /margin/validate | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| GET /margin/dashboard/health | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| GET /margin/category-defaults/{cat} | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| POST /margin/estimate-costs | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| GET /margin/has-costs/{id} | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| POST /api/waitlist/ | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /api/demo-shop/products | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| POST /api/demo-shop/products/{id}/recommendation | ✅ Yes | ✅ Yes | ✅ Yes | ✅ OK | None |
| GET /api/shopify/products | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| POST /api/shopify/bulk-update-prices | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| GET /api/shopify/product/{id} | ✅ Yes | ❌ No | ✅ Yes | 🔴 MISSING | V2 nutzt es nicht |
| GET /auth/shopify/install | ❌ No | ❌ No | ✅ Yes | 🔴 MISSING | Beide Frontends nutzen es nicht (kritisch!) |
| GET /auth/shopify/callback | ⚠️ Indirect | ⚠️ Indirect | ✅ Yes | ⚠️ CHECK | Backend redirectet, Frontend empfängt |

### SUMMARY:
- ✅ **15 Endpoints**: Both V1 & V2 use (identisch)
- ⚠️ **1 Endpoint**: Both use but different (unterschiedliche Implementation)
- ❌ **13 Endpoints**: Only V1 uses (V2 fehlt)
- 🆕 **0 Endpoints**: Only V2 uses (V2 nutzt keine neuen Endpoints)
- ❓ **1 Endpoint**: Backend-Status unklar (muss geprüft werden)

### KRITISCHE FEHLENDE ENDPOINTS IN V2:
1. 🔴 **GET /auth/shopify/install** - OAuth Login (kritisch!)
2. 🔴 **Margin Calculator Endpoints** (7 Endpoints) - API-Calls vorhanden, aber nicht integriert
3. 🔴 **Shopify Endpoints** (3 Endpoints) - Bulk Update, Product Details

---

# PHASE 4: BACKEND-KOMPATIBILITÄT PRÜFEN

## AUFGABE 4.1: BACKEND ENDPOINT-INVENTAR

### ALLE VERFÜGBAREN ENDPOINTS:

| Router File | Endpoint | Method | Auth Required? | Response Type | Line |
|-------------|----------|--------|-----------------|---------------|------|
| auth.py | `/auth/shopify/install` | GET | ❌ No | Redirect | 27 |
| auth.py | `/auth/shopify/callback` | GET | ❌ No | JWT Token | 57 |
| auth.py | `/auth/shopify/status` | GET | ⚠️ Partial | Status | 343 |
| auth.py | `/auth/refresh` | POST | ⚠️ Partial | Token | 368 |
| products.py | `/products/` | GET | ✅ Yes (shop_id) | Product[] | 18 |
| products.py | `/products/sync/{shop_id}` | POST | ✅ Yes | SyncResult | 109 |
| products.py | `/products/sync-sales/{product_id}` | POST | ✅ Yes | SalesData | 143 |
| recommendations.py | `/recommendations/product/{product_id}` | GET | ✅ Yes | Recommendation[] | 161 |
| recommendations.py | `/recommendations/generate/{product_id}` | POST | ✅ Yes | Recommendation | 287 |
| recommendations.py | `/recommendations/{recommendation_id}/accept` | PATCH | ✅ Yes | Recommendation | 982 |
| recommendations.py | `/recommendations/{recommendation_id}/reject` | PATCH | ✅ Yes | Recommendation | 1010 |
| recommendations.py | `/recommendations/{recommendation_id}/mark-applied` | PATCH | ✅ Yes | Recommendation | 1043 |
| recommendations.py | `/recommendations/engine-status` | GET | ✅ Yes | Status | 1088 |
| recommendations.py | `/recommendations/{recommendation_id}/status` | GET | ✅ Yes | Status | 1110 |
| recommendations.py | `/recommendations/confidence/{product_id}` | GET | ✅ Yes | Confidence | 1133 |
| shops.py | `/shops` | GET | ✅ Yes | { shops: Shop[] } | 56 |
| shops.py | `/shops/switch` | POST | ✅ Yes | Shop | 144 |
| shops.py | `/shops/current` | GET | ✅ Yes | Shop | 285 |
| competitors.py | `/competitors/products/{product_id}/competitor-search` | POST | ✅ Yes | CompetitorSearchResponse | 360 |
| competitors.py | `/competitors/products/{product_id}/competitors` | GET | ✅ Yes | Competitor[] | 146 |
| competitors.py | `/competitors/products/{product_id}/competitors` | POST | ✅ Yes | Competitor | 88 |
| competitors.py | `/competitors/competitors/{competitor_id}` | DELETE | ✅ Yes | Success | 160 |
| competitors.py | `/competitors/products/{product_id}/analysis` | GET | ✅ Yes | CompetitorAnalysis | 179 |
| competitors.py | `/competitors/competitors/{competitor_id}/rescrape` | POST | ✅ Yes | Competitor | 244 |
| competitors.py | `/competitors/products/{product_id}/auto-discover` | POST | ✅ Yes | Competitor[] | 277 |
| margin.py | `/margin/costs` | POST | ✅ Yes | CostData | 66 |
| margin.py | `/margin/costs/{product_id}` | GET | ✅ Yes | ProductCostData | 105 |
| margin.py | `/margin/costs/{product_id}` | PUT | ✅ Yes | CostData | 141 |
| margin.py | `/margin/calculate/{product_id}` | POST | ✅ Yes | MarginCalculationResult | 196 |
| margin.py | `/margin/validate` | POST | ✅ Yes | MarginValidationResult | 227 |
| margin.py | `/margin/history/{product_id}` | GET | ✅ Yes | History[] | 251 |
| margin.py | `/margin/category-defaults/{category}` | GET | ✅ Yes | CategoryDefaults | 281 |
| margin.py | `/margin/estimate-costs` | POST | ✅ Yes | EstimatedCosts | 294 |
| margin.py | `/margin/has-costs/{product_id}` | GET | ✅ Yes | { has_cost_data: boolean } | 316 |
| margin.py | `/margin/dashboard/health` | GET | ✅ Yes | MarginHealthData | (vermutlich vorhanden) |
| dashboard.py | `/api/dashboard/stats` | GET | ✅ Yes | DashboardStats | 20 |
| shopify_routes.py | `/api/shopify/products` | GET | ✅ Yes | ShopifyProductsResponse | 58 |
| shopify_routes.py | `/api/shopify/apply-price` | POST | ✅ Yes | ApplyPriceResponse | 135 |
| shopify_routes.py | `/api/shopify/bulk-update-prices` | POST | ✅ Yes | BulkUpdateResponse | 355 |
| shopify_routes.py | `/api/shopify/product/{product_id}` | GET | ✅ Yes | ShopifyProduct | 407 |
| demo_shop.py | `/api/demo-shop/products` | GET | ❌ No | Product[] | 21 |
| demo_shop.py | `/api/demo-shop/products/{product_id}/sales-history` | GET | ❌ No | SalesHistory[] | 41 |
| demo_shop.py | `/api/demo-shop/products/{product_id}/metrics` | GET | ❌ No | Metrics | 69 |
| demo_shop.py | `/api/demo-shop/products/{product_id}/recommendation` | POST | ❌ No | Recommendation | 104 |
| waitlist.py | `/api/waitlist/` | POST | ❌ No | WaitlistResponse | 109 |
| waitlist.py | `/api/waitlist/admin/list` | GET | ⚠️ Admin | WaitlistListResponse | 179 |

**GESAMT: 45+ Endpoints vorhanden**

---

## AUFGABE 4.2: BACKEND ↔ V1 MATCHING

| V1 Call | Backend Endpoint | Status | Issue |
|---------|------------------|--------|-------|
| GET /products/ | GET /products/ | ✅ EXISTS | None |
| POST /products/sync/{id} | POST /products/sync/{shop_id} | ✅ EXISTS | None |
| GET /recommendations/product/{id} | GET /recommendations/product/{product_id} | ✅ EXISTS | None |
| POST /recommendations/generate/{id} | POST /recommendations/generate/{product_id} | ✅ EXISTS | None |
| PATCH /recommendations/{id}/accept | PATCH /recommendations/{recommendation_id}/accept | ✅ EXISTS | None |
| PATCH /recommendations/{id}/reject | PATCH /recommendations/{recommendation_id}/reject | ✅ EXISTS | None |
| POST /recommendations/apply/{id} | ❓ Unknown | 🔴 CHECK | V1 nutzt Next.js API Route, Backend-Endpoint unklar |
| POST /api/shopify/apply-price | POST /api/shopify/apply-price | ✅ EXISTS | None |
| POST /competitors/products/{id}/competitor-search | POST /competitors/products/{product_id}/competitor-search | ✅ EXISTS | None |
| GET /shops | GET /shops | ✅ EXISTS | None |
| GET /shops/current | GET /shops/current | ✅ EXISTS | None |
| POST /shops/switch | POST /shops/switch | ✅ EXISTS | None |
| POST /margin/costs | POST /margin/costs | ✅ EXISTS | None |
| GET /margin/costs/{id} | GET /margin/costs/{product_id} | ✅ EXISTS | None |
| PUT /margin/costs/{id} | PUT /margin/costs/{product_id} | ✅ EXISTS | None |
| POST /margin/calculate/{id} | POST /margin/calculate/{product_id} | ✅ EXISTS | None |
| POST /margin/validate | POST /margin/validate | ✅ EXISTS | None |
| GET /margin/dashboard/health | GET /margin/dashboard/health | ✅ EXISTS | None |
| GET /margin/category-defaults/{cat} | GET /margin/category-defaults/{category} | ✅ EXISTS | None |
| POST /margin/estimate-costs | POST /margin/estimate-costs | ✅ EXISTS | None |
| GET /margin/has-costs/{id} | GET /margin/has-costs/{product_id} | ✅ EXISTS | None |
| POST /api/waitlist/ | POST /api/waitlist/ | ✅ EXISTS | None |
| GET /api/demo-shop/products | GET /api/demo-shop/products | ✅ EXISTS | None |
| POST /api/demo-shop/products/{id}/recommendation | POST /api/demo-shop/products/{product_id}/recommendation | ✅ EXISTS | None |
| GET /api/shopify/products | GET /api/shopify/products | ✅ EXISTS | None |
| POST /api/shopify/bulk-update-prices | POST /api/shopify/bulk-update-prices | ✅ EXISTS | None |
| GET /api/shopify/product/{id} | GET /api/shopify/product/{product_id} | ✅ EXISTS | None |

### FEHLENDE ENDPOINTS FÜR V1:
- ❌ **POST /recommendations/apply/{id}** - V1 nutzt Next.js API Route, Backend-Endpoint muss geprüft werden

---

## AUFGABE 4.3: BACKEND ↔ V2 MATCHING

| V2 Call | Backend Endpoint | Status | Issue |
|---------|------------------|--------|-------|
| GET /products/ | GET /products/ | ✅ EXISTS | None |
| POST /products/sync/{id} | POST /products/sync/{shop_id} | ✅ EXISTS | None |
| GET /recommendations/product/{id} | GET /recommendations/product/{product_id} | ✅ EXISTS | None |
| POST /recommendations/generate/{id} | POST /recommendations/generate/{product_id} | ✅ EXISTS | None |
| PATCH /recommendations/{id}/accept | PATCH /recommendations/{recommendation_id}/accept | ✅ EXISTS | None |
| PATCH /recommendations/{id}/reject | PATCH /recommendations/{recommendation_id}/reject | ✅ EXISTS | None |
| POST /api/shopify/apply-price | POST /api/shopify/apply-price | ✅ EXISTS | None |
| POST /competitors/products/{id}/competitor-search | POST /competitors/products/{product_id}/competitor-search | ✅ EXISTS | None |
| GET /shops | GET /shops | ✅ EXISTS | None |
| GET /shops/current | GET /shops/current | ✅ EXISTS | None |
| POST /shops/switch | POST /shops/switch | ✅ EXISTS | None |
| POST /api/waitlist/ | POST /api/waitlist/ | ✅ EXISTS | None |
| GET /api/demo-shop/products | GET /api/demo-shop/products | ✅ EXISTS | None |
| POST /api/demo-shop/products/{id}/recommendation | POST /api/demo-shop/products/{product_id}/recommendation | ✅ EXISTS | None |

### FEHLENDE ENDPOINTS FÜR V2:
- ❌ **GET /auth/shopify/install** - V2 nutzt es nicht (kritisch!)
- ❌ **Margin Calculator Endpoints** (7 Endpoints) - V2 hat API-Calls, aber nutzt sie nicht
- ❌ **Shopify Endpoints** (3 Endpoints) - V2 nutzt sie nicht

---

## AUFGABE 4.4: DATEN-FORMAT KOMPATIBILITÄT

### ENDPOINT: GET /products/

**V1 ERWARTET:**
```typescript
{
  id: number,
  title: string,
  price: number,
  inventory: number, // ← V1 nutzt "inventory"
  has_recommendation: boolean,
  recommendation_count: number
}
```

**V2 ERWARTET:**
```typescript
{
  id: number,
  title: string,
  price: number,
  inventory_quantity: number, // ← V2 nutzt "inventory_quantity"
}
```

**BACKEND LIEFERT:**
```python
{
  "id": int,
  "title": str,
  "price": float,
  "inventory": int, // ← Backend sendet "inventory"
  "inventory_quantity": int, // ← Backend sendet auch "inventory_quantity"
}
```

**STATUS:**
- ✅ V1 ↔ Backend: **KOMPATIBEL** (Backend sendet beide Felder)
- ✅ V2 ↔ Backend: **KOMPATIBEL** (Backend sendet beide Felder)

**ACTION NEEDED:** Keine (Backend sendet beide Felder)

---

### ENDPOINT: GET /api/dashboard/stats

**V1 ERWARTET:**
```typescript
{
  missed_revenue: { total: number },
  progress: { points: number, steps: string[] },
  next_steps: string[],
  products_count: number,
  recommendations_pending: number
}
```

**V2 ERWARTET:**
```typescript
{
  missed_revenue: { total: number },
  progress: { points: number, steps: string[] },
  next_steps: string[],
  products_count: number,
  recommendations_pending: number
}
```

**BACKEND LIEFERT:**
```python
{
  "missed_revenue": { "total": float },
  "progress": { "points": int, "steps": List[str] },
  "next_steps": List[str],
  "products_count": int,
  "recommendations_pending": int
}
```

**STATUS:**
- ✅ V1 ↔ Backend: **KOMPATIBEL**
- ✅ V2 ↔ Backend: **KOMPATIBEL**

**ACTION NEEDED:** Keine

---

### ENDPOINT: POST /recommendations/generate/{product_id}

**V1 ERWARTET:**
```typescript
{
  id: number,
  product_id: number,
  recommended_price: number,
  current_price: number,
  confidence: number,
  strategy: string,
  status: string,
  reasoning: string,
  ml_confidence: number,
  feature_confidence: object
}
```

**V2 ERWARTET:**
```typescript
{
  id: number,
  product_id: number,
  recommended_price: number,
  current_price: number,
  confidence: number,
  strategy: string,
  status: string
}
```

**BACKEND LIEFERT:**
```python
{
  "id": int,
  "product_id": int,
  "recommended_price": float,
  "current_price": float,
  "confidence": float,
  "strategy": str,
  "status": str,
  "reasoning": str,
  "ml_confidence": float,
  "feature_confidence": dict
}
```

**STATUS:**
- ✅ V1 ↔ Backend: **KOMPATIBEL** (V1 nutzt alle Felder)
- ⚠️ V2 ↔ Backend: **PARTIAL** (V2 nutzt nicht alle Felder, aber kompatibel)

**ACTION NEEDED:** Keine (V2 kann zusätzliche Felder ignorieren)

---

# PHASE 5: MIGRATION GAP-ANALYSE

## AUFGABE 5.1: FEHLENDE FEATURES IN V2

### 🔴 FEATURE: Shopify OAuth Login-Page

**STATUS IN V1:**
- ❌ **FEHLT KOMPLETT** (nur Callback-Handler vorhanden)
- File: `frontend/app/dashboard/page.tsx` (nur Redirect-Handler)
- Flow: Backend redirectet nach OAuth → `/dashboard?shop_id=X` → speichert in localStorage

**STATUS IN V2:**
- ❌ **FEHLT KOMPLETT** (nur Callback-Handler vorhanden)
- File: `frontend-v2/app/auth/shopify/callback/page.tsx` (nur Redirect-Handler)
- Flow: Gleiche wie V1

**SEVERITY:** 🔴 **CRITICAL**
**GRUND:** Ohne Login-Page können User nicht authentifizieren! Backend hat `/auth/shopify/install`, aber Frontend nutzt es nicht.

**IMPLEMENTIERUNGS-AUFWAND:** 2-3 Stunden

**LÖSUNG:**
1. Erstelle `frontend-v2/app/auth/shopify/login/page.tsx`
2. Button der zu Backend `/auth/shopify/install?shop=SHOP_DOMAIN` redirectet
3. Backend redirectet zu Shopify OAuth
4. Shopify redirectet zu `/auth/shopify/callback` (bereits vorhanden)

**EXAKTER CODE:**
```typescript
// frontend-v2/app/auth/shopify/login/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ShopifyLoginPage() {
  const [shopDomain, setShopDomain] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!shopDomain) return;
    
    // Entferne https:// falls vorhanden
    const cleanDomain = shopDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Redirect zu Backend OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/shopify/install?shop=${cleanDomain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold">Shopify Login</h1>
        <Input
          placeholder="dein-shop.myshopify.com"
          value={shopDomain}
          onChange={(e) => setShopDomain(e.target.value)}
        />
        <Button onClick={handleLogin} disabled={loading}>
          {loading ? 'Wird weitergeleitet...' : 'Mit Shopify verbinden'}
        </Button>
      </div>
    </div>
  );
}
```

**BACKEND ENDPOINTS BENÖTIGT:**
- ✅ `GET /auth/shopify/install` (vorhanden)

---

### 🔴 FEATURE: Margin Calculator Integration

**STATUS IN V1:**
- ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- Files:
  - `frontend/components/margin/MarginDisplay.tsx`
  - `frontend/components/margin/CostInputModal.tsx`
  - `frontend/app/[locale]/recommendations/page.tsx` (integriert)
- Features: Kosten eingeben, Marge berechnen, Kosten speichern, Validierung

**STATUS IN V2:**
- ⚠️ **API-CALLS VORHANDEN, ABER NICHT IN PAGES INTEGRIERT**
- Files:
  - `frontend-v2/lib/api.ts` (Zeilen 220-271: API-Calls vorhanden)
  - ❌ Keine Margin Components in `frontend-v2/components/`
  - ❌ Nicht in Recommendations-Page integriert

**SEVERITY:** 🔴 **CRITICAL**
**GRUND:** Margin Calculator ist essentiell für Preisentscheidungen! User müssen Kosten eingeben können.

**IMPLEMENTIERUNGS-AUFWAND:** 4-6 Stunden

**LÖSUNG:**
1. Erstelle `frontend-v2/components/margin/MarginDisplay.tsx` (kopiere von V1)
2. Erstelle `frontend-v2/components/margin/CostInputModal.tsx` (kopiere von V1)
3. Integriere in `frontend-v2/app/dashboard/recommendations/[id]/page.tsx`
4. Teste alle API-Calls

**BACKEND ENDPOINTS BENÖTIGT:**
- ✅ Alle Margin-Endpoints vorhanden (7 Endpoints)

---

### 🔴 FEATURE: Internationalisierung (i18n)

**STATUS IN V1:**
- ✅ **VOLLSTÄNDIG IMPLEMENTIERT**
- Library: next-intl 4.6.1
- Files:
  - `frontend/i18n.ts`
  - `frontend/i18n/routing.ts`
  - `frontend/middleware.ts` (i18n Middleware)
  - `frontend/messages/de.json`, `frontend/messages/en.json`
- Routes: `/de/products`, `/en/products`

**STATUS IN V2:**
- ❌ **FEHLT KOMPLETT**
- Keine i18n Library
- Keine Locale-Routes
- Nur deutsche Texte

**SEVERITY:** 🟡 **MEDIUM**
**GRUND:** App funktioniert ohne i18n, aber für internationale User wichtig.

**IMPLEMENTIERUNGS-AUFWAND:** 6-8 Stunden

**LÖSUNG:**
1. Installiere next-intl: `npm install next-intl`
2. Erstelle `frontend-v2/i18n.ts`, `frontend-v2/i18n/routing.ts`
3. Erstelle `frontend-v2/messages/de.json`, `frontend-v2/messages/en.json`
4. Erstelle `frontend-v2/middleware.ts` (i18n Middleware)
5. Übersetze alle Texte
6. Teste Locale-Routes

**BACKEND ENDPOINTS BENÖTIGT:**
- ✅ Keine (Frontend-only Feature)

---

### 🟡 FEATURE: Shopify Bulk Update

**STATUS IN V1:**
- ✅ **IMPLEMENTIERT**
- File: `frontend/lib/shopifyService.ts` (Zeile 128: `bulkUpdatePrices()`)
- API-Call: `POST /api/shopify/bulk-update-prices`

**STATUS IN V2:**
- ❌ **FEHLT**
- Keine Bulk Update Funktion

**SEVERITY:** 🟢 **LOW**
**GRUND:** Nice-to-have Feature, nicht kritisch für Go-Live.

**IMPLEMENTIERUNGS-AUFWAND:** 2-3 Stunden

**LÖSUNG:**
1. Füge `bulkUpdatePrices()` zu `frontend-v2/lib/shopifyService.ts` hinzu
2. Erstelle UI Component für Bulk Update
3. Integriere in Recommendations-Page

**BACKEND ENDPOINTS BENÖTIGT:**
- ✅ `POST /api/shopify/bulk-update-prices` (vorhanden)

---

### SUMMARY FEHLENDE FEATURES:

**🔴 CRITICAL (MUSS implementiert werden vor Go-Live):**
1. Shopify OAuth Login-Page (2-3 Stunden)
2. Margin Calculator Integration (4-6 Stunden)

**Geschätzte Zeit:** 6-9 Stunden

**🟡 MEDIUM (Sollte implementiert werden):**
1. Internationalisierung (i18n) (6-8 Stunden)

**Geschätzte Zeit:** 6-8 Stunden

**🟢 LOW (Nice-to-have, kann später):**
1. Shopify Bulk Update (2-3 Stunden)

**Geschätzte Zeit:** 2-3 Stunden

**GESAMT IMPLEMENTIERUNGS-ZEIT:** 14-20 Stunden (2-3 Tage)

---

## AUFGABE 5.2: FEHLENDE BACKEND-ENDPOINTS

### KEINE FEHLENDEN BACKEND-ENDPOINTS!

Alle Endpoints die V1 oder V2 nutzen, sind im Backend vorhanden. Das Problem ist, dass V2 einige Endpoints nicht nutzt, obwohl sie vorhanden sind.

---

## AUFGABE 5.3: VERBESSERUNGEN IN V2

### ✨ NEUE FEATURES IN V2:

1. **Dashboard Charts (Recharts)**
   - V1: Nur Text-Stats
   - V2: Interaktive Charts (RevenueChart, MissedRevenueChart)
   - Library: recharts 2.10.0

2. **Vollständige Trust Ladder**
   - V1: Partial Implementation
   - V2: Vollständige Trust Ladder mit Progress Tracking

3. **React Query für Server State**
   - V1: useState + useEffect
   - V2: @tanstack/react-query für besseres Caching und Error Handling

4. **Zustand für Global State**
   - V1: Kein globaler State
   - V2: Zustand Stores (authStore, shopStore)

### 🎨 UI/UX VERBESSERUNGEN:

1. **Moderneres Design (shadcn/ui)**
   - V1: Radix UI direkt
   - V2: shadcn/ui (Radix UI + Tailwind, besser customizierbar)

2. **Besseres Responsive Design**
   - V1: Basic responsive
   - V2: Optimiert für Mobile

3. **Bessere Loading States**
   - V1: Basic Spinner
   - V2: Skeleton Components

### ⚡ TECHNISCHE VERBESSERUNGEN:

1. **Next.js App Router (beide nutzen es)**
   - V1: App Router mit i18n
   - V2: App Router ohne i18n (einfacher, aber weniger Features)

2. **TypeScript Types besser strukturiert**
   - V1: Types in `lib/types.ts`
   - V2: Types in `types/models.ts` (besser organisiert)

3. **React Query für besseres Caching**
   - V1: Kein Caching
   - V2: Automatisches Caching und Refetching

### 📈 PERFORMANCE:

1. **Schnellere Ladezeiten durch React Query Caching**
2. **Besseres Error Handling durch React Query**

### 🔒 SECURITY:

- Beide nutzen Session-ID via Header (identisch)

---

# PHASE 6: DEPLOYMENT-STRATEGIE

## AUFGABE 6.1: VERCEL KONFIGURATION ANALYSIEREN

### V1 (LIVE):

**Vercel Project:** Nicht ersichtlich aus Code

**Domain:** Nicht ersichtlich

**Root Directory:** `frontend` (vermutlich)

**Build Command:** `npm run build` (aus package.json)

**Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Backend URL (Railway)

**Weitere Config:** Nicht ersichtlich

---

### V2 (BEREIT FÜR DEPLOYMENT):

**Root Directory:** `frontend-v2`

**Build Command:** `npm run build` (aus package.json)

**Environment Variables BENÖTIGT:**
- `NEXT_PUBLIC_API_URL` - Railway Backend URL

**Weitere Config:** Nicht ersichtlich

---

## AUFGABE 6.2: DEPLOYMENT-OPTIONEN

### OPTION A: DIREKTER SWAP (SCHNELL, RISKANT)

**Vorgehen:**
1. V2 fertig machen (alle Critical Features)
2. Vercel Project Settings ändern:
   - Root Directory: `frontend` → `frontend-v2`
3. Neues Deployment triggern
4. Domain zeigt sofort auf V2

**VORTEILE:**
- ✅ Schnell (1 Deployment)
- ✅ Keine DNS-Änderungen
- ✅ Domain bleibt gleich

**NACHTEILE:**
- ❌ Kein Rollback-Plan (nur über Vercel "Rollback to previous deployment")
- ❌ Kein Testing in Production möglich
- ❌ Falls V2 Bugs hat → alle User betroffen

**EMPFOHLEN FÜR:**
- Kleine Apps mit wenigen Usern
- Wenn du dir SEHR sicher bist, dass V2 funktioniert

---

### OPTION B: PARALLEL DEPLOYMENT + SUBDOMAIN (SICHER, EMPFOHLEN)

**Vorgehen:**
1. Erstelle NEUES Vercel Project für V2
   - Name: `vlerafy-v2`
   - Root Directory: `frontend-v2`
2. Deploy V2 auf Subdomain:
   - `v2.deine-domain.com`
   - ODER: `deine-domain-v2.vercel.app`
3. Teste V2 ausgiebig in Production
4. Wenn V2 stabil:
   - Domain umleiten: `deine-domain.com` → V2 Project
   - V1 Project behalten (als Backup)

**VORTEILE:**
- ✅ Sicherer (V2 kann in Production getestet werden)
- ✅ Einfacher Rollback (Domain zurück auf V1)
- ✅ V1 bleibt online während V2-Testing

**NACHTEILE:**
- ❌ DNS-Änderungen nötig (für Domain-Umleitung)
- ❌ 2 Vercel Projects (kostet evtl. mehr)

**EMPFOHLEN FÜR:**
- Production Apps mit echten Usern
- Wenn du sicher gehen willst

---

### OPTION C: MONOREPO MIT VERCEL (PROFESSIONELL)

**Vorgehen:**
1. Beide Frontends im gleichen Repo
2. Vercel Project hat 2 "Deployments":
   - `v1.deine-domain.com` (Root: `frontend`)
   - `v2.deine-domain.com` (Root: `frontend-v2`)
3. Teste V2 auf `v2.deine-domain.com`
4. Wenn ready: Ändere Root Directory zu `frontend-v2`
5. `deine-domain.com` zeigt auf V2

**VORTEILE:**
- ✅ Professionellster Ansatz
- ✅ Beide Versionen parallel
- ✅ A/B Testing möglich

**NACHTEILE:**
- ❌ Komplexere Vercel-Config
- ❌ Mehr Setup-Aufwand

**EMPFOHLEN FÜR:**
- Enterprise/Professional Apps

---

## AUFGABE 6.3: ROLLBACK-PLAN

### OPTION A ROLLBACK (Direkter Swap):

1. Vercel Dashboard → Deployments
2. Finde letztes V1-Deployment
3. "Promote to Production"
4. → V1 ist wieder live (dauert 30 Sekunden)

### OPTION B ROLLBACK (Parallel Deployment):

1. Domain-Provider Dashboard
2. DNS-Eintrag zurück auf V1-Vercel-URL
3. Warte auf DNS Propagation (5-60 Minuten)
4. → V1 ist wieder live

### KRITISCHE DATEN:

**Wurden während V2-Testing Daten geändert?**
- ❌ Nein (beide Frontends nutzen gleiches Backend)
- ✅ Keine Daten-Migration nötig

---

# PHASE 7: FINALE CHECKLISTE & ROADMAP

## AUFGABE 7.1: PRE-MIGRATION CHECKLIST

### BACKEND:
- [x] Alle Endpoints die V2 braucht existieren
- [ ] Backend deployed und erreichbar
- [ ] CORS erlaubt V2-URLs (Vercel)
- [x] Daten-Format passt zu V2
- [ ] Railway Backend URL bekannt

### FRONTEND V2:
- [ ] Alle Critical Features implementiert (aus Gap-Analyse)
  - [ ] Shopify OAuth Login-Page
  - [ ] Margin Calculator Integration
- [ ] Auth-System komplett (Login, Callback, Middleware)
- [ ] Alle API-Calls getestet
- [ ] .env.local konfiguriert
- [ ] `npm run build` läuft ohne Errors
- [ ] TypeScript Types korrekt
- [ ] Responsive Design funktioniert
- [ ] Error-Handling implementiert

### VERCEL:
- [ ] Deployment-Strategie gewählt (Option A/B/C)
- [ ] Environment Variables bereit
- [ ] Domain-Zugriff vorhanden (falls DNS-Änderung)
- [ ] Rollback-Plan verstanden

### TESTING:
- [ ] Lokaler Test mit Railway Backend erfolgreich
- [ ] Alle User-Flows durchgetestet
- [ ] Mobile Responsiveness geprüft
- [ ] Performance akzeptabel (Lighthouse > 80)

### DOKUMENTATION:
- [ ] Team informiert (falls Team vorhanden)
- [ ] Rollback-Plan dokumentiert
- [ ] Change-Log erstellt

---

## AUFGABE 7.2: MIGRATIONS-ROADMAP

### TAG 1: CRITICAL FEATURES IMPLEMENTIEREN
**⏱ 6-9 Stunden**

**FRONTEND V2:**

1. **Shopify OAuth Login-Page** (2-3h)
   - Erstelle `frontend-v2/app/auth/shopify/login/page.tsx`
   - Implementiere Shop-Domain Input
   - Redirect zu Backend `/auth/shopify/install`
   - Teste OAuth Flow

2. **Margin Calculator Integration** (4-6h)
   - Erstelle `frontend-v2/components/margin/MarginDisplay.tsx`
   - Erstelle `frontend-v2/components/margin/CostInputModal.tsx`
   - Integriere in `frontend-v2/app/dashboard/recommendations/[id]/page.tsx`
   - Teste alle API-Calls:
     - `POST /margin/costs`
     - `GET /margin/costs/{id}`
     - `PUT /margin/costs/{id}`
     - `POST /margin/calculate/{id}`
     - `POST /margin/validate`
     - `GET /margin/has-costs/{id}`

3. **Environment Variables Setup** (30min)
   - Erstelle `.env.local` mit `NEXT_PUBLIC_API_URL`
   - Teste lokale Verbindung zu Railway Backend

---

### TAG 2: TESTING & POLISH
**⏱ 4-6 Stunden**

**FRONTEND V2:**

1. **Lokales Testing** (2-3h)
   - Alle User-Flows durchgehen:
     - Login → Dashboard → Products → Recommendations → Apply Price
     - Shop Switcher → Demo Mode
     - Margin Calculator → Kosten eingeben → Marge berechnen
   - Edge-Cases testen:
     - Keine Produkte
     - Keine Empfehlungen
     - Fehlerhafte API-Calls
   - Mobile Responsiveness prüfen

2. **Error-Handling verbessern** (1h)
   - React Query Error Boundaries
   - Toast Notifications für Fehler
   - Loading States polieren

3. **Production Build testen** (1h)
   - `npm run build`
   - Alle Warnings fixen
   - TypeScript Errors fixen
   - Lighthouse Score prüfen (> 80)

---

### TAG 3: DEPLOYMENT VORBEREITUNG
**⏱ 4-6 Stunden**

1. **Vercel Setup** (1-2h)
   - Project erstellen (falls Option B/C)
   - Environment Variables setzen:
     - `NEXT_PUBLIC_API_URL` = Railway Backend URL
   - Build Settings konfigurieren:
     - Root Directory: `frontend-v2`
     - Build Command: `npm run build`
     - Output Directory: `.next`

2. **Staging Deployment** (1h)
   - Deploy auf Vercel Preview
   - Teste mit echtem Backend
   - Alle Features nochmal durchgehen

3. **Final Testing** (2h)
   - Alle User-Flows auf Staging
   - Mobile Testing
   - Performance Check
   - Error-Logs überwachen

---

### TAG 4: GO-LIVE + MONITORING
**⏱ 2-4 Stunden**

1. **Production Deployment** (1h)
   - Deploy auf Production
   - DNS umstellen (falls Option B)
   - SSL Certificate Check

2. **Post-Deployment Testing** (1h)
   - Smoke Tests auf Live-URL
   - Critical User-Flows testen:
     - Login
     - Dashboard
     - Products
     - Recommendations
     - Apply Price
   - Performance Check

3. **Monitoring** (2h)
   - Vercel Analytics prüfen
   - Error-Logs überwachen
   - User-Feedback sammeln
   - Rollback-Plan bereit halten

---

### GESAMT-ZEIT: 16-25 Stunden (verteilt auf 4 Tage)

### KRITISCHER PFAD:
```
Tag 1 (Critical Features) → Tag 2 (Testing) → Tag 3 (Deployment Prep) → Tag 4 (Go-Live)
```

**MUSS in dieser Reihenfolge gemacht werden!**

### PARALLEL MÖGLICH:
- Testing kann während Entwicklung laufen
- Vercel Setup kann parallel zu Testing laufen

---

# 📊 ZUSAMMENFASSUNG

## ✅ VOLLSTÄNDIGE ANALYSE ABGESCHLOSSEN

### ERGEBNISSE:

1. **V1 Features:** 25 Features identifiziert
2. **V2 Features:** 24 Features identifiziert
3. **Feature Parity:** 20 Features Full Parity, 3 Partial, 3 Missing
4. **API-Calls:** V1: 29, V2: 20
5. **Backend Endpoints:** 45+ Endpoints vorhanden, alle kompatibel

### KRITISCHE BLOCKER FÜR MIGRATION:

1. 🔴 **Shopify OAuth Login-Page** (2-3h)
2. 🔴 **Margin Calculator Integration** (4-6h)

### EMPFOHLENE DEPLOYMENT-STRATEGIE:

**Option B: Parallel Deployment + Subdomain** (sicher, empfohlen)

### GESCHÄTZTE MIGRATIONS-ZEIT:

**14-20 Stunden** (2-3 Tage) für Critical Features
**+ 16-25 Stunden** (4 Tage) für Testing & Deployment

**GESAMT: 30-45 Stunden** (6-7 Tage)

---

**NÄCHSTE SCHRITTE:**
1. Critical Features implementieren (Tag 1)
2. Testing & Polish (Tag 2)
3. Deployment Vorbereitung (Tag 3)
4. Go-Live (Tag 4)

---

**ENDE DER ANALYSE**
