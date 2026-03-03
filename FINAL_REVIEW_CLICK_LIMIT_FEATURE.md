# Final Review Button - Click Limit Feature

## Overview
Added a 2-click limit validation to the Final Review button with visual warnings and automatic disabling after the limit is reached.

## Implementation Details

### 1. Store Integration
The feature uses the existing `reviewAttempts` state and `incrementReviewAttempts` action from the resume store (`src/components/resume/store/resume.ts`):
- **State**: `reviewAttempts` - tracks the number of times Final Review has been used
- **Action**: `incrementReviewAttempts()` - increments the counter (max 2)
- **Persistence**: Attempts are stored per resume in localStorage as `resume-review-attempts-{resumeId}`

### 2. Button Logic (top-tray.tsx)

#### Validation in `onFinalReview()`:
```typescript
// Check if limit is reached
if (reviewAttempts >= 2) {
    toast.error(t`Review limit reached. You have already used both attempts.`);
    return;
}

// Increment attempts before starting review
incrementReviewAttempts();
```

#### Button UI Changes:
- **Disabled State**: Button is disabled when `reviewAttempts >= 2`
- **Visual Feedback**: Reduced opacity (50%) and cursor-not-allowed when disabled
- **Container**: Wrapped in a flex column div to show warning messages below

### 3. Warning Messages

#### After First Click (reviewAttempts === 1):
```
⚠️ One attempt left only!
```
- Displayed in red text (text-red-600/dark:text-red-400)
- Animated entrance with framer-motion
- Font size: text-xs, font-medium

#### After Second Click (reviewAttempts >= 2):
```
🚫 Review limit reached
```
- Displayed in red text (text-red-600/dark:text-red-400)
- Animated entrance with framer-motion
- Button becomes disabled and grayed out

### 4. User Experience Flow

**First Use (reviewAttempts = 0):**
- Button is fully enabled
- User clicks → review runs → attempts = 1
- Warning appears: "⚠️ One attempt left only!"

**Second Use (reviewAttempts = 1):**
- Button is still enabled but warning is visible
- User clicks → review runs → attempts = 2
- Button becomes disabled
- Message changes to: "🚫 Review limit reached"

**After Limit (reviewAttempts = 2):**
- Button is disabled (grayed out)
- Click attempts show error toast: "Review limit reached. You have already used both attempts."
- Cannot use Final Review again for this resume

### 5. Key Features

✅ **Per-Resume Tracking**: Each resume has its own independent attempt counter
✅ **Persistent Storage**: Attempts are saved in localStorage and survive page refreshes
✅ **Visual Warnings**: Clear red warning messages with emojis
✅ **Smooth Animations**: Warning messages fade in with motion.div
✅ **Toast Notifications**: Additional error toast when trying to exceed limit
✅ **Automatic Disable**: Button becomes non-interactive after 2 uses
✅ **Responsive Design**: Warning text is properly sized for all screen sizes

### 6. Files Modified

1. **src/routes/builder/$resumeId/-components/top-tray.tsx**
   - Added `reviewAttempts` and `incrementReviewAttempts` from store
   - Added validation logic in `onFinalReview()`
   - Wrapped button in flex container with warning messages
   - Added conditional rendering for warning states

2. **src/components/resume/store/resume.ts** (already had the functionality)
   - `reviewAttempts` state
   - `incrementReviewAttempts()` action
   - localStorage persistence

## Testing Checklist

- [ ] Click Final Review first time → Review runs, warning appears
- [ ] Warning shows: "⚠️ One attempt left only!"
- [ ] Click Final Review second time → Review runs, button disables
- [ ] Warning shows: "🚫 Review limit reached"
- [ ] Button is grayed out and cannot be clicked
- [ ] Clicking disabled button shows toast error
- [ ] Refresh page → attempt count persists
- [ ] Switch to different resume → new independent counter
- [ ] Switch back to original resume → previous count restored

## Notes

- The limit is hardcoded to 2 attempts
- Counter resets only when switching to a different resume
- The feature works seamlessly with the existing review system
- All text uses i18n with `<Trans>` components for translation support
