# Maner Pvt ITI - Production Deployment Guide

## Server Information
- **Main Domain**: https://manerpvtiti.space
- **API Subdomain**: https://api.manerpvtiti.space
- **Server Path**: /home/ecowells/manerpvtiti.space

## Quick Deployment Steps

### 1. Upload Files to Server

**Option A: Using Git (Recommended)**
```bash
# SSH into your server
ssh ecowells@your-server-ip

# Navigate to your home directory
cd /home/ecowells

# Clone or pull the repository
git clone YOUR_REPO_URL manerpvtiti.space
# OR if already exists
cd manerpvtiti.space && git pull
```

**Option B: Using FTP/File Manager**
Upload all project files to `/home/ecowells/manerpvtiti.space`

### 2. Deploy on Server

```bash
# Navigate to project directory
cd /home/ecowells/manerpvtiti.space

# Make deployment script executable
chmod +x deploy-production.sh

# Run deployment
./deploy-production.sh
```

### 3. Manual Deployment (Alternative)

If automatic deployment doesn't work:

#### Frontend (Main Domain)
```bash
cd /home/ecowells/manerpvtiti.space/client
npm install
npm run build
cp -r dist/* /home/ecowells/public_html/
cp public/.htaccess /home/ecowells/public_html/
```

#### Backend (API Subdomain)
```bash
# Create API directory
mkdir -p /home/ecowells/api.manerpvtiti.space
cd /home/ecowells/manerpvtiti.space/server
cp -r * /home/ecowells/api.manerpvtiti.space/

# Install dependencies
cd /home/ecowells/api.manerpvtiti.space
npm install --production

# Copy and configure environment
cp .env.example .env
nano .env  # Edit JWT_SECRET and other settings

# Start server with PM2
pm2 start index.js --name maner-iti-api
pm2 save
pm2 startup
```

## cPanel Configuration

### API Subdomain Setup

1. Go to **cPanel > Subdomains**
2. Create subdomain: `api.manerpvtiti.space`
3. Document Root: `/home/ecowells/api.manerpvtiti.space`

### Node.js App Setup (if cPanel has Node.js selector)

1. Go to **cPanel > Setup Node.js App**
2. Create new application:
   - Node.js version: 18.x or higher
   - Application mode: Production
   - Application root: `/home/ecowells/api.manerpvtiti.space`
   - Application URL: `api.manerpvtiti.space`
   - Application startup file: `index.js`

### SSL Certificates

Enable SSL for both domains:
1. **cPanel > SSL/TLS > Let's Encrypt**
2. Generate certificates for:
   - `manerpvtiti.space`
   - `www.manerpvtiti.space`
   - `api.manerpvtiti.space`

## Default Credentials

```
Admin Panel: https://manerpvtiti.space/admin
Email: admin@iticollege.edu
Password: admin123
```

⚠️ **IMPORTANT**: Change the password immediately after first login!

## Post-Deployment Checklist

- [ ] SSL certificates enabled
- [ ] Admin password changed
- [ ] JWT_SECRET updated in .env
- [ ] PM2 startup configured
- [ ] Test all pages
- [ ] Test admin panel
- [ ] Test form submissions
- [ ] Test file uploads

## Troubleshooting

### API Not Working
1. Check if Node.js is running: `pm2 status`
2. Check logs: `pm2 logs maner-iti-api`
3. Verify port 5000 is accessible

### CORS Errors
- Check server/.env has correct FRONTEND_URL
- Verify API subdomain is configured correctly

### 404 on Page Refresh
- Ensure .htaccess is in public_html
- Check Apache mod_rewrite is enabled

### Database Issues
- Check database file permissions: `chmod 664 database/database.sqlite`
- Check database folder permissions: `chmod 755 database/`

## Support

For any issues, check:
1. PM2 logs: `pm2 logs maner-iti-api`
2. Apache error logs: `/var/log/apache2/error.log`
3. Browser console for frontend errors
