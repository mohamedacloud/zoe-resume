# Final Review Button - Visual Guide

## UI States

### State 1: Initial (0 attempts)
```
┌─────────────────────────────┐
│  👀 Final Review             │  ← Button enabled, gradient purple
└─────────────────────────────┘
```

### State 2: After First Click (1 attempt)
```
┌─────────────────────────────┐
│  👀 Final Review             │  ← Button still enabled
└─────────────────────────────┘
⚠️ One attempt left only!      ← RED warning text appears
```

### State 3: After Second Click (2 attempts)
```
┌─────────────────────────────┐
│  👀 Final Review             │  ← Button disabled, grayed out
└─────────────────────────────┘
🚫 Review limit reached        ← RED limit message

Clicking the button shows toast:
"Review limit reached. You have already used both attempts."
```

## Warning Message Styling

- **Color**: Red (#DC2626 in light mode, #F87171 in dark mode)
- **Font Size**: Extra small (text-xs)
- **Font Weight**: Medium (font-medium)
- **Animation**: Fade in from top (initial opacity: 0, y: -5)
- **Icons**: 
  - ⚠️ for warning (1 attempt left)
  - 🚫 for limit reached (2 attempts used)

## Button States

### Enabled (0-1 attempts)
- Background: Gradient from indigo-600 to purple-600
- Hover: Gradient from indigo-700 to purple-700
- Cursor: Pointer
- Opacity: 100%

### Disabled (2 attempts)
- Background: Same gradient but faded
- Cursor: Not-allowed
- Opacity: 50%
- No hover effect

## Flow Diagram

```
Start (attempts = 0)
        ↓
   [Click Button]
        ↓
   Review Runs
        ↓
   attempts = 1
        ↓
Show "⚠️ One attempt left only!"
        ↓
   [Click Button Again]
        ↓
   Review Runs
        ↓
   attempts = 2
        ↓
Show "🚫 Review limit reached"
   Button Disabled
        ↓
[Try to Click] → Toast Error
```

## Responsive Behavior

### Mobile (< 640px)
- Warning text: Same size (text-xs)
- Positioned below button
- Right-aligned with button

### Desktop (≥ 640px)
- Warning text: Same size (text-xs)
- Positioned below button
- Right-aligned with button
- Button shows "Final Review" text (hidden on mobile)

## Integration with Existing Features

✅ Works alongside "View Review" button
✅ Respects resume switching (independent counters)
✅ Persists across page refreshes
✅ Shows alongside review results drawer
✅ Disabled during active review (isReviewing state)
