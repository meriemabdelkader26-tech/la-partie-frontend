/**
 * Test/Demo file for Instagram Reels Integration
 *
 * This file demonstrates all the features and can be used for testing
 */

import {
  fetchInstagramReels,
  simplifyReelsData,
  getTopReelsByEngagement,
  extractHashtags,
} from "@/lib/instagram-api";

// ============================================
// Test Functions
// ============================================

/**
 * Test 1: Fetch Instagram Reels
 */
export async function testFetchReels() {
  console.log("🧪 TEST 1: Fetching Instagram Reels...\n");

  const username = "dalel__dalou"; // Example username

  try {
    const response = await fetchInstagramReels(username);
    console.log("✅ Successfully fetched reels!");
    console.log(`📊 Total reels: ${response.data.count}`);
    console.log(`📦 Items received: ${response.data.items.length}\n`);

    // Show first reel details
    if (response.data.items.length > 0) {
      const firstReel = response.data.items[0];
      console.log("📹 First Reel Details:");
      console.log(`  - ID: ${firstReel.id}`);
      console.log(`  - Code: ${firstReel.code}`);
      console.log(
        `  - Caption: ${firstReel.caption?.text?.substring(0, 50)}...`
      );
      console.log(`  - Likes: ${firstReel.like_count}`);
      console.log(`  - Comments: ${firstReel.comment_count}`);
      console.log(`  - Views: ${firstReel.play_count}`);
      console.log(`  - Duration: ${firstReel.video_duration}s\n`);
    }

    return response;
  } catch (error) {
    console.error("❌ Error fetching reels:", error);
    throw error;
  }
}

/**
 * Test 2: Simplify Reels Data
 */
export async function testSimplifyReels() {
  console.log("🧪 TEST 2: Simplifying Reels Data...\n");

  try {
    const response = await fetchInstagramReels("dalel__dalou");
    const simplifiedReels = simplifyReelsData(response);

    console.log("✅ Successfully simplified reels data!");
    console.log(`📊 Simplified ${simplifiedReels.length} reels\n`);

    // Show simplified structure
    if (simplifiedReels.length > 0) {
      console.log("📹 Simplified Reel Example:");
      console.log(JSON.stringify(simplifiedReels[0], null, 2));
      console.log();
    }

    return simplifiedReels;
  } catch (error) {
    console.error("❌ Error simplifying reels:", error);
    throw error;
  }
}

/**
 * Test 3: Get Top Reels by Engagement
 */
export async function testTopReels() {
  console.log("🧪 TEST 3: Getting Top Reels by Engagement...\n");

  try {
    const response = await fetchInstagramReels("dalel__dalou");
    const simplifiedReels = simplifyReelsData(response);
    const topReels = getTopReelsByEngagement(simplifiedReels, 3);

    console.log("✅ Successfully identified top reels!");
    console.log(`🏆 Top 3 Reels:\n`);

    topReels.forEach((reel, index) => {
      const engagement = reel.likes + reel.comments;
      console.log(`${index + 1}. Code: ${reel.code}`);
      console.log(`   Caption: ${reel.postName.substring(0, 40)}...`);
      console.log(
        `   Engagement: ${engagement} (${reel.likes} likes + ${reel.comments} comments)`
      );
      console.log(`   Views: ${reel.views}`);
      console.log();
    });

    return topReels;
  } catch (error) {
    console.error("❌ Error getting top reels:", error);
    throw error;
  }
}

/**
 * Test 4: Extract Hashtags
 */
export function testHashtagExtraction() {
  console.log("🧪 TEST 4: Extracting Hashtags...\n");

  const testCaptions = [
    "Le bonheur ne se trouve pas… il se crée. #PositiveVibes #GoodVibesOnly",
    "Amazing day! #travel #photography #blessed",
    "No hashtags in this caption",
    "#StartWithHashtag and #EndWithHashtag",
  ];

  testCaptions.forEach((caption, index) => {
    const hashtags = extractHashtags(caption);
    console.log(`Caption ${index + 1}: "${caption.substring(0, 40)}..."`);
    console.log(`Hashtags found: [${hashtags.join(", ")}]`);
    console.log();
  });
}

/**
 * Test 5: Format Numbers
 */
export function testNumberFormatting() {
  console.log("🧪 TEST 5: Number Formatting...\n");

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const testNumbers = [100, 1500, 45000, 1200000, 999, 10500];

  testNumbers.forEach((num) => {
    console.log(`${num} → ${formatNumber(num)}`);
  });
  console.log();
}

