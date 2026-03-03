# Quick Implementation - Final Review 2-Click Limit

## 🎯 Quick Steps

### 1️⃣ Update `src/components/resume/store/resume.ts`

Add to type definition (line ~40):
```typescript
showReviewDrawer: boolean;
reviewAttempts: number; // ADD THIS LINE
```

Add to actions type (line ~57):
```typescript
setShowReviewDrawer: (show: boolean) => void;
incrementReviewAttempts: () => void; // ADD THIS LINE
```

Add to state initialization (line ~88):
```typescript
showReviewDrawer: false,
reviewAttempts: 0, // ADD THIS LINE
```

Add to initialize function (line ~127, after loading review data):
```typescript
// ✅ Load review attempts for this specific resume
const savedAttempts = localStorage.getItem(`resume-review-attempts-${resume.id}`);
if (savedAttempts) {
	try {
		state.reviewAttempts = JSON.parse(savedAttempts);
	} catch (e) {
		console.error("Failed to load review attempts:", e);
		state.reviewAttempts = 0;
	}
} else {
	state.reviewAttempts = 0;
}
```

Add new function (line ~228, after setShowReviewDrawer):
```typescript
incrementReviewAttempts: () => {
	set((state) => {
		if (state.reviewAttempts < 2) {
			state.reviewAttempts += 1;
			// ✅ Persist attempts per resume
			if (typeof window !== "undefined" && state.resume?.id) {
				localStorage.setItem(
					`resume-review-attempts-${state.resume.id}`,
					JSON.stringify(state.reviewAttempts),
				);
			}
		}
	});
},
```

---

### 2️⃣ Update `src/routes/builder/$resumeId/-components/top-tray.tsx`

Add state selectors (line ~53):
```typescript
const reviewAttempts = useResumeStore((state) => state.reviewAttempts);
const incrementReviewAttempts = useResumeStore((state) => state.incrementReviewAttempts);
```

Update onFinalReview function (line ~75):
```typescript
const onFinalReview = async () => {
	// ✅ Check if attempts exceeded
	if (reviewAttempts >= 2) {
		toast.error(t`You have used all your Final Review attempts for this resume.`);
		return;
	}

	if (!resume || !isConfigured) {
		toast.error(t`AI is not configured. Please set VITE_AI_API_KEY and VITE_AI_MODEL in your .env file.`);
		return;
	}

	// ✅ Increment attempts before running review
	incrementReviewAttempts();

	setReviewing(true);
	// ... rest of function stays the same
```

Replace Final Review Button (line ~230):
```typescript
{/* Final Review Button */}
<div className="relative">
	<Button
		size="sm"
		variant="outline"
		disabled={isPrinting || isReviewing || reviewAttempts >= 2}
		className={cn(
			"flex items-center justify-center gap-1.5 px-2 sm:h-9 sm:w-auto sm:gap-2 sm:px-3",
			"bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
			"border-0 shadow-sm transition-all duration-300",
			isReviewing && "scale-[0.98] brightness-90",
			reviewAttempts >= 2 && "cursor-not-allowed opacity-50",
		)}
		onClick={onFinalReview}
		aria-label="Final Review"
	>
		{isReviewing ? (
			<CircleNotchIcon className="animate-spin" />
		) : (
			<motion.div whileHover={{ scale: 1.1 }}>
				<AnimatedEyes />
			</motion.div>
		)}{" "}
		<span className="hidden sm:inline">
			<Trans>Final Review</Trans>
		</span>
	</Button>
	{/* Warning Message - Shows after 1st click */}
	{reviewAttempts === 1 && reviewAttempts < 2 && (
		<p className="absolute top-full mt-1 whitespace-nowrap text-xs text-red-500">
			<Trans>Now you can use this one time only</Trans>
		</p>
	)}
	{/* Disabled Message - Shows after 2nd click */}
	{reviewAttempts >= 2 && (
		<p className="absolute top-full mt-1 whitespace-nowrap text-xs text-red-600 font-medium">
			<Trans>No attempts left</Trans>
		</p>
	)}
</div>
```

---

## ✅ That's It!

**Result:**
- 1st click: Works + shows warning
- 2nd click: Works + button disabled
- 3rd click: Can't click (disabled)
- Persists across page refreshes
- Each resume has own count

