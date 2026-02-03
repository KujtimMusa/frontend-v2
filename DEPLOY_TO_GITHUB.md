# 🚀 DEPLOY FRONTEND V2 TO GITHUB

**Repository:** https://github.com/KujtimMusa/frontend-v2

---

## GIT COMMANDS (Manuell ausführen)

### Schritt 1: Git initialisieren (falls noch nicht geschehen)

```bash
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE\frontend-v2"
git init
```

### Schritt 2: Remote Repository hinzufügen

```bash
git remote add origin https://github.com/KujtimMusa/frontend-v2.git
```

### Schritt 3: Alle Dateien hinzufügen

```bash
git add .
```

### Schritt 4: Commit erstellen

```bash
git commit -m "Initial commit: V2 Frontend - Production Ready"
```

### Schritt 5: Zu GitHub pushen

```bash
git branch -M main
git push -u origin main
```

---

## WICHTIG: .env Dateien prüfen

**Stelle sicher dass `.gitignore` folgende Dateien ignoriert:**
- `.env`
- `.env.local`
- `.env.production`

**Aktuell in .gitignore:**
- ✅ `.env*.local` - Ignoriert

**Falls `.env` Datei existiert:**
- Prüfe ob sie sensible Daten enthält
- Falls ja: Entferne sie oder füge `.env` zu `.gitignore` hinzu

---

## ALTERNATIVE: GitHub CLI (falls installiert)

```bash
gh repo create frontend-v2 --public --source=. --remote=origin --push
```

---

## NACH DEM PUSH

1. ✅ Repository ist auf GitHub verfügbar
2. ✅ Vercel kann Repository verbinden
3. ✅ Auto-Deploy kann aktiviert werden

---

**ENDE**
