#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Vercel Edge Config Setup Script');
console.log('=====================================\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '..', '.env.local');

if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local file not found. Creating one...');
  fs.writeFileSync(envLocalPath, '');
}

// Read current .env.local content
let envContent = fs.readFileSync(envLocalPath, 'utf8');

// Check if EDGE_CONFIG is already set
const edgeConfigMatch = envContent.match(/^EDGE_CONFIG=/m);

if (edgeConfigMatch) {
  console.log('✅ EDGE_CONFIG is already configured in .env.local');
  console.log('Current value:', envContent.match(/^EDGE_CONFIG=(.+)$/m)?.[1] || 'empty');
} else {
  console.log('📝 EDGE_CONFIG not found in .env.local');
  console.log('Please follow these steps:');
  console.log('1. Go to your Vercel dashboard');
  console.log('2. Navigate to your project');
  console.log('3. Go to "Storage" tab');
  console.log('4. Click on your Edge Config store');
  console.log('5. Go to "Settings" tab');
  console.log('6. Copy the "Connection String"');
  console.log('7. Paste it here when prompted:\n');
  
  // For now, let's add a placeholder
  envContent += '\n# Vercel Edge Config 配置\n# 从 Vercel 控制台获取这个值\nEDGE_CONFIG=\n';
  fs.writeFileSync(envLocalPath, envContent);
  console.log('✅ Added EDGE_CONFIG placeholder to .env.local');
  console.log('Please update it with your actual connection string from Vercel dashboard');
}

console.log('\n📋 Next Steps:');
console.log('1. Get your Edge Config connection string from Vercel dashboard');
console.log('2. Update EDGE_CONFIG in .env.local with the actual value');
console.log('3. Test the integration:');
console.log('   - Visit: http://localhost:3000/welcome');
console.log('   - API: http://localhost:3000/api/welcome');
console.log('   - Middleware: http://localhost:3000/welcome (should return JSON)');

console.log('\n🎯 Edge Config Store Details from your image:');
console.log('Store ID: ecfg_8pvlhgacvkcz7zaxen/7qdwapa9gj');
console.log('Current item: greeting = "hello world"');
console.log('Storage size: 26B/8kB');