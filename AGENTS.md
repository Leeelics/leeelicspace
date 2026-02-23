# AGENTS.md - leeelicspace

Guide for AI agents working on this Next.js 16 blog project.

## Quick Commands

```bash
# Development
npm run dev              # Start dev server on port 3002

# Build & Lint
npm run build            # Production build
npm run lint             # Check with Biome
npm run format           # Format with Biome (auto-fix)

# Testing
npx playwright test      # Run all E2E tests
npx playwright test e2e/blog.spec.ts:26    # Run single test by line
npx playwright test -g "导航栏"             # Run test by name pattern
npx playwright test --ui                   # Interactive UI mode
npx playwright test --reporter=list        # List format output

# KV Storage
npm run test:kv          # Test KV connection
npm run migrate:kv       # Migrate data to KV
```

## Project Structure

```
app/
  api/           # API routes (posts, tags, rss)
  [locale]/      # i18n routes (zh, en)
    page.tsx     # Home with posts list
    posts/[id]/  # Post detail
    dashboard/   # Admin panel (client components)
components/
  ui/            # shadcn/ui components
  dashboard/     # Admin-specific components
lib/
  auth.ts        # Auth utilities
  errors.ts      # Error classes & handling
  validation.ts  # Zod schemas
  rate-limit.ts  # Rate limiting
types/
  index.ts       # Shared TypeScript types
```

## Code Style

### Imports (Auto-organized by Biome)

Order: React/Next → Third-party → `@/` aliases → Types

```typescript
import { useState } from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types"
```

### Formatting

- **Indent**: 2 spaces (Biome enforced)
- **Quotes**: Double quotes
- **Semicolons**: Always
- **Trailing commas**: ES5 compatible
- **Line width**: 80 characters

### TypeScript

```typescript
// Use strict types - no 'any'
interface Props {
  post: Post
  onDelete?: (id: string) => void
}

// Type API responses
const response = await fetch(url)
const data: Post[] = await response.json()

// Use Zod for validation
const schema = z.object({
  title: z.string().min(1),
  content: z.string()
})
```

### Naming

- **Components**: PascalCase (`ArticleCard.tsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (`API_SECRET`)
- **Types/Interfaces**: PascalCase (`Post`, `UserConfig`)
- **Files**: kebab-case for utilities, PascalCase for components

### Error Handling

```typescript
import { createErrorResponse, ValidationError } from "@/lib/errors"
import { logger } from "@/lib/logger"

// API routes: use error classes
try {
  const result = schema.parse(data)
} catch (error) {
  logger.error("Validation failed", { error })
  return createErrorResponse(
    new ValidationError("Invalid input", { errors: error.format() }),
    request
  )
}

// Client components: handle gracefully
try {
  await createPost(data)
} catch (error) {
  toast.error(error.message)
}
```

### Component Patterns

```typescript
// Use React.FC for simple components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export const Button: React.FC<ButtonProps> = ({ variant = "default", ...props }) => {
  return <button className={cn(styles[variant])} {...props} />
}

// Forward refs for polymorphic components
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("base-styles", className)} {...props} />
  )
)
Button.displayName = "Button"
```

### Styling (Tailwind + shadcn)

```typescript
import { cn } from "@/lib/utils"

// Use cn() for conditional classes
<div className={cn(
  "base-styles",
  isActive && "active-styles",
  className
)}>

// Theme tokens only (Slate + Indigo)
// bg-background, text-foreground, border-border
// text-primary, bg-primary, text-muted-foreground
```

### API Routes

```typescript
import { type NextRequest } from "next/server"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // Always check rate limit first
  const rateCheck = await checkRateLimit(request, RATE_LIMITS.read)
  if (!rateCheck.allowed) {
    return createErrorResponse(new UnauthorizedError("Rate limit exceeded"), request)
  }
  
  // Validate with Zod
  const result = validatePagination(Object.fromEntries(request.nextUrl.searchParams))
  if (!result.success) {
    return createErrorResponse(new ValidationError("Invalid params"), request)
  }
  
  return createSuccessResponse({ data })
}
```

### Authentication

```typescript
import { isAuthenticated } from "@/lib/auth"

// API routes
if (!isAuthenticated(request)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

// Client-side auth check
const secret = localStorage.getItem("admin_secret")
if (!secret) router.push(`/${locale}/dashboard/login`)
```

### i18n (next-intl)

```typescript
// Server components
const t = await getTranslations()
<h1>{t("nav.home")}</h1>

// Client components
"use client"
import { useTranslations } from "next-intl"
const t = useTranslations()
```

## Environment Variables

Required in `.env.local`:
```
API_SECRET=your-admin-secret-here    # Min 16 chars, production only
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19 + React Compiler
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui + Radix Themes
- **Linting**: Biome (replaces ESLint + Prettier)
- **Testing**: Playwright (E2E)
- **Storage**: Vercel KV (Redis) / Memory (dev)
- **Auth**: Simple API Secret (admin only)

## Key Files

- `biome.json` - Code style configuration
- `playwright.config.ts` - Test configuration
- `app/globals.css` - Theme tokens and base styles
- `lib/errors.ts` - Error classes and response helpers
- `lib/validation.ts` - Zod validation schemas
- `components/ui/*` - shadcn/ui components (use these)

## Notes

- Dashboard routes use `"use client"` with SWR for data fetching
- API routes use Zod validation + custom error handling
- All API routes have rate limiting (read: 100/min, write: 10/min)
- E2E screenshots and test results are gitignored
- Use `cn()` from `@/lib/utils` for class merging
- Always handle errors gracefully with user-friendly messages
