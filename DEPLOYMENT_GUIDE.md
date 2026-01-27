# ITI College Website - cPanel Deployment Guide

This guide will walk you through deploying the ITI College website to a cPanel hosting environment.

> **💡 Tip**: For easier deployments, consider using Git. See **[GIT_DEPLOYMENT_GUIDE.md](./GIT_DEPLOYMENT_GUIDE.md)** for Git-based deployment instructions.

## 📋 Prerequisites

1. **cPanel Access**: You need access to your cPanel hosting account
2. **Domain**: A domain name pointing to your hosting
3. **Node.js Support**: Your hosting must support Node.js (most cPanel hosts do)
4. **File Manager or FTP**: Access to upload files via cPanel File Manager or FTP client

## 🗂️ Project Structure Overview

```
iti/
├── client/          # React Frontend (needs to be built)
├── server/          # Node.js Backend
└── README.md
```

## 📦 Step 1: Prepare Files for Production

### 1.1 Build the Frontend

On your local machine:

```bash
cd client
npm install
npm run build
```

This creates a `client/dist` folder with production-ready files.

### 1.2 Prepare Server Files

Ensure your server files are ready:
- All dependencies installed (`server/node_modules` should exist)
- Database will be created automatically on first run
- Uploads folder exists (`server/uploads/`)

## 🚀 Step 2: Upload Files to cPanel

### 2.1 Access cPanel File Manager

