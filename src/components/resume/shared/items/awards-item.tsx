import { useEffect, useRef } from "react";
import type { SectionItem } from "@/schema/resume/data";
import { stripHtml } from "@/utils/string";
import { cn } from "@/utils/style";
import { useResumeStore } from "../../store/resume";
import { InlineEditableText } from "../inline-editable-text";
import { PageLink } from "../page-link";

type AwardsItemProps = SectionItem<"awards"> & {
	className?: string;
};

export function AwardsItem({ className, ...item }: AwardsItemProps) {
	const updateResumeData = useResumeStore((state) => state.updateResumeData);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (descriptionRef.current && descriptionRef.current.innerHTML !== item.description) {
			descriptionRef.current.innerHTML = item.description;
		}
	}, [item.description]);

	const handleTitleChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.awards.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.title = value;
		});
	};

	const handleDateChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.awards.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.date = value;
		});
	};

	const handleAwarderChange = (value: string) => {
		updateResumeData((draft) => {
			const sectionItem = draft.sections.awards.items.find((i) => i.id === item.id);
			if (sectionItem) sectionItem.awarder = value;
		});
	};

	const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
		const newValue = e.currentTarget.innerHTML || "";
		if (newValue !== item.description) {
			updateResumeData((draft) => {
				const sectionItem = draft.sections.awards.items.find((i) => i.id === item.id);
				if (sectionItem) sectionItem.description = newValue;
			});
		}
	};

	return (
		<div className={cn("awards-item", className)}>
			{/* Header */}
			<div className="section-item-header awards-item-header">
				{/* Row 1 */}
				<div className="flex items-start justify-between gap-x-2">
					<strong className="section-item-title awards-item-title">
						<InlineEditableText value={item.title} placeholder="Award Title" onChange={handleTitleChange} />
					</strong>
					<span className="section-item-metadata awards-item-date shrink-0 text-end">
						<InlineEditableText value={item.date} placeholder="Date" onChange={handleDateChange} />
					</span>
				</div>

				{/* Row 2 */}
				<div className="flex items-start justify-between gap-x-2">
					<span className="section-item-metadata awards-item-awarder">
						<InlineEditableText value={item.awarder} placeholder="Awarder" onChange={handleAwarderChange} />
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
					"section-item-description awards-item-description cursor-text outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					!stripHtml(item.description) && "hidden",
				)}
			/>

			{/* Website */}
			{!item.options?.showLinkInTitle && (
				<div className="section-item-website awards-item-website">
					<PageLink {...item.website} label={item.website.label} />
				</div>
			)}
		</div>
	);
}
