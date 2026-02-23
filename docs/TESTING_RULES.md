# Next.js 项目测试准则 (Testing Rules)

基于 Kimi Code CLI Python 项目的测试准则，为 Next.js 项目设计的测试规范。

---

## 1. 技术栈

| 类别 | 工具 |
|------|------|
| **测试框架** | [Vitest](https://vitest.dev/) (推荐) 或 Jest |
| **React 测试** | [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) |
| **DOM 断言** | [@testing-library/jest-dom](https://github.com/testing-library/jest-dom) |
| **E2E 测试** | [Playwright](https://playwright.dev/) (推荐) 或 Cypress |
| **API Mock** | [MSW](https://mswjs.io/) (Mock Service Worker) |
| **快照测试** | @vitest/snapshot 或 jest 内置 |

---

## 2. 测试文件命名规则

```bash
# ✅ 正确
src/components/Button.test.tsx
src/utils/helpers.test.ts
src/app/api/user/route.test.ts
tests/e2e/login.spec.ts

# ❌ 错误
src/components/button-test.tsx              # 不用 kebab-case
src/components/__tests__/button.ts         # 不放在 __tests__ 目录
src/tests/button.tsx                        # 不集中放 tests 目录
```

---

## 3. 目录结构

```
src/
├── components/
│   ├── Button.tsx
│   ├── Button.test.tsx              # 组件旁边放测试
│   └── Card/
│       ├── Card.tsx
│       └── Card.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
├── app/
│   └── api/
│       └── user/
│           ├── route.ts
│           └── route.test.ts        # API route 测试
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
└── test/                            # 测试配置和共享工具
    ├── setup.ts                     # vitest setup
    ├── fixtures/                    # 测试数据
    │   ├── users.ts
    │   └── posts.ts
    ├── mocks/                       # MSW mocks
    │   └── handlers.ts
    └── test-utils.tsx               # 自定义 render 包装

tests/                               # E2E 测试 (Playwright)
├── e2e/
│   ├── auth.spec.ts
│   └── checkout.spec.ts
└── fixtures/
```

---

## 4. 测试配置 (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',           // 模拟浏览器环境
    globals: true,                  // 使用全局 describe/test/expect
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## 5. 测试工具配置 (src/test/setup.ts)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 自动清理 DOM
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));
```

---

## 6. 组件测试规范

```typescript
// src/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  // 基础渲染测试
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // 事件处理测试
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 异步交互测试
  it('shows loading state during async action', async () => {
    const asyncAction = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<Button onClick={asyncAction}>Submit</Button>);
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());
  });

  // 快照测试 (谨慎使用)
  it('matches snapshot', () => {
    const { container } = render(<Button variant="primary">Save</Button>);
    expect(container).toMatchSnapshot();
  });
});
```

---

## 7. Hook 测试规范

```typescript
// src/hooks/useAuth.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuth', () => {
  it('returns user when authenticated', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveProperty('id');
  });
});
```

---

## 8. API Route 测试规范

```typescript
// src/app/api/user/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

// Mock 数据库
vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('/api/user', () => {
  describe('GET', () => {
    it('returns list of users', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('POST', () => {
    it('creates new user', async () => {
      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'POST',
        body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(201);
    });

    it('returns 400 for invalid data', async () => {
      const request = new NextRequest('http://localhost:3000/api/user', {
        method: 'POST',
        body: JSON.stringify({}), // 缺少必填字段
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });
});
```

---

## 9. E2E 测试规范 (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('user can login with valid credentials', async ({ page }) => {
    // Arrange
    await page.fill('[data-testid="email"]', 'user@example.com');
    await page.fill('[data-testid="password"]', 'password123');

    // Act
    await page.click('[data-testid="login-button"]');

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrong');
    await page.click('[data-testid="login-button"]');

    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});
```

---

## 10. 共享 Fixtures

```typescript
// src/test/fixtures/users.ts
export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
};

export const mockAdmin = {
  id: '2',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
};

// Factory 函数
export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
  ...mockUser,
  ...overrides,
});
```

---

## 11. MSW API Mock

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { mockUser } from '../fixtures/users';

export const handlers = [
  // GET /api/user
  http.get('/api/user', () => {
    return HttpResponse.json([mockUser]);
  }),

  // POST /api/user
  http.post('/api/user', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...mockUser, ...body }, { status: 201 });
  }),
];
```

---

## 12. package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "vitest run && playwright test"
  }
}
```

---

## 13. 关键原则总结

| 原则 | 说明 |
|------|------|
| **测试与源码同目录** | `Component.tsx` + `Component.test.tsx` |
| **使用 data-testid** | 为 E2E 测试添加稳定的定位标识 |
| **避免测试实现细节** | 测试行为而非结构（用 `getByRole` 而非 `getByClass`） |
| **Mock 外部依赖** | 数据库、API、第三方库 |
| **并行测试** | Vitest 默认并行，保持测试独立 |
| **覆盖率阈值** | 建议组件 80%+，工具函数 90%+ |

---

## 对比参考：Python vs Next.js

| 特性 | Python (Kimi CLI) | Next.js |
|------|-------------------|---------|
| **测试框架** | pytest + pytest-asyncio | Vitest |
| **快照测试** | inline_snapshot | vitest snapshot |
| **Mock** | unittest.mock | vi.fn() |
| **Fixtures** | pytest fixtures | 工厂函数 / setup.ts |
| **E2E** | subprocess 调用 CLI | Playwright |
| **异步测试** | async def | async/await |
| **文件命名** | test_*.py | *.test.tsx |
