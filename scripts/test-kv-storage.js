#!/usr/bin/env node

/**
 * Test script for Vercel KV storage
 * Run this to verify your KV storage is working correctly
 */

const { kv } = require('@vercel/kv');

async function testKVStorage() {
  console.log('🧪 Testing Vercel KV Storage...\n');

  try {
    // Test 1: Basic write/read
    console.log('1️⃣ Testing basic write/read...');
    const testKey = 'test:connection';
    const testValue = { 
      message: 'Hello from KV storage!', 
      timestamp: new Date().toISOString(),
      random: Math.random()
    };
    
    await kv.set(testKey, testValue);
    const retrieved = await kv.get(testKey);
    await kv.del(testKey);
    
    if (JSON.stringify(retrieved) === JSON.stringify(testValue)) {
      console.log('✅ Basic write/read test passed');
    } else {
      console.log('❌ Basic write/read test failed');
      console.log('Expected:', testValue);
      console.log('Got:', retrieved);
    }

    // Test 2: Blog data structure
    console.log('\n2️⃣ Testing blog data structure...');
    const postsKey = 'blog:posts';
    const samplePosts = [
      {
        id: 'test1',
        title: 'Test Post 1',
        content: 'This is a test post',
        tags: ['test', 'sample'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'test2',
        title: 'Test Post 2',
        content: 'Another test post',
        tags: ['test', 'demo'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    
    await kv.set(postsKey, samplePosts);
    const retrievedPosts = await kv.get(postsKey);
    
    if (Array.isArray(retrievedPosts) && retrievedPosts.length === 2) {
      console.log('✅ Blog data structure test passed');
      console.log(`   Found ${retrievedPosts.length} posts`);
    } else {
      console.log('❌ Blog data structure test failed');
      console.log('Retrieved:', retrievedPosts);
    }

    // Test 3: Tags extraction
    console.log('\n3️⃣ Testing tags extraction...');
    if (retrievedPosts) {
      const tags = new Set();
      retrievedPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
      });
      console.log(`✅ Found ${tags.size} unique tags:`, Array.from(tags));
    }

    // Test 4: Data persistence
    console.log('\n4️⃣ Testing data persistence...');
    const persistenceKey = 'blog:persistence-test';
    const persistenceData = { test: 'persistence', time: Date.now() };
    
    await kv.set(persistenceKey, persistenceData);
    const firstRead = await kv.get(persistenceKey);
    
    // Wait a moment and read again
    await new Promise(resolve => setTimeout(resolve, 1000));
    const secondRead = await kv.get(persistenceKey);
    
    await kv.del(persistenceKey);
    
    if (JSON.stringify(firstRead) === JSON.stringify(secondRead)) {
      console.log('✅ Data persistence test passed');
    } else {
      console.log('❌ Data persistence test failed');
    }

    // Test 5: Error handling
    console.log('\n5️⃣ Testing error handling...');
    try {
      const nonExistent = await kv.get('non:existent:key');
      if (nonExistent === null) {
        console.log('✅ Non-existent key returns null as expected');
      } else {
        console.log('❌ Non-existent key should return null, got:', nonExistent);
      }
    } catch (error) {
      console.log('❌ Error handling test failed:', error.message);
    }

    console.log('\n🎉 KV Storage testing completed!');
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await kv.del(postsKey);
    console.log('✅ Cleanup completed');

  } catch (error) {
    console.error('❌ KV Storage test failed:', error);
    console.error('Error details:', error.message);
    
    if (error.message.includes('KV_URL')) {
      console.log('\n💡 Make sure you have set up your KV environment variables:');
      console.log('   KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN');
      console.log('   Check your Vercel KV dashboard for the correct values.');
    }
  }
}

// Run the test
testKVStorage().catch(console.error);