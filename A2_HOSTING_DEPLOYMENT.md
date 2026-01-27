# A2 Hosting Deployment Guide

This guide will help you deploy the ITI College website to A2 Hosting using cPanel.

## 📋 Prerequisites

1. **A2 Hosting Account**: Active hosting account with cPanel access
2. **Domain**: Your domain name (e.g., `yourdomain.com`)
3. **Credentials**: 
   - cPanel username and password
   - FTP/SFTP credentials (if using FTP deployment)
   - SSH access (optional, but recommended)

## 🔑 Required Information

Before starting, gather these details from your A2 Hosting account:

- **cPanel URL**: Usually `https://yourdomain.com:2083` or `https://cpanel.yourdomain.com`
- **cPanel Username**: Your hosting account username
- **Domain Name**: Your main domain (e.g., `yourdomain.com`)
- **Server Path**: Usually `/home/username/public_html` (replace `username` with your cPanel username)
- **Node.js Support**: Check if A2 Hosting supports Node.js (most plans do)

## 🚀 Deployment Options

### Option 1: Automated FTP/SFTP Deployment (Recommended)

Use the provided deployment script with your FTP credentials.

### Option 2: Manual cPanel Deployment

Upload files manually through cPanel File Manager.

### Option 3: Git Deployment (If SSH Available)

Use Git to deploy directly from your repository.

---

## 📦 Option 1: Automated FTP/SFTP Deployment

### Step 1: Configure Deployment Script

1. Open `deploy-a2hosting.sh` (or `deploy-a2hosting.ps1` for Windows)
2. Update the following variables with your A2 Hosting details:

```bash
# A2 Hosting Configuration
FTP_HOST="ftp.yourdomain.com"  # or your A2 Hosting FTP server
FTP_USER="your_cpanel_username"
FTP_PASS="your_ftp_password"
DOMAIN="yourdomain.com"
CPANEL_USER="your_cpanel_username"
```

### Step 2: Run Deployment Script

**On Linux/Mac:**
```bash
chmod +x deploy-a2hosting.sh
./deploy-a2hosting.sh
```

**On Windows (PowerShell):**
```powershell
.\deploy-a2hosting.ps1
```

The script will:
1. Build the frontend
2. Upload frontend files to `public_html/`
3. Upload backend files to `api/` folder
4. Set up environment files
5. Provide instructions for final setup

---

## 📁 Option 2: Manual cPanel Deployment

### Step 1: Build Frontend Locally

```bash
cd client
npm install
npm run build
```

This creates a `client/dist/` folder with production files.

### Step 2: Access cPanel File Manager

1. Log in to your A2 Hosting cPanel
2. Navigate to **File Manager**
3. Go to `public_html` folder (this is your website root)

### Step 3: Upload Frontend Files

1. Delete all existing files in `public_html/` (if any)
2. Upload **ALL contents** from `client/dist/` folder to `public_html/`
   - Select all files in `dist/` folder
   - Upload them directly to `public_html/` (not in a subfolder)
3. Upload `client/public/.htaccess` to `public_html/` (if it exists)

### Step 4: Create API Folder

1. In cPanel File Manager, create a new folder called `api` in `public_html/`
   - **OR** (better for security) create it outside `public_html/` at the same level

### Step 5: Upload Backend Files

1. Upload **ALL contents** from `server/` folder to the `api/` folder:
   - `controllers/`
   - `routes/`
   - `middleware/`
   - `database/`
   - `uploads/`
   - `index.js`
   - `package.json`
   - `.htaccess` (if exists)

### Step 6: Set Up Environment Files

#### Backend Environment (`.env` in `api/` folder)

Create a `.env` file in your `api/` folder with:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-strong-random-secret-key-here
API_DOMAIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
DATABASE_PATH=./database/database.sqlite
MAX_FILE_SIZE=50mb
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontend Environment (`.env` in `public_html/`)

Create a `.env` file in `public_html/` with:

```env
VITE_API_URL=https://yourdomain.com/api
VITE_SITE_URL=https://yourdomain.com
```

**Note**: For Vite, you may need to rebuild after setting environment variables, or set them before building.

### Step 7: Install Node.js Dependencies

#### Using cPanel Node.js Selector (Recommended)

1. In cPanel, find **Setup Node.js App** or **Node.js Selector**
2. Click **Create Application**
3. Configure:
   - **Node.js Version**: 18.x or 20.x (LTS)
   - **Application Root**: `/home/yourusername/api` (path to your api folder)
   - **Application URL**: `/api` or create a subdomain like `api.yourdomain.com`
   - **Application Startup File**: `index.js`
   - **Application Mode**: Production
4. Click **Create**
5. In the application settings, click **Run NPM Install**
6. Enter package location: `package.json`
7. Click **Install**

#### Using SSH (Alternative)

If you have SSH access:

```bash
cd ~/api
npm install --production
```

### Step 8: Set File Permissions

In cPanel File Manager:

1. Right-click `api/database/` folder → **Change Permissions** → Set to `755`
2. Right-click `api/uploads/` folder → **Change Permissions** → Set to `775` (writable)
3. Right-click `api/database/database.sqlite` (if exists) → **Change Permissions** → Set to `664`

### Step 9: Start Node.js Application

#### Using cPanel Node.js Selector:

1. Go to **Setup Node.js App**
2. Find your application
3. Click **Start** or **Restart**
4. Check logs for any errors

#### Using SSH with PM2 (Recommended for Production):

