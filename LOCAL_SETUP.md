# 🚀 LOKALES SETUP - Frontend-v2 + Backend

## 📋 Übersicht

Dieses Setup ermöglicht dir, **Frontend-v2 lokal zu entwickeln**, während:
- ✅ **Production-Backend auf Railway** weiterläuft (unbeeinträchtigt)
- ✅ **Lokales Backend** parallel läuft (für Entwicklung)
- ✅ **Frontend-v2** lokal auf Port 3001 läuft

---

## 🔧 SCHRITT 1: Backend lokal starten

### Option A: Mit Docker Compose (EMPFOHLEN)

```bash
# Im Hauptverzeichnis (MVP PRICE)
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE"

# Docker Compose starten (PostgreSQL + Redis + Backend)
docker-compose up -d

# Backend läuft jetzt auf http://localhost:8000
```

**Was passiert:**
- PostgreSQL startet auf Port 5432
- Redis startet auf Port 6379
- Backend startet auf Port 8000
- Celery Worker + Beat starten automatisch

### Option B: Backend manuell starten (ohne Docker)

```bash
# Terminal 1: PostgreSQL starten (falls lokal installiert)
# Oder nutze Docker nur für DB:
docker-compose up postgres redis -d

# Terminal 2: Backend starten
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

---

## 🎨 SCHRITT 2: Frontend-v2 starten

```bash
# In neuem Terminal
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE\frontend-v2"

# Dependencies installieren (nur beim ersten Mal)
npm install

# Development Server starten
npm run dev
```

**Frontend läuft auf:** `http://localhost:3001`

---

## 🔗 SCHRITT 3: URLs & Ports

| Service | URL | Port |
|---------|-----|------|
| **Frontend-v2 (neu)** | http://localhost:3001 | 3001 |
| **Frontend-v1 (alt)** | http://localhost:3000 | 3000 |
| **Backend (lokal)** | http://localhost:8000 | 8000 |
| **Backend (Production)** | https://api.vlerafy.com | - |
| **PostgreSQL (lokal)** | localhost:5432 | 5432 |
| **Redis (lokal)** | localhost:6379 | 6379 |

---

## ⚙️ Environment Variables

### Frontend-v2 `.env.local`:

```env
# Für lokales Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# ODER für Production-Backend (wenn du das testen willst)
# NEXT_PUBLIC_API_URL=https://api.vlerafy.com
```

### Backend `.env` (im backend/ Ordner):

```env
# Database (lokal)
DATABASE_URL=postgresql://pricing_user:pricing_pass@localhost:5432/pricing_db

# Redis (lokal)
REDIS_URL=redis://localhost:6379/0

# Shopify OAuth (von Railway kopieren)
SHOPIFY_CLIENT_ID=deine_client_id
SHOPIFY_CLIENT_SECRET=dein_client_secret
SHOPIFY_REDIRECT_URI=http://localhost:8000/auth/shopify/callback
FRONTEND_URL=http://localhost:3001

# Encryption Key (WICHTIG: Muss gesetzt sein!)
ENCRYPTION_KEY=dein-encryption-key-von-railway

# Serper API (optional)
SERPER_API_KEY=03747d151fc1c88012b79a24dc19c4397becbd3d

# JWT Secret
JWT_SECRET=dein-jwt-secret-von-railway

# App URL
APP_URL=http://localhost:8000
```

**💡 Tipp:** Kopiere die Environment Variables von Railway:
1. Railway Dashboard → Dein Backend Service
2. Variables Tab
3. Alle Werte kopieren → `.env` Datei im `backend/` Ordner

---

## 🧪 TESTEN

### 1. Backend Health Check:
```bash
curl http://localhost:8000/health
```

### 2. Frontend-v2 öffnen:
```
http://localhost:3001
```

### 3. Demo Dashboard testen:
```
http://localhost:3001/demo
```

---

## 🛑 STOPPEN

### Docker Compose stoppen:
```bash
docker-compose down
```

### Frontend stoppen:
```bash
# Im Frontend-Terminal: Ctrl + C
```

---

## 🔄 PARALLEL-BETRIEB

**Wichtig:** Beide Frontends können gleichzeitig laufen:

- **Frontend-v1:** `http://localhost:3000` (altes Frontend)
- **Frontend-v2:** `http://localhost:3001` (neues Frontend)

**Beide nutzen:**
- **Lokales Backend:** `http://localhost:8000`
- **Oder Production:** `https://api.vlerafy.com` (wenn in `.env.local` gesetzt)

---

## 🐛 TROUBLESHOOTING

### Problem: Port 8000 bereits belegt
```bash
# Prüfe was auf Port 8000 läuft
netstat -ano | findstr :8000

# Oder ändere Backend-Port in docker-compose.yml:
# ports:
#   - "8001:8000"  # Backend läuft dann auf 8001
```

### Problem: Frontend kann Backend nicht erreichen
1. Prüfe `.env.local` in `frontend-v2/`
2. Stelle sicher dass `NEXT_PUBLIC_API_URL=http://localhost:8000`
3. Backend muss laufen: `curl http://localhost:8000/health`

### Problem: CORS Fehler
Backend muss `FRONTEND_URL=http://localhost:3001` in `.env` haben!

---

## ✅ CHECKLISTE

- [ ] Docker Compose gestartet (`docker-compose up -d`)
- [ ] Backend läuft (`curl http://localhost:8000/health`)
- [ ] Frontend-v2 Dependencies installiert (`npm install`)
- [ ] Frontend-v2 läuft (`npm run dev`)
- [ ] `.env.local` in `frontend-v2/` erstellt
- [ ] Backend `.env` mit Railway-Variablen gefüllt
- [ ] Browser: `http://localhost:3001` öffnet

**Fertig! 🎉**
