# AGENTS.md - leeelicspace

Guide for AI agents working on this Next.js 16 blog project.

## Quick Commands

```bash
# Development
npm run dev              # Start dev server on port 3002

# Build & Lint
npm run build            # Production build
npm run lint             # Check with Biome (auto-fix with --write)
npm run format           # Format with Biome

# Testing (Playwright E2E)
npx playwright test                      # Run all E2E tests
npx playwright test e2e/blog.spec.ts:26  # Run single test by line
npx playwright test -g "导航栏"           # Run test by name pattern
npx playwright test --ui                 # Interactive UI mode

# KV Storage
npm run test:kv          # Test KV connection
npm run migrate:kv       # Migrate data to KV
```

## Project Standards

### Version Management
- **Format**: MAJOR.MINOR.PATCH (e.g., 0.68.0)
- **PATCH**: Always 0, never changes
- **MINOR**: Bump on any change (feature, fix, docs, style)
- **MAJOR**: Only explicit manual decision
- **Commit Convention**: `<type>(<scope>): <subject>`
  - Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
  - Rules: Imperative mood, lowercase, no trailing period
  - Example: `feat(auth): add OAuth login`
  - See [docs/VERSIONING_RULES.md](docs/VERSIONING_RULES.md)

### Testing Rules
- **Framework**: Playwright for E2E
- **Location**: Test files co-located with source (`Component.tsx` + `Component.test.tsx`)
- **Naming**: `*.test.ts` for unit, `*.spec.ts` for E2E in `e2e/`
- **Selectors**: Use `data-testid` for E2E, avoid implementation details
- **Mocking**: Use MSW for API mocks
- See [docs/TESTING_RULES.md](docs/TESTING_RULES.md)

## Project Structure

```
app/
  api/              # API routes with Zod validation
  [locale]/         # i18n routes (zh, en)
    page.tsx        # Home with posts list
    posts/[id]/     # Post detail
    dashboard/      # Admin panel ("use client")
components/
  ui/               # shadcn/ui components
lib/
  auth.ts           # API_SECRET auth
  errors.ts         # Error classes
  validation.ts     # Zod schemas
  rate-limit.ts     # Rate limiting (100/min read, 10/min write)
types/
  index.ts          # TypeScript types
```

## Code Style

### Imports (Auto-organized by Biome)

Order: React/Next → Third-party → `@/` → Types

```typescript
import { useState } from "react"
import Link from "next/link"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Post } from "@/types"
```

### Formatting (biome.json)

- Indent: 2 spaces
- Quotes: Double
- Semicolons: Always
- Line width: 80 chars
- Organize imports: On

### TypeScript

```typescript
// Strict types - no 'any'
interface Props {
  post: Post
  onDelete?: (id: string) => void
}

// Zod validation
const schema = z.object({
  title: z.string().min(1),
  content: z.string()
})
```

### Naming

- Components: PascalCase (`ArticleCard.tsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE
- Types: PascalCase
- Files: kebab-case (utils), PascalCase (components)

### Error Handling

```typescript
import { createErrorResponse, ValidationError } from "@/lib/errors"
import { logger } from "@/lib/logger"

// API: Use error classes
try {
  const result = schema.parse(data)
} catch (error) {
  logger.error("Validation failed", { error })
  return createErrorResponse(
    new ValidationError("Invalid input", { errors: error.format() }),
    request
  )
}

// Client: Handle gracefully
try {
  await createPost(data)
} catch (error) {
  toast.error(error.message)
}
```

### Components

```typescript
// Simple: React.FC
interface Props { variant?: "default" | "outline" }
export const Button: React.FC<Props> = ({ variant = "default", ...props }) => (
  <button className={cn(styles[variant])} {...props} />
)

// Polymorphic: forwardRef
const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, ...props }, ref) => (
    <button ref={ref} className={cn("base", className)} {...props} />
  )
)
Button.displayName = "Button"
```

### Styling (Tailwind + shadcn)

```typescript
import { cn } from "@/lib/utils"

// Use cn() for conditional classes
<div className={cn("base", isActive && "active", className)}>

// Theme tokens (Slate + Indigo)
// bg-background, text-foreground, border-border
// text-primary, bg-primary, text-muted-foreground
```

### API Routes

```typescript
import { type NextRequest } from "next/server"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // Rate limit first
  const rateCheck = await checkRateLimit(request, RATE_LIMITS.read)
  if (!rateCheck.allowed) {
    return createErrorResponse(new UnauthorizedError("Rate limit exceeded"), request)
  }
  
  // Zod validation
  const result = validatePagination(Object.fromEntries(request.nextUrl.searchParams))
  if (!result.success) {
    return createErrorResponse(new ValidationError("Invalid params"), request)
  }
  
  return createSuccessResponse({ data })
}
```

### Auth & i18n

```typescript
// API auth
import { isAuthenticated } from "@/lib/auth"
if (!isAuthenticated(request)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

// Client auth
const secret = localStorage.getItem("admin_secret")
if (!secret) router.push(`/${locale}/dashboard/login`)

// i18n Server
const t = await getTranslations()
// i18n Client
"use client"
const t = useTranslations()
```

## Tech Stack

- **Framework**: Next.js 16 + App Router
- **Runtime**: React 19 + React Compiler
- **Language**: TypeScript 5 (strict)
- **Styling**: Tailwind v4 + shadcn/ui + Radix Themes
- **Linting**: Biome
- **Testing**: Playwright (E2E)
- **Storage**: Vercel KV / Memory
- **Auth**: API_SECRET

## Notes

- Dashboard: `"use client"` + SWR
- API: Zod validation + custom errors
- Rate limits: 100/min read, 10/min write
- E2E screenshots: gitignored
- Use `cn()` for class merging
- Graceful error handling always
