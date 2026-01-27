# Git Deployment Guide for cPanel

This guide explains how to deploy your ITI College website using Git in cPanel, which is faster and more efficient than manual file uploads.

## 📋 Prerequisites

1. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, Bitbucket, etc.)
2. **cPanel Access**: Your hosting must support Git Version Control
3. **SSH Access** (Optional but recommended): For easier setup

## 🚀 Method 1: Using cPanel Git Version Control (Recommended)

### Step 1: Access Git Version Control in cPanel

1. Log in to your cPanel account
2. Find and click **"Git Version Control"** or **"Git™ Version Control"**
3. If you don't see it, your hosting may not support it - use Method 2 instead

### Step 2: Clone Your Repository

1. Click **"Create"** or **"Clone a Repository"**
2. Fill in the details:
   - **Repository URL**: Your Git repository URL
     - GitHub: `https://github.com/username/repository.git`
     - GitLab: `https://gitlab.com/username/repository.git`
     - Bitbucket: `https://bitbucket.org/username/repository.git`
   - **Repository Path**: 
     - For frontend: `/home/username/public_html`
     - For backend: `/home/username/api`
   - **Repository Name**: Give it a name (e.g., `iti-website`)
3. Click **"Create"**

### Step 3: Configure Deployment

After cloning, you'll need to:

1. **Set up Build Process**:
   - Navigate to the cloned repository folder
   - Install dependencies: `npm install` (for both client and server)
   - Build frontend: `cd client && npm run build`

2. **Configure Post-Receive Hook** (Optional but recommended):

   Create a file named `post-receive` in `.git/hooks/` folder:

   ```bash
   #!/bin/bash
   cd /home/username/public_html
   git pull origin main
   cd client
   npm install
   npm run build
   ```

   Make it executable:
   ```bash
   chmod +x .git/hooks/post-receive
   ```

### Step 4: Pull Latest Changes

1. In cPanel Git Version Control, find your repository
2. Click **"Pull or Deploy"**
3. Select branch (usually `main` or `master`)
4. Click **"Update from Remote"**

## 🔧 Method 2: Using SSH (Alternative)

If cPanel Git Version Control is not available, use SSH:

### Step 1: Connect via SSH

```bash
ssh username@yourdomain.com
```

### Step 2: Navigate to Your Directory

```bash
cd ~/public_html
# or for backend
cd ~/api
```

### Step 3: Clone Repository

```bash
# If directory is empty
git clone https://github.com/username/repository.git .

# Or if you want to clone to a specific folder
git clone https://github.com/username/repository.git ~/iti-website
```

### Step 4: Set Up Project

```bash
# For frontend
cd ~/public_html
cd client
npm install
npm run build
# Move dist contents to public_html
cp -r dist/* ~/public_html/

# For backend
cd ~/api
npm install --production
```

### Step 5: Set Up Auto-Deploy Hook

Create a deployment script:

```bash
nano ~/deploy.sh
```

Add this content:

```bash
#!/bin/bash
cd ~/public_html
git pull origin main
cd client
npm install
npm run build
cp -r dist/* ~/public_html/
cd ~/api
git pull origin main
npm install --production
pm2 restart iti-api || node index.js
```

Make it executable:

```bash
chmod +x ~/deploy.sh
```

## 🔄 Method 3: Using GitHub Actions + cPanel (Advanced)

For automated deployments, set up GitHub Actions:

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to cPanel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build Frontend
        run: |
          cd client
          npm install
          npm run build
      
      - name: Deploy to cPanel via FTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./client/dist/
          server-dir: /public_html/
```

### Step 2: Add Secrets to GitHub

1. Go to your repository → Settings → Secrets → Actions
2. Add:
   - `FTP_SERVER`: Your FTP server address
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password

## 📁 Recommended Repository Structure

For easier deployment, organize your repository like this:

```
iti-website/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── package.json
│   └── index.js
├── .gitignore
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## 🔐 Security: Using Private Repositories

### Option 1: SSH Keys (Recommended)

1. Generate SSH key on your server:
   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

