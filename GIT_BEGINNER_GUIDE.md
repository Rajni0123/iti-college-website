# 🚀 Git Setup - Beginner Guide (Zero Se Start)
## Maner Pvt ITI Website

---

## 📋 STEP 0: Pehle Ye Samjho

**Git Kya Hai?**
- Git ek tool hai jo aapke code ko track karta hai
- Aap apna code online (GitHub) par save kar sakte ho
- Server par easily deploy kar sakte ho

**GitHub Kya Hai?**
- Ye online storage hai jahan aapka code rehta hai
- Free account bana sakte ho

---

## 📋 STEP 1: GitHub Account Banao

1. Browser mein jao: https://github.com
2. "Sign Up" par click karo
3. Email, Password, Username dalo
4. Account verify karo (email check karo)

---

## 📋 STEP 2: GitHub Par New Repository Banao

1. GitHub mein login karo
2. Right side mein "+" icon par click karo
3. "New repository" select karo
4. Details bharo:
   ```
   Repository name: maner-pvt-iti
   Description: Maner Pvt ITI College Website
   ✅ Private (private rakho)
   ❌ Add a README file (UNCHECK rakho)
   ```
5. "Create repository" button dabao
6. **Repository URL copy karo** - ye milega:
   ```
   https://github.com/YOUR_USERNAME/maner-pvt-iti.git
   ```

---

## 📋 STEP 3: Git Install Karo (Agar Nahi Hai)

### Windows:
1. Download karo: https://git-scm.com/download/win
2. Installer run karo
3. "Next Next Next" karte raho, default settings theek hain
4. Install complete hone do

### Check Karo Git Install Hua:
PowerShell ya CMD kholo aur likho:
```powershell
git --version
```
Agar version dikhaye (jaise `git version 2.42.0`) to sahi hai!

---

## 📋 STEP 4: Git Configure Karo (Ek Baar Karna Hai)

PowerShell/CMD mein ye commands run karo:

```powershell
# Apna naam set karo (jo GitHub profile mein hai)
git config --global user.name "Aapka Naam"

# Apna email set karo (jo GitHub mein register kiya hai)
git config --global user.email "aapka-email@example.com"
```

**Example:**
```powershell
git config --global user.name "Rahul Kumar"
git config --global user.email "rahul@gmail.com"
```

---

## 📋 STEP 5: Project Folder Mein Jao

PowerShell/CMD kholo aur project folder mein jao:

```powershell
# I drive mein jao
I:

# iti folder mein jao
cd iti

# Check karo sahi jagah ho
dir
```

Aapko ye files dikhni chahiye:
- client (folder)
- server (folder)
- .gitignore
- README.md

---

## 📋 STEP 6: Extra Folders Hatao (Important!)

Aapke project mein kuch duplicate folders hain jo hatane hain:

```powershell
# Extra folders delete karo (PowerShell mein)
Remove-Item -Recurse -Force "git"
Remove-Item -Recurse -Force "Maner pvt iti"
```

---

## 📋 STEP 7: Git Repository Initialize Karo

```powershell
# Git initialize karo
git init
```

Ye command `.git` folder create karega (hidden folder)

---

## 📋 STEP 8: Files Add Karo

```powershell
# Sabhi files add karo staging mein
git add .

# Check karo kya add hua
git status
```

**Green files** = ye files add ho gayi
**Red files** = ye abhi add nahi hui

---

## 📋 STEP 9: Pehla Commit Karo

```powershell
# Commit karo with message
git commit -m "Initial commit - Maner Pvt ITI Website"
```

---

## 📋 STEP 10: GitHub Se Connect Karo

```powershell
# GitHub repository add karo (URL apna daalo)
git remote add origin https://github.com/YOUR_USERNAME/maner-pvt-iti.git

# Branch name set karo
git branch -M main
```

**Example:**
```powershell
git remote add origin https://github.com/rahul123/maner-pvt-iti.git
git branch -M main
```

---

## 📋 STEP 11: Code Push Karo GitHub Par

```powershell
# Pehli baar push karo
git push -u origin main
```

**Login Popup Aayega:**
- Browser khulega
- GitHub mein login karo
- "Authorize" par click karo

Push complete hone do (1-2 minute lag sakta hai)

---

## ✅ DONE! Ab Check Karo

1. Browser mein jao: https://github.com/YOUR_USERNAME/maner-pvt-iti
2. Aapka saara code wahan dikhna chahiye!

---

## 📋 FUTURE MEIN: Jab Bhi Code Change Karo

Jab bhi naya code add karo ya changes karo:

```powershell
# 1. Changes dekho
git status

# 2. Sabhi changes add karo
git add .

# 3. Commit karo with message
git commit -m "Kya change kiya wo likho"

# 4. Push karo
git push
```

**Example:**
```powershell
git add .
git commit -m "Fixed login page bug"
git push
```

---

## 🖥️ SERVER PAR DEPLOY KAISE KARO

### SSH Se Server Mein Login:
```bash
ssh ecowells@your-server-ip
```

### Pehli Baar (Clone Karo):
```bash
cd /home/ecowells
git clone https://github.com/YOUR_USERNAME/maner-pvt-iti.git manerpvtiti.space
cd manerpvtiti.space
chmod +x deploy-production.sh
./deploy-production.sh
```

### Baad Mein (Update Karo):
```bash
cd /home/ecowells/manerpvtiti.space
git pull
./deploy-production.sh
```

---

## ❓ Common Problems & Solutions

### Problem: "Permission denied"
```powershell
# GitHub login again karo
git config --global credential.helper manager
```

### Problem: "Repository not found"
- URL check karo, spelling galat ho sakti hai
- Repository private hai to login karo pehle

### Problem: "Nothing to commit"
- Koi changes nahi hai, ya already commit ho gaya

### Problem: "Failed to push"
```powershell
# Pehle pull karo fir push
git pull origin main
git push origin main
```

---

## 📁 Final Folder Structure

```
i:\iti\
├── client\                 # Frontend (React)
│   ├── src\
│   ├── public\
│   ├── .env.production     # Production API URL
│   ├── package.json
│   └── vite.config.js
├── server\                 # Backend (Node.js)
│   ├── controllers\
│   ├── routes\
│   ├── database\
│   ├── middleware\
│   ├── uploads\
│   ├── .env.example        # Environment template
│   ├── index.js
│   └── package.json
├── .gitignore              # Git ignore rules
├── deploy-production.sh    # Deployment script
├── README.md
└── PRODUCTION_DEPLOYMENT.md
```

---

## 🎯 Quick Commands Cheat Sheet

| Kya Karna Hai | Command |
|---------------|---------|
| Git initialize | `git init` |
| Files add karo | `git add .` |
| Status dekho | `git status` |
| Commit karo | `git commit -m "message"` |
| Push karo | `git push` |
| Pull karo | `git pull` |
| Branch dekho | `git branch` |
| Log dekho | `git log --oneline` |

---

**🎉 Congratulations! Ab aap Git use kar sakte ho!**
