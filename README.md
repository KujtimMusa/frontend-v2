# Vlerafy Frontend v2

Modern Next.js 14 Frontend mit shadcn/ui für die Vlerafy Pricing-Anwendung.

## Setup

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft auf `http://localhost:3001`

## Features

- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ shadcn/ui Komponenten
- ✅ TanStack Query für API-Calls
- ✅ Zustand für State Management
- ✅ Tailwind CSS
- ✅ Responsive Design
- ✅ Dark Mode Support

## Struktur

- `app/` - Next.js App Router Pages
- `components/` - React Komponenten
- `lib/` - Utilities & API Client
- `stores/` - Zustand Stores
- `types/` - TypeScript Types

## Environment Variables

Erstelle `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
