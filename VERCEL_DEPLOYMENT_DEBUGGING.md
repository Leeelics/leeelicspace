# Vercel Deployment Debugging Checklist for Next.js

## 🚨 Critical Issues Identified in Your Codebase

Based on my analysis of your Next.js blog application, here are the most likely causes of "Failed to fetch data" errors in production:

### 1. **Inconsistent URL Construction**
**Problem**: Mixing relative and absolute URLs in API calls
- **File**: `services/api.ts` line 21 uses relative URL `/api/posts?${params}`
- **File**: `services/api.ts` lines 51, 61, 71, 87, 103 use absolute URLs with `getBaseUrl()`
- **File**: `app/page.tsx` lines 17, 23 use absolute URLs with manual construction

**Solution**: Standardize URL construction approach.

### 2. **Environment Variable Issues**
**Problem**: Missing or incorrect environment variables in production
- `NEXT_PUBLIC_SITE_URL` might not be set correctly
- `VERCEL_URL` behavior different in production vs preview deployments

### 3. **Serverless Environment Limitations**
**Problem**: Using in-memory data storage (`PostStore` class) that doesn't persist across serverless function invocations
- **File**: `app/api/data.ts` - Static in-memory storage
- **Issue**: Data resets between function calls in serverless environment

---

## 📋 Comprehensive Debugging Checklist

### Phase 1: Environment Configuration

#### ✅ Environment Variables Check
```bash
# Check your Vercel dashboard
# Project Settings → Environment Variables
```

**Required Variables:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # For production
# OR leave unset to use VERCEL_URL automatically
```

**Debugging Steps:**
1. **Vercel Dashboard Check**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Ensure `NEXT_PUBLIC_SITE_URL` is set correctly for production
   - Check if you have different values for Production, Preview, and Development environments

2. **Add Environment Variable Logging** (Temporary):
```typescript
// Add this to your API routes for debugging
console.log('Environment Debug:', {
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  timestamp: new Date().toISOString()
});
```

#### ✅ URL Construction Standardization

**Current Issue**: Mixed approaches in your codebase

**Fix**: Create a unified URL helper function:

```typescript
// lib/url-helper.ts
export const buildApiUrl = (path: string): string => {
  // Always use absolute URLs in server components
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    return new URL(path, baseUrl).toString();
  }
  
  // Client-side can use relative URLs
  return path;
};
```

**Update your services/api.ts**:
```typescript
import { buildApiUrl } from '@/lib/url-helper';

// Update all fetch calls to use buildApiUrl
export const fetchPosts = async (/* ... */): Promise<PostResponse> => {
  const params = new URLSearchParams({ /* ... */ });
  const response = await fetch(buildApiUrl(`/api/posts?${params}`));
  // ... rest of function
};
```

### Phase 2: Serverless Environment Issues

#### ✅ Data Persistence Problem

**Critical Issue**: Your `PostStore` class uses in-memory storage that won't persist in serverless environment.

**Current Code** (app/api/data.ts):
```typescript
// This data will be lost between function invocations!
class PostStore {
  private posts: Post[] = [];  // ❌ In-memory storage
  private initialized = false;
}
```

**Solutions** (Choose one):

**Option 1: Vercel KV (Recommended)**
```typescript
// Install: npm install @vercel/kv
import { kv } from '@vercel/kv';

class PostStore {
  private readonly STORAGE_KEY = 'blog_posts';
  
  async getAllPosts() {
    return await kv.get<Post[]>(this.STORAGE_KEY) || [];
  }
  
  async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) {
    const posts = await this.getAllPosts();
    const newPost = { /* ... */ };
    posts.push(newPost);
    await kv.set(this.STORAGE_KEY, posts);
    return newPost;
  }
}
```

**Option 2: File-based Storage** (For simple deployments)
```typescript
import fs from 'fs/promises';
import path from 'path';

class PostStore {
  private readonly DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');
  
