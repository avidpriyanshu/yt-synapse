#!/bin/bash
set -e

echo "🎬 YouTube Vault - One-Click Installation"
echo "==========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Installing via Homebrew..."
  if ! command -v brew &> /dev/null; then
    echo "Installing Homebrew first..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  brew install node
  echo "✓ Node.js installed"
else
  echo "✓ Node.js $(node -v) already installed"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found"
  exit 1
fi
echo "✓ npm $(npm -v) ready"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
cd "$(dirname "$0")/logic-engine"
npm install --silent
echo "✓ Dependencies installed"
echo ""

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
  echo "🔧 Installing PM2 (process manager)..."
  npm install -g pm2 --silent
  echo "✓ PM2 installed globally"
else
  echo "✓ PM2 $(pm2 -v) already installed"
fi
echo ""

# Start the service
echo "🚀 Starting YouTube Vault service..."
npm run pm2-start > /dev/null 2>&1
sleep 2
echo "✓ Service started (PID: $(pgrep -f 'node.*server.js' || echo 'unknown'))"
echo ""

# Setup auto-start on boot
echo "⚙️  Setting up auto-start on system boot..."
npm run pm2-setup-autoboot > /dev/null 2>&1
echo "✓ Auto-start configured"
echo ""

echo "==========================================="
echo "✅ INSTALLATION COMPLETE!"
echo "==========================================="
echo ""
echo "📖 Next steps:"
echo "1. Open Obsidian"
echo "2. Navigate to: ⚙️ Control Panel"
echo "3. Click: ▶ Start Scraping"
echo ""
echo "🛠️  Commands for manual control:"
echo "   pm2 start yt-vault-service          # Start"
echo "   pm2 stop yt-vault-service           # Stop"
echo "   pm2 logs yt-vault-service           # View logs"
echo "   pm2 monit                           # Monitor"
echo ""
echo "✨ The service will now start automatically when your Mac boots."
echo ""
