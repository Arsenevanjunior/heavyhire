# HeavyHire Copilot Instructions

HeavyHire is a **Next.js-based equipment rental marketplace** connecting equipment owners with clients across East Africa (Rwanda-focused). The platform handles bookings, payments with escrow, dispute resolution, and multi-tenant relationships.

## Architecture Overview

### Data Model (Prisma)
The database uses **role-based multi-tenant architecture**:
- **Users** → OWNER (equipment providers) | CLIENT (renters) | ADMIN
- **OwnerProfile** → Business details, wallet balance, subscription tier (FREE/BASIC/PROFESSIONAL/ENTERPRISE)
- **Equipment** → Listings with category (CONSTRUCTION, AGRICULTURAL, HEAVY_TRANSPORT, REFRIGERATED), dynamic pricing (per day/week/month)
- **Booking** → Links client + equipment + payment + review + dispute, with states (PENDING → CONFIRMED → ACTIVE → COMPLETED)
- **Payment** → Escrow-based (HELD_ESCROW status) with PaymentMethod (MOBILE_MONEY/CARD/BANK_TRANSFER)

**Critical constraint**: One-to-one relationships (Booking→Payment, Booking→Review, Booking→Dispute) prevent multiple payment/review attempts per booking.

### Tech Stack
- **Next.js 14.1** (App Router): Route handlers at `/src/app/api/**/route.ts`
- **Prisma 5.10**: Schema at `/prisma/schema.prisma`; generate client after schema changes (`npm run db:push`)
- **PostgreSQL**: Production DB (see `DATABASE_URL` env var in `.env.local`)
- **Auth**: NextAuth 4.24 + bcryptjs (12 salt rounds) for password hashing
- **Forms**: React Hook Form + Zod validation
- **State**: Zustand for client-side state
- **UI**: Radix UI (headless components) + TailwindCSS with dynamic class merging
- **Utils**: date-fns (date handling), Recharts (analytics), Lucide React (icons)

## Development Workflow

### Database Operations
- **Schema changes**: Edit `/prisma/schema.prisma` → `npm run db:push`
- **Seed test data**: `npm run db:seed` (uses `/prisma/seed.ts` with bcryptjs for test passwords)
- **Inspect schema**: `npm run db:studio` (web UI for data inspection)
- **Generate Prisma client**: Auto-runs on `npm install` (postinstall script)

### API Development
All API routes use **Next.js Route Handlers** (`/src/app/api/**/route.ts`):
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // TBD: Centralized Prisma instance

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate with Zod
    // Check auth context (NextAuth session)
    // Query Prisma
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 500 });
  }
}
```

Routes accessing sensitive operations should:
1. Verify user session (NextAuth)
2. Check role-based permission (User.role + OwnerProfile for owners)
3. Use `select` in Prisma queries to avoid exposing passwordhashes

## Patterns & Conventions

### Validation
- **Input validation**: Use Zod schema in API routes before processing (see `/register` for auth example)
- **Unique constraints**: Always check existence before create (e.g., email uniqueness)
- **Enum usage**: BookingStatus, PaymentStatus, Role, EquipmentCategory are single-source-of-truth for state

### Authentication & Authorization
- **Password hashing**: 12 salt rounds (`bcrypt.hash(password, 12)`)
- **User creation**: If `role === "OWNER"`, auto-create OwnerProfile with country="Rwanda" + default tier
- **Role access**: OWNER endpoints require OwnerProfile lookup; ADMIN endpoints require Role.ADMIN

### Booking Workflow
Payment must be held in escrow (PaymentStatus.HELD_ESCROW) during active booking; only release post-completion or on dispute resolution. See Payment model for release/refund paths.

### Form Handling
Use React Hook Form + Zod pattern (already setup in package.json). Example:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(MyZodSchema),
});
```

### Styling
- **Tailwind**: Classes with `clsx` or `tailwind-merge` for dynamic switching
- **Components**: Radix UI primitives (Dialog, DropdownMenu, Select, Slider, Tabs, Toast) provide unstyled accessibility base
- **Icons**: Lucide React (e.g., `<IconName size={24} />`)

### Image Handling
Unsplash CDN pre-configured in `next.config.js` for domains: `images.unsplash.com`, `plus.unsplash.com`, `source.unsplash.com`, `i.imgur.com`. Use `next/image` for optimized loading.

## Key Files & References

| File | Purpose |
|------|---------|
| `/prisma/schema.prisma` | Database schema, enums (Role, BookingStatus, PaymentStatus) |
| `/prisma/seed.ts` | Test data initialization (admin, owner, client users) |
| `/src/app/api/auth/register/route.ts` | User registration (creates ownerProfile if OWNER) |
| `next.config.js` | Image remotePatterns, Next.js config |
| `package.json` | Dependencies, build/seed/studio commands |

## Common Tasks

**Adding a new API endpoint**: Create `/src/app/api/[resource]/route.ts` with NextRequest/NextResponse pattern.

**Creating a new data model**: Extend `/prisma/schema.prisma`, run `npm run db:push`, update seed.ts if needed.

**Accessing current user**: Retrieve session from NextAuth (pattern TBD in auth middleware).

**Querying with relationships**: Use Prisma `select` or `include` to load related records (e.g., `equipment.owner`, `booking.payment`).

**Handling escrow payments**: Query Payment by bookingId, ensure status workflow: PENDING → HELD_ESCROW → RELEASED/REFUNDED.

## Notes for AI Agents

- **Prisma post-generate**: After schema changes, always run migrations or pushes to keep client in sync
- **Rwanda context**: Default country is "Rwanda"; some enums (PaymentMethod) reflect regional payment systems
- **Subscription tiers**: Used to gate features; OwnerProfile.subscriptionTier determines capabilities
- **Error responses**: Use consistent `{ error: "Message" }` JSON responses with appropriate HTTP status codes
