# Vercel KV Deployment Guide

## 🚀 Overview

This guide explains how to deploy your Next.js blog with Vercel KV (Redis) storage to fix the read-only file system issues in Vercel's serverless environment.

## 📋 Prerequisites

- Vercel account
- Your Next.js blog application
- Basic understanding of environment variables

## 🔧 Step-by-Step Deployment

### Step 1: Set Up Vercel KV

1. **Go to Vercel Dashboard**
   - Navigate to [vercel.com](https://vercel.com) and log in
   - Select your project or create a new one

2. **Enable Vercel KV**
   - Go to your project dashboard
   - Click on the "Storage" tab in the left sidebar
   - Click "Create Database"
   - Select "KV" (Redis)
   - Choose a name (e.g., "blog-storage")
   - Select your region (choose closest to your target audience)
   - Click "Create"

3. **Connect KV to Your Project**
   - Vercel will automatically create the necessary environment variables
   - You'll see `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.

### Step 2: Configure Environment Variables

In your Vercel project settings, add these environment variables:

```bash
# Authentication (required for write operations)
API_SECRET=your-secure-secret-key-here

# Site URL (optional - for custom domains)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Node environment
NODE_ENV=production
```

**Important**: Replace `your-secure-secret-key-here` with a strong, unique secret key.

### Step 3: Update Your Local Environment

Create or update your `.env.local` file for local development:

```bash
# Copy from Vercel KV dashboard
KV_URL=your-kv-url-from-vercel
KV_REST_API_URL=your-kv-rest-api-url-from-vercel
KV_REST_API_TOKEN=your-kv-rest-api-token-from-vercel
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token-from-vercel

# Authentication
API_SECRET=your-secure-secret-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 4: Deploy to Vercel

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Vercel will automatically deploy** when you push to your main branch
3. **Wait for deployment to complete**

### Step 5: Verify Deployment

After deployment, test these endpoints:

#### ✅ Health Check
```bash
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "environment": {
    "node_env": "production",
    "vercel_env": "production",
    "vercel_url": "your-app.vercel.app"
  },
  "storage": {
    "type": "vercel-kv",
    "writable": true,
    "post_count": 4,
    "initialized": true
  },
  "auth": {
    "has_api_secret": true,
    "using_default_secret": false
  }
}
```

#### ✅ Get All Posts
```bash
curl https://your-app.vercel.app/api/posts
```

#### ✅ Get All Tags
```bash
curl https://your-app.vercel.app/api/tags
```

#### ✅ Create a Test Post (requires authentication)
```bash
curl -X POST https://your-app.vercel.app/api/posts \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: your-secure-secret-key-here" \
  -d '{
    "title": "Test Post",
    "content": "This is a test post to verify KV storage is working.",
    "tags": ["test", "verification"]
  }'
```

## 🔐 Authentication Methods

The API supports multiple authentication methods:

### 1. Header Authentication (Recommended)
```bash
curl -H "X-API-Secret: your-secure-secret-key-here" \
  https://your-app.vercel.app/api/posts
```

### 2. Query Parameter Authentication
```bash
curl https://your-app.vercel.app/api/posts?secret=your-secure-secret-key-here
```

### 3. Body Authentication (POST/PUT requests only)
```json
{
  "secret": "your-secure-secret-key-here",
  "title": "My Post",
  "content": "Post content",
  "tags": ["tag1", "tag2"]
}
```

## 🛠️ Troubleshooting

### Issue 1: "Failed to fetch data: posts=401, tags=401"

**Cause**: Authentication is required but not provided.

**Solution**: 
- For read operations: No authentication needed
- For write operations: Include your API secret

### Issue 2: "KV storage not working"

**Cause**: Environment variables not set correctly.

**Solution**:
1. Check Vercel KV is properly connected to your project
2. Verify environment variables in Vercel dashboard
3. Check health endpoint for storage status

### Issue 3: "EROFS: read-only file system"

**Cause**: Still using file-based storage.

**Solution**: Ensure you're using the updated API routes that import from `kv-data.ts` instead of `data.ts`.

### Issue 4: "Post not found after creation"

**Cause**: KV storage might not be initialized.

**Solution**: 
1. Check health endpoint shows "initialized": true
2. If not, the first API call will initialize it automatically

## 📊 Monitoring

### Health Check Endpoint
Monitor your deployment with the health check endpoint:
```bash
curl https://your-app.vercel.app/api/health
```

### Key Metrics to Monitor
- `storage.type`: Should be "vercel-kv"
- `storage.writable`: Should be true
- `storage.initialized`: Should be true
- `storage.post_count`: Number of posts in storage
- `auth.has_api_secret`: Should be true in production

## 🔒 Security Best Practices

1. **Use Strong API Secrets**: Generate a long, random string for `API_SECRET`
2. **Rotate Secrets Regularly**: Change your API secret periodically
3. **Use Header Authentication**: More secure than query parameters
4. **Enable HTTPS**: Vercel provides SSL automatically
5. **Monitor Access Logs**: Check for unauthorized access attempts

## 🔄 Migration from File Storage

If you have existing data in file storage:

1. **Export existing data** (if possible)
2. **Deploy with KV storage**
3. **Import data** using the API endpoints
4. **Verify data integrity**

## 📚 Additional Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)

## 🆘 Support

If you encounter issues:

1. Check the health endpoint first
2. Review Vercel function logs
3. Verify environment variables
4. Test authentication with curl commands above
5. Check KV storage quota and limits

---

**Success Indicators**:
- ✅ Health check shows "status": "healthy"
- ✅ Storage type shows "vercel-kv"
- ✅ You can create posts with authentication
- ✅ Posts persist between deployments
- ✅ No more "read-only file system" errors