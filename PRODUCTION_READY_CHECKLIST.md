# Production Ready Checklist - manerpvtiti.space

## ✅ Completed Changes

### 1. Fixed Hardcoded URLs
- ✅ Removed all `http://localhost:5000` hardcoded URLs from `Home.jsx`
- ✅ Updated to use API service functions (`getNotices`, `getFlashNews`, `getSettings`)
- ✅ PDF links now use environment variable for base URL
- ✅ Server console logs updated for production environment

### 2. Environment Configuration
- ✅ Frontend `.env.production` configured:
  - `VITE_API_URL=https://api.manerpvtiti.space/api`
  - `VITE_SITE_URL=https://manerpvtiti.space`
- ✅ Backend `.env.example` configured:
  - `API_DOMAIN=https://api.manerpvtiti.space`
  - `FRONTEND_URL=https://manerpvtiti.space`

### 3. API Service Updates
- ✅ Added `getSettings()` function to API service
- ✅ All API calls now use centralized API service

### 4. Git Configuration
- ✅ `.gitignore` properly configured:
  - Ignores `.env` files (but keeps `.env.production` and `.env.example`)
  - Ignores `node_modules/`
  - Ignores build outputs (`client/dist/`)
  - Ignores database files (`*.sqlite`)
  - Ignores uploads (but keeps `.gitkeep`)

## 📋 Pre-Deployment Checklist

Before deploying to production, ensure:

- [ ] **Backend `.env` file created** on server with:
  - Strong `JWT_SECRET` (generate using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
  - `NODE_ENV=production`
  - `API_DOMAIN=https://api.manerpvtiti.space`
  - `FRONTEND_URL=https://manerpvtiti.space`

- [ ] **Frontend built** with production environment:
  ```bash
  cd client
  npm run build
  ```

- [ ] **SSL Certificates** enabled for:
  - `manerpvtiti.space`
  - `www.manerpvtiti.space`
  - `api.manerpvtiti.space`

- [ ] **Default admin password changed** after first login:
  - Email: `admin@iticollege.edu`
  - Default Password: `admin123` ⚠️ **CHANGE THIS!**

- [ ] **File permissions set**:
  - `api/database/`: 755
  - `api/uploads/`: 775

- [ ] **Node.js app running** (via PM2 or cPanel Node.js Selector)

## 🚀 Deployment URLs

- **Main Website**: https://manerpvtiti.space
- **Admin Panel**: https://manerpvtiti.space/admin
- **API Health Check**: https://api.manerpvtiti.space/api/health

## 📝 Git Push Instructions

See below for Git setup and push commands.

---

**Last Updated**: January 28, 2026
**Status**: ✅ Production Ready
