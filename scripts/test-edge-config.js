#!/usr/bin/env node

const { get } = require("@vercel/edge-config");

async function testEdgeConfig() {
  console.log("🧪 Testing Vercel Edge Config Integration");
  console.log("=========================================\n");

  // Check environment
  console.log("📋 Environment Check:");
  console.log("- EDGE_CONFIG set:", !!process.env.EDGE_CONFIG);
  console.log("- EDGE_CONFIG length:", process.env.EDGE_CONFIG?.length || 0);
  console.log("");

  try {
    console.log("🔍 Testing Edge Config connection...");

    // Test getting the greeting
    const greeting = await get("greeting");

    if (greeting) {
      console.log("✅ SUCCESS: Edge Config connection working!");
      console.log("📝 Current greeting:", JSON.stringify(greeting));
      console.log("📊 Type of greeting:", typeof greeting);
    } else {
      console.log("⚠️  WARNING: Edge Config connected but no greeting found");
      console.log("📝 Current greeting:", greeting);
      console.log(
        '💡 Make sure you have a "greeting" key set in your Edge Config store',
      );
    }

    console.log("\n🎯 Test Results:");
    console.log("- Connection: ✅ Working");
    console.log(
      "- Data retrieval:",
      greeting ? "✅ Success" : "⚠️  No data found",
    );
    console.log(
      "- Integration:",
      greeting ? "✅ Ready" : "⚠️  Needs configuration",
    );
  } catch (error) {
    console.log("❌ ERROR: Edge Config connection failed");
    console.log("🚨 Error details:", error.message);

    if (error.message.includes("EDGE_CONFIG")) {
      console.log("\n💡 Suggestions:");
      console.log("1. Make sure EDGE_CONFIG environment variable is set");
      console.log("2. Verify the connection string is correct");
      console.log(
        "3. Check that your Edge Config store exists in Vercel dashboard",
      );
    }

    console.log("\n🎯 Test Results:");
    console.log("- Connection: ❌ Failed");
    console.log("- Error:", error.message);
    console.log("- Integration: ❌ Not ready");
  }

  console.log("\n📚 Next Steps:");
  console.log(
    "1. If connection failed, check your EDGE_CONFIG environment variable",
  );
  console.log(
    "2. Visit your Vercel dashboard to get the correct connection string",
  );
  console.log("3. Test the web interface at: http://localhost:3000/welcome");
  console.log("4. Test the API at: http://localhost:3000/api/welcome");
}

// Run the test
testEdgeConfig().catch(console.error);
