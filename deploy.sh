#!/bin/bash

# ITI College Website Deployment Script
# This script automates the deployment process for cPanel

echo "🚀 Starting ITI College Website Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration (Update these paths for your server)
PUBLIC_HTML="${PUBLIC_HTML:-~/public_html}"
API_DIR="${API_DIR:-~/api}"
CLIENT_DIR="$(pwd)/client"
SERVER_DIR="$(pwd)/server"

# Check if we're in the right directory
if [ ! -d "$CLIENT_DIR" ] || [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Frontend deployment
echo -e "${BLUE}📦 Step 1: Building frontend...${NC}"
cd "$CLIENT_DIR"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in client directory${NC}"
    exit 1
fi

npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: npm install failed${NC}"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# Copy frontend to public_html
echo -e "${BLUE}📤 Step 2: Deploying frontend files...${NC}"
if [ ! -d "$PUBLIC_HTML" ]; then
    echo -e "${YELLOW}⚠️  Warning: $PUBLIC_HTML does not exist. Creating it...${NC}"
    mkdir -p "$PUBLIC_HTML"
fi

# Backup existing files (optional)
if [ -f "$PUBLIC_HTML/index.html" ]; then
    echo -e "${YELLOW}📦 Creating backup of existing files...${NC}"
    BACKUP_DIR="$PUBLIC_HTML/backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    cp -r "$PUBLIC_HTML"/* "$BACKUP_DIR/" 2>/dev/null
    echo -e "${GREEN}✅ Backup created at $BACKUP_DIR${NC}"
fi

# Copy new files
cp -r dist/* "$PUBLIC_HTML/"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend files deployed to $PUBLIC_HTML${NC}"
else
    echo -e "${RED}❌ Error: Failed to copy frontend files${NC}"
    exit 1
fi
echo ""

# Backend deployment
echo -e "${BLUE}📦 Step 3: Setting up backend...${NC}"
if [ ! -d "$API_DIR" ]; then
    echo -e "${YELLOW}⚠️  Warning: $API_DIR does not exist. Creating it...${NC}"
    mkdir -p "$API_DIR"
fi

# Copy server files
echo -e "${BLUE}📤 Copying server files...${NC}"
cp -r "$SERVER_DIR"/* "$API_DIR/" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server files copied to $API_DIR${NC}"
else
    echo -e "${RED}❌ Error: Failed to copy server files${NC}"
    exit 1
fi

# Install backend dependencies
echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd "$API_DIR"
if [ -f "package.json" ]; then
    npm install --production
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Error: Failed to install backend dependencies${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Warning: package.json not found in $API_DIR${NC}"
fi
echo ""

# Set permissions
echo -e "${BLUE}🔐 Step 4: Setting file permissions...${NC}"
chmod -R 755 "$PUBLIC_HTML" 2>/dev/null
chmod -R 755 "$API_DIR" 2>/dev/null
if [ -d "$API_DIR/uploads" ]; then
    chmod -R 775 "$API_DIR/uploads"
    echo -e "${GREEN}✅ Uploads folder permissions set${NC}"
fi
if [ -d "$API_DIR/database" ]; then
    chmod -R 755 "$API_DIR/database"
    echo -e "${GREEN}✅ Database folder permissions set${NC}"
fi
echo ""

# Restart server (if using PM2)
echo -e "${BLUE}🔄 Step 5: Restarting server...${NC}"
if command -v pm2 &> /dev/null; then
    cd "$API_DIR"
    if pm2 list | grep -q "iti-api"; then
        pm2 restart iti-api
        echo -e "${GREEN}✅ Server restarted using PM2${NC}"
    else
        pm2 start index.js --name iti-api
        pm2 save
        echo -e "${GREEN}✅ Server started with PM2${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not found. Please restart your Node.js application manually${NC}"
    echo -e "${YELLOW}   Or install PM2: npm install -g pm2${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📁 Frontend:${NC} $PUBLIC_HTML"
echo -e "${BLUE}📁 Backend:${NC}  $API_DIR"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo "1. Set up environment variables (.env files)"
echo "2. Ensure Node.js application is running"
echo "3. Test your website"
echo "4. Change default admin password"
echo ""
echo -e "${GREEN}✅ All done!${NC}"
