#!/bin/bash

# A2 Hosting Deployment Script for Linux/Mac
# This script automates deployment to A2 Hosting via FTP/SFTP

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting A2 Hosting Deployment...${NC}"
echo ""

# ============================================
# CONFIGURATION - UPDATE THESE VALUES
# ============================================
FTP_HOST="${FTP_HOST:-}"
FTP_USER="${FTP_USER:-}"
FTP_PASS="${FTP_PASS:-}"
DOMAIN="${DOMAIN:-}"
CPANEL_USER="${CPANEL_USER:-}"

# Prompt for credentials if not provided
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  Configuration Required${NC}"
    echo ""
    echo "Please provide your A2 Hosting credentials:"
    echo ""
    
    if [ -z "$FTP_HOST" ]; then
        read -p "FTP Host (e.g., ftp.yourdomain.com): " FTP_HOST
    fi
    if [ -z "$FTP_USER" ]; then
        read -p "FTP Username (cPanel username): " FTP_USER
    fi
    if [ -z "$FTP_PASS" ]; then
        read -sp "FTP Password: " FTP_PASS
        echo ""
    fi
    if [ -z "$DOMAIN" ]; then
        read -p "Domain Name (e.g., yourdomain.com): " DOMAIN
    fi
    if [ -z "$CPANEL_USER" ]; then
        CPANEL_USER="$FTP_USER"
    fi
    
    echo ""
fi

# Paths
CLIENT_DIR="$(pwd)/client"
SERVER_DIR="$(pwd)/server"
PUBLIC_HTML="/public_html"
API_DIR="/public_html/api"

echo -e "${BLUE}Configuration:${NC}"
echo -e "  Domain: $DOMAIN"
echo -e "  FTP Host: $FTP_HOST"
echo -e "  FTP User: $FTP_USER"
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

# ============================================
# STEP 2: Check for FTP/SFTP Tools
# ============================================
echo -e "${BLUE}📤 Step 2: Preparing FTP deployment...${NC}"
echo ""

# Check for lftp (recommended for FTP/SFTP)
if command -v lftp &> /dev/null; then
    USE_LFTP=true
    echo -e "${GREEN}✅ lftp found - will use SFTP${NC}"
elif command -v sftp &> /dev/null; then
    USE_SFTP=true
    echo -e "${GREEN}✅ sftp found${NC}"
elif command -v ftp &> /dev/null; then
    USE_FTP=true
    echo -e "${YELLOW}⚠️  Using basic FTP (consider installing lftp for SFTP)${NC}"
else
    echo -e "${YELLOW}⚠️  No FTP client found. Manual upload required.${NC}"
    USE_MANUAL=true
fi
echo ""

# ============================================
# STEP 3: Upload Files via FTP/SFTP
# ============================================
echo -e "${BLUE}📤 Step 3: Uploading files to A2 Hosting...${NC}"

if [ "$USE_LFTP" = true ]; then
    # Use lftp (supports both FTP and SFTP)
    echo -e "${BLUE}Using lftp SFTP...${NC}"
    
    lftp -u "$FTP_USER,$FTP_PASS" sftp://"$FTP_HOST" <<EOF
set sftp:auto-confirm yes
cd $PUBLIC_HTML
mirror -R -e "$CLIENT_DIR/dist" .
cd $API_DIR
mirror -R -e "$SERVER_DIR" .
quit
EOF
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Files uploaded successfully${NC}"
    else
        echo -e "${RED}❌ Error: Upload failed${NC}"
        exit 1
    fi
    
elif [ "$USE_SFTP" = true ]; then
    # Use sftp with expect (requires expect package)
    if command -v expect &> /dev/null; then
        echo -e "${BLUE}Using sftp...${NC}"
        
        expect <<EOF
spawn sftp "$FTP_USER@$FTP_HOST"
expect "password:"
send "$FTP_PASS\r"
expect "sftp>"
send "cd $PUBLIC_HTML\r"
expect "sftp>"
send "put -r $CLIENT_DIR/dist/*\r"
expect "sftp>"
send "cd $API_DIR\r"
expect "sftp>"
send "put -r $SERVER_DIR/*\r"
expect "sftp>"
send "quit\r"
expect eof
EOF
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Files uploaded successfully${NC}"
        else
            echo -e "${RED}❌ Error: Upload failed${NC}"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  expect not found. Manual upload required.${NC}"
        USE_MANUAL=true
    fi
    
elif [ "$USE_FTP" = true ]; then
    echo -e "${YELLOW}⚠️  Basic FTP mode - manual upload recommended${NC}"
    USE_MANUAL=true
fi

if [ "$USE_MANUAL" = true ]; then
    echo -e "${YELLOW}📋 Manual Upload Required:${NC}"
    echo ""
    echo "1. Open your FTP client (FileZilla, Cyberduck, etc.)"
    echo "2. Connect to: $FTP_HOST"
    echo "3. Username: $FTP_USER"
    echo "4. Upload ALL files from: $CLIENT_DIR/dist/*"
    echo "   To: $PUBLIC_HTML"
    echo "5. Upload ALL files from: $SERVER_DIR/*"
    echo "   To: $API_DIR"
    echo ""
fi

echo ""

# ============================================
# STEP 4: Create Environment Files
# ============================================
echo -e "${BLUE}📝 Step 4: Creating environment file templates...${NC}"
echo ""

# Generate JWT Secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" 2>/dev/null || openssl rand -hex 32)

# Backend .env template
cat > api.env.template <<EOF
NODE_ENV=production
PORT=5000
JWT_SECRET=$JWT_SECRET
API_DOMAIN=https://$DOMAIN
FRONTEND_URL=https://$DOMAIN
DATABASE_PATH=./database/database.sqlite
MAX_FILE_SIZE=50mb
EOF

# Frontend .env template
cat > public_html.env.template <<EOF
VITE_API_URL=https://$DOMAIN/api
VITE_SITE_URL=https://$DOMAIN
EOF

echo -e "${GREEN}✅ Environment file templates created:${NC}"
echo "  - api.env.template"
echo "  - public_html.env.template"
echo ""

# ============================================
# DEPLOYMENT COMPLETE
# ============================================
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Files Ready!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}📋 Next Steps in cPanel:${NC}"
echo ""
echo "1. Log in to cPanel: https://$DOMAIN:2083"
echo "2. Go to 'Setup Node.js App' or 'Node.js Selector'"
echo "3. Create new application:"
echo "   - Node.js Version: 18.x or 20.x"
echo "   - Application Root: /home/$CPANEL_USER/api"
echo "   - Application URL: /api"
echo "   - Startup File: index.js"
echo "4. Click 'Run NPM Install' in the application settings"
echo "5. Upload environment files:"
echo "   - Upload api.env.template to /api/.env"
echo "   - Upload public_html.env.template to /public_html/.env"
echo "6. Set file permissions:"
echo "   - api/database/: 755"
echo "   - api/uploads/: 775"
echo "7. Start the Node.js application"
echo ""

echo -e "${YELLOW}🔑 Default Admin Credentials:${NC}"
echo "   Email: admin@iticollege.edu"
echo "   Password: admin123"
echo -e "${RED}   ⚠️  IMPORTANT: Change password immediately after first login!${NC}"
echo ""

echo -e "${BLUE}🌐 Your Website URLs:${NC}"
echo "   Main Site: https://$DOMAIN"
echo "   Admin:     https://$DOMAIN/admin"
echo "   API:       https://$DOMAIN/api"
echo ""

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
