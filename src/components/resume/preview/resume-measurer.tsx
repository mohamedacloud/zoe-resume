import { useState, useLayoutEffect, useMemo } from "react";
import { match } from "ts-pattern";
import { pageDimensionsAsPixels } from "@/schema/page";
import type { Template } from "@/schema/templates";
import { getSectionComponent } from "../shared/get-section-component";
import { useResumeStore } from "../store/resume";
import { AzurillTemplate } from "../templates/azurill";
import { BronzorTemplate } from "../templates/bronzor";
import { ChikoritaTemplate } from "../templates/chikorita";
import { DitgarTemplate } from "../templates/ditgar";
import { DittoTemplate } from "../templates/ditto";
import { GengarTemplate } from "../templates/gengar";
import { GlalieTemplate } from "../templates/glalie";
import { KakunaTemplate } from "../templates/kakuna";
import { LaprasTemplate } from "../templates/lapras";
import { LeafishTemplate } from "../templates/leafish";
import { OnyxTemplate } from "../templates/onyx";
import { PikachuTemplate } from "../templates/pikachu";
import { RhyhornTemplate } from "../templates/rhyhorn";

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
			}}
		>
			<style>{`
        .resume-measurer .page-section {
          margin-bottom: var(--page-gap-y);
        }
      `}</style>
			{/* Measure the Header */}
			<div data-section-id="header">
				<TemplateHeader />
			</div>

			{/* Measure all Sections */}
			{allSectionIds.map((sectionId) => (
				<MeasurableSection key={sectionId} sectionId={sectionId} />
			))}
		</div>
	);
};

const TemplateHeader = () => {
	const metadata = useResumeStore((state) => state.resume.data.metadata);
	const TemplateComponent = useMemo(() => getTemplateComponent(metadata.template), [metadata.template]);

	// We only need to render the Header part of the template.
	// Since templates usually render Header if pageIndex === 0, we can use that.
	return (
		<div className="page" style={{ height: "auto", minHeight: "0" }}>
			<TemplateComponent pageIndex={0} pageLayout={{ fullWidth: true, main: [], sidebar: [] }} />
		</div>
	);
};

function getTemplateComponent(template: Template) {
	return match(template)
		.with("azurill", () => AzurillTemplate)
		.with("bronzor", () => BronzorTemplate)
		.with("chikorita", () => ChikoritaTemplate)
		.with("ditto", () => DittoTemplate)
		.with("ditgar", () => DitgarTemplate)
		.with("gengar", () => GengarTemplate)
		.with("glalie", () => GlalieTemplate)
		.with("kakuna", () => KakunaTemplate)
		.with("lapras", () => LaprasTemplate)
		.with("leafish", () => LeafishTemplate)
		.with("onyx", () => OnyxTemplate)
		.with("pikachu", () => PikachuTemplate)
		.with("rhyhorn", () => RhyhornTemplate)
		.exhaustive();
}

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
