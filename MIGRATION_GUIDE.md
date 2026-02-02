# ITI College Website - Migration Guide

## Current Setup
- **Domain:** manerpvtiti.space
- **Hosting:** A2 Hosting (cPanel + LiteSpeed + Passenger)
- **Node.js:** v20 (via nodevenv)
- **Database:** SQLite (file: `server/database/iti_college.db`)
- **Frontend:** React (Vite build) → served as static files
- **Backend:** Node.js + Express → runs via Passenger
- **Uploads:** `server/uploads/` folder (student documents, images)

---

## Important Files (DO NOT LOSE)

| File/Folder | What it contains |
|---|---|
| `server/database/iti_college.db` | ALL data - students, admissions, fees, settings, notices, results, gallery, etc. |
| `server/uploads/` | All uploaded files - photos, aadhaar, marksheets, PDFs |
| `server/.env` | JWT secret, admin credentials, API config |

---

## Scenario 1: New Domain on SAME A2 Hosting

Example: Moving from `manerpvtiti.space` → `manerpvtiti.com`

### Step 1: Add New Domain in cPanel
1. Login to cPanel → **Domains** or **Addon Domains**
2. Add new domain (e.g., `manerpvtiti.com`)
3. Note the document root path (e.g., `/home/ecowells/manerpvtiti.com/`)

### Step 2: Copy All Files
```bash
# SSH into server
ssh ecowells@your-server-ip

# Copy entire server folder
cp -r ~/manerpvtiti.space/server ~/manerpvtiti.com/server

# Copy frontend files
cp -r ~/manerpvtiti.space/assets ~/manerpvtiti.com/
cp ~/manerpvtiti.space/index.html ~/manerpvtiti.com/
cp ~/manerpvtiti.space/vite.svg ~/manerpvtiti.com/

# Copy uploads (IMPORTANT - all student documents)
# Already inside server/ but verify
ls ~/manerpvtiti.com/server/uploads/

# Copy api proxy folder if exists
cp -r ~/manerpvtiti.space/api ~/manerpvtiti.com/
```

### Step 3: Setup Node.js for New Domain
1. cPanel → **Setup Node.js App**
2. Create new application:
   - Node.js version: **20**
   - Application mode: **Production**
   - Application root: `manerpvtiti.com/server`
   - Application URL: `manerpvtiti.com`
   - Application startup file: `index.js`
3. Click **Create** → Note the activation command

### Step 4: Install Dependencies
```bash
# Activate node virtual env for new domain
source /home/ecowells/nodevenv/manerpvtiti.com/server/20/bin/activate

# Go to server directory
cd ~/manerpvtiti.com/server

# Install dependencies
npm install
```

### Step 5: Update .env File
```bash
nano ~/manerpvtiti.com/server/.env
```
Update:
```
DOMAIN=manerpvtiti.com
CORS_ORIGIN=https://manerpvtiti.com
# Keep same JWT_SECRET to avoid logging out existing sessions
```

