# Troubleshooting Final Review Feature

## Issue: Scanning Not Working / Sidebar Not Showing

### Possible Causes & Solutions

### 1. **Review Attempts Limit Reached**
If you've already clicked the Final Review button 2 times, it will be disabled.

**Solution**: Clear localStorage for the specific resume
```javascript
// Open browser console (F12) and run:
const resumeId = window.location.pathname.split('/').pop();
localStorage.removeItem(`resume-review-attempts-${resumeId}`);
localStorage.removeItem(`resume-review-${resumeId}`);
// Then refresh the page
location.reload();
```

### 2. **AI Not Configured**
Check if the `.env` file has the API key set.

**Solution**: Verify `.env` file contains:
```bash
VITE_AI_API_KEY=your-api-key-here
VITE_AI_MODEL=models/gemini-2.0-flash-exp
VITE_AI_PROVIDER=gemini
VITE_AI_BASE_URL=https://generativelanguage.googleapis.com/v1beta
```

### 3. **Browser Cache Issues**
Old JavaScript/CSS might be cached.

**Solution**: Hard refresh
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R
- Or clear site data in DevTools

### 4. **Review Result Not Stored**
The sidebar only shows if `reviewResult` exists in the store.

**Solution**: Check in browser console:
```javascript
// Check if review result exists
const store = JSON.parse(localStorage.getItem('resume-store'));
console.log('Review Result:', store?.state?.reviewResult);
console.log('Show Drawer:', store?.state?.showReviewDrawer);
```

### 5. **Server Errors**
Check if the API call is failing.

**Solution**: Open browser DevTools Console and Network tab
- Click Final Review button
- Check for any red errors in Console
- Check Network tab for failed API calls
- Look for errors in terminal where `pnpm dev` is running

## Quick Reset Instructions

### Reset Everything for Testing:

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)

2. **Run this code**:
```javascript
// Get current resume ID from URL
const resumeId = window.location.pathname.split('/').pop();

// Clear all review-related data
localStorage.removeItem(`resume-review-attempts-${resumeId}`);
localStorage.removeItem(`resume-review-${resumeId}`);

// Clear the entire store (if needed)
localStorage.removeItem('resume-store');

console.log('✅ Cleared all review data for resume:', resumeId);
console.log('🔄 Refreshing page...');

// Refresh page
setTimeout(() => location.reload(), 1000);
```

3. **After page reloads**, you should have:
   - ✅ Review attempts reset to 0
   - ✅ Final Review button enabled
   - ✅ No previous review data

## Testing the Feature

1. **First Click**:
   - Button should be enabled
   - Loading animation appears
   - After completion: Warning shows "⚠️ One attempt left only!"
   - Review drawer opens on right side

2. **Second Click**:
   - Button still enabled but warning visible
   - Loading animation appears
   - After completion: Button becomes disabled
   - Message shows "🚫 Review limit reached"

3. **Third Click Attempt**:
   - Button is grayed out and disabled
   - Clicking shows toast error: "Review limit reached..."

## Check Server Logs

If scanning doesn't start, check terminal output:
```bash
# Look for errors like:
❌ AI is not configured
❌ Final Review Error
❌ TypeError: ...
```

## Verify Store State

Check if the resume store is working:
```javascript
// In browser console
window.__REACT_DEVTOOLS_GLOBAL_HOOK__
// Or
console.log(localStorage.getItem('resume-store'));
```

## Common Issues

### Button is Disabled But No Message
- Review attempts might be at 2
- Run reset script above

### Sidebar Doesn't Open
- Check if `reviewResult` exists in store
- Check if `showReviewDrawer` is true
- Look for console errors

### Scanning Starts But Never Completes
- Check Network tab for failed API calls
- Verify AI API key is valid
- Check terminal for server errors

### Warning Message Not Showing
- Clear browser cache
- Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
- Check if `reviewAttempts` value is correct in store

## Development Server

Make sure the dev server is running without errors:
```bash
cd /Users/sama/Desktop/reactive-resume
pnpm dev
```

Should see:
```
✅ Database migrations completed
➜  Local:   http://localhost:3000/
```

No errors about:
- incrementReviewAttempts is not a function
- Module not found
- Failed to fetch

## Manual Test Checklist

- [ ] Dev server running on http://localhost:3000
- [ ] .env file has VITE_AI_API_KEY set
- [ ] Browser console shows no errors
- [ ] localStorage cleared for current resume
- [ ] Page refreshed after clearing
- [ ] Final Review button is enabled and clickable
- [ ] First click shows warning after completion
- [ ] Second click disables button
- [ ] Review sidebar appears with results
- [ ] Can close and reopen sidebar with "View Review" button