/**
 * Test 6: Complete Workflow Simulation
 */
export async function testCompleteWorkflow() {
  console.log("🧪 TEST 6: Complete Workflow Simulation...\n");
  console.log("=".repeat(60));
  console.log("SIMULATING INFLUENCER PROFILE COMPLETION");
  console.log("=".repeat(60));
  console.log();

  try {
    // Step 1: User enters Instagram username
    const username = "dalel__dalou";
    console.log(`1️⃣ User entered username: @${username}`);

    // Step 2: Fetch user's reels
    console.log("2️⃣ Fetching reels from Instagram API...");
    const response = await fetchInstagramReels(username);
    const reels = simplifyReelsData(response);
    console.log(`   ✅ Found ${reels.length} reels`);

    // Step 3: User selects top 3 reels
    console.log("3️⃣ User selecting top 3 reels...");
    const selectedReels = getTopReelsByEngagement(reels, 3);
    console.log(`   ✅ Selected ${selectedReels.length} reels`);

    // Step 4: Add hashtags to selected reels
    console.log("4️⃣ Extracting hashtags from selected reels...");
    const reelsWithHashtags = selectedReels.map((reel) => ({
      ...reel,
      hashtags: extractHashtags(reel.postName),
    }));
    console.log("   ✅ Hashtags extracted");

    // Step 5: Prepare data for database
    console.log("5️⃣ Preparing data for database insertion...");
    const profileData = {
      instagramUsername: username,
      selectedReels: reelsWithHashtags.map((reel) => ({
        id: reel.id,
        code: reel.code,
        videoUrl: reel.videoUrl,
        thumbnailUrl: reel.thumbnailUrl,
        postName: reel.postName,
        duration: reel.duration,
        takenAt: reel.takenAt,
        likes: reel.likes,
        comments: reel.comments,
        views: reel.views,
        username: reel.username,
        hashtags: reel.hashtags,
      })),
    };

    console.log("   ✅ Data prepared for insertion");
    console.log("\n📦 Profile Data Structure:");
    console.log(JSON.stringify(profileData, null, 2));

    // Step 6: Save to database (simulated)
    console.log("\n6️⃣ Saving to database...");
    console.log("   ⏳ Simulated save operation...");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("   ✅ Profile saved successfully!");

    console.log("\n" + "=".repeat(60));
    console.log("✅ WORKFLOW COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log();

    return profileData;
  } catch (error) {
    console.error("❌ Workflow failed:", error);
    throw error;
  }
}

/**
 * Test 7: Error Handling
 */
export async function testErrorHandling() {
  console.log("🧪 TEST 7: Error Handling...\n");

  // Test with invalid username
  console.log("Testing with invalid username...");
  try {
    await fetchInstagramReels("this_user_definitely_does_not_exist_12345");
    console.log("❌ Should have thrown an error!");
  } catch (error) {
    console.log(
      "✅ Error handled correctly:",
      error instanceof Error ? error.message : error
    );
  }
  console.log();
}

// ============================================
// Run All Tests
// ============================================

export async function runAllTests() {
  console.log("\n🚀 STARTING INSTAGRAM REELS INTEGRATION TESTS\n");
  console.log("=".repeat(60));
  console.log();

  try {
    // Run tests sequentially
    await testFetchReels();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testSimplifyReels();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testTopReels();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    testHashtagExtraction();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    testNumberFormatting();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testCompleteWorkflow();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testErrorHandling();

    console.log("\n" + "=".repeat(60));
    console.log("🎉 ALL TESTS COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log();
  } catch (error) {
    console.error("\n❌ TESTS FAILED:", error);
  }
}

// ============================================
// Usage Instructions
// ============================================

/**
 * HOW TO USE THIS TEST FILE:
 *
 * 1. In your browser console or a test page:
 *    import { runAllTests } from '@/test/instagram-reels-test';
 *    runAllTests();
 *
 * 2. Run individual tests:
 *    import { testFetchReels } from '@/test/instagram-reels-test';
 *    testFetchReels();
 *
 * 3. Test with your own username:
 *    import { fetchInstagramReels, simplifyReelsData } from '@/lib/instagram-api';
 *    const response = await fetchInstagramReels('your_username');
 *    const reels = simplifyReelsData(response);
 *    console.log(reels);
 */