1. Log in to your cPanel account
2. Navigate to **File Manager**
3. Go to `public_html` (or your domain's root directory)

### 2.2 Upload Frontend Files

1. Upload **ALL contents** from `client/dist/` folder to `public_html/`
   - This includes: `index.html`, `assets/` folder, and all other files
   - **Important**: Upload the contents, not the `dist` folder itself

### 2.3 Upload Backend Files

1. Create a folder named `api` in `public_html/` (or outside `public_html` for security)
2. Upload **ALL contents** from `server/` folder to this `api/` folder:
   - `controllers/`
   - `routes/`
   - `middleware/`
   - `database/`
   - `uploads/`
   - `index.js`
   - `package.json`
   - `node_modules/` (or install via SSH)

**Security Note**: For better security, you can place the `api` folder outside `public_html` and configure your server accordingly.

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create `.env` File for Backend

In your `api/` folder, create a `.env` file with:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**⚠️ Important**: 
- Replace `your-super-secret-jwt-key-change-this-in-production` with a strong random string
- Generate a secure JWT secret: You can use an online generator or run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 3.2 Create `.env` File for Frontend

In your `public_html/` folder (or where your frontend files are), create a `.env` file:

```env
VITE_API_URL=https://yourdomain.com/api
```

**Replace `yourdomain.com` with your actual domain name.**

**Note**: If your API is on a different subdomain or port, adjust accordingly:
- Same domain: `https://yourdomain.com/api`
- Subdomain: `https://api.yourdomain.com`
- Different port: `https://yourdomain.com:5000/api`

## 🔧 Step 4: Install Node.js Dependencies

### Option A: Using cPanel Node.js Selector (Recommended)

1. In cPanel, find **Node.js Selector** or **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js Version**: Select latest LTS (18.x or 20.x)
   - **Application Root**: `/home/username/api` (path to your api folder)
   - **Application URL**: `/api` or your subdomain
   - **Application Startup File**: `index.js`
   - **Application Mode**: Production
4. Click **Create**
5. In the application settings, click **Run NPM Install**
6. Enter `package.json` location: `package.json` (relative to app root)
7. Click **Install**

### Option B: Using SSH (If Available)

1. Access your server via SSH
2. Navigate to your API folder:
   ```bash
   cd ~/api
   ```
3. Install dependencies:
   ```bash
   npm install --production
   ```

## 🌐 Step 5: Configure Domain and Routing

### 5.1 Set Up Domain Routing

You need to configure your server so that:
- Frontend routes (React Router) work correctly
- API requests go to `/api/*`

### 5.2 Create `.htaccess` for Frontend (Apache)

In `public_html/`, create or update `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Don't rewrite API requests
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>
```

### 5.3 Configure API Proxy (If Needed)

If your Node.js app runs on a different port, you may need to set up a reverse proxy. In cPanel:

1. Go to **Apache Configuration** or use `.htaccess` in `api/` folder:

```apache
<IfModule mod_proxy.c>
  ProxyPass /api http://localhost:5000/api
  ProxyPassReverse /api http://localhost:5000/api
</IfModule>
```

**Note**: Some hosts require you to configure this through their control panel instead of `.htaccess`.

## 🗄️ Step 6: Database Setup

The SQLite database will be created automatically on first server start. Ensure:

1. The `api/database/` folder has write permissions (755 or 775)
2. The database file location is writable

To set permissions via cPanel File Manager:
1. Right-click `database/` folder
2. Select **Change Permissions**
3. Set to `755` (or `775` if needed)

## 📁 Step 7: Uploads Folder Permissions

1. Ensure `api/uploads/` folder exists
2. Set permissions to `755` or `775` (writable)
3. This folder stores uploaded PDFs, images, etc.

## 🚀 Step 8: Start the Node.js Application

### Using cPanel Node.js Selector:

1. Go to **Node.js Selector**
2. Find your application
3. Click **Start** or **Restart**
4. Check logs if there are any errors

### Using SSH (Alternative):

```bash
cd ~/api
node index.js
```

Or use PM2 for process management:

```bash
npm install -g pm2
cd ~/api
pm2 start index.js --name iti-api
pm2 save
pm2 startup
```

## ✅ Step 9: Verify Deployment

### 9.1 Test Frontend

1. Visit `https://yourdomain.com`
2. Check if the homepage loads
3. Navigate through pages
4. Check browser console for errors

### 9.2 Test API

1. Visit `https://yourdomain.com/api/health`
2. Should return: `{"status":"OK","message":"Server is running"}`
3. Test admin login: `https://yourdomain.com/api/admin/login`

### 9.3 Test Admin Panel

1. Go to `https://yourdomain.com/admin`
2. Login with default credentials:
   - **Email**: `admin@iticollege.edu`
   - **Password**: `admin123`
3. **⚠️ IMPORTANT**: Change the password immediately after first login!

## 🔒 Step 10: Security Checklist

- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET in `.env`
- [ ] Enabled HTTPS/SSL certificate
- [ ] Set proper file permissions (755 for folders, 644 for files)
- [ ] Database file has restricted permissions
- [ ] `.env` files are not publicly accessible
- [ ] Removed any debug/development files
- [ ] Updated all hardcoded URLs to use environment variables

## 🐛 Troubleshooting

### Issue: Frontend shows blank page

**Solution**:
1. Check browser console for errors
2. Verify `VITE_API_URL` in frontend `.env` is correct
3. Ensure all files from `dist/` are uploaded
4. Check `.htaccess` rewrite rules

### Issue: API returns 404

**Solution**:
1. Verify Node.js app is running (check cPanel Node.js Selector)
2. Check API URL in frontend `.env`
3. Verify API routes are accessible
4. Check server logs for errors

### Issue: Database errors

**Solution**:
1. Check database folder permissions (should be 755)
2. Verify database file is writable
3. Check server logs for specific error messages

### Issue: File uploads not working

**Solution**:
1. Check `uploads/` folder permissions (should be 755 or 775)
2. Verify folder exists
3. Check server logs for upload errors
4. Ensure `multer` is properly configured

### Issue: CORS errors

**Solution**:
1. Update CORS settings in `server/index.js` to include your domain
2. Check if API URL matches your actual domain

## 📝 Environment Variables Reference

### Backend (`api/.env`)

```env
PORT=5000                    # Port for Node.js server
NODE_ENV=production          # Environment mode
JWT_SECRET=your-secret-key   # JWT signing secret (CHANGE THIS!)
```

### Frontend (`public_html/.env`)

```env
VITE_API_URL=https://yourdomain.com/api
```

## 🔄 Updating the Website

### To update frontend:

1. Make changes locally
2. Run `npm run build` in `client/` folder
3. Upload new `dist/` contents to `public_html/`
4. Clear browser cache

### To update backend:

1. Make changes locally
2. Upload changed files to `api/` folder
3. Restart Node.js app in cPanel
4. Check logs for errors

## 📞 Support

If you encounter issues:

1. Check server logs in cPanel
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure all file permissions are correct
5. Contact your hosting provider if Node.js app won't start

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Change default admin password
2. ✅ Test all major features
3. ✅ Set up regular database backups
4. ✅ Monitor server logs
5. ✅ Set up SSL certificate (if not already done)

---

**Last Updated**: January 2026
**Version**: 1.0
