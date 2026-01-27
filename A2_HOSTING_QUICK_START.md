# A2 Hosting Quick Start Guide

## 🚀 Quick Deployment (3 Steps)

### Step 1: Run Deployment Script

**On Windows (PowerShell):**
```powershell
.\deploy-a2hosting.ps1
```

**On Linux/Mac:**
```bash
chmod +x deploy-a2hosting.sh
./deploy-a2hosting.sh
```

The script will ask for:
- FTP Host (e.g., `ftp.yourdomain.com`)
- FTP Username (your cPanel username)
- FTP Password
- Domain Name (e.g., `yourdomain.com`)

### Step 2: Complete Setup in cPanel

1. **Log in to cPanel**: `https://yourdomain.com:2083`
2. **Setup Node.js App**:
   - Go to "Setup Node.js App" or "Node.js Selector"
   - Create new application
   - Node.js Version: **18.x or 20.x**
   - Application Root: `/home/yourusername/api`
   - Application URL: `/api`
   - Startup File: `index.js`
   - Click **Create**
3. **Install Dependencies**:
   - In your Node.js app settings, click **Run NPM Install**
   - Enter: `package.json`
   - Click **Install**
4. **Upload Environment Files**:
   - Upload `api.env.template` to `/api/.env` (rename it to `.env`)
   - Upload `public_html.env.template` to `/public_html/.env` (rename it to `.env`)
5. **Set Permissions** (in File Manager):
   - `api/database/` → **755**
   - `api/uploads/` → **775**
6. **Start Application**:
   - Click **Start** or **Restart** in Node.js app settings

### Step 3: Test Your Website

- **Main Site**: `https://yourdomain.com`
- **Admin Panel**: `https://yourdomain.com/admin`
- **API Health**: `https://yourdomain.com/api/health`

**Default Admin Login:**
- Email: `admin@iticollege.edu`
- Password: `admin123`
- ⚠️ **CHANGE THIS IMMEDIATELY!**

---

## 📋 What You Need

Before starting, have ready:
- ✅ A2 Hosting cPanel login
- ✅ FTP/SFTP credentials (usually same as cPanel)
- ✅ Your domain name
- ✅ cPanel username

---

## 🔧 Alternative: Manual Upload

If the script doesn't work, see **[A2_HOSTING_DEPLOYMENT.md](./A2_HOSTING_DEPLOYMENT.md)** for manual step-by-step instructions.

---

## ❓ Need Help?

1. Check **[A2_HOSTING_DEPLOYMENT.md](./A2_HOSTING_DEPLOYMENT.md)** for detailed instructions
2. See **Troubleshooting** section in the deployment guide
3. Contact A2 Hosting support (24/7 available)

---

**That's it! Your website should be live in about 15-20 minutes.** 🎉
