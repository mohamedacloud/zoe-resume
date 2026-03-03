# Fix After Final Review - Quick Start Guide

## How to Use the Feature

### 1. Run Final Review
1. Click the **"Final Review"** button in the top toolbar (with animated eyes icon)
2. Wait for the AI scanner animation to complete
3. Review drawer opens automatically with your results

### 2. Review Your Results
The drawer shows:
- **Overall Score**: 0-100 rating
- **Status Badge**: Ready / Needs Minor Fixes / Needs Major Work
- **Critical Issues**: Must fix before export (red)
- **Important Issues**: Should fix for better results (orange)
- **Suggestions**: Nice to have improvements (blue)
- **Strengths**: What's working well (green)
- **Detailed Checks**: Photo verdict, link status, grammar analysis

### 3. Navigate to Issues
**Click on any issue** to:
- Automatically scroll to the related section
- See a highlighted border for 2 seconds
- Focus on the input field (on desktop)
- Close drawer (on mobile) or keep open (on desktop)

### 4. Fix Issues Manually
1. Edit the section directly in the left sidebar
2. Make your changes
3. Notice the **"Review outdated"** badge appears in the drawer

### 5. Fix with AI (Optional)
If an issue has a **"Fix with AI"** button:
1. Click the button
2. AI will improve that specific section
3. Review the changes
4. Edit further if needed

### 6. Re-run Review
After making changes:
1. Click **"Re-run Review"** button at the bottom of drawer
2. Wait for new analysis
3. See updated results
4. The "Review outdated" badge disappears

### 7. Export Your Resume
- Export is **disabled** if critical issues remain
- Export is **enabled** when no critical issues exist
- Warning icon shows if review is outdated

## Tips & Tricks

### Navigation
- **Click issues**: Instant navigation to problem areas
- **Smooth scrolling**: Automatically centers the section
- **Highlight animation**: Orange border shows you exactly where to look

### Review Status
- **Green badge**: Ready to export! 🎉
- **Orange badge**: Minor fixes recommended
- **Red badge**: Important work needed

### AI Assistance
- **"Fix with AI"**: Only shows when AI can help
- **Safe operation**: Always review AI suggestions
- **One-click improvement**: Fast fixes for common issues

### Best Practices
1. **Fix critical issues first** (red items)
2. **Address important issues** (orange items)
3. **Consider suggestions** (blue items)
4. **Re-run review** after major changes
5. **Export only when ready** (no critical issues)

## Keyboard Shortcuts
- `Esc`: Close review drawer
- `Tab`: Navigate between issues
- `Enter`: Click focused issue to navigate

## Mobile vs Desktop

### Mobile
- Drawer closes after clicking an issue
- Reopen with **"View Review"** button
- Full-screen drawer for better focus

### Desktop
- Drawer stays open after clicking issues
- Side-by-side editing and review
- Larger screen shows more context

## Troubleshooting

### "Section not found" error
- Section might be hidden or removed
- Try scrolling manually to find it
- Update the section name if changed

### AI not responding
- Check your API key in `.env`
- Verify internet connection
- Try again in a few moments

### Review outdated badge persists
- Click **"Re-run Review"** to refresh
- Make sure all changes are saved
- Wait for the new results

### Export button disabled
- Check for red (critical) issues
- Fix all critical items
- Re-run review to verify

## Example Workflow

```
1. Click "Final Review" 
   ↓
2. See score: 75/100 with 2 critical issues
   ↓
3. Click first critical issue: "Phone number missing"
   ↓
4. Automatically scrolls to Basics section
   ↓
5. Add phone number
   ↓
6. Notice "Review outdated" badge
   ↓
7. Click second critical issue: "Experience too vague"
   ↓
8. Scrolls to Experience section
   ↓
9. Click "Fix with AI" button
   ↓
10. Review AI-improved content
   ↓
11. Click "Re-run Review"
   ↓
12. New score: 92/100, no critical issues
   ↓
13. Export button now enabled ✅
```

## Need Help?

- Read `FIX_WORKFLOW_IMPLEMENTATION.md` for technical details
- Check the AI configuration in `.env` file
- Report issues with detailed steps to reproduce
