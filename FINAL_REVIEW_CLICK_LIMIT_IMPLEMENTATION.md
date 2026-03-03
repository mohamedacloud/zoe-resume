# Final Review Button - 2 Click Limit Implementation Guide

## Overview
This guide shows how to implement a **2-click limit** for the Final Review button with a warning message after the first click.

---

## Requirements
1. ✅ Button is clickable only **2 times**
2. ✅ After **1st click** → Show red warning: "Now you can use this one time only"
3. ✅ After **2nd click** → Button is **disabled**
4. ✅ State persists across page refreshes
5. ✅ Each resume has its own click count

---

## Step 1: Update Resume Store Types

### File: `src/components/resume/store/resume.ts`

#### 1.1 Add `reviewAttempts` to State Type (Line 32-41)

**FIND:**
```typescript
type ResumeStoreState = {
	resume: Resume;
	isReady: boolean;
	summaryAIRoundsUsed: number;
	experienceAIRoundsUsed: Record<string, number>;
	projectAIRoundsUsed: Record<string, number>;
	isReviewing: boolean;
	reviewResult: FinalReviewResult | null;
	showReviewDrawer: boolean;
};
```

**REPLACE WITH:**
```typescript
type ResumeStoreState = {
	resume: Resume;
	isReady: boolean;
	summaryAIRoundsUsed: number;
	experienceAIRoundsUsed: Record<string, number>;
	projectAIRoundsUsed: Record<string, number>;
	isReviewing: boolean;
	reviewResult: FinalReviewResult | null;
	showReviewDrawer: boolean;
	reviewAttempts: number; // Track Final Review button clicks (max 2)
};
```

#### 1.2 Add `incrementReviewAttempts` to Actions Type (Line 43-58)

**FIND:**
```typescript
type ResumeStoreActions = {
	initialize: (resume: Resume | null) => void;
	updateResumeData: (fn: (draft: WritableDraft<ResumeData>) => void) => void;
	incrementSummaryRounds: () => void;
	resetSummaryRounds: () => void;
	incrementExperienceRounds: (id: string) => void;
	resetExperienceRounds: (id: string) => void;

	incrementProjectRounds: (id: string) => void;
	resetProjectRounds: (id: string) => void;

	setReviewing: (value: boolean) => void;
	setReviewResult: (result: FinalReviewResult | null) => void;
	setShowReviewDrawer: (show: boolean) => void;
};
```

**REPLACE WITH:**
```typescript
type ResumeStoreActions = {
	initialize: (resume: Resume | null) => void;
	updateResumeData: (fn: (draft: WritableDraft<ResumeData>) => void) => void;
	incrementSummaryRounds: () => void;
	resetSummaryRounds: () => void;
	incrementExperienceRounds: (id: string) => void;
	resetExperienceRounds: (id: string) => void;

	incrementProjectRounds: (id: string) => void;
	resetProjectRounds: (id: string) => void;

	setReviewing: (value: boolean) => void;
	setReviewResult: (result: FinalReviewResult | null) => void;
	setShowReviewDrawer: (show: boolean) => void;
	incrementReviewAttempts: () => void; // NEW ACTION
};
```

---

## Step 2: Add State Initialization

### File: `src/components/resume/store/resume.ts`

#### 2.1 Add `reviewAttempts: 0` to Initial State (Line 78-88)

**FIND:**
```typescript
		immer((set) => ({
			// --- STATE ---
			resume: null as unknown as Resume,
			isReady: false,
			summaryAIRoundsUsed: 0,
			experienceAIRoundsUsed: {},
			projectAIRoundsUsed: {},
			isReviewing: false,
			reviewResult: null,
			showReviewDrawer: false,

			// --- ACTIONS ---
```

**REPLACE WITH:**
```typescript
		immer((set) => ({
			// --- STATE ---
			resume: null as unknown as Resume,
			isReady: false,
			summaryAIRoundsUsed: 0,
			experienceAIRoundsUsed: {},
			projectAIRoundsUsed: {},
			isReviewing: false,
			reviewResult: null,
			showReviewDrawer: false,
			reviewAttempts: 0,

			// --- ACTIONS ---
```

---

## Step 3: Load Saved Attempts on Initialize

### File: `src/components/resume/store/resume.ts`

#### 3.1 Load Persisted Attempts (Line 116-130)

**FIND** (inside the `initialize` function after the review data loading):
```typescript
					// ✅ Load persisted review state for this specific resume
					if (typeof window !== "undefined") {
						const savedReviewData = localStorage.getItem(`resume-review-${resume.id}`);
						if (savedReviewData) {
							try {
								const parsed = JSON.parse(savedReviewData);
								state.reviewResult = parsed.reviewResult || null;
								state.showReviewDrawer = parsed.showReviewDrawer || false;
							} catch (e) {
								console.error("Failed to load saved review data:", e);
							}
						} else {
							// No saved data for this resume
							state.reviewResult = null;
							state.showReviewDrawer = false;
						}
					}
				});
			},
```

