# 🚀 LOKAL STARTEN - Port 3001

## ⚡ SCHNELLSTART (3 Schritte)

### 1️⃣ Backend starten (Docker)

```powershell
# Im Hauptverzeichnis
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE"

# Docker Compose starten
docker-compose up -d
```

**✅ Backend läuft auf:** `http://localhost:8000`

---

### 2️⃣ Frontend starten

```powershell
# In neuem Terminal zum Frontend-Ordner
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE\frontend-v2"

# Dependencies installieren (nur beim ersten Mal)
npm install

# Development Server starten
npm run dev
```

**✅ Frontend läuft auf:** `http://localhost:3001`

---

### 3️⃣ Browser öffnen

Öffne im Browser:
```
http://localhost:3001
```

**Oder Demo-Dashboard direkt:**
```
http://localhost:3001/demo
```

---

## 📋 VORAUSSETZUNGEN

### ✅ Environment Variables prüfen

**Backend `.env`** (im `backend/` Ordner):
```env
DATABASE_URL=postgresql://pricing_user:pricing_pass@postgres:5432/pricing_db
REDIS_URL=redis://redis:6379/0
FRONTEND_URL=http://localhost:3001
ENCRYPTION_KEY=dein-key-von-railway
JWT_SECRET=dein-secret-von-railway
SHOPIFY_CLIENT_ID=deine-client-id
SHOPIFY_CLIENT_SECRET=dein-client-secret
```

**Frontend `.env.local`** (im `frontend-v2/` Ordner):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🛑 STOPPEN

### Backend stoppen:
```powershell
docker-compose down
```

### Frontend stoppen:
Im Terminal: **Ctrl + C**

---

## 🐛 PROBLEME?

### Port 3001 bereits belegt?
```powershell
# Prüfe was auf Port 3001 läuft
netstat -ano | findstr :3001
```

### Backend nicht erreichbar?
```powershell
# Prüfe ob Container laufen
docker-compose ps

# Prüfe Backend-Logs
docker-compose logs backend

# Backend neu starten
docker-compose restart backend
```

### Frontend zeigt Fehler?
1. Prüfe ob `.env.local` existiert
2. Prüfe ob Backend läuft: `http://localhost:8000/health`
3. Prüfe Terminal-Ausgabe für Fehlermeldungen

---

## 📝 NPM SCRIPTS

```bash
npm run dev      # Startet auf Port 3001 (Development)
npm run build    # Production Build
npm run start    # Production Server auf Port 3001
npm run lint     # Code-Linting
```

---

## ✅ CHECKLISTE

- [ ] Docker Desktop läuft
- [ ] `docker-compose up -d` ausgeführt
- [ ] Backend erreichbar: `http://localhost:8000/health`
- [ ] `npm install` ausgeführt (nur beim ersten Mal)
- [ ] `npm run dev` läuft
- [ ] Browser: `http://localhost:3001` öffnet

**Fertig! 🎉**
