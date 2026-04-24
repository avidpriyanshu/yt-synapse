#!/bin/bash

# Setup PM2 auto-boot for yt-vault service
# This script enables the service to auto-start on system reboot

echo "Setting up PM2 auto-boot..."
echo "This will ask for your password once."
echo ""

# Get the Node.js path
NODE_VERSION=$(node -v)
NVM_PATH=$(dirname $(dirname $(which node)))
NODE_BIN="$NVM_PATH/bin/node"

# Run PM2 startup with sudo
sudo env PATH=$PATH:$NVM_PATH/bin $NVM_PATH/lib/node_modules/pm2/bin/pm2 startup launchd -u $USER --hp $HOME

# Save PM2 process list
pm2 save

echo ""
echo "✓ PM2 auto-boot configured!"
echo "✓ Service will auto-start on system reboot"
echo ""
echo "Next steps:"
echo "1. Restart your machine"
echo "2. Service will start automatically"
echo "3. Open Obsidian - plugin will find running service"
echo ""
echo "Useful commands:"
echo "  pm2 status              # Check service status"
echo "  pm2 logs yt-vault-service  # View live logs"
echo "  pm2 restart yt-vault-service  # Restart service"
echo "  pm2 monit               # Monitor CPU/memory"
