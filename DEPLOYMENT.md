# Deployment Guide - Fly.io with SQLite

This guide walks you through deploying the DRP Project Management System to Fly.io with a persistent SQLite database.

## Prerequisites

1. **Fly.io Account**: Sign up at https://fly.io
2. **Fly.io CLI**: Already installed at `~/.fly/bin/flyctl`

## Initial Setup

### 1. Login to Fly.io

```bash
~/.fly/bin/flyctl auth login
```

### 2. Create the App

```bash
~/.fly/bin/flyctl apps create drp-project-management --org personal
```

### 3. Create the Persistent Volume (for SQLite database)

```bash
~/.fly/bin/flyctl volumes create drp_data --region sin --size 1
```

This creates a 1GB volume in Singapore (closest to Philippines).

### 4. Set Environment Variables

```bash
~/.fly/bin/flyctl secrets set \
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key" \
  CLERK_SECRET_KEY="your_clerk_secret_key" \
  GEMINI_API_KEY="your_gemini_api_key" \
  R2_ACCOUNT_ID="your_r2_account_id" \
  R2_ACCESS_KEY_ID="your_r2_access_key" \
  R2_SECRET_ACCESS_KEY="your_r2_secret_access_key" \
  R2_BUCKET_NAME="your_r2_bucket" \
  R2_PUBLIC_URL="your_r2_public_url" \
  NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in" \
  NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up" \
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard" \
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/dashboard"
```

### 5. Deploy Manually (First Time)

```bash
~/.fly/bin/flyctl deploy
```

### 6. Database Setup (Choose One)

**Option A: Start Fresh (Empty Database)**

SSH into the machine and run migrations:

```bash
~/.fly/bin/flyctl ssh console
cd /app
npx drizzle-kit push
exit
```

**Option B: Upload Your Existing Database**

Use the deployment script to upload your local database:

```bash
./scripts/deploy-with-data.sh
```

Or manually:

```bash
# After deploying, upload your database
~/.fly/bin/flyctl ssh sftp shell
put data/local.db /app/data/local.db
exit

# Restart the app
~/.fly/bin/flyctl apps restart drp-project-management
```

## CI/CD Setup with GitHub Actions

### 1. Get Fly.io API Token

```bash
~/.fly/bin/flyctl auth token
```

### 2. Add Token to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `FLY_API_TOKEN`
5. Value: (paste the token from step 1)

### 3. Push to GitHub

```bash
git add .
git commit -m "Add Fly.io deployment config and CI/CD"
git push origin main
```

Now every push to `main` will automatically deploy to Fly.io!

## Database Management

### Access the Database

```bash
~/.fly/bin/flyctl ssh console
sqlite3 /app/data/local.db
```

### Backup the Database

```bash
~/.fly/bin/flyctl ssh sftp get /app/data/local.db ./backup-$(date +%Y%m%d).db
```

### Restore Database from Backup

```bash
~/.fly/bin/flyctl ssh sftp shell
put local-backup.db /app/data/local.db
exit
~/.fly/bin/flyctl apps restart drp-project-management
```

## Monitoring

### View Logs

```bash
~/.fly/bin/flyctl logs
```

### Check App Status

```bash
~/.fly/bin/flyctl status
```

### View Metrics

```bash
~/.fly/bin/flyctl dashboard
```

## Scaling

### Scale VM Resources

```bash
~/.fly/bin/flyctl scale vm shared-cpu-1x --memory 1024
```

### Increase Storage

```bash
~/.fly/bin/flyctl volumes extend drp_data --size 5
```

## Custom Domain

### Add Your Domain

```bash
~/.fly/bin/flyctl certs create yourdomain.com
~/.fly/bin/flyctl certs show yourdomain.com
```

Follow the DNS instructions provided.

## Cost Estimation

- **Hobby Plan**: Free tier includes
  - 3 shared-cpu-1x VMs with 256MB RAM
  - 3GB persistent volume storage
  - 160GB outbound data transfer

- **Your Setup**:
  - 1 VM (shared-cpu-1x, 512MB RAM): ~$2/month
  - 1GB persistent volume: Free
  - **Total: ~$2/month**

## Troubleshooting

### App Won't Start

Check logs:
```bash
~/.fly/bin/flyctl logs
```

### Database Issues

SSH in and check:
```bash
~/.fly/bin/flyctl ssh console
ls -lh /app/data/
sqlite3 /app/data/local.db ".tables"
```

### Reset Everything

```bash
~/.fly/bin/flyctl apps destroy drp-project-management
# Then start over from step 2
```

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Custom domain configured
- [ ] SSL certificate working
- [ ] Backups scheduled
- [ ] Monitoring alerts configured
- [ ] GitHub Actions CI/CD working

## SQLite Performance Notes

**Your app will handle**:
- Multiple users viewing projects simultaneously
- Reads are extremely fast (local disk)
- Writes are queued automatically by SQLite
- Perfect for 10-100 concurrent users

**When to scale**:
- If you need multiple geographic regions → Use Turso with LiteFS
- If you need 1000+ concurrent users → Consider PostgreSQL
- For now, this setup is perfect! 🚀
