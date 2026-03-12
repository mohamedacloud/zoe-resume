import { useEffect, useRef } from "react";
import type { SectionItem } from "@/schema/resume/data";
import { handleContentEditableLinkClick } from "@/utils/resume/event";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageLink } from "../page-link";

type VolunteerItemProps = SectionItem<"volunteer"> & {
	className?: string;
};

export function VolunteerItem({ className, ...item }: VolunteerItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleOrganizationChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.volunteer.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.organization = value;
		});
	};

	const handlePeriodChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.volunteer.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.period = value;
		});
	};

	const handleLocationChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.volunteer.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.location = value;
		});
	};

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const sectionItem = draft.sections.volunteer.items.find((i) => i.id === item.id);
				if (sectionItem) sectionItem.description = newValue;
			});
		}
	};

	return (
		<div className={cn("volunteer-item", className)}>
			{/* Header */}
			<div className="section-item-header volunteer-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<strong className="section-item-title volunteer-item-title">
						<InlineEditableText
							value={item.organization}
							placeholder="Organization"
							onChange={handleOrganizationChange}
						/>
					</strong>
					<span className="section-item-metadata volunteer-item-period shrink-0 text-end">
						<InlineEditableText value={item.period} placeholder="Period" onChange={handlePeriodChange} />
					</span>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span className="section-item-metadata volunteer-item-location">
						<InlineEditableText value={item.location} placeholder="Location" onChange={handleLocationChange} />
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
					"section-item-description volunteer-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website volunteer-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
