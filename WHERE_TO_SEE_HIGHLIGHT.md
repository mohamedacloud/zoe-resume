# Where to See the Highlighting - Visual Guide

## 📍 **Location: LEFT SIDEBAR**

The orange highlight appears on the **sections in the LEFT sidebar**, NOT on the resume preview itself.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Builder Page                            │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┬──────────────────┬──────────────────────────┐
│  LEFT SIDEBAR      │   Resume Canvas  │   Review Drawer (Right)  │
│  ← LOOK HERE! ✨   │   (Preview)      │                          │
├────────────────────┼──────────────────┼──────────────────────────┤
│                    │                  │                          │
│  ╔══════════════╗  │   ┌──────────┐   │  Click an issue here →   │
│  ║ 📸 Picture   ║  │   │          │   │  • Phone missing ⬅️      │
│  ╚══════════════╝  │   │  Resume  │   │  • Email invalid         │
│                    │   │  Preview │   │                          │
│  ╔══════════════╗  │   │          │   │  ↓                       │
│  ║ 👤 Basics    ║  │   │          │   │  Section highlights      │
│  ║ • Name       ║  │   │          │   │  in LEFT SIDEBAR         │
│  ║ • Email      ║  │   │          │   │                          │
│  ║ • Phone      ║  │   └──────────┘   │                          │
│  ╚══════════════╝  │                  │                          │
│   ⬆️ ORANGE BORDER │                  │                          │
│   appears here!    │                  │                          │
│                    │                  │                          │
│  📝 Summary        │                  │                          │
│  💼 Experience     │                  │                          │
│  🎓 Education      │                  │                          │
│  🚀 Projects       │                  │                          │
│  🛠️ Skills         │                  │                          │
│                    │                  │                          │
└────────────────────┴──────────────────┴──────────────────────────┘
```

## 🎯 **Step-by-Step Test**

### 1. Open Review Drawer
- Click **"Final Review"** button in top toolbar
- Wait for analysis to complete
- Review drawer opens on the right

### 2. Click an Issue
- In the review drawer (right side)
- Click on any **critical** or **important** issue
- Example: Click "Phone number is missing"

### 3. Watch the LEFT Sidebar
- **Look at the LEFT sidebar** (NOT the resume preview)
- The section should:
  1. **Expand** if it was collapsed
  2. **Scroll into view** smoothly
  3. **Show ORANGE BORDER** around the entire section box
  4. **Glow effect** with pulsing shadow
  5. **Light orange background tint**

### 4. What You'll See
```
┌──────────────────────────────────────┐
│  BEFORE (normal section)             │
│  ┌────────────────────────────────┐  │
│  │ 👤 Basics                      │  │
│  │ • Name: John Doe               │  │
│  │ • Email: john@example.com      │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘

                  ↓ Click issue

┌──────────────────────────────────────┐
│  AFTER (highlighted - 2 seconds)     │
│  ╔════════════════════════════════╗  │
│  ║ 👤 Basics                      ║  ← Orange border
│  ║ • Name: John Doe               ║  ← Light orange bg
│  ║ • Email: john@example.com      ║  ← Pulsing glow
│  ╚════════════════════════════════╝  │
└──────────────────────────────────────┘
```

## 🔍 **Not Seeing It? Debug Steps**

### Step 1: Open Browser Console
1. Press **F12** or **Cmd+Option+I** (Mac) / **Ctrl+Shift+I** (Windows)
2. Go to **Console** tab
3. Click an issue in the review drawer
4. Look for messages:
   - ✅ No warnings = Working
   - ⚠️ "Section element not found" = Problem

### Step 2: Manually Test Highlight
In the browser console, run:
```javascript
// Test if highlighting works manually
const section = document.getElementById('sidebar-basics');
if (section) {
  section.classList.add('review-highlight');
  console.log('✅ Highlight applied! Check the Basics section in LEFT sidebar');
  setTimeout(() => {
    section.classList.remove('review-highlight');
    console.log('✅ Highlight removed');
  }, 3000);
} else {
  console.error('❌ Section not found');
}
```

### Step 3: Check All Section IDs
In the browser console, run:
```javascript
// List all sidebar section IDs
const sectionIds = Array.from(document.querySelectorAll('[id^="sidebar-"]'))
  .map(el => el.id);
console.log('Available sections:', sectionIds);
// Should show: ["sidebar-picture", "sidebar-basics", "sidebar-summary", etc.]
```

### Step 4: Test the CSS
In the browser console, run:
```javascript
// Check if CSS is working
const style = document.createElement('style');
style.textContent = '.test-highlight { border: 5px solid red !important; }';
document.head.appendChild(style);

const section = document.getElementById('sidebar-basics');
if (section) {
  section.classList.add('test-highlight');
  console.log('✅ If Basics section has RED border, CSS is working');
}
```

## 📸 **Screenshot Locations**

Here's where the orange highlight should appear (marked with arrows):

```
LEFT SIDEBAR SECTIONS:
├─→ 📸 Picture      ← Can be highlighted here
├─→ 👤 Basics       ← Can be highlighted here
├─→ 📝 Summary      ← Can be highlighted here
├─→ 💼 Experience   ← Can be highlighted here
├─→ 🎓 Education    ← Can be highlighted here
├─→ 🚀 Projects     ← Can be highlighted here
├─→ 🛠️ Skills       ← Can be highlighted here
├─→ 🌍 Languages    ← Can be highlighted here
└─→ ... (more)      ← Can be highlighted here
```

## 🎨 **What the Highlight Looks Like**

### Colors:
- **Border**: Orange (#f59e0b)
- **Shadow**: Orange glow (pulsing)
- **Background**: Very light orange tint

### Animation:
- **Duration**: 2 seconds
- **Effect**: Pulsing glow (shadow expands and contracts)
- **Removal**: Automatic after 2 seconds

### Visibility:
- **Very obvious** - thick orange border
- **Can't miss it** - pulsing glow effect
- **Entire section box** - not just text

## ❓ **Still Not Seeing It?**

If you've tried everything above and still don't see the orange highlight, please:

1. **Take a screenshot** of your screen showing:
   - Left sidebar
   - Review drawer
   - Browser console (if any errors)

2. **Tell me**:
   - Which browser you're using (Chrome, Firefox, Safari?)
   - Which issue you clicked
   - Any error messages in console

3. **Try this quick test**:
   ```javascript
   // In browser console
   document.getElementById('sidebar-basics').style.border = '5px solid red';
   // If you see a RED border on the Basics section, the element exists
   ```

## 💡 **Common Misconceptions**

❌ **NOT** on the resume preview (center panel)
❌ **NOT** on the review drawer (right panel)
❌ **NOT** on individual fields inside sections

✅ **YES** on section containers in LEFT sidebar
✅ **YES** around the entire section box
✅ **YES** with orange color and glow

---

**The highlight appears on the LEFT SIDEBAR section boxes!** 

Look for a thick orange border with a pulsing glow effect around sections like "Basics", "Summary", "Experience", etc.
