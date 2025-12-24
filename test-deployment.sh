#!/bin/bash

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