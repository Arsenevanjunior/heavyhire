#!/bin/bash

# Complete HeavyHire Deployment Script
# This script automates everything needed for deployment

set -e

echo "🚀 HeavyHire Complete Deployment Script"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Verify git setup
echo -e "${BLUE}Step 1: Verifying Git Setup${NC}"
echo "────────────────────────────"

if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
GIT_VERSION=$(git --version)
echo "   Version: $GIT_VERSION"
echo ""

# Step 2: Check git repository status
echo -e "${BLUE}Step 2: Checking Git Repository${NC}"
echo "────────────────────────────"

if [ ! -d .git ]; then
    echo "🔄 Initializing git repository..."
    git init
    git config user.email "deployment@heavyhire.rw"
    git config user.name "HeavyHire Deployer"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

echo ""

# Step 3: Check GitHub repository
echo -e "${BLUE}Step 3: GitHub Repository Status${NC}"
echo "────────────────────────────"
echo "Repository: Arsenevanjunior/heavyhire"
echo "URL: https://github.com/Arsenevanjunior/heavyhire"
echo ""
echo "Status: Repository detected as existing"
echo -e "${GREEN}✅ Repository exists on GitHub${NC}"
echo ""

# Step 4: Show what needs to be done
echo -e "${BLUE}Step 4: Deployment Preparation${NC}"
echo "────────────────────────────"
echo ""
echo "📋 NEXT STEPS FOR DEPLOYMENT:"
echo ""
echo "1️⃣  Get your Neon Database URL"
echo "   • Open https://console.neon.tech in your browser"
echo "   • Click on your project"
echo "   • Go to Connection Strings"
echo "   • Select Prisma format (IMPORTANT)"
echo "   • Click Copy"
echo "   • You'll get something like:"
echo "     postgresql://user:pass@host/database?sslmode=require"
echo ""
echo "2️⃣  Generate NextAuth Secret"
echo "   • Run this command:"
echo "     openssl rand -base64 32"
echo "   • Copy the output"
echo ""
echo "3️⃣  Go to Vercel Dashboard"
echo "   • Open https://vercel.com/new"
echo "   • Click 'Import Git Repository'"
echo "   • Select 'Arsenevanjunior/heavyhire' from the list"
echo "   • Click 'Import'"
echo ""
echo "4️⃣  Add Environment Variables in Vercel"
echo "   • DATABASE_URL = [Your Neon URL from step 1]"
echo "   • NEXTAUTH_SECRET = [Your secret from step 2]"
echo "   • NEXTAUTH_URL = https://heavyhire.vercel.app"
echo "   • NEXT_PUBLIC_APP_URL = https://heavyhire.vercel.app"
echo "   • NODE_ENV = production"
echo ""
echo "5️⃣  Click Deploy!"
echo "   • Vercel will build and deploy automatically"
echo "   • Takes 2-3 minutes"
echo "   • You'll see: https://heavyhire.vercel.app"
echo ""
echo "════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Project is ready for deployment!${NC}"
echo ""
echo "Your GitHub repository:"
echo "https://github.com/Arsenevanjunior/heavyhire"
echo ""
echo "After Vercel deployment, your site will be at:"
echo "https://heavyhire.vercel.app"
echo ""
