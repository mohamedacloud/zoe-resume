import { useState, useLayoutEffect, useMemo } from "react";
import { pageDimensionsAsPixels } from "@/schema/page";
import { getSectionComponent } from "../shared/get-section-component";
import { useResumeStore } from "../store/resume";

// Constants for measurement

type Props = {
	scale?: number;
	onMeasure: (measurements: Record<string, number>) => void;
};

export const ResumeMeasurer = ({ onMeasure }: Props) => {
	const metadata = useResumeStore((state) => state.resume.data.metadata);
	const sections = useResumeStore((state) => state.resume.data.sections);
	const customSections = useResumeStore((state) => state.resume.data.customSections);
	const [measurementRef, setMeasurementRef] = useState<HTMLDivElement | null>(null);

	// Collect all section IDs from layout
	const allSectionIds = useMemo(() => {
		const ids: string[] = [];
		for (const page of metadata.layout.pages) {
			ids.push(...page.main);
			ids.push(...page.sidebar);
		}
		// Remove duplicates in case of configuration errors
		return [...new Set(ids)];
	}, [metadata.layout.pages]);

	// We render all sections in a single continuous column to measure them
	// We need to render them with the correct width context (Main vs Sidebar)
	// But to simplify, we can just render them in a hidden container that mimics the page width
	// For accurate item height, we need to respect columns count too.

	// Actually, we need to measure items individually.
	// So we will render every active section, and every active item within it.

	// We use useLayoutEffect to measure immediately after render
	useLayoutEffect(() => {
		if (!measurementRef) return;

		const measurements: Record<string, number> = {};

		// Measure Section Headers and Margins
		const sectionNodes = measurementRef.querySelectorAll("[data-section-id]");
		sectionNodes.forEach((node) => {
			const id = node.getAttribute("data-section-id");
			if (id) {
				const rect = node.getBoundingClientRect();
				measurements[id] = rect.height;
			}
		});

		// Measure Individual Items
		const itemNodes = measurementRef.querySelectorAll("[data-item-id]");
		itemNodes.forEach((node) => {
			const id = node.getAttribute("data-item-id");
			if (id) {
				const rect = node.getBoundingClientRect();
				measurements[id] = rect.height;
			}
		});

		console.log("Measurements:", measurements);
		onMeasure(measurements);
	}, [measurementRef, onMeasure, metadata, sections, customSections]); // Re-measure when data changes

	return (
		<div
			ref={setMeasurementRef}
			className="resume-measurer absolute top-0 left-0 -z-50 opacity-0 pointer-events-none"
			style={{
				width: pageDimensionsAsPixels[metadata.page.format].width, // Use full page width
				// We might need to handle main/sidebar widths effectively if we want 100% precision
				// For MVP, assuming items flow naturally is a good start, but wrapping might differ.
				// Ideally we render this inside the preview container so it inherits styles.
			}}
		>
			<style>{`
        .resume-measurer .page-section {
          margin-bottom: var(--page-gap-y);
        }
      `}</style>
			{allSectionIds.map((sectionId) => (
				<MeasurableSection key={sectionId} sectionId={sectionId} />
			))}
		</div>
	);
};

const MeasurableSection = ({ sectionId }: { sectionId: string }) => {
	const Component = useMemo(() => getSectionComponent(sectionId), [sectionId]);

	// We need to render the section such that we can measure:
	// 1. The section header height (if any)
	// 2. The individual item heights
	// But `getSectionComponent` returns a component that renders the whole section.
	// We can't easily inject "data-item-id" into the standard `PageSection` without modifying it again.
	// HACK: We rendered `PageSection` with `visibleItemIds`.
	// If we render the section normally, `PageSection` renders children.
	// The `children` prop in `PageSection` is a function `(item) => ReactNode`.
	// We can't easily hook into that from here without modifying `getSectionComponent` again or `PageSection`.
	
	// Wait, we modified `PageSection` to accept `filter`.
	// But `PageSection` uses a `map` to render items.
	// The `children` is passed from `getSectionComponent`.
	
	// To measure individual items, we need `PageSection` to attach a ref or attribute to the item container.
	// In `PageSection.tsx`:
	// <div key={item.id} className={...}> {children(item)} </div>
	// We can add `data-item-id={item.id}` to that div.
	
	return (
		<div data-section-id={sectionId}>
			<Component id={sectionId} />
		</div>
	);
};