  async getAllPosts() {
    try {
      const data = await fs.readFile(this.DATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}
```

**Option 3: PostgreSQL with Vercel Postgres**
```typescript
// Install: npm install @vercel/postgres
import { sql } from '@vercel/postgres';

// Create table in Vercel Postgres dashboard
// Then use SQL queries for data persistence
```

### Phase 3: Error Handling & Logging

#### ✅ Enhanced Error Logging

**Update your API routes** to include detailed error information:

```typescript
// app/api/posts/route.ts
export async function GET(request: NextRequest) {
  try {
    // ... existing logic
  } catch (error) {
    console.error('API Error Details:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}
```

#### ✅ Add Vercel Functions Logging

**Enable Vercel Functions Logs**:
1. Go to Vercel Dashboard → Your Project → Functions
2. Check the logs for your API routes
3. Look for any error messages or timeouts

### Phase 4: Testing & Verification

#### ✅ Local Production Testing

**Test locally with production build**:
```bash
# Build and start production server
npm run build
npm start

# Test all API endpoints
curl http://localhost:3000/api/posts
curl http://localhost:3000/api/tags
curl http://localhost:3000/api/posts/some-post-id
```

#### ✅ Vercel Preview Deployment Testing

1. **Create a preview deployment**:
```bash
# Push to a branch (not main)
git checkout -b test-deployment
git push origin test-deployment
```

2. **Test the preview URL**:
   - Check Vercel dashboard for preview deployment URL
   - Test all API endpoints on the preview URL
   - Check browser console for any CORS or fetch errors

#### ✅ Add Health Check Endpoint

Create a health check endpoint to verify deployment:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: {
      node_env: process.env.NODE_ENV,
      vercel_url: process.env.VERCEL_URL,
      site_url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    urls: {
      current: process.env.VERCEL_URL || 'localhost',
      site: process.env.NEXT_PUBLIC_SITE_URL || 'not set'
    }
  });
}
```

### Phase 5: Common Vercel-Specific Issues

#### ✅ Function Timeout Issues

**Check for long-running operations**:
- Vercel functions have a 10-second timeout (hobby plan)
- Your `PostStore.initialize()` might take too long with large datasets

**Solution**: Add caching or optimize initialization:
```typescript
class PostStore {
  private initializationPromise: Promise<void> | null = null;
  
  async initialize() {
    if (this.initialized) return;
    
    // Prevent multiple simultaneous initializations
    if (!this.initializationPromise) {
      this.initializationPromise = this.doInitialize();
    }
    
    await this.initializationPromise;
  }
  
  private async doInitialize() {
    // ... initialization logic
    this.initialized = true;
  }
}
```

#### ✅ Cold Start Issues

**Problem**: First request after deployment might fail due to cold starts

**Solution**: Add retry logic in your frontend:
```typescript
// services/api.ts
const fetchWithRetry = async (url: string, options?: RequestInit, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      // If it's a server error and not the last retry, wait and retry
      if (response.status >= 500 && i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};
```

#### ✅ CORS Issues

**Add CORS headers to API routes**:
```typescript
// Add to your API route handlers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS requests
if (request.method === 'OPTIONS') {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Add to all responses
return NextResponse.json(data, { headers: corsHeaders });
```

---

## 🔧 Quick Fix Implementation

### Step 1: Fix URL Construction
Create `lib/url-helper.ts`:
```typescript
export const buildApiUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    return new URL(path, baseUrl).toString();
  }
  return path;
};
```

### Step 2: Update services/api.ts
Replace all fetch calls with `buildApiUrl()` wrapper.

### Step 3: Add Environment Logging
Add temporary logging to debug environment issues.

### Step 4: Deploy and Monitor
1. Deploy to preview branch
2. Check Vercel Functions logs
3. Test health check endpoint: `/api/health`
4. Monitor browser console for errors

---

## 📊 Monitoring & Debugging Tools

### Vercel Dashboard
- **Functions Logs**: Real-time function execution logs
- **Analytics**: Performance metrics and error rates
- **Environment Variables**: Configuration management

### Browser DevTools
- **Network Tab**: Check API response status and timing
- **Console**: JavaScript errors and network failures
- **Application Tab**: Local storage and cookies

### Command Line Tools
```bash
# Check Vercel logs
vercel logs your-project-name.vercel.app

# Deploy with debug info
vercel --debug
```

---

## 🎯 Summary of Most Likely Issues

1. **Inconsistent URL construction** causing fetch failures
2. **In-memory data storage** not persisting in serverless environment
3. **Missing environment variables** in production
4. **Cold start delays** causing timeout errors

**Start with**: URL standardization and environment variable debugging, then address data persistence if needed.