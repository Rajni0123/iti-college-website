# A2 Hosting Deployment Script for Windows (PowerShell)
# This script automates deployment to A2 Hosting via FTP/SFTP

param(
    [string]$FTPHost = "",
    [string]$FTPUser = "",
    [string]$FTPPass = "",
    [string]$Domain = "",
    [string]$CPanelUser = ""
)

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput "Cyan" "🚀 Starting A2 Hosting Deployment..."
Write-Output ""

# Check if credentials are provided
if (-not $FTPHost -or -not $FTPUser -or -not $FTPPass -or -not $Domain) {
    Write-ColorOutput "Yellow" "⚠️  Configuration Required"
    Write-Output ""
    Write-Output "Please provide your A2 Hosting credentials:"
    Write-Output ""
    
    if (-not $FTPHost) { $FTPHost = Read-Host "FTP Host (e.g., ftp.yourdomain.com)" }
    if (-not $FTPUser) { $FTPUser = Read-Host "FTP Username (cPanel username)" }
    if (-not $FTPPass) { $FTPPass = Read-Host "FTP Password" -AsSecureString; $FTPPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($FTPPass)) }
    if (-not $Domain) { $Domain = Read-Host "Domain Name (e.g., yourdomain.com)" }
    if (-not $CPanelUser) { $CPanelUser = $FTPUser }
    
    Write-Output ""
}

# Paths
$CLIENT_DIR = Join-Path $PSScriptRoot "client"
$SERVER_DIR = Join-Path $PSScriptRoot "server"
$PUBLIC_HTML = "/public_html"
$API_DIR = "/public_html/api"

Write-ColorOutput "Cyan" "Configuration:"
Write-Output "  Domain: $Domain"
Write-Output "  FTP Host: $FTPHost"
Write-Output "  FTP User: $FTPUser"
Write-Output ""

# Check if directories exist
if (-not (Test-Path $CLIENT_DIR) -or -not (Test-Path $SERVER_DIR)) {
    Write-ColorOutput "Red" "❌ Error: Please run this script from the project root directory"
    exit 1
}

# Step 1: Build Frontend
Write-ColorOutput "Cyan" "📦 Step 1: Building frontend for production..."
Set-Location $CLIENT_DIR

if (-not (Test-Path "package.json")) {
    Write-ColorOutput "Red" "❌ Error: package.json not found in client directory"
    exit 1
}

npm install
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Red" "❌ Error: npm install failed"
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-ColorOutput "Red" "❌ Error: Frontend build failed"
    exit 1
}

Write-ColorOutput "Green" "✅ Frontend built successfully"
Write-Output ""

# Step 2: Check if WinSCP or FTP module is available
Write-ColorOutput "Cyan" "📤 Step 2: Preparing FTP deployment..."
Write-Output ""

# Check for WinSCP .NET assembly (common FTP tool for Windows)
$WinSCPPath = "C:\Program Files (x86)\WinSCP\WinSCPnet.dll"
$UseWinSCP = $false

if (Test-Path $WinSCPPath) {
    try {
        Add-Type -Path $WinSCPPath
        $UseWinSCP = $true
        Write-ColorOutput "Green" "✅ WinSCP found - will use SFTP"
    } catch {
        Write-ColorOutput "Yellow" "⚠️  WinSCP found but could not load. Will use basic FTP."
    }
}

# Step 3: Upload Files via FTP
Write-ColorOutput "Cyan" "📤 Step 3: Uploading files to A2 Hosting..."

if ($UseWinSCP) {
    # Use WinSCP for SFTP (more secure)
    Write-ColorOutput "Cyan" "Using WinSCP SFTP..."
    
    $sessionOptions = New-Object WinSCP.SessionOptions
    $sessionOptions.Protocol = [WinSCP.Protocol]::Sftp
    $sessionOptions.HostName = $FTPHost
    $sessionOptions.UserName = $FTPUser
    $sessionOptions.Password = $FTPPass
    $sessionOptions.SshHostKeyFingerprint = "ssh-rsa 2048"  # You may need to accept this on first connection
    
    $session = New-Object WinSCP.Session
    
    try {
        $session.Open($sessionOptions)
        
        # Upload frontend files
        Write-ColorOutput "Cyan" "Uploading frontend files..."
        $transferOptions = New-Object WinSCP.TransferOptions
        $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
        
        $distPath = Join-Path $CLIENT_DIR "dist"
        $session.PutFiles("$distPath\*", $PUBLIC_HTML, $False, $transferOptions).Check()
        Write-ColorOutput "Green" "✅ Frontend files uploaded"
        
        # Upload backend files
        Write-ColorOutput "Cyan" "Uploading backend files..."
        $session.PutFiles("$SERVER_DIR\*", $API_DIR, $False, $transferOptions).Check()
        Write-ColorOutput "Green" "✅ Backend files uploaded"
        
        $session.Close()
    } catch {
        Write-ColorOutput "Red" "❌ Error uploading files: $_"
        $session.Dispose()
        exit 1
    }
} else {
    # Use basic FTP (less secure, but works without WinSCP)
    Write-ColorOutput "Yellow" "⚠️  Using basic FTP (consider installing WinSCP for SFTP)"
    Write-ColorOutput "Yellow" "⚠️  Manual upload required - see instructions below"
    Write-Output ""
}

