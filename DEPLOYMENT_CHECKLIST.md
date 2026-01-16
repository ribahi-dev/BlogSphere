# 🚀 Deployment Checklist

## Pre-Deployment Review

### Code Quality
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] No PHP warnings/errors in logs
- [ ] Code reviewed and approved
- [ ] Dependencies up to date
- [ ] No hardcoded credentials
- [ ] No debug code left

### Security
- [ ] Strong `APP_SECRET` generated
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] JWT expiration set appropriately
- [ ] Database credentials secure
- [ ] API keys not exposed
- [ ] Error messages don't leak info
- [ ] Rate limiting considered
- [ ] CSRF protection enabled

### Performance
- [ ] Database queries optimized
- [ ] Indexes created
- [ ] Caching configured
- [ ] Frontend assets minified
- [ ] Images optimized
- [ ] Load time acceptable

### Database
- [ ] All migrations applied
- [ ] Backup strategy planned
- [ ] Database user has limited privileges
- [ ] Connections pooling configured
- [ ] Connection limits set

---

## Deployment Steps

### 1. Backend Deployment

#### Infrastructure Setup
```bash
# On production server

# Clone repository
git clone <repo-url>
cd projet-php/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
chmod -R 755 var/
chmod -R 755 public/
```

#### Configuration
```bash
# Copy environment template
cp .env .env.local

# Edit with production values
nano .env.local
```

#### Database Setup
```bash
# Create database
php bin/console doctrine:database:create

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Verify schema
php bin/console doctrine:schema:validate
```

#### Cache Warming
```bash
# Clear and warm up cache
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

#### Web Server Configuration

**Apache (.htaccess in public/):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>
```

**Nginx (server block):**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    root /var/www/projet-php/backend/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTPS off;
    }
}
```

### 2. Frontend Deployment

#### Build
```bash
# Build for production
npm run build

# This creates dist/ folder with optimized assets
```

#### Upload to Server
```bash
# Using rsync
rsync -avz dist/ user@yourdomain.com:/var/www/yourdomain/

# Or using SCP
scp -r dist/* user@yourdomain.com:/var/www/yourdomain/
```

#### Web Server Configuration

**Nginx (server block for frontend):**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/yourdomain;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. SSL/HTTPS Setup

#### Using Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

#### Update Nginx
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # ... rest of config
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Post-Deployment

### Verification
- [ ] Frontend loads correctly
- [ ] API endpoints accessible
- [ ] Authentication works
- [ ] Database operations work
- [ ] Images load properly
- [ ] No JavaScript errors
- [ ] No console errors

### Monitoring
- [ ] Setup error logging
- [ ] Setup performance monitoring
- [ ] Setup uptime monitoring
- [ ] Setup email alerts
- [ ] Monitor disk space
- [ ] Monitor memory usage
- [ ] Monitor database size

### Backups
- [ ] Database backup scheduled
- [ ] Files backup scheduled
- [ ] Test restore procedure
- [ ] Document backup location
- [ ] Store backup credentials securely

### Maintenance
- [ ] Document deployment steps
- [ ] Document rollback procedure
- [ ] Setup update schedule
- [ ] Plan maintenance window
- [ ] Document admin password
- [ ] Setup 2FA for admin access

---

## Environment Variables (Production)

### Backend
```env
APP_ENV=prod
APP_DEBUG=false
APP_SECRET=<generate-long-random-string>
DATABASE_URL=postgresql://user:pass@localhost:5432/blog_db
FRONTEND_URL=https://yourdomain.com
JWT_EXPIRATION=7
CORS_ALLOW_ORIGIN=https://yourdomain.com
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
```

### Frontend
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Rollback Procedure

### If Something Goes Wrong

```bash
# 1. Stop the affected service
systemctl stop nginx  # or apache2
systemctl stop php8.2-fpm

# 2. Restore from backup
git checkout <previous-commit>
composer install --no-dev

# 3. Restore database
mysql blog_db < backup.sql

# 4. Clear cache
php bin/console cache:clear --env=prod

# 5. Restart services
systemctl start php8.2-fpm
systemctl start nginx
```

---

## Monitoring & Alerts

### Key Metrics to Monitor
- Response time
- Error rate
- CPU usage
- Memory usage
- Disk usage
- Database queries
- Failed authentications

### Recommended Tools
- **Uptime Monitoring**: Uptime Robot, New Relic
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: ELK Stack, Splunk

---

## Security Hardening

### After Deployment
- [ ] Change default passwords
- [ ] Enable 2FA for admin accounts
- [ ] Setup Web Application Firewall (WAF)
- [ ] Configure DDoS protection
- [ ] Setup intrusion detection
- [ ] Review access logs
- [ ] Harden server OS

### Regular Maintenance
- [ ] Security updates monthly
- [ ] Dependency updates quarterly
- [ ] Security audit annually
- [ ] Penetration testing annually
- [ ] Password rotation every 90 days

---

## Support & Documentation

### Document for Admins
1. How to access admin panel
2. How to manage users
3. How to backup database
4. How to restore from backup
5. How to troubleshoot issues
6. Emergency contact information
7. Rollback procedure

### Setup Maintenance Window
- Scheduled: Every Sunday 2-3 AM UTC
- Backup time: ~5 minutes
- Testing time: ~10 minutes
- Rollback plan: If anything fails

---

## Deployment Automation (Optional)

### Using GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy backend
        run: |
          ssh user@server "cd /var/www/projet-php && git pull && composer install --no-dev"
      - name: Deploy frontend
        run: |
          npm install
          npm run build
          rsync -avz dist/ user@server:/var/www/yourdomain/
```

---

## Success Criteria

### Before Going Live
- [ ] All tests pass
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Security audit passed
- [ ] Backup verified
- [ ] Documentation complete
- [ ] Team trained
- [ ] Support plan in place

### After Going Live
- [ ] No error spikes
- [ ] Normal response times
- [ ] User feedback positive
- [ ] All features working
- [ ] Monitoring active
- [ ] Team on standby

---

## Post-Launch

### First Week
- Monitor closely for issues
- Respond quickly to bugs
- Gather user feedback
- Performance monitoring
- Team standby

### First Month
- Feature validation
- User adoption tracking
- Performance analysis
- Security log review
- Plan improvements

### Ongoing
- Regular updates
- Security monitoring
- Performance optimization
- User support
- Feature requests handling

---

## Useful Commands

### Backup Database
```bash
# PostgreSQL
pg_dump blog_db > backup_$(date +%Y%m%d).sql

# MySQL
mysqldump -u user -p blog_db > backup_$(date +%Y%m%d).sql
```

### Check Disk Space
```bash
df -h
du -sh /var/www/*
```

### Monitor Logs
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
tail -f backend/var/log/prod.log
```

### Check Service Status
```bash
systemctl status nginx
systemctl status php8.2-fpm
systemctl status postgresql
```

---

## Contact Information

**Deployment Support**: [Your Email/Phone]
**Database Admin**: [Name/Email]
**System Admin**: [Name/Email]
**Security Contact**: [Name/Email]

---

## Final Checklist

- [ ] All items checked
- [ ] Deployment approved
- [ ] Backup verified
- [ ] Team notified
- [ ] Documentation updated
- [ ] Rollback plan ready
- [ ] Monitoring active
- [ ] Support ready

✅ **Ready for Production Deployment!**