```bash
# Install PM2 globally
npm install -g pm2

# Navigate to API folder
cd ~/api

# Start the application
pm2 start index.js --name iti-api

# Save PM2 configuration
pm2 save

# Set up PM2 to start on server reboot
pm2 startup
```

### Step 10: Configure Domain Routing

#### Create `.htaccess` for Frontend

In `public_html/.htaccess`, ensure you have:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API requests
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html (for React Router)
  RewriteRule ^ index.html [L]
</IfModule>
```

#### Configure API Proxy (If Needed)

If your Node.js app runs on a different port, you may need to configure a reverse proxy. Contact A2 Hosting support or check their documentation for setting up reverse proxies.

---

## 🔧 Option 3: Git Deployment (SSH Required)

If you have SSH access and want to use Git:

### Step 1: SSH into Your Server

```bash
ssh yourusername@yourdomain.com
```

### Step 2: Clone Repository

```bash
cd ~
git clone YOUR_REPO_URL iti-website
cd iti-website
```

### Step 3: Run Deployment Script

```bash
chmod +x deploy-a2hosting.sh
./deploy-a2hosting.sh
```

Or manually:

```bash
# Build frontend
cd client
npm install
npm run build

# Copy frontend to public_html
cp -r dist/* ~/public_html/

# Copy backend to api folder
mkdir -p ~/api
cp -r server/* ~/api/

# Install backend dependencies
cd ~/api
npm install --production

# Set permissions
chmod -R 755 ~/api/database
chmod -R 775 ~/api/uploads

# Start with PM2
pm2 start index.js --name iti-api
pm2 save
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads at `https://yourdomain.com`
- [ ] API responds at `https://yourdomain.com/api/health`
- [ ] Admin panel accessible at `https://yourdomain.com/admin`
- [ ] Default admin login works:
  - Email: `admin@iticollege.edu`
  - Password: `admin123`
- [ ] **CHANGED default admin password** ⚠️
- [ ] SSL certificate enabled (HTTPS)
- [ ] File uploads working
- [ ] Database created and accessible
- [ ] Node.js app running (check PM2 or cPanel)
- [ ] JWT_SECRET updated in `.env`

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET in `.env`
- [ ] Enabled HTTPS/SSL certificate
- [ ] Set proper file permissions (755 for folders, 644 for files)
- [ ] Database file has restricted permissions (664)
- [ ] `.env` files are not publicly accessible
- [ ] Removed any debug/development files
- [ ] Updated all hardcoded URLs to use environment variables

---

## 🐛 Troubleshooting

### Frontend Shows Blank Page

1. Check browser console for errors
2. Verify `VITE_API_URL` in frontend `.env` is correct
3. Ensure all files from `dist/` are uploaded
4. Check `.htaccess` rewrite rules
5. Clear browser cache

### API Returns 404

1. Verify Node.js app is running (check cPanel Node.js Selector or PM2)
2. Check API URL in frontend `.env`
3. Verify API routes are accessible
4. Check server logs for errors
5. Ensure reverse proxy is configured (if needed)

### Database Errors

1. Check database folder permissions (should be 755)
2. Verify database file is writable (664)
3. Check server logs for specific error messages
4. Ensure SQLite3 is installed on server

### File Uploads Not Working

1. Check `uploads/` folder permissions (should be 775)
2. Verify folder exists
3. Check server logs for upload errors
4. Ensure `multer` is properly configured
5. Check file size limits in `.env`

### CORS Errors

1. Update CORS settings in `server/index.js` to include your domain
2. Check if API URL matches your actual domain
3. Verify `FRONTEND_URL` in backend `.env` is correct

### Node.js App Won't Start

1. Check Node.js version (should be 18.x or 20.x)
2. Verify all dependencies are installed
3. Check application logs in cPanel
4. Ensure `index.js` is the correct startup file
5. Verify `.env` file exists and has correct values

---

## 📞 A2 Hosting Support

If you encounter issues specific to A2 Hosting:

1. **Check A2 Hosting Documentation**: https://www.a2hosting.com/kb/
2. **Contact Support**: Available 24/7 via live chat, phone, or ticket
3. **Node.js Support**: Verify your hosting plan includes Node.js support
4. **SSH Access**: Some plans require enabling SSH access in cPanel

---

## 🔄 Updating the Website

### Update Frontend

1. Make changes locally
2. Run `npm run build` in `client/` folder
3. Upload new `dist/` contents to `public_html/`
4. Clear browser cache

### Update Backend

1. Make changes locally
2. Upload changed files to `api/` folder
3. Restart Node.js app in cPanel or via PM2: `pm2 restart iti-api`
4. Check logs for errors

---

## 📝 Environment Variables Reference

### Backend (`api/.env`)

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-strong-random-secret-key
API_DOMAIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
DATABASE_PATH=./database/database.sqlite
MAX_FILE_SIZE=50mb
```

### Frontend (`public_html/.env` or build-time)

```env
VITE_API_URL=https://yourdomain.com/api
VITE_SITE_URL=https://yourdomain.com
```

**Note**: For Vite, environment variables must be set before building. If you need to change them after deployment, rebuild the frontend.

---

## 🎉 Success!

Once deployed, your website should be live at:
- **Main Site**: `https://yourdomain.com`
- **Admin Panel**: `https://yourdomain.com/admin`
- **API**: `https://yourdomain.com/api`

Remember to:
1. ✅ Change the default admin password
2. ✅ Set a strong JWT_SECRET
3. ✅ Enable SSL/HTTPS
4. ✅ Test all functionality

---

**Last Updated**: January 2026  
**Version**: 1.0
