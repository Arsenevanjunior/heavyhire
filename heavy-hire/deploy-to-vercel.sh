#!/bin/bash

# HeavyHire Vercel Deployment Script
# This script prepares your project for deployment to Vercel

set -e

echo "🚀 Starting HeavyHire Vercel Deployment..."
echo ""

# Step 1: Check git
echo "📦 Step 1: Initializing Git Repository..."
if [ ! -d .git ]; then
  git init
  echo "✅ Git initialized"
else
  echo "✅ Git already initialized"
fi

# Step 2: Configure git
echo ""
echo "📝 Step 2: Configuring Git..."
git config user.email "deployment@heavyhire.rw" || git config --global user.email "deployment@heavyhire.rw"
git config user.name "HeavyHire Deployer" || git config --global user.name "HeavyHire Deployer"
echo "✅ Git configured"

# Step 3: Add all files
echo ""
echo "📂 Step 3: Staging files..."
git add .
echo "✅ Files staged"

# Step 4: Create commit
echo ""
echo "💾 Step 4: Creating commit..."
git commit -m "Initial HeavyHire deployment - Equipment rental marketplace" || echo "No changes to commit"
echo "✅ Commit created"

# Step 5: Display instructions
echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Repository Ready for Vercel!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  NEON DATABASE (Already have account open?)"
echo "   • Go to https://console.neon.tech"
echo "   • Copy your connection string (looks like: postgresql://user:password@...)"
echo "   • Keep it safe - you'll need it in Step 3"
echo ""
echo "2️⃣  GITHUB REPOSITORY (Need to create one)"
echo "   • Go to https://github.com/new"
echo "   • Name: heavyhire"
echo "   • Choose 'Public'"
echo "   • Click 'Create repository'"
echo ""
echo "3️⃣  PUSH TO GITHUB"
echo "   • Copy the commands GitHub shows you"
echo "   • They'll look like:"
echo "     git remote add origin https://github.com/USERNAME/heavyhire.git"
echo "     git branch -M main"
echo "     git push -u origin main"
echo "   • Paste and run them"
echo ""
echo "4️⃣  VERCEL DEPLOYMENT (Account already open?)"
echo "   • Go to https://vercel.com/new"
echo "   • Click 'Import Git Repository'"
echo "   • Select your 'heavyhire' repo from GitHub"
echo "   • Click 'Import'"
echo ""
echo "5️⃣  ENVIRONMENT VARIABLES in Vercel"
echo "   • DATABASE_URL=[Your Neon connection string]"
echo "   • NEXTAUTH_SECRET=[See details below]"
echo "   • NEXTAUTH_URL=https://YOUR-DOMAIN.vercel.app"
echo "   • NEXT_PUBLIC_APP_URL=https://YOUR-DOMAIN.vercel.app"
echo "   • NODE_ENV=production"
echo ""
echo "6️⃣  GENERATE NEXTAUTH_SECRET"
echo "   • Run this command:"
echo "     openssl rand -base64 32"
echo "   • Copy the output and paste as NEXTAUTH_SECRET value"
echo ""
echo "7️⃣  CLICK DEPLOY on Vercel!"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "💡 Tips:"
echo "   • Your live site URL: https://your-project-name.vercel.app"
echo "   • You can push updates: git push origin main (auto-deploys)"
echo "   • Check logs in Vercel dashboard if something fails"
echo ""
echo "🎯 Test Credentials After Deployment:"
echo "   • Admin: admin@heavyhire.rw / admin123"
echo "   • Owner: owner@heavyhire.rw / owner123"
echo "   • Client: client@heavyhire.rw / client123"
echo ""