### Step 6: Update .htaccess
```bash
nano ~/manerpvtiti.com/.htaccess
```
Make sure API proxy points correctly:
```apache
RewriteEngine On

# API proxy to Node.js
RewriteRule ^api/(.*)$ /server/$1 [P,L]

# Frontend routing (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

### Step 7: Update Frontend API URL
In your local code:
```bash
# Update client/.env or client/src/services/api.js
# Change: https://manerpvtiti.space/api
# To:     https://manerpvtiti.com/api
```
Then rebuild and deploy:
```bash
cd client && npm run build
cp -r dist/* ~/manerpvtiti.com/
```

### Step 8: Restart Node.js App
```bash
source /home/ecowells/nodevenv/manerpvtiti.com/server/20/bin/activate
cd ~/manerpvtiti.com/server
node restart-app.js
```

### Step 9: Setup SSL
1. cPanel → **SSL/TLS** or **Let's Encrypt**
2. Issue certificate for new domain
3. Enable **Force HTTPS**

### Step 10: Redirect Old Domain (Optional)
Add to old domain's `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTP_HOST} ^(www\.)?manerpvtiti\.space$ [NC]
RewriteRule ^(.*)$ https://manerpvtiti.com/$1 [R=301,L]
```

### Step 11: Verify
- [ ] Website loads on new domain
- [ ] Admin login works
- [ ] All data visible (admissions, fees, students)
- [ ] Uploaded images/documents accessible
- [ ] Fee receipts generate correctly
- [ ] New admissions can be created

---

## Scenario 2: Migrate to COMPLETELY DIFFERENT Hosting

Example: Moving from A2 Hosting → DigitalOcean / Hostinger / AWS / VPS

### Step 1: Backup Everything from Old Server

```bash
# SSH into OLD server
ssh ecowells@old-server-ip

# Create backup folder
mkdir ~/backup-iti

# Backup database (MOST IMPORTANT)
cp ~/manerpvtiti.space/server/database/iti_college.db ~/backup-iti/

# Backup uploads
cp -r ~/manerpvtiti.space/server/uploads ~/backup-iti/

# Backup .env
cp ~/manerpvtiti.space/server/.env ~/backup-iti/

# Backup entire server folder (optional but safe)
tar -czf ~/backup-iti/full-backup.tar.gz ~/manerpvtiti.space/

# Download to local machine
# From your LOCAL machine:
scp -r ecowells@old-server-ip:~/backup-iti ./backup-iti
```

**Alternative: Download via cPanel**
1. cPanel → **File Manager**
2. Navigate to `manerpvtiti.space/server/database/`
3. Select `iti_college.db` → **Download**
4. Navigate to `manerpvtiti.space/server/uploads/`
5. Select all → **Compress** → **Download**
6. Download `server/.env`

### Step 2: Setup New Server

#### Option A: cPanel Hosting (Hostinger, Namecheap, etc.)
Same steps as Scenario 1, just on new hosting.

#### Option B: VPS (DigitalOcean, AWS, Linode)

```bash
# SSH into NEW server
ssh root@new-server-ip

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Create app directory
mkdir -p /var/www/manerpvtiti.com
cd /var/www/manerpvtiti.com
```

### Step 3: Upload Code to New Server

```bash
# From LOCAL machine - push latest code to GitHub
cd I:\iti
git add -A && git commit -m "Pre-migration backup" && git push

# On NEW server - clone repo
cd /var/www/manerpvtiti.com
git clone https://github.com/Rajni0123/iti-college-website.git .

# Install dependencies
cd server
npm install
```

### Step 4: Restore Database & Uploads

```bash
# Upload backup files to new server (from LOCAL machine)
scp ./backup-iti/iti_college.db root@new-server-ip:/var/www/manerpvtiti.com/server/database/
scp -r ./backup-iti/uploads root@new-server-ip:/var/www/manerpvtiti.com/server/
scp ./backup-iti/.env root@new-server-ip:/var/www/manerpvtiti.com/server/
```

### Step 5: Update .env on New Server

```bash
nano /var/www/manerpvtiti.com/server/.env
```
```
PORT=3000
NODE_ENV=production
JWT_SECRET=your-same-old-secret-key
DOMAIN=manerpvtiti.com
CORS_ORIGIN=https://manerpvtiti.com
```

### Step 6: Build Frontend (on local or new server)

```bash
# If new server has enough RAM (1GB+):
cd /var/www/manerpvtiti.com/client
npm install
npm run build
cp -r dist/* /var/www/manerpvtiti.com/server/public/

# OR build locally and upload:
# On LOCAL machine:
cd I:\iti\client
npm run build
scp -r dist/* root@new-server-ip:/var/www/manerpvtiti.com/server/public/
```

### Step 7: Setup for VPS (PM2 + Nginx)

#### Start Node.js with PM2:
```bash
cd /var/www/manerpvtiti.com/server
pm2 start index.js --name "iti-server"
pm2 save
pm2 startup  # auto-start on reboot
```

#### Configure Nginx:
```bash
sudo nano /etc/nginx/sites-available/manerpvtiti.com
```
```nginx
server {
    listen 80;
    server_name manerpvtiti.com www.manerpvtiti.com;

    # Frontend static files
    root /var/www/manerpvtiti.com/server/public;
    index index.html;

    # API proxy to Node.js
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 50M;
    }

    # Uploads access
    location /uploads/ {
        alias /var/www/manerpvtiti.com/server/uploads/;
    }

    # SPA routing - all other routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site and restart:
```bash
sudo ln -s /etc/nginx/sites-available/manerpvtiti.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Certbot:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d manerpvtiti.com -d www.manerpvtiti.com
```

### Step 8: Point Domain to New Server
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Update **A Record**:
   - Type: A
   - Host: @
   - Value: `NEW-SERVER-IP`
   - TTL: 300 (5 min for fast propagation)
3. Also update **www**:
   - Type: CNAME
   - Host: www
   - Value: `manerpvtiti.com`
4. DNS propagation takes 5 min to 48 hours

### Step 9: Verify Everything
- [ ] `https://manerpvtiti.com` loads the website
- [ ] `https://manerpvtiti.com/api/health` returns OK
- [ ] Admin login works at `/admin`
- [ ] All old data visible (admissions, students, fees)
- [ ] Uploaded documents/images load correctly
- [ ] Can create new admissions
- [ ] Fee receipts work
- [ ] SSL certificate active (padlock icon)

---

## Quick Checklist: What to Backup Before ANY Migration

```
CRITICAL (data loss if missed):
✅ server/database/iti_college.db    → ALL your data
✅ server/uploads/                   → ALL uploaded files
✅ server/.env                       → Secrets & config

NICE TO HAVE (can regenerate):
📦 Full git repo (already on GitHub)
📦 node_modules (npm install recreates it)
📦 client/dist (npm run build recreates it)
```

## Emergency: If Something Goes Wrong

1. **Database corrupted?** → Restore from `iti_college.db` backup
2. **Uploads missing?** → Restore from `uploads/` backup
3. **App won't start?** → Check `node index.js` output for errors
4. **API not working?** → Check .htaccess (cPanel) or nginx config (VPS)
5. **Old domain still showing?** → DNS hasn't propagated yet, wait or flush DNS

```bash
# Test DNS propagation
nslookup manerpvtiti.com
# Or use: https://dnschecker.org
```
