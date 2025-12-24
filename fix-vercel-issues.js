#!/usr/bin/env node

/**
 * Quick Fix Script for Vercel Deployment Issues
 * This script implements the most critical fixes for "Failed to fetch data" errors
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Vercel Deployment Issues...\n');

// 1. Create URL helper
const urlHelperContent = `export const buildApiUrl = (path: string): string => {
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? \`https://\${process.env.VERCEL_URL}\` : 'http://localhost:3000');
    return new URL(path, baseUrl).toString();
  }
  return path;
};
`;

// Create lib directory if it doesn't exist
const libDir = path.join(process.cwd(), 'lib');
if (!fs.existsSync(libDir)) {
  fs.mkdirSync(libDir);
}

fs.writeFileSync(path.join(libDir, 'url-helper.ts'), urlHelperContent);
console.log('✅ Created lib/url-helper.ts');

// 2. Create health check endpoint
const healthCheckContent = `import { NextResponse } from "next/server";

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
`;

const healthApiDir = path.join(process.cwd(), 'app', 'api', 'health');
if (!fs.existsSync(healthApiDir)) {
  fs.mkdirSync(healthApiDir, { recursive: true });
}

fs.writeFileSync(path.join(healthApiDir, 'route.ts'), healthCheckContent);
console.log('✅ Created app/api/health/route.ts');

// 3. Update services/api.ts with proper URL construction
const apiServicePath = path.join(process.cwd(), 'services', 'api.ts');
if (fs.existsSync(apiServicePath)) {
  let apiContent = fs.readFileSync(apiServicePath, 'utf-8');
  
  // Add import for buildApiUrl
  if (!apiContent.includes('buildApiUrl')) {
    apiContent = `import { buildApiUrl } from '@/lib/url-helper';\n` + apiContent;
    
    // Replace fetch calls with buildApiUrl
    apiContent = apiContent.replace(
      /const response = await fetch\(\`\$\{baseUrl\}\/api\/posts\?\$\{params\}\`\)/g,
      'const response = await fetch(buildApiUrl(`/api/posts?${params}`))'
    );
    
    apiContent = apiContent.replace(
      /const response = await fetch\(\`\$\{baseUrl\}\/api\/posts\/\$\{postId\}\`\)/g,
      'const response = await fetch(buildApiUrl(`/api/posts/${postId}`))'
    );
    
    apiContent = apiContent.replace(
      /const response = await fetch\(\`\$\{baseUrl\}\/api\/tags\`\)/g,
      'const response = await fetch(buildApiUrl(`/api/tags`))'
    );
    
    // Remove the old getBaseUrl function and replace with buildApiUrl
    apiContent = apiContent.replace(
      /\/\/ 获取基础URL.*[\s\S]*?return 'http:\/\/localhost:3000';\s*\};/g,
      ''
    );
    
    // Update fetchPost function
    apiContent = apiContent.replace(
      /export const fetchPost = async \(postId: string\): Promise<Post> => \{\s*const baseUrl = getBaseUrl\(\);\s*const response = await fetch\(\`\$\{baseUrl\}\/api\/posts\/\$\{postId\}\`\);/g,
      'export const fetchPost = async (postId: string): Promise<Post> => {\n  const response = await fetch(buildApiUrl(`/api/posts/${postId}`));'
    );
    
    // Update other functions similarly
    const functionsToUpdate = [
      { name: 'fetchTags', path: '/api/tags' },
      { name: 'createPost', path: '/api/posts' },
      { name: 'updatePost', path: '/api/posts/${postId}' },
      { name: 'deletePost', path: '/api/posts/${postId}' }
    ];
    
    functionsToUpdate.forEach(func => {
      const regex = new RegExp(
        `export const ${func.name} = async \\([^)]+\\): Promise[^}]+const baseUrl = getBaseUrl\\(\\);[^}]+const response = await fetch\\(\\`\\$\\{baseUrl\\}\\${func.path.replace(/\$/g, '\\$')}\\`,`,
        'g'
      );
      
      const replacement = `export const ${func.name} = async ($1): Promise$2const response = await fetch(buildApiUrl(\`${func.path}\`),`;
      
      apiContent = apiContent.replace(regex, replacement);
    });
    
    fs.writeFileSync(apiServicePath, apiContent);
    console.log('✅ Updated services/api.ts with proper URL construction');
  }
}

// 4. Add error logging to API routes
const postsRoutePath = path.join(process.cwd(), 'app', 'api', 'posts', 'route.ts');
if (fs.existsSync(postsRoutePath)) {
  let routeContent = fs.readFileSync(postsRoutePath, 'utf-8');
  
  // Enhanced error logging
  if (!routeContent.includes('API Error Details')) {
    routeContent = routeContent.replace(
      /return NextResponse\.json\(\{ error: 'Failed to fetch posts' \}, \{ status: 500 \}\);/g,
      `console.error('API Error Details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        vercelUrl: process.env.VERCEL_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL
      });
      
      return NextResponse.json(\n        { \n          error: 'Failed to fetch posts',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, \n        { status: 500 }\n      );`
    );
    
    fs.writeFileSync(postsRoutePath, routeContent);
    console.log('✅ Enhanced error logging in app/api/posts/route.ts');
  }
}

// 5. Create environment configuration helper
const envConfigContent = `# Vercel Deployment Environment Configuration

## For Local Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

## For Production Deployment (Set in Vercel Dashboard)
# NEXT_PUBLIC_SITE_URL=https://your-domain.com

## Vercel Auto-sets these (don't add manually):
# VERCEL_URL=your-project.vercel.app
# VERCEL_ENV=production

## Important Notes:
1. NEXT_PUBLIC_ prefix makes variables available to client-side code
2. VERCEL_URL is automatically set by Vercel during deployment
3. Use the health check endpoint /api/health to verify configuration
4. Test with production build locally before deploying
`;

fs.writeFileSync(path.join(process.cwd(), 'vercel-env-config.md'), envConfigContent);
console.log('✅ Created vercel-env-config.md');

// 6. Create deployment test script
const testScriptContent = `#!/bin/bash

# Vercel Deployment Test Script

echo "🧪 Testing Vercel Deployment Configuration..."

# Test local production build
echo "Building production version locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "Starting production server..."
npm start &
SERVER_PID=$!

# Wait for server to start
sleep 3

echo "Testing API endpoints..."

# Test health endpoint
echo "Testing /api/health..."
curl -s http://localhost:3000/api/health | jq '.'

# Test posts endpoint
echo "Testing /api/posts..."
curl -s http://localhost:3000/api/posts | jq '.'

# Test tags endpoint
echo "Testing /api/tags..."
curl -s http://localhost:3000/api/tags | jq '.'

# Kill the server
kill $SERVER_PID

echo "✅ Local production tests completed"
echo "Next steps:"
echo "1. Commit these changes"
echo "2. Push to a preview branch"
echo "3. Test the preview deployment"
echo "4. Check Vercel Functions logs for any errors"
`;

fs.writeFileSync(path.join(process.cwd(), 'test-deployment.sh'), testScriptContent);
fs.chmodSync(path.join(process.cwd(), 'test-deployment.sh'), '755');
console.log('✅ Created test-deployment.sh');

console.log('\n🎉 Quick fixes applied!');
console.log('\nNext steps:');
console.log('1. Review the changes made by this script');
console.log('2. Run ./test-deployment.sh to test locally');
console.log('3. Check VERCEL_DEPLOYMENT_DEBUGGING.md for detailed debugging steps');
console.log('4. Deploy to preview branch and test');
console.log('5. Monitor Vercel Functions logs for errors');
console.log('\nKey files created/modified:');
console.log('- lib/url-helper.ts (new)');
console.log('- app/api/health/route.ts (new)');
console.log('- services/api.ts (updated)');
console.log('- app/api/posts/route.ts (updated)');
console.log('- vercel-env-config.md (new)');
console.log('- test-deployment.sh (new)');