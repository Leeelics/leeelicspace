#!/usr/bin/env node

/**
 * Migration script to transfer data from file storage to KV storage
 * Run this if you have existing data that needs to be migrated
 */

const fs = require("node:fs").promises;
const path = require("node:path");
const { kv } = require("@vercel/kv");

async function migrateFromFileToKV() {
  console.log("🔄 Starting migration from file storage to KV storage...\n");

  try {
    // Step 1: Check for existing file storage
    const filePath = path.join(process.cwd(), "tmp", "posts.json");
    console.log("1️⃣ Checking for existing file storage...");

    let existingData = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      existingData = JSON.parse(fileContent);
      console.log(`✅ Found ${existingData.length} posts in file storage`);
    } catch (error) {
      console.log(
        "ℹ️  No existing file storage found or error reading file:",
        error.message,
      );
      console.log("   This is normal if you haven't used file storage yet.");
    }

    // Step 2: Check current KV storage
    console.log("\n2️⃣ Checking current KV storage...");
    const kvKey = "blog:posts";
    const currentKVData = (await kv.get(kvKey)) || [];
    console.log(`✅ Found ${currentKVData.length} posts in KV storage`);

    // Step 3: Determine migration strategy
    console.log("\n3️⃣ Determining migration strategy...");

    if (existingData.length === 0 && currentKVData.length === 0) {
      console.log("ℹ️  No data found in either storage. Fresh start detected.");
      console.log(
        "   The application will create initial data on first API call.",
      );
      return;
    }

    if (existingData.length > 0 && currentKVData.length === 0) {
      console.log(
        "✅ Migration needed: File storage has data, KV storage is empty",
      );

      // Step 4: Perform migration
      console.log("\n4️⃣ Performing migration...");

      // Validate data format
      const validPosts = existingData.filter((post) => {
        const required = [
          "id",
          "title",
          "content",
          "tags",
          "created_at",
          "updated_at",
        ];
        const hasAllRequired = required.every((field) =>
          Object.hasOwn(post, field),
        );

        if (!hasAllRequired) {
          console.log(`⚠️  Skipping invalid post: missing required fields`);
          console.log(`   Post data:`, post);
          return false;
        }

        if (!Array.isArray(post.tags)) {
          console.log(`⚠️  Skipping invalid post: tags should be an array`);
          return false;
        }

        return true;
      });

      console.log(`✅ Found ${validPosts.length} valid posts to migrate`);

      if (validPosts.length > 0) {
        // Write to KV storage
        await kv.set(kvKey, validPosts);
        console.log(
          `✅ Successfully migrated ${validPosts.length} posts to KV storage`,
        );

        // Set initialization flag
        await kv.set("blog:initialized", true);
        console.log("✅ Set initialization flag");

        // Show sample of migrated data
        console.log("\n📋 Sample of migrated data:");
        validPosts.slice(0, 2).forEach((post, index) => {
          console.log(`${index + 1}. "${post.title}" (ID: ${post.id})`);
          console.log(`   Tags: ${post.tags.join(", ")}`);
          console.log(`   Created: ${post.created_at}`);
        });

        if (validPosts.length > 2) {
          console.log(`   ... and ${validPosts.length - 2} more posts`);
        }
      } else {
        console.log("❌ No valid posts found for migration");
      }
    } else if (existingData.length === 0 && currentKVData.length > 0) {
      console.log("✅ KV storage already has data, no migration needed");
      console.log("   KV storage appears to be already in use.");
    } else if (existingData.length > 0 && currentKVData.length > 0) {
      console.log("⚠️  Both storages have data");
      console.log("   This might indicate a partial migration or dual usage.");

      const confirm = await askQuestion(
        "Do you want to overwrite KV storage with file storage data? (y/N): ",
      );
      if (confirm.toLowerCase() === "y") {
        await kv.set(kvKey, existingData);
        console.log("✅ KV storage overwritten with file storage data");
      } else {
        console.log("ℹ️  Migration cancelled, keeping existing KV data");
      }
    }

    // Step 5: Verify migration
    console.log("\n5️⃣ Verifying migration...");
    const finalKVData = (await kv.get(kvKey)) || [];
    console.log(`✅ Final KV storage contains ${finalKVData.length} posts`);

    if (finalKVData.length > 0) {
      // Test read/write
      const testKey = "migration:test";
      const testValue = { timestamp: new Date().toISOString() };
      await kv.set(testKey, testValue);
      const retrieved = await kv.get(testKey);
      await kv.del(testKey);

      if (JSON.stringify(retrieved) === JSON.stringify(testValue)) {
        console.log("✅ KV storage read/write test passed");
      } else {
        console.log("❌ KV storage read/write test failed");
      }
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n💡 Next steps:");
    console.log("   1. Test your API endpoints");
    console.log("   2. Run: npm run test:kv");
    console.log("   3. Deploy to Vercel");
    console.log("   4. Monitor the health endpoint");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.error("Error details:", error.message);

    if (error.message.includes("KV_URL")) {
      console.log(
        "\n💡 Make sure you have set up your KV environment variables:",
      );
      console.log("   KV_URL, KV_REST_API_URL, KV_REST_API_TOKEN");
      console.log("   Check your Vercel KV dashboard for the correct values.");
    }
  }
}

// Helper function for user input
function askQuestion(question) {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Run the migration
migrateFromFileToKV().catch(console.error);
