import { useEffect, useRef } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import type { SectionItem } from "@/schema/resume/data";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type ProjectsItemProps = SectionItem<"projects"> & {
	className?: string;
};

export function ProjectsItem({ className, ...item }: ProjectsItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleNameChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.name) {
			updateResumeData((draft) => {
				const project = draft.sections.projects.items.find((p) => p.id === item.id);
				if (project) project.name = newValue;
			});
		}
	};

	const handlePeriodChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.period) {
			updateResumeData((draft) => {
				const project = draft.sections.projects.items.find((p) => p.id === item.id);
				if (project) project.period = newValue;
			});
		}
	};

	const renderDescription = () => {
		if (!item.description) return null;

		const text = item.description;

		// Case 1: If it looks like HTML (contains <p>, <ul>, <li>, <strong>, or <b>), render it as HTML
		if (
			text.includes("<p>") ||
			text.includes("<ul>") ||
			text.includes("<li>") ||
			text.includes("<strong>") ||
			text.includes("<b>")
		) {
			return (
				<div
					className="section-item-description"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: This content is managed by Tiptap and sanitized before display
					dangerouslySetInnerHTML={{ __html: text }}
				/>
			);
		}

		// Case 2: Check for bullet point markers in plain text (fallback)
		const lines = text.split("\n").filter((line) => line.trim() !== "");
		const hasBulletMarkers = lines.some((line) => line.trim().match(/^[*\-•]\s+/));

		if (hasBulletMarkers) {
			const listItems = lines.map((line) => line.replace(/^[*\-•]\s+/, "").trim());

			return (
				<ul className="list-disc pl-5">
					{listItems.map((item, index) => (
						<li key={index}>{item}</li>
					))}
				</ul>
			);
		}

		// Case 3: Plain text with line breaks
		return (
			<div className="section-item-description whitespace-pre-wrap">
				{lines.map((paragraph, index) => (
					<p key={index} className="mb-2 last:mb-0">
						{paragraph}
					</p>
				))}
			</div>
		);
	};

	return (
		<div className={cn("projects-item", className)}>
			{/* Header */}
			<div className="section-item-header projects-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleNameChange}
						className="section-item-title projects-item-title cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.name}
					</span>
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handlePeriodChange}
						className="section-item-metadata projects-item-period shrink-0 cursor-text text-end outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.period}
					</span>
				</div>
			</div>

			{/* Description */}
			{renderDescription()}

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website projects-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
