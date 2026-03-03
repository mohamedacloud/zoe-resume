import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useResumeStore } from "@/components/resume/store/resume";
import { useIsMobile } from "./use-mobile";

/**
 * Hook to manage the review workflow
 * Handles scrolling to sections, highlighting, and managing review state
 */
export function useReviewWorkflow() {
	const setShowReviewDrawer = useResumeStore((state) => state.setShowReviewDrawer);
	const isMobile = useIsMobile();

	/**
	 * Highlight a section temporarily
	 * @param sectionKey - The section identifier
	 */
	const highlightSection = useCallback((sectionKey: string) => {
		const sectionElement = document.getElementById(`sidebar-${sectionKey}`);
		if (!sectionElement) {
			console.warn(`❌ Section element not found: sidebar-${sectionKey}`);
			toast.error("Section not found", {
				description: `The section "${sectionKey}" could not be highlighted.`,
			});
			return;
		}

		console.log(`✅ Highlighting section: ${sectionKey}`, sectionElement);

		// Remove any existing highlight first
		sectionElement.classList.remove("review-highlight");
		
		// Force reflow to restart animation
		void sectionElement.offsetWidth;

		// Add highlight class
		sectionElement.classList.add("review-highlight");
		
		console.log(`🎨 Highlight applied! Look at the LEFT sidebar for an orange border around "${sectionKey}"`);

		// Remove highlight after 2 seconds
		setTimeout(() => {
			sectionElement.classList.remove("review-highlight");
			console.log(`✨ Highlight removed from "${sectionKey}"`);
		}, 2000);
	}, []);

	/**
	 * Scroll to a section in the left sidebar
	 * @param sectionKey - The section identifier (e.g., "contact.phone", "summary", "experience[0]")
	 */
	const scrollToSection = useCallback((sectionKey: string) => {
		try {
			console.log(`📍 Attempting to scroll to section: ${sectionKey}`);
			
			// Parse the section key to extract the section type
			const sectionType = parseSectionKey(sectionKey);
			if (!sectionType) {
				console.warn(`❌ Could not parse section key: ${sectionKey}`);
				toast.error("Section not found", {
					description: `Unable to locate section: ${sectionKey}`,
				});
				return;
			}

			console.log(`✅ Parsed section type: ${sectionType}`);

			// Find the section element in the sidebar
			const sectionElement = document.getElementById(`sidebar-${sectionType}`);
			if (!sectionElement) {
				console.warn(`❌ Section element not found: sidebar-${sectionType}`);
				toast.error("Section not found", {
					description: `Unable to locate section: ${sectionType}`,
				});
				return;
			}

			console.log(`✅ Found section element:`, sectionElement);

			// Expand the section if it's collapsed (Accordion)
			// Find the accordion trigger button and click it if the section is collapsed
			const accordionItem = sectionElement.querySelector('[data-state="closed"]');
			if (accordionItem) {
				const trigger = sectionElement.querySelector('button[role="button"]');
				if (trigger instanceof HTMLElement) {
					trigger.click();
					// Wait a bit for the accordion to expand before scrolling
					setTimeout(() => {
						performScrollAndHighlight(sectionElement, sectionType);
					}, 100);
					return;
				}
			}

			// If already expanded, scroll immediately
			performScrollAndHighlight(sectionElement, sectionType);

		} catch (error) {
			console.error("Error scrolling to section:", error);
			toast.error("Unable to navigate to section");
		}

		function performScrollAndHighlight(element: HTMLElement, sectionType: string) {
			// Scroll to the section smoothly
			element.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			// Highlight the section after a short delay to ensure scroll has started
			setTimeout(() => {
				highlightSection(sectionType);
			}, 150);

			// Close drawer on mobile
			if (isMobile) {
				setTimeout(() => {
					setShowReviewDrawer(false);
				}, 300);
			}
		}
	}, [isMobile, setShowReviewDrawer, highlightSection]);

	return {
		scrollToSection,
		highlightSection,
	};
}

/**
 * Parse section key to extract the section type
 * Examples:
 * - "contact.phone" -> "basics"
 * - "summary" -> "summary"
 * - "experience[0]" -> "experience"
 * - "education[1]" -> "education"
 */
function parseSectionKey(sectionKey: string): string | null {
	// Handle contact fields (they're part of basics)
	if (sectionKey.startsWith("contact.")) {
		return "basics";
	}

	// Handle array indices (e.g., "experience[0]")
	const arrayMatch = sectionKey.match(/^([a-z]+)\[\d+\]/);
	if (arrayMatch) {
		return arrayMatch[1];
	}

	// Handle direct section names
	const validSections = [
		"basics",
		"summary",
		"experience",
		"education",
		"projects",
		"skills",
		"languages",
		"interests",
		"awards",
		"certifications",
		"publications",
		"volunteer",
		"references",
		"custom",
	];

	if (validSections.includes(sectionKey)) {
		return sectionKey;
	}

	return null;
}

/**
 * Hook to track resume data changes and mark review as outdated
 */
export function useReviewOutdatedTracker() {
	const resume = useResumeStore((state) => state.resume);
	const reviewResult = useResumeStore((state) => state.reviewResult);
	const setReviewOutdated = useResumeStore((state) => state.setReviewOutdated);
	const previousResumeRef = useRef(resume?.data);

	useEffect(() => {
		// Only track changes if we have a review result
		if (!reviewResult || !resume) return;

		// Check if resume data has changed
		if (previousResumeRef.current !== resume.data) {
			setReviewOutdated(true);
			previousResumeRef.current = resume.data;
		}
	}, [resume, reviewResult, setReviewOutdated]);
}
