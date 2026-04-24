# PM2 Setup — Auto-Start & Persistence

PM2 is a production process manager that keeps your yt-vault service running forever, even if it crashes or the system restarts.

## What PM2 Does

✅ **Auto-restart on crash** — If service dies, PM2 restarts it automatically  
✅ **Auto-start on reboot** — Service starts when your PC boots up  
✅ **Monitor & logs** — View real-time status, CPU, memory, logs  
✅ **Production-grade** — Used by companies worldwide  

## Setup (3 Steps)

### Step 1: PM2 is Already Installed ✓
```bash
pm2 --version
```

### Step 2: Service is Already Running via PM2 ✓
```bash
pm2 status
```
You should see `yt-vault-service` with status `online`

### Step 3: Enable Auto-Start on Reboot ⚠️
**Run this ONCE (requires your password):**

```bash
cd logic-engine
npm run pm2-setup-autoboot
```

This will:
1. Ask for your password
2. Register PM2 as a system service
3. Enable auto-start on reboot
4. Save the process configuration

---

## Quick Commands

```bash
# Start service via PM2
npm run pm2-start

# Stop service
npm run pm2-stop

# Restart service
npm run pm2-restart

# View live logs
npm run pm2-logs

# Monitor CPU/Memory
npm run pm2-monit

# Check status
pm2 status

# Delete from PM2 (if you want to stop it permanently)
pm2 delete yt-vault-service
```

---

## What Happens After Setup

### Scenario 1: Terminal Closes
✅ Service keeps running in background  
✅ PM2 watches it and restarts if needed

### Scenario 2: PC Restarts
✅ PM2 starts automatically on boot  
✅ yt-vault-service starts automatically  
✅ When you open Obsidian, service is already running

### Scenario 3: Service Crashes
✅ PM2 detects crash within seconds  
✅ Automatically restarts service  
✅ Logs the crash in `.planning/logs/pm2-err.log`

---

## Troubleshooting

### Service won't start with PM2
```bash
# Check what's using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Restart PM2
npm run pm2-restart
```

### View error logs
```bash
npm run pm2-logs
```

### Remove auto-boot (if needed)
```bash
# First stop PM2
pm2 stop yt-vault-service

# Then remove from startup
pm2 unstartup launchd -u $USER --hp $HOME

# Finally remove service
pm2 delete yt-vault-service
```

---

## How It Works Internally

**File: `ecosystem.config.js`**
- Defines how PM2 should run your service
- Auto-restart on crash: ✓
- Max memory: 500MB
- Logs: `.planning/logs/pm2-*.log`

**File: `setup-pm2-autoboot.sh`**
- Bash script that registers PM2 with system
- Creates launchd service on macOS
- Enables auto-start on boot

**Logs:**
- Stdout: `.planning/logs/pm2-out.log`
- Stderr: `.planning/logs/pm2-err.log`

---

## For Sharing with Others

When you share the repo with someone:

1. They install PM2: `npm install -g pm2` (already done for you)
2. They run PM2 setup: `npm run pm2-setup-autoboot`
3. Everything works automatically after reboot

Or they can just use the Obsidian plugin auto-start (no PM2 needed, but slower).

---

**Setup Date:** 2026-04-24  
**Status:** ✓ Configured and running
