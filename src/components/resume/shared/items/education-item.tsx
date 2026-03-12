import { useEffect, useRef } from "react";
import { useResumeStore } from "@/components/resume/store/resume";
import type { SectionItem } from "@/schema/resume/data";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { PageLink } from "../page-link";

type EducationItemProps = SectionItem<"education"> & {
	className?: string;
};

export function EducationItem({ className, ...item }: EducationItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleSchoolChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.school) {
			updateResumeData((draft) => {
				const edu = draft.sections.education.items.find((e) => e.id === item.id);
				if (edu) edu.school = newValue;
			});
		}
	};

	const handleDegreeChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.degree) {
			updateResumeData((draft) => {
				const edu = draft.sections.education.items.find((e) => e.id === item.id);
				if (edu) edu.degree = newValue;
			});
		}
	};

	const handleAreaChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.area) {
			updateResumeData((draft) => {
				const edu = draft.sections.education.items.find((e) => e.id === item.id);
				if (edu) edu.area = newValue;
			});
		}
	};

	const handlePeriodChange = (e: React.FocusEvent<HTMLSpanElement>) => {
		const newValue = e.currentTarget.textContent || "";
		if (newValue !== item.period) {
			updateResumeData((draft) => {
				const edu = draft.sections.education.items.find((e) => e.id === item.id);
				if (edu) edu.period = newValue;
			});
		}
	};

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const edu = draft.sections.education.items.find((e) => e.id === item.id);
				if (edu) edu.description = newValue;
			});
		}
	};

	return (
		<div className={cn("education-item", className)}>
			{/* Header */}
			<div className="section-item-header education-item-header mb-2">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleSchoolChange}
						className="section-item-title education-item-title cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.school}
					</span>
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleDegreeChange}
						className="section-item-metadata education-item-degree-grade shrink-0 cursor-text text-end outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.degree}
					</span>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handleAreaChange}
						className="section-item-metadata education-item-area cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
					>
						{item.area}
					</span>
					<span
						contentEditable
						suppressContentEditableWarning
						onBlur={handlePeriodChange}
						className="section-item-metadata education-item-location-period shrink-0 cursor-text text-end outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500"
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
				onClick={handleContentEditableLinkClick}
				className={cn(
					"section-item-description education-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website education-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
