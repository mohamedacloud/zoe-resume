import { useEffect, useRef } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import type { SectionItem } from "@/schema/resume/data";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { LinkedTitle } from "../linked-title";
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

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const project = draft.sections.projects.items.find((p) => p.id === item.id);
				if (project) project.description = newValue;
			});
		}
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
			<div
				ref={descriptionRef}
				contentEditable
				suppressContentEditableWarning
				onBlur={handleDescriptionChange}
				className={cn(
					"section-item-description projects-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website projects-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
