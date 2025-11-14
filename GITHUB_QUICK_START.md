# 🚀 GitHub Deployment Checklist

## Before Pushing to GitHub

### ✅ Files to Check

- [ ] `.gitignore` exists in project root
- [ ] `.env` file NOT tracked by git (should be in .gitignore)
- [ ] `node_modules/` folder NOT in git (should be in .gitignore)
- [ ] `.env.example` exists showing configuration
- [ ] README.md looks good (with human voice!)
- [ ] Both backend and frontend folders ready

---

## Commands to Run (In Order)

### Open PowerShell and Navigate
```powershell
cd e:\OneDrive\Desktop\google_calender_clone
```

### 1️⃣ Initialize Git
```powershell
git init
```

### 2️⃣ Add GitHub Remote
```powershell
git remote add origin https://github.com/YOUR_USERNAME/GoogleCalendarClone.git
```

### 3️⃣ Create/Update .gitignore
Make sure your `.gitignore` has:
```
node_modules/
.env
.env.local
build/
dist/
.DS_Store
npm-debug.log*
```

### 4️⃣ Stage Everything
```powershell
git add .
```

### 5️⃣ Check Status (Optional but Recommended)
```powershell
git status
```

Should show many "new file" entries, NOT node_modules or .env

### 6️⃣ Create First Commit
```powershell
git commit -m "Initial commit: Google Calendar Clone - full stack project"
```

### 7️⃣ Set Main Branch & Push
```powershell
git branch -M main
git push -u origin main
```

---

## All Together (Copy-Paste)

```powershell
cd e:\OneDrive\Desktop\google_calender_clone
git init
git remote add origin https://github.com/YOUR_USERNAME/GoogleCalendarClone.git
git add .
git commit -m "Initial commit: Google Calendar Clone - full stack project"
git branch -M main
git push -u origin main
```

---

## What Happens

1. ✅ Your code gets uploaded to GitHub
2. ✅ All folders and files appear on GitHub.com
3. ✅ Your README is displayed on the repo homepage
4. ✅ No secrets (no .env, no node_modules)
5. ✅ Others can clone and use your project

---

## After Push - Verify

Visit: `https://github.com/YOUR_USERNAME/GoogleCalendarClone`

Should see:
- ✅ backend/ folder
- ✅ frontend/ folder
- ✅ README.md
- ✅ All your documentation files
- ✅ NO node_modules/
- ✅ NO .env file

---

## Future Changes

Each time you modify code:

```powershell
git add .
git commit -m "Describe what changed"
git push origin main
```

That's it! 🎉

---

## Need Help?

### If git commands don't work:
1. Make sure you're in the right directory (`google_calender_clone`)
2. Make sure Git is installed (run `git --version`)
3. Check your GitHub username is correct in the URL

### If push fails:
1. Check internet connection
2. Verify GitHub credentials
3. Make sure repo exists on GitHub (https://github.com/YOUR_USERNAME/GoogleCalendarClone)

### If .env or node_modules got pushed:
See "Common Issues & Solutions" in GITHUB_DEPLOYMENT.md

---

## Quick Reference

| Task | Command |
|------|---------|
| Initialize Git | `git init` |
| Add remote | `git remote add origin [url]` |
| Check status | `git status` |
| Stage files | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Verify remote | `git remote -v` |

---

Ready to deploy? Follow the "All Together" section above! 🚀
