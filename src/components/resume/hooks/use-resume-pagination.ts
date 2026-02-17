import { useMemo } from "react";
import { pageDimensionsAsPixels } from "@/schema/page";
import type { PageLayout } from "@/schema/resume/data";
import { useResumeStore } from "../store/resume";

export type PaginatedLayout = {
	pages: PageLayout[];
	itemDistribution: Record<string, string[][]>; // sectionId -> pageIndex -> itemIds
	isOverflowing: boolean;
};

export const useResumePagination = (
	measurements: Record<string, number>,
	containerHeight: number,
): PaginatedLayout => {
	const metadata = useResumeStore((state) => state.resume.data.metadata);
	const sections = useResumeStore((state) => state.resume.data.sections);
	const customSections = useResumeStore((state) => state.resume.data.customSections);

	// Get dimensions
	const pageHeight = pageDimensionsAsPixels[metadata.page.format].height;
	const marginY = metadata.page.marginY;
	const gapY = metadata.page.gapY;
	const contentHeight = pageHeight - marginY * 2;

	return useMemo(() => {
		// If no measurements yet, return original layout
		if (Object.keys(measurements).length === 0) {
			return {
				pages: metadata.layout.pages,
				itemDistribution: {},
				isOverflowing: false,
			};
		}

		const pages: PageLayout[] = [];
		const MAX_PAGES = 2;
		const itemDistribution: Record<string, string[][]> = {};
		let isOverflowing = false;

		// Initialize distribution map
		const allSectionIds = [
			...metadata.layout.pages.flatMap((p) => p.main),
			...metadata.layout.pages.flatMap((p) => p.sidebar),
		];
		for (const id of allSectionIds) {
			itemDistribution[id] = Array(MAX_PAGES).fill([]);
		}

		// Helper to get items for a section
		const getSectionItems = (sectionId: string) => {
			if (sectionId in sections) {
				// @ts-ignore
				return sections[sectionId].items.filter((i) => !i.hidden);
			}
			const custom = customSections.find((s) => s.id === sectionId);
			if (custom) {
				return custom.items.filter((i) => !i.hidden);
			}
			return [];
		};


		const fillColumn = (
			columnSections: string[],
			pageIndexStart: number,
			initialHeight: number,
			columnName: "main" | "sidebar",
		) => {
			let currentPageIndex = pageIndexStart;
			let currentHeight = initialHeight;

			for (const sectionId of columnSections) {
				if (currentPageIndex >= MAX_PAGES) {
					isOverflowing = true;
					break;
				}

				// Ensure page exists
				if (!pages[currentPageIndex]) {
					pages[currentPageIndex] = {
						fullWidth: metadata.layout.pages[0]?.fullWidth ?? false,
						main: [],
						sidebar: [],
					};
				}

				const items = getSectionItems(sectionId);
				if (items.length === 0) continue;

				const itemIds = items.map((i) => i.id);
				const itemHeights = itemIds.map((id) => measurements[id] || 50);
				const totalMeasuredHeight = measurements[sectionId] || 0;
				const totalItemHeight = itemHeights.reduce((a, b) => a + b, 0);
				// Estimate header height
				const headerHeight = Math.max(0, totalMeasuredHeight - totalItemHeight);

				// Does header fit?
				if (currentHeight + headerHeight > contentHeight) {
					// Header doesn't fit, move to next page
					currentPageIndex++;
					currentHeight = 0;
					if (currentPageIndex >= MAX_PAGES) {
						isOverflowing = true;
						break;
					}
				}

				// Add section to page
				if (!pages[currentPageIndex][columnName].includes(sectionId)) {
					pages[currentPageIndex][columnName].push(sectionId);
				}
				currentHeight += headerHeight;

				// Fit items
				for (let i = 0; i < items.length; i++) {
					const itemId = items[i].id;
					const itemHeight = measurements[itemId] || 50;

					if (currentHeight + itemHeight <= contentHeight) {
						// Item fits
						const currentDist = itemDistribution[sectionId][currentPageIndex] || [];
						itemDistribution[sectionId][currentPageIndex] = [...currentDist, itemId];
						currentHeight += itemHeight + gapY;
					} else {
						// Item doesn't fit, move to next page
						currentPageIndex++;
						currentHeight = 0;

						if (currentPageIndex >= MAX_PAGES) {
							isOverflowing = true;
							break;
						}

						// Ensure new page exists
						if (!pages[currentPageIndex]) {
							pages[currentPageIndex] = {
								fullWidth: metadata.layout.pages[0]?.fullWidth ?? false,
								main: [],
								sidebar: [],
							};
						}

						// Add section to new page if not already there
						if (!pages[currentPageIndex][columnName].includes(sectionId)) {
							pages[currentPageIndex][columnName].push(sectionId);
						}
						
						// Add header height again for new page? 
						// Usually sections split across pages don't repeat headers in this design, 
						// they just continue. 
						// But if we wanted to repeat header we would add headerHeight here.
						// For now, let's assume NO repeated header.

						const currentDist = itemDistribution[sectionId][currentPageIndex] || [];
						itemDistribution[sectionId][currentPageIndex] = [...currentDist, itemId];
						currentHeight += itemHeight + gapY;
					}
				}
				
				// Add section gap after section is done (only on the page it ended)
				if (currentPageIndex < MAX_PAGES) {
					 currentHeight += gapY;
				}
			}
		};

		// Extract sections intended for Main and Sidebar
		// We use the first page of metadata as the "template" for which sections go where,
		// but we flatten all pages to get the full list of sections.
		// Actually, simpler: just take all unique sections from metadata and put them in 
		// the column they first appear in.
		
		const mainSections = new Set<string>();
		const sidebarSections = new Set<string>();
		
		metadata.layout.pages.forEach(p => {
			p.main.forEach(s => mainSections.add(s));
			p.sidebar.forEach(s => sidebarSections.add(s));
		});

		fillColumn(Array.from(mainSections), 0, 0, "main");
		if (!metadata.layout.pages[0]?.fullWidth) {
			fillColumn(Array.from(sidebarSections), 0, 0, "sidebar");
		}

		return {
			pages,
			itemDistribution,
			isOverflowing,
		};
	}, [metadata, measurements, contentHeight]);
};