2. Copy public key:
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

3. Add to GitHub/GitLab:
   - GitHub: Settings → SSH and GPG keys → New SSH key
   - GitLab: Settings → SSH Keys

4. Clone using SSH URL:
   ```bash
   git clone git@github.com:username/repository.git
   ```

### Option 2: Personal Access Token

1. Create token in GitHub/GitLab
2. Use in clone URL:
   ```bash
   git clone https://token@github.com/username/repository.git
   ```

## 🚀 Quick Deploy Script

Create a simple deploy script for manual deployments:

**File: `deploy.sh`**

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Frontend deployment
echo -e "${BLUE}📦 Building frontend...${NC}"
cd client
npm install
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Copy frontend to public_html
echo -e "${BLUE}📤 Copying frontend files...${NC}"
cp -r dist/* ~/public_html/
echo -e "${GREEN}✅ Frontend deployed${NC}"

# Backend deployment
echo -e "${BLUE}📦 Setting up backend...${NC}"
cd ../server
npm install --production
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Restart server (if using PM2)
if command -v pm2 &> /dev/null; then
    echo -e "${BLUE}🔄 Restarting server...${NC}"
    pm2 restart iti-api || pm2 start index.js --name iti-api
    echo -e "${GREEN}✅ Server restarted${NC}"
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
```

Make it executable:
```bash
chmod +x deploy.sh
```

Run it:
```bash
./deploy.sh
```

## 🔄 Updating Your Website

### Using cPanel Git Version Control:

1. Make changes locally
2. Commit and push to Git:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```
3. In cPanel, go to Git Version Control
4. Click **"Pull or Deploy"** on your repository
5. Click **"Update from Remote"**

### Using SSH:

```bash
ssh username@yourdomain.com
cd ~/public_html
git pull origin main
cd client
npm run build
cp -r dist/* ~/public_html/
```

Or use the deploy script:
```bash
./deploy.sh
```

## 📝 Environment Variables with Git

**Important**: Never commit `.env` files to Git!

### Solution: Use `.env.example` files

1. Create `.env.example` files:
   - `client/.env.example`
   - `server/.env.example`

2. Add to `.gitignore`:
   ```
   .env
   .env.local
   *.env
   ```

3. On server, copy example files:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

4. Edit `.env` files on server with actual values

## 🐛 Troubleshooting

### Issue: Git not available in cPanel

**Solution**: 
- Contact your hosting provider to enable Git
- Use SSH method instead
- Use manual FTP upload

### Issue: Permission denied when cloning

**Solution**:
```bash
# Check permissions
ls -la ~/

# Fix ownership
chown -R username:username ~/public_html
```

### Issue: Build fails on server

**Solution**:
- Check Node.js version: `node --version`
- Ensure npm is installed: `npm --version`
- Check disk space: `df -h`
- Review build logs for specific errors

### Issue: Files not updating after git pull

**Solution**:
- Clear cache: `rm -rf node_modules/.cache`
- Rebuild: `npm run build`
- Check file permissions
- Restart Node.js application

## ✅ Best Practices

1. ✅ Use `.gitignore` to exclude:
   - `node_modules/`
   - `.env` files
   - `dist/` or `build/` folders
   - Database files (`*.sqlite`, `*.db`)

2. ✅ Keep sensitive data out of Git:
   - Use environment variables
   - Use `.env.example` as template
   - Never commit passwords or API keys

3. ✅ Use branches for testing:
   ```bash
   git checkout -b staging
   # Test changes
   git checkout main
   git merge staging
   ```

4. ✅ Tag releases:
   ```bash
   git tag -a v1.0.0 -m "Production release"
   git push origin v1.0.0
   ```

5. ✅ Regular backups:
   - Backup database regularly
   - Keep Git repository as backup
   - Use hosting provider's backup service

## 📞 Support

If you encounter issues:

1. Check Git logs: `git log`
2. Check server logs in cPanel
3. Verify file permissions
4. Contact hosting support for Git-related issues

---

**Last Updated**: January 2026
**Version**: 1.0
