#!/bin/bash

# Try to deploy using Vercel CLI
# This attempts automatic deployment

echo "🚀 Attempting Vercel CLI Auto-Deployment"
echo "=========================================="
echo ""

# Check if vercel is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo ""
    echo "Vercel version:"
    vercel --version
    echo ""
    echo "To deploy, run:"
    echo ""
    echo "  vercel --prod"
    echo ""
    echo "Then:"
    echo "  1. Choose your account"
    echo "  2. Link to existing project (choose Arsenevanjunior/heavyhire)"
    echo "  3. Enter environment variables when asked"
    echo "  4. Press Enter to deploy"
    echo ""
else
    echo "❌ Vercel CLI is not installed"
    echo ""
    echo "Install it with:"
    echo "  npm install -g vercel"
    echo ""
    echo "Then run:"
    echo "  vercel --prod"
    echo ""
fi
