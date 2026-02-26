# HeavyHire - Equipment Rental Marketplace

A modern Next.js-based platform for renting and hiring heavy equipment across East Africa. Connect equipment owners with clients for construction, agriculture, transport, and refrigerated logistics.

## Features

- **Equipment Marketplace**: Browse and filter equipment by category (Construction, Agricultural, Heavy Transport, Refrigerated)
- **User Roles**: Support for Clients (renters) and Owners (equipment providers)
- **Secure Booking System**: Streamlined booking with date selection and price calculation
- **Escrow Payments**: Safe payment handling with escrow protection
- **Authentication**: Secure login/registration with NextAuth.js
- **Equipment Details**: Comprehensive equipment listings with specifications, pricing, and reviews
- **Real-time Availability**: Track equipment availability and booking status

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS + Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Charts**: Recharts

## Installation & Setup

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   cd "AI project #1"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your database and app settings:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/heavyhire"
   NEXTAUTH_SECRET="your-random-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Setup Database**
   ```bash
   # Push the schema to database
   npm run db:push
   
   # Seed with test data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After seeding, test with these accounts:

| Role   | Email                  | Password  |
|--------|------------------------|-----------|
| Admin  | admin@heavyhire.rw     | admin123  |
| Owner  | owner@heavyhire.rw     | owner123  |
| Client | client@heavyhire.rw    | client123 |

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── equipment/    # Equipment listing endpoints
│   │   └── bookings/     # Booking management
│   ├── auth/             # Auth pages (login, register)
│   ├── equipment/        # Equipment browse and detail pages
│   ├── dashboard/        # User dashboard
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Prisma client singleton
│   ├── auth.ts           # NextAuth configuration
│   └── auth-utils.ts     # Auth utility functions
└── components/           # Reusable React components

prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seed script
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Build & Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database with test data

# Linting
npm run lint             # Run ESLint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Equipment
- `GET /api/equipment` - List all approved equipment
- `GET /api/equipment?category=CONSTRUCTION` - Filter by category
- `GET /api/equipment/[id]` - Get equipment details

### Bookings
- `POST /api/bookings` - Create a booking (requires auth)
- `GET /api/bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/[id]` - Get booking details (requires auth)

## Database Schema Highlights

### Core Models
- **User**: System users (OWNER, CLIENT, ADMIN roles)
- **OwnerProfile**: Extended profile for equipment owners with wallet and subscription tier
- **Equipment**: Equipment listings with pricing, availability, and specifications
- **Booking**: Rental transactions linking clients with equipment
- **Payment**: Escrow payment handling with multiple payment methods
- **Review**: Equipment and user ratings/reviews
- **Dispute**: Dispute resolution system

### Key Features
- Role-based access control (RBAC)
- Equipment categorization (CONSTRUCTION, AGRICULTURAL, HEAVY_TRANSPORT, REFRIGERATED)
- Booking status workflow (PENDING → CONFIRMED → ACTIVE → COMPLETED)
- Payment escrow (PENDING → HELD_ESCROW → RELEASED/REFUNDED)
- Subscription tiers for owners (FREE, BASIC, PROFESSIONAL, ENTERPRISE)

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t heavyhire .
docker run -p 3000:3000 heavyhire
```

### Manual Deployment
1. Build: `npm run build`
2. Set environment variables on hosting platform
3. Run migrations: `npm run db:push`
4. Start: `npm start`

## Security Considerations

- Passwords hashed with bcryptjs (12 salt rounds)
- JWT-based session management with NextAuth.js
- Protected API routes with authentication checks
- SQL injection prevention via Prisma parameterized queries
- CSRF protection via NextAuth.js
- Environment variables never committed to version control

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- **Email**: info@heavyhire.rw
- **Phone**: +250 (0) 788 123 456
- **Location**: Kigali, Rwanda

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment integration (Flutterwave, Pesapal)
- [ ] Advanced analytics dashboard
- [ ] Equipment calendar availability
- [ ] Direct messaging system
- [ ] Document verification
- [ ] Multi-language support
- [ ] AI-powered recommendations

---

**Built with ❤️ for East Africa**
