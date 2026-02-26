# Complete Vercel Deployment Guide for HeavyHire

This guide will walk you through deploying your website live on Vercel **step by step**.

## Step 1: Create a GitHub Account & Push Your Code

### 1a. Create GitHub Account (if you don't have one)
1. Go to [github.com/signup](https://github.com/signup)
2. Enter your email
3. Create a password
4. Choose a username
5. Click "Create account"
6. Verify your email

### 1b. Create a Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `heavyhire` (or any name you want)
3. Description: `Equipment rental marketplace`
4. Choose "Public" (easier for Vercel)
5. Click "Create repository"

### 1c. Push Your Code to GitHub

After creating the repo, GitHub will show you commands. Run these in your terminal:

```bash
# Navigate to your project
cd "/workspaces/heavyhire/AI project #1"

# Initialize git if not already done
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - HeavyHire marketplace"

# Add your GitHub repo as remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/heavyhire.git

# Push to GitHub
git branch -M main
git push -u origin main
```

After pushing, your code will be on GitHub at: `https://github.com/USERNAME/heavyhire`

---

## Step 2: Setup Database on Vercel Postgres

### Option A: Vercel Postgres (Free & Easy)

1. Go to [vercel.com/postgres](https://vercel.com/postgres)
2. Click "Create Database"
3. Choose a name: `heavyhire`
4. Choose region closest to you
5. Click "Create"
6. Copy the connection string (it will look like: `postgresql://...`)
7. Save it safely - you'll need it soon

### Option B: Railway.app (Alternative, Very Good)

If Vercel Postgres is full, use Railway instead:

1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. Click "New Project"
4. Add "PostgreSQL"
5. It will auto-create database
6. Copy the DATABASE_URL from "Connect" tab

### Option C: Supabase (Another Alternative)

1. Go to [supabase.com](https://supabase.com)
2. Login with GitHub
3. Create new project
4. Get connection string from settings

---

## Step 3: Create Vercel Account & Deploy

### 3a. Create Vercel Account

1. Go to [vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete setup

### 3b. Import Your Project

1. After signing in, click "New Project"
2. Find and select your `heavyhire` repository
3. Click "Import"

### 3c. Configure Environment Variables

Before deploying, Vercel will ask for environment variables. Fill in:

```
DATABASE_URL = [Paste your PostgreSQL connection string from Step 2]
NEXTAUTH_SECRET = [Generate a new secret below]
NEXTAUTH_URL = https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL = https://your-domain.vercel.app
NODE_ENV = production
```

#### Generate NEXTAUTH_SECRET:

Paste this in your terminal (Mac/Linux):
```bash
openssl rand -base64 32
```

Windows users, paste this in terminal:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {[byte](Get-Random -Maximum 256)}))
```

Copy the output and paste it as `NEXTAUTH_SECRET` value.

### 3d. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for deployment
3. You'll see a screen with your live URL!

---

## Step 4: Setup Database Schema on Vercel

After deployment, run these commands to setup the database:

```bash
# Option A: Using Vercel CLI
vercel env pull .env.local    # Download env vars
npm run db:push               # Push schema to Vercel database
npm run db:seed               # Add test data

# Option B: If you can't use CLI
# Login to Vercel Dashboard
# Copy DATABASE_URL from deployment environment
# Run: npx prisma db push --skip-generate
# Run: npx prisma db seed
```

---

## Step 5: Test Your Live Website

After deployment, test these:

1. **Visit your site**: `https://your-project.vercel.app`
2. **Register a new account**: Click "Sign Up"
3. **Login**: Use credentials you created or demo accounts:
   - Email: `client@heavyhire.rw`
   - Password: `client123`
4. **Browse equipment**: Click "Browse Equipment"
5. **View details**: Click on any equipment

---

## Troubleshooting

### Problem: "Build Failed"

**Solution**: Check build logs in Vercel dashboard
1. Go to your project on Vercel
2. Click "Deployments"
3. Click the failed deployment
4. Scroll to see error message
5. Common fixes:
   - Make sure all dependencies are in `package.json`
   - Check environment variables are set
   - Make sure `.env.local` is in `.gitignore`

### Problem: "Database connection error"

**Solution**: Check DATABASE_URL
1. Verify connection string is correct
2. Test locally first: `npm run db:push`
3. Make sure database is running
4. Check firewall allows connections

### Problem: "Cannot find module '@/lib/prisma'"

**Solution**: Regenerate Prisma client
```bash
npx prisma generate
npm run build
```

### Problem: Blank page or 404 errors

**Solution**: Check logs
1. Open Vercel dashboard
2. Go to "Functions" tab
3. Look for error messages
4. Usually means environment variables not set

### Problem: "NextAuth CredentialsProvider not working"

**Solution**: Make sure:
- `NEXTAUTH_SECRET` is set in Vercel
- `NEXTAUTH_URL` matches your domain
- Database is connected and has users

---

## After Deployment: What's Next?

### 1. Custom Domain (Optional)

In Vercel dashboard:
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions from your domain registrar

### 2. Add Real Users

Create accounts at your live site or use demo credentials:
- Admin: `admin@heavyhire.rw` / `admin123`
- Owner: `owner@heavyhire.rw` / `owner123`
- Client: `client@heavyhire.rw` / `client123`

### 3. Auto-Deployment

Your site now auto-deploys when you:
1. Make changes locally
2. Push to GitHub (`git push origin main`)
3. Vercel automatically rebuilds and deploys!

---

## Your Live URL

Your website will be at:
**`https://[your-project-name].vercel.app`**

Example: `https://heavyhire.vercel.app`

---

## Quick Reference Commands

```bash
# Local testing before pushing
npm run dev              # Test locally first at http://localhost:3000

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Your message"
git push origin main

# If you need to manually push to Vercel
vercel --prod            # Deploy production

# Check deployment status
vercel list              # Show all deployments
vercel logs              # Check logs
```

---

## Security Notes

✅ Never commit `.env.local` (it's in `.gitignore`)
✅ Always set environment variables in Vercel dashboard
✅ Use strong `NEXTAUTH_SECRET` (generated via openssl)
✅ Database credentials stay secure on Vercel

---

## What If I Don't Want Vercel?

See alternatives in `DEPLOYMENT.md`:
- Railway.app (easiest alternative)
- Heroku (free tier available)
- Docker (any cloud provider)
- Self-hosted VPS

---

## Summary

**5 Steps to Live Website:**
1. ✅ Push code to GitHub
2. ✅ Create Vercel account
3. ✅ Import GitHub project
4. ✅ Set environment variables
5. ✅ Deploy & test

**Time needed**: ~15-20 minutes
**Cost**: Free! (Vercel free tier, Vercel Postgres not free but very cheap)

---

**Need help? Read the sections above for your specific issue.**
