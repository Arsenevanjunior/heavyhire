# Contributing to HeavyHire

We welcome contributions! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit with clear messages: `git commit -m "Add feature description"`
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
npm install
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Use ESLint and Prettier (configured in project)

## Testing

```bash
npm run test
```

## Creating Components

Store in `src/components/` with proper TypeScript types:

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export function MyComponent({ title, onClick }: ComponentProps) {
  return <button onClick={onClick}>{title}</button>;
}
```

## API Endpoints

Place API routes in `src/app/api/` following Next.js conventions:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Handle request
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error message" }, { status: 500 });
  }
}
```

## Database Changes

1. Update `prisma/schema.prisma`
2. Generate migration: `npm run db:push`
3. Test locally: `npm run db:seed`
4. Commit schema changes

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure no console errors/warnings
4. Provide clear PR description
5. Link related issues

## Issue Reporting

Include:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable
- Environment details

## Code Review

All submissions require code review. Be open to feedback and suggestions!

## Questions?

Open an issue or reach out to the maintainers.