**REPLACE WITH:**
```typescript
					// ✅ Load persisted review state for this specific resume
					if (typeof window !== "undefined") {
						const savedReviewData = localStorage.getItem(`resume-review-${resume.id}`);
						if (savedReviewData) {
							try {
								const parsed = JSON.parse(savedReviewData);
								state.reviewResult = parsed.reviewResult || null;
								state.showReviewDrawer = parsed.showReviewDrawer || false;
							} catch (e) {
								console.error("Failed to load saved review data:", e);
							}
						} else {
							// No saved data for this resume
							state.reviewResult = null;
							state.showReviewDrawer = false;
						}

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
					}
				});
			},
```

---

## Step 4: Add incrementReviewAttempts Function

### File: `src/components/resume/store/resume.ts`

#### 4.1 Add Function After `setShowReviewDrawer` (Line 216-228)

**FIND** (at the end of the actions, after `setShowReviewDrawer`):
```typescript
			setShowReviewDrawer: (show) => {
				set((state) => {
					state.showReviewDrawer = show;
					// ✅ Persist drawer state per resume
					if (typeof window !== "undefined" && state.resume?.id) {
						const dataToSave = {
							reviewResult: state.reviewResult,
							showReviewDrawer: show,
						};
						localStorage.setItem(`resume-review-${state.resume.id}`, JSON.stringify(dataToSave));
					}
				});
			},
		})),
```

**REPLACE WITH:**
```typescript
			setShowReviewDrawer: (show) => {
				set((state) => {
					state.showReviewDrawer = show;
					// ✅ Persist drawer state per resume
					if (typeof window !== "undefined" && state.resume?.id) {
						const dataToSave = {
							reviewResult: state.reviewResult,
							showReviewDrawer: show,
						};
						localStorage.setItem(`resume-review-${state.resume.id}`, JSON.stringify(dataToSave));
					}
				});
			},

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
		})),
```

---

## Step 5: Update Final Review Button Logic

### File: `src/routes/builder/$resumeId/-components/top-tray.tsx`

#### 5.1 Add State Selectors (After line 52, before `const [reviewStartTime...]`)

**ADD:**
```typescript
	const reviewAttempts = useResumeStore((state) => state.reviewAttempts);
	const incrementReviewAttempts = useResumeStore((state) => state.incrementReviewAttempts);
```

#### 5.2 Wrap onFinalReview with Attempt Tracking (Replace the `onFinalReview` function around line 74)

**FIND:**
```typescript
	const onFinalReview = async () => {
		if (!resume || !isConfigured) {
			toast.error(t`AI is not configured. Please set VITE_AI_API_KEY and VITE_AI_MODEL in your .env file.`);
			return;
		}

		setReviewing(true);
```

**REPLACE WITH:**
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
```

#### 5.3 Update Final Review Button (Around line 230)

**FIND:**
```typescript
			{/* Final Review Button */}
			<Button
				size="sm"
				variant="outline"
				disabled={isPrinting || isReviewing}
				className={cn(
					"flex items-center justify-center gap-1.5 px-2 sm:h-9 sm:w-auto sm:gap-2 sm:px-3",
					"bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700",
					"border-0 shadow-sm transition-all duration-300",
					isReviewing && "scale-[0.98] brightness-90",
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
```

**REPLACE WITH:**
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

## Testing Checklist

### Test 1: First Click
1. Open a resume
2. Click "Final Review"
3. ✅ Review runs normally
4. ✅ Warning appears: "Now you can use this one time only"

### Test 2: Second Click
1. Click "Final Review" again
2. ✅ Review runs normally
3. ✅ Button becomes disabled
4. ✅ Message changes to: "No attempts left"

### Test 3: Third Click Attempt
1. Try clicking "Final Review"
2. ✅ Button is disabled (can't click)
3. ✅ Toast error: "You have used all your Final Review attempts"

### Test 4: Page Refresh
1. After using 1 attempt, refresh the page
2. ✅ Warning message still shows
3. ✅ Can still click once more
4. After using 2 attempts, refresh the page
5. ✅ Button is still disabled
6. ✅ "No attempts left" message shows

### Test 5: Different Resumes
1. Use both attempts on Resume A
2. Switch to Resume B
3. ✅ Resume B has 2 fresh attempts
4. Switch back to Resume A
5. ✅ Resume A is still limited (0 attempts left)

---

## Storage Structure

### localStorage Keys:
- `resume-review-attempts-{resumeId}` → Stores the number (0, 1, or 2)
- Example: `resume-review-attempts-abc123` → `2`

---

## Summary

### What Changes:
1. **After 0 clicks**: Button enabled, no message
2. **After 1 click**: Button enabled, red warning: "Now you can use this one time only"
3. **After 2 clicks**: Button disabled, red message: "No attempts left"

### Data Persistence:
- Each resume has its own attempt count
- Stored in `localStorage`
- Survives page refreshes
- Independent per resume

---

## Complete! 🎉

Follow these steps carefully and the 2-click limit will be fully functional with:
- ✅ Warning message after 1st click
- ✅ Disabled button after 2nd click
- ✅ Persistent state across refreshes
- ✅ Resume-specific tracking

