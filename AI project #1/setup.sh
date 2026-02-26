#!/bin/bash
set -e

echo "🚀 Starting HeavyHire setup..."

# Check if docker is available
if ! command -v docker &> /dev/null; then
  echo "⚠️ Docker is not installed. Please install Docker to continue."
  echo "Visit: https://docs.docker.com/get-docker/"
  exit 1
fi

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# Install dependencies
echo "📚 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🗄️ Setting up database schema..."
npm run db:push

# Seed database
echo "🌱 Seeding database with test data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Start dev server: npm run dev"
echo "  2. Open browser: http://localhost:3000"
echo ""
echo "📝 Demo Credentials:"
echo "  Admin:  admin@heavyhire.rw   / admin123"
echo "  Owner:  owner@heavyhire.rw   / owner123"
echo "  Client: client@heavyhire.rw  / client123"
echo ""
