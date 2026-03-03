import { t } from "@lingui/core/macro";
import { debounce } from "es-toolkit";
import isDeepEqual from "fast-deep-equal";
import type { WritableDraft } from "immer";
import { current } from "immer";
import { toast } from "sonner";
import type { TemporalState } from "zundo";
import { temporal } from "zundo";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { create } from "zustand/react";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import type { ResumeData } from "@/schema/resume/data";

type Resume = Pick<RouterOutput["resume"]["getByIdForPrinter"], "id" | "name" | "slug" | "tags" | "data" | "isLocked">;

export type FinalReviewResult = {
	overall_score: number;
	critical: string[];
	important: string[];
	suggestions: string[];
	strengths: string[];
	detailed_checks: {
		photo_verdict: string;
		link_status: string;
		grammar_tense: string;
	};
	final_verdict: "READY" | "NEEDS_MINOR_FIXES" | "NEEDS_MAJOR_WORK";
};

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

type ResumeStore = ResumeStoreState & ResumeStoreActions;

const controller = new AbortController();
const signal = controller.signal;

const _syncResume = (resume: Resume) => {
	orpc.resume.update.call({ id: resume.id, data: resume.data }, { signal });
};

const syncResume = debounce(_syncResume, 500, { signal });

let errorToastId: string | number | undefined;

type PartializedState = { resume: Resume | null };

export const useResumeStore = create<ResumeStore>()(
	temporal(
		persist(
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
				initialize: (resume) => {
					set((state) => {
						if (!resume) {
							state.resume = null as unknown as Resume;
							state.isReady = false;
							return;
						}

						const isDifferentResume = state.resume && state.resume.id !== resume.id;

						state.resume = resume as Resume;
						state.isReady = true;

						// ✅ Only reset if switching to a completely different resume
						if (isDifferentResume) {
							state.summaryAIRoundsUsed = 0;
							state.experienceAIRoundsUsed = {};
							state.projectAIRoundsUsed = {};
						}
					});
				},
				updateResumeData: (fn) => {
					set((state) => {
						if (!state.resume) return;

						if (state.resume.isLocked) {
							errorToastId = toast.error(t`This resume is locked and cannot be updated.`, { id: errorToastId });
							return;
						}

						fn(state.resume.data);
						syncResume(current(state.resume));
					});
				},

				incrementSummaryRounds: () => {
					set((state) => {
						if (state.summaryAIRoundsUsed < 2) {
							state.summaryAIRoundsUsed += 1;
						}
					});
				},

				resetSummaryRounds: () => {
					set((state) => {
						state.summaryAIRoundsUsed = 0;
					});
				},

				incrementExperienceRounds: (id) => {
					set((state) => {
						const current = state.experienceAIRoundsUsed[id] ?? 0;
						if (current < 2) {
							state.experienceAIRoundsUsed[id] = current + 1;
						}
					});
				},

				resetExperienceRounds: (id) => {
					set((state) => {
						state.experienceAIRoundsUsed[id] = 0;
					});
				},

				incrementProjectRounds: (id) => {
					set((state) => {
						const current = state.projectAIRoundsUsed[id] ?? 0;
						if (current < 2) {
							state.projectAIRoundsUsed[id] = current + 1;
						}
					});
				},

				resetProjectRounds: (id) => {
					set((state) => {
						state.projectAIRoundsUsed[id] = 0;
					});
				},

				setReviewing: (value) => {
					set((state) => {
						state.isReviewing = value;
					});
				},

				setReviewResult: (result) => {
					set((state) => {
						state.reviewResult = result;
					});
				},

				setShowReviewDrawer: (show) => {
					set((state) => {
						state.showReviewDrawer = show;
					});
				},
			})),
			{
				name: "resume-store", // ✅ belongs to persist
				partialize: (state) => ({
					resume: state.resume,
					summaryAIRoundsUsed: state.summaryAIRoundsUsed,
					experienceAIRoundsUsed: state.experienceAIRoundsUsed,
					projectAIRoundsUsed: state.projectAIRoundsUsed,
				}),
			},
		),
		{
			limit: 100, // ✅ belongs to temporal
			equality: (pastState, currentState) => isDeepEqual(pastState, currentState),
		},
	),
);

export function useTemporalStore<T>(selector: (state: TemporalState<PartializedState>) => T): T {
	return useStoreWithEqualityFn(useResumeStore.temporal, selector);
}
