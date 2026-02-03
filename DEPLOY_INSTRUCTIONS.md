# 🚀 DEPLOY FRONTEND V2 TO GITHUB - INSTRUCTIONS

**Repository:** https://github.com/KujtimMusa/frontend-v2

---

## OPTION 1: PowerShell Script (Windows - Empfohlen)

```powershell
cd "C:\Users\Kujti\Desktop\Trading Tools\MVP PRICE\frontend-v2"
.\deploy-to-github.ps1
```

**Falls Script nicht ausgeführt werden kann:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-to-github.ps1
```

---

## OPTION 2: Bash Script (Mac/Linux/Git Bash)

```bash
cd frontend-v2
chmod +x deploy-to-github.sh
./deploy-to-github.sh
```

---

## OPTION 3: Manuelle Git Commands

### Schritt 1: Git initialisieren
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

**Falls Authentifizierung nötig:**
- GitHub Personal Access Token verwenden
- Oder: GitHub CLI (`gh auth login`)

---

## WICHTIG: .env Dateien

**✅ Bereits in .gitignore:**
- `.env*.local` - Ignoriert
- `.env` - Wurde hinzugefügt

**Stelle sicher dass keine .env Dateien committed werden!**

---

## NACH DEM PUSH

1. ✅ Repository ist auf GitHub verfügbar
2. ✅ Vercel kann Repository verbinden:
   - Vercel Dashboard → Add Project
   - Import: `KujtimMusa/frontend-v2`
   - Root Directory: `frontend-v2` (falls Monorepo)
3. ✅ Auto-Deploy kann aktiviert werden

---

## VERIFICATION

Nach dem Push:
- Öffne: https://github.com/KujtimMusa/frontend-v2
- Prüfe ob alle Dateien vorhanden sind
- Prüfe ob `.env` Dateien NICHT committed wurden

---

**ENDE**
