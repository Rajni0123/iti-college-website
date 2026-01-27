#!/bin/bash

# Maner Pvt ITI Website - Production Deployment Script
# Server Path: /home/ecowells/manerpvtiti.space
# API Domain: api.manerpvtiti.space
# Main Domain: manerpvtiti.space

echo "🚀 Starting Maner Pvt ITI Production Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# PRODUCTION SERVER PATHS - UPDATE THESE IF NEEDED
# ============================================
SERVER_ROOT="/home/ecowells"
PUBLIC_HTML="${SERVER_ROOT}/public_html"           # Main domain: manerpvtiti.space
API_DIR="${SERVER_ROOT}/api.manerpvtiti.space"     # API subdomain

# ============================================
# LOCAL PATHS
# ============================================
CLIENT_DIR="$(pwd)/client"
SERVER_DIR="$(pwd)/server"

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Main Domain: https://manerpvtiti.space"
echo -e "  API Domain:  https://api.manerpvtiti.space"
echo -e "  Server Root: ${SERVER_ROOT}"
echo ""

# Check if we're in the right directory
if [ ! -d "$CLIENT_DIR" ] || [ ! -d "$SERVER_DIR" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# ============================================
# STEP 1: Build Frontend
# ============================================
echo -e "${BLUE}📦 Step 1: Building frontend for production...${NC}"
cd "$CLIENT_DIR"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in client directory${NC}"
    exit 1
fi

# Install dependencies
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: npm install failed${NC}"
    exit 1
fi

# Build for production (uses .env.production automatically)
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

# ============================================
# STEP 2: Deploy Frontend
# ============================================
echo -e "${BLUE}📤 Step 2: Deploying frontend to ${PUBLIC_HTML}...${NC}"

if [ ! -d "$PUBLIC_HTML" ]; then
    echo -e "${YELLOW}⚠️  Creating ${PUBLIC_HTML}...${NC}"
    mkdir -p "$PUBLIC_HTML"
fi

# Copy frontend files
cp -r dist/* "$PUBLIC_HTML/"
cp public/.htaccess "$PUBLIC_HTML/" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend deployed to $PUBLIC_HTML${NC}"
else
    echo -e "${RED}❌ Error: Failed to copy frontend files${NC}"
    exit 1
fi
echo ""

# ============================================
# STEP 3: Deploy Backend API
# ============================================
echo -e "${BLUE}📦 Step 3: Deploying backend to ${API_DIR}...${NC}"

if [ ! -d "$API_DIR" ]; then
    echo -e "${YELLOW}⚠️  Creating ${API_DIR}...${NC}"
    mkdir -p "$API_DIR"
fi

# Copy server files
cp -r "$SERVER_DIR"/* "$API_DIR/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend files copied to $API_DIR${NC}"
else
    echo -e "${RED}❌ Error: Failed to copy backend files${NC}"
    exit 1
fi

# Install backend dependencies
cd "$API_DIR"
npm install --production
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Error: Failed to install backend dependencies${NC}"
    exit 1
fi
echo ""

# ============================================
# STEP 4: Set Permissions
# ============================================
echo -e "${BLUE}🔐 Step 4: Setting file permissions...${NC}"

chmod -R 755 "$PUBLIC_HTML" 2>/dev/null
chmod -R 755 "$API_DIR" 2>/dev/null

# Uploads and database folders need write permissions
if [ -d "$API_DIR/uploads" ]; then
    chmod -R 775 "$API_DIR/uploads"
    echo -e "${GREEN}✅ Uploads folder permissions set (775)${NC}"
fi
if [ -d "$API_DIR/database" ]; then
    chmod -R 755 "$API_DIR/database"
    chmod 664 "$API_DIR/database/database.sqlite" 2>/dev/null
    echo -e "${GREEN}✅ Database folder permissions set${NC}"
fi
echo ""

# ============================================
# STEP 5: Start/Restart Node.js Server
# ============================================
echo -e "${BLUE}🔄 Step 5: Managing Node.js server...${NC}"

cd "$API_DIR"

if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "maner-iti-api"; then
        pm2 restart maner-iti-api
        echo -e "${GREEN}✅ Server restarted using PM2${NC}"
    else
        pm2 start index.js --name maner-iti-api
        pm2 save
        echo -e "${GREEN}✅ Server started with PM2 as 'maner-iti-api'${NC}"
    fi
    pm2 status
else
    echo -e "${YELLOW}⚠️  PM2 not found. Install with: npm install -g pm2${NC}"
    echo -e "${YELLOW}   Then run: pm2 start index.js --name maner-iti-api${NC}"
fi
echo ""

# ============================================
# DEPLOYMENT COMPLETE
# ============================================
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📍 Deployed Locations:${NC}"
echo -e "   Frontend: $PUBLIC_HTML"
echo -e "   Backend:  $API_DIR"
echo ""
echo -e "${BLUE}🌐 Website URLs:${NC}"
echo -e "   Main Site: https://manerpvtiti.space"
echo -e "   API:       https://api.manerpvtiti.space"
echo -e "   Admin:     https://manerpvtiti.space/admin"
echo ""
echo -e "${YELLOW}🔑 Default Admin Credentials:${NC}"
echo -e "   Email:    admin@iticollege.edu"
echo -e "   Password: admin123"
echo -e "   ${RED}⚠️  IMPORTANT: Change password immediately after first login!${NC}"
echo ""
echo -e "${YELLOW}📋 Post-Deployment Checklist:${NC}"
echo "   1. ✅ Update JWT_SECRET in server/.env"
echo "   2. ✅ Change default admin password"
echo "   3. ✅ Configure SSL certificates (if not auto)"
echo "   4. ✅ Set up PM2 startup: pm2 startup && pm2 save"
echo "   5. ✅ Test all website functionality"
echo ""
echo -e "${GREEN}✅ All done!${NC}"
