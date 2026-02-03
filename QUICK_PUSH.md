# ⚡ QUICK PUSH TO GITHUB

**Repository:** https://github.com/KujtimMusa/frontend-v2

---

## 🚀 OPTION 1: Batch Script (Einfachste Methode)

**Doppelklick auf:**
```
frontend-v2/push-to-github.bat
```

Das Script führt alle Schritte automatisch aus!

---

## 🚀 OPTION 2: PowerShell Script

**Rechtsklick auf:**
```
frontend-v2/deploy-to-github.ps1
```

**Wähle:** "Run with PowerShell"

**Falls Fehler:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy-to-github.ps1
```

---

## 🚀 OPTION 3: Manuell (PowerShell)

Öffne PowerShell im `frontend-v2` Ordner:

```powershell
git init
git remote add origin https://github.com/KujtimMusa/frontend-v2.git
git add .
git commit -m "Initial commit: V2 Frontend - Production Ready"
git branch -M main
git push -u origin main
```

---

## ✅ NACH DEM PUSH

1. Öffne: https://github.com/KujtimMusa/frontend-v2
2. Prüfe ob alle Dateien vorhanden sind
3. Vercel kann jetzt Repository verbinden!

---

**ENDE**
