# Quick Start Guide - HeavyHire

Get HeavyHire running in 5 minutes!

## Option 1: Docker (Recommended - Easiest)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## Option 2: Manual Setup

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
createdb heavyhire
```

### 3. Install & Setup Project

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Update DATABASE_URL in .env.local:
# DATABASE_URL="postgresql://localhost/heavyhire"

# Generate Prisma client
npx prisma generate

# Setup database schema
npm run db:push

# Seed with test data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

```
Role   | Email                | Password
-------|----------------------|----------
Admin  | admin@heavyhire.rw   | admin123
Owner  | owner@heavyhire.rw   | owner123
Client | client@heavyhire.rw  | client123
```

## Common Tasks

### View Database
```bash
npm run db:studio
```

### Reseed Database
```bash
npm run db:seed
```

### Build for Production
```bash
npm run build
npm start
```

### Check Linting
```bash
npm run lint
```

## Troubleshooting

### PostgreSQL Connection Error
- Ensure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check `DATABASE_URL` in `.env.local`
- Try connecting manually: `psql -d heavyhire`

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
# Now access at http://localhost:3001
```

### Prisma Client Error
```bash
npx prisma generate
npm run db:push
```

### Dependencies Issue
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. ✅ Application running
2. 💻 Explore the [codebase](./README.md)
3. 🎨 Customize styling in [tailwind.config.js](./tailwind.config.js)
4. 🗄️ Modify schema in [prisma/schema.prisma](./prisma/schema.prisma)
5. 📚 Read [deployment guide](./DEPLOYMENT.md)

## What's Included

- ✅ Next.js 14 app with TypeScript
- ✅ PostgreSQL database
- ✅ NextAuth authentication
- ✅ Equipment marketplace UI
- ✅ Booking system skeleton
- ✅ API endpoints for equipment & bookings
- ✅ TailwindCSS styling
- ✅ Responsive design
- ✅ Test data seeding

## Creating Content

### Add Equipment
1. Admin login: admin@heavyhire.rw / admin123
2. Go to admin panel (not yet built)
3. Or manually add via:
   ```bash
   npm run db:studio
   # Add equipment through Prisma Studio GUI
   ```

### Create Bookings
1. Client login: client@heavyhire.rw / client123
2. Browse equipment at `/equipment`
3. Click a listing and book
4. Complete payment flow (mock for now)

## Common Customizations

### Change App Name
- `src/app/layout.tsx` - Metadata and navbar
- `src/app/page.tsx` - Home page content
- `tailwind.config.js` - Colors

### Add New Pages
```bash
# Create page
touch src/app/mypage/page.tsx

# Add to code:
export default function MyPage() {
  return <div>Content</div>;
}
```

### Add API Routes
```bash
# Create endpoint
touch src/app/api/myendpoint/route.ts

# Add to code:
import { NextResponse } from "next/server";

export async function GET(request) {
  return NextResponse.json({ data: "value" });
}
```

## Need Help?

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 📚 [Prisma Docs](https://www.prisma.io/docs)
- 🔐 [NextAuth Docs](https://next-auth.js.org)
- 🎨 [TailwindCSS Docs](https://tailwindcss.com/docs)
- 📦 [React Docs](https://react.dev)

---

**Happy coding! 🚀**
