module.exports = {
  apps: [
    {
      name: 'yt-vault-service',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        SERVICE_PORT: 3000
      },
      // Auto-restart on crash
      autorestart: true,
      // Max memory usage
      max_memory_restart: '500M',
      // Logs
      output: '../.planning/logs/pm2-out.log',
      error: '../.planning/logs/pm2-err.log',
      // Merge logs from multiple instances
      merge_logs: true,
      // Watch for file changes (optional - set to false for production)
      watch: false,
      // Ignore certain files
      ignore_watch: ['node_modules', '.git'],
      // Delay restart on crash (ms)
      min_uptime: '10s',
      max_restarts: 10,
      listen_timeout: 3000
    }
  ]
};
