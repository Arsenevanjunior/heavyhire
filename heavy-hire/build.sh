#!/bin/bash

echo "🚀 Building HeavyHire for production..."

# Install dependencies
npm ci

# Generate Prisma
npx prisma generate

# Build Next.js
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  echo ""
  echo "📦 To deploy:"
  echo "  Option 1 - Vercel: vercel --prod"
  echo "  Option 2 - Docker: docker build -t heavyhire . && docker run -p 3000:3000 heavyhire"
  echo "  Option 3 - Manual: npm start"
  echo ""
else
  echo "❌ Build failed!"
  exit 1
fi
