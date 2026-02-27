import { useLayoutEffect, useMemo, useState } from "react";
import { match } from "ts-pattern";
import { pageDimensionsAsPixels } from "@/schema/page";
import type { Template } from "@/schema/templates";
import { Section } from "../shared/get-section-component";
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
			className="resume-measurer pointer-events-none absolute top-0 left-0 -z-50 opacity-0"
			style={{
				width: pageDimensionsAsPixels[metadata.page.format].width, // Use full page width
				height: 0,
				overflow: "hidden",
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
	return (
		<div data-section-id={sectionId}>
			<Section type={sectionId} id={sectionId} />
		</div>
	);
};
