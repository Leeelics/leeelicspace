# Vercel Edge Config Integration Guide

This guide explains how to use the Vercel Edge Config integration that was just set up in your project.

## What is Edge Config?

Edge Config is a data store that allows you to read data at the edge without cold starts. It's perfect for feature flags, A/B testing, and configuration data that needs to be available instantly.

## Setup Summary

Based on your image, you have:

- **Edge Config Store ID**: `ecfg_8pvlhgacvkcz7zaxen/7qdwapa9gj`
- **Current Configuration**: `{"greeting": "hello world"}`
- **Storage Usage**: 26B/8kB

## Files Added/Modified

### New Files

- `middleware.ts` - Next.js middleware that intercepts `/welcome` requests
- `lib/edge-config.ts` - Utility functions for Edge Config operations
- `app/welcome/page.tsx` - Demo page showing Edge Config usage
- `app/api/welcome/route.ts` - API endpoint returning Edge Config data
- `scripts/setup-edge-config.js` - Setup script for Edge Config

### Modified Files

- `package.json` - Added `@vercel/edge-config` dependency
- `next.config.ts` - Added `experimental.allowMiddlewareResponseBody: true`
- `.env.local` - Added `EDGE_CONFIG` placeholder
- `.env.example` - Added `EDGE_CONFIG` configuration example

## Configuration

### 1. Get Your Connection String

Go to your Vercel dashboard:

1. Navigate to your project
2. Go to "Storage" tab
3. Click on your Edge Config store
4. Go to "Settings" tab
5. Copy the "Connection String"

### 2. Update Environment Variables

Add the connection string to your `.env.local` file:

```env
EDGE_CONFIG=your-connection-string-here
```

**Note**: The connection string typically looks like:

```
https://edge-config.vercel.com/ecfg_8pvlhgacvkcz7zaxen/7qdwapa9gj?token=your-token-here
```

You can get this from your Vercel dashboard under Storage > Edge Config > Settings > Connection String.

### 3. Test the Integration

Start your development server:

```bash
npm run dev
```

Test the following endpoints:

- **Page**: <http://localhost:3000/welcome> - Shows the greeting in a nice UI
- **API**: <http://localhost:3000/api/welcome> - Returns JSON with greeting
- **Middleware**: <http://localhost:3000/welcome> - Should return JSON response directly

## Usage Examples

### Basic Usage

```typescript
import { get } from '@vercel/edge-config';

// Get a single item
const greeting = await get('greeting');
```

### Using the Utility Function

```typescript
import { getGreeting } from '@/lib/edge-config';

const greeting = await getGreeting();
```

### Adding More Configuration Items

You can add more items to your Edge Config through the Vercel dashboard:

1. Go to your Edge Config store
2. Click on "Items" tab
3. Add new key-value pairs
4. Update `lib/edge-config.ts` to include new types and functions

## Edge Config Limits

- **Free Tier**: 64KB total storage
- **Pro Tier**: 1MB total storage
- **Read Operations**: 10,000 reads/month (free), 1M reads/month (pro)
- **Write Operations**: 100 writes/month (free), 10,000 writes/month (pro)

## Best Practices

1. **Use for Configuration**: Store feature flags, A/B test settings, and configuration data
2. **Avoid Large Data**: Keep individual items small (under 8KB)
3. **Cache Appropriately**: Edge Config is already cached at the edge
4. **Monitor Usage**: Keep track of your read/write operations
5. **Version Control**: Document important configuration changes

## Troubleshooting

### Common Issues

1. **"Greeting not found" error**
   - Check if `EDGE_CONFIG` is set correctly in your environment
   - Verify the Edge Config store contains the `greeting` item
   - Check Vercel dashboard for the correct connection string

2. **Middleware not working**
   - Ensure `experimental.allowMiddlewareResponseBody: true` is set in `next.config.ts`
   - Check that middleware file is in the root directory
   - Verify the matcher pattern is correct

3. **Connection issues**
   - Verify your Edge Config connection string is correct
   - Check that your Vercel project has access to the Edge Config store
   - Ensure the Edge Config store is in the same Vercel team/project

### Debug Steps

1. Run the setup script:

   ```bash
   node scripts/setup-edge-config.js
   ```

2. Check environment variables:

   ```bash
   grep EDGE_CONFIG .env.local
   ```

3. Test Edge Config directly:

   ```bash
   curl http://localhost:3000/api/welcome
   ```

## Additional Resources

- [Vercel Edge Config Documentation](https://vercel.com/docs/storage/edge-config)
- [@vercel/edge-config NPM Package](https://www.npmjs.com/package/@vercel/edge-config)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Support

If you encounter issues:

1. Check Vercel Edge Config dashboard for store status
2. Verify your connection string and permissions
3. Review the troubleshooting section above
4. Check Vercel's status page for any service outages
