module.exports = {
  apps: [
    {
      name: 'sessions',
      script: 'server/index.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3004
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3004
      }
    }
  ],

  deploy: {
    staging: {
      user: 'ec2-user',
      host: 'd.sessions-h.frame3nline.com',
      ref: 'origin/master',
      repo: 'git@gitlab.com:frame3nline/sessions.git',
      path: '/var/www/sessions',
      env: { NODE_ENV: 'staging' },
      'post-deploy':
        'yarn && node_modules/.bin/sequelize db:migrate --config server/config/config.json --migrations-path server/migrations && npm run build && pm2 reload ecosystem.config.js --env staging --update-env'
    },

    production: {
      user: 'ec2-user',
      host: 'd.sessions.frame3nline.com',
      ref: 'origin/master',
      repo: 'git@gitlab.com:frame3nline/sessions.git',
      path: '/var/www/sessions',
      env: { NODE_ENV: 'production' },
      'post-deploy':
        'yarn && npm run build && pm2 reload ecosystem.config.js --env production --update-env'
    }
  }
}
