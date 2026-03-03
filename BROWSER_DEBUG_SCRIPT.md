# Browser Console Test Script

## Copy and paste this into your browser console (F12) to debug

```javascript
// ==========================================
// FINAL REVIEW FEATURE - DEBUG SCRIPT
// ==========================================

console.log('🔍 Checking Final Review Feature Status...\n');

// 1. Get current resume ID
const resumeId = window.location.pathname.split('/').pop();
console.log('📝 Current Resume ID:', resumeId);

// 2. Check localStorage for review attempts
const attemptKey = `resume-review-attempts-${resumeId}`;
const attempts = localStorage.getItem(attemptKey);
console.log('🔢 Review Attempts:', attempts ? JSON.parse(attempts) : 0);

// 3. Check localStorage for review data
const reviewKey = `resume-review-${resumeId}`;
const reviewData = localStorage.getItem(reviewKey);
if (reviewData) {
  try {
    const parsed = JSON.parse(reviewData);
    console.log('📊 Review Result exists:', !!parsed.reviewResult);
    console.log('🚪 Show Review Drawer:', parsed.showReviewDrawer);
    if (parsed.reviewResult) {
      console.log('💯 Overall Score:', parsed.reviewResult.overall_score);
      console.log('✅ Verdict:', parsed.reviewResult.final_verdict);
    }
  } catch (e) {
    console.log('❌ Error parsing review data:', e);
  }
} else {
  console.log('ℹ️  No review data found for this resume');
}

// 4. Check AI configuration from environment
console.log('\n🤖 AI Configuration:');
console.log('- Provider:', import.meta.env.VITE_AI_PROVIDER || '❌ Not set');
console.log('- Model:', import.meta.env.VITE_AI_MODEL || '❌ Not set');
console.log('- API Key:', import.meta.env.VITE_AI_API_KEY ? '✅ Set' : '❌ Not set');

// 5. Check button state
const button = document.querySelector('[aria-label="Final Review"]');
if (button) {
  console.log('\n🔘 Button Status:');
  console.log('- Exists:', '✅');
  console.log('- Disabled:', button.disabled ? '⛔ YES' : '✅ NO');
  console.log('- Classes:', button.className);
} else {
  console.log('\n❌ Final Review button not found on page');
}

// 6. Summary
console.log('\n📋 SUMMARY:');
if (attempts && JSON.parse(attempts) >= 2) {
  console.log('⚠️  WARNING: Review limit reached (2/2 attempts used)');
  console.log('💡 Solution: Run the reset script below');
} else if (!import.meta.env.VITE_AI_API_KEY) {
  console.log('⚠️  WARNING: AI API Key not configured');
  console.log('💡 Solution: Add VITE_AI_API_KEY to your .env file');
} else if (button && button.disabled) {
  console.log('⚠️  WARNING: Button is disabled');
  console.log('💡 Reason: isPrinting, isReviewing, or attempts >= 2');
} else {
  console.log('✅ Everything looks good! Button should work.');
}

console.log('\n' + '='.repeat(50));
```

## Reset Script (if needed)

```javascript
// ==========================================
// RESET FINAL REVIEW FEATURE
// ==========================================

const resumeId = window.location.pathname.split('/').pop();

console.log('🔄 Resetting Final Review for resume:', resumeId);

// Clear review attempts
localStorage.removeItem(`resume-review-attempts-${resumeId}`);
console.log('✅ Cleared review attempts');

// Clear review data
localStorage.removeItem(`resume-review-${resumeId}`);
console.log('✅ Cleared review data');

// Reload page
console.log('🔄 Reloading page in 1 second...');
setTimeout(() => location.reload(), 1000);
```

## Check Zustand Store State

```javascript
// ==========================================
// CHECK ZUSTAND STORE
// ==========================================

// This requires React DevTools or direct store access
// If store is exposed globally:
if (window.__ZUSTAND_STORES__) {
  console.log('📦 Zustand Stores:', window.__ZUSTAND_STORES__);
} else {
  console.log('ℹ️  Store not exposed globally');
  console.log('💡 Use React DevTools to inspect component state');
}

// Check persisted store
const persistedStore = localStorage.getItem('resume-store');
if (persistedStore) {
  try {
    const store = JSON.parse(persistedStore);
    console.log('📦 Persisted Resume Store:');
    console.log('- Resume ID:', store.state?.resume?.id);
    console.log('- Summary AI Rounds:', store.state?.summaryAIRoundsUsed);
    console.log('- Experience AI Rounds:', store.state?.experienceAIRoundsUsed);
    console.log('- Project AI Rounds:', store.state?.projectAIRoundsUsed);
  } catch (e) {
    console.log('❌ Error parsing store:', e);
  }
} else {
  console.log('ℹ️  No persisted store found');
}
```

## Test Final Review Button

```javascript
// ==========================================
// SIMULATE BUTTON CLICK
// ==========================================

const button = document.querySelector('[aria-label="Final Review"]');
if (button) {
  if (button.disabled) {
    console.log('⛔ Button is disabled, cannot click');
    console.log('💡 Check attempts or run reset script');
  } else {
    console.log('🖱️  Clicking Final Review button...');
    button.click();
    console.log('✅ Button clicked! Watch for toast notifications and loading state');
  }
} else {
  console.log('❌ Button not found');
}
```

## Monitor Network Requests

```javascript
// ==========================================
// MONITOR FINAL REVIEW API CALLS
// ==========================================

// Open Network tab in DevTools before running this

console.log('👀 Monitoring for Final Review API calls...');
console.log('📡 Look in Network tab for:');
console.log('- URL containing "finalReview" or "ai"');
console.log('- Status: 200 (success) or 4xx/5xx (error)');
console.log('- Response: Should contain review results');

// You can also check console for errors
console.log('\n🐛 Watch Console tab for:');
console.log('- "Final Review Error:"');
console.log('- "AI is not configured"');
console.log('- TypeErrors or other JavaScript errors');
```