Write-Output ""

# Step 4: Create Environment Files
Write-ColorOutput "Cyan" "📝 Step 4: Creating environment file templates..."
Write-Output ""

# Generate JWT Secret
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object {[char]$_})

# Backend .env template
$backendEnv = @"
NODE_ENV=production
PORT=5000
JWT_SECRET=$jwtSecret
API_DOMAIN=https://$Domain
FRONTEND_URL=https://$Domain
DATABASE_PATH=./database/database.sqlite
MAX_FILE_SIZE=50mb
"@

# Frontend .env template
$frontendEnv = @"
VITE_API_URL=https://$Domain/api
VITE_SITE_URL=https://$Domain
"@

# Save templates locally
$backendEnvPath = Join-Path $PSScriptRoot "api.env.template"
$frontendEnvPath = Join-Path $PSScriptRoot "public_html.env.template"

$backendEnv | Out-File -FilePath $backendEnvPath -Encoding UTF8
$frontendEnv | Out-File -FilePath $frontendEnvPath -Encoding UTF8

Write-ColorOutput "Green" "✅ Environment file templates created:"
Write-Output "  - $backendEnvPath"
Write-Output "  - $frontendEnvPath"
Write-Output ""

# Step 5: Instructions
Write-ColorOutput "Green" "════════════════════════════════════════════════"
Write-ColorOutput "Green" "🎉 Deployment Files Ready!"
Write-ColorOutput "Green" "════════════════════════════════════════════════"
Write-Output ""

if (-not $UseWinSCP) {
    Write-ColorOutput "Yellow" "📋 Manual Upload Required:"
    Write-Output ""
    Write-Output "1. Open your FTP client (FileZilla, WinSCP, etc.)"
    Write-Output "2. Connect to: $FTPHost"
    Write-Output "3. Username: $FTPUser"
    Write-Output "4. Upload ALL files from: $CLIENT_DIR\dist\*"
    Write-Output "   To: $PUBLIC_HTML"
    Write-Output "5. Upload ALL files from: $SERVER_DIR\*"
    Write-Output "   To: $API_DIR"
    Write-Output ""
}

Write-ColorOutput "Cyan" "📋 Next Steps in cPanel:"
Write-Output ""
Write-Output "1. Log in to cPanel: https://$Domain`:2083"
Write-Output "2. Go to 'Setup Node.js App' or 'Node.js Selector'"
Write-Output "3. Create new application:"
Write-Output "   - Node.js Version: 18.x or 20.x"
Write-Output "   - Application Root: /home/$CPanelUser/api"
Write-Output "   - Application URL: /api"
Write-Output "   - Startup File: index.js"
Write-Output "4. Click 'Run NPM Install' in the application settings"
Write-Output "5. Upload environment files:"
Write-Output "   - Upload api.env.template to /api/.env"
Write-Output "   - Upload public_html.env.template to /public_html/.env"
Write-Output "6. Set file permissions:"
Write-Output "   - api/database/: 755"
Write-Output "   - api/uploads/: 775"
Write-Output "7. Start the Node.js application"
Write-Output ""

Write-ColorOutput "Yellow" "🔑 Default Admin Credentials:"
Write-Output "   Email: admin@iticollege.edu"
Write-Output "   Password: admin123"
Write-ColorOutput "Red" "   ⚠️  IMPORTANT: Change password immediately after first login!"
Write-Output ""

Write-ColorOutput "Cyan" "🌐 Your Website URLs:"
Write-Output "   Main Site: https://$Domain"
Write-Output "   Admin:     https://$Domain/admin"
Write-Output "   API:       https://$Domain/api"
Write-Output ""

Write-ColorOutput "Green" "✅ Deployment preparation complete!"
Write-Output ""
