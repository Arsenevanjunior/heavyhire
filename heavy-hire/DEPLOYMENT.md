# HeavyHire Deployment Guide

This guide covers deploying HeavyHire to production environments.

## Pre-Deployment Checklist

- [ ] All tests pass locally
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL/HTTPS configured
- [ ] Domain name ready
- [ ] Email service configured (if sending emails)
- [ ] Payment provider keys obtained (if using payments)

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Advantages**: Free tier, automatic deployments, built-in PostgreSQL support

#### Setup:
1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Connection string
   - `NEXTAUTH_SECRET`: Generated secret key
   - `NEXTAUTH_URL`: Your production domain

4. Deploy:
```bash
npm install -g vercel
vercel --prod
```

#### Database on Vercel:
Use **Vercel Postgres** or external providers:
- [Vercel Postgres](https://vercel.com/postgres)
- [Railway.app](https://railway.app)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)

### Option 2: Docker Deployment

**Suitable for**: Self-hosted, Heroku, AWS, Google Cloud, Digital Ocean, Railway

#### Build Docker Image:
```bash
docker build -t heavyhire:latest .
```

#### Run Locally:
```bash
docker-compose up
```

#### Deploy to Docker Registry:
```bash
# Tag image
docker tag heavyhire:latest yourregistry/heavyhire:latest

# Push to registry
docker push yourregistry/heavyhire:latest
```

### Option 3: Heroku Deployment

#### Prerequisites:
- Heroku account
- Heroku CLI installed

#### Deploy:
```bash
heroku login
heroku create heavyhire-app
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

#### Configure Environment:
```bash
heroku config:set NEXTAUTH_SECRET="your-secret"
heroku config:set NEXTAUTH_URL="https://heavyhire-app.herokuapp.com"
```

### Option 4: Railway.app Deployment

1. Connect your GitHub repository at [railway.app](https://railway.app)
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy automatically

### Option 5: AWS (ECS + RDS)

#### Steps:
1. Create RDS PostgreSQL database
2. Create ECR repository
3. Build and push Docker image to ECR
4. Create ECS cluster and task definition
5. Deploy service

```bash
# Build and push
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {account}.dkr.ecr.us-east-1.amazonaws.com
docker build -t heavyhire .
docker tag heavyhire:latest {account}.dkr.ecr.us-east-1.amazonaws.com/heavyhire:latest
docker push {account}.dkr.ecr.us-east-1.amazonaws.com/heavyhire:latest
```

### Option 6: DigitalOcean App Platform

1. Connect GitHub repository
2. Set environment variables
3. Create PostgreSQL database
4. Deploy

### Option 7: Self-Hosted (VPS)

#### Prerequisites:
- Ubuntu/Debian server
- Node.js 18+
- PostgreSQL
- Nginx or Apache
- SSL certificate (Let's Encrypt)

#### Setup:
```bash
# SSH into server
ssh root@your-server.com

# Install dependencies
apt update && apt upgrade -y
apt install -y nodejs npm postgresql nginx

# Clone repository
git clone https://github.com/yourrepo/heavyhire.git
cd heavyhire

# Install npm packages
npm ci

# Setup environment
cp .env.production.example .env.production
# Edit .env.production with your settings

# Setup database
sudo -u postgres createdb heavyhire
npm run db:push
npm run db:seed

# Build
npm run build

# Setup systemd service
sudo tee /etc/systemd/system/heavyhire.service > /dev/null <<EOF
[Unit]
Description=HeavyHire
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/username/heavyhire
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl enable heavyhire
sudo systemctl start heavyhire

# Setup Nginx reverse proxy
sudo tee /etc/nginx/sites-available/heavyhire > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site and restart nginx
sudo ln -s /etc/nginx/sites-available/heavyhire /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Database Migrations in Production

### Using Prisma Migrate:
```bash
npm run db:push  # For simple cases
```

### For zero-downtime migrations:
1. Test migrations locally first
2. Create database backup
3. Run migrations during scheduled maintenance window
4. Monitor application logs

## Environment Variables

Required for production:

```env
# Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@host/db

# Authentication
NEXTAUTH_SECRET=<generate-random-secret>
NEXTAUTH_URL=https://yourdomain.com

# Optional Services
PAYMENT_API_KEY=<your-key>
SMTP_HOST=<email-service>
```

## Performance Optimization

### Image Optimization:
Next.js automatically optimizes images. For external images, configure in `next.config.js`.

### Database:
- Create indexes on frequently queried fields
- Implement caching strategies
- Monitor slow queries

### Monitoring:
```bash
# Use Process Manager
npm install -g pm2
pm2 start npm --name "heavyhire" -- start
pm2 save
pm2 startup
```

## SSL/HTTPS

### Let's Encrypt (Free):
```bash
certbot certonly --standalone -d yourdomain.com
```

### Redirect HTTP to HTTPS:
```
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### Application Logs:
Check Next.js logs in your hosting platform's dashboard.

### Database Monitoring:
Use your database provider's monitoring tools.

### Error Tracking:
Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

## Backup Strategy

### Database Backups:
```bash
# Manual backup
pg_dump heavyhire > backup.sql

# Restore from backup
psql heavyhire < backup.sql
```

Most managed database services (Vercel Postgres, Railway, Supabase) have automatic backups.

## Scaling

For increased traffic:

1. **Database**: Upgrade instance size or use read replicas
2. **Application**: Use multiple instances with load balancing
3. **Caching**: Implement Redis caching
4. **CDN**: Serve static assets from CDN

## Post-Deployment

1. Monitor application performance
2. Set up error tracking
3. Configure log aggregation
4. Create backup schedule
5. Document deployment process
6. Set up CI/CD pipeline
7. Plan disaster recovery

## Troubleshooting

### Database Connection Issues:
- Verify `DATABASE_URL` is correct
- Check firewall rules
- Test connection with `psql` or `prisma studio`

### Build Failures:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review build logs

### Authentication Issues:
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches domain
- Clear browser cookies and retry

## Support

For deployment help:
- Hosting provider documentation
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
